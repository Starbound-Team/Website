document.addEventListener('DOMContentLoaded', function() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initialize animation delay for staggered effects
    animatedElements.forEach((element, index) => {
        element.style.setProperty('--animation-delay', `${index * 0.02}s`);
    });
    
    // Set up the intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If element is in viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15, // Trigger when at least 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly before element enters viewport
    });
    
    // Observe all elements that need to be animated
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Special handling for timeline items since they already have animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.classList.add('animate-on-scroll');
        observer.observe(item);
    });
    
    // Special handling for calendar items
    const calendarEl = document.querySelector('.calendar-section');
    if (calendarEl) {
        const calendarComponents = [
            document.querySelector('.calendar-title'),
            document.querySelector('.calendar-nav'),
            document.querySelector('.calendar-grid'),
            document.querySelector('.events-list')
        ];
        
        calendarComponents.forEach((element, index) => {
            if (element) {
                element.classList.add('animate-on-scroll');
                element.style.setProperty('--animation-delay', `${index * 0.01}s`);
                observer.observe(element);
            }
        });
    }
    
    // Animate project cards in the carousel
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.setProperty('--animation-delay', `${index * 0.02}s`);
        observer.observe(card);
    });
});