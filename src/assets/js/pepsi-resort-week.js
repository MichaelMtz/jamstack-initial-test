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
  TARGET_RESORT_ID: '307002',  
  YOUTUBE_VIDEO_ID: 'uU_-_p0-f8o',
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
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full sm:w-auto ml-[47%] sm:ml-[22%]" viewBox="0 0 245 83"><path d="M27.689 35.234c-6.184 3.718-7.262 12.228-5.974 18.821.047.281.07-.35.258-.911 1.03-3.367 6.817-6.266 9.136-7.599 4.404-2.525 9.018-5.4 11.946-9.633 5.365-7.762 3.56-20.925 1.242-29.435-.047 6.265-1.78 13.607-4.943 19.055-2.506 4.348-7.472 7.154-11.665 9.702ZM45.773 3.11s6.63-.374 12.767 2.525c4.498 2.408 8.292 6.032 11.478 9.983 5.458 6.757 9.768 14.426 13.493 22.258 3.537 7.482 7.145 15.478 14.242 20.294 8.714 5.915 20.216 3.788 29.141 9.329-4.966-7.412-10.612-12.93-17.827-18.213-6.418-4.676-11.759-9.049-15.741-16.016-2.905-5.003-6.184-9.82-9.464-14.59-4.31-6.312-9.135-11.946-16.07-15.383C64.163 1.497 60.837.21 56.01.21c-4.825 0-10.237 2.9-10.237 2.9Z" fill="#003449"></path><path d="M59.406 23.263c4.17 1.496 7.941 3.016 10.916 6.406 2.46 2.806 3.28 6.477 4.474 9.914 3.022 8.674 7.262 11.807 10.823 16.576-6.044-1.66-12.017-5.143-15.414-10.544-2.132-3.367-3.045-7.552-4.029-11.363-1.64-6.243-6.77-10.989-6.77-10.989ZM4.263 74.537c.984 0 2.038.397 2.835 1.098a.2.2 0 0 1 .023.304l-.913.982a.246.246 0 0 1-.305 0c-.445-.397-.96-.56-1.522-.56-1.265 0-2.296 1.075-2.296 2.337 0 1.263 1.03 2.315 2.295 2.315.328 0 .68-.047 1.031-.187v-.678h-.726a.21.21 0 0 1-.21-.21v-1.146a.21.21 0 0 1 .21-.21h2.343a.21.21 0 0 1 .21.21v3.11c0 .046-.047.14-.093.186 0 0-1.195.749-2.882.749-2.319 0-4.17-1.824-4.17-4.162a4.14 4.14 0 0 1 4.17-4.138ZM9.182 74.864a.21.21 0 0 1 .21-.21h3.49a2.512 2.512 0 0 1 2.53 2.501c0 1.076-.702 1.917-1.71 2.338l1.594 2.946c.07.14 0 .327-.188.327h-1.546c-.094 0-.164-.047-.187-.093l-1.546-3.063h-.82v2.922a.21.21 0 0 1-.211.21H9.416a.21.21 0 0 1-.21-.21v-7.668h-.024Zm3.537 3.25c.468 0 .89-.445.89-.936a.889.889 0 0 0-.89-.888h-1.71v1.8h1.71v.024ZM16.28 82.463l3.63-7.81c.024-.07.118-.116.188-.116h.117c.07 0 .164.046.188.116l3.63 7.81a.207.207 0 0 1-.187.303h-1.288c-.211 0-.305-.07-.399-.28l-.421-.912h-3.163l-.421.935c-.047.14-.188.28-.422.28h-1.288a.23.23 0 0 1-.164-.326Zm4.778-2.479-.89-1.917-.866 1.917h1.756ZM25.135 74.724a.21.21 0 0 1 .21-.21h.282l4.638 4.441v-4.114a.21.21 0 0 1 .21-.21h1.406a.21.21 0 0 1 .211.21v7.809a.21.21 0 0 1-.21.21h-.188a.333.333 0 0 1-.14-.047l-4.592-4.606v4.326a.21.21 0 0 1-.21.21h-1.383a.21.21 0 0 1-.21-.21l-.024-7.81ZM34.037 74.864a.21.21 0 0 1 .21-.21h2.835c2.25 0 4.076 1.823 4.076 4.044a4.075 4.075 0 0 1-4.076 4.068h-2.834a.21.21 0 0 1-.21-.21v-7.692Zm2.928 6.172c1.312 0 2.272-1.029 2.272-2.361 0-1.31-.96-2.338-2.272-2.338h-1.124v4.7h1.124ZM46.897 76.337h-1.663a.21.21 0 0 1-.21-.21v-1.263a.21.21 0 0 1 .21-.21h5.154a.21.21 0 0 1 .21.21v1.262a.21.21 0 0 1-.21.21h-1.663v6.197a.21.21 0 0 1-.211.21h-1.406a.21.21 0 0 1-.21-.21v-6.196ZM50.668 82.463l3.631-7.81c.024-.07.117-.116.188-.116h.117c.07 0 .164.046.187.116l3.631 7.81a.207.207 0 0 1-.187.303h-1.289c-.21 0-.304-.07-.398-.28l-.422-.912h-3.162l-.422.935c-.046.14-.187.28-.421.28h-1.289a.23.23 0 0 1-.164-.326Zm4.78-2.479-.891-1.917-.867 1.917h1.757ZM59.547 74.864a.21.21 0 0 1 .21-.21h3.468a2.512 2.512 0 0 1 2.53 2.501c0 1.076-.703 1.917-1.71 2.338l1.592 2.946c.07.14 0 .327-.187.327h-1.546c-.094 0-.164-.047-.188-.093L62.17 79.61h-.796v2.922a.21.21 0 0 1-.21.21H59.78a.21.21 0 0 1-.21-.21v-7.668h-.024Zm3.537 3.25c.468 0 .89-.445.89-.936a.889.889 0 0 0-.89-.888h-1.71v1.8h1.71v.024ZM71.049 74.537c.983 0 2.037.397 2.834 1.098a.2.2 0 0 1 .023.304l-.913.982a.246.246 0 0 1-.305 0c-.445-.397-.96-.56-1.522-.56-1.265 0-2.296 1.075-2.296 2.337 0 1.263 1.03 2.315 2.296 2.315.328 0 .679-.047 1.03-.187v-.678h-.75a.21.21 0 0 1-.21-.21v-1.146a.21.21 0 0 1 .21-.21h2.343a.21.21 0 0 1 .211.21v3.11c0 .046-.047.14-.094.186 0 0-1.194.749-2.88.749-2.32 0-4.17-1.824-4.17-4.162a4.175 4.175 0 0 1 4.193-4.138ZM75.732 74.864a.21.21 0 0 1 .211-.21h1.382a.21.21 0 0 1 .211.21v2.922h3.326v-2.922a.21.21 0 0 1 .211-.21h1.382a.21.21 0 0 1 .211.21v7.668a.21.21 0 0 1-.21.21h-1.383a.21.21 0 0 1-.21-.21v-3.039h-3.327v3.04a.21.21 0 0 1-.21.21h-1.383a.21.21 0 0 1-.21-.21v-7.67ZM84.588 74.864a.21.21 0 0 1 .21-.21h4.803a.21.21 0 0 1 .21.21v1.262a.21.21 0 0 1-.21.21h-3.21v1.427h2.648a.21.21 0 0 1 .21.21v1.263a.21.21 0 0 1-.21.21h-2.647v1.567H89.6a.21.21 0 0 1 .21.21v1.263a.21.21 0 0 1-.21.21h-4.802a.21.21 0 0 1-.211-.21v-7.622ZM91.756 74.864a.21.21 0 0 1 .21-.21h4.803a.21.21 0 0 1 .21.21v1.262a.21.21 0 0 1-.21.21h-3.21v1.427h2.648a.21.21 0 0 1 .21.21v1.263a.21.21 0 0 1-.21.21H93.56v1.567h3.209a.21.21 0 0 1 .21.21v1.263a.21.21 0 0 1-.21.21h-4.802a.21.21 0 0 1-.211-.21v-7.622ZM101.852 74.864a.21.21 0 0 1 .21-.21h3.467a2.512 2.512 0 0 1 2.53 2.501c0 1.076-.703 1.917-1.71 2.338l1.593 2.946c.07.14 0 .327-.187.327h-1.546c-.094 0-.164-.047-.188-.093l-1.546-3.063h-.796v2.922a.21.21 0 0 1-.211.21h-1.382a.21.21 0 0 1-.211-.21v-7.668h-.023Zm3.56 3.25c.469 0 .89-.445.89-.936a.889.889 0 0 0-.89-.888h-1.71v1.8h1.71v.024ZM109.535 74.864a.21.21 0 0 1 .211-.21h4.802a.21.21 0 0 1 .211.21v1.262a.21.21 0 0 1-.211.21h-3.209v1.427h2.647a.21.21 0 0 1 .211.21v1.263a.21.21 0 0 1-.211.21h-2.647v1.567h3.209a.21.21 0 0 1 .211.21v1.263a.21.21 0 0 1-.211.21h-4.802a.21.21 0 0 1-.211-.21v-7.622ZM116.234 81.644l.539-.959c.094-.14.305-.116.398-.07.047.024.89.632 1.64.632.469 0 .797-.28.797-.702 0-.49-.399-.865-1.195-1.169-1.007-.397-2.249-1.169-2.249-2.572 0-1.145.89-2.314 2.694-2.314 1.218 0 2.132.608 2.483.865.141.07.117.28.07.374l-.585.888c-.071.117-.281.234-.399.14-.093-.046-.96-.7-1.663-.7-.421 0-.726.28-.726.584 0 .42.351.748 1.265 1.122.914.35 2.342 1.075 2.342 2.642 0 1.192-1.03 2.408-2.74 2.408-1.499 0-2.343-.631-2.624-.888-.094-.07-.14-.117-.047-.28ZM127.009 74.537c2.32 0 4.194 1.87 4.194 4.185 0 2.314-1.851 4.161-4.194 4.161a4.13 4.13 0 0 1-4.169-4.161 4.15 4.15 0 0 1 4.169-4.185Zm0 6.476a2.323 2.323 0 0 0 2.32-2.315c0-1.286-1.055-2.338-2.32-2.338-1.264 0-2.319 1.052-2.319 2.338a2.323 2.323 0 0 0 2.319 2.315ZM132.258 74.864a.21.21 0 0 1 .211-.21h3.467a2.512 2.512 0 0 1 2.529 2.501c0 1.076-.702 1.917-1.71 2.338l1.593 2.946c.071.14 0 .327-.187.327h-1.546c-.094 0-.164-.047-.188-.093l-1.546-3.063h-.796v2.922a.21.21 0 0 1-.211.21h-1.382a.21.21 0 0 1-.211-.21v-7.668h-.023Zm3.56 3.25c.469 0 .891-.445.891-.936a.89.89 0 0 0-.891-.888h-1.71v1.8h1.71v.024ZM141.229 76.337h-1.663a.21.21 0 0 1-.211-.21v-1.263a.21.21 0 0 1 .211-.21h5.154a.21.21 0 0 1 .211.21v1.262a.21.21 0 0 1-.211.21h-1.663v6.197a.21.21 0 0 1-.211.21h-1.406a.21.21 0 0 1-.211-.21v-6.196Z" fill="#003449"></path></svg>

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
