export function createSidebarOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('shown');
        overlay.classList.remove('active');
    });
    document.body.appendChild(overlay);
    return overlay;
}