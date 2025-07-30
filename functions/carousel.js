// Carousel functionality for StarBound website
document.addEventListener('DOMContentLoaded', function() {
    // Get carousel elements
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.nav-dot');
    
    // Variables for carousel operation
    let currentIndex = 0;
    const slidesCount = slides.length;
    let autoScrollInterval;
    
    // Initialize
    initCarousel();
    
    function initCarousel() {
        // Add event listeners to navigation dots
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                // Get the slide index from data attribute
                const slideIndex = parseInt(this.getAttribute('data-index'));
                goToSlide(slideIndex);
            });
        });
        
        // Start auto-scrolling
        startAutoScroll();
        
        // Pause auto-scrolling when hovering over the carousel
        document.querySelector('.carousel').addEventListener('mouseenter', pauseAutoScroll);
        document.querySelector('.carousel').addEventListener('mouseleave', startAutoScroll);
        
        // Initial language localization update
        updateCarouselText();
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) {
            index = slidesCount - 1;
        } else if (index >= slidesCount) {
            index = 0;
        }
        
        // Update the transform to move to the specific slide
        track.style.transform = `translateX(${-index * (100 / slidesCount)}%)`;
        
        // Update the active navigation dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        // Update current index
        currentIndex = index;
    }
    
    // Auto-scroll functionality
    function startAutoScroll() {
        // Clear any existing interval
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
        
        // Set new interval
        autoScrollInterval = setInterval(() => {
            currentIndex++;
            if (currentIndex >= slidesCount) {
                currentIndex = 0;
            }
            goToSlide(currentIndex);
        }, 5000); // Change slide every 5 seconds
    }
    
    // Pause auto-scrolling
    function pauseAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
    
    // Function to update carousel text based on language
    function updateCarouselText() {
        // Get the current language
        const currentLang = document.documentElement.lang || 'en';
        
        // Update titles and headings
        const carouselTitle = document.querySelector('.carousel-title h2');
        if (carouselTitle) {
            carouselTitle.textContent = carouselTitle.getAttribute(`data-${currentLang}`) || carouselTitle.getAttribute('data-en');
        }
        
        // Update all card headings
        const cardHeadings = document.querySelectorAll('.card-content h3');
        cardHeadings.forEach(heading => {
            heading.textContent = heading.getAttribute(`data-${currentLang}`) || heading.getAttribute('data-en');
        });
        
        // Update all card paragraphs
        const cardParagraphs = document.querySelectorAll('.card-content p');
        cardParagraphs.forEach(paragraph => {
            paragraph.textContent = paragraph.getAttribute(`data-${currentLang}`) || paragraph.getAttribute('data-en');
        });
        
        // Update all read more links
        const readMoreLinks = document.querySelectorAll('.read-more');
        readMoreLinks.forEach(link => {
            link.textContent = link.getAttribute(`data-${currentLang}`) || link.getAttribute('data-en');
        });
    }
    
    // Listen for language changes
    document.addEventListener('languageChanged', function() {
        updateCarouselText();
    });
});