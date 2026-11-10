(() => {
  "use strict";
  if (window.onicMarketingConsent) return;

  const storageKey = "onic-marketing-consent-v1";
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  let pageViewSent = false;
  let choice = null;
  let returnFocus = null;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && typeof saved.accepted === "boolean" &&
          Number.isFinite(saved.time) && saved.time <= Date.now() &&
          Date.now() - saved.time < maxAge) return saved.accepted;
    } catch {}
    return null;
  }

  function clearMetaCookies() {
    const parts = location.hostname.split(".");
    for (const name of ["_fbp", "_fbc"]) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      for (let i = 0; i < parts.length - 1; i++) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${parts.slice(i).join(".")}`;
      }
    }
  }

  function applyChoice(accepted) {
    choice = accepted;
    if (accepted !== true) {
      if (window.fbq) window.fbq("consent", "revoke");
      clearMetaCookies();
      return;
    }
    if (pageViewSent) {
      window.fbq("consent", "grant");
      return;
    }

    // Meta's base code loads only after the visitor accepts advertising cookies.
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('consent', 'grant');
    window.fbq('init', '1166290589168038');
    window.fbq('track', 'PageView');
    pageViewSent = true;
    // No unconditional noscript beacon: it would bypass the visitor's choice.
  }

  const banner = document.createElement("section");
  banner.className = "onic-cookie-banner";
  banner.setAttribute("aria-labelledby", "onic-cookie-title");
  banner.hidden = true;
  banner.innerHTML = `
    <h2 id="onic-cookie-title">Tú decides sobre tus cookies</h2>
    <p>Con tu permiso, ONIC Beauty utiliza el píxel de Meta para medir las visitas y la eficacia de sus anuncios en Facebook e Instagram. Puedes aceptar o rechazar las cookies de publicidad y cambiar tu elección desde el pie de página.</p>
    <details><summary>Más información</summary>
      <p>Si aceptas, Meta recibe información sobre las páginas que visitas y tu navegador y puede asociarla a tu cuenta para personalizar anuncios. Sus cookies _fbp y _fbc pueden durar hasta 3 meses. Guardamos tu elección en este navegador durante 6 meses. Si rechazas, no cargamos el píxel. <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Política de privacidad de Meta ↗</a></p>
    </details>
    <div class="onic-cookie-actions">
      <button type="button" data-consent="reject">Rechazar</button>
      <button type="button" data-consent="accept">Aceptar</button>
    </div>`;
  document.body.append(banner);

  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "onic-cookie-settings";
  settings.textContent = "Configurar cookies";
  settings.setAttribute("aria-controls", "onic-cookie-panel");
  banner.id = "onic-cookie-panel";
  (document.querySelector(".site-footer") || document.body).append(settings);

  function showSettings() {
    returnFocus = document.activeElement;
    banner.hidden = false;
    banner.querySelector("button").focus({ preventScroll: true });
  }
  window.onicMarketingConsent = { open: showSettings };
  settings.addEventListener("click", showSettings);
  banner.querySelectorAll("[data-consent]").forEach((button) => {
    button.addEventListener("click", () => {
      const accepted = button.dataset.consent === "accept";
      try { localStorage.setItem(storageKey, JSON.stringify({ accepted, time: Date.now() })); } catch {}
      applyChoice(accepted);
      banner.hidden = true;
      if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
      returnFocus = null;
    });
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    const updated = readChoice();
    if (updated !== choice) applyChoice(updated);
    banner.hidden = updated !== null;
  });
  // Recheck on back/forward navigation, including restored browser snapshots.
  window.addEventListener("pageshow", () => {
    const updated = readChoice();
    if (updated !== choice) applyChoice(updated);
    banner.hidden = updated !== null;
  });
  applyChoice(readChoice());
  banner.hidden = choice !== null;
})();
