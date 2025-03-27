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
    const homePageImages =  [
      'johannes-waibel-WdBQHcIiSIw-unsplash.jpg',
      'john-price-CrVKoYDDJIU-unsplash.jpg',
      'tim-vanderhoydonck-QV58wLRuV6I-unsplash.jpg',
      'mattias-olsson-nQz49efZEFs-unsplash.jpg',
      'robson-hatsukami-morgan-5C6veSN6hec-unsplash.jpg',
      'karsten-winegeart-pCS5YlrskC8-unsplash.jpg',
      'maarten-duineveld-pmfJcN7RGiw-unsplash.jpg',
      'zach-lucero-jYBtuN6aKg0-unsplash.jpg',
      'powder-skier-slashing-alaska.jpg',
    ];
      
    // 'Gondola-1600x1067.jpg', 
    // 'alex-lange-Ca9u0f1nDt0-unsplash.jpg',
    // 'glade-optics-ttGLlNElbCc-unsplash.jpg',
    // 'bradley-king-3m6vbzY69s4-unsplash.jpg',
    // 'luka-senica-G4cwmnaGLRg-unsplash.jpg',
    // 'powder-skier-slashing-alaska.jpg'];
    
    //summer
    //homePageImages = ['daniel-dvorsky-PFbDoh58U64-unsplash.jpg', 'andhika-soreng-US06QF_sxu8-unsplash.jpg'];
    const randomIndex = random(0,homePageImages.length);
    const selectedImage = homePageImages[randomIndex];
    _log(`configurePepsiBackgroundImages: Random image index: ${randomIndex}`);
    elMainSlider.style.backgroundImage = `url("assets/images/homepage/2024-25/${selectedImage}")`;
    //elMainSlider.style.backgroundImage = `url("assets/images/ads/pepsi/telluride/${selectedImage}")`;
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
    } else {
      elHomepageRegion.closest('.region-top-snowfall-container')?.classList.add('sno-hide');
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
    }  else {
      elHomepageRegion.classList.add('sno-hide');
    }
  };
  
  const getOpenResorts = () => {
    const localURL = `http://localhost/sno/snoCountryHeadless/snow-reports/headless-home-open-resorts.php`;
    const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/home-open-resorts-api` : localURL;
    
    _log(`home-open-resorts-api resort: ${url}`);
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
      const fetchOpenResorts = (data.length > 3) ? false : true;
      console.log(fetchOpenResorts);
      if (data.length > 0) {
        waitForElement('#top-snowfall-list').then((elHomepageHighlightResorts) => {
          createHighlightResortsSection(elHomepageHighlightResorts,data, 'snowfall','#top-snowfall');
        }).catch( (e) => { console.error('Error waiting for getTopSnowfall data:',e);});
      } else {
        waitForElement('#top-snowfall').then((elTopSnowContainer) => {
          elTopSnowContainer.classList.add('sno-hide');
        }).catch( (e) => { console.error('Error waiting for getTopSnowfall data:',e);});
          
      }
      waitForElement('#open-resorts').then((elOpenResorts) => {
        elOpenResorts.classList.add('sno-hide');
      }).catch((e) => { console.error('Error waiting for #open-resorts:',e);});
      //getOpenResorts();
      // Only show Open Resorts for early season
      // if (fetchOpenResorts) {
      //   getOpenResorts();
      // } else {
      //   waitForElement('#open-resorts').then((elOpenResorts) => {
      //     elOpenResorts.classList.add('sno-hide');
      //   }).catch((e) => { console.error('Error waiting for #open-resorts:',e);});
      // }
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
    waitForElement(sel).then((elRegionOpenMemberResorts) => {
      _log('populateRegionMembersSection: members:');
      console.log(membersData);
      createMemberResortsSection(elRegionOpenMemberResorts,membersData);
    }).catch( (e) => { console.error('Error waiting for getTopSnowfall data:',e);});
  }; 
  
  const populateRegionPTOSection = (selRegion, ptoData) => {
    const sel = `#${selRegion}-pto-list`;
    waitForElement(sel).then((elRegionPTOResorts) => {
      if (ptoData.length > 0) {
        const html = ptoData.map(iterResort => `      
          <div class="resort-name"><a class="light-button" href="snow-report${iterResort.snoLink}"> ${iterResort.resortName}, ${iterResort.state}</a></div>
          <div class="region-reportdatetime"><p class='surface-terrain'>${iterResort.ReportDateTime}</p></div>
          <div class="region-os"><p class='surface-terrain'>${iterResort.OperatingStatus}</p></div>
          <div class="region-weather-icon"><i class="wi ${iterResort.weatherIcon}" title="${iterResort.weatherTitle}"></i> </div>
          <div class="region-weather"><p class='surface-terrain'>${iterResort.temperatureLow} - ${iterResort.temperatureHigh}˚</p></div>

          `).join('');
        elRegionPTOResorts.insertAdjacentHTML('beforeend',html);
        elRegionPTOResorts.classList.remove('sno-hide');
      }  else {
        elRegionPTOResorts.classList.add('sno-hide');
      }
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
        populateRegionPTOSection(iterRegion,data[iterRegion].pto);
      });
      
    }).catch( (e) => { console.error('Error waiting for getTopSnowfall fetch:',e);});
  };
  const getMtnLifePosts = () => {
    const howToPosts = [
      {
        "url": "https://snocountry.com/mountain-life/how-to/advanced-level-ski-snowboard-lessons/",
        "image": "https://www.snocountry.com/assets/images/mountain-life/how-to/ski-school-moguls.jpg",
        "title": "Ski School: Not Just for Beginners",
        "author": "Josh Petit",
        "umami": "mountain-life-how-to-advanced-ski-snowboard-lesson"
      }
      // {
      //   "url": "https://snocountry.com/mountain-life/how-to/preparing-your-snowboard-for-winter",
      //   "image": "https://snocountry.com/assets/images/mountain-life/how-to/adjust-bindings-1024w.png",
      //   "title": "How-To Prep your snowboard for winter",
      //   "author": "Josh Petit",
      //   "umami": "how-to-prep-snowboard-for-winter"
      // }, {
      //   "url": "https://snocountry.com/mountain-life/how-to/preparing-your-skis-for-winter/",
      //   "image": "https://snocountry.com/assets/images/mountain-life/how-to/ski-how-to-inspecting-1024w.png",
      //   "title": "How-To Prep your skis for winter",
      //   "author": "Josh Petit",
      //   "umami": "how-to-prep-skis-for-winter"
      // }
    ];
    
    const howToHTML = howToPosts.map(iterPost => `      
    
    <div class="deals" style="background:url(${iterPost.image}) no-repeat 50% 0 #f1f1f1;" id="deal-1">
        <div class="deals-content">
            <h6 class="remove-bottom cabin"><span class="small ucase">${iterPost.author}</span><br><strong>${iterPost.title}</strong></h6>
        </div><!-- end deals-content -->
        <div class="deals-desc"> 
            <a href="${iterPost.url}" class="button readbtn dealClick" data-umami-event="${iterPost.umami}" >
            Read...
            </a>
        </div><!-- end desc -->
    </div>
    `).join('');
    
    return howToHTML;
  };
  const getMtnLifePostsMobile = () => {
    const howToPosts = [
      {
        "url": "https://snocountry.com/mountain-life/how-to/advanced-level-ski-snowboard-lessons/",
        "image": "https://www.snocountry.com/assets/images/mountain-life/how-to/ski-school-moguls.jpg",
        "title": "Ski School: Not Just for Beginners",
        "author": "Josh Petit",
        "umami": "mountain-life-how-to-advanced-ski-snowboard-lesson"
      }
      // {
      //   "url": "https://snocountry.com/mountain-life/how-to/preparing-your-snowboard-for-winter",
      //   "image": "https://snocountry.com/assets/images/mountain-life/how-to/adjust-bindings-1024w.png",
      //   "title": "How-To Prep your snowboard for winter",
      //   "author": "Josh Petit",
      //   "umami": "how-to-prep-snowboard-for-winter"
      // }, {
      //   "url": "https://snocountry.com/mountain-life/how-to/preparing-your-skis-for-winter/",
      //   "image": "https://snocountry.com/assets/images/mountain-life/how-to/ski-how-to-inspecting-1024w.png",
      //   "title": "How-To Prep your skis for winter",
      //   "author": "Josh Petit",
      //   "umami": "how-to-prep-skis-for-winter"
      // }
    ];
    const howToHTML = howToPosts.map(iterPost => `      
    <a href="${iterPost.url}" class="card" data-umami-event="${iterPost.umami}" style="background:url(${iterPost.image}) no-repeat 50% 0 #f1f1f1;" id="deal-1">
        <div class="card-content">
            <h6 class="card-copy"><span class="small ucase">${iterPost.author}</span><br><strong>${iterPost.title}</strong></h6>
        </div>
    </a>
    `).join('');
    
    return howToHTML;

  };
  const createStoriesSection = (elStories, posts) => {
    //_log('createStoriesSection: Desktop:');
    const html = posts.map(iterPost => `      

      <div class="deals" style="background:url(${iterPost.image}) no-repeat 50% 0 #f1f1f1;" id="deal-1">
          <div class="deals-content">
              <h6 class="remove-bottom cabin"><span class="small ucase">${iterPost.author}</span><br><strong>${iterPost.title}</strong></h6>
          </div><!-- end deals-content -->
          <div class="deals-desc"> 
              <a href="news-post/${iterPost.eventTitle}/?postID=${iterPost.id}" class="button readbtn dealClick" data-umami-event="news-article-${iterPost.eventTitle}" >
              Read...
              </a>
          </div><!-- end desc -->
      </div>
      
      `).join('');

    elStories.insertAdjacentHTML('afterbegin',getMtnLifePosts() + html);
    //elStories.insertAdjacentHTML('afterbegin', html);
  };
  
  const createStoriesSectionMobile = (elMobileStories,posts) => {
    _log('--createStoriesSectionMobile: init');
    const html = posts.map(iterPost => `      
    
      <a href="news-post/${iterPost.eventTitle}/?postID=${iterPost.id}" class="card" style="background:url(${iterPost.image}) no-repeat 50% 0 #f1f1f1;" id="deal-1">
          <div class="card-content">
              <h6 class="card-copy"><span class="small ucase">${iterPost.author}</span><br><strong>${iterPost.title}</strong></h6>
          </div>
      </a>
      `).join('');
      
    elMobileStories.insertAdjacentHTML('beforeend',getMtnLifePostsMobile() + html);
    //elMobileStories.insertAdjacentHTML('beforeend', html);
  };
  const getRecentStories = () => {
    _log('--getRecentStories: init');
    //const localURL = 'http://localhost/sno/snoCountryHeadless/snow-reports/home-page-stories.php';
    const localURL = 'https://www.snow-country.com/resorts/api-easy-blog-list.php';
    let url = (window.location.hostname !== 'localhost') ? ".netlify/functions/home-recent-stories-api": localURL;
    url = localURL;
    fetch(url).then(response => {      
      return response.json();
    }).then(data => {
      _log('--getRecentStories: data');    
      console.log('stories:',data);
      if (data.status) {
        waitForElement('#offers').then((elStories) => {
          _log('getRecentStories: stories:',data.stories);
          console.log(data.list);
          const storyList = (window.innerWidth >= 1530) ? data.stories.slice(0,9) : data.stories.slice(0,6);
          createStoriesSection(elStories,storyList);
        }).catch( (e) => { console.error('Error building desktop news:',e);});  
        waitForElement('#mobile-stories .mobile-stories-container').then((elMobileStories) => {
          createStoriesSectionMobile(elMobileStories,data.stories.slice(0,9));
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