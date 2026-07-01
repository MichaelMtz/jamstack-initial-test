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
 * - YouTube video integration via lite-youtube-embed (click-to-play)
 * - Dual branding (Pepsi + Resort logos)
 * - Responsive design with fallback content
 * - Audio integration capability (currently commented out)
 * 
 * Dependencies:
 * - resort-ads-system.js (provides _log and waitForElement functions)
 * - lite-youtube-embed (loaded via base-snow-report.njk / home-page.njk)
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
 * @property {Object} YOUTUBE_PARAMS - YouTube player parameters (applied on play)
 * @property {boolean} YOUTUBE_PARAMS.mute - Start muted
 * @property {boolean} YOUTUBE_PARAMS.rel - Show related videos
 * @property {number} YOUTUBE_PARAMS.start - Start time in seconds
 */
const PEPSI_CONFIG = {
  TARGET_RESORT_ID: '0',  
  YOUTUBE_VIDEO_ID: 'Sp2Hueyv32s',
  YOUTUBE_PARAMS: {
    mute: true,
    rel: false,
    start: 2
  }
};

/**
 * Builds the YouTube player params string for lite-youtube
 *
 * @function generateYouTubeParams
 * @returns {string} URL-encoded player parameters
 */
function generateYouTubeParams() {
  const params = new URLSearchParams();
  Object.entries(PEPSI_CONFIG.YOUTUBE_PARAMS).forEach(([key, value]) => {
    params.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
  });
  return params.toString();
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
  const playLabel = 'Play: Gatorade Resort of the Week';
  const params = generateYouTubeParams();

  return `
    <div id="card-gatorade" class="sno-class bg-white rounded-lg mb-3 p-6 bg-background border shadow-md hover:scale-[1.01] transition-transform duration-300 relative group hover:shadow-sky-200 hover:shadow-xl">

      <div class="pepsi-content flex flex-col gap-1">
        <div class="pepsi-header flex flex-col gap-1">
          <div class="pepsi-logo-container items-center md:items-base md:px-4 flex flex-col md:flex-row md:gap-x-[100px] justify-center">   
            <img class="logo-gatorade h-[155px] md:h-[128px] " src="assets/images/ads/pepsi/GAT_GBolt Mark RGB _Black.png" alt="Gatorade" >
            
            <img class="logo-okemo h-[105px]" src="assets/images/ads/pepsi/stowe/Stowe_Logo_Red.png" alt="Stowe Resort VT">
          </div>
          <div class="pepsi-copy mt-3 text-3xl text-center">Gatorade Resort of the Week</div>
          <!--
          <audio controls id="myaudio">
             <source src="assets/audio/pepsi/2024-03-28-China-Peak-ROTW.mp3" type="audio/mpeg">
          </audio>
          -->
        </div>
        <div class="pepsi-video">
          <lite-youtube class="pepsi-lite-youtube w-full" videoid="${PEPSI_CONFIG.YOUTUBE_VIDEO_ID}" params="${params}" title="${playLabel}" playlabel="${playLabel}"></lite-youtube>
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
    generateYouTubeParams,
    PEPSI_CONFIG
  };
}
