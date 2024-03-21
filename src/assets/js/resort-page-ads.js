// Note: Do not need to declare _log, waitForElement, because it is included in snowreport.js.  But this needs included after snowreport.js.
_log('resort-page-ads Initialized...');

const checkForGeneralAd = () => {
  return;;
  const targetList = [
    "maine", "massachusetts", "new-hampshire", "rhode-island","vermont", "quebec"
  ];
  const target = document.body.dataset.location;
  if (targetList.includes(target)) {
    
    const html = `
    <div class="internal">
      <a href="https://westernwhitemtns.com/plan-your-next-snow-day/?utm_source=TMM+SnoC+Display&utm_medium=CPM+Display+Wint23&utm_campaign=SnoC+Wint23+Display" target="_blank" >
        <img class="internal-desktop" src="assets/images/ads/WWMCC/WWMCC-Winter22-23_728X90.gif" alt="Western White Mountains" width="728" height="90"">
        <img class="internal-mobile" src="assets/images/ads/WWMCC/WWMCC-Winter22-23_320X50.gif" alt="Western White Mountains" width="320" height="50"">
      </a>
    </div>
    `;
    waitForElement('#container-snow-reports .resort.right-col').then((elSnowReportContainer) => {
      elSnowReportContainer.insertAdjacentHTML('afterbegin',html);
    }).catch( (e) => { console.log('Error waiting for Snow Report Container:',e);});
  }
};
const checkAdDates = (iterResortAd) => {
  let showAd = true;
  if ((iterResortAd.start_date) && (iterResortAd.end_date)) {
    const now = new Date();
    const startDate = new Date(iterResortAd.start_date);
    const endDate = new Date(iterResortAd.end_date + " 23:59:00");
    _log(`checkForResortAds: st:${startDate} > now:${now} < end:${endDate}`);
    if ((now < startDate) || (now > endDate)) {
      showAd = false;
    }
  }
  _log(`checkForResortAds-showAd: ${showAd}`);
  return showAd;
};
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomPositions = () => {
  const randomIndex = random(0,2);
  return (randomIndex == 0) ? ['#resort-name','.footer-resort-ad .resort__container'] : ['.footer-resort-ad .resort__container','#resort-name'];
};
document.addEventListener('DOMContentLoaded',()=> {
  _log('checkForResortAds');

  const resort_id = document.body.dataset.snowreport;
  const currentResortAds = {
    719003 : {
      ads: [ {
        img: '2024-Cooper-Spring-728x90.jpg',
        href:"https://www.skicooper.com/cooper-day-pass/",
        width:728, 
        height:90,
        alt: 'Ski Cooper, CO',
        position:'both'
      }]
    }, 603005 : {
      ads: [{
        img: '603005.gif',
        href:"https://www.brettonwoods.com/?utm_source=snocountry&utm_medium=banner&utm_campaign=prospecting-brettonwoods-leisure-2021_2022",
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
        img: 'ROTWGunstockAd.png',
        href:"https://www.gunstock.com/winter/tickets-passes/",
        width:728, 
        height:90,
        alt: 'Gunstock',
        position: 'random',
        start_date: '2024-01-08',
        end_date: '2024-04-01'
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
        img: '2024-JacksonHole-728x90.jpg',
        href:"https://www.jacksonhole.com/golden-ticket?utm_source=snocountry&utm_medium=display&utm_campaign=golden-ticket",
        width:728, 
        height:90,
        alt: 'Jackson Hole',
        position:'random',
        start_date: '2023-12-02',
        end_date: '2024-04-14'
      },{
        img: '2024-02-15-JacksonHole-AirCredit.jpg',
        href:"https://www.jacksonhole.com/300-off?utm_source=snocountry&utm_medium=display&utm_campaign=air-credit",
        width:728, 
        height:90,
        alt: 'Jackson Hole',
        position:'random',
        start_date: '2023-12-02',
        end_date: '2024-03-31'        
      },{
        img: '2024-02-15-JacksonHole-Spring-Break.jpg',
        href:"https://www.jacksonhole.com/best-spring-break-ever?utm_source=snocountry&utm_medium=display&utm_campaign=spring-break",
        width:728, 
        height:90,
        alt: 'Jackson Hole',
        position:'random',
        start_date: '2023-12-02',
        end_date: '2024-04-14'        
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
        img: 'Oak_Mountain_11-12-21.gif',
        href:"https://www.oakmountainski.com/",
        width:728, 
        height:90,
        alt: 'Oak Mountain NY',
        position:'both'
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
    },207006:{
      ads: [{
        img: 'Saddleback-Favorite-Mtn_728x90.jpg',
        href:"https://www.saddlebackmaine.com/shop/lift-tickets/",
        width:728, 
        height:90,
        alt: 'Saddleback ME',
        position:'both'
      }]
    },208008:{
      ads: [{
        img: 'Schweitzer-LodgingAd-728x90-11-5-21.jpg',
        href:"https://www.schweitzer.com/",
        width:728, 
        height:90,
        alt: 'Schweitzer ID',
        position:'both'
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
        img: 'Ski-Sundown-2023-09-14-728x90.jpg',
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
        img: 'SNOCOUNTRY-AD-COPPER.jpg',
        href:"https://www.coppercolorado.com/plan-your-trip/season-passes/copper-season-pass-2022-23",
        width:728, 
        height:90,
        alt: 'Copper Mountain CO', 
        position: 'both'
      }]
    },307002:{
      ads: [{
        img: '2024-Grand-Targhee-728x90.png',
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
    },702002:{
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
        img: '2024-02-15-Camelback-Ad.jpg',
        href:"https://www.camelbackresort.com/ski-tube/ski-tickets-passes/",
        width:728, 
        height:90,
        alt: 'Camelback PA', 
        position: 'both',       
        start_date: '2024-02-14',
        end_date: '2024-02-23'
      }]
    }, 503004 : {
      ads: [{
        img: 'MTB_Banner_728x90.jpg',
        href:"https://www.mtbachelor.com/things-to-do/events/sunchaser-spring ",
        width:728, 
        height:90,
        alt: 'Mt Bachelor OR',
        position: 'random',
        start_date: '2023-01-02',
        end_date: '2023-03-10'
      },{
        img: 'Mt-Bachelor-728x90.png',
        href:"https://www.mtbachelor.com/plan-your-trip/tickets-passes/season-passes",
        width:728, 
        height:90,
        alt: 'Mt Bachelor OR',
        position: 'random',
        start_date: '2023-01-02',
        end_date: '2023-04-01'
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
        img: '2024-03-01-CaliPass-728x90.jpg',
        href:"http://www.thecalipass.com",
        width:728, 
        height:90,
        alt: 'Mountain High CA', 
        position: 'both',
        start_date: '2024-03-09',
        end_date: '2024-04-30'
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
        img: '2024-Pats-Peak.jpg',
        href:"https://www.patspeak.com/the-mountain/mountain-info/snow-report/",
        width:728, 
        height:90,
        alt: 'Pats Peak NH', 
        position: 'both',
        start_date: '2023-12-01',
        end_date: '2024-04-07'
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
        img: '2024-Abasin-LFAR_LiftTicket_640x100.jpg',
        href:"https://www.arapahoebasin.com/tickets-and-passes/?utm_source=Banner+Ad&utm_medium=banner&utm_campaign=Lift+Tickets+&utm_id=SnoCountry",
        width:640, 
        height:100,
        alt: 'Arapahoe Basin CO', 
        position: 'both',
        start_date: '2024-01-08',
        end_date: '2024-04-24'
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
        img: '2024-02-20-WMR-3030_728x90.jpg',
        href:"https://skiwhitefish.com/specials-packages/",
        width:728, 
        height:90,
        alt: 'Whitefish Mountain Resort MT', 
        position: 'both',
        start_date: '2024-02-20',
        end_date: '2024-04-27'
      }]
    }, 303025 : {
      ads: [{
        img: '2024-02-18-WolfCreek-300x50.png',
        href:"https://wolfcreekski.com/events-and-deals/",
        width:300, 
        height:50,
        alt: 'Wolf Creek CO', 
        position: 'both',
        start_date: '2024-02-20',
        end_date: '2024-04-27'
      }]
    }, 303016: {
      ads: [{
        img: '2024-02-20-Powderhorn.png',
        href:"https://powderhorn.com/",
        width:728, 
        height:90,
        alt: 'Powderhorn CO', 
        position: 'both',
        start_date: '2024-02-20',
        end_date: '2024-04-27'
      }]
    }, 719002: {
      ads: [{
        img: '2024-03-Monarch-Wings-Pass.jpg',
        href:"https://skimonarch.com/season-passes/",
        width:600, 
        height:388,
        alt: 'Monarch Mountain CO', 
        position: 'both',
        start_date: '2024-02-20',
        end_date: '2024-06-27'
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
    }
    
  };
  if (currentResortAds[resort_id]) {
    
    
    const resortAds = currentResortAds[resort_id].ads;
    if(resortAds.length > 2) {
      const randomIndex = random(0,resortAds.length);
      resortAds.splice(randomIndex,1);
    }
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
      if (checkAdDates(iterResortAd)) {    
        _log('checkForResortAds: applying ad');   
        console.log(iterResortAd);
        const html = `
        <div class="resort-ad">
          <a href="${iterResortAd.href}" target="_blank">
            <img src="assets/images/resort-ads/${iterResortAd.img}" alt="${iterResortAd.alt}" width="${iterResortAd.width}" height="${iterResortAd.height}"">
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
      }
    });

  } else {
    checkForGeneralAd();
  }

  if (resort_id === '802013') {
    waitForElement('#resort-name').then((elTarget) => {
      const html = `
        <div id="pepsi" class="pepsi abasin">
        
            <div class="pepsi-content">
                <div class="pepsi-header">
                    <div class="pepsi-logo-container">   
                        <img class="logo-camelback" src="assets/images/ads/pepsi/okemo/Okemo-2024-03.png" alt="Okemo Mountain Resort">
                        <img src="assets/images/ads/pepsi/pepsi-zero-sugar-logo.png" alt="Pepsi" class="logo-pepsi">
                    </div>
                    <div class="pepsi-copy">Resort of the Week</div>
                   
                    <audio controls id="myaudio">
                       <source src="assets/audio/pepsi/22024-03-22-Okemo-ROTW.mp3" type="audio/mpeg">
                    </audio>
                    
                </div>
                <div class="pepsi-video">
                  <iframe class="abasin" width="640" height="360" src="https://www.youtube.com/embed/fiGlCCOD6WA?autoplay=1&mute=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius:3px;"></iframe>
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
         <img src="assets/images/resort-ads/${iterResortAd.img}" alt="${iterResortAd.alt}" width="${iterResortAd.width}" height="${iterResortAd.height}"">
       </a>
     </div>
     `;
      elResortName.insertAdjacentHTML('beforebegin',html);
    }).catch( () => { console.log('Error waiting for checkForResortAds:');});
  }
  
});