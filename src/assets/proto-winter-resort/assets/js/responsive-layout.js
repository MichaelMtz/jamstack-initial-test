/**
 * Responsive Layout Manager for Snow Report Cards
 * Dynamically reconfigures card elements based on Tailwind's "lg" breakpoint (1024px)
 * Target file: shaded-bg.html
 */

class ResponsiveLayoutManager {
    constructor() {
        // Tailwind "lg" breakpoint
        this.lgBreakpoint = 1024;
        this.mediaQuery = window.matchMedia(`(min-width: ${this.lgBreakpoint}px)`);

        // Current layout state to prevent unnecessary DOM manipulations
        this.currentLayout = null;

        // Mobile order sequence as specified in mobile-order.md
        this.mobileOrder = [
            'card-video',
            'card-trails-lifts',
            'card-snowfall',
            'card-conditions',
            'card-weather',
            'card-blurb',
            'card-comments',
            'card-hours',
            'card-trailmap',
            'card-info',
            'card-stats',
            'card-archive',
            'card-affiliate',
            'card-snonews'
        ];

        // Desktop layout distribution
        this.desktopLayout = {
            leftColumn: [
                'card-video',
                'card-blurb',
                'card-comments',
                'card-weather',
                'card-trailmap',
                'card-archive'

            ],
            rightColumn: [
                'card-trails-lifts',
                'card-snowfall',
                'card-conditions',
                'card-hours',
                'card-stats',
                'card-info',
                'card-affiliate',
                'card-snonews'
            ]
        };

        // DOM elements cache
        this.elements = {
            snowReport: null,
            leftColumn: null,
            rightColumn: null,
            cards: new Map()
        };

        // Throttle timer for resize events
        this.resizeTimer = null;
        this.resizeDelay = 100; // 100ms delay as specified

        this.init();
    }

    /**
     * Initialize the responsive layout manager
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup DOM elements and event listeners
     */
    setup() {
        this.cacheElements();
        this.setupEventListeners();
        this.configureInitialLayout();
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements.snowReport = document.getElementById('snow-report');
        this.elements.leftColumn = document.getElementById('left-column');
        this.elements.rightColumn = document.getElementById('right-column');

        if (!this.elements.snowReport || !this.elements.leftColumn || !this.elements.rightColumn) {
            console.error('ResponsiveLayoutManager: Required DOM elements not found');
            return;
        }

        // Cache all .sno-class elements within #snow-report
        const snoElements = this.elements.snowReport.querySelectorAll('.sno-class');
        snoElements.forEach(element => {
            if (element.id) {
                this.elements.cards.set(element.id, element);
            }
        });

        console.log(`ResponsiveLayoutManager: Cached ${this.elements.cards.size} card elements`);
    }

    /**
     * Setup event listeners for resize and media query changes
     */
    setupEventListeners() {
        // Modern approach: listen to media query changes
        this.mediaQuery.addEventListener('change', (e) => {
            this.handleLayoutChange(e.matches);
        });

        // Fallback: throttled resize listener
        window.addEventListener('resize', () => {
            this.throttledResize();
        });
    }

    /**
     * Throttled resize handler to prevent excessive recalculations
     */
    throttledResize() {
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }

        this.resizeTimer = setTimeout(() => {
            const isDesktop = window.innerWidth >= this.lgBreakpoint;
            this.handleLayoutChange(isDesktop);
        }, this.resizeDelay);
    }

    /**
     * Configure initial layout based on current screen size
     */
    configureInitialLayout() {
        const isDesktop = this.mediaQuery.matches;
        this.handleLayoutChange(isDesktop);
    }

    /**
     * Handle layout changes between mobile and desktop
     * @param {boolean} isDesktop - Whether the screen is desktop size (>= lg breakpoint)
     */
    handleLayoutChange(isDesktop) {
        const targetLayout = isDesktop ? 'desktop' : 'mobile';
        // Prevent unnecessary DOM manipulations
        if (this.currentLayout === targetLayout) {
            return;
        }

        console.log(`ResponsiveLayoutManager: Switching to ${targetLayout} layout`);

        if (isDesktop) {
            this.applyDesktopLayout();
        } else {
            this.applyMobileLayout();
        }

        this.currentLayout = targetLayout;
    }

    /**
     * Apply mobile layout: move all .sno-class elements to left column in specified order
     */
    applyMobileLayout() {
        const leftColumn = this.elements.leftColumn;
        const rightColumn = this.elements.rightColumn;

        // First, move all left column .sno-class elements to right column as temporary holding area
        // This ensures we start with a clean left column
        const leftColumnCards = Array.from(leftColumn.querySelectorAll('.sno-class'));
        leftColumnCards.forEach(card => {
            if (card.id && this.elements.cards.has(card.id)) {
                rightColumn.appendChild(card);
            }
        });

        // Now move all cards to left column in the specified mobile order
        this.mobileOrder.forEach(cardId => {
            console.log(`applyMobileLayout:${cardId}`);
            const card = this.elements.cards.get(cardId);
            if (card) {
                console.log(`applyMobileLayout:inserting:${cardId}`);
                leftColumn.appendChild(card);
            }
        });

        console.log('ResponsiveLayoutManager: Applied mobile layout');
    }

    /**
     * Apply desktop layout: restore original two-column distribution
     */
    applyDesktopLayout() {
        const leftColumn = this.elements.leftColumn;
        const rightColumn = this.elements.rightColumn;

        // Move cards to left column in order
        this.desktopLayout.leftColumn.forEach(cardId => {
            const card = this.elements.cards.get(cardId);
            if (card && card.parentNode !== leftColumn) {
                leftColumn.appendChild(card);
            }
        });

        // Move cards to right column in order
        this.desktopLayout.rightColumn.forEach(cardId => {
            const card = this.elements.cards.get(cardId);
            if (card && card.parentNode !== rightColumn) {
                rightColumn.appendChild(card);
            }
        });

        console.log('ResponsiveLayoutManager: Applied desktop layout');
    }

    /**
     * Get current layout state for debugging
     */
    getCurrentLayout() {
        return {
            currentLayout: this.currentLayout,
            isDesktop: this.mediaQuery.matches,
            screenWidth: window.innerWidth,
            cachedElements: this.elements.cards.size
        };
    }

    /**
     * Manually trigger layout reconfiguration (for debugging)
     */
    reconfigure() {
        this.currentLayout = null; // Force reconfiguration
        this.configureInitialLayout();
    }
}

// Initialize the responsive layout manager when the script loads
const responsiveLayoutManager = new ResponsiveLayoutManager();

// Expose to global scope for debugging
window.ResponsiveLayoutManager = responsiveLayoutManager;

