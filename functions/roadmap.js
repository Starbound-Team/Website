document.addEventListener('DOMContentLoaded', function() {
    // Get all timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Set animation delay variables for each item
    timelineItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
    
    // Add animation when elements come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observe all timeline items
    timelineItems.forEach(item => {
        observer.observe(item);
    });
});