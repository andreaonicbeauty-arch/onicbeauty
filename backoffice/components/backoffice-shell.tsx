"use client";

import { useMemo, useState } from "react";
import { clients as initialClients, scheduleLetters, treatments as initialTreatments, type Client, type Treatment } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";

type ClientTab = "resumen" | "historial" | "proximas" | "nueva";
type MainView = "agenda" | "clientes" | "tratamientos" | "ideas";

export function BackofficeShell() {
  const [mainView, setMainView] = useState<MainView>("agenda");
  const [query, setQuery] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(initialClients[0]);
  const [clientTab, setClientTab] = useState<ClientTab>("resumen");
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);

  const filteredClients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return initialClients;
    return initialClients.filter((client) => {
      return [client.name, client.phone, client.email].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [query]);

  const updatePrice = (id: string, value: string) => {
    const price = Number(value);
    setTreatments((current) =>
      current.map((treatment) => (treatment.id === id ? { ...treatment, price: Number.isNaN(price) ? 0 : price } : treatment))
    );
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">ONIC Beauty</p>
          <h1>Backoffice</h1>
        </div>
        <div className="status-pill">{isSupabaseConfigured ? "Supabase conectado" : "Modo demo"}</div>
      </header>

      <nav className="mobile-tabs" aria-label="Vistas del backoffice">
        <button className={mainView === "agenda" ? "active" : ""} onClick={() => setMainView("agenda")}>Agenda</button>
        <button className={mainView === "clientes" ? "active" : ""} onClick={() => setMainView("clientes")}>Clientes</button>
        <button className={mainView === "tratamientos" ? "active" : ""} onClick={() => setMainView("tratamientos")}>Tratamientos</button>
        <button className={mainView === "ideas" ? "active" : ""} onClick={() => setMainView("ideas")}>Ideas</button>
      </nav>

      {mainView === "agenda" && (
        <section className="panel agenda-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Hoy</p>
              <h2>Agenda visual</h2>
            </div>
            <button className="soft-button" onClick={() => setIsClientModalOpen(true)}>Buscar cliente</button>
          </div>

          <div className="agenda-lines">
            {scheduleLetters.map((letter, index) => (
              <button
                className="agenda-line"
                key={letter}
                onClick={() => {
                  setIsClientModalOpen(true);
                  setQuery("");
                }}
              >
                <span>
                  <strong>{["11:00", "13:00", "16:00", "18:00"][index]}</strong>
                  <small>{["Facial / disponible", "Lash Lift / Claudia", "Cejas / Maria", "Revision / libre"][index]}</small>
                </span>
                <b>{letter}</b>
              </button>
            ))}
          </div>
        </section>
      )}

      {mainView === "clientes" && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">CRM ligero</p>
              <h2>Clientes</h2>
            </div>
            <button className="soft-button" onClick={() => setIsClientModalOpen(true)}>Abrir buscador</button>
          </div>
          <ClientTable clients={filteredClients} onSelect={(client) => setSelectedClient(client)} />
        </section>
      )}

      {mainView === "tratamientos" && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Servicios</p>
              <h2>Tratamientos y precios</h2>
            </div>
            <button className="soft-button">Nuevo tratamiento</button>
          </div>
          <div className="treatment-list">
            {treatments.map((treatment) => (
              <article className="treatment-row" key={treatment.id}>
                <div>
                  <strong>{treatment.name}</strong>
                  <span>{treatment.category} / {treatment.duration}</span>
                </div>
                <label>
                  <span>EUR</span>
                  <input value={treatment.price} onChange={(event) => updatePrice(treatment.id, event.target.value)} inputMode="decimal" />
                </label>
              </article>
            ))}
          </div>
        </section>
      )}

      {mainView === "ideas" && (
        <section className="panel ideas-panel">
          <p className="eyebrow">Siguientes mejoras</p>
          <h2>Ideas utiles para el backoffice</h2>
          <div className="idea-grid">
            <article><strong>Recordatorios WhatsApp</strong><span>Enviar mensaje de confirmacion antes de cada cita.</span></article>
            <article><strong>Ficha cosmetica</strong><span>Alergias, piel sensible, productos usados y contraindicaciones.</span></article>
            <article><strong>Antes / despues</strong><span>Guardar fotos privadas por cliente y tratamiento.</span></article>
            <article><strong>Dashboard</strong><span>Ingresos por semana, tratamientos mas vendidos y huecos libres.</span></article>
          </div>
        </section>
      )}

      {selectedClient && (
        <section className="panel client-detail">
          <div className="client-hero">
            <span className="avatar">{selectedClient.initials}</span>
            <div>
              <p className="eyebrow">Ficha cliente</p>
              <h2>{selectedClient.name}</h2>
              <p>{selectedClient.phone}</p>
            </div>
          </div>

          <div className="detail-tabs">
            {(["resumen", "historial", "proximas", "nueva"] as ClientTab[]).map((tab) => (
              <button className={clientTab === tab ? "active" : ""} key={tab} onClick={() => setClientTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {clientTab === "resumen" && (
            <div className="detail-card">
              <strong>Notas</strong>
              <p>{selectedClient.notes}</p>
              <span>Ultima visita: {selectedClient.lastVisit}</span>
            </div>
          )}

          {clientTab === "historial" && (
            <div className="timeline">
              {selectedClient.history.map((visit) => (
                <article key={`${visit.date}-${visit.treatment}`}>
                  <span>{visit.date}</span>
                  <strong>{visit.treatment}</strong>
                  <p>{visit.result}</p>
                </article>
              ))}
            </div>
          )}

          {clientTab === "proximas" && (
            <div className="detail-card">
              <strong>Proxima cita</strong>
              <p>{selectedClient.nextVisit}</p>
            </div>
          )}

          {clientTab === "nueva" && (
            <form className="appointment-form">
              <label>Fecha <input type="date" /></label>
              <label>Hora <input type="time" /></label>
              <label>Tratamiento <select>{treatments.map((treatment) => <option key={treatment.id}>{treatment.name}</option>)}</select></label>
              <button type="button">Crear cita</button>
            </form>
          )}
        </section>
      )}

      {isClientModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Buscar cliente">
          <section className="client-modal">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Buscar</p>
                <h2>Clientes</h2>
              </div>
              <button className="icon-button" onClick={() => setIsClientModalOpen(false)}>×</button>
            </div>
            <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, telefono o email" autoFocus />
            <ClientTable
              clients={filteredClients}
              onSelect={(client) => {
                setSelectedClient(client);
                setClientTab("resumen");
                setIsClientModalOpen(false);
              }}
            />
          </section>
        </div>
      )}
    </main>
  );
}

function ClientTable({ clients, onSelect }: { clients: Client[]; onSelect: (client: Client) => void }) {
  return (
    <div className="client-table">
      {clients.map((client) => (
        <button key={client.id} onClick={() => onSelect(client)}>
          <span className="mini-avatar">{client.initials}</span>
          <span>
            <strong>{client.name}</strong>
            <small>{client.phone}</small>
          </span>
          <em>{client.nextVisit}</em>
        </button>
      ))}
    </div>
  );
}
