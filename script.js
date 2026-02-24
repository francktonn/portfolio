// ===================================
// Loader
// ===================================

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// ===================================
// Scroll Handler — un seul listener, RAF pour 60fps
// ===================================

const navbar = document.getElementById('navbar');
let rafPending = false;

function onScroll() {
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(handleScroll);
    }
}

function handleScroll() {
    rafPending = false;
    const scrollY = window.pageYOffset;

    // Navbar
    navbar.classList.toggle('scrolled', scrollY > 100);

    // Reveal
    revealOnScroll();

    // Active nav link
    activateNavLink();

    // Progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrollY / docHeight) * 100}%`;
}

window.addEventListener('scroll', onScroll, { passive: true });

// ===================================
// Mobile Menu Toggle
// ===================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===================================
// Active Navigation Link on Scroll
// ===================================

const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// activateNavLink appelé via handleScroll

// ===================================
// Dark Mode Toggle
// ===================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Update icon based on theme
function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

updateThemeIcon();

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});


// ===================================
// Reveal Elements on Scroll
// ===================================

// On ne garde que les éléments pas encore actifs pour éviter
// de relire getBoundingClientRect() sur des éléments déjà visibles
const revealElements = Array.from(document.querySelectorAll('.reveal'));
let pendingReveal = [...revealElements];

function revealOnScroll() {
    if (pendingReveal.length === 0) return;

    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    pendingReveal = pendingReveal.filter(element => {
        if (element.getBoundingClientRect().top < windowHeight - revealPoint) {
            element.classList.add('active');
            return false; // retiré de la liste
        }
        return true; // garde pour le prochain scroll
    });
}

// revealOnScroll appelé via handleScroll
window.addEventListener('load', revealOnScroll);

// ===================================
// Skill Items Animation (removed bars)
// ===================================

// Bars removed - skills now display as simple tags

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// EmailJS
// ===================================

emailjs.init('aB5GOkYH3d4QsNu5c');

// ===================================
// Form Handling
// ===================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalHTML = submitBtn.innerHTML;

    // État de chargement
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="fas fa-spinner fa-spin"></i>';

    const templateParams = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        title: document.getElementById('subject').value,
        message: document.getElementById('message').value,
    };

    emailjs.send('service_95ymzbd', 'template_79di3km', templateParams)
        .then(() => {
            showNotification('Message envoyé avec succès ! Je te répondrai bientôt.', 'success');
            contactForm.reset();
        })
        .catch(() => {
            showNotification('Erreur lors de l\'envoi. Réessaie ou contacte-moi directement par email.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        });
});

// ===================================
// Notification System
// ===================================

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        fontSize: '1rem',
        fontWeight: '500'
    });

    // Add to page
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax JS supprimé — les blobs ont déjà leur animation CSS (float) sur GPU

// ===================================
// Project Viewer
// ===================================

const projectViewer   = document.getElementById('projectViewer');
const viewerBack      = document.getElementById('viewerBack');
const viewerIframe    = document.getElementById('viewerIframe');
const viewerTitle     = document.getElementById('viewerTitle');
const viewerOpen      = document.getElementById('viewerOpen');
const viewerBlocked   = document.getElementById('viewerBlocked');
const viewerScreenshot = document.getElementById('viewerScreenshot');
const viewerBlockedLink = document.getElementById('viewerBlockedLink');

function openViewer(url, title, screenshot) {
    viewerTitle.textContent = title;
    viewerOpen.href = url;
    viewerBlockedLink.href = url;

    // Réinitialise l'état
    viewerBlocked.classList.remove('visible');
    viewerIframe.src = '';

    projectViewer.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Tente de charger l'iframe
    let resolved = false;

    const timer = setTimeout(() => {
        if (!resolved) showFallback(screenshot);
    }, 6000);

    viewerIframe.onload = () => {
        resolved = true;
        clearTimeout(timer);
        try {
            // Si cross-origin bloqué, contentDocument lance une erreur → iframe OK
            const doc = viewerIframe.contentDocument;
            if (doc && doc.body && doc.body.innerHTML === '') {
                showFallback(screenshot);
            }
        } catch (e) {
            // Chargé correctement (cross-origin = pas bloqué)
        }
    };

    viewerIframe.onerror = () => {
        resolved = true;
        clearTimeout(timer);
        showFallback(screenshot);
    };

    viewerIframe.src = url;
}

