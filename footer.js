document.addEventListener("DOMContentLoaded", () => {
  const footerPlaceholder = document.getElementById("global-footer");
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
    <footer class="fade-element" style="border-top: 1px solid var(--glass-border); padding: 60px 5vw 60px; margin-top: 80px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; background: rgba(0,0,0,0.3);">
      <div style="display: flex; gap: 80px; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <span style="color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Directory</span>
          <a href="index.html" class="menu-link-glitch" style="color: var(--text-muted); text-decoration: none; font-size: 15px;">Home</a>
          <a href="about.html" class="menu-link-glitch" style="color: var(--text-muted); text-decoration: none; font-size: 15px;">About</a>
          <a href="contact.html" class="menu-link-glitch" style="color: var(--text-muted); text-decoration: none; font-size: 15px;">Contact</a>
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <span style="color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Services</span>
          <a href="photography.html" class="menu-link-glitch" style="color: var(--text-muted); text-decoration: none; font-size: 15px;">Photography</a>
          <a href="videography.html" class="menu-link-glitch" style="color: var(--text-muted); text-decoration: none; font-size: 15px;">Videography</a>
          <a href="websites.html" class="menu-link-glitch" style="color: var(--text-muted); text-decoration: none; font-size: 15px;">Websites</a>
          <a href="advertising.html" class="menu-link-glitch" style="color: var(--text-muted); text-decoration: none; font-size: 15px;">Advertising</a>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start;">
        <div style="text-align: right;">
          <a href="mailto:contact@dallas.rip" class="menu-link-glitch" style="color: var(--text-main); text-decoration: none; font-size: 16px; font-weight: 600; display: block; margin-bottom: 5px;">contact@dallas.rip</a>
          <span style="color: var(--text-dim); font-size: 13px;">Brisbane, AUS</span>
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
