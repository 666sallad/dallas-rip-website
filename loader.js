(function () {
  // Inject loader CSS
  const css = `
        #global-loader {
            position: fixed; inset: 0; background: #050505; z-index: 999999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s;
            color: #fff; font-family: "Share Tech Mono", monospace;
        }
        .loader-spinner {
            width: 50px; height: 50px; border: 2px solid rgba(255, 255, 255, 0.1);
            border-top-color: #fff; border-radius: 50%;
            animation: spin 1s linear infinite; margin-bottom: 20px;
        }
        .loader-text {
            font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;
            animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        html.loading-active body { overflow: hidden !important; }
    `;

  document.write("<style>" + css + "</style>");
  document.write(
    '<div id="global-loader"><div class="loader-spinner"></div><div class="loader-text">LOADING_ASSETS</div></div>',
  );
  document.documentElement.classList.add("loading-active");

  let pageReady = false;

  function hideLoader() {
    if (pageReady) return;
    pageReady = true;

    const loader = document.getElementById("global-loader");
    if (loader) {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
      setTimeout(() => {
        loader.remove();
        document.documentElement.classList.remove("loading-active");
      }, 800); // match transition duration
    }
  }

  // Expose the function to be called from other scripts
  window.pageIsReady = hideLoader;

  // Failsafe: if pageIsReady is not called within 3 seconds, hide the loader anyway
  setTimeout(() => {
    if (!pageReady) {
      console.warn("Loader timed out. Hiding automatically.");
      hideLoader();
    }
  }, 3000);
})();
