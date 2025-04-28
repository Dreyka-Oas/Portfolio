// js/script.js

// --- Theme Switcher ---
const themeToggleButton = document.getElementById('theme-toggle');
const lsThemeKey = 'theme';
const lightIconClass = 'fa-sun';
const darkIconClass = 'fa-moon';

const applyTheme = (theme) => {
    const htmlEl = document.documentElement;
    const iconEl = themeToggleButton ? themeToggleButton.querySelector('i') : null;
    if (theme === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
        if (iconEl) iconEl.className = `fas ${lightIconClass}`;
        localStorage.setItem(lsThemeKey, 'dark');
    } else {
        htmlEl.setAttribute('data-theme', 'light');
        if (iconEl) iconEl.className = `fas ${darkIconClass}`;
        localStorage.setItem(lsThemeKey, 'light');
    }
    // Update meta theme-color for browser UI consistency
    const themeColorLight = '#f8f9fa'; // Corresponds to --bg-color-light in CSS
    const themeColorDark = '#0f172a'; // Corresponds to --bg-color (dark) in CSS
    const metaThemeColorLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
    const metaThemeColorDark = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');

    // Set the content attribute based on the currently applied theme
    if (metaThemeColorLight) {
        metaThemeColorLight.setAttribute('content', theme === 'dark' ? themeColorDark : themeColorLight);
    }
    if (metaThemeColorDark) {
        metaThemeColorDark.setAttribute('content', theme === 'dark' ? themeColorDark : themeColorLight);
    }
};


const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem(lsThemeKey);
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme immediately on load
const currentTheme = getPreferredTheme();
applyTheme(currentTheme);

// Add event listener after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (themeToggleButton) {
        // Ensure the icon matches the initially applied theme
        const initialIconClass = document.documentElement.getAttribute('data-theme') === 'dark' ? lightIconClass : darkIconClass;
        const iconEl = themeToggleButton.querySelector('i');
        if (iconEl) iconEl.className = `fas ${initialIconClass}`;

        // Add the click listener
        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }
});


window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(lsThemeKey)) { // Only change if user hasn't explicitly set a theme
        applyTheme(e.matches ? 'dark' : 'light');
    }
});
// --- End Theme Switcher ---


// Preloader Functionality
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            // Wait for fade out transition before setting display none for smoother effect
            preloader.addEventListener('transitionend', () => {
                if (preloader.classList.contains('fade-out')) { // Double check it's faded out
                   preloader.style.display = 'none';
                }
            }, { once: true }); // Ensure listener fires only once
        }
    }, 600); // Minimum display time for the preloader
});

