// Code to run when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check for language parameter in URL first
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam === 'el' || langParam === 'en') {
        // URL parameter takes precedence
        changeLanguage(langParam);
    } else {
        // Check if there's a stored language preference
        const preferredLanguage = localStorage.getItem('preferredLanguage');
        if (preferredLanguage) {
            changeLanguage(preferredLanguage);
        } else {
            // If no stored preference, default to English
            changeLanguage('en');
        }
    }

    // Add click event listeners to language flags
    const greekFlag = document.querySelector('.flag[alt="Greek"]');
    const englishFlag = document.querySelector('.flag[alt="English"]');
    
    if (greekFlag) {
        greekFlag.onclick = function() {
            // Update URL with language parameter and reload
            const url = new URL(window.location.href);
            url.searchParams.set('lang', 'el');
            window.location.href = url.toString();
        };
    }
    
    if (englishFlag) {
        englishFlag.onclick = function() {
            // Update URL with language parameter and reload
            const url = new URL(window.location.href);
            url.searchParams.set('lang', 'en');
            window.location.href = url.toString();
        };
    }
});

// Language change function
function changeLanguage(language) {
    // Update the <html> lang attribute
    if (language === 'en' || language === 'el') {
        document.documentElement.setAttribute('lang', language);
        // Store language preference in localStorage
        localStorage.setItem('preferredLanguage', language);
        
        // Update all navigation links to include the language parameter
        updateNavigationLinks(language);
    }
    
    // Update all translatable content after language change
    updateAllTranslations();

    // Special handling for the contact button in the hero section
    const contactButton = document.querySelector('.hero-cta .secondary.contact-button');
    if (contactButton) {
        contactButton.href = `contact.html?lang=${language}`;
    }
}

// New function to update navigation links with language parameter
function updateNavigationLinks(language) {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        // Skip external links
        if (link.href.startsWith('http') && !link.href.includes(window.location.host)) {
            return;
        }
        
        // Skip links with no href or javascript: hrefs
        if (!link.getAttribute('href') || link.getAttribute('href').startsWith('javascript:')) {
            return;
        }
        
        // Get the current href and parse it
        const url = new URL(link.href);
        
        // Set or update the language parameter
        url.searchParams.set('lang', language);
        
        // Update the link
        link.href = url.toString();
    });
}

// Function to update all translatable elements
function updateAllTranslations() {
    // Update navigation text (keeping your existing code)
    updateNavigationText();
    
    // Find all elements with data-translate attribute
    const translatableElements = document.querySelectorAll('[data-translate]');
    
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = getLocalizedString(key);
    });
    
    // Handle elements that need HTML translation (not just text)
    const htmlTranslatableElements = document.querySelectorAll('[data-translate-html]');
    
    htmlTranslatableElements.forEach(element => {
        const key = element.getAttribute('data-translate-html');
        element.innerHTML = getLocalizedString(key);
    });
    
    // Handle placeholders in input fields
    const inputElements = document.querySelectorAll('input[data-translate-placeholder], textarea[data-translate-placeholder]');
    
    inputElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = getLocalizedString(key);
    });
    
    // Handle elements with special dynamic content
    updateDynamicContent();

    // Update elements with direct data-en and data-el attributes
    updateDirectTranslations();

    // Update language-specific links
    updateLanguageSpecificLinks();

    // Update news cards content
    updateNewsCards();
    
    // Update dates in news articles
    updateNewsDates();
    
    // Update window title
    updateWindowTitle();
}

// New function to update the window title based on current page
function updateWindowTitle() {
    const currentLang = document.documentElement.lang || 'en';
    const currentPage = getCurrentPage();
    
    // Get the appropriate title translation based on the current page
    const titleKey = `title_${currentPage}`;
    const translatedTitle = getLocalizedString(titleKey);
    
    // Update the document title
    document.title = translatedTitle;
}

