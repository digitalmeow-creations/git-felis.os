document.addEventListener("DOMContentLoaded", async () => {
    try {
        await window.vfs.mount();
        window.windowManager = new FelisWindowManager(document.getElementById("desktop-workspace"));
        initializeShelf();
        initializeWorkspace();
    } catch (error) {
        console.error("[FelisOS Kernel] FATAL: Boot failure.", error);
        document.body.innerHTML = `<div style="padding:20px;color:white;background:#8b0000">Kernel Panic: ${error.message}</div>`;
    }
});

function initializeShelf() {
    document.getElementById("shelf").innerHTML = `<button id="start-btn" class="shelf-btn" aria-expanded="false" aria-controls="cabinet"><img src="assets/ui/icons/felis-start.svg" alt="">Felis</button><div id="shelf-tasks" aria-label="Open applications"></div><button id="device-btn" class="shelf-widget" aria-expanded="false" aria-controls="device-dock">Device</button><time id="clock-widget" class="shelf-widget" datetime="00:00">00:00</time>`;
    document.getElementById("start-btn").addEventListener("click", () => togglePanel("start-btn", "cabinet"));
    document.getElementById("device-btn").addEventListener("click", () => togglePanel("device-btn", "device-dock"));
    updateClock();
    window.setInterval(updateClock, 1000);
}

function togglePanel(buttonId, panelId) {
    const button = document.getElementById(buttonId);
    const panel = document.getElementById(panelId);
    const isHidden = panel.classList.toggle("hidden");
    button.setAttribute("aria-expanded", String(!isHidden));
    panel.setAttribute("aria-hidden", String(isHidden));
}

function updateClock() {
    const now = new Date();
    const clock = document.getElementById("clock-widget");
    clock.textContent = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(now);
    clock.dateTime = now.toISOString();
}

function initializeWorkspace() {
    const apps = [
        { id: "explorer", label: "Storage Explorer", icon: "icon-explorer.svg", content: "<p>Storage Explorer will use the mounted Felis VFS.</p>" },
        { id: "scribe", label: "Scribe", icon: "icon-scribe.svg", content: '<textarea aria-label="Scribe editor">Welcome to FelisOS.</textarea>' },
        { id: "terminal", label: "Kit.nCommand", icon: "icon-terminal.svg", content: '<pre style="color:#6fd8ff;">FelisOS terminal ready. Type help to begin.</pre>' }
    ];
    document.getElementById("cabinet").innerHTML = `<h2>Cabinet</h2><div class="app-grid">${apps.map((app) => `<button class="app-launcher" data-app="${app.id}"><img src="assets/ui/icons/${app.icon}" alt=""><span>${app.label}</span></button>`).join("")}</div>`;
    document.getElementById("device-dock").innerHTML = `<h2>DeviceDock</h2><div class="device-dock-row"><span>Platform</span><strong>${navigator.platform || "Browser"}</strong></div><div class="device-dock-row"><span>Online</span><strong class="fos-status ${navigator.onLine ? "fos-status--online" : "fos-status--offline"}">${navigator.onLine ? "Yes" : "No"}</strong></div><div class="device-dock-row"><span>Storage</span><strong>IndexedDB VFS</strong></div>`;
    document.getElementById("desktop-workspace").innerHTML = `<button class="desktop-icon" style="top:24px;left:24px" data-app="explorer"><img src="assets/ui/icons/icon-explorer.svg" alt=""><span>Storage Explorer</span></button>`;
    document.querySelectorAll("[data-app]").forEach((button) => button.addEventListener("click", () => {
        const app = apps.find((item) => item.id === button.dataset.app);
        if (!app) return;
        window.windowManager.open({ id: `${app.id}-${Date.now()}`, title: app.label, icon: `assets/ui/icons/${app.icon}`, content: app.content });
        document.getElementById("cabinet").classList.add("hidden");
    }));
}
