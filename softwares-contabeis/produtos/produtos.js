document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".accounting-product-page .reveal");
    if (!("IntersectionObserver" in window)) {
        elements.forEach(element => element.classList.add("visible"));
        return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
    elements.forEach(element => observer.observe(element));
});