// Helper function to determine the current page based on the URL
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || filename === '' || filename === 'index.html') {
        return 'home';
    } else {
        return filename.replace('.html', '');
    }
}

// Function to update news cards with translations
function updateNewsCards() {
    const currentLang = document.documentElement.lang || 'en';
    
    // Update category tags
    document.querySelectorAll('.category-tag').forEach(tag => {
        const categoryType = tag.classList[1].replace('-tag', '');
        tag.textContent = getLocalizedString(categoryType);
    });

    // Update all news card content
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        const title = card.querySelector('h3');
        const content = card.querySelector('p');
        const readMoreLink = card.querySelector('.read-more');
        
        // Skip if elements don't exist
        if (!title || !content) return;
        
        if (currentLang === 'el') {
            // If card has data attributes with translations, use them
            if (title.getAttribute('data-el')) {
                title.textContent = title.getAttribute('data-el');
            } else if (newsCardTranslations[title.textContent]) {
                // Otherwise use the translations dictionary
                title.textContent = newsCardTranslations[title.textContent];
            }
            
            if (content.getAttribute('data-el')) {
                content.textContent = content.getAttribute('data-el');
            } else if (newsCardTranslations[content.textContent]) {
                content.textContent = newsCardTranslations[content.textContent];
            }
        } else if (currentLang === 'en') {
            // Restore English content
            if (title.getAttribute('data-en')) {
                title.textContent = title.getAttribute('data-en');
            }
            
            if (content.getAttribute('data-en')) {
                content.textContent = content.getAttribute('data-en');
            }
        }
        
        // Update Read More text
        if (readMoreLink) {
            readMoreLink.textContent = getLocalizedString('readMore');
        }
    });
}

// Dictionary of news card translations
const newsCardTranslations = {
    // News titles translations
    "CubeSat Project Reaches Key Development Milestone": "Το Έργο CubeSat Φτάνει σε Σημαντικό Ορόσημο Ανάπτυξης",
    "New Thermal Vacuum Chamber Installed in Lab": "Νέος Θάλαμος Θερμικού Κενού Εγκαταστάθηκε στο Εργαστήριο",
    "StarBound to Present at International Space Conference": "Η StarBound θα Παρουσιάσει στο Διεθνές Συνέδριο Διαστήματος",
    "Open Positions for Summer Internships": "Ανοιχτές Θέσεις για Καλοκαιρινή Πρακτική Άσκηση",
    "New Research Paper Published on Small Satellite Propulsion": "Νέα Επιστημονική Δημοσίευση για Προώθηση Μικροδορυφόρων",
    "AeroTech Industries Joins as Gold Sponsor": "Η AeroTech Industries Γίνεται Χρυσός Χορηγός",
    
    // News content translations
    "The StarBound CubeSat team has successfully completed the integration of the primary payload system, marking a significant milestone in the development timeline.": "Η ομάδα CubeSat της StarBound ολοκλήρωσε με επιτυχία την ενσωμάτωση του κύριου συστήματος ωφέλιμου φορτίου, σηματοδοτώντας ένα σημαντικό ορόσημο στο χρονοδιάγραμμα ανάπτυξης.",
    "StarBound's lab facilities have been enhanced with a new thermal vacuum chamber, enabling advanced space environment testing for our components.": "Οι εργαστηριακές εγκαταστάσεις της StarBound έχουν αναβαθμιστεί με έναν νέο θάλαμο θερμικού κενού, επιτρέποντας προηγμένες δοκιμές διαστημικού περιβάλλοντος για τα εξαρτήματά μας.",
    "Our team will be presenting our latest research on affordable propulsion technologies at the International Space Conference next month.": "Η ομάδα μας θα παρουσιάσει την τελευταία μας έρευνα σχετικά με οικονομικά προσιτές τεχνολογίες προώθησης στο Διεθνές Συνέδριο Διαστήματος τον επόμενο μήνα.",
    "StarBound is now accepting applications for summer internships in various aerospace engineering disciplines, offering students valuable hands-on experience.": "Η StarBound δέχεται τώρα αιτήσεις για καλοκαιρινές πρακτικές ασκήσεις σε διάφορους τομείς αεροδιαστημικής μηχανικής, προσφέροντας στους φοιτητές πολύτιμη πρακτική εμπειρία.",
    "StarBound researchers have published a peer-reviewed paper detailing innovations in small satellite propulsion systems in the Journal of Aerospace Engineering.": "Οι ερευνητές της StarBound δημοσίευσαν μια επιστημονική εργασία που περιγράφει καινοτομίες στα συστήματα προώθησης μικροδορυφόρων στο Journal of Aerospace Engineering.",
    "We are thrilled to announce that AeroTech Industries has become a Gold Sponsor of the StarBound team, providing essential funding and technical resources.": "Είμαστε ενθουσιασμένοι να ανακοινώσουμε ότι η AeroTech Industries έγινε Χρυσός Χορηγός της ομάδας StarBound, παρέχοντας βασική χρηματοδότηση και τεχνικούς πόρους."
};

