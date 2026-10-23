const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
  });

  const normalizePage = (value) => {
    const pathname = new URL(value, window.location.origin).pathname;
    return pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/$/, "") || "/";
  };
  const currentPage = normalizePage(window.location.href);
  siteNav.querySelectorAll("a").forEach((link) => {
    const linkPage = normalizePage(link.getAttribute("href"));
    if (linkPage === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
// Parallax starts automatically; carousel autoplay still follows the system preference.
document.documentElement.classList.add("motion-enabled");
document.documentElement.classList.remove("motion-disabled");
try { localStorage.removeItem("onic-motion"); } catch {}
document.querySelectorAll(".brand-logo").forEach((logo) => {
  logo.dataset.parallax = "5";
  logo.dataset.depth = "4";
});

// One on-demand animation loop for all photographic layers. Native scrolling stays intact.
const parallaxElements = Array.from(document.querySelectorAll("[data-parallax]"));
const filmScenes = Array.from(document.querySelectorAll("[data-film]")).map((element) => {
  element.classList.add("film-ready");
  return { element, copies: Array.from(element.querySelectorAll("[data-film-copy]")), progress: 0 };
});
if (parallaxElements.length || filmScenes.length) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const layers = parallaxElements.map((element) => ({
    element,
    scene: element.closest("[data-parallax-scene]") || element.parentElement,
    speed: Number(element.dataset.parallax) || 0,
    depth: Number(element.dataset.depth) || 0,
    tilt: Number(element.dataset.tilt) || 0,
    y: 0,
    visible: true,
  }));
  const coverStory = document.querySelector(".cover-story");
  const header = document.querySelector(".video-header");
  let frameId = 0;
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;

  const render = () => {
    frameId = 0;
    if (document.hidden) return;
    const height = window.innerHeight;
    const mobileFactor = window.innerWidth < 720 ? 0.75 : 1;
    currentX += (pointerX - currentX) * 0.085;
    currentY += (pointerY - currentY) * 0.085;
    let unsettled = Math.abs(pointerX - currentX) + Math.abs(pointerY - currentY) > 0.002;

    // Read geometry together before writing styles, avoiding layout thrashing.
    const storyRect = coverStory?.getBoundingClientRect();
    const coverProgress = storyRect ? Math.max(0, Math.min(1, -storyRect.top / Math.max(1, storyRect.height - height))) : 0;
    const measurements = layers.filter((layer) => layer.visible).map((layer) => {
      const rect = layer.scene.getBoundingClientRect();
      const progress = layer.scene.classList.contains("cover-sticky")
        ? coverProgress * 1.6 - 0.35
        : Math.max(-1, Math.min(1, (height / 2 - rect.top - rect.height / 2) / ((height + rect.height) / 2)));
      const frame = layer.element.parentElement.getBoundingClientRect();
      const brand = layer.element.classList.contains("brand-logo");
      const travel = brand ? 5 : layer.element.tagName === "IMG"
        ? Math.max(0, frame.height * 0.24 - layer.depth * 0.5 - frame.width * 0.016 - 5)
        : Infinity;
      const target = Math.max(-travel, Math.min(travel, progress * layer.speed * (brand ? 1 : 4) * mobileFactor));
      return { layer, progress, target };
    });
    const filmMeasurements = filmScenes.map((scene) => {
      const rect = scene.element.getBoundingClientRect();
      return { scene, target: Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - height))), visible: rect.bottom > 0 && rect.top < height };
    });

    measurements.forEach(({ layer, progress, target }) => {
      layer.y += (target - layer.y) * 0.11;
      unsettled ||= Math.abs(target - layer.y) > 0.1;
      layer.element.style.setProperty("--parallax-y", `${layer.y.toFixed(2)}px`);
      layer.element.style.setProperty("--depth-x", `${(currentX * layer.depth * mobileFactor).toFixed(2)}px`);
      layer.element.style.setProperty("--depth-y", `${(currentY * layer.depth * mobileFactor).toFixed(2)}px`);
      layer.element.style.setProperty("--photo-zoom", (1.04 + Math.abs(progress) * 0.08 * mobileFactor).toFixed(4));
      layer.element.style.setProperty("--photo-roll", `${(progress * layer.tilt * mobileFactor).toFixed(3)}deg`);
    });
    const smoothRange = (value, start, end) => {
      const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
      return t * t * (3 - 2 * t);
    };
    filmMeasurements.forEach(({ scene, target, visible }) => {
      if (!visible) return;
      scene.progress += (target - scene.progress) * 0.12;
      unsettled ||= Math.abs(target - scene.progress) > 0.0005;
      const p = scene.progress;
      const product = smoothRange(p, 0.2, 0.48);
      const petals = smoothRange(p, 0.36, 0.65);
      const alphas = [1 - smoothRange(p, 0.12, 0.32), smoothRange(p, 0.32, 0.45) * (1 - smoothRange(p, 0.64, 0.78)), smoothRange(p, 0.78, 0.92)];
      scene.element.style.setProperty("--film-p", p.toFixed(4));
      scene.element.style.setProperty("--film-product", product.toFixed(4));
      scene.element.style.setProperty("--film-petals", petals.toFixed(4));
      scene.copies.forEach((copy, index) => {
        copy.style.setProperty("--film-copy-alpha", alphas[index].toFixed(4));
        copy.inert = alphas[index] < 0.5;
        copy.setAttribute("aria-hidden", String(alphas[index] < 0.5));
      });
    });
    coverStory?.style.setProperty("--cover-progress", coverProgress.toFixed(4));
    header?.classList.toggle("is-scrolled", window.scrollY > height * 0.8);
    if (unsettled) schedule();
  };

  const schedule = () => {
    if (!frameId && !document.hidden) frameId = requestAnimationFrame(render);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        layers.filter((layer) => layer.scene === entry.target).forEach((layer) => { layer.visible = entry.isIntersecting; });
      });
      schedule();
    }, { rootMargin: "120px" });
    new Set(layers.map((layer) => layer.scene)).forEach((scene) => observer.observe(scene));
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pointermove", (event) => {
    if (!finePointer.matches) return;
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
    schedule();
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => {
    pointerX = pointerY = 0;
    schedule();
  });
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
    if (!document.hidden) schedule();
  });
  schedule();
}

