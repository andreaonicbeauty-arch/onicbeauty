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

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  siteNav.querySelectorAll("a").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("is-active");
    }
  });
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const dotsWrap = carousel.querySelector(".carousel-dots");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let autoplayId;
  let touchStartX = 0;

  const setActive = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dotsWrap?.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  };

  const pauseAutoplay = () => {
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

  if (!prefersReducedMotion && slides.length > 1) {
    autoplayId = window.setInterval(() => setActive(activeIndex + 1), 5200);
  }
});
