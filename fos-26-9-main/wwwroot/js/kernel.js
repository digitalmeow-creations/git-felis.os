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
    document.getElementById("shelf").innerHTML = `<button id="start-btn" class="shelf-btn"><img src="assets/ui/icons/felis-start.svg" alt="">Felis</button><div id="shelf-tasks"></div><button id="device-btn" class="shelf-widget">Device</button><time id="clock-widget" class="shelf-widget">00:00</time>`;
    document.getElementById("start-btn").addEventListener("click", () => document.getElementById("cabinet").classList.toggle("hidden"));
    document.getElementById("device-btn").addEventListener("click", () => document.getElementById("device-dock").classList.toggle("hidden"));
    updateClock();
    window.setInterval(updateClock, 1000);
}

function updateClock() {
    document.getElementById("clock-widget").textContent = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function initializeWorkspace() {
    const apps = [
        { id: "explorer", label: "Storage Explorer", icon: "icon-explorer.svg", content: "<p>Storage Explorer will use the mounted Felis VFS.</p>" },
        { id: "scribe", label: "Scribe", icon: "icon-scribe.svg", content: '<textarea aria-label="Scribe editor" style="width:100%;height:220px;background:#111;color:#fff;border:1px solid #555;padding:10px;">Welcome to FelisOS.</textarea>' },
        { id: "terminal", label: "Kit.nCommand", icon: "icon-terminal.svg", content: '<pre style="color:#6fd8ff;">FelisOS terminal ready. Type help to begin.</pre>' }
    ];
    document.getElementById("cabinet").innerHTML = `<h2>Cabinet</h2><div class="app-grid">${apps.map((app) => `<button class="app-launcher" data-app="${app.id}"><img src="assets/ui/icons/${app.icon}" alt=""><span>${app.label}</span></button>`).join("")}</div>`;
    document.getElementById("device-dock").innerHTML = `<h2>DeviceDock</h2><div class="device-dock-row"><span>Platform</span><strong>${navigator.platform || "Browser"}</strong></div><div class="device-dock-row"><span>Online</span><strong>${navigator.onLine ? "Yes" : "No"}</strong></div><div class="device-dock-row"><span>Storage</span><strong>IndexedDB VFS</strong></div>`;
    document.getElementById("desktop-workspace").innerHTML = `<button class="desktop-icon" style="top:24px;left:24px" data-app="explorer"><img src="assets/ui/icons/icon-explorer.svg" alt=""><span>Storage Explorer</span></button>`;
    document.querySelectorAll("[data-app]").forEach((button) => button.addEventListener("click", () => {
        const app = apps.find((item) => item.id === button.dataset.app);
        if (!app) return;
        window.windowManager.open({ id: `${app.id}-${Date.now()}`, title: app.label, icon: `assets/ui/icons/${app.icon}`, content: app.content });
        document.getElementById("cabinet").classList.add("hidden");
    }));
}
