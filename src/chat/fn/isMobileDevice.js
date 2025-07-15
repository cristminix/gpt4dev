// // Adaptive Media Content Display
// // Function to adjust media content based on screen size and orientation
// function adjustMediaContentForOrientation() {
//   const isLandscape = window.innerWidth > window.innerHeight;
//   const mediaElements = document.querySelectorAll('.message .content img, .message .content video');
//   mediaElements.forEach(media => {
//     // Reset styles first
//     media.style.maxWidth = '';
//     media.style.maxHeight = '';
//     // Get natural dimensions
//     const naturalWidth = media.naturalWidth || media.videoWidth || 400;
//     const naturalHeight = media.naturalHeight || media.videoHeight || 300;
//     const aspectRatio = naturalWidth / naturalHeight;
//     if (isLandscape) {
//       // In landscape, prioritize height
//       media.style.maxHeight = '70vh';
//       media.style.maxWidth = '90vw';
//     } else {
//       // In portrait, limit width more strictly
//       media.style.maxWidth = '95vw';
//       media.style.maxHeight = '50vh';
//     }
//     // Add special class for better display
//     media.classList.add('adaptive-media');
//   });
// }
// // Function to enhance image viewing experience
// function enhanceMobileImageViewing() {
//   // Improve image tap behavior
//   document.addEventListener('click', e => {
//     const target = e.target;
//     // Check if clicked element is an image in a message
//     if (target.tagName === 'IMG' && target.closest('.message')) {
//       // Don't apply to avatar images
//       if (target.alt === 'your avatar') return;
//       // Toggle fullscreen-like view
//       if (target.classList.contains('expanded-view')) {
//         target.classList.remove('expanded-view');
//       } else {
//         // Remove expanded view from any other images
//         document.querySelectorAll('.expanded-view').forEach(img => {
//           img.classList.remove('expanded-view');
//         });
//         target.classList.add('expanded-view');
//       }
//     } else if (!target.closest('img.expanded-view')) {
//       // Close expanded view when clicking elsewhere
//       document.querySelectorAll('.expanded-view').forEach(img => {
//         img.classList.remove('expanded-view');
//       });
//     }
//   });
// }
// // Register these functions to run after content is loaded
// function registerMediaEnhancements() {
//   // Run initially
//   adjustMediaContentForOrientation();
//   enhanceMobileImageViewing();
//   // Also run when new messages are added
//   const originalRegisterMessageImages = register_message_images;
//   register_message_images = function() {
//     originalRegisterMessageImages();
//     adjustMediaContentForOrientation();
//   };
//   // And when window is resized
//   window.addEventListener('resize', adjustMediaContentForOrientation);
// }
// Add this to the window load event
// window.addEventListener('load', registerMediaEnhancements);
// Mobile Experience Initialization
// Function to check if device is mobile
export function isMobileDevice() {
    return window.matchMedia('(max-width: 640px)').matches ||
        window.matchMedia('(pointer: coarse)').matches;
}
