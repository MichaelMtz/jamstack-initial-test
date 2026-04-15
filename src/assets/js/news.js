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
    <link rel="canonical" href="${location.href}" />

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

const SNOW_COUNTRY_ORIGIN = 'https://www.snow-country.com';

const resolveSnowCountryUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  const t = raw.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('//')) return `https:${t}`;
  const path = t.replace(/^\/+/, '');
  return `${SNOW_COUNTRY_ORIGIN}/${path}`;
};

const normalizeMediaPathKey = (raw) => {
  const full = resolveSnowCountryUrl(raw);
  try {
    return new URL(full).pathname.replace(/^\/+/, '').toLowerCase();
  } catch {
    return full.toLowerCase();
  }
};

const collectMediaThumbnails = (post) => {
  const list = [];
  const seen = new Set();
  const add = (thumbSrc, fullSrc) => {
    const thumb = resolveSnowCountryUrl(thumbSrc);
    if (!thumb) return;
    let full = fullSrc ? resolveSnowCountryUrl(fullSrc) : thumb;
    if (/b2ap3_thumbnail_/i.test(thumb) && !fullSrc) {
      full = thumb.replace(/b2ap3_thumbnail_/i, '');
    }
    const key = normalizeMediaPathKey(thumb);
    if (seen.has(key)) return;
    seen.add(key);
    list.push({ thumb, full });
  };

  let media;
  try {
    media = typeof post.media === 'string' ? JSON.parse(post.media) : post.media;
  } catch {
    return list;
  }
  if (!media || typeof media !== 'object') return list;

  (Array.isArray(media.images) ? media.images : []).forEach((entry) => {
    if (entry && entry.url) add(entry.url, null);
  });

  (Array.isArray(media.galleries) ? media.galleries : []).forEach((g) => {
    const html = g.html || '';
    const imgRe = /<img\b[^>]*?\bsrc="([^"]+)"/gi;
    let m;
    while ((m = imgRe.exec(html)) !== null) {
      add(m[1], null);
    }
  });

  return list;
};

const createFloatedThumbLink = (item, index) => {
  const a = document.createElement('a');
  const side = index % 2 === 0 ? 'left' : 'right';
  a.className = `post-media-pull post-media-pull--${side}`;
  a.href = item.full;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  const img = document.createElement('img');
  img.src = item.thumb;
  img.alt = '';
  img.setAttribute('loading', 'lazy');
  img.setAttribute('decoding', 'async');
  a.appendChild(img);
  return a;
};

const buildExtraThumbsAside = (thumbs) => {
  if (!thumbs.length) return '';
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const linkItem = (it) =>
    `<a class="post-media-thumb" href="${esc(it.full)}" target="_blank" rel="noopener noreferrer"><img src="${esc(it.thumb)}" alt="" loading="lazy" decoding="async" /></a>`;
  return `<aside class="post-media-extra"><div class="post-media-extra-inner"><h3 class="post-media-extra-title">More photos</h3><div class="post-media-extra-grid">${thumbs.map(linkItem).join('')}</div></div></aside>`;
};

/** Inserts thumbnails into the article so text can wrap (float left / float right). */
const injectFloatedThumbnails = (html, thumbs, maxInArticle = 999) => {
  if (!thumbs.length) return { html, extra: [] };
  const inArticle = thumbs.slice(0, maxInArticle);
  const extra = thumbs.slice(maxInArticle);

  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  const paras = Array.from(wrap.querySelectorAll('p'));
  const n = inArticle.length;
  const m = paras.length;

  const insertAfter = (ref, node) => {
    if (!ref.parentNode) return;
    if (ref.nextSibling) {
      ref.parentNode.insertBefore(node, ref.nextSibling);
    } else {
      ref.parentNode.appendChild(node);
    }
  };

  const paraIndexForThumb = (i) => {
    if (!m) return -1;
    const lastSafeParagraph = m > 1 ? (m - 2) : 0;
    return Math.min(lastSafeParagraph, Math.max(0, Math.floor(((i + 1) * (m + 1)) / (n + 1)) - 1));
  };

  if (m === 0) {
    for (let i = inArticle.length - 1; i >= 0; i--) {
      const thumb = createFloatedThumbLink(inArticle[i], i);
      if (wrap.firstChild) {
        wrap.insertBefore(thumb, wrap.firstChild);
      } else {
        wrap.appendChild(thumb);
      }
    }
    return { html: wrap.innerHTML, extra };
  }

  for (let i = n - 1; i >= 0; i--) {
    const thumb = createFloatedThumbLink(inArticle[i], i);
    insertAfter(paras[paraIndexForThumb(i)], thumb);
  }

  return { html: wrap.innerHTML, extra };
};

const getThumbnailNaturalSize = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || 0,
        height: img.naturalHeight || 0,
      });
    };
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
};

