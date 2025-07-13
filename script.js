// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking on a link
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations for sections
    const revealElements = document.querySelectorAll('section');
    
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.8;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('reveal');
                element.classList.add('active');
            }
        });
    }

    // Initial check for elements in view
    checkReveal();

    // Check on scroll
    window.addEventListener('scroll', checkReveal);

    // Navbar scroll behavior
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add background color when scrolling
        if (currentScroll > 50) {
            navbar.style.background = '#ffffff';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Here you would typically send the data to a server
            console.log('Form submitted:', formObject);

            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Add names to form fields for proper form submission
    const nameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const messageInput = document.querySelector('textarea');

    if (nameInput) nameInput.name = 'name';
    if (emailInput) emailInput.name = 'email';
    if (messageInput) messageInput.name = 'message';

    // GALLERY SECTION LOGIC (HTML-driven, no localStorage)
    const galleryGrid = document.getElementById('galleryGrid');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeModal = document.querySelector('.close-modal');

    if (galleryGrid && videoModal && modalVideo && closeModal) {
        // Collect all gallery items
        const allGalleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
        let galleryPage = 0;
        const GALLERY_PAGE_SIZE = 3;
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        function renderGalleryPage() {
            // Hide all items
            allGalleryItems.forEach(item => item.style.display = 'none');
            // Show only items for current page
            const start = galleryPage * GALLERY_PAGE_SIZE;
            const end = start + GALLERY_PAGE_SIZE;
            for (let i = start; i < end && i < allGalleryItems.length; i++) {
                allGalleryItems[i].style.display = '';
            }
            // Fill empty slots if needed
            let emptySlots = GALLERY_PAGE_SIZE - (end > allGalleryItems.length ? allGalleryItems.length - start : GALLERY_PAGE_SIZE);
            // Remove old empty slots
            Array.from(galleryGrid.querySelectorAll('.gallery-empty')).forEach(e => e.remove());
            for (let i = 0; i < emptySlots; i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'gallery-item gallery-empty';
                emptyDiv.style.visibility = 'hidden';
                galleryGrid.appendChild(emptyDiv);
            }
            // Update arrows
            if (prevBtn) prevBtn.disabled = galleryPage === 0;
            if (nextBtn) nextBtn.disabled = (galleryPage + 1) * GALLERY_PAGE_SIZE >= allGalleryItems.length;
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (galleryPage > 0) {
                    galleryPage--;
                    renderGalleryPage();
                }
            });
            nextBtn.addEventListener('click', () => {
                if ((galleryPage + 1) * GALLERY_PAGE_SIZE < allGalleryItems.length) {
                    galleryPage++;
                    renderGalleryPage();
                }
            });
        }

        renderGalleryPage();

        // Video modal logic (unchanged)
        galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const videoUrl = item.getAttribute('data-video');
                if (videoUrl) {
                    modalVideo.src = videoUrl;
                    videoModal.style.display = 'flex';
                    modalVideo.play().catch(() => {});
                    // Request fullscreen for the video element itself
                    if (modalVideo.requestFullscreen) {
                        modalVideo.requestFullscreen();
                    } else if (modalVideo.webkitRequestFullscreen) {
                        modalVideo.webkitRequestFullscreen();
                    } else if (modalVideo.msRequestFullscreen) {
                        modalVideo.msRequestFullscreen();
                    }
                }
            });
        });
        closeModal.addEventListener('click', () => {
            modalVideo.pause();
            modalVideo.src = '';
            videoModal.style.display = 'none';
            if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        });
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                modalVideo.pause();
                modalVideo.src = '';
                videoModal.style.display = 'none';
                if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
            }
        });
    }
}); 