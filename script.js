document.addEventListener("DOMContentLoaded", function() {

    let allCertifications = []; // Store all certifications globally

    // === Mobile Navigation Toggle ===
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // === Close Mobile Menu When a Link is Clicked ===
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active') && link.getAttribute('href').startsWith('#')) {
                 navMenu.classList.remove('active');
                 navToggle.setAttribute('aria-expanded', 'false');
                 const icon = navToggle.querySelector('i');
                 if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                 }
            }
        });
    });

    // === Smooth Scrolling for Internal Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.navbar').offsetHeight || 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // === Render Certifications Function (UPDATED) ===
    function renderCertifications(filterVendor = 'All') {
        const certificationsList = document.querySelector('.certifications-list');
        if (!certificationsList) return;

        certificationsList.innerHTML = ''; // Clear existing content

        const filteredCerts = (filterVendor === 'All')
            ? allCertifications
            : allCertifications.filter(cert => cert.issuer === filterVendor);

        filteredCerts.forEach(cert => {
            // Create the list item that will hold our link
            const listItem = document.createElement('li');
            
            // Create the link and point it to the verification URL
            const logoLink = document.createElement('a');
            logoLink.href = cert.verifyLink;
            logoLink.target = '_blank';
            logoLink.rel = 'noopener noreferrer';
            logoLink.title = cert.name; // Tooltip on hover for better UX

            // Create the logo image
            const logoImg = document.createElement('img');
            logoImg.src = cert.logo;
            logoImg.alt = cert.name; // Alt text is crucial for accessibility
            logoImg.classList.add('cert-logo');
            if (cert.isSquareLogo) {
                logoImg.classList.add('square-logo');
            }

            // Place the image inside the link
            logoLink.appendChild(logoImg);
            
            // Place the link inside the list item
            listItem.appendChild(logoLink);
            
            // Add the final structure to the certifications list
            certificationsList.appendChild(listItem);
        });
    }

    // === Load Certifications Data Once and Initialize Display ===
    function loadCertificationsData() {
        fetch('certifications.json')
            .then(response => response.json())
            .then(data => {
                allCertifications = data;
                renderCertifications('All');
            })
            .catch(error => console.error('Error loading certifications data:', error));
    }

    // === Filter Button Event Listeners ===
    const filterButtons = document.querySelectorAll('.vendor-filter-buttons .filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const vendor = this.dataset.vendor;
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

});