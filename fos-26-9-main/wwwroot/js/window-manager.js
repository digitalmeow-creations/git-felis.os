class FelisWindowManager {
    constructor(workspace) {
        this.workspace = workspace;
        this.windows = new Map();
        this.nextId = 1;
        this.topZIndex = 10;
    }

    open({ id, title, icon, content, width = 520, height = 340 }) {
        const windowId = id || `window-${this.nextId++}`;
        const element = document.createElement("section");
        element.className = "felis-window";
        element.dataset.windowId = windowId;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.innerHTML = `<header class="felis-window-titlebar"><span class="felis-window-title">${icon ? `<img src="${icon}" alt="">` : ""}${title}</span><span class="felis-window-controls"><button class="window-control" data-action="minimize" aria-label="Minimize">−</button><button class="window-control" data-action="maximize" aria-label="Maximize">□</button><button class="window-control" data-action="close" aria-label="Close">×</button></span></header><div class="felis-window-content"></div>`;
        const contentElement = element.querySelector(".felis-window-content");
        if (typeof content === "string") contentElement.innerHTML = content;
        else contentElement.append(content);
        this.workspace.append(element);
        this.windows.set(windowId, element);
        this.addTask(windowId, title, icon);
        this.focus(windowId);
        element.addEventListener("pointerdown", () => this.focus(windowId));
        element.querySelectorAll("[data-action]").forEach((button) => {
            button.addEventListener("click", () => this.handleAction(windowId, button.dataset.action));
        });
        this.makeDraggable(element, element.querySelector(".felis-window-titlebar"));
        return windowId;
    }

    focus(windowId) {
        const element = this.windows.get(windowId);
        if (!element) return;
        this.topZIndex += 1;
        element.style.zIndex = this.topZIndex;
        this.windows.forEach((windowElement) => windowElement.classList.remove("is-active"));
        element.classList.add("is-active");
        const task = document.querySelector(`[data-window-task="${CSS.escape(windowId)}"]`);
        if (task) task.dataset.active = "true";
        document.querySelectorAll("[data-window-task]").forEach((item) => {
            if (item !== task) item.dataset.active = "false";
        });
    }

    handleAction(windowId, action) {
        const element = this.windows.get(windowId);
        if (!element) return;
        if (action === "close") {
            element.remove();
            this.windows.delete(windowId);
            const task = document.querySelector(`[data-window-task="${CSS.escape(windowId)}"]`);
            if (task) task.remove();
        } else if (action === "minimize") {
            element.classList.toggle("is-minimized");
            if (!element.classList.contains("is-minimized")) this.focus(windowId);
        } else if (action === "maximize") {
            element.classList.toggle("is-maximized");
        }
    }

    addTask(windowId, title, icon) {
        const tasks = document.getElementById("shelf-tasks");
        if (!tasks) return;
        const task = document.createElement("button");
        task.className = "shelf-task";
        task.type = "button";
        task.dataset.windowTask = windowId;
        task.dataset.active = "false";
        task.title = title;
        task.textContent = title;
        if (icon) {
            const image = document.createElement("img");
            image.src = icon;
            image.alt = "";
            image.width = 22;
            image.height = 22;
            task.prepend(image);
        }
        task.addEventListener("click", () => {
            const element = this.windows.get(windowId);
            if (!element) return;
            if (element.classList.contains("is-minimized")) element.classList.remove("is-minimized");
            this.focus(windowId);
        });
        tasks.append(task);
    }

    makeDraggable(element, handle) {
        let drag = null;
        handle.addEventListener("pointerdown", (event) => {
            if (event.target.closest("button")) return;
            const rect = element.getBoundingClientRect();
            drag = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
            handle.setPointerCapture(event.pointerId);
        });
        handle.addEventListener("pointermove", (event) => {
            if (!drag || drag.pointerId !== event.pointerId || element.classList.contains("is-maximized")) return;
            element.style.left = `${Math.max(0, event.clientX - drag.offsetX)}px`;
            element.style.top = `${Math.max(0, event.clientY - drag.offsetY)}px`;
        });
        handle.addEventListener("pointerup", () => { drag = null; });
    }
}

window.FelisWindowManager = FelisWindowManager;