function showFallback(screenshot) {
    viewerIframe.src = '';
    viewerScreenshot.src = screenshot;
    viewerBlocked.classList.add('visible');
}

function closeViewer() {
    projectViewer.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
        viewerIframe.src = '';
        viewerBlocked.classList.remove('visible');
    }, 400);
}

// Clic sur une carte avec data-url
document.querySelectorAll('.project-card[data-url]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Ne pas intercepter les clics sur les liens internes (overlay)
        if (e.target.closest('.project-link')) return;
        openViewer(
            card.dataset.url,
            card.dataset.title,
            card.dataset.screenshot
        );
    });
});

viewerBack.addEventListener('click', closeViewer);

// Fermer avec Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectViewer.classList.contains('open')) {
        closeViewer();
    }
});

// ===================================
// Project Card Tilt Effect (Optional Enhancement)
// ===================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// Cursor Follow Effect
// ===================================

const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
Object.assign(cursor.style, {
    width: '20px',
    height: '20px',
    border: '2px solid var(--accent-primary)',
    borderRadius: '50%',
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity 0.3s ease',
    // transform géré via translate3d pour passer sur le GPU
});
document.body.appendChild(cursor);

if (window.innerWidth >= 768) {
    let cursorRaf = false;
    let mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.opacity = '1';
        if (!cursorRaf) {
            cursorRaf = true;
            requestAnimationFrame(() => {
                cursor.style.transform = `translate3d(${mx - 10}px, ${my - 10}px, 0)`;
                cursorRaf = false;
            });
        }
    }, { passive: true });
} else {
    cursor.style.display = 'none';
}

// ===================================
// Scroll Progress Indicator
// ===================================

const progressBar = document.createElement('div');
Object.assign(progressBar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '0%',
    height: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    zIndex: '10000',
    // Pas de transition CSS — mis à jour via RAF dans handleScroll
    transformOrigin: 'left',
});
document.body.appendChild(progressBar);
// La mise à jour est dans handleScroll()

// ===================================
// Initialize AOS (Animate on Scroll) Alternative
// ===================================

function initAnimations() {
    // Stagger léger sur les catégories de compétences
    document.querySelectorAll('.skill-category').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.08}s`;
    });
    // Stagger sur les highlights
    document.querySelectorAll('.highlight-item').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.08}s`;
    });
}

window.addEventListener('load', initAnimations);

// Debounce remplacé par RAF dans handleScroll — plus nécessaire

// ===================================
// Easter Egg: Konami Code
// ===================================

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);

    if (konamiCode.join('').includes(konamiPattern.join(''))) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 3s linear infinite';
    showNotification('🎮 Konami Code activé! Mode arc-en-ciel!', 'success');

    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    setTimeout(() => {
        document.body.style.animation = '';
        rainbowStyle.remove();
    }, 10000);
}

// ===================================
// Console Message for Developers
// ===================================

console.log(
    '%c👋 Salut développeur!',
    'color: #6366f1; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cTu fouilles dans le code? J\'aime ça! 🔍',
    'color: #8b5cf6; font-size: 16px;'
);
console.log(
    '%cSi tu veux discuter ou collaborer, n\'hésite pas à me contacter!',
    'color: #10b981; font-size: 14px;'
);

// ===================================
// Accessibility: Focus Visible Polyfill
// ===================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    body.keyboard-nav *:focus {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }
`;
document.head.appendChild(focusStyle);

// ===================================
// Log Performance Metrics
// ===================================

window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page chargée en ${pageLoadTime}ms`);
    }
});
