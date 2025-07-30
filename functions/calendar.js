document.addEventListener('DOMContentLoaded', function() {
    // Calendar data - currently empty, waiting for real team events
    const events = [
        // Add real StarBound team events here
        // Example format:
        // {
        //     id: 1,
        //     title: "Event Title",
        //     titleEl: "Τίτλος Εκδήλωσης",
        //     date: "2025-06-15",
        //     time: "14:00 - 16:00",
        //     description: "Event description in English",
        //     descriptionEl: "Περιγραφή εκδήλωσης στα ελληνικά",
        //     category: "workshop" // or "conference", "presentation"
        // }
    ];

    // DOM Elements
    const monthDisplayEl = document.querySelector('.month-display');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    
    // New carousel elements
    const eventsSlider = document.querySelector('.events-slider');
    const carouselDots = document.querySelector('.carousel-dots');
    const prevEventBtn = document.querySelector('.prev-event');
    const nextEventBtn = document.querySelector('.next-event');

    // Date tracking and carousel state
    // Create a specific date for June 2025 to avoid any calculation issues
    let currentDate = new Date(2025, 5, 1); // June 1st, 2025 (month 5 = June in 0-based indexing)
    
    let currentEvents = [];
    let currentSlide = 0;

    // Initial render
    updateMonthDisplay();
    renderEventsCarousel(getEventsForMonth(currentDate));

    // Event listeners for month navigation
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthDisplay();
        updateMonthIndicator();
        currentSlide = 0; // Reset to first slide when changing months
        renderEventsCarousel(getEventsForMonth(currentDate));
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthDisplay();
        updateMonthIndicator();
        currentSlide = 0; // Reset to first slide when changing months
        renderEventsCarousel(getEventsForMonth(currentDate));
    });

    // Event listeners for carousel navigation
    if (prevEventBtn) {
        prevEventBtn.addEventListener('click', function() {
            navigateCarousel(-1);
        });
    }

    if (nextEventBtn) {
        nextEventBtn.addEventListener('click', function() {
            navigateCarousel(1);
        });
    }

    // Add touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (eventsSlider) {
        eventsSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        eventsSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        // Detect swipe direction
        if (touchEndX < touchStartX) {
            // Swipe left (next)
            navigateCarousel(1);
        } else if (touchEndX > touchStartX) {
            // Swipe right (previous)
            navigateCarousel(-1);
        }
    }

    // Update month display
    function updateMonthDisplay() {
        const currentLang = document.documentElement.lang || 'en';
        
        const monthNames = {
            en: ["January", "February", "March", "April", "May", "June", 
                 "July", "August", "September", "October", "November", "December"],
            el: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", 
                 "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"]
        };
        
        monthDisplayEl.textContent = `${monthNames[currentLang][currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    // Update the month indicator
    function updateMonthIndicator() {
        const currentLang = document.documentElement.lang || 'en';
        
        const monthNames = {
            en: ["January", "February", "March", "April", "May", "June", 
                 "July", "August", "September", "October", "November", "December"],
            el: ["Ιανουάριο", "Φεβρουάριο", "Μάρτιο", "Απρίλιο", "Μάιο", "Ιούνιο", 
                 "Ιούλιο", "Αύγουστο", "Σεπτέμβριο", "Οκτώβριο", "Νοέμβριο", "Δεκέμβριο"]
        };
        
        const monthDisplay = document.querySelector('.current-month-display');
        if (monthDisplay) {
            monthDisplay.textContent = `${monthNames[currentLang][currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        }
        
        // Add a visual indicator of how many events are in this month
        const eventsCount = getEventsForMonth(currentDate).length;
        const monthIndicator = document.querySelector('.month-indicator');
        
        if (monthIndicator) {
            let countText = '';
            if (currentLang === 'el') {
                countText = eventsCount === 1 ? '1 εκδήλωση' : 
                           (eventsCount > 1 ? `${eventsCount} εκδηλώσεις` : 'Καμία εκδήλωση');
                monthIndicator.innerHTML = `Εμφάνιση για <span class="current-month-display">${monthNames[currentLang][currentDate.getMonth()]} ${currentDate.getFullYear()}</span> (${countText})`;
            } else {
                countText = eventsCount === 1 ? '1 event' : 
                           (eventsCount > 1 ? `${eventsCount} events` : 'No events');
                monthIndicator.innerHTML = `Showing <span class="current-month-display">${monthNames[currentLang][currentDate.getMonth()]} ${currentDate.getFullYear()}</span> (${countText})`;
            }
        }
    }

    // Navigate carousel
    function navigateCarousel(direction) {
        if (!currentEvents.length) return;
        
        const newSlide = currentSlide + direction;
        
        // Check bounds
        if (newSlide < 0 || newSlide >= currentEvents.length) return;
        
        currentSlide = newSlide;
        updateCarousel();
    }

    // Update carousel position
    function updateCarousel() {
        if (!eventsSlider) return;
        
        // Update slider position
        eventsSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
        
        // Update navigation buttons
        if (prevEventBtn) {
            prevEventBtn.disabled = currentSlide === 0;
        }
        
        if (nextEventBtn) {
            nextEventBtn.disabled = currentSlide === currentEvents.length - 1;
        }
        
        // Update event counter display
        const counterDisplay = document.querySelector('.event-counter');
        if (counterDisplay && currentEvents.length > 0) {
            counterDisplay.textContent = `${currentSlide + 1}/${currentEvents.length}`;
        }
    }

    // Get events for the current month
    function getEventsForMonth(date) {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === date.getMonth() && 
                   eventDate.getFullYear() === date.getFullYear();
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Render events carousel
    function renderEventsCarousel(events) {
        if (!eventsSlider || !carouselDots) return;
        
        // Update current events
        currentEvents = events;
        currentSlide = 0; // Reset to first slide
        
        // Clear existing content
        eventsSlider.innerHTML = '';
        carouselDots.innerHTML = '';
        
        // Add event counter
        const navContainer = document.querySelector('.carousel-navigation');
        if (navContainer) {
            let counterDisplay = document.querySelector('.event-counter');
            if (!counterDisplay) {
                counterDisplay = document.createElement('div');
                counterDisplay.className = 'event-counter';
                navContainer.appendChild(counterDisplay);
            }
            
            if (events.length > 0) {
                counterDisplay.textContent = `1/${events.length}`;
            } else {
                counterDisplay.textContent = '0/0';
            }
        }
        
        if (events.length === 0) {
            renderNoEvents();
            return;
        }
        
        // Add events to slider
        events.forEach((event, index) => {
            const eventEl = createEventElement(event);
            eventsSlider.appendChild(eventEl);
            
            // Add dot for this event
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.setAttribute('data-index', index);
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
            
            carouselDots.appendChild(dot);
        });
        
        // Add swipe indicator for mobile
        const swipeIndicator = document.createElement('div');
        swipeIndicator.className = 'swipe-indicator';
        swipeIndicator.innerHTML = '→';
        
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer && events.length > 1) {
            const existingIndicator = carouselContainer.querySelector('.swipe-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            carouselContainer.appendChild(swipeIndicator);
            
            // Hide indicator after a few seconds
            setTimeout(() => {
                if (swipeIndicator.parentNode) {
                    swipeIndicator.style.opacity = '0';
                    setTimeout(() => {
                        if (swipeIndicator.parentNode) {
                            swipeIndicator.remove();
                        }
                    }, 1000);
                }
            }, 4000);
        }
        
        // Update navigation button states
        if (prevEventBtn) {
            prevEventBtn.disabled = true; // Disable prev button initially
        }
        
        if (nextEventBtn) {
            nextEventBtn.disabled = events.length <= 1; // Disable next if only one event
        }
    }

    // Create a single event slide element
    function createEventElement(event) {
        const currentLang = document.documentElement.lang || 'en';
        
        const eventSlide = document.createElement('div');
        eventSlide.className = 'carousel-event';
        
        const eventEl = document.createElement('div');
        eventEl.className = 'event-item';
        
        const eventDate = new Date(event.date);
        
        // Month names for both languages
        const monthNames = {
            en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            el: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μάι", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"]
        };
        
        const dayNames = {
            en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            el: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"]
        };
        
        // Create event date section
        const dateEl = document.createElement('div');
        dateEl.className = 'event-date';
        
        const dayEl = document.createElement('div');
        dayEl.className = 'event-day';
        dayEl.textContent = eventDate.getDate();
        dateEl.appendChild(dayEl);
        
        const monthEl = document.createElement('div');
        monthEl.className = 'event-month';
        monthEl.textContent = monthNames[currentLang][eventDate.getMonth()];
        dateEl.appendChild(monthEl);
        
        // Add day of week
        const weekdayEl = document.createElement('div');
        weekdayEl.className = 'event-weekday';
        weekdayEl.textContent = dayNames[currentLang][eventDate.getDay()];
        dateEl.appendChild(weekdayEl);
        
        eventEl.appendChild(dateEl);
        
        // Create event content section
        const contentEl = document.createElement('div');
        contentEl.className = 'event-content';
        
        const titleEl = document.createElement('div');
        titleEl.className = 'event-title';
        titleEl.setAttribute('data-en', event.title);
        titleEl.setAttribute('data-el', event.titleEl || event.title);
        titleEl.textContent = currentLang === 'el' ? (event.titleEl || event.title) : event.title;
        contentEl.appendChild(titleEl);
        
        const timeEl = document.createElement('div');
        timeEl.className = 'event-time';
        timeEl.textContent = event.time;
        contentEl.appendChild(timeEl);
        
        const descEl = document.createElement('div');
        descEl.className = 'event-description';
        descEl.setAttribute('data-en', event.description);
        descEl.setAttribute('data-el', event.descriptionEl || event.description);
        descEl.textContent = currentLang === 'el' ? (event.descriptionEl || event.description) : event.description;
        contentEl.appendChild(descEl);
        
        const categoryEl = document.createElement('div');
        categoryEl.className = `event-category category-${event.category}`;
        
        let categoryText = '';
        switch(event.category) {
            case 'workshop':
                categoryText = currentLang === 'el' ? 'Εργαστήριο' : 'Workshop';
                break;
            case 'conference':
                categoryText = currentLang === 'el' ? 'Συνέδριο' : 'Conference';
                break;
            case 'presentation':
                categoryText = currentLang === 'el' ? 'Παρουσίαση' : 'Presentation';
                break;
            default:
                categoryText = event.category;
        }
        
        categoryEl.textContent = categoryText;
        contentEl.appendChild(categoryEl);
        
        eventEl.appendChild(contentEl);
        eventSlide.appendChild(eventEl);
        
        return eventSlide;
    }

    // Render no events message
    function renderNoEvents() {
        const eventSlide = document.createElement('div');
        eventSlide.className = 'carousel-event';
        
        const noEventsEl = document.createElement('div');
        noEventsEl.className = 'no-events';
        
        const currentLang = document.documentElement.lang || 'en';
        if (currentLang === 'el') {
            noEventsEl.textContent = 'Δεν υπάρχουν προγραμματισμένες εκδηλώσεις για αυτό τον μήνα';
        } else {
            noEventsEl.textContent = 'No events scheduled for this month';
        }
        
        eventSlide.appendChild(noEventsEl);
        eventsSlider.appendChild(eventSlide);
        
        // Disable navigation buttons
        if (prevEventBtn) prevEventBtn.disabled = true;
        if (nextEventBtn) nextEventBtn.disabled = true;
    }

    // Listen for language change events
    document.addEventListener('languageChanged', function() {
        // Update the display when language changes
        updateMonthDisplay();
        updateMonthIndicator();
        renderEventsCarousel(getEventsForMonth(currentDate));
    });
});