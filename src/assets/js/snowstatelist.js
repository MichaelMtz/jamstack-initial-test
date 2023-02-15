// Logic to pull in snow report from SnoCountry Feed API
const t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e;};
const _log = function (text, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`);};
_log('Initialized...');

const observeSelector = (selector, callback, options = {
  timeout: null,
  once: false,
  onTimeout: null,
  document: window.document
}) => {
  let processed = new Map();

  if (options.timeout || options.onTimeout) {
    console.log('------------------------------------------------------------------------------------------------------------------------------');
    console.log('WARNING: observeSelector options timeout and onTimeout are not yet implemented.');
    console.log('------------------------------------------------------------------------------------------------------------------------------');
  }

  let obs, isDone = false;
  const done = () => {
    if (!obs) console.warn('observeSelector failed to run done()');
    if (obs) obs.disconnect();
    processed = undefined;
    obs = undefined;
    return isDone = true;
  };

  const processElement = el => {
    if (processed && !processed.has(el)) {
      processed.set(el, true);
      callback(el);
      if (options.once) {
        done();
        return true;
      }
    }
  };

  const lookForSelector = (el = document) => {
    if (el.matches && el.matches(selector)) {
      if (processElement(el)) return true;
    }
    if (el.querySelectorAll) {
      const elements = el.querySelectorAll(selector);
      if (elements.length) {
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (processElement(el)) return true;
        }
      }
    }
  };
  lookForSelector();

  //We might finish before the mutation observer is necessary:
  if (!isDone) {
    obs = new MutationObserver(mutationsList => {
      mutationsList.forEach(record => {
        if (record && record.addedNodes && record.addedNodes.length) {
          for (let i = 0; i < record.addedNodes.length; i++) {
            //Need to check from the parent element since sibling selectors can be thrown off if elements show up in non-sequential order
            const el = record.addedNodes[i].parentElement;
            // if (!el) console.warn('observeSelector element has no parent', record.addedNodes[i], record);
            //Note: This appears to also run when elements are removed from the DOM. If the element doesn't have a parent then we don't need to check it.
            if (el && lookForSelector(el)) return true;
          }
        }
      });
    });
    obs.observe(options.document || document, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }

  return () => {
    done();
  };
}; //_observeSelector


const waitForElement = selector=>{
  return new Promise(resolve=>{
    observeSelector(selector, resolve, { once: true });
  });
};


const initializeFilters = () => {
  let elCurrentActive;
  waitForElement(`.filter-container #filter-all`).then(elFilterAll => {
    elCurrentActive = elFilterAll;
    document.querySelectorAll('.filter-container button[id^="filter-"]').forEach(iterElBtn => {
      iterElBtn.addEventListener('click',() => {
        _log('Filter btn clicked');
        // Clear existing active button, reset to new one
        elCurrentActive.className = "";
        iterElBtn.classList.add('active');
        elCurrentActive = iterElBtn;
        const elSnowReportsContainer = document.querySelector('#container-snow-reports');
        if (elSnowReportsContainer) {
          elSnowReportsContainer.className = "";
          elSnowReportsContainer.classList.add(iterElBtn.dataset.id);          
        }
      });    
    });
    

  }).catch( () => { console.log('Error waiting for EL:');});
};

const checkForAd = (target) => {
  const targetList = [
    "maine", "massachusetts", "new-hampshire", "rhode-island","vermont", "quebec"
  ];
  
  if (targetList.includes(target)) {
    
    const html = `
    <div class="internal">
      <a href="https://westernwhitemtns.com/plan-your-next-snow-day/?utm_source=TMM+SnoC+Display&utm_medium=CPM+Display+Wint23&utm_campaign=SnoC+Wint23+Display" target="_blank" >
        <img class="internal-desktop" src="assets/images/ads/WWMCC/WWMCC-Winter22-23_728X90.gif" alt="Western White Mountains" width="728" height="90"">
        <img class="internal-mobile" src="assets/images/ads/WWMCC/WWMCC-Winter22-23_320X50.gif" alt="Western White Mountains" width="320" height="50"">
      </a>
    </div>
    `;
    waitForElement('#container-snow-reports').then((elSnowReportContainer) => {
      elSnowReportContainer.insertAdjacentHTML('beforebegin',html);
    }).catch( (e) => { console.log('Error waiting for Snow Report Container:',e);});
  }
};
document.addEventListener('DOMContentLoaded',()=> {
  const target = document.body.dataset.snowreport;
  const src = document.body.dataset.source;
  const requestType = document.body.dataset.resorttype;
  const endpoint = (src !== 'resort') ? 'list' : 'resort';  
  // fetch(url,{"headers": {"sec-fetch-mode": "cors","Access-Control-Allow-Origin":"*"}, "mode":"cors"}).then(response => {
  
  //const url = `.netlify/functions/snowreport-api?target=${target}&src=${src}` ;
  const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/snowreport-api?target=${target}&src=${src}&type=${requestType}` : `http://localhost/sno/snoCountryHeadless/snow-reports/headless-snow-report-${endpoint}.php?target=${target}&src=${src}&type=${requestType}`;
  _log(`snowreport-api: ${url}`);
  fetch(url).then(response => {
    return response.json();
  }).then(data => {

    document.querySelector('#container-snow-reports').innerHTML = data.snowreport;
    //process progressbars
    (function() {
      const progressBarList = document.querySelectorAll('.progress-bar');
      if (progressBarList) {
        progressBarList.forEach(iterBar => {
          iterBar.style.width = iterBar.dataset.percentage;
          //console.log(`pb:`,iterBar.dataset.percentage); 
        });
      }
    })();
    initializeFilters();
  }).catch( () => { console.log('Error waiting for EL:');});

  checkForAd(target);

});
