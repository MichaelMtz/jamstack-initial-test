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
 * - snowreport.js (provides _log and waitForElement functions)
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
  TARGET_RESORT_ID: '1',
  YOUTUBE_VIDEO_ID: 'aCaoGm4TQC8',
  VIDEO_DIMENSIONS: {
    width: '720',
    height: '405'
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
    <div id="pepsi" class="pepsi abasin">
      <div class="pepsi-content">
        <div class="pepsi-header">
          <div class="pepsi-logo-container powderhorn">   
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 67" width="100" height="67" fill="#054166" class="logo-bogus-basin" role="img">
              <title>Bogus Basin</title>
              <path d="M16.33 28.46c0 .7-.156 1.167-.545 1.478a2.111 2.111 0 0 1-1.322.466h-1.166v-3.732h1.166c.545 0 1.011.155 1.4.466.311.234.467.7.467 1.322ZM16.718 37.403c0 .7-.155 1.244-.544 1.555-.389.389-.933.544-1.477.544h-1.322v-4.354h1.244c.233 0 .544.077.777.155.234.078.467.233.7.389.234.156.39.389.467.7.078.233.155.622.155 1.01Z M35.536 30.482c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644ZM50 0C22.395 0 0 14.774 0 33.048s22.395 33.126 50 33.126 50-14.774 50-33.048C99.922 14.775 77.527 0 50 0ZM21.928 41.135c-.388.856-1.01 1.633-1.71 2.1-.7.544-1.478.933-2.333 1.166a9.48 9.48 0 0 1-2.488.311H7.543V21.384h7.231c.7 0 1.478.078 2.333.233a6.137 6.137 0 0 1 2.333.933 5.422 5.422 0 0 1 1.789 1.945c.466.855.7 1.866.7 3.188 0 1.4-.312 2.566-.856 3.421-.389.544-.777 1.011-1.244 1.322.155.078.233.156.389.233.466.311.855.7 1.244 1.167.389.466.7 1.01.933 1.71.233.7.311 1.4.311 2.256-.155 1.322-.389 2.41-.777 3.343Zm19.44-3.11c-.388 1.477-1.01 2.8-1.788 3.888-.777 1.089-1.71 1.944-2.877 2.566-1.167.622-2.41.933-3.81.933s-2.722-.31-3.81-.933c-1.167-.622-2.1-1.477-2.878-2.566-.777-1.089-1.4-2.41-1.788-3.888a19.808 19.808 0 0 1-.622-4.977c0-1.788.233-3.421.622-4.899.389-1.477 1.01-2.8 1.788-3.888s1.711-1.944 2.877-2.488c1.167-.622 2.411-.855 3.81-.855 1.4 0 2.722.31 3.811.855 1.166.622 2.1 1.477 2.877 2.488.778 1.089 1.322 2.333 1.789 3.888.388 1.478.622 3.11.622 4.9a20.28 20.28 0 0 1-.622 4.976Zm18.119 5.132-.233.156a11.154 11.154 0 0 1-2.722 1.4c-1.089.388-2.333.544-3.733.544-1.477 0-2.799-.311-3.965-.933a8.523 8.523 0 0 1-2.955-2.567c-.778-1.088-1.4-2.332-1.867-3.81a19.182 19.182 0 0 1-.622-4.899c0-1.788.234-3.421.622-4.899.39-1.477 1.011-2.8 1.789-3.888.777-1.088 1.788-1.944 2.877-2.566 1.166-.622 2.41-.933 3.81-.933 1.556 0 2.955.311 4.044.855 1.089.545 1.944 1.245 2.566 2.1l.233.311-3.421 4.588-.467-.622c-.622-.933-1.555-1.322-2.644-1.322-.544 0-1.088.155-1.477.466-.467.311-.778.778-1.089 1.322-.31.545-.544 1.244-.7 2.022a13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.566.156.778.39 1.478.623 2.022.31.544.622 1.011 1.088 1.322.389.311.855.467 1.478.467.544 0 .933-.078 1.244-.234v-3.266h-2.41v-5.443h7.853v12.675h.078Zm18.273-7.154c0 1.244-.155 2.488-.466 3.577a8.67 8.67 0 0 1-1.4 2.955 6.093 6.093 0 0 1-2.566 2.022c-1.01.466-2.255.777-3.732.777-1.4 0-2.644-.233-3.655-.777a6.366 6.366 0 0 1-2.488-2.022c-.623-.855-1.09-1.866-1.4-2.955a17.383 17.383 0 0 1-.389-3.577V21.462h6.143v14.074c0 .623 0 1.167.078 1.711.078.467.155.933.311 1.244.156.312.311.545.622.7.233.156.544.234.933.234s.7-.078.933-.234c.234-.155.467-.389.622-.7a2.93 2.93 0 0 0 .311-1.244c.078-.544.078-1.088.078-1.71V21.461h6.066v14.541Zm14.697 4.899c-.389 1.01-1.01 1.788-1.633 2.488-.7.622-1.477 1.167-2.41 1.478-.856.31-1.867.466-2.8.466-1.4 0-2.721-.233-3.888-.777-1.166-.545-2.1-1.167-2.8-1.867l-.31-.31 3.188-4.666.467.466c.466.467.933.856 1.477 1.089.544.233 1.089.389 1.71.389.467 0 .856-.156 1.167-.467.311-.31.467-.7.467-1.244s-.156-1.01-.545-1.322c-.466-.389-1.166-.855-2.1-1.322-.621-.31-1.243-.622-1.788-1.01a8.738 8.738 0 0 1-1.555-1.4c-.466-.545-.777-1.167-1.01-1.944-.234-.7-.39-1.556-.39-2.566 0-1.322.234-2.489.7-3.422.467-.933 1.011-1.788 1.711-2.333.7-.622 1.478-1.088 2.41-1.322a7.463 7.463 0 0 1 2.567-.466c1.244 0 2.41.233 3.499.622 1.01.389 1.944 1.01 2.566 1.71l.311.312-3.266 4.587-.466-.544c-.311-.389-.7-.7-1.167-.855-.855-.389-1.788-.467-2.488.078-.311.233-.467.7-.467 1.322 0 .544.156.933.467 1.166.389.389 1.088.777 1.944 1.166a8.748 8.748 0 0 1 1.633.933 7.07 7.07 0 0 1 1.633 1.4c.544.544.933 1.167 1.244 1.944.311.778.544 1.71.544 2.722 0 1.4-.233 2.566-.622 3.499ZM34.915 28.46a3.093 3.093 0 0 0-.934-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-.933-.078-1.788-.234-2.566-.155-.933-.31-1.555-.622-2.1Zm.621 2.022c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Z"></path>
            </svg>
            <img src="assets/images/ads/pepsi/2024-pepsi-logo.png" alt="Pepsi" class="logo-pepsi">
          </div>
          <div class="pepsi-copy">Resort of the Week</div>
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
    
    waitForElement('#resort-name').then((elTarget) => {
      const html = generatePepsiROTWHTML();
      elTarget.insertAdjacentHTML('beforebegin', html);
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
