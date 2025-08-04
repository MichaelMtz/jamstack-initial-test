const API_BASE_URL = 'https://affable-hummingbird-827.convex.site';

async function fetchResortAds() {
  try {
    const params = new URLSearchParams();
    
    if (document.body.dataset.source === 'resort') {
      params.append('resortId', document.body.dataset.snowreport);
    } else {
      params.append('region', document.body.dataset.snowreport);
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

function selectRandomAd(ads) {
  if (!ads || ads.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
}

function createAdHTML(ad) {
  const width = 728;
  const height = 90;
  
  return `
<div class="resort-ad">
  <a href="${ad.linkUrl}" target="_blank" data-umami-event="banner-resort-click-${ad.name}">
    <img class="img-resort-ad" src="${ad.imageUrl}" alt="${ad.name}" width="${width}" height="${height}" data-umami-event="banner-resort-click-${ad.name}">
  </a>
</div>
`;
}

function trackAdImpression(ad) {
  if (ad.trackingPixelUrl) {
    const img = new Image();
    img.src = ad.trackingPixelUrl.replace('[timestamp]', Date.now());
    return img;
  }
  return;
}

/**
 * Loads a list of ads for the current resort or region, selects a random ad
 * from the list, and inserts it into the page before the resort name element.
 * If the selected ad has a tracking pixel URL, it is also used to track an
 * ad impression.
 */
async function loadAndDisplayAd() {
  const ads = await fetchResortAds();
  const selectedAd = selectRandomAd(ads);
  
  if (selectedAd) {
    _log('loadAndDisplayAd::selectedAd:',selectedAd);
    waitForElement('#resort-name').then((elResortName) => {
        _log('loadAndDisplayAd::elResortName:found ad placement',elResortName);
        elResortName.insertAdjacentHTML('beforebegin', createAdHTML(selectedAd));
        const img = trackAdImpression(selectedAd);
        if (img) {
          elResortName.appendChild(img);
        }
      }).catch( () => { console.log('Error waiting for checkForResortAds:');});
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndDisplayAd);
} else {
  loadAndDisplayAd();
}