// smooth scroll nav links

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function (event) {
        const target = this.getAttribute("href");

        if (target.startsWith("#")) {
            event.preventDefault();
            document.querySelector(target).scrollIntoView({
                behavior: "smooth"
            });
        }
   });
});