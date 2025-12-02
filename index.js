// Select all navigation links that point to a section
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function (event) {
        const target = this.getAttribute("href");

        if (target.startsWith("#")) {
            event.preventDefault(); // Prevent default jump
            document.querySelector(target).scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});