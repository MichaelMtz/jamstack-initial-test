// Note: Do not need to declare _log, waitForElement, because it is included in snowreport.js.  But this needs included after snowreport.js.
_log('resort-page-ads Initialized...');

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

const trackBanner = (bannerName) => {
  if (window.umami) {
    window.umami.track(`banner-resort-display-${bannerName}`);
  } else {    
    setTimeout(()=> {
      trackBanner(bannerName);
    },1000);
  }
};

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomPositions = () => {
  const randomIndex = random(0,2);
  return (randomIndex == 0) ? ['#resort-name','.footer-resort-ad .resort__container'] : ['.footer-resort-ad .resort__container','#resort-name'];
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
  const returnValidAds = validResortAds;
  // if (validResortAds.length > 2) {
  //   for (let ind=0; ind < 2; ind++) {
  //     returnValidAds.push(validResortAds.splice(random(0,validResortAds.length),1));
  //   }
  // } else {
  //   returnValidAds = validResortAds;
  // }
  _log('selectCurrentAd::returnValidAds:',returnValidAds);
  return returnValidAds;
};

document.addEventListener('DOMContentLoaded',()=> {
  _log('checkForResortAds begin');

  const resort_id = document.body.dataset.snowreport;
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
        position: 'both'
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
        position: 'both'
      }]
    },607001:{
      ads: [{
        img: '2025-01-16-Greek-Peak.jpg',
        href:"https://www.greekpeak.net",
        width:728, 
        height:90,
        alt: 'Greek Peak NY',
        position: 'both',
        start_date: '2025-01-02',
        end_date: '2025-04-30',
        position: 'random'
      },{
        img: '2025-02-14-Greek-Peak.png',
        href:"https://www.greekpeak.net",
        width:728, 
        height:90,
        alt: 'Greek Peak NY',
        position: 'both',
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
        position: 'both'
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
        position:'both'
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
        position:'both'
      }]
    },603015:{
      ads: [{
        img: 'McIntyre_SnoCountry2022-23_728x90.jpg',
        href:"https://www.mcintyreskiarea.com/mountain-report/",
        width:728, 
        height:90,
        alt: 'McIntyre Ski Area',
        position:'both'
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
        position:'both'
      }]
    },207001:{
      ads: [{
        img: '2024-12-05-BlackMountain.png',
        href:"https://skiblackmountain.org/tickets-passes",
        width:728, 
        height:90,
        alt: 'Black Mountain ME',
        position:'both'
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
        position:'both'
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
        comment: 'General ad'
      }]
    },717016:{
      ads: [{
        img: 'Big-Bear-12-15-21.png',
        href:"https://www.ski-bigbear.com/",
        width:728, 
        height:90,
        alt: 'Ski Big Bear PA', 
        position: 'both'
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
        position: 'both'
      }]
    },802019:{
      ads: [{
        img: '2025-01-16-Stratton-Snow-Alert.jpg',
        href:"https://www.stratton.com/plan-your-trip/deals-and-packages?utm_source=banner&utm_medium=snowtime&utm_id=snocountry",
        width:728, 
        height:90,
        alt: 'Stratton Mountain VT', 
        position: 'both'
      }]
    },802023:{
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
        position: 'both'
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
        position: 'both'
      }]
    },603026:{
      ads: [{
        img: 'Whaleback_Mountain_728_x_90_px.jpg',
        href:"https://www.whaleback.com/",
        width:728, 
        height:90,
        alt: 'Whaleback NH', 
        position: 'both'
      }]
    },518009:{
      ads: [{
        img: 'Windham_Mountain_12-1-21.jpg',
        href:"https://www.windhammountain.com?utm_source=snocountry&utm_medium=display&utm_campaign=winter_2&utm_id=snocountry",
        width:728, 
        height:90,
        alt: 'Windham NY', 
        position: 'both'
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
        position: 'both'
      }]
    },717013:{
      ads: [{
        img: '2024-01-31-Whitetail-Banner-728x90.jpg',
        href:"https://www.skiwhitetail.com",
        width:728, 
        height:90,
        alt: 'Whitetail Resort PA', 
        position: 'both'
      }]
    },702001:{
      ads: [{
        img: '2024-11-19-Diamond-Peak.jpg',
        href:"https://www.diamondpeak.com/tickets-passes-rentals/lift-tickets/",
        width:728, 
        height:90,
        alt: 'Diamond Peak CA', 
        position: 'both'
      }]
    },
    702002:{
      ads: [{
        img: '2025-01-22-Lee-Canyon.png',
        href:"https://www.leecanyonlv.com/",
        width:728, 
        height:90,
        alt: 'Lee Canyon NV', 
        position: 'both'
      }]
    },717003:{
      ads: [{
        img: '2024-11-19-Camelback-Winter.jpg',
        href:"https://www.camelbackresort.com/ski-tube/ski-tickets-passes/",
        width:728, 
        height:90,
        alt: 'Camelback PA', 
        position: 'both',
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
        position: 'both'
      }]
    },802013: {
      ads: [{
        img: '2024-Okemo-728x90.jpg',
        href:"https://www.okemo.com/?utm_source=web&utm_medium=banner&utm_campaign=resort_of_the_week+&utm_id=snocountry2023",
        width:728, 
        height:90,
        alt: 'Okemo Mountain VT', 
        position: 'both'
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
        img: '2025-03-11-Cali-Pass.png',
        href:"https://shop.mthigh.com/reservations",
        width:728, 
        height:90,
        alt: 'Mountain High CA', 
        position: 'both',
        start_date: '2025-03-11',
        end_date: '2025-04-30'
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
        position: 'both'
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
        img: '2024-12-10-ABasin.jpg',
        href:"https://store.arapahoebasin.com/s/2024-25-passes",
        width:640, 
        height:100,
        alt: 'Arapahoe Basin CO', 
        position: 'both',
        start_date: '2024-12-10',
        end_date: '2025-01-02'
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
        position: 'both'
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
        position: 'both'
      }]
    }, 208002: {
      ads: [{
        img: '2024-03-BrundageBanner.png',
        href:"https://brundage.com/",
        width:600, 
        height:388,
        alt: 'Brundage ID ', 
        position: 'both'
      }]
    }, 802003: {
      ads: [{
        img: '2024-08-06-Bromley-728x90.jpg',
        href:"https://www.bromley.com/",
        width:728, 
        height:90,
        alt: 'Bromley VT ', 
        position: 'both'
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
        comment: 'general ad - can keep running'
      }]
    }, 704006: {
      ads: [{
        img: '2024-12-11-Sugar-Mountain.jpg',
        href:"https://www.skisugar.com",
        width:728, 
        height:90,
        alt: 'Sugar Mountain NC', 
        position: 'both',
        comment: 'general ad - can keep running'
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
        comment: 'winter ad'
      }]
    }, 508002: {
      ads: [{
        img: '2025-01-17-Bradford.png',
        href:"http://skibradford.com",
        width:300, 
        height:250,
        alt: 'Ski Bradford MA', 
        position: 'both',
        comment: 'winter ad'
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
        comment: 'winter ad'
      }]
    }, 603007 : {
      ads: [{
        img: '2025-01-24-Cranmore.png',
        href:"https://cranmore.com/tickets",
        width:728, 
        height:90,
        alt: 'Cranmore NH', 
        position: 'both',
        comment: 'winter ad'
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
  

  if (currentResortAds[resort_id]) {
    let resortAds = currentResortAds[resort_id].ads;
    //_log(`checkForResortAds::resort_id: ${resort_id}: `,resortAds);


    resortAds = selectCurrentAd(resortAds);
    let randomAdPositions = [];
    let first = true;
    let adPosition = 0;
    resortAds.forEach((iterResortAd) => {
      if ((iterResortAd.position == 'random') && (first)) {
        first = false;
        randomAdPositions = randomPositions();
        _log('checkForResortAds: Random detected:');
        console.log(randomAdPositions);
      }
      _log('checkForResortAds: applying ad');   
      console.log(iterResortAd);
      const alt = iterResortAd.alt.replaceAll(' ', '-'); 
      const html = `
      <div class="resort-ad">
        <a href="${iterResortAd.href}" target="_blank" data-umami-event="banner-resort-click-${alt}">
          <img class="img-resort-ad" src="assets/images/resort-ads/${iterResortAd.img}" alt="${iterResortAd.alt}" width="${iterResortAd.width}" height="${iterResortAd.height}" data-umami-event="banner-resort-click-${alt}">
        </a>
      </div>
      `;
      
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
      trackBanner(alt);
    });

  } else {
    //checkForGeneralAd();
  }

  if (resort_id === '1') {
    waitForElement('#resort-name').then((elTarget) => {
      const html = `
        <div id="pepsi" class="pepsi abasin">
        
            <div class="pepsi-content">
                <div class="pepsi-header">
                    <div class="pepsi-logo-container powderhorn">   
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 67" width="100" height="67" fill="#054166" class="logo-bogus-basin" role="img">
                          <title>Bogus Basin</title>
                          <path d="M16.33 28.46c0 .7-.156 1.167-.545 1.478a2.111 2.111 0 0 1-1.322.466h-1.166v-3.732h1.166c.545 0 1.011.155 1.4.466.311.234.467.7.467 1.322ZM16.718 37.403c0 .7-.155 1.244-.544 1.555-.389.389-.933.544-1.477.544h-1.322v-4.354h1.244c.233 0 .544.077.777.155.234.078.467.233.7.389.234.156.39.389.467.7.078.233.155.622.155 1.01Z M35.536 30.482c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644ZM50 0C22.395 0 0 14.774 0 33.048s22.395 33.126 50 33.126 50-14.774 50-33.048C99.922 14.775 77.527 0 50 0ZM21.928 41.135c-.388.856-1.01 1.633-1.71 2.1-.7.544-1.478.933-2.333 1.166a9.48 9.48 0 0 1-2.488.311H7.543V21.384h7.231c.7 0 1.478.078 2.333.233a6.137 6.137 0 0 1 2.333.933 5.422 5.422 0 0 1 1.789 1.945c.466.855.7 1.866.7 3.188 0 1.4-.312 2.566-.856 3.421-.389.544-.777 1.011-1.244 1.322.155.078.233.156.389.233.466.311.855.7 1.244 1.167.389.466.7 1.01.933 1.71.233.7.311 1.4.311 2.256-.155 1.322-.389 2.41-.777 3.343Zm19.44-3.11c-.388 1.477-1.01 2.8-1.788 3.888-.777 1.089-1.71 1.944-2.877 2.566-1.167.622-2.41.933-3.81.933s-2.722-.31-3.81-.933c-1.167-.622-2.1-1.477-2.878-2.566-.777-1.089-1.4-2.41-1.788-3.888a19.808 19.808 0 0 1-.622-4.977c0-1.788.233-3.421.622-4.899.389-1.477 1.01-2.8 1.788-3.888s1.711-1.944 2.877-2.488c1.167-.622 2.411-.855 3.81-.855 1.4 0 2.722.31 3.811.855 1.166.622 2.1 1.477 2.877 2.488.778 1.089 1.322 2.333 1.789 3.888.388 1.478.622 3.11.622 4.9a20.28 20.28 0 0 1-.622 4.976Zm18.119 5.132-.233.156a11.154 11.154 0 0 1-2.722 1.4c-1.089.388-2.333.544-3.733.544-1.477 0-2.799-.311-3.965-.933a8.523 8.523 0 0 1-2.955-2.567c-.778-1.088-1.4-2.332-1.867-3.81a19.182 19.182 0 0 1-.622-4.899c0-1.788.234-3.421.622-4.899.39-1.477 1.011-2.8 1.789-3.888.777-1.088 1.788-1.944 2.877-2.566 1.166-.622 2.41-.933 3.81-.933 1.556 0 2.955.311 4.044.855 1.089.545 1.944 1.245 2.566 2.1l.233.311-3.421 4.588-.467-.622c-.622-.933-1.555-1.322-2.644-1.322-.544 0-1.088.155-1.477.466-.467.311-.778.778-1.089 1.322-.31.545-.544 1.244-.7 2.022a13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.566.156.778.39 1.478.623 2.022.31.544.622 1.011 1.088 1.322.389.311.855.467 1.478.467.544 0 .933-.078 1.244-.234v-3.266h-2.41v-5.443h7.853v12.675h.078Zm18.273-7.154c0 1.244-.155 2.488-.466 3.577a8.67 8.67 0 0 1-1.4 2.955 6.093 6.093 0 0 1-2.566 2.022c-1.01.466-2.255.777-3.732.777-1.4 0-2.644-.233-3.655-.777a6.366 6.366 0 0 1-2.488-2.022c-.623-.855-1.09-1.866-1.4-2.955a17.383 17.383 0 0 1-.389-3.577V21.462h6.143v14.074c0 .623 0 1.167.078 1.711.078.467.155.933.311 1.244.156.312.311.545.622.7.233.156.544.234.933.234s.7-.078.933-.234c.234-.155.467-.389.622-.7a2.93 2.93 0 0 0 .311-1.244c.078-.544.078-1.088.078-1.71V21.461h6.066v14.541Zm14.697 4.899c-.389 1.01-1.01 1.788-1.633 2.488-.7.622-1.477 1.167-2.41 1.478-.856.31-1.867.466-2.8.466-1.4 0-2.721-.233-3.888-.777-1.166-.545-2.1-1.167-2.8-1.867l-.31-.31 3.188-4.666.467.466c.466.467.933.856 1.477 1.089.544.233 1.089.389 1.71.389.467 0 .856-.156 1.167-.467.311-.31.467-.7.467-1.244s-.156-1.01-.545-1.322c-.466-.389-1.166-.855-2.1-1.322-.621-.31-1.243-.622-1.788-1.01a8.738 8.738 0 0 1-1.555-1.4c-.466-.545-.777-1.167-1.01-1.944-.234-.7-.39-1.556-.39-2.566 0-1.322.234-2.489.7-3.422.467-.933 1.011-1.788 1.711-2.333.7-.622 1.478-1.088 2.41-1.322a7.463 7.463 0 0 1 2.567-.466c1.244 0 2.41.233 3.499.622 1.01.389 1.944 1.01 2.566 1.71l.311.312-3.266 4.587-.466-.544c-.311-.389-.7-.7-1.167-.855-.855-.389-1.788-.467-2.488.078-.311.233-.467.7-.467 1.322 0 .544.156.933.467 1.166.389.389 1.088.777 1.944 1.166a8.748 8.748 0 0 1 1.633.933 7.07 7.07 0 0 1 1.633 1.4c.544.544.933 1.167 1.244 1.944.311.778.544 1.71.544 2.722 0 1.4-.233 2.566-.622 3.499ZM34.915 28.46a3.093 3.093 0 0 0-.934-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-.933-.078-1.788-.234-2.566-.155-.933-.31-1.555-.622-2.1Zm.621 2.022c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Zm0 0c-.155-.777-.31-1.477-.622-2.022a3.093 3.093 0 0 0-.933-1.244 1.91 1.91 0 0 0-1.166-.389 1.91 1.91 0 0 0-1.166.39c-.39.31-.7.699-.934 1.243a10.41 10.41 0 0 0-.622 2.022 13.11 13.11 0 0 0-.233 2.566c0 .933.078 1.789.233 2.644.156.778.311 1.477.622 2.022.234.544.545.933.933 1.244.312.233.7.389 1.167.389.467 0 .778-.156 1.166-.389.39-.311.7-.7.933-1.244.234-.544.467-1.244.622-2.022.156-.778.234-1.71.234-2.566 0-1.01-.078-1.866-.234-2.644Z"></path>
                        </svg>
                        <img src="assets/images/ads/pepsi/2024-pepsi-logo.png" alt="Pepsi" class="logo-pepsi">
                    </div>
                    <div class="pepsi-copy">Resort of the Week</div>
                   <!--
                    <audio controls id="myaudio">
                       <source src="assets/audio/pepsi/2024-03-28-China-Peak-ROTW.mp3" type="audio/mpeg">
                    </audio>
                    -->
                </div>
                <div class="pepsi-video">
                  <iframe class="default" width="720" height="405" src="https://www.youtube.com/embed/aCaoGm4TQC8?autoplay=1&mute=1&rel=0&start=2" title="Pepsi ROTW" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius:3px;"></iframe>
                  <!--
                  <div class="pepsi-image">
                          <img class="img-small" src="assets/images/ads/pepsi/whitetail/Whitetail-MtnDew.jpg" />
                  </div>
                  -->
                </div>
            </div>    

        </div><!-- end pepsi --> 
      `;
      elTarget.insertAdjacentHTML('beforebegin',html);
    }).catch( () => { console.log('Error waiting for checkForResortAds:');});
  } else {  //Skyview
    waitForElement('#resort-name').then((elResortName) => {
      const html = `
     <div class="resort-ad">
       <a href="${iterResortAd.href}" target="_blank">
         <img class="img-resort-ad" src="assets/images/resort-ads/${iterResortAd.img}" alt="${iterResortAd.alt}" width="${iterResortAd.width}" height="${iterResortAd.height}"">
       </a>
     </div>
     `;
      elResortName.insertAdjacentHTML('beforebegin',html);
    }).catch( () => { console.log('Error waiting for checkForResortAds:');});
  }
  
});
