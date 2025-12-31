document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. PRELOADER (THE VOID) ---
    // Waits for all images, styles, and scripts to fully load before revealing the site
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            // Slight delay (500ms) for cinematic effect
            setTimeout(() => {
                preloader.classList.add('preloader-hidden');
            }, 500);
        }
    });

    // --- 1. COMPONENT LOADING (Navbar & Footer) ---
    async function loadComponent(id, file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Could not load ${file}`);
            const data = await response.text();
            document.getElementById(id).innerHTML = data;
            
            // Re-initialize scripts dependent on Navbar after it loads
            if (id === 'navbar-container') initMobileMenu();
        } catch (error) {
            console.error(error);
        }
    }

    loadComponent('navbar-container', 'navbar.html');
    loadComponent('footer-container', 'footer.html');

    // --- 2. MOBILE MENU LOGIC ---
    function initMobileMenu() {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        
        if (burger) {
            burger.addEventListener('click', () => {
                // Toggle Nav
                nav.classList.toggle('nav-active');
                // Burger Animation
                burger.classList.toggle('toggle');
            });
        }
    }

    // --- 3. SCROLL REVEAL OBSERVER ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));


    // --- 4. DYNAMIC PROJECT DATABASE LOADER ---
    const projectGrid = document.getElementById('projects-grid');

    if (projectGrid) {
        loadProjects();
    }

    async function loadProjects() {
        try {
            const response = await fetch('assets/data/projects.json');
            const projects = await response.json();

            // Clear loading state
            projectGrid.innerHTML = '';

            projects.forEach((project, index) => {
                // Calculate staggered delay (150ms per card)
                const delay = index * 150; 

                const card = document.createElement('div');
                card.classList.add('glass-card', 'hidden');
                card.style.transitionDelay = `${delay}ms`;

                // A. Handle Project Image (Preview)
                let imageHTML = '';
                if (project.image && project.image !== "") {
                    imageHTML = `
                        <div style="height: 200px; background: url('${project.image}') center/cover no-repeat; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.05);"></div>
                    `;
                } else {
                    // Fallback Gradient if no image
                    imageHTML = `
                        <div style="height: 200px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 12px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.05);">
                            <span style="color: var(--text-muted); font-size: 3rem; opacity: 0.3;">${project.title.charAt(0)}</span>
                        </div>
                    `;
                }

                // B. Handle Project LOGO (Icon)
                let logoHTML = '';
                if (project.logo && project.logo !== "") {
                    logoHTML = `
                        <img src="${project.logo}" alt="logo" style="width: 32px; height: 32px; border-radius: 8px; margin-right: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                    `;
                }

                // C. Build the Card HTML
                card.innerHTML = `
                    ${imageHTML}
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                        <span style="font-size: 0.75rem; color: var(--neon-cyan); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">${project.category}</span>
                    </div>

                    <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        ${logoHTML} 
                        <h3 style="margin: 0; font-size: 1.4rem;">${project.title}</h3>
                    </div>

                    <p style="font-size: 1rem; margin-bottom: 1.5rem;">${project.description}</p>
                    
                    <a href="${project.link}" class="nav-item" style="color: #fff; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 5px;">
                        View Project <span style="color: var(--neon-cyan);">→</span>
                    </a>
                `;

                // Append to grid
                projectGrid.appendChild(card);
                
                // IMPORTANT: Tell the observer to watch this new element for animation
                observer.observe(card);
            });

        } catch (error) {
            console.error('Error loading projects:', error);
            projectGrid.innerHTML = '<p style="color: #ef4444; text-align: center;">Unable to load projects database.</p>';
        }
    }
});