const API_BASE_URL = 'https://affable-hummingbird-827.convex.site';

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
    // if (document.body.dataset.source === 'resort') {
    //   params.append('resortId', document.body.dataset.snowreport);
    // } else {
    //   params.append('region', document.body.dataset.snowreport);
    // }
    
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
  const newsPostPage = window.location.pathname.includes('news-post');
  const width = (newsPostPage) ? 320 : 728;
  const height = (newsPostPage) ? 50 : 90;
  
  return `
<div class="resort-ad">
  <a id="resort-page-ad" href="${ad.linkUrl}" target="_blank" data-umami-event="banner-resort-click-${ad.name}">
    <img class="img-resort-ad" src="${ad.imageUrl}" alt="${ad.name}" width="${width}" height="${height}" data-umami-event="banner-resort-click-${ad.name}">
  </a>
</div>
`;
}

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
 * Loads a list of ads for the current resort or region, selects a random ad
 * from the list, and inserts it into the page before the resort name element.
 * If the selected ad has a tracking pixel URL, it is also used to track an
 * ad impression.
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
        sel = '#resort-name';
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndDisplayAd);
} else {
  loadAndDisplayAd();

}