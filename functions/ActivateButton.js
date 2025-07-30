function setActive(link) {
    // Remove 'active' class from all links
    const links = document.querySelectorAll('.nav-links li a');
    if (!link || !links.length) return; // Guard clause for safety

    // Log the clicked link to the console (optional: can be removed in production)
    if (typeof link.textContent === 'string') {
        console.log('Clicked link:', link.textContent.trim());
    }

    links.forEach(item => {
        item.classList.remove('active');
    });

    // Add 'active' class to the clicked link
    link.classList.add('active');
}