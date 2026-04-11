document.addEventListener("DOMContentLoaded", () => {
  // Insert into the bezel (not the scrollable screen) so the button
  // stays inside the monitor frame and doesn't scroll away.
  const bezel = document.querySelector(".monitor-bezel") || document.body;

  let headerPlaceholder = document.getElementById("global-header");
  if (!headerPlaceholder) {
    headerPlaceholder = document.createElement("div");
    headerPlaceholder.id = "global-header";
  }
  bezel.appendChild(headerPlaceholder);

  headerPlaceholder.innerHTML = `
    <style>
      .menu-icon { width: 22px; height: 16px; position: relative; cursor: pointer; z-index: 10005; pointer-events: auto; }
      .menu-icon span { display: block; position: absolute; height: 2px; width: 100%; background: var(--text-main); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      .menu-icon span:nth-child(1) { top: 0; }
      .menu-icon span:nth-child(2) { top: 7px; }
      .menu-icon span:nth-child(3) { top: 14px; }
      .menu-icon.open span:nth-child(1) { top: 7px; transform: rotate(45deg); }
      .menu-icon.open span:nth-child(2) { opacity: 0; }
      .menu-icon.open span:nth-child(3) { top: 7px; transform: rotate(-45deg); }
      /* Fills the bezel exactly — button is always inside the monitor frame */
      #global-header { position: absolute; inset: 0; z-index: 100; pointer-events: none; }
      #menuToggleWrap {
        display: inline-flex; align-items: center; justify-content: center;
        width: 44px; height: 44px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 12px;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        cursor: pointer; pointer-events: auto;
        transition: background 0.2s, border-color 0.2s;
      }
      #menuToggleWrap:hover { background: rgba(255,255,255,0.11); border-color: rgba(255,255,255,0.28); }

      .nav-anim { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      #menuOverlay.open .nav-anim { opacity: 1; transform: translateY(0); }
    </style>
    <header style="display: flex; justify-content: flex-end; align-items: center; padding: 25px 30px; pointer-events: none; position: relative; z-index: 10000;">
      <div id="menuToggleWrap">
        <div id="menuToggle" class="menu-icon">
          <span></span><span></span><span></span>
        </div>
      </div>
    </header>

    <div id="menuOverlay" style="position: fixed; inset: 0; background: rgba(5,5,5,0.98); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: opacity 0.4s ease;">

      <div style="width: 100%; max-width: 500px; padding: 20px; display: flex; flex-direction: column; align-items: center;">

        <!-- Services Directory Card -->
        <nav class="directory-nav nav-anim" style="width: 100%; margin-left: 0; margin-bottom: 40px; box-sizing: border-box; text-align: left;">
          <div class="dir-header">
              <span>Services</span>
              <span>[4]</span>
          </div>
          <ul class="dir-list">
              <li class="dir-item">
                  <a href="photography.html" class="dir-link">
                      <span class="dir-arrows">>> ></span>
                      <span class="dir-name">Photography</span>
                  </a>
              </li>
              <li class="dir-item">
                  <a href="videography.html" class="dir-link">
                      <span class="dir-arrows">>> ></span>
                      <span class="dir-name">Videography</span>
                  </a>
              </li>
              <li class="dir-item">
                  <a href="websites.html" class="dir-link">
                      <span class="dir-arrows">>> ></span>
                      <span class="dir-name">Websites</span>
                  </a>
              </li>
              <li class="dir-item">
                  <a href="advertising.html" class="dir-link">
                      <span class="dir-arrows">>> ></span>
                      <span class="dir-name">Advertising</span>
                  </a>
              </li>
          </ul>
        </nav>

        <!-- Secondary Navigation -->
        <div class="nav-anim" style="display: flex; gap: 30px; margin-bottom: 20px; font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; transition-delay: 0.1s;">
          <a href="index.html" style="color: var(--text-dim); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--text-main)'" onmouseout="this.style.color='var(--text-dim)'">Home</a>
          <a href="about.html" style="color: var(--text-dim); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--text-main)'" onmouseout="this.style.color='var(--text-dim)'">About</a>
          <a href="contact.html" style="color: var(--text-dim); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--text-main)'" onmouseout="this.style.color='var(--text-dim)'">Contact</a>
        </div>

        <!-- Wallpapers Link -->
        <a href="wallpapers.html" class="nav-anim" style="display: inline-flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.85); text-decoration: none; border: 1px solid rgba(255,255,255,0.4); padding: 8px 16px; margin-bottom: 30px; transition: color 0.2s, border-color 0.2s, background 0.2s; transition-delay: 0.15s;" onmouseover="this.style.color='#fff';this.style.borderColor='rgba(255,255,255,0.8)';this.style.background='rgba(255,255,255,0.07)'" onmouseout="this.style.color='rgba(255,255,255,0.85)';this.style.borderColor='rgba(255,255,255,0.4)';this.style.background='transparent'">
          ✦ Free Wallpapers
        </a>

        <!-- Contact Email -->
        <a href="mailto:contact@dallas.rip" class="nav-anim" style="font-family: var(--mono); font-size: 11px; color: var(--text-dim); text-decoration: none; letter-spacing: 0.15em; transition-delay: 0.2s; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; transition: all 0.2s;" onmouseover="this.style.color='var(--text-main)'; this.style.borderColor='rgba(255,255,255,0.5)';" onmouseout="this.style.color='var(--text-dim)'; this.style.borderColor='rgba(255,255,255,0.1)';">contact@dallas.rip</a>

      </div>

    </div>
  `;

  const menuToggle = document.getElementById("menuToggle");
  const menuToggleWrap = document.getElementById("menuToggleWrap");
  const menuOverlay = document.getElementById("menuOverlay");

  menuToggleWrap.addEventListener("click", () => {
    menuOverlay.classList.toggle("open");
    menuToggle.classList.toggle("open");
    menuOverlay.style.opacity = menuOverlay.classList.contains("open")
      ? "1"
      : "0";
    menuOverlay.style.pointerEvents = menuOverlay.classList.contains("open")
      ? "auto"
      : "none";
  });

  menuOverlay.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      menuOverlay.classList.remove("open");
      menuToggle.classList.remove("open");
      menuOverlay.style.opacity = "0";
      menuOverlay.style.pointerEvents = "none";
    }
  });
});
