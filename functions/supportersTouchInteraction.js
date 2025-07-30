/**
 * Touch interaction for supporters page
 * On mobile devices, tablets and iPads, tapping a supporter card will directly navigate to 
 * the company website (description overlays are hidden via CSS)
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if the device is mobile, tablet, or iPad
    function isTabletOrMobile() {
        // First check screen width for mobile/tablet
        const isMobileWidth = window.innerWidth <= 768;
        
        // Then check if it's an iPad specifically (even if screen width > 768px)
        const userAgent = navigator.userAgent.toLowerCase();
        const isIPad = /ipad/.test(userAgent) || 
                      (/macintosh/.test(userAgent) && 'ontouchend' in document); // Modern iPads with desktop mode
        
        return isMobileWidth || isIPad;
    }
    
    // Track window resizing to handle orientation changes
    window.addEventListener('resize', function() {
        updateCardBehavior();
    });
    
    // Get all supporter cards
    const supporterCards = document.querySelectorAll('.card');
    
    function updateCardBehavior() {
        const isTabletMode = isTabletOrMobile();
        
        // Update visual indication
        supporterCards.forEach(card => {
            if (isTabletMode) {
                card.classList.add('tablet-clickable');
            } else {
                card.classList.remove('tablet-clickable');
            }
        });
    }
    
    // Initialize card behavior based on current screen size
    updateCardBehavior();
    
    // For each card, add a click event listener
    supporterCards.forEach(card => {
        card.addEventListener('click', function(event) {
            // Apply direct link behavior on mobile, tablet, and iPad devices
            if (isTabletOrMobile()) {
                // Find the "Read More" link in this card
                const readMoreLink = card.querySelector('.read-more');
                
                if (readMoreLink) {
                    // Get the URL from the link
                    const websiteUrl = readMoreLink.getAttribute('href');
                    
                    // If URL exists, navigate to it
                    if (websiteUrl) {
                        // Prevent any default behavior
                        event.preventDefault();
                        event.stopPropagation();
                        
                        // Add visual feedback for the tap
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.transform = '';
                            
                            // Open in new tab like the original link
                            window.open(websiteUrl, '_blank');
                        }, 150);
                    }
                }
            }
        });
        
        // Add touch feedback animations
        card.addEventListener('touchstart', function() {
            if (isTabletOrMobile()) {
                this.style.transform = 'scale(0.95)';
            }
        });
        
        card.addEventListener('touchend', function() {
            if (isTabletOrMobile()) {
                this.style.transform = '';
            }
        });
        
        card.addEventListener('touchcancel', function() {
            if (isTabletOrMobile()) {
                this.style.transform = '';
            }
        });
    });
});