// Function to update elements with direct language attributes
function updateDirectTranslations() {
    const currentLang = document.documentElement.lang || 'en';
    const elements = document.querySelectorAll(`[data-${currentLang}]`);
    
    elements.forEach(element => {
        const translation = element.getAttribute(`data-${currentLang}`);
        if (translation) {
            // Check if this is an image element and if the translation looks like a path
            if (element.tagName.toLowerCase() === 'img' && translation.includes('/')) {
                // Update the src attribute for images
                element.src = translation;
            } else {
                // Use innerHTML instead of textContent to properly render HTML tags
                element.innerHTML = translation;
            }
        }
    });
}

// Function to update language-specific links
function updateLanguageSpecificLinks() {
    const currentLang = document.documentElement.lang || 'en';
    
    // Find all elements with language-specific link data attributes
    const elementsWithLanguageLinks = document.querySelectorAll('[data-link-en], [data-link-el]');
    
    elementsWithLanguageLinks.forEach(element => {
        const linkAttribute = `data-link-${currentLang}`;
        const languageSpecificUrl = element.getAttribute(linkAttribute);
        
        if (languageSpecificUrl) {
            element.href = languageSpecificUrl;
        }
    });
}

// Keep your existing updateNavigationText function
function updateNavigationText() {
    // Update all navigation links with their localized text
    const navLinks = {
        "Home": "home",
        "Our Team": "ourTeam",
        "Supporters": "supporters", 
        "Lab": "lab",
        "Contact": "contact",
        "News": "news",
        "Join Us": "joinUs"
    };
    
    // Loop through all navigation links and update them
    for (const [englishText, translationKey] of Object.entries(navLinks)) {
        const navLink = document.querySelector(`.nav-links li a[data-en="${englishText}"]`);
        if (navLink) {
            navLink.textContent = getLocalizedString(translationKey);
        }
    }
}

// Handle any dynamic content that needs special translation logic
function updateDynamicContent() {
    // News items
    const newsHeaders = document.querySelectorAll('.news-column h2');
    if (newsHeaders.length > 0) {
        updateNewsHeaders(newsHeaders);
    }
    
    // Page titles and subtitles
    const pageTitle = document.querySelector('.page-header .title');
    if (pageTitle) {
        pageTitle.textContent = getLocalizedString(pageTitle.getAttribute('data-translate') || 'pageTitle');
    }
    
    const pageSubtitle = document.querySelector('.page-header .subtitle');
    if (pageSubtitle) {
        pageSubtitle.textContent = getLocalizedString(pageSubtitle.getAttribute('data-translate') || 'pageSubtitle');
    }

    // Update company subtitle
    const companySubtitle = document.querySelector('.company-subtitle');
    if (companySubtitle) {
        companySubtitle.textContent = getLocalizedString('companySubtitle');
    }
    
    // Other special dynamic elements can be added here
}

