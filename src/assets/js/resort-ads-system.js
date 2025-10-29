// Logic to pull in snow report from SnoCountry Feed API
let t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e;};
let _log = function (text, param, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`, param);};

let waitForElement = (selector) => {
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
 * Resort Ads System - Dynamic Advertisement Management
 * 
 * This module provides a modern, API-driven advertisement system that fetches
 * ads from a remote server, displays them dynamically, and tracks user interactions
 * for analytics purposes. It supports different page types (resort, state, region, home)
 * and provides comprehensive tracking for both impressions and clicks.
 * 
 * Key Features:
 * - Dynamic ad fetching from Convex API
 * - Page-type aware ad placement
 * - Random ad selection from available options
 * - Comprehensive analytics tracking (impressions and clicks)
 * - Google Analytics pixel tracking support
 * - Responsive ad sizing based on page type
 * 
 * Dependencies:
 * - snowreport.js (provides _log and waitForElement functions)
 * - Convex API backend for ad data and tracking
 * 
 * @fileoverview Dynamic resort advertisement management system
 * @author SnoCountry Development Team
 * @version 2.0.0
 */

/**
 * Base URL for the Convex API backend
 * @constant {string}
 */
const API_BASE_URL = 'https://affable-hummingbird-827.convex.site';

/**
 * Fetches advertisements from the Convex API based on current page context
 * 
 * Determines the appropriate API parameters based on the page type and fetches
 * relevant advertisements. The function reads page context from data attributes
 * and constructs appropriate API calls for different page types.
 * 
 * Page Types Supported:
 * - 'resort': Fetches ads specific to a resort ID
 * - 'state'/'region': Fetches ads for a geographic region
 * - 'home'/'news-home'/'news-page': Fetches general ads
 * 
 * @async
 * @function fetchResortAds
 * @returns {Promise<Object[]>} Array of advertisement objects from the API
 * 
 * @example
 * const ads = await fetchResortAds();
 * // Returns: [{ _id: '123', name: 'Ski Resort Ad', imageUrl: '...', linkUrl: '...' }]
 */
async function fetchResortAds() {
  try {
    const params = new URLSearchParams();
    
    _log('Ads-System:', document.body.dataset.source);
    switch (document.body.dataset.source) {
      case 'resort':
        params.append('resortId', document.body.dataset.snowreport);
      break;
      case 'state':
      case 'region': 
        params.append('region', document.body.dataset.snowreport);
      break;
      
      default: // home, news-home, news-page
        params.append('region', document.body.dataset.source);
      break;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/ads?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.ads || [];
  } catch (error) {
    console.error('Failed to fetch resort ads:', error);
    return [];
  }
}

/**
 * Selects a random advertisement from an array of available ads
 * 
 * Implements random selection algorithm to choose one advertisement
 * from the provided array. This ensures fair distribution of ad
 * impressions across all available advertisements.
 * 
 * @function selectRandomAd
 * @param {Object[]} ads - Array of advertisement objects
 * @param {string} ads[]._id - Unique identifier for the ad
 * @param {string} ads[].name - Display name of the ad
 * @param {string} ads[].imageUrl - URL of the ad image
 * @param {string} ads[].linkUrl - URL the ad links to
 * @param {string} [ads[].trackingPixelUrl] - Optional Google Analytics tracking pixel
 * @returns {Object|null} Randomly selected ad object or null if no ads available
 * 
 * @example
 * const ads = [{ _id: '1', name: 'Ad 1' }, { _id: '2', name: 'Ad 2' }];
 * const selectedAd = selectRandomAd(ads); // Returns one of the two ads randomly
 */
function selectRandomAd(ads) {
  if (!ads || ads.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
}

/**
 * Creates HTML markup for displaying an advertisement
 * 
 * Generates responsive HTML for an advertisement with appropriate sizing
 * based on the page type. News post pages get smaller ads (320x50) while
 * other pages get standard banner ads (728x90). Includes Umami analytics
 * tracking attributes for click events.
 * 
 * @function createAdHTML
 * @param {Object} ad - Advertisement object
 * @param {string} ad._id - Unique identifier for the ad
 * @param {string} ad.name - Display name of the ad (used for alt text and tracking)
 * @param {string} ad.imageUrl - URL of the ad image
 * @param {string} ad.linkUrl - URL the ad links to
 * @returns {string} HTML markup for the advertisement
 * 
 * @example
 * const ad = {
 *   _id: '123',
 *   name: 'Ski Resort Ad',
 *   imageUrl: 'https://example.com/ad.jpg',
 *   linkUrl: 'https://example.com/resort'
 * };
 * const html = createAdHTML(ad);
 * // Returns: '<div class="resort-ad">...</div>'
 */
function createAdHTML(ad) {
  const newsPostPage = window.location.pathname.includes('news-post');
  const width = (newsPostPage) ? 320 : 728;
  const height = (newsPostPage) ? 50 : 90;
  
  return `
<div class="resort-ad">
  <a id="resort-page-ad" href="${ad.linkUrl}" target="_blank" data-umami-event="banner-resort-click-${ad.name}">
    <img class="img-resort-ad w-[728px] h-[90px]  mx-auto  rounded-lg shadow-xl img-resort-ad" src="${ad.imageUrl}" alt="${ad.name}" width="${width}" height="${height}" data-umami-event="banner-resort-click-${ad.name}">
  </a>
</div>
`;
}

/**
 * Tracks advertisement impression events for analytics
 * 
 * Sends impression tracking data to both the SnoCountry ad dashboard and
 * optional Google Analytics tracking pixels. This function is called when
 * an ad is displayed to the user and provides comprehensive analytics data
 * including ad ID, page context, and user agent information.
 * 
 * @async
 * @function trackAdImpression
 * @param {Object} selectedAd - The advertisement object being displayed
 * @param {string} selectedAd._id - Unique identifier for the ad
 * @param {string} selectedAd.name - Display name of the ad
 * @param {string} [selectedAd.trackingPixelUrl] - Optional Google Analytics tracking pixel URL
 * @returns {Promise<void>}
 * 
 * @example
 * const ad = { _id: '123', name: 'Ski Resort Ad', trackingPixelUrl: 'https://google-analytics.com/collect?t=event&tid=UA-123456-1&cid=[timestamp]' };
 * await trackAdImpression(ad);
 */
async function trackAdImpression(selectedAd) {
  const {"_id" : adId, name } = selectedAd;

  //Track on Sno Ad dashboard
  try {
    const response = await fetch(`${API_BASE_URL}/api/track/ad-impression`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adId: adId,
        url: location.pathname,
        pageName: name + location.pathname.replaceAll('/','-'),
        userAgent: navigator.userAgent,
        // Note: ipAddress will be automatically detected server-side
      })
    });

    if (!response.ok) {
      console.error('Failed to track ad impression:', response.statusText);
    }
  } catch (error) {
    console.error('Error tracking ad impression:', error);
  }
  // setup Google tracking ad if provided
  if (selectedAd.trackingPixelUrl) {
    const img = new Image();
    img.src = selectedAd.trackingPixelUrl.replace('[timestamp]', Date.now());
    document.getElementById('resort-maps').appendChild(img)
  }
}

/**
 * Tracks advertisement click events for analytics
 * 
 * Sends click tracking data to the SnoCountry ad dashboard when a user
 * clicks on an advertisement. This provides valuable conversion data
 * for measuring ad effectiveness and ROI.
 * 
 * @async
 * @function trackAdClick
 * @param {Object} selectedAd - The advertisement object that was clicked
 * @param {string} selectedAd._id - Unique identifier for the ad
 * @param {string} selectedAd.name - Display name of the ad
 * @returns {Promise<void>}
 * 
 * @example
 * const ad = { _id: '123', name: 'Ski Resort Ad' };
 * await trackAdClick(ad);
 */
async function trackAdClick(selectedAd) {
  const {"_id" : adId, name } = selectedAd;
  _log('SnowAdDashboard:trackAdClick:ad clicked');
  try {
    const response = await fetch(`${API_BASE_URL}/api/track/ad-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adId: adId,
        url: location.pathname,
        userAgent: navigator.userAgent,
        // Note: ipAddress will be automatically detected server-side
      })
    });

    if (!response.ok) {
      console.error('Failed to track ad click:', response.statusText);
    }
  } catch (error) {
    console.error('Error tracking ad click:', error);
  }
}


