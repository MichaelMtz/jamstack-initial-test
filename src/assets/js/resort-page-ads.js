const waitForElement = (selector) => {
  return new Promise(function (resolve, reject) {
    const element = document.querySelector(selector);

    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const nodes = Array.from(mutation.addedNodes);
        for (const node of nodes) {
          if (node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
};


/**
 * Resort Page Ads Management System
 * 
 * This module handles the display of targeted advertisements on resort pages.
 * It manages both general ads and resort-specific ads with date-based scheduling,
 * random positioning, and analytics tracking.
 * 
 * Dependencies:
 * - snowreport.js (provides _log and waitForElement functions)
 * - Umami analytics (for tracking banner interactions)
 * 
 * @fileoverview Resort advertisement management and display system
 * @author SnoCountry Development Team
 * @version 1.0.0
 */

// Note: Do not need to declare _log, waitForElement, because it is included in snowreport.js.  But this needs included after snowreport.js.
_log('resort-page-ads Initialized...');

/**
 * Displays a general advertisement for specific geographic regions
 * 
 * This function shows a general Upside fuel rewards ad for users in specific
 * New England states and Quebec. The ad includes both desktop and mobile versions
 * and is inserted into the snow report container.
 * 
 * @function checkForGeneralAd
 * @returns {void}
 * 
 * @example
 * // Called automatically when no resort-specific ads are available
 * checkForGeneralAd();
 */
const checkForGeneralAd = () => {
  _log('resort-page-ads Setting general ad...');
  const targetList = [
    "maine", "massachusetts", "new-hampshire", "rhode-island","vermont", "quebec"
  ];
  const target = document.body.dataset.location;
  //if (targetList.includes(target)) {
    
  const html = `
    <div class="internal">
      <a href="https://www.upside.com/users/fuel-smartscript?af_xp=custom&pid=barrington_int&deep_link_value=promo&deep_link_sub1=radio&c=barrington_radio_skyview" target="_blank" >
        <img class="internal-desktop" src="assets/images/ads/upside/BMG-Skyview-Banners-728x90.png" alt="Upside" width="728" height="90"">
        <img class="internal-mobile" src="assets/images/ads/upside/BMG-Skyview-Banners-320x50.png" alt="Upside" width="320" height="50"">
      </a>
    </div>
    `;
  waitForElement('#container-snow-reports .resort.right-col').then((elSnowReportContainer) => {
    elSnowReportContainer.insertAdjacentHTML('afterbegin',html);
  }).catch( (e) => { console.log('Error waiting for Snow Report Container:',e);});
  //}
};
/**
 * Validates if an advertisement should be displayed based on date range
 * 
 * Checks if the current date falls within the advertisement's active date range.
 * If no dates are specified, the ad is considered valid. If dates are provided,
 * the current date must be between start_date and end_date (inclusive).
 * 
 * @function checkAdDates
 * @param {Object} iterResortAd - The advertisement object to validate
 * @param {string} [iterResortAd.start_date] - Start date in YYYY-MM-DD format
 * @param {string} [iterResortAd.end_date] - End date in YYYY-MM-DD format
 * @returns {boolean} True if the ad should be displayed, false otherwise
 * 
 * @example
 * const ad = {
 *   start_date: '2025-01-01',
 *   end_date: '2025-03-31',
 *   img: 'example.jpg'
 * };
 * const shouldShow = checkAdDates(ad); // Returns true if current date is within range
 */
const checkAdDates = (iterResortAd) => {
  let showAd = true;
  if ((iterResortAd.start_date) && (iterResortAd.end_date)) {
    const now = new Date();
    const startDate = new Date(iterResortAd.start_date);
    const endDate = new Date(iterResortAd.end_date );
    //_log(`checkForResortAds: st:${startDate} > now:${now} < end:${endDate}`);
    if ((now < startDate) || (now > endDate)) {
      showAd = false;
    }
  }
  // _log(`checkForResortAds-showAd: ${showAd}`);
  return showAd;
};

/**
 * Tracks banner display events using Umami analytics
 * 
 * Sends a tracking event to Umami analytics when a banner is displayed.
 * If Umami is not yet loaded, it retries every second until it becomes available.
 * The event name follows the pattern: "banner-resort-display-{bannerName}"
 * 
 * @function trackBanner
 * @param {string} bannerName - The name/identifier of the banner being displayed
 * @returns {void}
 * 
 * @example
 * trackBanner('ski-cooper-co'); // Tracks "banner-resort-display-ski-cooper-co"
 */
const trackBanner = (bannerName) => {
  if (window.umami) {
    window.umami.track(`banner-resort-display-${bannerName}`);
  } else {    
    setTimeout(()=> {
      trackBanner(bannerName);
    },1000);
  }
};

/**
 * Generates a random integer between min (inclusive) and max (exclusive)
 * 
 * @function random
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Random integer between min and max
 * 
 * @example
 * random(0, 2); // Returns 0 or 1
 */
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * Generates random positioning order for advertisements
 * 
 * Returns an array of two CSS selectors in random order. This is used
 * to randomize the placement of multiple ads with 'random' position type.
 * The two positions are: top of resort name and bottom of footer resort ad.
 * 
 * @function randomPositions
 * @returns {string[]} Array of two CSS selectors in random order
 * 
 * @example
 * const positions = randomPositions();
 * // Returns either:
 * // ['#resort-name', '.footer-resort-ad .resort__container'] or
 * // ['.footer-resort-ad .resort__container', '#resort-name']
 */
const randomPositions = () => {
  const randomIndex = random(0,2);
  return (randomIndex == 0) ? ['#resort-name','.footer-resort-ad .resort__container'] : ['.footer-resort-ad .resort__container','#resort-name'];
};
/**
 * Filters resort advertisements to only include currently valid ones
 * 
 * Takes a list of resort advertisements and filters out any that are not
 * currently active based on their date ranges. Uses checkAdDates() to
 * validate each advertisement.
 * 
 * @function selectCurrentAd
 * @param {Object[]} resortAdList - Array of advertisement objects
 * @param {string} [resortAdList[].start_date] - Start date in YYYY-MM-DD format
 * @param {string} [resortAdList[].end_date] - End date in YYYY-MM-DD format
 * @param {string} resortAdList[].img - Image filename
 * @param {string} resortAdList[].href - Link URL
 * @param {string} resortAdList[].alt - Alt text for image
 * @param {number} resortAdList[].width - Image width
 * @param {number} resortAdList[].height - Image height
 * @param {string} resortAdList[].position - Position type ('top', 'bottom', 'both', 'random')
 * @returns {Object[]} Array of currently valid advertisement objects
 * 
 * @example
 * const ads = [
 *   { img: 'ad1.jpg', start_date: '2025-01-01', end_date: '2025-03-31' },
 *   { img: 'ad2.jpg', start_date: '2025-06-01', end_date: '2025-08-31' }
 * ];
 * const validAds = selectCurrentAd(ads); // Returns only currently valid ads
 */
const selectCurrentAd = (resortAdList) => {
  _log('selectCurrentAd::resortAdList:',resortAdList);
  // 1st check how many are valid after date check
  const validResortAds = [];
  resortAdList.forEach((iterResortAd) => {
    if (checkAdDates(iterResortAd)) {
      validResortAds.push(iterResortAd);
    }
  });
  const returnValidAds = validResortAds;
  _log('selectCurrentAd::returnValidAds:',returnValidAds);
  return returnValidAds;
};

/**
 * Main advertisement management system - executed when DOM is loaded
 * 
 * This is the primary function that manages resort-specific advertisements.
 * It reads the resort ID from the page's data attribute, looks up corresponding
 * ads in the currentResortAds database, validates them by date, and displays
 * them in the appropriate positions on the page.
 * 
 * Special handling:
 * - Resort ID '1' shows a special Pepsi "Resort of the Week" video
 * - Other resort IDs show targeted banner advertisements
 * - Fallback to general ads if no resort-specific ads are found
 * 
 * @event DOMContentLoaded
 * @listens document#DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded',()=> {
  _log('checkForResortAds begin');

  const resort_id = document.body.dataset.snowreport;
  
  /**
   * Database of resort-specific advertisements
   * 
   * This object contains all available resort advertisements keyed by resort ID.
   * Each resort can have multiple ads with different date ranges and positioning.
   * 
   * @type {Object.<string, Object>}
   * @property {Object.<string, Object>} currentResortAds - Main ads database
   * @property {Object[]} currentResortAds[resortId].ads - Array of ads for specific resort
   * @property {string} currentResortAds[resortId].ads[].img - Image filename
   * @property {string} currentResortAds[resortId].ads[].href - Link URL
   * @property {number} currentResortAds[resortId].ads[].width - Image width in pixels
   * @property {number} currentResortAds[resortId].ads[].height - Image height in pixels
   * @property {string} currentResortAds[resortId].ads[].alt - Alt text for accessibility
   * @property {string} currentResortAds[resortId].ads[].position - Position type ('top', 'bottom', 'both', 'random')
   * @property {string} [currentResortAds[resortId].ads[].start_date] - Start date (YYYY-MM-DD)
   * @property {string} [currentResortAds[resortId].ads[].end_date] - End date (YYYY-MM-DD)
   * @property {string} [currentResortAds[resortId].ads[].comment] - Optional comment for management
   */
  const currentResortAds = {
    719003 : {
      ads: [ {
        img: '2025-01-10-Cooper-728x90.jpg',
        href:"https://www.skicooper.com/cooper-day-pass/",
        width:728, 
        height:90,
        alt: 'Ski Cooper, CO',
        position:'both',
        start_date: '2025-01-10',
        end_date: '2025-01-31'
      }]
    }, 603005 : {
      ads: [{
        img: '2024-12-11-Bretton-Woods.jpg',
        href:"https://www.brettonwoods.com",
        width:728, 
        height:90,
        alt: 'Bretton Woods, NH',
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 603019 : {
      ads: [{
        img: '2025-03-06-Ragged-Pass-Sale.png',
        href:"https://www.raggedmountainresort.com/mission-affordable-season-passes/",
        width:728, 
        height:90,
        alt: 'Ragged Mountain, NH',
        position: 'both',
        start_date: '2025-03-07',
        end_date: '2025-04-07'
      }]
    }, 616006 : {
      ads: [{
        img: '2025-01-16-Crystal-Hurry.jpg',
        href:"https://www.crystalmountain.com/ski/slopes/",
        width:728, 
        height:90,
        alt: 'Crystal Mountain MI',
        position: 'both',
        start_date: '2025-01-16',
        end_date: '2025-04-05'
      }]
    }, 906004 : {
      ads: [{
        img: '2025-02-07-Snow-River.jpg',
        href:"https://www.saddlebackmaine.com/?utm_source=SnoCountry&utm_medium=Display&utm_campaign=SkierVisits25",
        width:728, 
        height:90,
        alt: 'SnowRiver MI',
        position: 'both',
        start_date: '2025-02-06',
        end_date: '2025-04-06'
      }]
    }, 603009 : {
      ads: [{
        img: '2025-03-01-Gunstock.png',
        href:"https://www.gunstock.com/winter/tickets-passes/",
        width:728, 
        height:90,
        alt: 'Gunstock',
        position: 'both',
        start_date: '2025-03-01',
        end_date: '2025-04-01'
      }]
    },715002:{
      ads: [{
        img: '715002.jpg',
        href:"https://order.skigranitepeak.com/v2/lodging-offers?utm_source=snocountry&utm_medium=banner&utm_campaign=display&utm_content=728x90",
        width:728, 
        height:90,
        alt: 'Granite',
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },607001:{
      ads: [{
        img: '2025-01-16-Greek-Peak.jpg',
        href:"https://www.greekpeak.net",
        width:728, 
        height:90,
        alt: 'Greek Peak NY',
        start_date: '2025-01-02',
        end_date: '2025-04-30',
        position: 'random'
      },{
        img: '2025-02-14-Greek-Peak.png',
        href:"https://www.greekpeak.net",
        width:728, 
        height:90,
        alt: 'Greek Peak NY',
        start_date: '2025-02-14',
        end_date: '2025-03-31',
        position: 'random'
      }]
    },716003:{
      ads: [{
        img: '716003.jpg',
        href:"https://www.holidayvalley.com/lodging/inn-holiday-valley/",
        width:728, 
        height:90,
        alt: 'Holiday Valley',
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },307008:{
      ads: [{
        img: '2025-02-20-Jackson-Hole.gif',
        href:"https://www.jacksonhole.com/300-off?utm_source=snocountry&utm_medium=display&utm_campaign=air-credit",
        width:728, 
        height:90,
        alt: 'Jackson Hole 400 off air credit',
        position:'random',
        start_date: '2025-02-20',
        end_date: '2025-03-31'       
      },{
        img: '2024-08-06-Jackson-Hole-GT-728x90.jpg',
        href:"https://www.jacksonhole.com/golden-ticket?utm_source=snocountry&utm_medium=display&utm_campaign=golden-ticket",
        width:728, 
        height:90,
        alt: 'Jackson Hole Golden Ticket',
        position:'random',
        start_date: '2024-08-20',
        end_date: '2025-04-13'
      }]
      
    },802006: {
      ads: [{
        img: '2025-01-10-Jay-Peak_2025_Pepsi_Ad.jpg',
        href:"https://jaypeakresort.com/",
        width:728, 
        height:90,
        alt: 'Jay Peak',
        position:'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },802007: {
      ads: [{
        img: '2025-01-16-Killington-Winter.jpg',
        href:"https://www.killington.com/be-the-beast?utm_campaign=brand?utm_source=snocountry?utm_medium=web-listing",
        width:728, 
        height:90,
        alt: 'Killington VT',
        position:'both',
        start_date: '2025-01-16',
        end_date: '2025-04-30'
      }]
    },802009:{
      ads: [{
        img: 'Magic-Mountain-11-23-21.jpg',
        href:"http://www.magicmtn.com",
        width:728, 
        height:90,
        alt: 'Magic Mountain',
        position:'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },603015:{
      ads: [{
        img: 'McIntyre_SnoCountry2022-23_728x90.jpg',
        href:"https://www.mcintyreskiarea.com/mountain-report/",
        width:728, 
        height:90,
        alt: 'McIntyre Ski Area',
        position:'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },914004:{
      ads: [{
        img: '2025-01-22-Mt-Peter.jpg',
        href:"https://www.mtpeter.com/sc/",
        width:728, 
        height:90,
        alt: 'Mt. Peter NY',
        position:'random',
        start_date: '2025-01-17',
        end_date: '2025-04-22'
      }]
    },518007:{
      ads: [{
        img: '2025-01-14-Oak-Mountain.png',
        href:"https://www.oakmountainski.com/",
        width:728, 
        height:90,
        alt: 'Oak Mountain NY',
        position:'both',
        start_date: '2025-01-13',
        end_date: '2025-03-23'
      }]
    },518010:{
      ads: [{
        img: '2024-11-22-West-Mountain.jpg',
        href:"https://westmountain.com/",
        width:728, 
        height:90,
        alt: 'West Mountain NY',
        position:'both',
        start_date: '2024-11-25',
        end_date: '2025-05-01'
      }]
    },203004:{
      ads: [{
        img: 'Powder_Ridge_12-6-21.jpg',
        href:"https://powderridgepark.com/",
        width:728, 
        height:90,
        alt: 'Powder Ridge CT',
        position:'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },207001:{
      ads: [{
        img: '2024-12-05-BlackMountain.png',
        href:"https://skiblackmountain.org/tickets-passes",
        width:728, 
        height:90,
        alt: 'Black Mountain ME',
        position:'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },207002: {
      ads: [{
        img: '2025-02-15-Camden.jpg',
        href:"https://camdensnowbowl.com/",
        width:728, 
        height:90,
        alt: 'Camden Snowbowl ME',
        position:'both',
        start_date: '2025-02-14',
        end_date: '2025-03-31'
      }]
    }, 207006:{
      ads: [{
        img: '2025-02-07-Saddleback.png',
        href:"https://www.saddlebackmaine.com/?utm_source=SnoCountry&utm_medium=Display&utm_campaign=SkierVisits25",
        width:728, 
        height:90,
        alt: 'Saddleback ME',
        position:'both',
        start_date: '2025-02-06',
        end_date: '2025-04-06'
      }]
    }, 207008:{
      ads: [{
        img: '2025-05-02-Sugarloaf.jpg',
        href: "https://www.sugarloaf.com/",
        height:90,
        alt: 'Sugarloaf ME',
        position:'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },207014: {
      ads: [{
        img: '2025-01-04-BigRock-728x90.png',
        href:"https://www.groupon.com/deals/gl-big-rock-mountain",
        width:728, 
        height:90,
        alt: 'Big Rock ME',
        position:'both',
        start_date: '2025-01-10',
        end_date: '2025-03-23'
      }]
      
    },208001:{
      ads: [{
        img: '2025-01-25-Bogus-Basin.jpg',
        href:"https://bogusbasin.org/tickets-passes/season-passes/",
        width:728, 
        height:90,
        alt: 'Bogus Basin ID',
        position:'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },208004: {
      ads: [{
        img: '2025-03-13-Lookout-Idaho.jpg',
        href:"https://skilookout.com/season-pass",
        width:728, 
        height:90,
        alt: 'Ski Lookout ID',
        position:'both',
        start_date: '2025-03-13',
        end_date: '2025-04-20'
      }]
    },208008:{
      ads: [{
        img: '2024-07-03-schweitzer-summer-728x90.jpg',
        href:"https://bit.ly/3VTawv1",
        width:728, 
        height:90,
        alt: 'Schweitzer ID',
        position:'both',
        start_date: '2024-07-03',
        end_date: '2024-09-01'
      }]
    }, 208010: {
      ads: [{        
        img: '2025-03-06-Soldier-Mtn.png',
        href:"https://soldiermountain.com/",
        width:728, 
        height:90,
        alt: 'Soldier Mountain ID',
        position:'both',
        comment: 'General ad',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },717016:{
      ads: [{
        img: 'Big-Bear-12-15-21.png',
        href:"https://www.ski-bigbear.com/",
        width:728, 
        height:90,
        alt: 'Ski Big Bear PA', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },203005:{
      ads: [{
        img: '2025-02-13-Sundown-Night-Skiing-728x90.png',
        href:"https://skisundown.com/the-mountain/night-skiing/",
        width:728, 
        height:90,
        alt: 'Ski Sundown CT', 
        position: 'random',
        start_date: '2025-02-13',
        end_date: '2025-02-28'
      },{
        img: '2025-02-13-Sundown-Clase-To-Home-728x90.png',
        href:"https://skisundown.com/",
        width:728, 
        height:90,
        alt: 'Ski Sundown CT', 
        position: 'random',
        start_date: '2025-03-01',
        end_date: '2025-03-31'
      }]
    },304001:{
      ads: [{
        img: 'Snowshoe-12-8-20.jpg',
        href:"https://www.snowshoemtn.com/",
        width:728, 
        height:90,
        alt: 'Snowshoe WV', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },
    802019:{
      ads: [{
        img: '2025-01-16-Stratton-Snow-Alert.jpg',
        href:"https://www.stratton.com/plan-your-trip/deals-and-packages?utm_source=banner&utm_medium=snowtime&utm_id=snocountry",
        width:728, 
        height:90,
        alt: 'Stratton Mountain VT', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },
    802023:{
      ads: [{
        img: '2025-01-22-Sugarbush.jpg',
        href:"https://www.sugarbush.com/things-to-do/challenge",
        width:728, 
        height:90,
        alt: 'Sugarbush VT', 
        position: 'both',
        start_date: '2025-01-22',
        end_date: '2025-05-01'
      }]
    },607005:{
      ads: [{
        img: 'Swain-11-23-21.png',
        href:"https://swain.com/",
        width:728, 
        height:90,
        alt: 'Swain NY', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },703002:{
      ads: [{
        img: '2025-02-14-Omni-Homestead.jpg',
        href:"https://www.omnihotels.com/hotels/homestead-virginia/specials/ski-package?utm_source=snocountry&utm_medium=banner&utm_campaign=awareness-homrst-leisure-ski",
        width:728, 
        height:90,
        alt: 'Omni Homestead VA', 
        position: 'both',
        start_date: '2025-02-14',
        end_date: '2025-05-01'
      }]
    },603001:{
      ads: [{
        img: '2025-01-16-Waterville.jpg',
        href:"https://www.waterville.com/season-passes",
        width:728, 
        height:90,
        alt: 'Waterville Valley NH', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },603026:{
      ads: [{
        img: 'Whaleback_Mountain_728_x_90_px.jpg',
        href:"https://www.whaleback.com/",
        width:728, 
        height:90,
        alt: 'Whaleback NH', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },518009:{
      ads: [{
        img: 'Windham_Mountain_12-1-21.jpg',
        href:"https://www.windhammountain.com?utm_source=snocountry&utm_medium=display&utm_campaign=winter_2&utm_id=snocountry",
        width:728, 
        height:90,
        alt: 'Windham NY', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },303009:{
      ads: [{
        img: '2024-07-04-copper-snocountry-728x90.jpg',
        href:"https://www.coppercolorado.com/plan-your-trip/season-passes/copper-season-pass-2024-25",
        width:728, 
        height:90,
        alt: 'Copper Mountain CO', 
        position: 'both',
        start_date: '2024-07-02',
        end_date: '2024-09-01'
      }]
    },307002:{
      ads: [{
        img: '2025-01-14-Grand-Targhee.png',
        href:"https://www.grandtarghee.com/",
        width:728, 
        height:90,
        alt: 'Grand Targhee CO', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },717013:{
      ads: [{
        img: '2024-01-31-Whitetail-Banner-728x90.jpg',
        href:"https://www.skiwhitetail.com",
        width:728, 
        height:90,
        alt: 'Whitetail Resort PA', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },702001:{
      ads: [{
        img: '2024-11-19-Diamond-Peak.jpg',
        href:"https://www.diamondpeak.com/tickets-passes-rentals/lift-tickets/",
        width:728, 
        height:90,
        alt: 'Diamond Peak CA', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },
    702002:{
      ads: [{
        img: '2025-01-22-Lee-Canyon.png',
        href:"https://www.leecanyonlv.com/",
        width:728, 
        height:90,
        alt: 'Lee Canyon NV', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },717003:{
      ads: [{
        img: '2024-11-19-Camelback-Winter.jpg',
        href:"https://www.camelbackresort.com/ski-tube/ski-tickets-passes/",
        width:728, 
        height:90,
        alt: 'Camelback PA', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 503004 : {
      ads: [{
        img: '2025-02-07-Mt-Bachelor.jpg',
        href:"https://www.mtbachelor.com/tickets-passes/lift-tickets",
        width:728, 
        height:90,
        alt: 'Mt Bachelor OR',
        position: 'random',
        start_date: '2025-02-06',
        end_date: '2025-02-28'
      },{
        img: '2024-Mt-Bachelor-Book-Your-Trip.jpg',
        href:"https://www.mtbachelor.com/tickets-passes/lift-tickets",
        width:728, 
        height:90,
        alt: 'Mt Bachelor OR',
        position: 'random',
        start_date: '2024-12-04',
        end_date: '2025-05-19'
      }]
    }, 503006: {
      ads: [{
        img: '2025-02-22-Mount-Hood.jpg',
        href:"https://www.skihood.com/store/passes",
        width:728, 
        height:90,
        alt: 'Mount Hood Meadows OR',
        position: 'both',
        start_date: '2025-02-22',
        end_date: '2025-02-29'
      }]
    }, 814002:{
      ads: [{
        img: 'Seven-Springs-resort-ad-728x90.jpg',
        href:"https://www.7springs.com/",
        width:728, 
        height:90,
        alt: 'Seven Springs PA', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },802013: {
      ads: [{
        img: '2024-Okemo-728x90.jpg',
        href:"https://www.okemo.com/?utm_source=web&utm_medium=banner&utm_campaign=resort_of_the_week+&utm_id=snocountry2023",
        width:728, 
        height:90,
        alt: 'Okemo Mountain VT', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },209002: {
      ads: [{
        img: '2025-03-11-Cali-Pass.png',
        href:"https://www.thecalipass.com/buynow",
        width:728, 
        height:90,
        alt: 'Bear Valley Mountain Resort CA', 
        position: 'both',
        start_date: '2025-03-11',
        end_date: '2025-04-30'
      }]
    },209003: {
      ads: [{
        img: '2025-03-11-Cali-Pass.png',
        href:"http://www.thecalipass.com/buynow",
        width:728, 
        height:90,
        alt: 'Dodge Ridge CA', 
        position: 'both',
        start_date: '2025-03-11',
        end_date: '2025-04-30'
      }]
    },209005: {
      ads: [{
        img: '2025-03-11-Cali-Pass.png',
        href:"http://www.thecalipass.com/buynow",
        width:728, 
        height:90,
        alt: 'China Peak CA', 
        position: 'both',
        start_date: '2025-03-11',
        end_date: '2025-04-30'
      }]
    },619006: {
      ads: [{
        img: '2025-06-12-Mountain-High.png',
        href:"https://www.mthigh.com/site/mountain/events-and-activities/mountain-biking",
        width:728, 
        height:90,
        alt: 'Mountain High CA', 
        position: 'both',
        start_date: '2025-06-11',
        end_date: '2025-10-30'
      }]
    }, 413006: {
      ads: [{
        img: 'Jiminy-2023-12-01-728x90px-3.jpg',
        href:"https://www.jiminypeak.com/",
        width:728, 
        height:90,
        alt: 'Jiminy Peak MA', 
        position: 'both',
        start_date: '2023-12-01',
        end_date: '2024-04-07'
      }]
    }, 413008: {
      ads: [{
        img: '2025-01-16-Otis-Ridge.png',
        href:"https://otisridge.com/",
        width:728, 
        height:90,
        alt: 'Otis Ridge MA', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 603013 : {
      ads: [{
        img: '2025-01-17-Tenney.png',
        href:"https://www.skitenney.com",
        width:728, 
        height:90,
        alt: 'Tenney NH', 
        position: 'both',
        start_date: '2025-01-17',
        end_date: '2025-04-15'
      }]
    }, 603018: {
      ads: [{
        img: '2024-11-19-Pats-Peak.jpg',
        href:"https://www.patspeak.com/the-mountain/mountain-info/snow-report/",
        width:728, 
        height:90,
        alt: 'Pats Peak NH', 
        position: 'both',
        start_date: '2024-11-19',
        end_date: '2028-12-01'
      }]
    }, 802021: {
      ads: [{
        img: 'Saskadena-Six-2023-12-04.gif',
        href:"https://www.saskadenasix.com/winter/skiing-snowboarding?utm_source=SnoCountry&utm_medium=Banner&utm_campaign=S6",
        width:728, 
        height:90,
        alt: 'Saskadena Six VT', 
        position: 'both',
        start_date: '2023-12-01',
        end_date: '2024-03-24'
      }]
    }, 303020: {
      ads: [{
        img: '2024-12-10-Aspen-Snowmass.jpg',
        href:"https://www.aspensnowmass.com/discover/experiences/stories/long-love-aspen-long-love-skiing",
        width:728, 
        height:90,
        alt: 'Aspen Snowmass CO', 
        position: 'both',
        start_date: '2024-12-11',
        end_date: '2025-04-30'
      }]
      
    }, 303022: {
      ads: [{
        img: 'Telluride-2024-01-04-Pepsi.png',
        href:"https://tellurideskiresort.com/",
        width:728, 
        height:90,
        alt: 'Telluride CO', 
        position: 'both',
        start_date: '2023-12-01',
        end_date: '2024-03-24'
      }]
      
    }, 303001: {
      ads: [{
        img: '2025-6-11-ABasin.png',
        href:"https://arapahoebasin.com/",
        width:640, 
        height:100,
        alt: 'Arapahoe Basin CO', 
        position: 'both',
        start_date: '2025-06-10',
        end_date: '2025-06-16'
      }]
      
    }, 703003: {
      ads: [{
        img: 'Massanutten-2023-08-03-728x90.jpg',
        href:"https://www.massresort.com/play/snow-sports/season-passes/?utm_source=SnoCountry&utm_medium=banner&utm_campaign=ski-season-pass",
        width:640, 
        height:100,
        alt: 'Massanutten VA', 
        position: 'both',
        start_date: '2024-01-08',
        end_date: '2024-04-24'
      }]
    }, 909002: {
      ads: [{
        img: '2024-BigBearMountainResort-728x90.jpg',
        href:"https://www.bigbearmountainresort.com/deals-and-discounts/triple-pack?utm_source=SnoCountry&utm_medium=Banner&utm_campaign=Triple-Pack-Promo&utm_id=Triple-Pack",
        width:640, 
        height:100,
        alt: 'Big Bear Mountain Resort CA', 
        position: 'both',
        start_date: '2024-01-16',
        end_date: '2024-02-27'
      }]
    }, 909001: {
      ads: [{
        img: '2024-BigBearMountainResort-728x90.jpg',
        href:"https://www.bigbearmountainresort.com/deals-and-discounts/triple-pack?utm_source=SnoCountry&utm_medium=Banner&utm_campaign=Triple-Pack-Promo&utm_id=Triple-Pack",
        width:640, 
        height:100,
        alt: 'Snow Summit Resort CA', 
        position: 'both',
        start_date: '2024-01-16',
        end_date: '2024-02-27'
      }]
    }, 909005: {
      ads: [{
        img: '2024-SnowValley.jpg',
        href:"https://www.bigbearmountainresort.com/deals-and-discounts/triple-pack?utm_source=SnoCountry&utm_medium=Banner&utm_campaign=Triple-Pack-Promo&utm_id=Triple-Pack",
        width:640, 
        height:100,
        alt: 'Snow Valleu Resort CA', 
        position: 'both',
        start_date: '2024-01-16',
        end_date: '2024-02-27'
      }]
    }, 406001: {
      ads: [{
        img: '2024-10-30-Whitefish-728x90.jpg',
        href:"https://bit.ly/3Uy6A2P",
        width:728, 
        height:90,
        alt: 'Whitefish Mountain Resort MT', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 406009: {
      ads: [{
        img: '2025-06-10-RedLodge.jpg',
        href:"https://www.redlodgemountain.com/summer-operations/",
        width:728, 
        height:90,
        alt: 'Red Lodge MT', 
        position: 'both',
        start_date: '2025-06-10',
        end_date: '2025-09-10'
      }]
    }, 303025 : {
      ads: [{
        img: '2024-10-17-WolfCreek.jpg',
        href:"https://wolfcreekski.com",
        width:728, 
        height:90,
        alt: 'Wolf Creek CO', 
        position: 'both',
        start_date: '2024-10-17',
        end_date: '2025-04-30'
      }]
    }, 303015 : {
      ads: [{
        img: '2024-11-08-Loveland-728x90-4Pak.jpg',
        href:"https://skiloveland.com/4-pak/",
        width:728, 
        height:90,
        alt: 'Loveland Ski Area CO', 
        position: 'both',
        start_date: '2024-11-07',
        end_date: '2024-11-24'
      }]
    }, 303016: {
      ads: [{
        img: '2025-01-04-PowderhornSnoCtBannerV0.png',
        href:"https://powderhorn.com/",
        width:728, 
        height:90,
        alt: 'Powderhorn CO', 
        position: 'both',
        start_date: '2025-01-10',
        end_date: '2025-05-27'
      }]
    }, 303019: {
      ads: [{
        img: '2024-12-10-Sunlight.jpeg',
        href:"https://sunlightmtn.com/plan-your-trip/lessons",
        width:728, 
        height:90,
        alt: 'Sunlight Mtn CO', 
        position: 'random',
        start_date: '2024-12-11',
        end_date: '2025-04-03'
      }, {
        img: '2025-02-20-Sunlight.png',
        href:"https://sunlightmtn.com",
        width:728, 
        height:90,
        alt: 'Sunlight Mtn CO', 
        position: 'random',
        start_date: '2024-12-11',
        end_date: '2025-03-31'
        
      }]
    }, 719002: {
      ads: [{
        img: '2025-02-20-Monarch.jpg',
        href:"https://skimonarch.com/",
        width:600, 
        height:388,
        alt: 'Monarch Mountain CO', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 208002: {
      ads: [{
        img: '2025-06-11-Brundage.png',
        href:"https://brundage.com/",
        width:600, 
        height:388,
        alt: 'Brundage ID ', 
        position: 'both',
        start_date: '2025-06-11',
        end_date: '2025-10-31'
      }]
    }, 802003: {
      ads: [{
        img: '2024-08-06-Bromley-728x90.jpg',
        href:"https://www.bromley.com/",
        width:728, 
        height:90,
        alt: 'Bromley VT ', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 517005: {
      ads: [{
        img: '2024-11-07-TreeTop-NewYear-728x90.jpg',
        href:"https://www.treetops.com/events/",
        width:728, 
        height:90,
        alt: 'Treetops MI', 
        position: 'both'
      }]
    }, 313006: {
      ads: [{
        img: '2024-11-30-Ostego.png',
        href:"https://www.otsegoclub.com/ski/mountain-information/",
        width:728, 
        height:90,
        alt: 'Otsego Club MI', 
        position: 'both',
        start_date: '2024-12-01',
        end_date: '2025-04-27'
      }]
    }, 313012: {
      ads: [{
        img: '2025-01-17-Schuss-at-Shanty.jpg',
        href:"http://shantycreek.com/compare-save",
        width:728, 
        height:90,
        alt: 'Schuss Mountain at Shanty Creek Resort MI', 
        position: 'both',
        start_date: '2025-01-01',
        end_date: '2025-04-27'
      }]
    }, 607002: {
      ads: [{
        img: '2024-11-13-skicny-season.png',
        href:"https://www.skicny.com",
        width:728, 
        height:90,
        alt: 'Labrador NY', 
        position: 'both',
        start_date: '2024-11-13',
        end_date: '2024-11-21'
      },{
        img: '2024-11-13-skicny-black-friday.png',
        href:"https://www.skicny.com",
        width:728, 
        height:90,
        alt: 'Labrador NY', 
        position: 'both',
        start_date: '2024-11-22',
        end_date: '2024-12-02'
      },{
        img: '2024-11-13-skicny-sno.png',
        href:"https://www.skicny.com",
        width:728, 
        height:90,
        alt: 'Labrador NY', 
        position: 'both',
        start_date: '2024-12-03',
        end_date: '2025-03-01'
      }]
    }, 315006: {
      ads: [{
        img: '2024-11-13-skicny-season.png',
        href:"https://www.skicny.com",
        width:728, 
        height:90,
        alt: 'Labrador NY', 
        position: 'both',
        start_date: '2024-11-13',
        end_date: '2024-11-21'
      },{
        img: '2024-11-13-skicny-black-friday.png',
        href:"https://www.skicny.com",
        width:728, 
        height:90,
        alt: 'Labrador NY', 
        position: 'both',
        start_date: '2024-11-22',
        end_date: '2024-12-02'
      },{
        img: '2024-11-13-skicny-sno.png',
        href:"https://www.skicny.com",
        width:728, 
        height:90,
        alt: 'Labrador NY', 
        position: 'both',
        start_date: '2024-12-03',
        end_date: '2025-03-01'
      }]
    }, 608001: {
      ads: [{
        img: '2024-11-22-CascadeMtn.jpg',
        href:"https://www.cascademountain.com/",
        width:728, 
        height:90,
        alt: 'Cascade WI', 
        position: 'both',
        start_date: '2024-11-22',
        end_date: '2025-11-11'
      }]
    }, 413001: {
      ads: [{
        img: '2024-11-22-BerkshireEast.png',
        href:"https://berkshireeast.com",
        width:728, 
        height:90,
        alt: 'Berkshire East MA', 
        position: 'both',
        start_date: '2024-11-22',
        end_date: '2025-03-15'
      }]
    }, 615001: {
      ads: [{
        img: '2024-12-11-Ober.jpg',
        href:"https://obermountain.com/",
        width:728, 
        height:90,
        alt: 'Ober Mountain TN', 
        position: 'both',
        comment: 'general ad - can keep running',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 704006: {
      ads: [{
        img: '2024-12-11-Sugar-Mountain.jpg',
        href:"https://www.skisugar.com",
        width:728, 
        height:90,
        alt: 'Sugar Mountain NC', 
        position: 'both',
        comment: 'general ad - can keep running',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 801008: {
      ads: [{
        img: '2025-03-10-Powder-Mtn-Lines-Carve.png',
        href:"https://powdermountain.com/tickets/season-passes",
        width:728, 
        height:90,
        alt: 'Powder Mountain UT', 
        position: 'random',
        start_date: '2025-03-10',
        end_date: '2025-04-11',
        comment: 'winter ad'
      },{
        img: '2025-03-10-Powder-Mtn.png',
        href:"https://powdermountain.com/tickets/season-passes",
        width:728, 
        height:90,
        alt: 'Powder Mountain UT', 
        position: 'random',
        start_date: '2025-03-10',
        end_date: '2025-04-11',
        comment: 'winter ad'
      }]
    }, 801010: {
      ads: [{
        img: '2024-12-26-Snowbird-728x90.jpg',
        href:"https://www.snowbird.com/tickets-passes/tickets",
        width:728, 
        height:90,
        alt: 'Snowbird UT', 
        position: 'both',
        start_date: '2024-12-26',
        end_date: '2025-04-11',
        comment: 'winter ad - pepsi'
      }]
      
    }, 218002: {
      ads: [{
        img: '2025-01-16-Giants-Ridge.png',
        href:"https://www.giantsridge.com/",
        width:728, 
        height:90,
        alt: 'Giants Ridge MN', 
        position: 'both',
        comment: 'winter ad',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 218003: {
      ads: [{
        img: '2025-06-24-Lutsen-728x90.jpg',
        href:"https://www.lutsen.com/?utm_source=snocountry&utm_medium=display&utm_campaign=banner&utm_id=summer",
        width:728, 
        height:90,
        alt: 'Lutsen Mountains MN', 
        position: 'both',
        comment: 'summer ad',
        start_date: '2025-07-01',
        end_date: '2025-08-01',
      }]
    }, 508002: {
      ads: [{
        img: '2025-01-17-Bradford.png',
        href:"http://skibradford.com",
        width:300, 
        height:250,
        alt: 'Ski Bradford MA', 
        position: 'both',
        comment: 'winter ad',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    },802015:{
      ads: [{
        img: '2025-01-21-Quechee-Explore.png',
        href:"https://quecheeclub.com/web/pages/season-passes-and-daily-rates?utm_source=snocountry&utm_medium=ad1",
        width:728, 
        height:90,
        alt: 'Ski Quechee VT',
        position:'random',
        start_date: '2025-01-21',
        end_date: '2025-03-01'
      },{
        img: '2025-01-21-Quechee-Explore-2.png',
        href:"https://quecheeclub.com/web/pages/season-passes-and-daily-rates?utm_source=snocountry&utm_medium=ad4",
        width:728, 
        height:90,
        alt: 'Ski Quechee VT',
        position:'random',
        start_date: '2025-01-21',
        end_date: '2025-03-01'
      },{
        img: '2025-01-21-Quechee-Explore-3.png',
        href:"https://quecheeclub.com/web/pages/season-passes-and-daily-rates?utm_source=snocountry&utm_medium=ad5",
        width:728, 
        height:90,
        alt: 'Ski Quechee VT',
        position:'random',
        start_date: '2025-01-21',
        end_date: '2025-03-01'
      }] 
    }, 616002: {
      ads: [{
        img: '2025-02-21-The-Highlands.jpg',
        href:"https://www.highlandsharborsprings.com/tickets?utm_source=SnoCountry&utm_medium=banner&utm_campaign=SnoCountry_feb25",
        width:728, 
        height:90,
        alt: 'The Highlands MI', 
        position: 'both',
        comment: 'winter ad',
        start_date: '2025-02-22',
        end_date: '2025-03-21'  
      }]
    }, 201003 : {
      ads: [{
        img: '2025-01-23-Mountain-Creek.gif',
        href:"https://mountaincreek.com/",
        width:728, 
        height:90,
        alt: 'Mountain Creek NJ', 
        position: 'both',
        comment: 'winter ad',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 603007 : {
      ads: [{
        img: '2025-01-24-Cranmore.png',
        href:"https://cranmore.com/tickets",
        width:728, 
        height:90,
        alt: 'Cranmore NH', 
        position: 'both',
        comment: 'winter ad',
        start_date: '2025-01-01',
        end_date: '2025-05-01'
      }]
    }, 203001 : {
      ads: [{
        img: '2025-02-04-Mohawk.png',
        href:"https://www.mohawkmtn.com/",
        width:728, 
        height:90,
        alt: 'Mohawk CT', 
        position: 'both',
        comment: 'winter ad',
        start_date: '2025-02-04',
        end_date: '2025-03-31'
      }]
    }
  };
  

  // Process resort-specific advertisements
  if (currentResortAds[resort_id]) {
    let resortAds = currentResortAds[resort_id].ads;
    //_log(`checkForResortAds::resort_id: ${resort_id}: `,resortAds);

    // Filter ads to only show currently valid ones
    resortAds = selectCurrentAd(resortAds);
    
    // Initialize variables for random positioning
    let randomAdPositions = [];
    let first = true;
    let adPosition = 0;
    
    // Process each valid advertisement
    resortAds.forEach((iterResortAd) => {
      // Set up random positioning for the first random ad encountered
      if ((iterResortAd.position == 'random') && (first)) {
        first = false;
        randomAdPositions = randomPositions();
        _log('checkForResortAds: Random detected:');
        console.log(randomAdPositions);
      }
      
      _log('checkForResortAds: applying ad');   
      console.log(iterResortAd);
      
      // Create sanitized alt text for analytics tracking
      const alt = iterResortAd.alt.replaceAll(' ', '-'); 
      
      // Generate HTML for the advertisement
      const html = `
      <div class="resort-ad">
        <a href="${iterResortAd.href}" target="_blank" data-umami-event="banner-resort-click-${alt}">
          <img class="img-resort-ad" src="assets/images/resort-ads/${iterResortAd.img}" alt="${iterResortAd.alt}" width="${iterResortAd.width}" height="${iterResortAd.height}" data-umami-event="banner-resort-click-${alt}">
        </a>
      </div>
      `;
      
      // Position advertisement based on position type
      if ((iterResortAd.position === 'top') || (iterResortAd.position === 'both') ) {
        waitForElement('#resort-name').then((elResortName) => {
          elResortName.insertAdjacentHTML('beforebegin',html);
        }).catch( () => { console.log('Error waiting for checkForResortAds:');});
      }
      if ((iterResortAd.position === 'bottom') || (iterResortAd.position === 'both') ) {
        waitForElement('.footer-resort-ad .resort__container').then((elResortName) => {
          elResortName.insertAdjacentHTML('afterbegin',html);
        }).catch( () => { console.log('Error waiting for checkForResortAds:');});
      }
      
      if (iterResortAd.position === 'random') {
        const sel = randomAdPositions[adPosition];
        _log(`checkForResortAds: Random sel:`);
        console.log('sel:',sel);
        waitForElement(sel).then((elResortName) => {
          elResortName.insertAdjacentHTML('afterbegin',html);
        }).catch( () => { console.log('Error waiting for checkForResortAds:');});
        adPosition++;
      }
      
      // Track banner display for analytics
      trackBanner(alt);
    });

  } else {
    // Fallback to general ads if no resort-specific ads found
    //checkForGeneralAd();
  }

  // Handle special Pepsi Resort of the Week for resort ID '1'
  if (resort_id === '1') {
    // Note: Pepsi ROTW logic has been moved to pepsi-resort-week.js
    // This ensures proper separation of concerns and maintainability
    if (typeof initPepsiROTW === 'function') {
      initPepsiROTW();
    } else {
      console.warn('Pepsi ROTW module not loaded. Please include pepsi-resort-week.js');
    }
  }
  
  
});
