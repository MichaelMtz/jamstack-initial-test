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


const fixPageNavLinks = () => {
  waitForElement('.container-state-links').then((elStateLinks) => {
    const navItems = elStateLinks.parentElement.querySelectorAll('.nav-item-link');
    navItems.forEach(elNavItem => {
      elNavItem.href = window.location.href.split('#')[0] + elNavItem.dataset.section;
    });
  }).catch((e) => { 
    console.error('Error waiting for local page links:',e);
  });

};
window.snoCharts = new Array();
const createSectionChart = (section,chart,yAxisUnit) => {
  _log(`createSectionChart: ${section}`);
  // const sectionCharts = new Array();
  const chartDataSets = chart.data;
  const titles = chart.titles;
  const chartColors = chart.chartColors;  
  //console.log(`createSectionChart:len:${chartDataSets.length}`,chartDataSets);
  for(let ind=0; ind<chartDataSets.length; ind++) {
    const chartSeasonData = chartDataSets[ind];
    const iterChartColor = chartColors[ind];
    const chartConfig = {
      type: 'line',
      data: {
        datasets: [{
          borderColor: iterChartColor.borderColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          data: chartSeasonData,
          fill: 'start',
          backgroundColor: iterChartColor.backgroundColor
        }]
      },
      options: {
        pointDot: false,
        responsive: true,
        title : {
          display:true,
          text:titles[ind]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats : {
                month: 'MMM',
              },
              unit: 'month',
            },
            ticks: {
              autoSkip: true,
              fontColor: '#226494'
            },
            gridLines: {
              display: false
            }
            ,display: true
          }],
          yAxes: [{
            display: true,
            gridLines: {
              color: '#B2DBE8',
              zeroLineColor: '#B2DBE8',
              drawBorder: false
            },
            ticks: {
              fontColor: '#226494',
              min: 0,
              max: chart.seasonMax,
              beginAtZero: true
            }
            ,scaleLabel : {
              display:true
              ,labelString: yAxisUnit
              ,fontColor: '#226494'
            }
          }]
        }
      }
    };
    const ctx = document.getElementById(`${section}-${ind}`);
    new Chart(ctx, chartConfig);
    // const iterChart = new Chart(ctx, chartConfig);
    // sectionCharts.push(iterChart);
  }
  // window.snoCharts.push(sectionCharts);
};

const createCharts = () => {
  const resort_id = document.body.dataset.snowreport;
  const localURL = `http://localhost/sno/snoFeeds/archiveChartSaved.php?resort_id=${resort_id}`;

  const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/snowreport-archive-api?resort_id=${resort_id}` : localURL;
  fetch(url).then(response => {
    return response.json();
  }).then(data => {
  
    console.log('--archiveData:',data);
    waitForElement('#trailsChart-9').then(() => {
      createSectionChart('baseDepthChart',data.BaseDepth, 'inches');
      createSectionChart('trailsChart',data.Trails, '# Open Trails');
    }).catch( (e) => { console.error('Error waiting for archive:',e);});
    //initializeFilters();
  }).catch( (e) => { console.error('Error waiting for createCharts fetch:',e);});
};
const getSnowReport = () => {
  const target = document.body.dataset.snowreport;
  const src = document.body.dataset.source;
  const endpoint = (src !== 'resort') ? 'list' : 'resort';  
  const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/snowreport-api?target=${target}&src=${src}` : `http://localhost/sno/snoCountryHeadless/snow-reports/headless-snow-report-${endpoint}.php?target=${target}&src=${src}`;
  // _log(`snowreport-api resort: ${url}`);
  fetch(url).then(response => {
    return response.json();
  }).then(data => { 
    document.querySelector('#container-snow-reports').innerHTML = data.snowreport;
  }).catch( () => { console.log('Error waiting for EL:');});
};

