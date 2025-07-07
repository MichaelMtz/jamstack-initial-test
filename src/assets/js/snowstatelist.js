// Logic to pull in snow report from SnoCountry Feed API
const t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e;};
const _log = function (text, param, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`, param);};


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

const checkAdDates = (iterResortAd) => {
  let showAd = true;
  if ((iterResortAd.start_date) && (iterResortAd.end_date)) {
    const now = new Date();
    const startDate = new Date(iterResortAd.start_date);
    const endDate = new Date(iterResortAd.end_date);
    _log(`checkForResortAds: st:${startDate} > now:${now} < end:${endDate}`);
    if ((now < startDate) || (now > endDate)) {
      showAd = false;
    }
  }
  _log(`checkForResortAds-showAd: ${showAd}`);
  return showAd;
};

const trackBanner = (bannerName) => {
  const today = new Date();
  const currentMonth = today.toLocaleDateString('default', { month:'short'});
  if (window.umami) {
    window.umami.track(`banner-${currentMonth}-${document.body.dataset.snowreport}-display-${bannerName}`);
    _log(`banner-${currentMonth}-${document.body.dataset.snowreport}-display-${bannerName}`);
  } else {    
    setTimeout(()=> {
      trackBanner(bannerName);
    },3000);
  }
};

const selectCurrentAd = (resortAdList) => {
  _log('selectCurrentAd::resortAdList:',resortAdList);
  // 1st check how many are valid after date check
  const validResortAds = [];
  resortAdList.forEach((iterResortAd) => {
    if (checkAdDates(iterResortAd)) {
      validResortAds.push(iterResortAd);
    }
  });
  _log(`selectCurrentAd::validResortAds:`, validResortAds);

  let returnValidAds = [];
  // if (validResortAds.length > 2) {
  //   for (let ind=0; ind < 2; ind++) {
  //     returnValidAds.push(validResortAds.splice(random(0,validResortAds.length),1));
  //   }
  // } else {
  //   returnValidAds = validResortAds;
  // }
  returnValidAds = validResortAds;
  _log('selectCurrentAd::returnValidAds:',returnValidAds);
  return returnValidAds;
};

const checkForAd = (target) => {
  _log(`checkForAd:target: ${target}`);
  const targetList = [
    "connecticut", "maine",  "massachusetts", "new-hampshire", "rhode-island","vermont", 
    "wyoming", "colorado", "california","utah",
    "idaho", "montana", "oregon", "new-york","michigan", "minnesota",
    "alabama", "maryland", "north-carolina", "tennessee", "virginia", "west-virginia",
    "north-east","south-east", "rockies", "mid-west", "north-west"
  ];
  
  if (targetList.includes(target)) {
    
    const currentResortAds = {
      connecticut : {
        ads: [{
          img: '2025-02-13-Sundown-Night-Skiing-728x90.png',
          href:"https://skisundown.com/the-mountain/night-skiing/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
          position: 'both',
          start_date: '2025-02-01',
          end_date: '2025-03-31'
        },{
          img: '2025-02-13-Sundown-Clase-To-Home-728x90.png',
          href:"https://skisundown.com/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
          position: 'both',
          start_date: '2025-02-01',
          end_date: '2025-03-31'
        }]
      },maine : {
        ads: [{
          img: '2025-02-15-Camden.jpg',
          href:"https://camdensnowbowl.com/",
          width:728, 
          height:90,
          alt: 'Camden Snowbowl ME',
          position:'both',
          start_date: '2025-02-14',
          end_date: '2025-03-31'
        }
        //   {
        //   img: '2025-02-13-Sundown-Night-Skiing-728x90.png',
        //   href:"https://skisundown.com/the-mountain/night-skiing/",
        //   width:728, 
        //   height:90,
        //   alt: 'Ski Sundown CT', 
        //   position: 'both',
        //   start_date: '2025-02-01',
        //   end_date: '2025-03-31'
        // },{
        //   img: '2025-02-13-Sundown-Clase-To-Home-728x90.png',
        //   href:"https://skisundown.com/",
        //   width:728, 
        //   height:90,
        //   alt: 'Ski Sundown CT', 
        //   position: 'both',
        //   start_date: '2025-02-01',
        //   end_date: '2025-03-31'
        // },{
        //   img: '2025-01-04-BigRock-728x90.png',
        //   href:"https://www.groupon.com/deals/gl-big-rock-mountain",
        //   width:728, 
        //   height:90,
        //   alt: 'Big Rock ME',
        //   position:'both',
        // },{
        //   img: '2024-12-05-BlackMountain.png',
        //   href:"https://skiblackmountain.org/tickets-passes",
        //   width:728, 
        //   height:90,
        //   alt: 'Black Mountain ME',
        //   position:'both'
        // },{ 
        //   img: '2024-10-1-Jackson-Hole-728x90.jpg',
        //   href:"https://www.jacksonhole.com/300-off?utm_source=snocountry&utm_medium=display&utm_campaign=air-credit",
        //   width:728, 
        //   height:90,
        //   alt: 'Jackson Hole 400 off air credit',
        //   position:'random',
        //   start_date: '2024-10-01',
        //   end_date: '2024-11-30'
        // },{
        //   img: '2024-08-06-Jackson-Hole-GT-728x90.jpg',
        //   href:"https://www.jacksonhole.com/golden-ticket?utm_source=snocountry&utm_medium=display&utm_campaign=golden-ticket",
        //   width:728, 
        //   height:90,
        //   alt: 'Jackson Hole Golden Ticket',
        //   position:'random',
        //   start_date: '2024-08-20',
        //   end_date: '2025-04-13'
        // }
        ]
      },california: {
        ads: [{
          img: '2025-03-11-Cali-Pass.png',
          href:"https://www.thecalipass.com/buynow",
          width:728, 
          height:90,
          alt: 'Bear Valley Mountain Resort CA', 
          position: 'both',
          start_date: '2025-03-11',
          end_date: '2025-03-31'
        }]
      }, 
      // massachusetts : {
      //   ads: [{
      //     img: 'Stratton_11-26-21.jpg',
      //     href:"https://www.stratton.com/plan-your-trip/deals-and-packages?utm_source=SnoCountry&utm_medium=link&utm_campaign=winter",
      //     width:728, 
      //     height:90,
      //     alt: 'Stratton Mountain VT', 
      //     position: 'both'
      //   }]
      // }, 
      michigan: {
        ads: [{
          img: '2025-02-07-Snow-River.jpg',
          href:"https://www.saddlebackmaine.com/?utm_source=SnoCountry&utm_medium=Display&utm_campaign=SkierVisits25",
          width:728, 
          height:90,
          alt: 'SnowRiver MI',
          position: 'both',
          start_date: '2025-02-06',
          end_date: '2025-04-06'
        },{
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
      },"new-hampshire" : {
        ads: [{
          img: '2024-12-11-Bretton-Woods.jpg',
          href:"https://www.brettonwoods.com",
          width:728, 
          height:90,
          alt: 'Bretton Woods, NH',
          position: 'both',
          start_date: '2025-02-01',
          end_date: '2025-03-31'
        },{
          img: '2025-03-01-Gunstock.png',
          href:"https://www.gunstock.com/",
          width:728, 
          height:90,
          alt: 'Gunstock NH',
          position: 'random',
          start_date: '2025-02-01',
          end_date: '2025-03-31'
        }]
      },"rhode-island" : {
        ads: [{
          img: '2025-02-13-Sundown-Night-Skiing-728x90.png',
          href:"https://skisundown.com/the-mountain/night-skiing/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
          position: 'both',
          start_date: '2025-02-01',
          end_date: '2025-03-31'
        },{
          img: '2025-02-13-Sundown-Clase-To-Home-728x90.png',
          href:"https://skisundown.com/",
          width:728, 
          height:90,
          alt: 'Ski Sundown CT', 
          position: 'both',
          start_date: '2025-02-01',
          end_date: '2025-03-31'
        }]
      },
      // vermont : {
      //   ads: [{
      //     img: 'Stratton_11-26-21.jpg',
      //     href:"https://www.stratton.com/plan-your-trip/deals-and-packages?utm_source=SnoCountry&utm_medium=link&utm_campaign=winter",
      //     width:728, 
      //     height:90,
      //     alt: 'Stratton Mountain VT', 
      //     position: 'both'
      //   }]
      // }, 
      utah : {
        ads: [{
          img: '2025-03-10-Powder-Mtn-Lines-Carve.png',
          href:"https://powdermountain.com/tickets/season-passes",
          width:728, 
          height:90,
          alt: 'Powder Mountain UT', 
          position: 'random',
          start_date: '2025-03-10',
          end_date: '2025-04-11',   
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
      },wyoming : {
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
      }, colorado: {
        ads:[
          {
            img: '2025-02-20-Monarch.jpg',
            href:"https://skimonarch.com/",
            width:600, 
            height:388,
            alt: 'Monarch Mountain CO', 
            position: 'both'
          },{
            img: '2025-02-20-Sunlight.png',
            href:"https://sunlightmtn.com",
            width:728, 
            height:90,
            alt: 'Sunlight Mtn CO', 
            position: 'random',
            start_date: '2024-12-11',
            end_date: '2025-03-31'
          }
        ]
      },idaho:{
        ads: [{        
          img: '2025-03-06-Soldier-Mtn.png',
          href:"https://soldiermountain.com/",
          width:728, 
          height:90,
          alt: 'Soldier Mountain ID',
          position:'both',
          comment: 'General ad',
          start_date: '2024-12-11',
          end_date: '2025-04-15'
        },{
          img: '2025-03-13-Lookout-Idaho.jpg',
          href:"https://skilookout.com/season-pass",
          width:728, 
          height:90,
          alt: 'Ski Lookout ID',
          position:'both',
          start_date: '2025-03-13',
          end_date: '2025-04-20'
        }]
      }, "new-york" : {
        ads: [{
          img: '2025-01-16-Greek-Peak.jpg',
          href:"https://www.greekpeak.net",
          width:728, 
          height:90,
          alt: 'Greek Peak NY',
          position: 'both',
          start_date: '2025-01-02',
          end_date: '2025-04-30',
        },{
          img: '2025-02-14-Greek-Peak.png',
          href:"https://www.greekpeak.net",
          width:728, 
          height:90,
          alt: 'Greek Peak NY',
          position: 'both',
          start_date: '2025-02-14',
          end_date: '2025-03-31',
        }]
      }, "south-east": {
        ads: [
        // {
        //   img: '2024-12-11-Ober.jpg',
        //   href:"https://obermountain.com/",
        //   width:728, 
        //   height:90,
        //   alt: 'Ober Mountain TN', 
        //   position: 'both',
        //   comment: 'general ad - can keep running'
        // }, {
        //   img: '2024-12-11-Sugar-Mountain.jpg',
        //   href:"https://www.skisugar.com",
        //   width:728, 
        //   height:90,
        //   alt: 'Sugar Mountain NC', 
        //   position: 'both',
        //   comment: 'general ad - can keep running'
        // },
        {
          img: '2025-02-14-Omni-Homestead.jpg',
          href:"https://www.omnihotels.com/hotels/homestead-virginia/specials/ski-package?utm_source=snocountry&utm_medium=banner&utm_campaign=awareness-homrst-leisure-ski",
          width:728, 
          height:90,
          alt: 'Omni Homestead VA', 
          position: 'both',
          start_date: '2025-02-14',
          end_date: '2025-05-01'
        }]
      }, "north-east": {
        ads: [{
          img: '2025-05-02-Sugarloaf.jpg',
          href: "https://www.sugarloaf.com/",
          height:90,
          alt: 'Sugarloaf ME',
          position:'both',
          start_date: '2025-01-22',
          end_date: '2025-05-01'
        },{
          img: '2025-01-22-Sugarbush.jpg',
          href:"https://www.sugarbush.com/things-to-do/challenge",
          width:728, 
          height:90,
          alt: 'Sugarbush VT', 
          position: 'both',
          start_date: '2025-01-22',
          end_date: '2025-05-01'
        }]
      }, 
      // alabama: {
      //   ads: [{
      //     img: '2024-12-11-Ober.jpg',
      //     href:"https://obermountain.com/",
      //     width:728, 
      //     height:90,
      //     alt: 'Ober Mountain TN', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }, {
      //     img: '2024-12-11-Sugar-Mountain.jpg',
      //     href:"https://www.skisugar.com",
      //     width:728, 
      //     height:90,
      //     alt: 'Sugar Mountain NC', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }]
      //}, 
      // maryland: {
      //   ads: [{
      //     img: '2024-12-11-Ober.jpg',
      //     href:"https://obermountain.com/",
      //     width:728, 
      //     height:90,
      //     alt: 'Ober Mountain TN', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }, {
      //     img: '2024-12-11-Sugar-Mountain.jpg',
      //     href:"https://www.skisugar.com",
      //     width:728, 
      //     height:90,
      //     alt: 'Sugar Mountain NC', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }]
      // }, "north-carolina": {
      //   ads: [{
      //     img: '2024-12-11-Ober.jpg',
      //     href:"https://obermountain.com/",
      //     width:728, 
      //     height:90,
      //     alt: 'Ober Mountain TN', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }, {
      //     img: '2024-12-11-Sugar-Mountain.jpg',
      //     href:"https://www.skisugar.com",
      //     width:728, 
      //     height:90,
      //     alt: 'Sugar Mountain NC', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }]
      // }, tennessee: {
      //   ads: [{
      //     img: '2024-12-11-Ober.jpg',
      //     href:"https://obermountain.com/",
      //     width:728, 
      //     height:90,
      //     alt: 'Ober Mountain TN', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }, {
      //     img: '2024-12-11-Sugar-Mountain.jpg',
      //     href:"https://www.skisugar.com",
      //     width:728, 
      //     height:90,
      //     alt: 'Sugar Mountain NC', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }]
      // }, 
      // oregon: {
      //   ads: [{
      //     img: '2025-02-22-Mount-Hood.jpg',
      //     href:"https://www.skihood.com/store/passes",
      //     width:728, 
      //     height:90,
      //     alt: 'Mount Hood Meadows OR',
      //     position: 'random',
      //     start_date: '2025-02-22',
      //     end_date: '2025-03-31'
      //   }]
      // }, virginia: {
      //   ads: [{
      //     img: '2025-02-14-Omni-Homestead.jpg',
      //     href:"https://www.omnihotels.com/hotels/homestead-virginia/specials/ski-package?utm_source=snocountry&utm_medium=banner&utm_campaign=awareness-homrst-leisure-ski",
      //     width:728, 
      //     height:90,
      //     alt: 'Omni Homestead VA', 
      //     position: 'both',
      //     start_date: '2025-02-14',
      //     end_date: '2025-03-01'
      //   }
      //     {
      //     img: '2024-12-11-Ober.jpg',
      //     href:"https://obermountain.com/",
      //     width:728, 
      //     height:90,
      //     alt: 'Ober Mountain TN', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }, {
      //     img: '2024-12-11-Sugar-Mountain.jpg',
      //     href:"https://www.skisugar.com",
      //     width:728, 
      //     height:90,
      //     alt: 'Sugar Mountain NC', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }]
      // }, 
      // "west-virginia": {
      //   ads: [{
      //     img: '2024-12-11-Ober.jpg',
      //     href:"https://obermountain.com/",
      //     width:728, 
      //     height:90,
      //     alt: 'Ober Mountain TN', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }, {
      //     img: '2024-12-11-Sugar-Mountain.jpg',
      //     href:"https://www.skisugar.com",
      //     width:728, 
      //     height:90,
      //     alt: 'Sugar Mountain NC', 
      //     position: 'both',
      //     comment: 'general ad - can keep running'
      //   }]
      // }, 
      "rockies": {
        ads:[
          {
            img: '2025-01-10-Cooper-728x90.jpg',
            href:"https://www.skicooper.com/cooper-day-pass/",
            width:728, 
            height:90,
            alt: 'Ski Cooper, CO',
            position:'both',
            start_date: '2025-01-10',
            end_date: '2025-01-31'
          },{
            img: '2024-10-17-WolfCreek.jpg',
            href:"https://wolfcreekski.com",
            width:728, 
            height:90,
            alt: 'Wolf Creek CO', 
            position: 'both',
            start_date: '2024-10-20',
            end_date: '2025-04-30'
          },{
            img: '2025-02-20-Sunlight.png',
            href:"https://sunlightmtn.com",
            width:728, 
            height:90,
            alt: 'Sunlight Mtn CO', 
            position: 'both',
            start_date: '2024-12-11',
            end_date: '2025-03-31'
            
          },{
            img: '2025-02-20-Monarch.jpg',
            href:"https://skimonarch.com/",
            width:600, 
            height:388,
            alt: 'Monarch Mountain CO', 
            position: 'both'
          },{
            img: '2025-02-20-Jackson-Hole.gif',
            href:"https://www.jacksonhole.com/300-off?utm_source=snocountry&utm_medium=display&utm_campaign=air-credit",
            width:728, 
            height:90,
            alt: 'Jackson Hole 400 off air credit',
            position:'random',
            start_date: '2025-02-20',
            end_date: '2025-03-31'       
          }
        ]
      }, "mid-west": {
        ads: [
          {
            img: '2025-06-24-Lutsen-728x90.jpg',
            href:"https://www.lutsen.com/?utm_source=snocountry&utm_medium=display&utm_campaign=banner&utm_id=summer",
            width:728, 
            height:90,
            alt: 'Lutsen Mountains MN', 
            position: 'both',
            comment: 'summer ad',
            start_date: '2025-07-01',
            end_date: '2025-10-01',
          } 
        ]
      }, "minnesota": {
        ads: [
          {
            img: '2025-06-24-Lutsen-728x90.jpg',
            href:"https://www.lutsen.com/?utm_source=snocountry&utm_medium=display&utm_campaign=banner&utm_id=summer",
            width:728, 
            height:90,
            alt: 'Lutsen Mountains MN', 
            position: 'both',
            comment: 'summer ad',
            start_date: '2025-07-01',
            end_date: '2025-10-01',
          } 
        ]
      }, "north-west": {
        ads: [
          {
            img: '2025-02-22-Mount-Hood.jpg',
            href:"https://www.skihood.com/store/passes",
            width:728, 
            height:90,
            alt: 'Mount Hood Meadows OR',
            position: 'both',
            start_date: '2025-02-22',
            end_date: '2025-02-29'
          }, {
            img: '2025-03-13-Lookout-Idaho.jpg',
            href:"https://skilookout.com/season-pass",
            width:728, 
            height:90,
            alt: 'Ski Lookout ID',
            position:'both',
            start_date: '2025-03-13',
            end_date: '2025-04-20'
          }
        ]
      }

    };
    
    if (currentResortAds[target]) {
      let resortAds = currentResortAds[target].ads;
      _log(`resortAds:`,resortAds);
      let randomIndex = 0;
      if(resortAds.length > 1) {
        resortAds = selectCurrentAd(resortAds);
        randomIndex = (resortAds.length > 1) ? random(0,resortAds.length) : 0;
      }
      _log(`resortAds:randomIndex: ${randomIndex}`);
      const targetResortAd = resortAds[randomIndex];
      if (checkAdDates(targetResortAd)) {    
        
        _log(`targetResortAd:selected:`,targetResortAd);
  
        const alt = targetResortAd.alt.replaceAll(' ', '-');
        const html = `
    
        <div class="internal">
          <a href="${targetResortAd.href}" target="_blank" data-umami-event="banner-${document.body.dataset.snowreport}-click-${alt}">
            <img class="adHighlight" src="assets/images/resort-ads/${targetResortAd.img}" alt="${targetResortAd.alt}" width="${targetResortAd.width}" height="${targetResortAd.height}" data-umami-event="banner-${document.body.dataset.snowreport}-click-${alt}">
          </a>
        </div>
        `;
        waitForElement('#container-snow-reports').then((elSnowReportContainer) => {
          elSnowReportContainer.insertAdjacentHTML('beforebegin',html);
          trackBanner(alt);
        }).catch( (e) => { console.log('Error waiting for Snow Report Container:',e);});
      } // checkAdDates
    }
  }
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

  checkForAd(target);
});
