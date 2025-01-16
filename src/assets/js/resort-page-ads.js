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
  let returnValidAds = [];
  if (validResortAds.length > 2) {
    for (let ind=0; ind < 2; ind++) {
      returnValidAds.push(validResortAds.splice(random(0,validResortAds.length),1));
    }
  } else {
    returnValidAds = validResortAds;
  }
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
        img: '2024-Ragged-728x90.png',
        href:"https://www.raggedmountainresort.com/season-passes/",
        width:728, 
        height:90,
        alt: 'Ragged Mountain, NH',
        position: 'both',
        start_date: '2024-03-11',
        end_date: '2024-04-08'
      }]
    }, 616006 : {
      ads: [{
        img: 'Crystal-2023-12-08-Hurry-728x90.jpg',
        href:"https://www.crystalmountain.com/ski/slopes/",
        width:728, 
        height:90,
        alt: 'Crystal Mountain MI',
        position: 'both',
        start_date: '2023-12-08',
        end_date: '2024-04-01'
      }]
    }, 603009 : {
      ads: [{
        img: '2024-12-14-Gunstock-winter.png',
        href:"https://www.gunstock.com/",
        width:728, 
        height:90,
        alt: 'Gunstock NH',
        position: 'random',
        start_date: '2024-12-14',
        end_date: '2025-04-15'
      },{
        
        img: '2024-Gunstock-RV-700x100.jpg',
        href:"https://www.gunstock.com/winter/tickets-passes/",
        width:728, 
        height:90,
        alt: 'Gunstock',
        position: 'random',
        start_date: '2024-01-08',
        end_date: '2024-04-01'
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
        img: 'SnoCountry-GPMR-728x90.png',
        href:"https://www.greekpeak.net",
        width:728, 
        height:90,
        alt: 'Greek Peak',
        position: 'both',
        start_date: '2023-01-02',
        end_date: '2023-04-30'
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
      },{
        img: '2024-06-10-JacksonHoleTram-728x90.jpg',
        href:"https://www.jacksonhole.com/summer-activities/summer-tram?utm_source=snocountry&utm_medium=display&utm_campaign=sightseeing",
        width:728, 
        height:90,
        alt: 'Jackson Hole',
        position:'random',
        start_date: '2024-06-19',
        end_date: '2024-10-06'
      },{
        img: '2024-06-24-JacksonHole-728x290.jpg',
        href:"https://www.jacksonhole.com/summer-activities/via-ferrata?utm_source=snocountry&utm_medium=display&utm_campaign=via-ferrata",
        width:728, 
        height:90,
        alt: 'Jackson Hole',
        position:'random',
        start_date: '2024-06-19',
        end_date: '2024-10-06'
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
        img: 'MtPeter-SnoCountryDigitalAd-2023-11-15.gif',
        href:"https://www.mtpeter.com/sc/",
        width:728, 
        height:90,
        alt: 'Mt. Peter NY',
        position:'random',
        start_date: '2023-12-10',
        end_date: '2024-03-22'
      }, {
        img: 'MtPeter-SnoCountryDigitalAd-2023-11-15.gif',
        href:"https://www.mtpeter.com/sc/",
        width:728, 
        height:90,
        alt: 'Mt. Peter NY',
        position:'random',
        start_date: '2023-12-10',
        end_date: '2024-03-22'
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
    },207006:{
      ads: [{
        img: 'Saddleback-Favorite-Mtn_728x90.jpg',
        href:"https://www.saddlebackmaine.com/shop/lift-tickets/",
        width:728, 
        height:90,
        alt: 'Saddleback ME',
        position:'both'
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
        img: '2024-08-01-Ski-Sundown-728x90.jpg',
        href:"https://www.skisundown.com/",
        width:728, 
        height:90,
        alt: 'Ski Sundown CT', 
        position: 'both'
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
        img: 'Stratton_11-26-21.jpg',
        href:"https://www.stratton.com/plan-your-trip/deals-and-packages?utm_source=SnoCountry&utm_medium=link&utm_campaign=winter",
        width:728, 
        height:90,
        alt: 'Stratton Mountain VT', 
        position: 'both'
      }]
    },802023:{
      ads: [{
        img: 'Sugarbush-3-11-22.jpg',
        href:"https://www.sugarbush.com/plan-your-trip/season-passes",
        width:728, 
        height:90,
        alt: 'Sugarbush VT', 
        position: 'both'
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
        img: 'Omni_Homestead_12-4-21.jpg',
        href:"https://www.omnihotels.com/hotels/homestead-virginia/specials/ski-package?utm_source=snocountry&utm_medium=banner&utm_campaign=awareness-homrst-leisure-ski",
        width:728, 
        height:90,
        alt: 'Omni Homestead VA', 
        position: 'both'
      }]
    },603001:{
      ads: [{
        img: 'WVR SEM_SeasonPass_728x90pdf-01.jpg',
        href:"https://www.waterville.com/season-passes",
        width:728, 
        height:90,
        alt: 'Waterville Valley NH', 
        position: 'both',
        start_date: '2023-01-02',
        end_date: '2023-04-30'
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
        img: 'Less-Canyon-Ad.png',
        href:"https://www.leecanyonlv.com/midweek-magic/",
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
        img: '2024-Mt-Bachelor.jpg',
        href:"https://www.mtbachelor.com/tickets-passes/lift-tickets",
        width:728, 
        height:90,
        alt: 'Mt Bachelor OR',
        position: 'random',
        start_date: '2024-12-03',
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
    },  814002:{
      ads: [{
        img: 'Seven-Springs-resort-ad-728x90.jpg',
        href:"https://www.7springs.com/",
        width:728, 
        height:90,
        alt: 'Seven Springs PA', 
        position: 'both'
      }]
    }, 801008:{
      ads: [{
        img: 'PowderMountain_ad_snocountry_728x90.jpg',
        href:"https://powdermountain.com/spring-skiing",
        width:728, 
        height:90,
        alt: 'Ragged Mountain NH', 
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
        img: '2024-03-01-CaliPass-728x90.jpg',
        href:"http://www.thecalipass.com",
        width:728, 
        height:90,
        alt: 'Bear Valley Mountain Resort CA', 
        position: 'both',
        start_date: '2024-03-09',
        end_date: '2024-04-30'
      }]
    },209003: {
      ads: [{
        img: '2024-03-01-CaliPass-728x90.jpg',
        href:"http://www.thecalipass.com",
        width:728, 
        height:90,
        alt: 'Dodge Ridge CA', 
        position: 'both',
        start_date: '2024-03-09',
        end_date: '2024-04-30'
      }]
    },209005: {
      ads: [{
        img: '2024-03-01-CaliPass-728x90.jpg',
        href:"http://www.thecalipass.com",
        width:728, 
        height:90,
        alt: 'China Peak CA', 
        position: 'both',
        start_date: '2024-03-09',
        end_date: '2024-04-30'
      }]
    },619006: {
      ads: [{
        img: '2024-11-20-Mountain-High.png',
        href:"https://www.mthigh.com/site/tickets-and-groups/season-passes/season-pass.html",
        width:728, 
        height:90,
        alt: 'Mountain High CA', 
        position: 'both',
        start_date: '2024-11-20',
        end_date: '2024-11-30'
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
    }, 603013: {
      ads: [{
        img: 'Tenney-2023-12-01-728x90.png',
        href:"https://www.skitenney.com",
        width:728, 
        height:90,
        alt: 'Tenney NH', 
        position: 'both',
        start_date: '2023-12-01',
        end_date: '2024-04-07'
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
        position: 'both',
        start_date: '2024-12-11',
        end_date: '2025-04-03'
      }]
    }, 719002: {
      ads: [{
        img: '2024-11-20-Monarch.jpg',
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

  if (resort_id === '307002') {
    waitForElement('#resort-name').then((elTarget) => {
      const html = `
        <div id="pepsi" class="pepsi abasin">
        
            <div class="pepsi-content">
                <div class="pepsi-header">
                    <div class="pepsi-logo-container">   
                        <!--<img class="logo-abasin" src="assets/images/ads/pepsi/grand-targhee/Grand-Targhee-logo.png" alt="Grand Targhee Resort"> -->
                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 145 83"><path d="M27.689 35.234c-6.184 3.718-7.262 12.228-5.974 18.821.047.281.07-.35.258-.911 1.03-3.367 6.817-6.266 9.136-7.599 4.404-2.525 9.018-5.4 11.946-9.633 5.365-7.762 3.56-20.925 1.242-29.435-.047 6.265-1.78 13.607-4.943 19.055-2.506 4.348-7.472 7.154-11.665 9.702ZM45.773 3.11s6.63-.374 12.767 2.525c4.498 2.408 8.292 6.032 11.478 9.983 5.458 6.757 9.768 14.426 13.493 22.258 3.537 7.482 7.145 15.478 14.242 20.294 8.714 5.915 20.216 3.788 29.141 9.329-4.966-7.412-10.612-12.93-17.827-18.213-6.418-4.676-11.759-9.049-15.741-16.016-2.905-5.003-6.184-9.82-9.464-14.59-4.31-6.312-9.135-11.946-16.07-15.383C64.163 1.497 60.837.21 56.01.21c-4.825 0-10.237 2.9-10.237 2.9Z" fill="#003449"></path><path d="M59.406 23.263c4.17 1.496 7.941 3.016 10.916 6.406 2.46 2.806 3.28 6.477 4.474 9.914 3.022 8.674 7.262 11.807 10.823 16.576-6.044-1.66-12.017-5.143-15.414-10.544-2.132-3.367-3.045-7.552-4.029-11.363-1.64-6.243-6.77-10.989-6.77-10.989ZM4.263 74.537c.984 0 2.038.397 2.835 1.098a.2.2 0 0 1 .023.304l-.913.982a.246.246 0 0 1-.305 0c-.445-.397-.96-.56-1.522-.56-1.265 0-2.296 1.075-2.296 2.337 0 1.263 1.03 2.315 2.295 2.315.328 0 .68-.047 1.031-.187v-.678h-.726a.21.21 0 0 1-.21-.21v-1.146a.21.21 0 0 1 .21-.21h2.343a.21.21 0 0 1 .21.21v3.11c0 .046-.047.14-.093.186 0 0-1.195.749-2.882.749-2.319 0-4.17-1.824-4.17-4.162a4.14 4.14 0 0 1 4.17-4.138ZM9.182 74.864a.21.21 0 0 1 .21-.21h3.49a2.512 2.512 0 0 1 2.53 2.501c0 1.076-.702 1.917-1.71 2.338l1.594 2.946c.07.14 0 .327-.188.327h-1.546c-.094 0-.164-.047-.187-.093l-1.546-3.063h-.82v2.922a.21.21 0 0 1-.211.21H9.416a.21.21 0 0 1-.21-.21v-7.668h-.024Zm3.537 3.25c.468 0 .89-.445.89-.936a.889.889 0 0 0-.89-.888h-1.71v1.8h1.71v.024ZM16.28 82.463l3.63-7.81c.024-.07.118-.116.188-.116h.117c.07 0 .164.046.188.116l3.63 7.81a.207.207 0 0 1-.187.303h-1.288c-.211 0-.305-.07-.399-.28l-.421-.912h-3.163l-.421.935c-.047.14-.188.28-.422.28h-1.288a.23.23 0 0 1-.164-.326Zm4.778-2.479-.89-1.917-.866 1.917h1.756ZM25.135 74.724a.21.21 0 0 1 .21-.21h.282l4.638 4.441v-4.114a.21.21 0 0 1 .21-.21h1.406a.21.21 0 0 1 .211.21v7.809a.21.21 0 0 1-.21.21h-.188a.333.333 0 0 1-.14-.047l-4.592-4.606v4.326a.21.21 0 0 1-.21.21h-1.383a.21.21 0 0 1-.21-.21l-.024-7.81ZM34.037 74.864a.21.21 0 0 1 .21-.21h2.835c2.25 0 4.076 1.823 4.076 4.044a4.075 4.075 0 0 1-4.076 4.068h-2.834a.21.21 0 0 1-.21-.21v-7.692Zm2.928 6.172c1.312 0 2.272-1.029 2.272-2.361 0-1.31-.96-2.338-2.272-2.338h-1.124v4.7h1.124ZM46.897 76.337h-1.663a.21.21 0 0 1-.21-.21v-1.263a.21.21 0 0 1 .21-.21h5.154a.21.21 0 0 1 .21.21v1.262a.21.21 0 0 1-.21.21h-1.663v6.197a.21.21 0 0 1-.211.21h-1.406a.21.21 0 0 1-.21-.21v-6.196ZM50.668 82.463l3.631-7.81c.024-.07.117-.116.188-.116h.117c.07 0 .164.046.187.116l3.631 7.81a.207.207 0 0 1-.187.303h-1.289c-.21 0-.304-.07-.398-.28l-.422-.912h-3.162l-.422.935c-.046.14-.187.28-.421.28h-1.289a.23.23 0 0 1-.164-.326Zm4.78-2.479-.891-1.917-.867 1.917h1.757ZM59.547 74.864a.21.21 0 0 1 .21-.21h3.468a2.512 2.512 0 0 1 2.53 2.501c0 1.076-.703 1.917-1.71 2.338l1.592 2.946c.07.14 0 .327-.187.327h-1.546c-.094 0-.164-.047-.188-.093L62.17 79.61h-.796v2.922a.21.21 0 0 1-.21.21H59.78a.21.21 0 0 1-.21-.21v-7.668h-.024Zm3.537 3.25c.468 0 .89-.445.89-.936a.889.889 0 0 0-.89-.888h-1.71v1.8h1.71v.024ZM71.049 74.537c.983 0 2.037.397 2.834 1.098a.2.2 0 0 1 .023.304l-.913.982a.246.246 0 0 1-.305 0c-.445-.397-.96-.56-1.522-.56-1.265 0-2.296 1.075-2.296 2.337 0 1.263 1.03 2.315 2.296 2.315.328 0 .679-.047 1.03-.187v-.678h-.75a.21.21 0 0 1-.21-.21v-1.146a.21.21 0 0 1 .21-.21h2.343a.21.21 0 0 1 .211.21v3.11c0 .046-.047.14-.094.186 0 0-1.194.749-2.88.749-2.32 0-4.17-1.824-4.17-4.162a4.175 4.175 0 0 1 4.193-4.138ZM75.732 74.864a.21.21 0 0 1 .211-.21h1.382a.21.21 0 0 1 .211.21v2.922h3.326v-2.922a.21.21 0 0 1 .211-.21h1.382a.21.21 0 0 1 .211.21v7.668a.21.21 0 0 1-.21.21h-1.383a.21.21 0 0 1-.21-.21v-3.039h-3.327v3.04a.21.21 0 0 1-.21.21h-1.383a.21.21 0 0 1-.21-.21v-7.67ZM84.588 74.864a.21.21 0 0 1 .21-.21h4.803a.21.21 0 0 1 .21.21v1.262a.21.21 0 0 1-.21.21h-3.21v1.427h2.648a.21.21 0 0 1 .21.21v1.263a.21.21 0 0 1-.21.21h-2.647v1.567H89.6a.21.21 0 0 1 .21.21v1.263a.21.21 0 0 1-.21.21h-4.802a.21.21 0 0 1-.211-.21v-7.622ZM91.756 74.864a.21.21 0 0 1 .21-.21h4.803a.21.21 0 0 1 .21.21v1.262a.21.21 0 0 1-.21.21h-3.21v1.427h2.648a.21.21 0 0 1 .21.21v1.263a.21.21 0 0 1-.21.21H93.56v1.567h3.209a.21.21 0 0 1 .21.21v1.263a.21.21 0 0 1-.21.21h-4.802a.21.21 0 0 1-.211-.21v-7.622ZM101.852 74.864a.21.21 0 0 1 .21-.21h3.467a2.512 2.512 0 0 1 2.53 2.501c0 1.076-.703 1.917-1.71 2.338l1.593 2.946c.07.14 0 .327-.187.327h-1.546c-.094 0-.164-.047-.188-.093l-1.546-3.063h-.796v2.922a.21.21 0 0 1-.211.21h-1.382a.21.21 0 0 1-.211-.21v-7.668h-.023Zm3.56 3.25c.469 0 .89-.445.89-.936a.889.889 0 0 0-.89-.888h-1.71v1.8h1.71v.024ZM109.535 74.864a.21.21 0 0 1 .211-.21h4.802a.21.21 0 0 1 .211.21v1.262a.21.21 0 0 1-.211.21h-3.209v1.427h2.647a.21.21 0 0 1 .211.21v1.263a.21.21 0 0 1-.211.21h-2.647v1.567h3.209a.21.21 0 0 1 .211.21v1.263a.21.21 0 0 1-.211.21h-4.802a.21.21 0 0 1-.211-.21v-7.622ZM116.234 81.644l.539-.959c.094-.14.305-.116.398-.07.047.024.89.632 1.64.632.469 0 .797-.28.797-.702 0-.49-.399-.865-1.195-1.169-1.007-.397-2.249-1.169-2.249-2.572 0-1.145.89-2.314 2.694-2.314 1.218 0 2.132.608 2.483.865.141.07.117.28.07.374l-.585.888c-.071.117-.281.234-.399.14-.093-.046-.96-.7-1.663-.7-.421 0-.726.28-.726.584 0 .42.351.748 1.265 1.122.914.35 2.342 1.075 2.342 2.642 0 1.192-1.03 2.408-2.74 2.408-1.499 0-2.343-.631-2.624-.888-.094-.07-.14-.117-.047-.28ZM127.009 74.537c2.32 0 4.194 1.87 4.194 4.185 0 2.314-1.851 4.161-4.194 4.161a4.13 4.13 0 0 1-4.169-4.161 4.15 4.15 0 0 1 4.169-4.185Zm0 6.476a2.323 2.323 0 0 0 2.32-2.315c0-1.286-1.055-2.338-2.32-2.338-1.264 0-2.319 1.052-2.319 2.338a2.323 2.323 0 0 0 2.319 2.315ZM132.258 74.864a.21.21 0 0 1 .211-.21h3.467a2.512 2.512 0 0 1 2.529 2.501c0 1.076-.702 1.917-1.71 2.338l1.593 2.946c.071.14 0 .327-.187.327h-1.546c-.094 0-.164-.047-.188-.093l-1.546-3.063h-.796v2.922a.21.21 0 0 1-.211.21h-1.382a.21.21 0 0 1-.211-.21v-7.668h-.023Zm3.56 3.25c.469 0 .891-.445.891-.936a.89.89 0 0 0-.891-.888h-1.71v1.8h1.71v.024ZM141.229 76.337h-1.663a.21.21 0 0 1-.211-.21v-1.263a.21.21 0 0 1 .211-.21h5.154a.21.21 0 0 1 .211.21v1.262a.21.21 0 0 1-.211.21h-1.663v6.197a.21.21 0 0 1-.211.21h-1.406a.21.21 0 0 1-.211-.21v-6.196Z" fill="#003449"></path></svg>
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
                  <iframe class="default" width="720" height="405" src="https://www.youtube.com/embed/O-c0K9mx2ic?autoplay=1&mute=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius:3px;"></iframe>
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
