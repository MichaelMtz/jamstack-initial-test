// Note: Do not need to declare _log, waitForElement, because it is included in snowreport.js.  But this needs included after snowreport.js.
_log('resort-page-ads Initialized...');

const checkForAd = () => {
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

document.addEventListener('DOMContentLoaded',()=> {
  _log('checkForResortAds');

  const resort_id = document.body.dataset.snowreport;
  const currentResortAds = {
    719003 : {
      ads: [ {
        img: '719003.jpg',
        href:"https://www.skicooper.com/cooper-day-pass/",
        width:728, 
        height:90,
        alt: 'Ski Cooper',
        position:'both'
      }]
    }, 603005 : {
      ads: [{
        img: '603005.gif',
        href:"https://www.brettonwoods.com/?utm_source=snocountry&utm_medium=banner&utm_campaign=prospecting-brettonwoods-leisure-2021_2022",
        width:728, 
        height:90,
        alt: 'Bretton Woods',
        position: 'both'
      }]
    }, 616006 : {
      ads: [{
        img: '728x90_Crystal_22688_WMTASki&Stay_v1.jpg',
        href:"https://www.crystalmountain.com/your-visit/specials-packages/hot-dates/",
        width:728, 
        height:90,
        alt: 'Crystal Mountain MI',
        position: 'top',
        start_date: '2023-01-02',
        end_date: '2023-03-10'
      },{
        img: '728x90_Crystal_22700_OnlineLiftTickets.jpg',
        href:"https://www.crystalmountain.com/ski/lift-tickets/",
        width:728, 
        height:90,
        alt: 'Crystal Mountain MI',
        position: 'bottom',
        start_date: '2023-01-02',
        end_date: '2023-04-01'
      }]
    }, 603009 : {
      ads: [{
        img: 'Gunstock-SnowCountry3-728x90_YayWinter.jpg',
        href:"https://www.gunstock.com/on-snow/tickets-passes/?utm_source=snocountry&utm_medium=ad&utm_campaign=chill&utm_id=tickets",
        width:728, 
        height:90,
        alt: 'Gunstock',
        position: 'both'
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
        img: '307008.jpg',
        href:"https://www.jacksonhole.com/winter?utm_source=snocountry&utm_medium=display&utm_campaign=winter",
        width:728, 
        height:90,
        alt: 'Jackson Hole',
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
    },703003:{
      ads: [{
        img: 'Massanutten_Resort_11-15-21.jpg',
        href:"https://www.massresort.com/play/snow-sports/50th-celebration/?utm_source=SnoCountry&utm_medium=Banner&utm_campaign=SnoCountry+Ads&utm_id=SnoCountry+Ads",
        width:728, 
        height:90,
        alt: 'Massanutten Deals',
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
        img: 'MtPeter-2022-728x90-Ad.jpg',
        href:"https://www.mtpeter.com/sc/",
        width:728, 
        height:90,
        alt: 'Mt. Peter NY',
        position:'both'
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
        img: 'Ski-Sundown-WMB-2022-728x90.jpg',
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
        img: 'Grand-Targhee.png',
        href:"https://www.grandtarghee.com/",
        width:728, 
        height:90,
        alt: 'Grand Targhee CO', 
        position: 'both'
      }]
    },717013:{
      ads: [{
        img: 'whitetail-banner-ad.jpg',
        href:"https://www.skiwhitetail.com",
        width:728, 
        height:90,
        alt: 'Whitetail Resort PA', 
        position: 'both'
      }]
    },702002:{
      ads: [{
        img: 'Less-Canyon-Ad.png',
        href:"https://www.leecanyonlv.com/skiing-and-snowboarding/rental-lessons/discover-lee",
        width:728, 
        height:90,
        alt: 'Lee Canyon NV', 
        position: 'both'
      }]
    }
    
    
  };
  if (currentResortAds[resort_id]) {
    _log('checkForResortAds: applying ad');
    
    const resortAds = currentResortAds[resort_id].ads;
    resortAds.forEach((iterResortAd) => {
      const html = `
      <div class="resort-ad">
        <a href="${iterResortAd.href}">
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
    });

  }

  if (resort_id === '702002') {
    waitForElement('#resort-name').then((elTarget) => {
      const html = `
        <div id="pepsi" class="pepsi abasin">
        
            <div class="pepsi-content">
                <div class="pepsi-header">
                    <div class="pepsi-logo-container">   
                        <svg class="lee-canyon" width="170px" height="46px" viewBox="0 0 170 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <!-- Generator: Sketch 52.2 (67145) - http://www.bohemiancoding.com/sketch -->
                            <title>LeeCanyon_Logo_Color</title>
                            <desc>Created with Sketch.</desc>
                            <defs>
                                <polygon id="path-1" points="0.370580821 0.162764384 14.3871513 0.162764384 14.3871513 18.2739726 0.370580821 18.2739726"></polygon>
                                <polygon id="path-3" points="0 0.140520548 36.4118044 0.140520548 36.4118044 41.1809644 0 41.1809644"></polygon>
                            </defs>
                            <g id="LEE-CANYON" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="LEE-CANYON---Home" transform="translate(-40.000000, -627.000000)">
                                    <g id="Nav-ON-SCROLL" transform="translate(0.000000, 577.000000)">
                                        <g id="LeeCanyon_Logo_Color" transform="translate(40.000000, 49.603321)">
                                            <g>
                                                <path d="M40.7974908,23.2535041 C40.7974908,22.9529288 41.0371218,22.6826 41.3664576,22.6826 L44.9308118,22.6826 C45.2300369,22.6826 45.5004059,22.9529288 45.5004059,23.2535041 L45.5004059,37.1272301 L52.6284871,37.1272301 C52.9578229,37.1272301 53.1980812,37.3969288 53.1980812,37.6981342 L53.1980812,40.9779973 C53.1980812,41.2785726 52.9578229,41.5495315 52.6284871,41.5495315 L41.3664576,41.5495315 C41.0371218,41.5495315 40.7974908,41.2785726 40.7974908,40.9779973 L40.7974908,23.2535041 Z" id="Fill-1" fill="#002939"></path>
                                                <path d="M62.0744022,32.7037315 C62.0141808,31.7711288 61.2356937,30.9884986 60.0676494,30.9884986 C58.9290886,30.9884986 58.1800849,31.7711288 58.0006753,32.7037315 L62.0744022,32.7037315 Z M60.1874649,27.3475671 C63.6915978,27.3475671 66.7472066,30.0256493 66.7472066,33.8468 C66.7472066,34.0572658 66.7164686,34.5386904 66.6869852,34.7497863 C66.6568745,35.1102247 66.3275387,35.3515671 66.0276863,35.3515671 L57.4913026,35.3515671 C57.4913026,36.4341425 58.4799373,37.7580603 60.3668745,37.7580603 C61.2658044,37.7580603 62.403738,37.3068822 63.0028155,36.8859507 C63.3020406,36.6149918 63.6614871,36.6149918 63.8716347,36.8859507 L65.3991255,38.9017589 C65.6086458,39.1727178 65.6682399,39.5936493 65.3690148,39.8948548 C64.1708598,41.128663 62.4338487,41.8804164 60.247059,41.8804164 C56.113738,41.8804164 52.9985351,38.9017589 52.9985351,34.5991836 C52.9985351,30.6879233 56.0836273,27.3475671 60.1874649,27.3475671 Z" id="Fill-3" fill="#002939"></path>
                                                <path d="M75.9866753,32.7037315 C75.9264539,31.7711288 75.1479668,30.9884986 73.9799225,30.9884986 C72.8413616,30.9884986 72.0923579,31.7711288 71.9129483,32.7037315 L75.9866753,32.7037315 Z M74.0991107,27.3475671 C77.6038708,27.3475671 80.6588524,30.0256493 80.6588524,33.8468 C80.6588524,34.0572658 80.6287417,34.5386904 80.5992583,34.7497863 C80.5691476,35.1102247 80.2398118,35.3515671 79.9399594,35.3515671 L71.4035756,35.3515671 C71.4035756,36.4341425 72.3922103,37.7580603 74.2791476,37.7580603 C75.1774502,37.7580603 76.3160111,37.3068822 76.9150886,36.8859507 C77.2143137,36.6149918 77.5737601,36.6149918 77.7832804,36.8859507 L79.3107712,38.9017589 C79.5209188,39.1727178 79.5805129,39.5936493 79.2812878,39.8948548 C78.0831328,41.128663 76.3454945,41.8804164 74.1593321,41.8804164 C70.0260111,41.8804164 66.9108081,38.9017589 66.9108081,34.5991836 C66.9108081,30.6879233 69.9959004,27.3475671 74.0991107,27.3475671 Z" id="Fill-5" fill="#002939"></path>
                                                <path d="M99.8227454,36.1350164 C99.5950332,35.8684685 99.1138893,35.8451534 98.8334834,36.087126 C97.845476,36.9415918 96.6893506,37.3568521 95.2986125,37.3568521 C92.3885387,37.3568521 90.1095351,34.9950986 90.1095351,31.9798932 C90.1095351,28.9186877 92.3766199,26.5197562 95.2716384,26.5197562 C96.6347749,26.5197562 97.7996827,26.9621123 98.8228192,27.8638384 C99.0925609,28.1347973 99.5153653,28.133537 99.7882435,27.8613178 L101.917948,25.6381945 C102.064111,25.4913726 102.141897,25.3029616 102.136251,25.1063589 C102.130605,24.909126 102.0409,24.7226055 101.884074,24.5827151 C99.916214,22.7805233 97.8348118,21.9764685 95.1342583,21.9764685 C89.5825978,21.9764685 85.0666199,26.5134548 85.0666199,32.0901671 C85.0666199,37.6366329 89.5825978,42.1490438 95.1342583,42.1490438 C97.7457343,42.1490438 100.090605,41.2082493 101.917948,39.4262219 C102.195845,39.1477014 102.209018,38.6694274 101.949941,38.4085507 L99.8227454,36.1350164 Z" id="Fill-7" fill="#002939"></path>
                                                <path d="M108.634768,38.6106356 C109.473476,38.6106356 110.192369,37.9181151 110.192369,37.0749918 C110.192369,36.2627452 109.473476,35.5412384 108.634768,35.5412384 C107.796686,35.5412384 107.107277,36.2627452 107.107277,37.0749918 C107.107277,37.9181151 107.796686,38.6106356 108.634768,38.6106356 M107.736465,32.7730466 C109.294066,32.7730466 110.462111,33.3748274 110.462111,33.3748274 C110.462111,32.020663 110.162886,31.238663 108.545063,31.238663 C107.586539,31.238663 105.969343,31.4497589 105.070413,31.7194575 C104.53093,31.900937 104.291926,31.5089918 104.231705,30.9979507 L103.902996,28.8611562 C103.812664,28.2600055 104.142,27.9890466 104.441225,27.898937 C104.771188,27.7785808 107.196982,27.4471288 109.053808,27.4471288 C113.337683,27.4471288 114.835063,29.1926082 114.835063,33.3149644 L114.835063,40.9868822 C114.835063,41.3485808 114.505727,41.648526 114.176391,41.648526 L112.708494,41.648526 C112.498974,41.648526 112.259343,41.5892932 112.079934,41.1973479 L111.630155,40.2647452 C110.791446,40.9868822 109.623402,41.9799781 107.436613,41.9799781 C104.710967,41.9799781 102.64462,40.1746356 102.64462,37.4064438 C102.64462,34.7289918 104.591779,32.7730466 107.736465,32.7730466" id="Fill-9" fill="#002939"></path>
                                                <path d="M116.114642,28.4102932 C116.114642,28.0189781 116.413867,27.7486493 116.773314,27.7486493 L118.121395,27.7486493 C118.330915,27.7486493 118.60003,27.8986219 118.750583,28.1695808 L119.259328,29.5533616 C120.008332,28.7114986 121.056561,27.4474438 123.572686,27.4474438 C127.886044,27.4474438 129.353314,30.5168411 129.353314,34.3373616 L129.353314,40.9871973 C129.353314,41.3482658 129.053461,41.6488411 128.724753,41.6488411 L125.459624,41.6488411 C125.070066,41.6488411 124.800952,41.3482658 124.800952,40.9871973 L124.800952,34.2774986 C124.800952,32.9535808 124.351173,31.7197726 122.793572,31.7197726 C121.416007,31.7197726 120.697114,32.6819918 120.697114,34.0966493 L120.697114,40.9871973 C120.697114,41.2884027 120.547188,41.6488411 120.067926,41.6488411 L116.773314,41.6488411 C116.413867,41.6488411 116.114642,41.3482658 116.114642,40.9871973 L116.114642,28.4102932 Z" id="Fill-11" fill="#002939"></path>
                                                <g id="Group-15" transform="translate(128.597786, 27.585759)">
                                                    <mask id="mask-2" fill="white">
                                                        <use xlink:href="#path-1"></use>
                                                    </mask>
                                                    <g id="Clip-14"></g>
                                                    <path d="M0.4180369,1.06575068 C0.268110701,0.613942466 0.477630996,0.162764384 0.98700369,0.162764384 L4.55135793,0.162764384 C4.79098893,0.162764384 5.03061993,0.313367123 5.09021402,0.553449315 L6.9777786,7.92542192 L7.03737269,7.92542192 L9.70342435,0.553449315 C9.79312915,0.313367123 10.0327601,0.162764384 10.3018745,0.162764384 L13.7169299,0.162764384 C14.2564133,0.162764384 14.5255277,0.58369589 14.3160074,1.06575068 L7.37862731,17.8532301 C7.28892251,18.064326 7.04929151,18.2741616 6.80966052,18.2741616 L3.45482657,18.2741616 C2.94608118,18.2741616 2.67633948,17.8229836 2.88648708,17.3415589 L4.52187454,13.0099973 L0.4180369,1.06575068 Z" id="Fill-13" fill="#002939" mask="url(#mask-2)"></path>
                                                </g>
                                                <path d="M148.985114,37.6777808 C150.572827,37.6777808 151.860059,36.294 151.860059,34.6688767 C151.860059,33.0733699 150.572827,31.7198356 148.985114,31.7198356 C147.367919,31.7198356 146.080059,33.0733699 146.080059,34.6688767 C146.080059,36.294 147.367919,37.6777808 148.985114,37.6777808 M148.985114,27.4475068 C152.939026,27.4475068 156.173417,30.7569863 156.173417,34.6688767 C156.173417,38.64 152.939026,41.979726 148.985114,41.979726 C145.031203,41.979726 141.766701,38.64 141.766701,34.6688767 C141.766701,30.7569863 145.031203,27.4475068 148.985114,27.4475068" id="Fill-16" fill="#002939"></path>
                                                <path d="M156.734292,28.4102932 C156.734292,28.0189781 157.033517,27.7486493 157.392963,27.7486493 L158.741044,27.7486493 C158.950565,27.7486493 159.220306,27.8986219 159.370232,28.1695808 L159.879605,29.5533616 C160.627982,28.7114986 161.67621,27.4474438 164.192336,27.4474438 C168.505694,27.4474438 169.972963,30.5168411 169.972963,34.3373616 L169.972963,40.9871973 C169.972963,41.3482658 169.673738,41.6488411 169.344402,41.6488411 L166.079273,41.6488411 C165.690343,41.6488411 165.420601,41.3482658 165.420601,40.9871973 L165.420601,34.2774986 C165.420601,32.9535808 164.970823,31.7197726 163.413221,31.7197726 C162.035657,31.7197726 161.316764,32.6819918 161.316764,34.0966493 L161.316764,40.9871973 C161.316764,41.2884027 161.167465,41.6488411 160.687576,41.6488411 L157.392963,41.6488411 C157.033517,41.6488411 156.734292,41.3482658 156.734292,40.9871973 L156.734292,28.4102932 Z" id="Fill-18" fill="#002939"></path>
                                                <polygon id="Fill-20" fill="#FEFEFE" points="17.2875572 20.7742301 13.3123173 26.1915178 13.3123173 30.2779562 17.2875572 24.8612986"></polygon>
                                                <polygon id="Fill-22" fill="#FEFEFE" points="23.0993616 26.1912658 19.1241218 20.7739781 19.1241218 24.8616767 23.0993616 30.2777041"></polygon>
                                                <path d="M17.8855055,16.8512493 L11.9869446,24.8892767 C10.2260959,23.0417151 9.3522583,20.4978521 9.66340221,17.8727014 C10.1577196,13.6980438 13.663107,10.4547288 17.8447306,10.2820712 C22.7527749,10.0791671 26.8101919,14.0313863 26.8101919,18.9174685 C26.8101919,21.164537 25.9507823,23.2880986 24.4245461,24.8892767 L18.5259852,16.8512493 C18.3672768,16.6344822 18.044214,16.6344822 17.8855055,16.8512493" id="Fill-24" fill="#FBB425"></path>
                                                <path d="M25.526786,26.3907041 C27.5184834,24.4246767 28.6463801,21.7522658 28.6463801,18.9179096 C28.6463801,13.1345123 23.9629114,8.42990959 18.2061218,8.42990959 C12.4487048,8.42990959 7.76523616,13.1345123 7.76523616,18.9179096 C7.76523616,21.7522658 8.89313284,24.4246767 10.8848303,26.3907041 L7.34494096,31.2144027 C3.83829889,28.0889233 1.83593727,23.6470877 1.83593727,18.9185397 C1.83593727,9.85149863 9.1791845,2.47511507 18.2061218,2.47511507 C27.2318044,2.47511507 34.5750517,9.85149863 34.5750517,18.9185397 C34.5750517,23.6464575 32.5733173,28.0889233 29.0673026,31.2144027 L25.526786,26.3907041 Z" id="Fill-26" fill="#F26C21"></path>
                                                <polygon id="Fill-28" fill="#8AD0E4" points="3.30615498 39.8259808 6.96272325 34.8434877 6.96272325 39.8259808"></polygon>
                                                <polygon id="Fill-30" fill="#8AD0E4" points="17.2875572 39.8259808 13.9063764 39.8259808 17.2875572 35.2184192"></polygon>
                                                <polygon id="Fill-32" fill="#8AD0E4" points="29.4490185 39.8259808 29.4490185 34.8434877 33.1055867 39.8259808"></polygon>
                                                <polygon id="Fill-34" fill="#8AD0E4" points="19.1238708 35.2181041 22.505679 39.8256658 19.1238708 39.8256658"></polygon>
                                                <path d="M17.2875572,32.1098904 L11.6248635,39.8259178 L8.79884871,39.8259178 L8.79884871,32.3411507 L11.4761919,28.6932877 L11.4761919,34.8976164 C11.6618745,34.6443014 12.0614686,34.776 12.0614686,35.0910685 L17.2875572,27.9698904 L17.2875572,32.1098904 Z" id="Fill-36" fill="#8AD0E4"></path>
                                                <path d="M19.1238708,27.9697014 L24.3499594,35.0915096 C24.5356421,35.3441945 24.9358635,35.2124959 24.9358635,34.8974274 L24.9358635,28.6930986 L27.6132066,32.3409616 L27.6132066,39.8257288 L24.7865646,39.8257288 L19.1238708,32.1097014 L19.1238708,27.9697014 Z" id="Fill-38" fill="#8AD0E4"></path>
                                                <g id="Group-42" transform="translate(0.000000, 0.489868)">
                                                    <mask id="mask-4" fill="white">
                                                        <use xlink:href="#path-3"></use>
                                                    </mask>
                                                    <g id="Clip-41"></g>
                                                    <path d="M19.1238708,20.2843616 L23.0991107,25.7016493 L23.0991107,29.7880877 L19.1238708,24.3714301 L19.1238708,20.2843616 Z M19.1238708,27.4798959 L24.3499594,34.6017041 C24.5356421,34.854389 24.9358635,34.7226904 24.9358635,34.4076219 L24.9358635,28.2032932 L27.6132066,31.8511562 L27.6132066,39.3359233 L24.7865646,39.3359233 L19.1238708,31.6198959 L19.1238708,27.4798959 Z M19.1238708,34.7283616 L22.505679,39.3359233 L19.1238708,39.3359233 L19.1238708,34.7283616 Z M29.4487048,39.3359233 L29.4487048,34.3534301 L33.1059004,39.3359233 L29.4487048,39.3359233 Z M25.526786,25.9007726 C27.5184834,23.9347452 28.6463801,21.2623342 28.6463801,18.4279781 C28.6463801,12.6445808 23.9629114,7.93997808 18.2061218,7.93997808 C12.4487048,7.93997808 7.76523616,12.6445808 7.76523616,18.4279781 C7.76523616,21.2623342 8.89313284,23.9347452 10.8848303,25.9007726 L7.34494096,30.7244712 C3.83829889,27.5989918 1.83593727,23.1571562 1.83593727,18.4286082 C1.83593727,9.36156712 9.1791845,1.98518356 18.2061218,1.98518356 C27.2318044,1.98518356 34.5750517,9.36156712 34.5750517,18.4286082 C34.5750517,23.156526 32.5733173,27.5989918 29.0673026,30.7244712 L25.526786,25.9007726 Z M17.8855683,16.3611288 L11.9870074,24.3991562 C10.2255314,22.5522247 9.35232103,20.0083616 9.66346494,17.383211 C10.1577823,13.2085534 13.6631697,9.96460822 17.8447934,9.79258082 C22.7528376,9.58904658 26.8102546,13.5418959 26.8102546,18.4279781 C26.8102546,20.6744164 25.950845,22.7979781 24.4246089,24.3991562 L18.526048,16.3611288 C18.3673395,16.1449918 18.0442768,16.1449918 17.8855683,16.3611288 Z M17.2877454,24.3714301 L13.3125055,29.7880877 L13.3125055,25.7016493 L17.2877454,20.2843616 L17.2877454,24.3714301 Z M17.2877454,31.6198959 L11.6250517,39.3359233 L8.7990369,39.3359233 L8.7990369,31.8511562 L11.4763801,28.2032932 L11.4763801,34.4076219 C11.4763801,34.7226904 11.8759742,34.854389 12.0616568,34.6017041 L17.2877454,27.4798959 L17.2877454,31.6198959 Z M17.2877454,39.3359233 L13.9065646,39.3359233 L17.2877454,34.7283616 L17.2877454,39.3359233 Z M3.30634317,39.3359233 L6.96228413,34.3534301 L6.96228413,39.3359233 L3.30634317,39.3359233 Z M30.1594428,32.2134849 C34.1365646,28.7326082 36.4118044,23.7431836 36.4118044,18.4286082 C36.4118044,8.34452603 28.2449041,0.140142466 18.2061218,0.140142466 C8.16733948,0.140142466 -0.000188191882,8.34452603 -0.000188191882,18.4286082 C-0.000188191882,23.7431836 2.27505166,28.7326082 6.25217343,32.2134849 L0.138446494,40.5432658 C-0.0547638376,40.8072932 0.132800738,41.1809644 0.459627306,41.1809644 L35.9526162,41.1809644 C36.2788155,41.1809644 36.4663801,40.8072932 36.2725424,40.5432658 L30.1594428,32.2134849 Z" id="Fill-40" fill="#002939" mask="url(#mask-4)"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <img src="assets/images/ads/pepsi/pepsi-zero-sugar-logo.png" alt="Pepsi" class="logo-pepsi">
                    </div>
                    <div class="pepsi-copy">Resort of the Week</div>
                    <!--
                    <audio controls id="myaudio">
                       <source src="assets/audio/pepsi/x.mp3" type="audio/mpeg">
                    </audio>
                    -->
                </div>
                <div class="pepsi-video">
                  <iframe class="abasin" width="640" height="360" src="https://www.youtube.com/embed/8v1EyswwZec?autoplay=1&mute=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border-radius:3px;"></iframe>
                </div>
            </div>    
        

        </div><!-- end pepsi --> 
      `;
      elTarget.insertAdjacentHTML('beforebegin',html);
    }).catch( () => { console.log('Error waiting for checkForResortAds:');});
  }
  checkForAd();
});