// Special function to update news headers
function updateNewsHeaders(headers) {
    const translations = {
        'Most Recent': 'mostRecent',
        '2nd Most Recent': 'secondMostRecent',
        '3rd Most Recent': 'thirdMostRecent'
        // Add other header translations as needed
    };
    
    headers.forEach(header => {
        const englishText = header.textContent;
        if (translations[englishText]) {
            header.textContent = getLocalizedString(translations[englishText]);
        }
    });
}

// Function to update dates in news articles
function updateNewsDates() {
    const currentLang = document.documentElement.lang || 'en';
    if (currentLang === 'el') {
        // Find all news date elements
        const newsDateElements = document.querySelectorAll('.news-date');
        
        newsDateElements.forEach(dateElement => {
            // Get the original English date
            const englishDate = dateElement.textContent;
            // Replace with Greek date format
            dateElement.textContent = translateDate(englishDate);
        });
    }
}

// Dictionary for month translations from English to Greek
const monthTranslations = {
    'January': 'Ιανουαρίου',
    'February': 'Φεβρουαρίου',
    'March': 'Μαρτίου',
    'April': 'Απριλίου',
    'May': 'Μαΐου',
    'June': 'Ιουνίου',
    'July': 'Ιουλίου',
    'August': 'Αυγούστου',
    'September': 'Σεπτεμβρίου',
    'October': 'Οκτωβρίου',
    'November': 'Νοεμβρίου',
    'December': 'Δεκεμβρίου'
};

// Function to translate dates from English to Greek format
function translateDate(englishDate) {
    // Format: "Month DD, YYYY" to "DD Μήνας YYYY"
    const parts = englishDate.match(/([A-Za-z]+)\s+(\d+),\s+(\d+)/);
    if (!parts) return englishDate;
    
    const month = parts[1];
    const day = parts[2];
    const year = parts[3];
    
    if (monthTranslations[month]) {
        return `${day} ${monthTranslations[month]}, ${year}`;
    }
    
    return englishDate;
}

