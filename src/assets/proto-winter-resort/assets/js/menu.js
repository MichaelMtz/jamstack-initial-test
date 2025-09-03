// Navigation Menu JavaScript
class NavigationMenu {
    constructor() {
        this.menuData = [];
        this.activeDropdown = null;
        this.isMobileDrawerOpen = false;
        this.init();
    }

    async init() {
        await this.loadMenuData();
        this.render();
        this.setupEventListeners();
    }

    async loadMenuData() {
        try {
            const response = await fetch('./assets/js/menu.json');
            this.menuData = await response.json();
        } catch (error) {
            console.error('Error loading menu data:', error);
            this.menuData = [];
        }
    }

    render() {
        this.renderDesktopMenu();
        this.renderMobileMenu();
    }

    renderDesktopMenu() {
        const menuContainer = document.getElementById('navigation-menu');
        if (!menuContainer) return;

        menuContainer.innerHTML = '';

        this.menuData.forEach((item, index) => {
            let border = (index > 0) ? 'border-l hover:border-l-0' : '';
            const menuItem = this.createMenuItem(item, index, border);
            menuContainer.appendChild(menuItem);
        });
    }

    renderMobileMenu() {
        const mobileMenuContainer = document.getElementById('mobile-navigation-menu');
        if (!mobileMenuContainer) return;

        mobileMenuContainer.innerHTML = '';

        this.menuData.forEach((item, index) => {
            const mobileMenuItem = this.createMobileMenuItem(item, index);
            mobileMenuContainer.appendChild(mobileMenuItem);
        });
    }

    createMenuItem(item, index, border) {
        const li = document.createElement('li');
        li.className = `relative group ${border} main-menu-item `;

        if (item['sub-menu']) {
            let gradientColor = 'bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-sky-600';

            li.innerHTML = `
                <button 
                    class="flex items-center px-4 py-2 font-bold text-menu hover:text-primary hover:bg-accent/50 rounded-md transition-colors duration-50 focus:outline-none "
                    data-dropdown-toggle="dropdown-${index}"
                    aria-expanded="false"
                    aria-haspopup="true"
                >
                    <span class="${gradientColor}">${item.label}</span>
                    <svg class="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                ${this.createDropdown(item['sub-menu-items'], index)}
            `;
        } else {
            li.innerHTML = `
                <a 
                    href="${item.link}" 
                    class="flex items-center px-4 py-2  font-bold text-menu hover:text-primary hover:bg-accent/50 rounded-md transition-colors duration-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 "    
                >
                    ${item.label}
                </a>
            `;
        }

        return li;
    }

    createMobileMenuItem(item, index) {
        const div = document.createElement('div');
        div.className = 'border-b border-border last:border-b-0';

        if (item['sub-menu']) {
            div.innerHTML = `
                <button 
                    class="flex items-center justify-between w-full px-3 py-4 text-left text-navtop hover:bg-accent rounded-md transition-colors duration-200"
                    data-mobile-toggle="mobile-section-${index}"
                    aria-expanded="false"
                >
                    <span class="font-medium">${item.label}</span>
                    <svg class="h-5 w-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div id="mobile-section-${index}" class="hidden pl-4 pb-2">
                    ${this.createMobileSubMenu(item['sub-menu-items'])}
                </div>
            `;
        } else {

            div.innerHTML = `
                <a 
                    href="${item.link}" 
                    class="block px-3 py-4 text-navtop hover:bg-accent rounded-md transition-colors duration-200 font-medium "
                >
                    ${item.label}
                </a>
            `;
        }

        return div;
    }

