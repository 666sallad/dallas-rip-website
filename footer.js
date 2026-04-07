document.addEventListener("DOMContentLoaded", () => {
  const footerPlaceholder = document.getElementById("global-footer");
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
    <footer class="global-footer fade-element">
      <div class="footer-nav-group">
        <div class="footer-nav-col">
          <span class="label">Directory</span>
          <a href="index.html" class="menu-link-glitch">Home</a>
          <a href="about.html" class="menu-link-glitch">About</a>
          <a href="contact.html" class="menu-link-glitch">Contact</a>
        </div>
        <div class="footer-nav-col">
          <span class="label">Services</span>
          <a href="photography.html" class="menu-link-glitch">Photography</a>
          <a href="videography.html" class="menu-link-glitch">Videography</a>
          <a href="websites.html" class="menu-link-glitch">Websites</a>
          <a href="advertising.html" class="menu-link-glitch">Advertising</a>
        </div>
      </div>
      <div class="footer-contact-group">
        <div>
          <a href="mailto:contact@dallas.rip" class="email menu-link-glitch">contact@dallas.rip</a>
          <span class="location">Brisbane, AUS</span>
        </div>
      </div>
    </footer>
    `;

    if (typeof observer !== "undefined" && observer !== null) {
      footerPlaceholder
        .querySelectorAll(".fade-element")
        .forEach((el) => observer.observe(el));
    } else {
      footerPlaceholder.querySelectorAll(".fade-element").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }
  }
});
