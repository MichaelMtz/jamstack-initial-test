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
const trackNewsAd = (alt) => {
  if (window.umami) {
    window.umami.track(`SnoNews-ad_${alt}_display`);
  } else {    
    setTimeout(()=> {
      trackNewsAd(alt);
    },1000);
  }
};

const displayNewsAd = () => {
  const ads = [ {
    img: 'Ski Bradford_ad.png',
    href:"http://skibradford.com/",
    width:320, 
    height:250,
    alt: 'Ski Bradford',
    start_date: '2025-01-10',
    end_date: '2025-01-31'
  }];
  const iterResortAd = ads[0];
  if (ads.length > 1) {
    //  
  }
  const alt = iterResortAd.alt.replaceAll(' ', '-'); 
  const html = `
    <div class="resort-ad">
      <a href="${iterResortAd.href}" target="_blank" data-umami-event="SnoNews-ad_${alt}_click">
        <img class="img-resort-ad" src="assets/images/ads/news/${iterResortAd.img}" alt="${iterResortAd.alt}" width="100%"  data-umami-event="SnoNews-ad_${alt}_click">
      </a>
    </div>
  `;
  const sel = '#news-ad';
  waitForElement(sel).then((elNewsAd) => {
    elNewsAd.insertAdjacentHTML('afterbegin', html);
    elNewsAd.classList.add('show');
    trackNewsAd(alt);
  }).catch( () => { console.log('Error waiting for news-ad element:');});
  
};
const createNewsSDL = (post) => {
  const publish = new Date(Date.parse(post.publish_up.replace(/-/g, '/')));
  const publishISODate = publish.toISOString();
  const sdlHTML = `
    <meta property="og:image" content="${post.image}" />
    <script type="application/ld+json">{
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "NewsArticle",
                "headline": "${post.title}",
                "image": {
                    "@type": "ImageObject",
                    "url": "${post.image}"
                },
                "datePublished": "${publishISODate}",
                "dateModified": "${publishISODate}",
                "author": {
                    "@type": "Person",
                    "name": "${post.author}"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "SnoCountry",
                    "url": "https://snocountry.com/",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.snocountry.com/images/snocountry_logo_v2.png"
                    }
                },
                "mainEntityOfPage": "${location.href}"
            },
            {
                "@type": "WebPage",
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "SnoNews",
                            "item": "${location.href}"
                        }
                    ]
                }
            }
        ]
    }</script>
  `;
  document.head.insertAdjacentHTML('beforeend',sdlHTML);
  const newsTitle = `SnoCountry News - ${post.title}`;
  document.querySelector('title').textContent = newsTitle;
  document.querySelector("meta[property='og:title']").setAttribute('content', newsTitle);

  document.querySelector("meta[name='author']").setAttribute('content',post.author);
  document.querySelector("meta[name='rights']").setAttribute('content',`Copyright © ${new Date().getFullYear()}. All Rights Reserved.`);
  
  let metaDescription = JSON.parse(post.params);
  // Remove the following format : (Image via Save Our Canyons Facebook)
  const imageRemoveRegex = /\(Image.*\)/;  
  metaDescription = metaDescription.image_cover_caption.replace(imageRemoveRegex,'');
  document.querySelector("meta[name='description']").setAttribute('content',metaDescription);
  document.querySelector("meta[property='og:description']").setAttribute('content',metaDescription);
  document.querySelector("meta[property='og:url']").setAttribute('content',location.href);
  

  new Date().getFullYear();
};
const createPost = (elPost, post) => {
  const publish = new Date(Date.parse(post.publish_up));
  const params = JSON.parse(post.params);
  const minutesToRead = Math.ceil(params.total_words / 245);
  const title = `
  ${post.title}
  <span class="infoline"> <span class="published"><a href="">${post.author}</a> <i class="material-icons">calendar_month</i> ${publish.toDateString()} </span><span class="read-time"><i class="material-icons">menu_book</i> ${minutesToRead} minutes reading time (${params.total_words} words)</span</span>
  `;
  elPost.querySelector('#title').innerHTML = title;
  
  // Post main image 
  const mainImage = `
  <div class="image-container">
    <img id="post-main-image" src="${post.image}">
  </div>
  `;
  // Intro
  let re = /src="images/gi;
  post.intro = post.intro.replace(re, `src="https://www.snow-country.com/images`);
  re = /href="images/gi;
  post.intro = post.intro.replace(re, `href="https://www.snow-country.com/images`);
  re = /font-family: Arial, sans-serif;/gi;
  post.intro = post.intro.replace(re,'');

  if (post.content) {
    re = /src="images/gi;
    post.content = post.content.replace(re, `src="https://www.snow-country.com/images`);
    re = /href="images/gi;
    post.content = post.content.replace(re, `href="https://www.snow-country.com/images`);
    post.intro = post.intro + post.content;
  }
  elPost.querySelector('.intro').innerHTML = mainImage + post.intro;
  createNewsSDL(post);
};
const getPost = (postID) => {
  
  const localURL = `https://www.snow-country.com/resorts/api-easy-blog-post.php?postID=${postID}`;
  let url = (window.location.hostname !== 'localhost') ? `.netlify/functions/news-post-api?postID=${postID}`: localURL;
  url = localURL;
  fetch(url).then(response => {      
    return response.json();
  }).then(data => {
    _log('--getPost: data');    
    console.log('stories:',data);
    if (data.status) {
      waitForElement('#news-post .intro').then((elPostMedia) => {
        _log('getPost:');
        console.log('post:',data.post);
        createPost(elPostMedia.closest('#news-post'),data.post);
      }).catch( (e) => { console.error('Error waiting for getPost data:',e);});        
    }
    
  }).catch( (e) => { console.error('Error waiting for getPost fetch:',e);});
};

const createPostList = (elPostList, posts) => {
  const html = posts.map(iterPost => `      
    <div class="news-list-post">
      <a href="news-post/${iterPost.eventTitle}/?postID=${iterPost.id}">
        <img src="${iterPost.image}">
        <div class="post-title">${iterPost.title}
        </div>
        <div class="post-info">
          <div class="post-info-author">${iterPost.author}</div>
          <div class="post-info-published">${iterPost.publish_up}</div> 
        </div>
      </a>
    </div> <!-- news-list-post -->

    `).join('');
  elPostList.insertAdjacentHTML('beforeend',html);
};
const getOtherPostList = (postID) => {
  
  const localURL = `https://www.snow-country.com/resorts/api-easy-blog-list.php?notPostID=${postID}`;
  const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/news-list-api?notPostID=${postID}`: localURL;
  
  fetch(url).then(response => {      
    return response.json();
  }).then(data => {
    _log('--getOtherPostList: data');    
    console.log('stories:',data);
    if (data.status) {
      waitForElement('.news-list ').then((elPostList) => {
        _log('getOtherPostList:');
        console.log('post:',data.stories);
        createPostList(elPostList,data.stories);
      }).catch( (e) => { console.error('Error waiting for getOtherPostList data:',e);});        
    }
    
  }).catch( (e) => { console.error('Error waiting for getOtherPostList fetch:',e);});

};
document.addEventListener('DOMContentLoaded',()=> {
  const params = new URLSearchParams(document.location.search);
  const postID = params.get("postID");
  getPost(postID);
  getOtherPostList(postID);
  displayNewsAd();
});