document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/_data/settings.json');
        if (!response.ok) return;
        const settings = await response.json();

        // Update Document Title
        if (settings.site_title) {
            document.title = settings.site_title;
        }

        // Update Meta Description (Create if it doesn't exist)
        if (settings.site_description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = "description";
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = settings.site_description;
        }

        // Update Favicon (Create if it doesn't exist)
        if (settings.favicon) {
            let icon = document.querySelector('link[rel="icon"]');
            if (!icon) {
                icon = document.createElement('link');
                icon.rel = "icon";
                document.head.appendChild(icon);
            }
            icon.href = settings.favicon;
            // Always set type based on extension for best compatibility
            if(settings.favicon.endsWith('.svg')) icon.type = "image/svg+xml";
            else if (settings.favicon.endsWith('.png')) icon.type = "image/png";
        }

        // Function to safely update text content
        const safeUpdateText = (selector, text) => {
            if (!text) return;
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.textContent = text);
        };

        // We run a small loop just in case footer.js is delayed
        const updateDomElements = () => {
            safeUpdateText('.footer-contact-group .location', settings.location);
            safeUpdateText('.cta-box h2', settings.cta_heading);
            safeUpdateText('.cta-box p', settings.cta_text);

            const emails = document.querySelectorAll('.footer-contact-group .email');
            emails.forEach(el => {
                if (settings.email) {
                    el.textContent = settings.email;
                    el.href = `mailto:${settings.email}`;
                }
            });
        };

        // Update immediately
        updateDomElements();

        // Also run again after 500ms to catch anything injected by other scripts (like footer.js)
        setTimeout(updateDomElements, 500);

    } catch (error) {
        console.error("Error loading site settings:", error);
    }
});