const checkForResortAds = () => {
  _log('checkForResortAds');
  const resort_id = document.body.dataset.snowreport;
  const currentResortAds = {
    719003 : {
      img: '719003.jpg',
      href:"https://www.skicooper.com/cooper-day-pass/",
      width:728, 
      height:90,
      alt: 'Ski Cooper'
    }, 603005 : {
      img: '603005.gif',
      href:"https://www.brettonwoods.com/?utm_source=snocountry&utm_medium=banner&utm_campaign=prospecting-brettonwoods-leisure-2021_2022",
      width:728, 
      height:90,
      alt: 'Bretton Woods'
    }, 616006 : {
      img: '616006.jpg',
      href:"https://shopcrystal.crystalmountain.com/categories/lift-tickets",
      width:728, 
      height:90,
      alt: 'Crystal Mountain'
    }, 603009 : {
      img: '603009.jpg',
      href:"https://www.gunstock.com/?utm_source=snocountry&utm_medium=display&utm_campaign=winter_general",
      width:728, 
      height:90,
      alt: 'Gunstock'
    },715002:{
      img: '715002.jpg',
      href:"https://order.skigranitepeak.com/v2/lodging-offers?utm_source=snocountry&utm_medium=banner&utm_campaign=display&utm_content=728x90",
      width:728, 
      height:90,
      alt: 'Granite'
    },607001:{
      img: '607001.png',
      href:"http://hopelakelodge.com/finger-lakes-vacation-packages",
      width:728, 
      height:90,
      alt: 'Greek Peak'
    },716003:{
      img: '716003.jpg',
      href:"https://www.holidayvalley.com/lodging/inn-holiday-valley/",
      width:728, 
      height:90,
      alt: 'Holiday Valley'
    },307008:{
      img: '307008.jpg',
      href:"https://www.jacksonhole.com/winter?utm_source=snocountry&utm_medium=display&utm_campaign=winter",
      width:728, 
      height:90,
      alt: 'Jackson Hole'
    },802009:{
      img: 'Magic-Mountain-11-23-21.jpg',
      href:"http://www.magicmtn.com",
      width:728, 
      height:90,
      alt: 'Magic Mountain'
    },703003:{
      img: 'Massanutten_Resort_11-15-21.jpg',
      href:"https://www.massresort.com/play/snow-sports/50th-celebration/?utm_source=SnoCountry&utm_medium=Banner&utm_campaign=SnoCountry+Ads&utm_id=SnoCountry+Ads",
      width:728, 
      height:90,
      alt: 'Massanutten Deals'
    },603015:{
      img: 'McIntyre_SnoCountry2022-23_728x90.jpg',
      href:"https://www.mcintyreskiarea.com/mountain-report/",
      width:728, 
      height:90,
      alt: 'McIntyre Ski Area'
    },914004:{
      img: 'MtPeter-2022-728x90-Ad.jpg',
      href:"https://www.mtpeter.com/sc/",
      width:728, 
      height:90,
      alt: 'Mt. Peter NY'
    },518007:{
      img: 'Oak_Mountain_11-12-21.gif',
      href:"https://www.oakmountainski.com/",
      width:728, 
      height:90,
      alt: 'Oak Mountain NY'
    },203004:{
      img: 'Powder_Ridge_12-6-21.jpg',
      href:"https://powderridgepark.com/",
      width:728, 
      height:90,
      alt: 'Powder Ridge CT'
    },207006:{
      img: 'Saddleback-Favorite-Mtn_728x90.jpg',
      href:"https://www.saddlebackmaine.com/shop/lift-tickets/",
      width:728, 
      height:90,
      alt: 'Saddleback ME'
    },208008:{
      img: 'Schweitzer-LodgingAd-728x90-11-5-21.jpg',
      href:"https://www.schweitzer.com/",
      width:728, 
      height:90,
      alt: 'Schweitzer ID'
    },717016:{
      img: 'Big-Bear-12-15-21.png',
      href:"https://www.ski-bigbear.com/",
      width:728, 
      height:90,
      alt: 'Ski Big Bear PA'
    },203005:{
      img: 'Ski-Sundown-WMB-2022-728x90.jpg',
      href:"https://www.skisundown.com/",
      width:728, 
      height:90,
      alt: 'Ski Sundown CT'
    },304001:{
      img: 'Snowshoe-12-8-20.jpg',
      href:"https://www.snowshoemtn.com/",
      width:728, 
      height:90,
      alt: 'Snowshoe WV'
    },802019:{
      img: 'Stratton_11-26-21.jpg',
      href:"https://www.stratton.com/plan-your-trip/deals-and-packages?utm_source=SnoCountry&utm_medium=link&utm_campaign=winter",
      width:728, 
      height:90,
      alt: 'Stratton Mountain VT'
    },802023:{
      img: 'Sugarbush-3-11-22.jpg',
      href:"https://www.sugarbush.com/plan-your-trip/season-passes",
      width:728, 
      height:90,
      alt: 'Sugarbush VT'
    },607005:{
      img: 'Swain-11-23-21.png',
      href:"https://swain.com/",
      width:728, 
      height:90,
      alt: 'Swain NY'
    },703002:{
      img: 'Omni_Homestead_12-4-21.jpg',
      href:"https://www.omnihotels.com/hotels/homestead-virginia/specials/ski-package?utm_source=snocountry&utm_medium=banner&utm_campaign=awareness-homrst-leisure-ski",
      width:728, 
      height:90,
      alt: 'Omni Homestead VA'
    },603001:{
      img: 'Waterville-Valley-11-23-21.jpg',
      href:"https://www.waterville.com/kids-ski-free",
      width:728, 
      height:90,
      alt: 'Waterville Valley NH'
    },603026:{
      img: 'Whaleback_Mountain_728_x_90_px.jpg',
      href:"https://www.whaleback.com/",
      width:728, 
      height:90,
      alt: 'Whaleback NH'
    },518009:{
      img: 'Windham_Mountain_12-1-21.jpg',
      href:"https://www.windhammountain.com?utm_source=snocountry&utm_medium=display&utm_campaign=winter_2&utm_id=snocountry",
      width:728, 
      height:90,
      alt: 'Windham NY'
    }


  };
  if (currentResortAds[resort_id]) {
    _log('checkForResortAds: applying ad');
    const resortAd = currentResortAds[resort_id];
    const html = `
    <div class="resort-ad">
      <a href="${resortAd.href}">
        <img src="assets/images/resort-ads/${resortAd.img}" alt="${resortAd.alt}" width="${resortAd.width}" height="${resortAd.height}"">
      </a>
    </div>
    `;
    waitForElement('#resort-name').then((elResortName) => {
      elResortName.insertAdjacentHTML('beforebegin',html);
    }).catch( () => { console.log('Error waiting for checkForResortAds:');});
    waitForElement('.footer-resort-ad .resort__container').then((elResortName) => {
      elResortName.insertAdjacentHTML('afterbegin',html);
    }).catch( () => { console.log('Error waiting for checkForResortAds:');});
  }
};

document.addEventListener('DOMContentLoaded',()=> {
  getSnowReport();
  fixPageNavLinks();
  checkForResortAds();
  createCharts();
});
