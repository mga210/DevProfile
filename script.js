// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initBackToTop();
    initSkillBars();
    initTypewriter();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to current section nav link
                const activeLink = document.querySelector(`a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-item, .project-card, .experience-card, .about-card, .detail-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });

    // Stagger animation for grid items
    const skillItems = document.querySelectorAll('.skill-item');
    const projectCards = document.querySelectorAll('.project-card');
    
    [skillItems, projectCards].forEach(items => {
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

// Contact form - Handle GitHub Pages and Replit compatibility
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default to handle manually
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Submit to Formspree via fetch for better compatibility
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    showNotification('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                showNotification('Sorry, there was an error sending your message. Please try again or email directly.', 'error');
            });
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Back to top button
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Animated skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                skillBar.style.width = '0%';
                
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 500);
                
                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Typewriter effect for hero section
function initTypewriter() {
    const roleElement = document.querySelector('.role');
    if (!roleElement) return;

    const roles = ['AI Developer', 'Software Systems Thinker', 'Organizational Intelligence', 'Data Interpreter'];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // Start typewriter effect after a delay
    setTimeout(typeWriter, 1000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#" or empty
        if (!href || href === '#') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Project card hover effects and click handling
document.querySelectorAll('.project-card, .project-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Remove click handler since we now have dedicated buttons
});

// Prevent project links from navigating away
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.getAttribute('aria-label') === 'View Live Demo') {
            showNotification('Live demo coming soon!', 'info');
        } else if (this.getAttribute('aria-label') === 'View Source Code') {
            showNotification('Source code available on request!', 'info');
        }
    });
});

// Project modal functions
function openProjectModal(projectCard) {
    const title = projectCard.querySelector('.project-title').textContent;
    const description = projectCard.querySelector('.project-description').textContent;
    const techTags = Array.from(projectCard.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
    const detailedInfo = projectCard.querySelector('.project-details');
    
    // Get project image
    const projectImage = projectCard.querySelector('.project-image img');
    let imageContent = '';
    if (projectImage) {
        imageContent = `
            <div class="project-modal-image">
                <img src="${projectImage.src}" alt="${projectImage.alt}" loading="lazy">
            </div>
        `;
    }
    
    let detailedContent = '';
    if (detailedInfo) {
        detailedContent = detailedInfo.innerHTML;
    }
    
    // Create modal content
    const modalContent = `
        <div class="project-modal-header">
            <h2>${title}</h2>
            <button class="close-modal" onclick="closeProjectModal()" aria-label="Close">×</button>
        </div>
        <div class="project-modal-body">
            ${imageContent}
            <div class="project-modal-description">
                <p>${description}</p>
            </div>
            ${detailedContent ? `<div class="project-modal-detailed">${detailedContent}</div>` : ''}
            <div class="project-modal-tech">
                <h3>Technologies Used:</h3>
                <div class="tech-tags">
                    ${techTags.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="project-modal-actions">
                <button class="btn btn-primary" onclick="openLiveDemo('${title}')">
                    <i class="fas fa-external-link-alt"></i> View Live Demo
                </button>
                <button class="btn btn-secondary" onclick="showNotification('Source code available on request!', 'info')">
                    <i class="fab fa-github"></i> View Source Code
                </button>
            </div>
        </div>
    `;
    
    // Show modal
    const modal = document.getElementById('projectModal');
    const modalBody = modal.querySelector('.modal-content');
    modalBody.innerHTML = modalContent;
    modal.style.display = 'block';
    
    // Add animation class
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function openLiveDemo(projectTitle) {
    const demoUrls = {
        'SystemPilot - AI Workflow Optimization Agent': 'https://chatgpt.com/g/g-6856d43a6a488191a911d252286987e2-systempilot',
        'Blueprint Buddy - Modular GPT Instruction Architect': 'https://chatgpt.com/g/g-67ecc53d1854819192a6c8a8bf0d7d4b-metacosensei',
        'Meta Code Sensei - Python Mentor and Architecture Coach': 'https://chatgpt.com/g/g-67ecc53d1854819192a6c8a8bf0d7d4b-metacosensei'
    };
    
    if (demoUrls[projectTitle]) {
        window.open(demoUrls[projectTitle], '_blank');
    } else {
        showNotification('Live demo coming soon!', 'info');
    }
}

// Screenshot Gallery Functions
let currentScreenshotIndex = 0;
let currentScreenshots = [];

const screenshotData = {
    'DMRB': [
        {
            src: 'assets/dmrb-login.png',
            title: 'Login Interface',
            description: 'Role-based access control with dedicated portals for different user types including MakeReady Coordinators, Property Managers, Leasing Agents, and more.'
        },
        {
            src: 'assets/dmrb-dashboard.png',
            title: 'Service Manager Console',
            description: 'Main dashboard showing unit status across all stages: Notice (18), In Progress (10), Ready (10), and Completed (10). Features real-time status tracking with color-coded unit organization.'
        },
        {
            src: 'assets/dmrb-mr-board.png',
            title: 'MR Board - Unit Detail View',
            description: 'Individual unit management interface showing task categorization (Core, Regular, Optional), completion tracking, and unit lifecycle details including DTBR, status, and completion percentage.'
        },
        {
            src: 'assets/dmrb-task-manager.png',
            title: 'Task Manager',
            description: 'Task template creation and management system with categorization (Core, Regular, Optional), offset day scheduling, and task lifecycle controls for system-wide task deployment.'
        },
        {
            src: 'assets/dmrb-lookup-editor.png',
            title: 'Lookup Editor',
            description: 'System configuration interface for managing Properties, Vendors, Employees, and Statuses. Provides centralized control of all lookup values used throughout the application.'
        },
        {
            src: 'assets/dmrb-import-units.png',
            title: 'Bulk Import System',
            description: 'Excel-based unit import functionality for handling large-scale unit additions. Includes property selection, file upload, and batch processing capabilities for efficient data migration.'
        },
        {
            src: 'assets/dmrb-unit-lifecycle.png',
            title: 'Unit Lifecycle Table',
            description: 'Comprehensive unit tracking table showing complete unit information including lifecycle status, dates, task assignments, and progress indicators. Central data view for operational oversight.'
        },
        {
            src: 'assets/dmrb-task-templates.png',
            title: 'Task Template Management',
            description: 'Template management system with Core, Regular, and Optional task categorization. Enables creation, modification, and deployment of standardized task workflows across all units.'
        },
        {
            src: 'assets/dmrb-delays-overview.png',
            title: 'Delays & Analytics Dashboard',
            description: 'Advanced analytics showing delay patterns, vendor performance, and bottleneck identification. Color-coded severity indicators (Medium, High) help prioritize intervention actions.'
        },
        {
            src: 'assets/dmrb-notes-blockers.png',
            title: 'Notes & Blockers System',
            description: 'Communication and issue tracking system linking notes to specific units. Enables team coordination, issue documentation, and resolution tracking with timestamp and author attribution.'
        },
        {
            src: 'assets/dmrb-property-database.png',
            title: 'Property Database',
            description: 'Property and unit inventory management showing unit specifications, square footage, and unit types. Foundation data that drives task template application and resource allocation.'
        },
        {
            src: 'assets/dmrb-ai-assistant.png',
            title: 'AI Assistant Dashboard',
            description: 'Smart dashboard with predictive analytics including Early Warning Timeline, Predicted Blockers, High-Risk Task identification, and AI Alerts system for proactive management.'
        },
        {
            src: 'assets/dmrb-dashboard.png',
            title: '❤️ CORE DIALOGS (System Architecture)',
            description: `❤️ CORE DIALOGS (Lifeblood of the system)
Each dialog triggers system mutations and lifecycle orchestration:

➕ Add Unit Dialog (The Heartbeat)
• Creates lifecycle state from user input
• Injects task templates into unit_lifecycle and unit_tasks
• Emits unit_created(payload) — system-wide sync trigger
• Source: dialog_add_unit.py → add_unit_dialog

📥 Import Units (The Mass Valve)
• Batch unit creation from .xlsx
• Deduplicates, applies templates, injects state
• Source: dialog_import.py → unit_import_dialog

➕ Add Task (The Rhythm Engine)
• Defines task templates, offsets, Final Walk constraints
• Drives all unit task sequencing
• Source: dialog_add_task.py → add_task_dialog

⚙ Manage Dropdown (The Blood Chemistry)
• Manages roles, statuses, and logic-bound labels
• Lives in lookup.db and controls validation across views
• Source: dialog_lookup.py → Manage_dropdown_dialog

🧠 CORE VIEWS (Memory + Execution Control)
These views are not just visual — they define system behavior and readiness logic:

📁 Units View (Central Consciousness)
• Stores unit lifecycle, readiness %, and task sync
• Feeds: dashboards, delay views, task boards
• Reacts to task completion events
• Source: view_unit.py → unit_view

⚒ Task Template View (Procedural Memory)
• Encodes readiness logic through task categories + offsets
• Central to Final Walk logic and delay prediction
• Source: view_task_template.py → task_template_view

🏘 Property/Unit DB View (Long-Term Memory)
• Reference for unit structure: square footage, type
• Ensures valid template-task injection
• Source: view_property_unit_db.py → property_unit_db_view`
        }
    ],
    'Python Training Board': [
        {
            src: 'assets/python-welcome.png',
            title: 'Welcome Screen',
            description: 'Clean, professional welcome interface for the Python Training Board application. Built with modern GUI design principles using PySide6 for a native desktop experience.'
        },
        {
            src: 'assets/python-login.png',
            title: 'User Authentication',
            description: 'Secure login system with username and password fields. Demonstrates form handling, input validation, and user authentication patterns in Python GUI development.'
        },
        {
            src: 'assets/python-gui-mode-selection.png',
            title: 'GUI Framework Selection',
            description: 'Framework selection interface allowing users to choose between PySide6 Showcase, Tkinter Showcase, or Advanced GUI Projects. Demonstrates application architecture with multiple GUI framework support and modular design patterns.'
        },
        {
            src: 'assets/python-core-widgets.png',
            title: 'Core Widgets - PySide6 Showcase',
            description: 'Essential PySide6 widgets including QPushbutton, QSlider, QCheckbox, QLineEdit, QCombobox, QFileDialog, QTableWidget, and QTextEdit. Each widget demonstrates fundamental GUI programming concepts.'
        },
        {
            src: 'assets/python-intermediate-widgets.png',
            title: 'Intermediate Widgets',
            description: 'Advanced PySide6 components: QProgressbar, QTabWidget, QSpinbox, QFormLayout, QMessagebox, QInputDialog, QRadioButton, QListWidget, QTreeView, and QDockWidget for complex interface design.'
        },
        {
            src: 'assets/python-advanced-patterns.png',
            title: 'Advanced Patterns & System Integration',
            description: 'Sophisticated GUI patterns including QTimer for animations, QThread for background processing, QStackedWidget for navigation, custom Layouts, Drag & Drop functionality, QShortcut for hotkeys, QClipboard for system integration, QSystemTray for background apps, and custom dialogs.'
        },
        {
            src: 'assets/python-tkinter-demo.png',
            title: 'Tkinter Demo Comparison',
            description: 'Side-by-side comparison showing Tkinter implementation alongside PySide6. Demonstrates Core Widgets (Button, Slider, Checkbox, Entry), Intermediate Widgets (Progressbar, Notebook, Spinbox), and Advanced Patterns (Timer, Thread, Stack, Layouts) across both frameworks.'
        }
    ]
};

function openScreenshotGallery(projectName) {
    console.log('Opening screenshot gallery for:', projectName);
    const screenshots = screenshotData[projectName] || [];
    console.log('Screenshots found:', screenshots.length);
    
    if (screenshots.length === 0) {
        showNotification('Screenshots coming soon!', 'info');
        return;
    }
    
    currentScreenshots = screenshots;
    currentScreenshotIndex = 0;
    
    const gallery = document.getElementById('screenshotGallery');
    const title = document.getElementById('galleryTitle');
    
    if (!gallery) {
        console.error('Gallery element not found');
        return;
    }
    
    if (title) {
        title.textContent = `${projectName} - Screenshots`;
    }
    
    updateScreenshotDisplay();
    createThumbnails();
    
    gallery.style.display = 'block';
    gallery.style.zIndex = '2000';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        gallery.classList.add('show');
    }, 10);
}

function closeScreenshotGallery() {
    const gallery = document.getElementById('screenshotGallery');
    if (gallery) {
        gallery.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            gallery.style.display = 'none';
        }, 300);
    }
}

function updateScreenshotDisplay() {
    if (currentScreenshots.length === 0) return;
    
    const screenshot = currentScreenshots[currentScreenshotIndex];
    const img = document.getElementById('currentScreenshot');
    const title = document.getElementById('screenshotTitle');
    const description = document.getElementById('screenshotDescription');
    const currentIndex = document.getElementById('currentIndex');
    const totalScreenshots = document.getElementById('totalScreenshots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    img.src = screenshot.src;
    img.alt = screenshot.title;
    title.textContent = screenshot.title;
    description.textContent = screenshot.description;
    currentIndex.textContent = currentScreenshotIndex + 1;
    totalScreenshots.textContent = currentScreenshots.length;
    
    // Update navigation buttons
    prevBtn.disabled = currentScreenshotIndex === 0;
    nextBtn.disabled = currentScreenshotIndex === currentScreenshots.length - 1;
    
    // Update thumbnail selection
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentScreenshotIndex);
    });
}

function previousScreenshot() {
    if (currentScreenshotIndex > 0) {
        currentScreenshotIndex--;
        updateScreenshotDisplay();
    }
}

function nextScreenshot() {
    if (currentScreenshotIndex < currentScreenshots.length - 1) {
        currentScreenshotIndex++;
        updateScreenshotDisplay();
    }
}

function createThumbnails() {
    const container = document.querySelector('.screenshot-thumbnails');
    container.innerHTML = '';
    
    currentScreenshots.forEach((screenshot, index) => {
        const thumb = document.createElement('img');
        thumb.src = screenshot.src;
        thumb.alt = screenshot.title;
        thumb.className = 'thumbnail';
        thumb.onclick = () => {
            currentScreenshotIndex = index;
            updateScreenshotDisplay();
        };
        container.appendChild(thumb);
    });
}

// Close gallery on outside click
document.getElementById('screenshotGallery').addEventListener('click', function(e) {
    if (e.target === this) {
        closeScreenshotGallery();
    }
});

// Keyboard navigation for gallery
document.addEventListener('keydown', function(e) {
    const gallery = document.getElementById('screenshotGallery');
    if (gallery.style.display === 'block') {
        switch(e.key) {
            case 'Escape':
                closeScreenshotGallery();
                break;
            case 'ArrowLeft':
                previousScreenshot();
                break;
            case 'ArrowRight':
                nextScreenshot();
                break;
        }
    }
});

// Add loading animation
window.addEventListener('load', function() {
    // Hide any loading spinner if present
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }

    // Trigger entrance animations
    document.body.classList.add('loaded');
    
    // Initialize database tracking
    initializeAnalytics();
});

// Analytics functions for static hosting
async function initializeAnalytics() {
    // Analytics disabled for static hosting
    console.log('Portfolio loaded successfully');
}

// Track section views (static version)
function trackSectionView(sectionName) {
    // Section tracking disabled for static hosting
    console.log(`Viewed section: ${sectionName}`);
}

// Track project interactions (static version)
function trackProjectInteraction(projectName, interactionType) {
    // Project interaction tracking disabled for static hosting
    console.log(`Project interaction: ${projectName} - ${interactionType}`);
}

// Contact form submission
function handleContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Always prevent default to handle submission manually
        
        // Get form data for validation
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.disabled = true;
        
        console.log('Submitting form to Formspree:', data);
        
        try {
            // Submit to Formspree using fetch
            const response = await fetch('https://formspree.io/f/xnnzbnob', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Formspree response status:', response.status);
            
            if (response.ok) {
                showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                const responseData = await response.json();
                console.log('Formspree error response:', responseData);
                if (responseData.errors) {
                    const errorMessages = responseData.errors.map(error => error.message).join(', ');
                    showNotification(`❌ Error: ${errorMessages}`, 'error');
                } else {
                    showNotification('❌ There was an error sending your message. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('❌ Network error. Please check your connection and try again.', 'error');
        } finally {
            // Restore button state
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Any additional scroll-based functionality can go here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Intersection Observer for fade-in animations
const observeElements = (selector, animationClass = 'fade-in') => {
    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass, 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        element.classList.add(animationClass);
        observer.observe(element);
    });
};

// Initialize fade-in animations for various elements
observeElements('.stat-item');
observeElements('.detail-card');
observeElements('.timeline-item');
observeElements('.achievement-card');
observeElements('.cert-item');
observeElements('.service-card');

// Resume download function
// Resume Modal Functions
function openResumeModal() {
    const modal = document.getElementById('resumeModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Focus trap for accessibility
    const firstFocusableElement = modal.querySelector('input[type="radio"]');
    firstFocusableElement?.focus();
}

function closeResumeModal() {
    const modal = document.getElementById('resumeModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function downloadSelectedResume() {
    const selectedFormat = document.querySelector('input[name="resumeFormat"]:checked').value;
    const link = document.createElement('a');
    
    if (selectedFormat === 'pdf') {
        link.href = 'resume.pdf';
        link.download = 'Miguel_Gonzalez_Resume.pdf';
    } else {
        link.href = 'resume.docx';
        link.download = 'Miguel_Gonzalez_Resume.docx';
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    closeResumeModal();
    showNotification('Resume downloaded successfully!', 'success');
}

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('resumeModal');
        if (modal && modal.classList.contains('show')) {
            closeResumeModal();
        }
    }
});

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('resumeModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeResumeModal();
            }
        });
    }
});

// Console easter egg
console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║         Welcome to my portfolio!      ║
    ║                                       ║
    ║      Thanks for checking out the      ║
    ║           source code! 🚀             ║
    ║                                       ║
    ║        Feel free to reach out!       ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
`);
