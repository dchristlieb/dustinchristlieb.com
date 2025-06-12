document.addEventListener("DOMContentLoaded", function() {

    let allCertifications = []; // Store all certifications globally

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

    // === Render Certifications Function ===
    function renderCertifications(filterVendor = 'All') {
        const certificationsList = document.querySelector('.certifications-list');
        if (!certificationsList) return;

        certificationsList.innerHTML = ''; // Clear existing content

        const filteredCerts = (filterVendor === 'All')
            ? allCertifications
            : allCertifications.filter(cert => cert.issuer === filterVendor);

        filteredCerts.forEach(cert => {
            const listItem = document.createElement('li');

            const logoImg = document.createElement('img');
            logoImg.src = cert.logo;
            logoImg.alt = `${cert.name} Logo`;
            logoImg.classList.add('cert-logo');
            if (cert.isSquareLogo) {
                logoImg.classList.add('square-logo');
            }

            const certDetailsDiv = document.createElement('div');
            certDetailsDiv.classList.add('cert-details');

            const strongName = document.createElement('strong');
            strongName.textContent = `${cert.name} - ${cert.issuer}`;

            const verifyLink = document.createElement('a');
            verifyLink.href = cert.verifyLink;
            verifyLink.target = '_blank';
            verifyLink.rel = 'noopener noreferrer';
            verifyLink.classList.add('cert-verify-link');
            verifyLink.textContent = '(Verify)';

            certDetailsDiv.appendChild(strongName);
            certDetailsDiv.appendChild(verifyLink);

            listItem.appendChild(logoImg);
            listItem.appendChild(certDetailsDiv);

            certificationsList.appendChild(listItem);
        });
    }

    // === Load Certifications Data Once and Initialize Display ===
    function loadCertificationsData() {
        fetch('certifications.json')
            .then(response => response.json())
            .then(data => {
                allCertifications = data; // Store the fetched data
                renderCertifications('All'); // Render all by default
            })
            .catch(error => console.error('Error loading certifications data:', error));
    }

    // === Filter Button Event Listeners ===
    const filterButtons = document.querySelectorAll('.vendor-filter-buttons .filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            this.classList.add('active');

            const vendor = this.dataset.vendor; // Get the vendor name from data-vendor attribute
            renderCertifications(vendor);
        });
    });


    // === Update Footer Year ===
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Initial load of certifications data
    loadCertificationsData();

}); // End DOMContentLoaded