/**
 * Main function that orchestrates the entire ad loading and display process
 * 
 * This is the primary function that coordinates all aspects of ad management:
 * 1. Fetches relevant ads based on page context
 * 2. Selects a random ad from available options
 * 3. Determines appropriate placement based on page type
 * 4. Inserts the ad into the DOM
 * 5. Sets up impression and click tracking
 * 6. Handles click events with proper tracking and navigation
 * 
 * Page Type Placement:
 * - 'resort': Places ad before #resort-name element
 * - 'state'/'region': Places ad before #container-snow-reports element
 * - 'home'/'news-home'/'news-page': Places ad before #news-ad element
 * 
 * @async
 * @function loadAndDisplayAd
 * @returns {Promise<void>}
 * 
 * @example
 * // Called automatically on DOM load or immediately if DOM is already loaded
 * await loadAndDisplayAd();
 */
async function loadAndDisplayAd() {

  const ads = await fetchResortAds();
  const selectedAd = selectRandomAd(ads);
  _log('SnoAdDashboard:result:',ads);
  if (selectedAd) {
    _log('loadAndDisplayAd::selectedAd:',selectedAd);
    let sel = '';
    switch (document.body.dataset.source) {
      case 'resort':
        sel = '#breadcrumb-navigation';
      break;
      case 'state':
      case 'region': 
        sel = '#container-snow-reports';
      break;
      
      default: // home, news-home, news-page
        sel = '#news-ad';
      break;
    }
    waitForElement(sel).then((elResortName) => {
        elResortName.insertAdjacentHTML('beforebegin', createAdHTML(selectedAd));
        trackAdImpression(selectedAd);

        waitForElement('#resort-page-ad').then((elResortAd) => {
          _log('SnowAdDashboard: Found ad set click event listerner');
          elResortAd.addEventListener('click', () => {
            _log('SnowAdDashboard:ad clicked1');
            trackAdClick(selectedAd);
            _log('SnowAdDashboard:ad clicked2');
            // Small delay to ensure tracking request is sent
            setTimeout(() => {
              window.open(selectedAd.linkUrl, '_blank');
            }, 100);
            
            // Prevent default link behavior if this is an <a> tag
            event.preventDefault();
          });
          
        }).catch( () => { console.error('Error: Found ad, ad placed, could not find anchor element to set click event for Sno dashboard:');});

      }).catch( () => { console.error('Error: Found ad, but did not find #resort-name to place ad on page.');});
  }
}

/**
 * Initialization code - ensures ad system runs when DOM is ready
 * 
 * This code checks the document's ready state and either:
 * - Waits for DOMContentLoaded event if the document is still loading
 * - Immediately executes loadAndDisplayAd() if the DOM is already loaded
 * 
 * This ensures the ad system works correctly regardless of when this script
 * is loaded in relation to the DOM parsing process.
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndDisplayAd);
} else {
  loadAndDisplayAd();
}