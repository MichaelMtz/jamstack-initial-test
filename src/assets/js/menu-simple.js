// Navigation Menu JavaScript
class NavigationMenu {
    constructor() {
        this.menuData = [];
        this.activeDropdown = null;
        this.isMobileDrawerOpen = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
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

        // document.addEventListener('mouseleave', (e) => {
        //     if (e.target?.closest('.group') && !e.relatedTarget?.closest('.group')) {
        //         setTimeout(() => {
        //             if (!document.querySelector('.group:hover')) {
        //                 this.closeAllDropdowns();
        //             }
        //         }, 100);
        //     }
        // });
        document.getElementById('dropdown-0').addEventListener('mouseleave', (e) => {
            this.closeAllDropdowns();
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