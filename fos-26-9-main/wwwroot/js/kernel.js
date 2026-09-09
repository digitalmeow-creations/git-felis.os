/*
 *   FILE: "kernel.js"
 *   AUTHOR: $Creator.0\tg <tgreen.dev@outlook.com>
 *   SUMMARY: Core Bootloader and Process Manager.
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[FelisOS Kernel] Initiating boot sequence...');

    try {
        // 1. Mount Virtual File System
        await window.vfs.mount();

        // 2. Initialize Desktop Environment
        initializeShelf();
        initializeWorkspace();

        // 3. Remove boot splash (if implemented)
        console.log('[FelisOS Kernel] System idle and ready.');
    } catch (error) {
        console.error('[FelisOS Kernel] FATAL: Boot failure.', error);
        document.body.innerHTML = `<div style="color:white; background:red; padding:20px;">Kernel Panic: ${error.message}</div>`;
    }
});

function initializeShelf() {
    const shelf = document.getElementById('shelf');
    // Inject Felis Start Button and Clock Widget
    shelf.innerHTML = `
        <button id="start-btn" class="shelf-btn">Felis</button>
        <div id="shelf-tasks"></div>
        <div id="clock-widget" class="shelf-widget">00:00</div>
    `;

    document.getElementById('start-btn').addEventListener('click', toggleCabinet);
}

function toggleCabinet() {
    const cabinet = document.getElementById('cabinet');
    cabinet.classList.toggle('hidden');
}

function initializeWorkspace() {
    // const workspace = document.getElementById('desktop-workspace');
    // Prepares the area for window-manager.js to render Lunacy-designed window frames
}