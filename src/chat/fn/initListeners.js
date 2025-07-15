import { isMobileDevice } from "./isMobileDevice";
import { initMobileEnhancements } from "./initMobileEnhancements"
import { applyMobileEnhancements } from "./applyMobileEnhancements"
import framework from "./framework";
export function initListeners(translationSnipptes) {

    document.addEventListener("DOMContentLoaded", (event) => {
        translationSnipptes.forEach((text) => framework.translate(text));
    });

    // Hotfix for mobile
    document.querySelector(".container").style.maxHeight = window.innerHeight + "px"

    // Initialize mobile enhancements if on mobile device
    document.addEventListener('DOMContentLoaded', () => {
        if (isMobileDevice()) {
            applyMobileEnhancements();
            initMobileEnhancements(); // From previous code
        }

        // Add CSS class based on orientation
        function updateOrientationClass() {
            if (window.innerWidth > window.innerHeight) {
                document.body.classList.add('landscape');
                document.body.classList.remove('portrait');
            } else {
                document.body.classList.add('portrait');
                document.body.classList.remove('landscape');
            }
        }

        updateOrientationClass();
        window.addEventListener('resize', updateOrientationClass);
        window.addEventListener('orientationchange', updateOrientationClass);
    });// Call this function after the DOM is loaded
    window.addEventListener('load', () => {
        if (window.matchMedia('(max-width: 640px)').matches || window.matchMedia('(pointer: coarse)').matches) {
            initMobileEnhancements();
        }
    });
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        // Adjust UI based on new orientation
        setTimeout(() => {
            document.querySelector(".container").style.maxHeight = window.innerHeight + "px";

            // Adjust media content display
            // adjustMediaContentForOrientation();
        }, 200);
    });



}
