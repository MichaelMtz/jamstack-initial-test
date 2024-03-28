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
    waitForElement('#trailsChart-10').then(() => {
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

const createResortGeoSDL = () => {
  const resort_id = document.body.dataset.snowreport;
  const url = (window.location.hostname !== 'localhost') ? `https://feeds.snocountry.net/proof-of-concept/resort-geo.php?target=${resort_id}` : `http://localhost/sno/snoCountryHeadless/snow-reports/resort-geo.php?target=${resort_id}`;
  // _log(`snowreport-api resort: ${url}`);
  fetch(url).then(response => {
    return response.json();
  }).then(geoData => { 
    const data = geoData[0];
    console.log('*** sdl:',data);
    const sdl = `
    <script type="application/ld+json">
    {"@context":"https://schema.org",
    "@type":"SkiResort","name":"${data.resortName}",
    "address":{"@type":"PostalAddress",
    "addressCountry":"${data.countryProper}",
    "addressRegion":"${data.PhysState}",
    "addressLocality":"${data.state}",
    "streetAddress":"${data.PhysStreet},${data.PhysCity}, ${data.PhysState} ${data.PhysZip}"},
    "url":"${window.location.href}",
    "image":"https://www.snow-country.com/trail_maps/large_trail_maps/${data.id}.jpg",
    "email":"mailto:${data.email}",
    "telephone":"${data.mainPhone}",
    "geo":{"@type":"GeoCoordinates","latitude":"${data.latitude}","longitude":"${data.longitude}"}}
    </script>
    `;
    document.querySelector('head').insertAdjacentHTML('beforeend',sdl);
  }).catch( () => { console.log('Error waiting for EL:');});
  
};

document.addEventListener('DOMContentLoaded',()=> {
  getSnowReport();
  fixPageNavLinks();
  createCharts();
  createResortGeoSDL();
});
