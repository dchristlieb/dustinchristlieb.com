document.addEventListener("DOMContentLoaded", function() {

    // === Mobile Navigation Toggle ===
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link'); // Get all nav links

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            // Optional: Change icon on toggle
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times'); // Assumes Font Awesome 'times' icon
            }
        });
    }

    // === Close Mobile Menu When a Link is Clicked ===
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Only close if the mobile menu is active and it's an internal link
            if (navMenu.classList.contains('active') && link.getAttribute('href').startsWith('#')) {
                 navMenu.classList.remove('active');
                 navToggle.setAttribute('aria-expanded', 'false');
                 // Reset icon if changed
                 const icon = navToggle.querySelector('i');
                 if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                 }
            }
        });
    });

    // === Smooth Scrolling for Internal Links ===
    // Select all links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate offset if you have a fixed header
                const headerOffset = document.querySelector('.navbar').offsetHeight || 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth" // Smooth scroll
                });
            }
        });
    });


    // === Update Footer Year ===
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // === Optional: Add active class to nav link on scroll ===
    // This is more complex and involves monitoring scroll position.
    // Consider using Intersection Observer API for better performance if needed.
    // Example (basic version):
    /*
    const sections = document.querySelectorAll('main section[id]'); // Get sections with IDs

    window.addEventListener('scroll', navHighlighter);

    function navHighlighter() {
      let scrollY = window.pageYOffset;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - (document.querySelector('.navbar').offsetHeight + 50); // Adjust offset
        const sectionId = current.getAttribute('id');

        const navLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

        if (navLink) { // Check if the nav link exists
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
              navLink.classList.add('active');
            } else {
              navLink.classList.remove('active');
            }
        }
      });
    }
    */


}); // End DOMContentLoaded