// Main script logic runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- Utilities ---
    function calculateAge(birthdate) {
        try {
            const birth = new Date(birthdate);
            const now = new Date();
            let age = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
                age--;
            }
            // Ensure age is not negative if birthdate is invalid/future
            return age >= 0 ? age : 0;
        } catch (e) {
            console.error("Age calculation error:", e);
            return "??"; // Return placeholder on error
        }
    }
    // Update age on the main page (About section)
    const ageElement = document.getElementById("age");
    if (ageElement) {
        ageElement.textContent = calculateAge("2003-08-30");
    }

    // --- Header Scroll & Scroll Top Button ---
    const header = document.getElementById("header");
    const scrollTopBtn = document.getElementById("scroll-top");

    const handleScroll = () => {
        const scrollY = window.scrollY;
        // Header styling on scroll
        if (header) {
            header.classList.toggle('scrolled', scrollY > 50);
        }
        // Scroll top button visibility
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('active', scrollY > 500);
        }
    };

    // Attach scroll event listener using passive for performance
    if (header || scrollTopBtn) {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Scroll top button click action
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Smooth scrolling animation
            });
        });
    }

    // --- Hamburger Menu ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        const navLinkItems = navLinks.querySelectorAll('a');

        const closeMenu = () => {
             if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.querySelector('i').className = 'fas fa-bars';
                document.body.style.overflow = ''; // Restore body scroll
             }
        };

        const openMenu = () => {
            navLinks.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.querySelector('i').className = 'fas fa-times';
            document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
        };

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from propagating to the document listener below
            const isOpen = navLinks.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when a link is clicked (useful for single-page navigation)
        navLinkItems.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu if clicking outside the opened menu
        document.addEventListener('click', (e) => {
            // Check if the menu is active and the click was outside both the menu and the hamburger button
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu with the Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // --- Intersection Observer for Scroll Animations ---
    let observer;
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0 && typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                // When element comes into view
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Stop observing the element once it's visible to save resources
                    observerInstance.unobserve(entry.target);
                }
                // Optional: If you want elements to fade out when scrolling away
                // else {
                //     entry.target.classList.remove('visible');
                // }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
            // rootMargin: '0px 0px -50px 0px' // Optional: Adjust the trigger area (e.g., trigger 50px before it enters viewport)
        });

        // Start observing each element
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
         // Fallback for browsers without IntersectionObserver or if no elements are found
         animatedElements.forEach(el => {
             el.classList.add('visible'); // Make elements visible immediately
         });
         if (animatedElements.length > 0) {
             console.warn("IntersectionObserver not supported by this browser. Scroll animations will appear immediately.");
         } else {
            // console.log("No elements found with the class '.animate-on-scroll'."); // Optional log
         }
    }

    // --- Particles.js Initialization ---
    const particlesElement = document.getElementById('particles-js');
    if (particlesElement && typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": { "number": { "value": 45, "density": { "enable": true, "value_area": 900 } },"color": { "value": "#cccccc" },"shape": { "type": "circle" },"opacity": { "value": 0.3, "random": true, "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.1, "sync": false } },"size": { "value": 2, "random": true },"line_linked": { "enable": false },"move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false } },
            "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false }, "onclick": { "enable": false }, "resize": true } },
            "retina_detect": true
        });
    } else if (particlesElement) {
        console.warn('particles.js library not loaded, but element #particles-js exists.');
    }

    // --- Typed.js Initialization ---
    const typedElement = document.getElementById('typed-text');
    if (typedElement && typeof Typed !== 'undefined') {
        const options = {
            strings: ['(Dreyka-Oas)', 'Développeur', 'Créatif', 'Passionné'],
            typeSpeed: 65, // Speed of typing
            backSpeed: 45, // Speed of deleting
            backDelay: 1800, // Pause before deleting
            startDelay: 500, // Pause before starting
            loop: true, // Loop the animation
            showCursor: true, // Show the blinking cursor
            cursorChar: '|', // Cursor character
            autoInsertCss: true // Let Typed.js inject CSS for the cursor
        };
        try {
            new Typed('#typed-text', options); // Initialize Typed.js
        } catch (e) {
            console.error("Typed.js initialization error:", e);
            // Fallback text if Typed.js fails to initialize
            typedElement.textContent = '(Dreyka-Oas)';
        }
    } else if (typedElement) {
        console.warn('Typed.js library not loaded, but element #typed-text exists.');
        // Fallback text if the library isn't loaded
        typedElement.textContent = '(Dreyka-Oas)';
    }

    // --- GitHub Project Fetching ---
    const projectsContainer = document.getElementById('projects-container');
    async function fetchGithubProjects() {
        if (!projectsContainer) {
            // console.log("Project container (#projects-container) not found. Skipping GitHub fetch.");
            return; // Exit if the container doesn't exist
        }

        const username = 'Dreyka-Oas';
        const maxProjects = 6; // Set the maximum number of projects to display
        // Initial loading message
        projectsContainer.innerHTML = '<p class="animate-on-scroll visible" style="text-align:center; color: var(--text-muted);">Chargement des projets GitHub...</p>';

        try {
            let projects = [];
            let fetchedPinned = false;

            // --- Attempt 1: Fetch Pinned Repositories ---
            try {
                const pinnedResponse = await fetch(`https://gh-pinned-repos.egoist.dev/?username=${username}`);
                if (pinnedResponse.ok) {
                    const pinnedData = await pinnedResponse.json();
                    if (Array.isArray(pinnedData) && pinnedData.length > 0) {
                        // Map pinned data to a common structure
                        projects = pinnedData.map(p => ({
                            name: p.repo,
                            html_url: `https://github.com/${p.owner}/${p.repo}`,
                            description: p.description,
                            homepage: p.website || null, // Use website field if available
                            language: p.language,
                            stargazers_count: p.stars
                        }));
                        fetchedPinned = true;
                        // console.log("Successfully fetched pinned repositories.");
                    } else {
                        // console.log("Pinned repo endpoint returned ok, but no pinned repos found.");
                    }
                } else {
                    console.warn(`Could not fetch pinned repos: ${pinnedResponse.status} ${pinnedResponse.statusText}`);
                }
            } catch (e) {
                console.warn("Error fetching or processing pinned repos:", e);
            }

            // --- Attempt 2: Fallback to Fetching Latest Repositories ---
            // Fetch latest repos if pinned fetch failed, returned empty, or didn't find enough projects
            if (!fetchedPinned || projects.length < maxProjects) {
                // console.log("Fetching latest repositories as fallback or to supplement pinned repos...");
                // Determine how many more projects we need
                const neededCount = maxProjects - projects.length;
                 if(neededCount > 0 || !fetchedPinned) { //Only fetch if we actually need more or pinned failed completely
                    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=${maxProjects}`); // Fetch latest pushed
                    if (!reposResponse.ok) {
                        throw new Error(`GitHub API Error (Latest Repos): ${reposResponse.status} ${reposResponse.statusText}`);
                    }
                    let latestReposData = await reposResponse.json();
                    if (!Array.isArray(latestReposData)) {
                        throw new Error("Invalid GitHub API response format for latest repos.");
                    }

                    // Filter out projects already included from pinned repos
                    const existingNames = new Set(projects.map(p => p.name));
                    latestReposData = latestReposData.filter(repo => !existingNames.has(repo.name));

                    // Add the needed number of latest repos to the projects array
                    projects = projects.concat(latestReposData.slice(0, Math.max(0, neededCount))); // Ensure neededCount is not negative
                 }
            }

            // --- Display Projects ---
            projectsContainer.innerHTML = ''; // Clear loading message before adding cards

            if (projects.length === 0) {
                projectsContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Aucun projet public trouvé sur GitHub.</p>';
                return; // Exit if no projects found at all
            }

            // Display up to maxProjects
            projects.slice(0, maxProjects).forEach((project, index) => {
                const card = document.createElement('div');
                card.className = 'project-card-simple animate-on-scroll'; // Add animation class
                // Apply staggered animation delay
                card.style.transitionDelay = `${index * 0.1}s`;

                // Sanitize description to prevent potential XSS issues
                const desc = project.description || 'Pas de description fournie.';
                const safeDesc = desc.replace(/</g, "<").replace(/>/g, ">");
                // Truncate description if it's too long
                const truncatedDesc = safeDesc.length > 90 ? safeDesc.substring(0, 87) + '...' : safeDesc;

                // Generate homepage link only if it's a valid, non-empty HTTP/HTTPS URL
                const homepageLink = (project.homepage && project.homepage.trim() !== '' && (project.homepage.startsWith('http://') || project.homepage.startsWith('https://')))
                    ? `<a href="${project.homepage}" target="_blank" rel="noopener noreferrer" aria-label="Voir le site live pour ${project.name}" title="Voir le site live"><i class="fas fa-external-link-alt"></i></a>`
                    : ''; // Empty string if no valid homepage

                card.innerHTML = `
                    <div class="project-content">
                        <h4>${project.name || 'Nom Inconnu'}</h4>
                        <p>${truncatedDesc}</p>
                        <div class="project-links">
                            <a href="${project.html_url || '#'}" target="_blank" rel="noopener noreferrer" aria-label="Voir ${project.name} sur GitHub" title="Voir sur GitHub"><i class="fab fa-github"></i></a>
                            ${homepageLink}
                        </div>
                    </div>
                `;
                projectsContainer.appendChild(card);
            });

            // Re-observe newly added animated elements if IntersectionObserver is available
            if (observer) {
                const newAnimated = projectsContainer.querySelectorAll('.animate-on-scroll');
                newAnimated.forEach(el => observer.observe(el));
            } else {
                // If observer not available, make them visible immediately
                const newAnimated = projectsContainer.querySelectorAll('.animate-on-scroll');
                newAnimated.forEach(el => el.classList.add('visible'));
            }

        } catch (error) {
            console.error('GitHub project fetch error:', error);
            // Display a user-friendly error message directly in the container
            projectsContainer.innerHTML = `
                <div class="error-message" style="text-align:center; color: var(--text-muted); background-color: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.3); padding: 1rem; border-radius: 8px; grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-triangle" style="color: red;"></i> Impossible de charger les projets depuis GitHub.
                    <br><small>(${error.message})</small>
                </div>`;
        }
    }

    // Initiate fetching GitHub projects if the container exists
    if (projectsContainer) {
        fetchGithubProjects();
    }


    // --- Skills Tabs ---
    const tabButtons = document.querySelectorAll('.skill-tab-button');
    const tabPanes = document.querySelectorAll('.skills-tab-pane');

    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetPaneId = button.getAttribute('data-tab-target'); // e.g., "#tab-langages"
                const targetPane = document.querySelector(targetPaneId);

                if (targetPane) {
                    // 1. Deactivate all buttons and panes
                    tabButtons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-selected', 'false');
                        // Reset transform for non-active buttons (important if active state has transform)
                        btn.style.transform = 'translateY(0)';
                    });
                    tabPanes.forEach(pane => {
                        pane.classList.remove('active');
                    });

                    // 2. Activate the clicked button and its corresponding pane
                    button.classList.add('active');
                    button.setAttribute('aria-selected', 'true');
                    // Apply transform only to the active button (if desired)
                    button.style.transform = 'translateY(-2px)'; // Example transform
                    targetPane.classList.add('active');
                } else {
                    console.warn(`Target pane with ID ${targetPaneId} not found.`);
                }
            });
        });

        // Optional: Ensure the initially active tab's button also gets the transform on load
        const initiallyActiveButton = document.querySelector('.skill-tab-button.active');
        if (initiallyActiveButton) {
             initiallyActiveButton.style.transform = 'translateY(-2px)'; // Apply initial transform
        }

    } else {
        // console.log("Skill tab buttons or panes not found. Tab functionality disabled.");
    }

    /* --- Contact Form Handling Removed --- */
    // No JavaScript needed for the Gmail link approach.

    // --- Footer Year ---
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear(); // Set current year dynamically
    }

    // --- Additional Animations/Effects ---
    // Add slight delay to allow initial rendering and preloader fade
    setTimeout(() => {
        // Example: Profile Picture subtle glow animation trigger
        const heroPic = document.querySelector('.hero .profile-pic');
        if (heroPic) {
             // Example: Add a class defined in animations.css
             // heroPic.classList.add('apply-glow-animation');
        }


        // Example: Parallax effect for background elements (if they exist)
        const landscape = document.querySelector('.landscape-bg');
        if (landscape) {
             const stars = landscape.querySelector('.stars');
             const mountains = landscape.querySelector('.mountains'); // If you have mountains

             window.addEventListener('scroll', () => {
                 const scrollY = window.scrollY;
                 // Move background layers at slightly different speeds for parallax
                 landscape.style.backgroundPositionY = `${scrollY * 0.05}px`; // Base layer moves slowest
                 if(stars) {
                     // Apply transform for potentially smoother performance than background-position
                     stars.style.transform = `translateY(${scrollY * 0.1}px)`; // Stars move faster
                 }
                 // Add mountains or other layers if needed
                 // if(mountains) {
                 //     mountains.style.transform = `translateY(${scrollY * 0.08}px)`; // Intermediate speed
                 // }
             }, { passive: true }); // Use passive listener for scroll performance
        }
    }, 800); // Delay in milliseconds (adjust as needed)

}); // End DOMContentLoaded