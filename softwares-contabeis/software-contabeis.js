document.addEventListener("DOMContentLoaded", () => {
    const elementos = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        elementos.forEach(el => el.classList.add("visible"));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    elementos.forEach(el => observer.observe(el));
});