const splitThumbnailsByArticleFit = async (elPost, totalWords, thumbs) => {
  if (!thumbs.length) return { inArticle: [], extra: [] };
  const panelEl = elPost.querySelector('.post-panel');
  const introEl = elPost.querySelector('.intro');
  const panelWidth = panelEl?.clientWidth || 960;
  const introWidth = introEl?.clientWidth || Math.max(320, panelWidth - 8);
  const pullWidth = Math.max(140, Math.floor(introWidth * 0.25));
  const introStyle = window.getComputedStyle(introEl || panelEl || document.body);
  const fontSize = parseFloat(introStyle.fontSize) || 15;
  const computedLineHeight = parseFloat(introStyle.lineHeight);
  const lineHeight = Number.isFinite(computedLineHeight) ? computedLineHeight : Math.round(fontSize * 1.55);
  const avgCharWidth = fontSize * 0.52;
  const avgCharsPerWord = 6;
  const wordsPerLine = Math.max(2.5, (introWidth / avgCharWidth) / avgCharsPerWord);
  const estimatedTextHeight = Math.max(120, (totalWords / wordsPerLine) * lineHeight);
  const maxImageHeightBudget = estimatedTextHeight * 0.95;
  const sizes = await Promise.all(thumbs.map((it) => getThumbnailNaturalSize(it.thumb)));
  const ranked = thumbs.map((thumb, i) => {
    const meta = sizes[i];
    const naturalHeight = meta.height > 0 ? meta.height : 0;
    const ratio = (meta.width > 0 && meta.height > 0) ? (meta.height / meta.width) : 0.66;
    const renderedHeight = Math.round(pullWidth * ratio);
    return { thumb, naturalHeight, renderedHeight, originalIndex: i };
  });
  // Prefer thumbnails with the smallest natural height in the article text.
  ranked.sort((a, b) =>
    a.naturalHeight - b.naturalHeight ||
    a.renderedHeight - b.renderedHeight ||
    a.originalIndex - b.originalIndex
  );

  const selected = [];
  const rejected = [];
  let runningHeight = 0;
  for (let i = 0; i < ranked.length; i++) {
    const item = ranked[i];
    if ((runningHeight + item.renderedHeight) <= maxImageHeightBudget) {
      selected.push(item);
      runningHeight += item.renderedHeight;
    } else {
      rejected.push(item);
    }
  }
  // Keep at least one thumbnail in the story when media exists.
  if (!selected.length && ranked.length) {
    selected.push(ranked[0]);
    for (let i = 1; i < ranked.length; i++) rejected.push(ranked[i]);
  }
  // Leave a little trailing text room to avoid a final dangling inline thumbnail.
  if (selected.length > 1) {
    const tailCandidate = selected.pop();
    if (tailCandidate) {
      rejected.unshift(tailCandidate);
    }
  }
  return {
    inArticle: selected.map((it) => it.thumb),
    extra: rejected.map((it) => it.thumb),
  };
};

const cleanupArticleHtml = (html, thumbKeys) => {
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  wrap.querySelectorAll('.ebd-block[data-type="thumbnails"]').forEach((n) => n.remove());
  if (thumbKeys && thumbKeys.size) {
    wrap.querySelectorAll('img').forEach((img) => {
      const key = normalizeMediaPathKey(img.getAttribute('src') || '');
      if (key && thumbKeys.has(key)) img.remove();
    });
  }
  return wrap.innerHTML;
};

const createPost = async (elPost, post) => {
  const publish = new Date(Date.parse(post.publish_up));
  const params = JSON.parse(post.params);
  const minutesToRead = Math.ceil(params.total_words / 245);
  const title = `
  ${post.title}
  <span class="infoline"> <span class="published"><a href="">${post.author}</a> <i class="material-icons">calendar_month</i> ${publish.toDateString()} </span><span class="read-time"><i class="material-icons">menu_book</i> ${minutesToRead} minutes reading time (${params.total_words} words)</span</span>
  `;
  const titleEl = elPost.querySelector('#title');
  titleEl.innerHTML = title;

  elPost.querySelectorAll('.post-hero').forEach((n) => n.remove());
  if (post.image) {
    const heroAlt = String(post.title || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
    titleEl.insertAdjacentHTML(
      'afterend',
      `<div class="post-hero"><div class="image-container"><img id="post-main-image" src="${post.image}" alt="${heroAlt}" /></div></div>`
    );
  }

  let re = /src="images/gi;
  post.intro = post.intro.replace(re, `src="https://www.snow-country.com/images`);
  re = /href="images/gi;
  post.intro = post.intro.replace(re, `href="https://www.snow-country.com/images`);
  re = /font-family: Arial, sans-serif;/gi;
  post.intro = post.intro.replace(re, '');

  if (post.content) {
    re = /src="images/gi;
    post.content = post.content.replace(re, `src="https://www.snow-country.com/images`);
    re = /href="images/gi;
    post.content = post.content.replace(re, `href="https://www.snow-country.com/images`);
    post.intro = post.intro + post.content;
  }

  const mediaThumbs = collectMediaThumbnails(post);
  const thumbKeys = new Set(mediaThumbs.map((it) => normalizeMediaPathKey(it.thumb)));
  const bodyHtml = cleanupArticleHtml(post.intro, thumbKeys);
  const { inArticle: thumbsForArticle, extra: extraThumbs } = await splitThumbnailsByArticleFit(elPost, params.total_words, mediaThumbs);
  const { html: bodyWithThumbs } = injectFloatedThumbnails(bodyHtml, thumbsForArticle, thumbsForArticle.length);
  const extraAside = buildExtraThumbsAside(extraThumbs);

  elPost.querySelector('.intro').innerHTML = bodyWithThumbs + extraAside;
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
        createPost(elPostMedia.closest('#news-post'),data.post).catch((e) => {
          console.error('Error creating post:', e);
        });
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
});