// Expand the getLocalizedString function with more translations
function getLocalizedString(key) {
    // Get the current language from the lang attribute
    const currentLang = document.documentElement.lang || 'en';

    const translations = {
        en: {
            // Navigation (existing)
            home: "Home",
            ourTeam: "Our Team",
            supporters: "Supporters",
            lab: "Lab",
            contact: "Contact",
            news: "News",
            joinUs: "Join Us",
            
            // Page titles
            pageTitle: "Latest News",
            pageSubtitle: "Updates from StarBound Team",
            contactUsTitle: "Contact Us",
            teamTitle: "Our Team",
            supportersTitle: "Our Supporters",
            
            // Window titles (new)
            title_home: "Home - StarBound",
            title_members: "Our Team - StarBound",
            title_news: "News - StarBound",
            title_supporters: "Supporters - StarBound",
            title_contact: "Contact - StarBound",
            
            // Company info
            companySubtitle: "An Aerospace Research Student Team",
            
            // News related
            mostRecent: "Most Recent",
            secondMostRecent: "2nd Most Recent",
            thirdMostRecent: "3rd Most Recent",
            readMore: "Read More",
            moreNews: "More News",
            filterBy: "Filter by:",
            allCategories: "All Categories",
            projects: "Projects",
            labs: "Labs",
            events: "Events",
            recruitment: "Recruitment",
            articles: "Articles",
            supporters: "Supporters",
            allTime: "All Time",
            pastMonth: "Past Month",
            pastQuarter: "Past 3 Months",
            pastYear: "Past Year",
            search: "Search news...",
            
            // Pagination
            next: "Next",
            previous: "Previous",
            
            // Common buttons & labels
            submit: "Submit",
            send: "Send",
            search: "Search",
            noResults: "No results found",
            
            // Contact form
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message",
            
            // Supporters categories
            galaxy: "Galaxy",
            gold: "Gold",
            silver: "Silver",
            bronze: "Bronze",
            collaborators: "Collaborators",
            
            // Supporter descriptions
            xexasproDescription: "XEXASPRO is a fast-growing industrial laundry company specializing in professional cleaning and linen services for hotels, ski resorts, tourist accommodations, and large-scale catering venues.",
            altairDescription: "Altair is a leading technology company providing advanced engineering software and cloud solutions for simulation, high-performance computing, and artificial intelligence.",
            semianovaDescription: "SEMIANOVA Language School specializes in teaching foreign languages — especially Russian — in collaboration with Moscow's RUDN University, boasting a 100% success rate in language certification exams and offering both in-person and online classes supported by a textbook authored by the instructor.",
            
            // Team section titles
            board: "Board",
            softwareEmbedded: "Software & Embedded Systems",
            electrical: "Electrical",
            mechanical: "Mechanical",
            finance: "Finance",
            marketing: "Marketing",
            activities: "Activities",
            ourTeamMembers: "Our Team Members",

            // Member roles
            teamLead: "Team Lead",
            subteamLead: "Subteam Lead",
            academicLead: "Academic Lead",
            vicePresident: "Vice President",
            secretary: "Secretary",
            treasurerSecretary: "Treasurer / Secretary",
            professor: "Professor",
            teamMember: "Team Member",
            subteamMember: "Subteam Member",

            // News card section titles
            cubesat: "CubeSat",
            newEquipment: "New Equipment",
            newSponsor: "New Sponsor",

            // Contact page translations
            nameInput: "Enter your name...",
            topicInput: "Enter the topic...",
            messageInput: "Your message to StarBound..."
        },
        el: {
            // Navigation (existing)
            home: "Αρχική",
            ourTeam: "Η Ομάδα μας",
            supporters: "Υποστηρικτές",
            lab: "Εργαστήριο",
            contact: "Επικοινωνία",
            news: "Νέα",
            joinUs: "Γίνε Μέλος",
            
            // Window titles (new)
            title_home: "Αρχική - StarBound",
            title_members: "Η Ομάδα μας - StarBound",
            title_news: "Νέα - StarBound",
            title_supporters: "Υποστηρικτές - StarBound",
            title_contact: "Επικοινωνία - StarBound",
            
            // Page titles
            pageTitle: "Τελευταία Νέα",
            pageSubtitle: "Ενημερώσεις από την Ομάδα StarBound",
            contactUsTitle: "Επικοινωνήστε Μαζί μας",
            teamTitle: "Η Ομάδα μας",
            supportersTitle: "Οι Υποστηρικτές μας",
            
            // Company info
            companySubtitle: "Μια Φοιτητική Ομάδα Αεροδιαστημικής Έρευνας",
            
            // News related
            mostRecent: "Πιο Πρόσφατο",
            secondMostRecent: "2ο Πιο Πρόσφατο",
            thirdMostRecent: "3ο Πιο Πρόσφατο",
            readMore: "Περισσότερα",
            moreNews: "Όλα τα Νέα",
            filterBy: "Φιλτράρισμα κατά:",
            allCategories: "Όλες οι Κατηγορίες",
            projects: "Έργα",
            labs: "Εργαστήρια",
            events: "Εκδηλώσεις",
            recruitment: "Προσλήψεις",
            articles: "Άρθρα",
            supporters: "Υποστηρικτές",
            allTime: "Όλες οι περίοδοι",
            pastMonth: "Τελευταίος μήνας",
            pastQuarter: "Τελευταίο τρίμηνο",
            pastYear: "Τελευταίο έτος",
            search: "Αναζήτηση νέων...",
            
            // Pagination
            next: "Επόμενο",
            previous: "Προηγούμενο",
            
            // Common buttons & labels
            submit: "Υποβολή",
            send: "Αποστολή",
            search: "Αναζήτηση",
            noResults: "Δεν βρέθηκαν αποτελέσματα",
            
            // Contact form
            name: "Όνομα",
            email: "Email",
            subject: "Θέμα",
            message: "Μήνυμα",
            
            // Supporters categories
            galaxy: "Διαγαλαξιακοί",
            gold: "Χρυσοί",
            silver: "Αργυροί",
            bronze: "Χάλκινοι",
            collaborators: "Συνεργάτες",
            
            // Supporter descriptions
            xexasproDescription: "Τα Βιομηχανικά Πλυντήρια ΞΕΞΑΣΠΡΟ είναι μια ταχέως αναπτυσσόμενη εταιρεία βιομηχανικών πλυντηρίων που ειδικεύεται σε επαγγελματικές υπηρεσίες καθαρισμού και ιματισμού για ξενοδοχεία, χιονοδρομικά κέντρα, τουριστικά καταλύματα και μαζικών χώρων εστίασης.",
            altairDescription: "Η Altair είναι μια κορυφαία εταιρεία τεχνολογίας που παρέχει προηγμένο λογισμικό μηχανικής και λύσεις cloud για προσομοίωση, υπολογιστική υψηλής απόδοσης και τεχνητή νοημοσύνη.",
            semianovaDescription: "Το Φροντιστήριο Ξένων Γλωσσών SEMIANOVA ειδικεύεται στη διδασκαλία ξένων γλωσσών — ιδιαίτερα της Ρωσικής — σε συνεργασία με το Πανεπιστήμιο RUDN της Μόσχας, με 100% επιτυχία στις εξετάσεις πιστοποίησης γλωσσών και προσφέρει τόσο δια ζώσης όσο και διαδικτυακά μαθήματα με την υποστήριξη διδακτικού βιβλίου που έχει συντάξει η διδάσκουσα.",
            
            // Team section titles
            board: "Διοικητικό Συμβούλιο",
            softwareEmbedded: "Λογισμικό & Ενσωματωμένα Συστήματα",
            electrical: "Ηλεκτρολογικό",
            mechanical: "Μηχανολογικό",
            finance: "Οικονομικά",
            marketing: "Μάρκετινγκ",
            activities: "Δραστηριότητες",
            ourTeamMembers: "Τα Μέλη της Ομάδας μας",

            // Member roles
            teamLead: "Επικεφαλής Ομάδας",
            subteamLead: "Επικεφαλής Υποομάδας",
            academicLead: "Ακαδημαϊκός Υπεύθυνος",
            vicePresident: "Αντιπρόεδρος",
            secretary: "Γραμματέας",
            treasurerSecretary: "Ταμίας / Γραμματέας",
            professor: "Καθηγητής",
            teamMember: "Μέλος Ομάδας",
            subteamMember: "Μέλος Υποομάδας",

            // News card section titles
            cubesat: "Δορυφόρος CubeSat",
            newEquipment: "Νέος Εξοπλισμός",
            newSponsor: "Νέος Χορηγός",

            // Contact page translations
            nameInput: "Εισάγετε το όνομά σας...",
            topicInput: "Εισάγετε το θέμα...",
            messageInput: "Το μήνυμά σας προς την StarBound..."
        }
    };
    
    // Return the translation or fall back to the key if no translation exists
    return translations[currentLang]?.[key] || key;
}

// Function to initialize language based on saved preference or browser settings
function initializeLanguage() {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedLanguage) {
        // Use saved language preference
        changeLanguage(savedLanguage);
    } else {
        // Try to detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Check if the browser language starts with 'el' (Greek)
        if (browserLang.startsWith('el')) {
            changeLanguage('el');
        } else {
            // Default to English
            changeLanguage('en');
        }
    }
}

// Run the initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
});


