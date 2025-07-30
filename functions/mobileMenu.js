// Mobile Menu Functionality

document.addEventListener('DOMContentLoaded', function() {
    // First remove any existing menu buttons to prevent duplicates
    const existingBtn = document.querySelector('.mobile-menu-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Create a mobile menu button and add it to the body
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
    document.body.appendChild(mobileMenuBtn);
    
    // Get the nav items container
    const navItems = document.querySelector('.nav-items');
    
    // Get the flags container
    const flagsContainer = document.querySelector('.nav-links .flags');
    
    // IMPORTANT: Ensure menu starts closed
    if (navItems) {
        navItems.classList.remove('mobile-active');
    }
    
    // Check if we're on a mobile or tablet device
    const isMobileOrTablet = window.innerWidth <= 992;
    
    // Hide flags in top bar on mobile/tablet, as per the requirement
    if (flagsContainer && isMobileOrTablet) {
        // Instead of just removing the flags-hidden class, always hide the top bar flags on mobile/tablet
        flagsContainer.classList.add('flags-hidden');
    } else if (flagsContainer) {
        // Desktop view - ensure flags are visible
        flagsContainer.classList.remove('flags-hidden');
    }
    
    // Check if we're in Greek language mode
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const isGreekMobile = currentLang === 'el' && isMobileOrTablet;
    
    // Add flags to the mobile menu
    if (navItems && flagsContainer) {
        // Create a container for the mobile menu flags
        const mobileMenuFlags = document.createElement('div');
        mobileMenuFlags.className = 'mobile-menu-flags';
        
        // For Greek mobile pages, force English top bar elements
        if (currentLang === 'el' && isMobileOrTablet) {
            // Create a new flags container mimicking the English top bar
            const englishFlagsContainer = document.createElement('div');
            englishFlagsContainer.className = 'flags mobile-flags';
            
            // Add English flag (make it active)
            const englishFlag = document.createElement('img');
            englishFlag.src = "Icons/Flag_of_the_United_Kingdom.svg";
            englishFlag.alt = "English";
            englishFlag.className = "flag";
            englishFlag.onclick = function() {
                changeLanguage('en');
            };
            
            // Add Greek flag (make it active since we're in Greek mode)
            const greekFlag = document.createElement('img');
            greekFlag.src = "Icons/Flag_of_Greece.svg";
            greekFlag.alt = "Greek";
            greekFlag.className = "flag active";
            greekFlag.onclick = function() {
                changeLanguage('el');
            };
            
            // Append flags to the container
            englishFlagsContainer.appendChild(englishFlag);
            englishFlagsContainer.appendChild(greekFlag);
            
            // Append the new English-style container to mobile menu
            mobileMenuFlags.appendChild(englishFlagsContainer);
            
            // REMOVED: UTH and IEEE logos from mobile menu as per user request
            /*
            // Add UTH and IEEE logos to the mobile menu for Greek version
            const mobileLogoContainer = document.createElement('div');
            mobileLogoContainer.className = 'mobile-menu-logos';
            mobileLogoContainer.style.display = 'flex';
            mobileLogoContainer.style.justifyContent = 'center';
            mobileLogoContainer.style.alignItems = 'center';
            mobileLogoContainer.style.width = '100%';
            mobileLogoContainer.style.marginTop = '20px';
            mobileLogoContainer.style.marginBottom = '10px';
            
            // Create UTH logo
            const uthLogo = document.createElement('a');
            uthLogo.href = "https://www.uth.gr/";
            uthLogo.target = "_blank";
            uthLogo.rel = "noopener noreferrer";
            uthLogo.style.margin = '0 15px';
            uthLogo.style.display = 'flex';
            uthLogo.style.justifyContent = 'center';
            
            const uthImg = document.createElement('img');
            uthImg.src = "Icons/UTH_greek_logo.svg";
            uthImg.alt = "University of Thessaly";
            uthImg.className = "partner-logo";
            uthImg.style.height = '40px';
            
            uthLogo.appendChild(uthImg);
            
            // Create IEEE logo
            const ieeeLogo = document.createElement('a');
            ieeeLogo.href = "https://ieee-sb.uth.gr/";
            ieeeLogo.target = "_blank";
            ieeeLogo.rel = "noopener noreferrer";
            ieeeLogo.style.margin = '0 15px';
            ieeeLogo.style.display = 'flex';
            ieeeLogo.style.justifyContent = 'center';
            
            const ieeeImg = document.createElement('img');
            ieeeImg.src = "Icons/ieee_sb.svg";
            ieeeImg.alt = "IEEE Student Branch UTH";
            ieeeImg.className = "partner-logo";
            ieeeImg.style.height = '40px';
            
            ieeeLogo.appendChild(ieeeImg);
            
            // Add logos to container
            mobileLogoContainer.appendChild(uthLogo);
            mobileLogoContainer.appendChild(ieeeLogo);
            
            // Append logo container to the mobile menu
            mobileMenuFlags.appendChild(mobileLogoContainer);
            */
        } else {
            // For English pages or desktop view, use the standard behavior
            // Clone the flags from the top bar
            const flagsClone = flagsContainer.cloneNode(true);
            flagsClone.classList.add('mobile-flags');
            
            // Append the cloned flags to the mobile menu
            mobileMenuFlags.appendChild(flagsClone);
            
            // Make sure the click events still work on cloned flags
            const mobileFlagElements = flagsClone.querySelectorAll('.flag');
            mobileFlagElements.forEach(flag => {
                if (flag.getAttribute('onclick')) {
                    const languageMatch = flag.getAttribute('onclick').match(/'([^']+)'/);
                    if (languageMatch && languageMatch[1]) {
                        const language = languageMatch[1];
                        flag.onclick = function() {
                            changeLanguage(language);
                        };
                    }
                }
            });
        }
        
        navItems.appendChild(mobileMenuFlags);
    }
    
    // Get the navigation bar and its elements
    const navLinks = document.querySelector('.nav-links');
    const partnerLogos = document.querySelector('.partner-logos');
    
    // Handle partner logos in mobile view
    if (isMobileOrTablet && partnerLogos) {
        // Show partner logos in top bar for all mobile versions (both English and Greek)
        partnerLogos.style.display = 'flex';
        
        // Position partner logos for mobile version
        partnerLogos.style.marginLeft = '8px';
        partnerLogos.style.marginRight = '30px';
        
        // Match logo sizes with mobile version
        const partnerLogoImgs = partnerLogos.querySelectorAll('.partner-logo');
        partnerLogoImgs.forEach(logo => {
            logo.style.height = '35px';
            logo.style.margin = '0 1px';
        });
        
        // Fix overall nav-links styling
        if (navLinks) {
            navLinks.style.padding = '5px 5px 5px 0';
            navLinks.style.justifyContent = 'flex-start';
        }
    }
    
    // Make sure button is visible on mobile only
    if (isMobileOrTablet) {
        mobileMenuBtn.style.display = 'block';
    } else {
        mobileMenuBtn.style.display = 'none';
    }
    
    // Toggle menu function - defined separately for clarity
    function toggleMenu(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (navItems) {
            // Toggle the class
            if (navItems.classList.contains('mobile-active')) {
                // Currently open, need to close
                navItems.classList.remove('mobile-active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                
                // We no longer need to show/hide the flags when toggling the menu
                // since we're completely removing them from the top bar in mobile view
            } else {
                // Currently closed, need to open
                navItems.classList.add('mobile-active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            }
        }
    }
    
    // Button click handler
    mobileMenuBtn.addEventListener('click', toggleMenu);
    
    // Make menu links close the menu when clicked
    const menuLinks = document.querySelectorAll('.nav-items a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            navItems.classList.remove('mobile-active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            // We no longer need to show/hide the flags when closing the menu
            // since we're completely removing them from the top bar in mobile view
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navItems && navItems.classList.contains('mobile-active') && 
            !event.target.closest('.nav-items') && 
            !event.target.closest('.mobile-menu-btn')) {
            navItems.classList.remove('mobile-active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            // We no longer need to show/hide the flags when closing the menu
            // since we're completely removing them from the top bar in mobile view
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Update the mobile/tablet detection
        const isMobileOrTablet = window.innerWidth <= 992;
        
        // Check if we need to update Greek mobile partner logos on resize
        const isGreekMobile = document.documentElement.getAttribute('lang') === 'el' && isMobileOrTablet;
        
        if (!isMobileOrTablet) {
            // Desktop mode
            // Hide menu and button on desktop
            if (navItems) {
                navItems.classList.remove('mobile-active');
            }
            mobileMenuBtn.style.display = 'none';
            
            // Always show flags in desktop mode
            if (flagsContainer) {
                flagsContainer.classList.remove('flags-hidden');
            }
            
            // Show partner logos in desktop regardless of language
            if (partnerLogos) {
                partnerLogos.style.display = 'flex';
            }
        } else {
            // Mobile/tablet mode
            // Show button
            mobileMenuBtn.style.display = 'block';
            
            // Always hide flags in top bar for mobile
            if (flagsContainer) {
                flagsContainer.classList.add('flags-hidden');
            }
            
            // Update partner logos display for mobile
            if (partnerLogos) {
                // Show partner logos in top bar for all mobile versions (both English and Greek)
                partnerLogos.style.display = 'flex';
                partnerLogos.style.marginLeft = '8px';
                partnerLogos.style.marginRight = '30px';
                
                // Match logo sizes with mobile version
                const partnerLogoImgs = partnerLogos.querySelectorAll('.partner-logo');
                partnerLogoImgs.forEach(logo => {
                    logo.style.height = '35px';
                    logo.style.margin = '0 1px';
                });
            }
            
            // Fix overall nav-links styling
            if (navLinks) {
                navLinks.style.padding = '5px 5px 5px 0';
                navLinks.style.justifyContent = 'flex-start';
            }
        }
    });
});