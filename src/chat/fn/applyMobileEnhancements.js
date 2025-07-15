// Function to apply mobile-specific enhancements
export function applyMobileEnhancements() {
    // Add mobile class to body for CSS targeting
    document.body.classList.add('mobile-device');

    // Adjust height for mobile browsers (handles address bar)
    function setMobileHeight() {
        document.querySelector(".container").style.maxHeight = window.innerHeight + "px";
        document.querySelector(".container").style.height = window.innerHeight + "px";
    }

    setMobileHeight();
    window.addEventListener('resize', setMobileHeight);

    // Improve scroll behavior
    const chatBody = document.getElementById('chatBody');
    chatBody.style.overscrollBehavior = 'contain';

    // Enhance touch feedback for all interactive elements
    const touchElements = document.querySelectorAll('button, .file-label, .micro-label, select, .convo');
    touchElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.classList.add('active-touch');
        }, { passive: true });

        el.addEventListener('touchend', () => {
            setTimeout(() => {
                el.classList.remove('active-touch');
            }, 200);
        }, { passive: true });
    });

    // Optimize input field behavior
    const userInput = document.getElementById('userInput');
    userInput.addEventListener('focus', () => {
        // Small delay to ensure keyboard is open
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
        }, 300);
    });

    // Show/hide floating action button based on scroll position
    let lastScrollTop = 0;
    const floatingButton = document.querySelector('.new_convo_icon.mobile-only');
    if (floatingButton) {
        chatBody.addEventListener('scroll', () => {
            const st = chatBody.scrollTop;
            if (st > lastScrollTop && st > 100) {
                // Scrolling down - hide button
                floatingButton.style.transform = 'translateY(80px)';
            } else {
                // Scrolling up - show button
                floatingButton.style.transform = 'translateY(0)';
            }
            lastScrollTop = st;
        }, { passive: true });
    }
}