// Content remains visible without JavaScript or IntersectionObserver support.
const revealElements = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealElements.forEach((element) => {
    element.classList.add("will-reveal");
    revealObserver.observe(element);
  });
}

const cover = document.querySelector("[data-cover]");
if (cover) {
  const slides = Array.from(cover.querySelectorAll("[data-cover-slide]"));
  const pauseButton = cover.querySelector("[data-cover-pause]");
  let activeIndex = 0;
  let timerId = 0;
  let userPaused = false;
  let hovered = false;
  let inView = true;
  const show = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === activeIndex);
      slide.setAttribute("aria-hidden", String(i !== activeIndex));
    });
    cover.querySelector("[data-cover-number]").textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    cover.querySelector("[data-cover-caption]").textContent = slides[activeIndex].dataset.caption;
  };
  const syncPlayback = () => {
    clearInterval(timerId);
    const paused = userPaused || reducedMotion.matches;
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.setAttribute("aria-label", paused ? "Reanudar presentación de portada" : "Pausar presentación de portada");
    pauseButton.textContent = reducedMotion.matches ? "Manual" : userPaused ? "Reanudar" : "Pausar";
    pauseButton.disabled = reducedMotion.matches;
    if (!paused && !hovered && inView && !document.hidden && !cover.contains(document.activeElement)) {
      timerId = window.setInterval(() => show(activeIndex + 1), 6500);
    }
  };
  cover.querySelector("[data-cover-prev]").addEventListener("click", () => { userPaused = true; show(activeIndex - 1); syncPlayback(); });
  cover.querySelector("[data-cover-next]").addEventListener("click", () => { userPaused = true; show(activeIndex + 1); syncPlayback(); });
  pauseButton.addEventListener("click", () => { userPaused = !userPaused; syncPlayback(); });
  cover.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { hovered = true; syncPlayback(); } });
  cover.addEventListener("pointerleave", () => { hovered = false; syncPlayback(); });
  cover.addEventListener("focusin", syncPlayback);
  cover.addEventListener("focusout", () => setTimeout(syncPlayback, 0));
  document.addEventListener("visibilitychange", syncPlayback);
  reducedMotion.addEventListener("change", syncPlayback);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncPlayback(); });
    observer.observe(cover);
  }
  show(0);
  syncPlayback();
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const dotsWrap = carousel.querySelector(".carousel-dots");
  let activeIndex = 0;
  let autoplayId;
  let touchStartX = 0;
  let userPaused = false;
  const playback = document.createElement("button");
  playback.type = "button";
  playback.className = "carousel-playback";
  carousel.querySelector(".carousel-controls")?.append(playback);
  const updatePlayback = () => {
    playback.textContent = reducedMotion.matches ? "Manual" : userPaused ? "Reanudar" : "Pausar";
    playback.setAttribute("aria-label", userPaused ? "Reanudar carrusel" : "Pausar carrusel");
    playback.setAttribute("aria-pressed", String(userPaused || reducedMotion.matches));
    playback.disabled = reducedMotion.matches;
  };

  const setActive = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
      slide.setAttribute("aria-hidden", String(slideIndex !== activeIndex));
    });

    dotsWrap?.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  };

  const pauseAutoplay = () => {
    userPaused = true;
    updatePlayback();
    if (autoplayId) {
      window.clearInterval(autoplayId);
    }
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver imagen ${index + 1}`);
    dot.addEventListener("click", () => {
      pauseAutoplay();
      setActive(index);
    });
    dotsWrap?.append(dot);
  });

  prev?.addEventListener("click", () => {
    pauseAutoplay();
    setActive(activeIndex - 1);
  });

  next?.addEventListener("click", () => {
    pauseAutoplay();
    setActive(activeIndex + 1);
  });

  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });

  carousel.addEventListener("touchend", (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(deltaX) > 42) {
      pauseAutoplay();
      setActive(activeIndex + (deltaX < 0 ? 1 : -1));
    }
  });

  setActive(0);

  const syncAutoplay = () => {
    window.clearInterval(autoplayId);
    updatePlayback();
    if (!reducedMotion.matches && !document.hidden && !userPaused && slides.length > 1) autoplayId = window.setInterval(() => setActive(activeIndex + 1), 5200);
  };
  playback.addEventListener("click", () => { userPaused = !userPaused; syncAutoplay(); });
  carousel.addEventListener("focusin", (event) => { if (event.target !== playback) pauseAutoplay(); });
  reducedMotion.addEventListener("change", syncAutoplay);
  document.addEventListener("visibilitychange", syncAutoplay);
  syncAutoplay();
});
