// Initialize mobile enhancements
export function initMobileEnhancements() {
    const overlay = createSidebarOverlay();

    // Enhance sidebar toggle behavior
    sidebar_buttons.forEach((el) => {
        el.removeEventListener('click', null);
        el.addEventListener('click', () => {
            if (window.innerWidth < 640) {
                if (sidebar.classList.contains('shown')) {
                    sidebar.classList.remove('shown');
                    overlay.classList.remove('active');
                } else {
                    sidebar.classList.add('shown');
                    overlay.classList.add('active');
                }
            } else {
                // Desktop behavior remains the same
                if (sidebar.classList.contains('shown')) {
                    sidebar.classList.remove('shown');
                    sidebar.classList.add('minimized');
                } else {
                    sidebar.classList.remove('minimized');
                    sidebar.classList.add('shown');
                }
            }
        });
    });

    // Add swipe gesture support
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const swipeThreshold = 100;

        // Right swipe (from left edge) - open sidebar
        if (touchEndX - touchStartX > swipeThreshold && touchStartX < 30) {
            sidebar.classList.add('shown');
            overlay.classList.add('active');
        }

        // Left swipe - close sidebar
        if (touchStartX - touchEndX > swipeThreshold && sidebar.classList.contains('shown')) {
            sidebar.classList.remove('shown');
            overlay.classList.remove('active');
        }
    }

    // Double tap to scroll to bottom
    //   let lastTap = 0;
    //   chatBody.addEventListener('touchend', e => {
    //     const currentTime = new Date().getTime();
    //     const tapLength = currentTime - lastTap;

    //     if (tapLength < 300 && tapLength > 0) {
    //       // Double tap detected
    //       scroll_to_bottom();
    //       e.preventDefault();
    //     }

    //     lastTap = currentTime;
    //   });

    // Improve file input experience on mobile
    const fileLabels = document.querySelectorAll('.file-label');
    fileLabels.forEach(label => {
        label.addEventListener('touchstart', () => {
            label.classList.add('active-touch');
        });

        label.addEventListener('touchend', () => {
            setTimeout(() => {
                label.classList.remove('active-touch');
            }, 200);
        });
    });
}