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

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const checkForAd = (target) => {
  
  const targetList = [
    "connecticut", "maine",  "massachusetts", "new-hampshire", "rhode-island","vermont", 
    "wyoming", "colorado", 
    "idaho", "montana", "oregon", 
  ];
  
  if (targetList.includes(target)) {
    
    const currentResortAds = {
      connecticut : {
        ads: [{
          img: '2024-08-01-Ski-Sundown-728x90.jpg',
          href:"https://www.skisundown.com/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
        }]
      },maine : {
        ads: [{
          img: '2024-08-01-Ski-Sundown-728x90.jpg',
          href:"https://www.skisundown.com/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
        }]
      },massachusetts : {
        ads: [{
          img: '2024-08-01-Ski-Sundown-728x90.jpg',
          href:"https://www.skisundown.com/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
        }]
      },"new-hampshire" : {
        ads: [{
          img: '2024-08-01-Ski-Sundown-728x90.jpg',
          href:"https://www.skisundown.com/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
        }]
      },"rhode-island" : {
        ads: [{
          img: '2024-08-01-Ski-Sundown-728x90.jpg',
          href:"https://www.skisundown.com/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
        }]
      },vermont : {
        ads: [{
          img: 'Stratton_11-26-21.jpg',
          href:"https://www.stratton.com/plan-your-trip/deals-and-packages?utm_source=SnoCountry&utm_medium=link&utm_campaign=winter",
          width:728, 
          height:90,
          alt: 'Stratton Mountain VT', 
          position: 'both'
        }]
      },idaho : {
        ads: [{
          img: '2024-07-03-schweitzer-summer-728x90.jpg',
          href:"https://bit.ly/3VTawv1",
          width:728, 
          height:90,
          alt: 'Schweitzer ID',
        }]
      },wyoming : {
        ads: [{ 
          img: '2024-10-1-Jackson-Hole-728x90.jpg',
          href:"https://www.jacksonhole.com/300-off?utm_source=snocountry&utm_medium=display&utm_campaign=air-credit",
          width:728, 
          height:90,
          alt: 'Jackson Hole 400 off air credit',
          position:'random',
          start_date: '2024-10-01',
          end_date: '2024-11-30'
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
      }, colorado: {
        ads:[{
          img: '2024-07-04-copper-snocountry-728x90.jpg',
          href:"https://www.coppercolorado.com/plan-your-trip/season-passes/copper-season-pass-2024-25",
          width:728, 
          height:90,
          alt: 'Copper Mountain CO', 
          position: 'both',
          start_date: '2024-07-02',
          end_date: '2024-09-01'
        },{
          img: '2024-02-18-WolfCreek-300x50.png',
          href:"https://wolfcreekski.com/events-and-deals/",
          width:300, 
          height:50,
          alt: 'Wolf Creek CO', 
          position: 'both',
          start_date: '2024-02-20',
          end_date: '2024-04-27'
        }
          
        ]
      }
      
    };
    
    if (currentResortAds[target]) {
      const resortAds = currentResortAds[target].ads;
      if(resortAds.length > 1) {
        const randomIndex = random(0,resortAds.length);
        resortAds.splice(randomIndex,1);
      }
      const html = `
  
      <div class="internal">
        <a href="${resortAds[0].href}" target="_blank" >
          <img src="assets/images/resort-ads/${resortAds[0].img}" alt="${resortAds[0].alt}" width="${resortAds[0].width}" height="${resortAds[0].height}"">
        </a>
      </div>
      `;
      waitForElement('#container-snow-reports').then((elSnowReportContainer) => {
        elSnowReportContainer.insertAdjacentHTML('beforebegin',html);
      }).catch( (e) => { console.log('Error waiting for Snow Report Container:',e);});
    }
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
