
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


const insertSEOItemListOfResorts = () => {
  waitForElement('.statelist-rendered').then(() => {
    
    let resortList = '';
    let delim = '';
    document.querySelectorAll('a.resort__link h2').forEach((iterEl) => {
      resortList += `${delim} "${iterEl.innerText}"\n`;
      delim = ',';
    });
    let state = document.body.dataset.snowreport.replaceAll('-',' ');
    state = state.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    const seoItemList = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
          ${resortList}
        ],
        "itemListOrder": "https://schema.org/ItemListUnordered",
        "name": "Ski Resorts in ${state}"
      }
      </script>
    `;
    document.querySelector('head').insertAdjacentHTML('beforeend',seoItemList);
  }).catch( (e) => { console.error('Error waiting for resort list to create SEO state list of resorts:',e);});
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
    insertSEOItemListOfResorts();

  }).catch( () => { console.log('Error waiting for EL:');});

  //checkForAd(target);
});
