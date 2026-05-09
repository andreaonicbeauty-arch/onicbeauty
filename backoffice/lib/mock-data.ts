export type Client = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  lastVisit: string;
  nextVisit: string;
  notes: string;
  history: Array<{
    date: string;
    treatment: string;
    result: string;
  }>;
};

export type Treatment = {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  active: boolean;
};

export const clients: Client[] = [
  {
    id: "c-001",
    name: "Maria Lopez",
    initials: "ML",
    phone: "+34 611 000 221",
    email: "maria@example.com",
    lastVisit: "2026-05-02",
    nextVisit: "2026-05-16 11:30",
    notes: "Prefiere citas por la manana. Piel sensible.",
    history: [
      { date: "2026-05-02", treatment: "Glass Skin", result: "Piel luminosa, sin reaccion." },
      { date: "2026-04-11", treatment: "Diseno de cejas", result: "Mantener forma natural." }
    ]
  },
  {
    id: "c-002",
    name: "Claudia Martin",
    initials: "CM",
    phone: "+34 622 900 112",
    email: "claudia@example.com",
    lastVisit: "2026-05-04",
    nextVisit: "2026-05-21 17:00",
    notes: "Quiere probar Lash Lift en la proxima visita.",
    history: [
      { date: "2026-05-04", treatment: "Lami Brow", result: "Buen resultado, ceja con mas volumen." }
    ]
  },
  {
    id: "c-003",
    name: "Ana Pereira",
    initials: "AP",
    phone: "+34 633 104 455",
    email: "ana@example.com",
    lastVisit: "2026-04-28",
    nextVisit: "Sin cita",
    notes: "Interesada en microblading, explicar cuidados previos.",
    history: [
      { date: "2026-04-28", treatment: "Perfect Brows", result: "Diseno suave, reservar revision." }
    ]
  }
];

export const treatments: Treatment[] = [
  { id: "t-001", name: "Brow Lami + Lash Lift", category: "Combo", duration: "2h 15m", price: 92, active: true },
  { id: "t-002", name: "Diseno de cejas", category: "Cejas", duration: "45m", price: 15, active: true },
  { id: "t-003", name: "Peeling natural", category: "Facial", duration: "50m", price: 125, active: true },
  { id: "t-004", name: "Lami Brow", category: "Laminacion", duration: "1h 30m", price: 49, active: true },
  { id: "t-005", name: "Lash Lift", category: "Pestanas", duration: "1h 20m", price: 49, active: true }
];

export const scheduleLetters = ["A", "B", "C", "D"];
