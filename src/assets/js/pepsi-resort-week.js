/**
 * Pepsi Resort of the Week - Special Video Advertisement System
 * 
 * This module handles the display of the special Pepsi "Resort of the Week" 
 * video advertisement that appears on resort ID '1' (Arapahoe Basin). This
 * is a premium advertising feature that showcases a YouTube video with
 * autoplay functionality and includes both Pepsi and resort branding.
 * 
 * Key Features:
 * - Special handling for resort ID '1' (Arapahoe Basin)
 * - YouTube video integration with autoplay and muted start
 * - Dual branding (Pepsi + Resort logos)
 * - Responsive design with fallback content
 * - Audio integration capability (currently commented out)
 * 
 * Dependencies:
 * - resort-ads-system.js (provides _log and waitForElement functions)
 * - YouTube iframe API (loaded via iframe)
 * 
 * @fileoverview Special Pepsi Resort of the Week video advertisement system
 * @author SnoCountry Development Team
 * @version 1.0.0
 */

// Note: Do not need to declare _log, waitForElement, because it is included in snowreport.js.  But this needs included after snowreport.js.
_log('pepsi-resort-week Initialized...');

/**
 * Configuration object for the Pepsi Resort of the Week feature
 * 
 * Contains all the configurable parameters for the video advertisement
 * including YouTube video ID, dimensions, and branding elements.
 * 
 * @type {Object}
 * @property {string} TARGET_RESORT_ID - The resort ID that triggers this feature
 * @property {string} YOUTUBE_VIDEO_ID - YouTube video ID for the ROTW video
 * @property {Object} VIDEO_DIMENSIONS - Video iframe dimensions
 * @property {string} VIDEO_DIMENSIONS.width - Video width in pixels
 * @property {string} VIDEO_DIMENSIONS.height - Video height in pixels
 * @property {Object} YOUTUBE_PARAMS - YouTube iframe parameters
 * @property {boolean} YOUTUBE_PARAMS.autoplay - Enable autoplay
 * @property {boolean} YOUTUBE_PARAMS.mute - Start muted
 * @property {boolean} YOUTUBE_PARAMS.rel - Show related videos
 * @property {number} YOUTUBE_PARAMS.start - Start time in seconds
 */
const PEPSI_CONFIG = {
  TARGET_RESORT_ID: '503004',  
  YOUTUBE_VIDEO_ID: '6v9fofP99f8',
  VIDEO_DIMENSIONS: {
    width: '100%',
    height: '400px'
  },
  YOUTUBE_PARAMS: {
    autoplay: true,
    mute: true,
    rel: false,
    start: 2
  }
};

/**
 * Generates the YouTube iframe URL with configured parameters
 * 
 * Constructs a YouTube embed URL with the specified video ID and
 * query parameters for autoplay, muting, and other settings.
 * 
 * @function generateYouTubeUrl
 * @returns {string} Complete YouTube embed URL
 * 
 * @example
 * const url = generateYouTubeUrl();
 * // Returns: "https://www.youtube.com/embed/aCaoGm4TQC8?autoplay=1&mute=1&rel=0&start=2"
 */
function generateYouTubeUrl() {
  const params = new URLSearchParams();
  Object.entries(PEPSI_CONFIG.YOUTUBE_PARAMS).forEach(([key, value]) => {
    params.append(key, value ? '1' : '0');
  });
  
  return `https://www.youtube.com/embed/${PEPSI_CONFIG.YOUTUBE_VIDEO_ID}?${params.toString()}`;
}

/**
 * Generates the complete HTML markup for the Pepsi Resort of the Week feature
 * 
 * Creates a comprehensive HTML structure including:
 * - Resort logo (Bogus Basin SVG)
 * - Pepsi branding
 * - YouTube video iframe
 * - Responsive design elements
 * - Optional audio controls (currently commented out)
 * 
 * @function generatePepsiROTWHTML
 * @returns {string} Complete HTML markup for the ROTW feature
 * 
 * @example
 * const html = generatePepsiROTWHTML();
 * // Returns: Complete HTML string with video, logos, and styling
 */
