const t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e;};
const _log = function (text, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`);};

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
    if (!obs) console.warn(`observeSelector failed to run done():${selector}`);
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

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const configurePepsiBackgroundImages = () => {
  waitForElement('#banner_carousel li.slider-image').then((elMainSlider) => {
    const tellurideImages =  ['view', 'powder', 'chair'];
    const randomIndex = random(0,3);
    const selectedImage = tellurideImages[randomIndex];
    _log(`configurePepsiBackgroundImages: Random image index: ${randomIndex}`);
    elMainSlider.style.backgroundImage = `url("assets/images/ads/pepsi/telluride/Telluride-${selectedImage}.jpg")`;
  }).catch( (e) => { console.error('Error waiting for configurePepsiBacgroundImages fetch:',e);});
  
};

document.addEventListener('DOMContentLoaded',()=> {

  const thrive_carousel_fade = new FadeAnimation();
  const thrive_carousel_loader = new BackgroundLoader();
  
  //thrive.init.ready(function(){
  
  function initBannerScroller() {
    $('#banner_carousel').carousel({
      slideInterval : 8000,
      slideAnimationTime : 300, 
      loaderObject : thrive_carousel_loader,
      animationObject: thrive_carousel_fade,
      transitionClass : 'fade_animate',
      easingType : 'ease-in-back',
      imageLayout : 'stacked', 
      isResponsive : true, 
      scaleImages : 'none',
      randomOrder : false,
      autoSlide : false,
      bullets : 'bullets',
      bulletsActiveClass : 'active'
    });
    $('#banner_carousel #customText').removeClass('hidden');
    $(thrive_carousel_loader).on('slideLoaded.ThriveCarousel', function(e, settings, newSlide, direction){
      $('.pano-loader').hide();
      configurePepsiBackgroundImages();
      return true;
    });
    window.onload = function() {
      $('.pano-loader').hide();
      // var now = new Date().getTime();
      // var page_load_time = now - performance.timing.navigationStart;
      // page_load_time = page_load_time / 1000;
      // page_load_time.toFixed(2);
      // $("#browsertime").html( page_load_time);
    };
  };
  initBannerScroller();
  window.snoCloseNewsProcessing = false;
  const configureXClose = () => {
    observeSelector('.xclose', (elXClose) => {
      elXClose.addEventListener('click',(e) => {
        window.snoCloseNewsProcessing = true;
        _log('configureXClose...');
        e.stopImmediatePropagation();
        e.preventDefault();
        elXClose.closest('li').classList.remove('flipped');
        setTimeout(()=> {
          window.snoCloseNewsProcessing = false;
        },250);
      });
      elXClose.addEventListener('mouseenter',(e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
      });
      elXClose.addEventListener('mouseleave',(e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
      });	
    });
    
    // waitForElement('.xclose').then((elXClose) => {
    //   
    //   
    // }).catch( (e) => { console.error('Error configureXClose:',e);});
  };
  const  createHighlightResortsSection = (elHomepageHighlightResorts,data, key, sel) => {
    if (data.length > 0) {
      const html = data.map(iterResort => `      
        <div class="resort-name"><a class="light-button" href="snow-report${iterResort.snoLink}"> ${iterResort.resortName}, ${iterResort.state}</a></div>
        <div><p class='surface-terrain'>${iterResort[key]}</p></div>
        <div><i class="wi ${iterResort.weatherIcon}" title="${iterResort.weatherTitle}"></i> </div>
        `).join('');
      elHomepageHighlightResorts.insertAdjacentHTML('beforeend',html);
    } else {
      elHomepageHighlightResorts.closest(sel).classList.add('sno-hide');
    }
    
  };
  
  const createTopSnowfallResortsSection = (elHomepageRegion, data) => {
    if (data.length > 0) {
      const html = data.map(iterResort => `      
        <div class="resort-name"><a class="light-button" href="snow-report${iterResort.snoLink}"> ${iterResort.resortName}, ${iterResort.state}</a></div>
        <div><p class='surface-terrain'>${iterResort.ReportDateTime}</p></div>
        <div><p class='surface-terrain'>${iterResort.snowfall}</p></div>
        <div><i class="wi ${iterResort.weatherIcon}" title="${iterResort.weatherTitle}"></i> </div>
        <div><p class='surface-terrain'>${iterResort.baseDepth}</p></div>
        `).join('');
      elHomepageRegion.insertAdjacentHTML('beforeend',html);
    } 
  };
  const createMemberResortsSection = (elHomepageRegion, data) => {
    if (data.length > 0) {
      const html = data.map(iterResort => `      
        <div class="resort-name"><a class="light-button" href="snow-report${iterResort.snoLink}"> ${iterResort.resortName}, ${iterResort.state}</a></div>
        <div><p class='surface-terrain'>${iterResort.ReportDateTime}</p></div>
        <div><p class='surface-terrain'>${iterResort.snowfall}</p></div>
        <div><i class="wi ${iterResort.weatherIcon}" title="${iterResort.weatherTitle}"></i> </div>
        <div><p class='surface-terrain'>${iterResort.SurfacePrimary}</p></div>
        <div><p class='surface-terrain'>${iterResort.baseDepth}</p></div>
        <div><p class='surface-terrain'>${iterResort.OpenDownHillTrails}</p></div>
        `).join('');
      elHomepageRegion.insertAdjacentHTML('beforeend',html);
    } 
  };
  
  const getOpenResorts = () => {
    const localURL = `http://localhost/sno/snoCountryHeadless/snow-reports/headless-home-open-resorts.php`;
    const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/home-open-resorts-api` : localURL;
    
    //_log(`home-open-resorts-api resort: ${url}`);
    fetch(url).then(response => {      
      return response.json();
    }).then(data => {
      // _log('--getOpenResorts: data');    
      // console.log(data);
      waitForElement('#open-resorts-list').then((elHomepageHighlightResorts) => {
        createHighlightResortsSection(elHomepageHighlightResorts,data,'baseDepth', '#open-resorts');
      }).catch( (e) => { console.error('Error waiting for getOpenResorts data:',e);});
      
    }).catch( (e) => { console.error('Error waiting for getOpenResorts fetch:',e);});

  };
  
  const getTopSnowfall = () => {
    const localURL = `http://localhost/sno/snoCountryHeadless/snow-reports/headless-home-top-snowfall.php`;
    const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/home-top-snowfall-api` : localURL;
    
    fetch(url).then(response => {      
      return response.json();
    }).then(data => {
      _log('--getTopsSnowfall: data');    
      console.log(data);
      const fetchOpenResorts = (data.length > 5) ? false : true;
      if (data.length > 0) {
        waitForElement('#top-snowfall-list').then((elHomepageHighlightResorts) => {
          createHighlightResortsSection(elHomepageHighlightResorts,data, 'snowfall','#top-snowfall');
        }).catch( (e) => { console.error('Error waiting for getTopSnowfall data:',e);});
      } 
      if (fetchOpenResorts) {
        getOpenResorts();
      } else {
        waitForElement('#open-resorts').then((elOpenResorts) => {
          elOpenResorts.classList.add('sno-hide');
        }).catch((e) => { console.error('Error waiting for #open-resorts:',e);});
      }
    }).catch( (e) => { console.error('Error waiting for getTopSnowfall fetch:',e);});
  
  };
  

  const populateRegionTopSnowfallSection = (selRegion, topSnowFallData) => {
    const sel = `#${selRegion}-top-snowfall-list`;
    waitForElement(sel).then((elRegionTopSnowfallResorts) => {
      _log('populateRegionTopSnowfallSection: topSnowFallData');
      console.log(topSnowFallData);
      createTopSnowfallResortsSection(elRegionTopSnowfallResorts,topSnowFallData);
    }).catch( (e) => { console.error('Error waiting for getTopSnowfall data:',e);});
  };  
  
  const populateRegionMemberSection = (selRegion, membersData) => {
    const sel = `#${selRegion}-members-list`;
    waitForElement(sel).then((elRegionTopSnowfallResorts) => {
      _log('populateRegionMembersSection: members:');
      console.log(membersData);
      createMemberResortsSection(elRegionTopSnowfallResorts,membersData);
    }).catch( (e) => { console.error('Error waiting for getTopSnowfall data:',e);});
  };  
  const getRegionResorts = () => {
    const localURL = `http://localhost/sno/snoCountryHeadless/snow-reports/headless-home-region-resorts.php`;
    const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/home-region-resorts-api` : localURL;
    
    fetch(url).then(response => {      
      return response.json();
    }).then(data => {
      _log('--getHomePageRegionResorts: data');    
      console.log(data);
      
      Object.keys(data).forEach(iterRegion => {
        populateRegionTopSnowfallSection(iterRegion, data[iterRegion].topsnowfall);
        populateRegionMemberSection(iterRegion,data[iterRegion].members);
      });
      
    }).catch( (e) => { console.error('Error waiting for getTopSnowfall fetch:',e);});
  };
  
  const createStoriesSection = (elStories, posts) => {
    //_log('createStoriesSection: Desktop:');
    const html = posts.map(iterPost => `      

      <div class="deals" style="background:url(${iterPost.image}) no-repeat 50% 0 #f1f1f1;" id="deal-1">
          <div class="deals-content">
              <h6 class="remove-bottom cabin"><span class="small ucase">${iterPost.author}</span><br><strong>${iterPost.title}</strong></h6>
          </div><!-- end deals-content -->
          <div class="deals-desc"> 
              <!-- <a href="news-post/${iterPost.permalink}?postID=${iterPost.id}" class="button readbtn dealClick" > -->
              
              <a href="news-post/?postID=${iterPost.id}" class="button readbtn dealClick" >
              Read...
              </a>
          </div><!-- end desc -->
      </div>
      `).join('');
    elStories.insertAdjacentHTML('afterbegin',html);
  };
  
  const createStoriesSectionMobile = (elMobileStories,posts) => {
    _log('--createStoriesSectionMobile: init');
    const html = posts.map(iterPost => `      
    
      <a href="news-post/?postID=${iterPost.id}" class="card" style="background:url(${iterPost.image}) no-repeat 50% 0 #f1f1f1;" id="deal-1">
          <div class="card-content">
              <h6 class="card-copy"><span class="small ucase">${iterPost.author}</span><br><strong>${iterPost.title}</strong></h6>
          </div>
      </a>
      `).join('');
    elMobileStories.insertAdjacentHTML('beforeend',html);
  };
  const getRecentStories = () => {
    _log('--getRecentStories: init');
    //const localURL = 'http://localhost/sno/snoCountryHeadless/snow-reports/home-page-stories.php';
    const localURL = 'https://www.snow-country.com/resorts/api-easy-blog-list.php';
    const url = (window.location.hostname !== 'localhost') ? ".netlify/functions/home-recent-stories-api": localURL;
    
    fetch(url).then(response => {      
      return response.json();
    }).then(data => {
      _log('--getRecentStories: data');    
      console.log('stories:',data);
      if (data.status) {
        waitForElement('#offers').then((elStories) => {
          _log('getRecentStories: stories:');
          console.log(data.list);
          const storyList = (window.innerWidth >= 1530) ? data.stories : data.stories.slice(0,6);
          createStoriesSection(elStories,storyList);
        }).catch( (e) => { console.error('Error building desktop news:',e);});  
        waitForElement('#mobile-stories .mobile-stories-container').then((elMobileStories) => {
          createStoriesSectionMobile(elMobileStories,data.stories.slice(0,6));
        }).catch( (e) => { console.error('Error building mobile news:',e);});        
      }
      
    }).catch( (e) => { console.error('Error waiting for getRecentStories fetch:',e);});
  };
  

  const configureHomeSnoRadio = () => {
    waitForElement('#sno-radio').then((elRadioFooter) => {
      elRadioFooter.addEventListener('click',() => {
        window.open('https://snow-report.org/SnoCountryRadio/','_blank','width=600, height=600');
      });
    }).catch((e) => { 
      console.error('Error waiting for snoRadio:',e);
    });
  };
  getTopSnowfall();
  getRegionResorts();
  getRecentStories();
  configureXClose();
  configureHomeSnoRadio();
  
  const pageLoadTime = (performance.timing.domContentLoadedEventStart -  performance.timing.navigationStart) / 1000;
  _log(`Home page initialized:  ${pageLoadTime}`);
  
});