    createMobileSubMenu(items) {
        let html = '';

        items.forEach(item => {
            if (item['sub-menu'] && item['sub-menu-items']) {
                html += `
                    <div class="mb-4">
                        <a href="${item.link}" class="block font-semibold text-md text-menu mb-2 hover:text-primary transition-colors duration-150 border-b border-border pb-1">
                            ${item.label}
                        </a>
                        <div class="space-y-1 ml-2">
                `;

                item['sub-menu-items'].forEach(subItem => {
                    html += `
                        <a href="${subItem.link}" class="block text-md text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded px-2 py-1 transition-colors duration-150">
                            ${subItem.label}
                        </a>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <a href="${item.link}" class="block text-md text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded px-2 py-1 transition-colors duration-150 mb-1">
                        ${item.label}
                    </a>
                `;
            }
        });

        return html;
    }

    createDropdown(items, parentIndex) {
        const dropdown = document.createElement('div');
        dropdown.id = `dropdown-${parentIndex}`;
        dropdown.className = 'menu-dropdown absolute left-0 top-full mt-1 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible transform scale-95 transition-all duration-50 text-base z-50';

        // Check if this is a mega menu (has sub-menu items)
        const hasMegaMenu = items.some(item => item['sub-menu']);

        if (hasMegaMenu) {
            // Create mega menu layout - 3 columns, 2 rows
            dropdown.className += ' min-w-max';
            const megaMenuContent = document.createElement('div');
            megaMenuContent.className = 'grid grid-cols-3 gap-8 p-6';

            const menuItems = items.filter(item => item['sub-menu'] && item['sub-menu-items']);

            menuItems.forEach((item, index) => {
                // Create column for each region
                const column = document.createElement('div');
                column.className = 'sno-menu-region-items flex flex-col min-w-[140px]';

                // Column header
                const header = document.createElement('a');
                header.href = item.link;
                header.className = 'font-semibold text-md text-foreground mb-3 uppercase tracking-wide hover:text-primary hover:bg-accent border-b px-2 py-1 transition-colors duration-50';
                header.textContent = item.label;
                column.appendChild(header);

                // Column items
                const itemsList = document.createElement('div');
                //itemsList.className = 'sno-menu-region-items';

                item['sub-menu-items'].forEach(subItem => {
                    const link = document.createElement('a');
                    link.href = subItem.link;
                    link.className = 'block xyz text-md text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 transition-colors duration-50';
                    link.textContent = subItem.label;
                    itemsList.appendChild(link);
                });

                column.appendChild(itemsList);
                megaMenuContent.appendChild(column);
            });

            dropdown.appendChild(megaMenuContent);
        } else {
            // Regular dropdown for simple menus
            dropdown.className += ' w-64';
            const dropdownContent = document.createElement('div');
            dropdownContent.className = 'p-1';

            items.forEach((item, index) => {
                const menuItem = document.createElement('a');
                menuItem.href = item.link;
                menuItem.className = 'block px-3 py-2 text-md text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors duration-50';
                menuItem.textContent = item.label;
                dropdownContent.appendChild(menuItem);
            });

            dropdown.appendChild(dropdownContent);
        }

        return dropdown.outerHTML;
    }


    setupEventListeners() {
        // Desktop menu events
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-dropdown-toggle]')) {
                e.preventDefault();
                const dropdownId = e.target.getAttribute('data-dropdown-toggle');
                this.toggleDropdown(dropdownId, e.target);
            } else if (e.target.matches('[data-mobile-toggle]') || e.target.closest('[data-mobile-toggle]')) {
                e.preventDefault();
                e.stopPropagation();
                const button = e.target.matches('[data-mobile-toggle]') ? e.target : e.target.closest('[data-mobile-toggle]');
                const sectionId = button.getAttribute('data-mobile-toggle');
                this.toggleMobileSection(sectionId, button);
            } else if (!e.target.closest('#mobile-drawer')) {
                this.closeAllDropdowns();
            }
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('[data-dropdown-toggle]')) {
                const dropdownToggle = e.target.closest('[data-dropdown-toggle]');
                const dropdownId = dropdownToggle.getAttribute('data-dropdown-toggle');
                this.showDropdown(dropdownId, dropdownToggle);
            }
        });

        document.addEventListener('mouseleave', (e) => {
            if (e.target?.closest('.group') && !e.relatedTarget?.closest('.group')) {
                setTimeout(() => {
                    if (!document.querySelector('.group:hover')) {
                        this.closeAllDropdowns();
                    }
                }, 100);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                if (this.isMobileDrawerOpen) {
                    this.closeMobileDrawer();
                }
            }
        });

        // Mobile drawer events
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                this.openMobileDrawer();
            });
        }

        const closeDrawerButton = document.getElementById('close-drawer-button');
        if (closeDrawerButton) {
            closeDrawerButton.addEventListener('click', () => {
                this.closeMobileDrawer();
            });
        }

        // Close drawer when clicking backdrop
        const drawer = document.getElementById('mobile-drawer');
        if (drawer) {
            drawer.addEventListener('click', (e) => {
                if (e.target === drawer || e.target.matches('[aria-hidden="true"]')) {
                    this.closeMobileDrawer();
                }
            });
        }
    }

    toggleDropdown(dropdownId, toggle) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;

        const isOpen = !dropdown.classList.contains('opacity-0');

        this.closeAllDropdowns();

        if (!isOpen) {
            this.showDropdown(dropdownId, toggle);
        }
    }

    showDropdown(dropdownId, toggle) {
        this.closeAllDropdowns();

        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;

        dropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
        dropdown.classList.add('opacity-100', 'visible', 'scale-100');

        toggle.setAttribute('aria-expanded', 'true');
        this.activeDropdown = dropdownId;
    }


    closeAllDropdowns() {
        document.querySelectorAll('[id^="dropdown-"]').forEach(dropdown => {
            dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
            dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
        });

        document.querySelectorAll('[data-dropdown-toggle]').forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
        });

        this.activeDropdown = null;
    }

    // Mobile drawer methods
    openMobileDrawer() {
        const drawer = document.getElementById('mobile-drawer');
        const panel = drawer.querySelector('.fixed.right-0');

        drawer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Trigger animation
        requestAnimationFrame(() => {
            panel.classList.remove('translate-x-full');
            panel.classList.add('translate-x-0');
        });

        this.isMobileDrawerOpen = true;
    }

    closeMobileDrawer() {
        const drawer = document.getElementById('mobile-drawer');
        const panel = drawer.querySelector('.fixed.right-0');

        panel.classList.remove('translate-x-0');
        panel.classList.add('translate-x-full');

        setTimeout(() => {
            drawer.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);

        this.isMobileDrawerOpen = false;
    }

    toggleMobileSection(sectionId, button) {
        const section = document.getElementById(sectionId);
        const arrow = button.querySelector('svg');

        if (section.classList.contains('hidden')) {
            section.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
            button.setAttribute('aria-expanded', 'true');
        } else {
            section.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
            button.setAttribute('aria-expanded', 'false');
        }
    }
}

// Initialize the navigation menu when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationMenu();
});