function generatePepsiROTWHTML() {
  const youtubeUrl = generateYouTubeUrl();
  
  return `
    <div id="card-gatorade" class="sno-class bg-white rounded-lg mb-3 p-6 bg-background border shadow-md hover:scale-[1.01] transition-transform duration-300 relative group hover:shadow-sky-200 hover:shadow-xl">

      <div class="pepsi-content flex flex-col gap-1">
        <div class="pepsi-header flex flex-col gap-1">
          <div class="pepsi-logo-container items-center md:items-base md:px-4 flex flex-col md:flex-row md:gap-x-[100px] justify-center">   
            <img class="logo-gatorade h-[155px] md:h-[128px] " src="assets/images/ads/pepsi/GAT_GBolt Mark RGB _Black.png" alt="Gatorade" >
            <img class="logo-camelback" src="assets/images/ads/pepsi/mtbachelor/503004logo-orange.jpg" alt="Mt. Bachelor Ski Resort">
          </div>
          <div class="pepsi-copy mt-3 text-3xl text-center">Gatorade Resort of the Week</div>
          <!--
          <audio controls id="myaudio">
             <source src="assets/audio/pepsi/2024-03-28-China-Peak-ROTW.mp3" type="audio/mpeg">
          </audio>
          -->
        </div>
        <div class="pepsi-video">
          <iframe class="default" width="${PEPSI_CONFIG.VIDEO_DIMENSIONS.width}" height="${PEPSI_CONFIG.VIDEO_DIMENSIONS.height}" src="${youtubeUrl}" title="Pepsi ROTW" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius:3px;"></iframe>
          <!--
          <div class="pepsi-image">
            <img class="img-small" src="assets/images/ads/pepsi/whitetail/Whitetail-MtnDew.jpg" />
          </div>
          -->
        </div>
      </div>    
    </div><!-- end pepsi -->`;
}

/**
 * Displays the Pepsi Resort of the Week feature for the target resort
 * 
 * Checks if the current resort ID matches the target resort ID and displays
 * the special Pepsi ROTW video advertisement. This function handles the
 * DOM insertion and error handling for the feature.
 * 
 * @function displayPepsiROTW
 * @param {string} resortId - The current resort ID from the page
 * @returns {void}
 * 
 * @example
 * displayPepsiROTW('1'); // Displays ROTW for Arapahoe Basin
 * displayPepsiROTW('123'); // No action taken for other resorts
 */
function displayPepsiROTW(resortId) {
  if (resortId === PEPSI_CONFIG.TARGET_RESORT_ID) {
    _log('Pepsi ROTW: Displaying for resort ID', resortId);
    
    waitForElement('#left-column').then((elTarget) => {
      const html = generatePepsiROTWHTML();
      elTarget.insertAdjacentHTML('afterbegin', html);
      _log('Pepsi ROTW: Successfully inserted into DOM');
    }).catch((error) => { 
      console.error('Pepsi ROTW: Error waiting for #resort-name element:', error);
    });
  } else {
    _log('Pepsi ROTW: Skipping - not target resort ID', resortId);
  }
}

/**
 * Initializes the Pepsi Resort of the Week system
 * 
 * This is the main entry point that should be called from the resort-page-ads.js
 * system. It reads the resort ID from the page's data attribute and displays
 * the ROTW feature if appropriate.
 * 
 * @function initPepsiROTW
 * @returns {void}
 * 
 * @example
 * // Called from resort-page-ads.js
 * initPepsiROTW();
 */
function initPepsiROTW() {
  const resortId = document.body.dataset.snowreport;
  displayPepsiROTW(resortId);
}
initPepsiROTW();

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initPepsiROTW,
    displayPepsiROTW,
    generatePepsiROTWHTML,
    generateYouTubeUrl,
    PEPSI_CONFIG
  };
}
