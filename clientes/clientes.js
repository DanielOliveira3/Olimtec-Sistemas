document.addEventListener("DOMContentLoaded", () => {
    const elementos = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        elementos.forEach((elemento) => elemento.classList.add("visible"));
        return;
    }

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observer.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
    });

    elementos.forEach((elemento) => observador.observe(elemento));
});