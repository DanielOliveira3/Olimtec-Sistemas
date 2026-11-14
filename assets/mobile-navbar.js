(function () {
  "use strict";

  // Comportamento da navbar somente em celulares:
  // - descendo: esconde
  // - subindo: mostra
  // - no topo: sempre mostra
  const MOBILE_BREAKPOINT = 600;
  const DELTA = 8;
  let lastScrollY = window.scrollY || 0;
  let ticking = false;

  function isMobile() {
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
  }

  function updateNavbar() {
    ticking = false;

    const header = document.querySelector("header");
    if (!header) return;

    if (!isMobile()) {
      header.classList.remove("mobile-nav-hidden", "mobile-nav-visible");
      lastScrollY = window.scrollY || 0;
      return;
    }

    const currentScrollY = Math.max(window.scrollY || 0, 0);

    // No topo, a navbar permanece visível.
    if (currentScrollY <= 10) {
      header.classList.remove("mobile-nav-hidden");
      header.classList.add("mobile-nav-visible");
      lastScrollY = currentScrollY;
      return;
    }

    const difference = currentScrollY - lastScrollY;

    // Pequenas oscilações de rolagem não alteram a navbar.
    if (Math.abs(difference) < DELTA) return;

    if (difference > 0) {
      // Rolando para baixo.
      header.classList.add("mobile-nav-hidden");
      header.classList.remove("mobile-nav-visible");
    } else {
      // Rolando para cima.
      header.classList.remove("mobile-nav-hidden");
      header.classList.add("mobile-nav-visible");
    }

    lastScrollY = currentScrollY;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateNavbar);
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });

  window.addEventListener("resize", function () {
    updateNavbar();
  }, { passive: true });

  // Estado inicial.
  updateNavbar();
})();
