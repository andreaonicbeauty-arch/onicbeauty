(() => {
  if (!document.body.classList.contains('inner-page')) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const images = [...document.querySelectorAll('[data-inner-shift]')].map(element => ({element, frame: element.parentElement, amount: Number(element.dataset.innerShift), value: 0, visible: true}));
  const floats = [...document.querySelectorAll('[data-inner-float]')].map(element => ({element, amount: Number(element.dataset.innerFloat), value: 0, visible: true}));
  let frame = 0;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const progress = rect => clamp((innerHeight / 2 - rect.top - rect.height / 2) / ((innerHeight + rect.height) / 2), -1, 1);
  const render = () => {
    frame = 0;
    if (document.hidden || preference.matches) return;
    const mobile = innerWidth < 720 ? .65 : 1;
    const measurements = images.filter(layer => layer.visible).map(layer => {
      const rect = layer.frame.getBoundingClientRect();
      const travel = Math.max(0, rect.height * .115 - 2);
      return {layer, target: clamp(progress(rect) * layer.amount * mobile, -travel, travel)};
    });
    const floating = floats.filter(layer => layer.visible).map(layer => ({layer, target: progress(layer.element.getBoundingClientRect()) * layer.amount * mobile}));
    let unsettled = false;
    measurements.forEach(({layer, target}) => {
      layer.value += (target - layer.value) * .14;
      unsettled ||= Math.abs(target - layer.value) > .12;
      layer.element.style.setProperty('--inner-y', layer.value.toFixed(2) + 'px');
    });
    floating.forEach(({layer, target}) => {
      layer.value += (target - layer.value) * .11;
      unsettled ||= Math.abs(target - layer.value) > .12;
      layer.element.style.setProperty('--inner-float', layer.value.toFixed(2) + 'px');
    });
    if (unsettled) schedule();
  };
  const schedule = () => { if (!frame && !preference.matches && !document.hidden) frame = requestAnimationFrame(render); };
  if ('IntersectionObserver' in window) {
    const targets = new Set([...images.map(layer => layer.frame), ...floats.map(layer => layer.element)]);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('depth-live', entry.isIntersecting);
        images.filter(layer => layer.frame === entry.target).forEach(layer => { layer.visible = entry.isIntersecting; });
        floats.filter(layer => layer.element === entry.target).forEach(layer => { layer.visible = entry.isIntersecting; });
      });
      schedule();
    }, {rootMargin: '120px'});
    targets.forEach(target => observer.observe(target));
  }
  const syncMotion = () => {
    document.body.classList.toggle('inner-motion-still', preference.matches);
    cancelAnimationFrame(frame); frame = 0;
    if (preference.matches) {
      images.forEach(layer => { layer.value = 0; layer.element.style.setProperty('--inner-y', '0px'); });
      floats.forEach(layer => { layer.value = 0; layer.element.style.setProperty('--inner-float', '0px'); });
    } else schedule();
  };
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule, {passive: true});
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(frame); frame = 0; schedule(); });
  preference.addEventListener('change', syncMotion);
  syncMotion();

  const filters = document.querySelector('[data-service-filters]');
  if (filters) {
    const cards = [...document.querySelectorAll('.service-card[data-category]')];
    const status = document.querySelector('[data-service-count]');
    const select = category => {
      filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
      let count = 0;
      cards.forEach(card => {
        card.hidden = category !== 'todos' && !card.dataset.category.split(' ').includes(category);
        if (!card.hidden) count++;
      });
      status.textContent = count + (count === 1 ? ' tratamiento' : ' tratamientos');
      schedule();
    };
    filters.hidden = false;
    filters.addEventListener('click', event => {
      const button = event.target.closest('button[data-filter]');
      if (button) select(button.dataset.filter);
    });
    select('todos');
  }
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roledescription', 'carrusel');
    carousel.setAttribute('aria-label', 'Inspiración de belleza ONIC');
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    slides.forEach((slide, index) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'diapositiva');
      slide.setAttribute('aria-label', `${index + 1} de ${slides.length}`);
    });
    carousel.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      carousel.querySelector(event.key === 'ArrowRight' ? '[data-carousel-next]' : '[data-carousel-prev]')?.click();
    });
  });
  const copy = document.querySelector('[data-copy-address]');
  if (copy) copy.addEventListener('click', async () => {
    const feedback = document.querySelector('[data-address-feedback]');
    const address = 'Calle de Lombia 6, 28009 Madrid';
    try {
      await navigator.clipboard.writeText(address);
      feedback.textContent = 'Dirección copiada.';
    } catch {
      feedback.textContent = 'Dirección: ' + address;
    }
  });
})();
