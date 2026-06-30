const t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e;};
const _log = function (text, param, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`, param);};

const NEWSROOM_API = 'https://newsroom.snow-report.org/api/v1/articles';
const NEWSROOM_BASE = 'https://newsroom.snow-report.org';
const NEWSROOM_PREVIEW_API = `${NEWSROOM_BASE}/api/v1/preview/articles`;
const SIDEBAR_ARTICLE_COUNT = 8;
const ARTICLE_LINK_STYLE = 'color:#3f7d9e;text-decoration:underline';

const styleArticleLinks = (root) => {
  if (!root) return;
  root.querySelectorAll('a[href]').forEach((anchor) => {
    anchor.setAttribute('style', ARTICLE_LINK_STYLE);
  });
};

const getArticleUrl = (slug) => {
  const encodedSlug = encodeURIComponent(slug);
  if (window.location.hostname === 'localhost') {
    return `article/index.html?slug=${encodedSlug}`;
  }
  return `news-post/${slug}/?slug=${encodedSlug}`;
};

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


const createNewsSDL = (article) => {
  const publish = article.published_at ? new Date(article.published_at) : null;
  const publishISODate = publish && !Number.isNaN(publish.getTime())
    ? publish.toISOString()
    : (article.updated_at ? new Date(article.updated_at).toISOString() : new Date().toISOString());
  const imageUrl = resolveMediaUrl(article.featured_image_url);
  const authorName = article.byline_override || article.author_name;
  const sdlHTML = `
    <meta property="og:image" content="${imageUrl}" />
    <script type="application/ld+json">{
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "NewsArticle",
                "headline": "${article.title}",
                "image": {
                    "@type": "ImageObject",
                    "url": "${imageUrl}"
                },
                "datePublished": "${publishISODate}",
                "dateModified": "${publishISODate}",
                "author": {
                    "@type": "Person",
                    "name": "${authorName}"
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
  const newsTitle = `SnoCountry News - ${article.title}`;
  document.querySelector('title').textContent = newsTitle;
  document.querySelector("meta[property='og:title']").setAttribute('content', newsTitle);

  document.querySelector("meta[name='author']").setAttribute('content', authorName);
  document.querySelector("meta[name='rights']").setAttribute('content',`Copyright © ${new Date().getFullYear()}. All Rights Reserved.`);

  const metaDescription = article.meta_description || article.excerpt || '';
  document.querySelector("meta[name='description']").setAttribute('content', metaDescription);
  document.querySelector("meta[property='og:description']").setAttribute('content', metaDescription);
  document.querySelector("meta[property='og:url']").setAttribute('content', location.href);
};

const SNOW_COUNTRY_ORIGIN = 'https://www.snow-country.com';

const resolveMediaUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  const value = raw.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/uploads/') || value.startsWith('uploads/')) {
    return `${NEWSROOM_BASE}${value.startsWith('/') ? value : `/${value}`}`;
  }
  const path = value.replace(/^\/+/, '');
  return `${SNOW_COUNTRY_ORIGIN}/${path}`;
};

const resolveSnowCountryUrl = (raw) => resolveMediaUrl(raw);

const normalizeMediaPathKey = (raw) => {
  const full = resolveSnowCountryUrl(raw);
  try {
    return new URL(full).pathname.replace(/^\/+/, '').toLowerCase();
  } catch {
    return full.toLowerCase();
  }
};

const collectBodyImages = (html) => {
  const list = [];
  const seen = new Set();
  const wrap = document.createElement('div');
  wrap.innerHTML = html || '';
  wrap.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (!src) return;
    const full = resolveMediaUrl(src);
    const key = normalizeMediaPathKey(full);
    if (seen.has(key)) return;
    seen.add(key);
    list.push({ thumb: full, full });
  });
  return list;
};

const normalizeArticleBody = (html) => {
  if (!html) return '';
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  wrap.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src) img.setAttribute('src', resolveMediaUrl(src));
  });
  wrap.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (href && (href.startsWith('/uploads/') || href.startsWith('uploads/'))) {
      anchor.setAttribute('href', resolveMediaUrl(href));
    }
  });
  return wrap.innerHTML.replace(/font-family: Arial, sans-serif;/gi, '');
};

const formatPublishedDate = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const createFloatedThumbLink = (item, index) => {
  const a = document.createElement('a');
  const side = index % 2 === 0 ? 'left' : 'right';
  a.className = `post-media-pull post-media-pull--${side}`;
  a.href = item.full;
  a.setAttribute('data-full-image', item.full);
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
    `<a class="post-media-thumb" href="${esc(it.full)}" data-full-image="${esc(it.full)}"><img src="${esc(it.thumb)}" alt="" loading="lazy" decoding="async" /></a>`;
  return `<aside class="post-media-extra"><div class="post-media-extra-inner"><h3 class="post-media-extra-title">More photos</h3><div class="post-media-extra-grid">${thumbs.map(linkItem).join('')}</div></div></aside>`;
};

let modalImageList = [];
let modalImageIndex = -1;
const MODAL_VIEWPORT_PADDING = 48;

const getModalMaxSize = () => ({
  width: Math.max(120, window.innerWidth - MODAL_VIEWPORT_PADDING),
  height: Math.max(120, window.innerHeight - MODAL_VIEWPORT_PADDING),
});

const resetModalLayout = (modal) => {
  const dialog = modal.querySelector('.news-image-modal__dialog');
  const imgEl = modal.querySelector('.news-image-modal__img');
  if (dialog) dialog.removeAttribute('style');
  if (imgEl) imgEl.removeAttribute('style');
};

const fitModalToImage = (modal, imgEl) => {
  const dialog = modal.querySelector('.news-image-modal__dialog');
  if (!dialog || !imgEl) return;

  const applyFit = () => {
    const { width: maxW, height: maxH } = getModalMaxSize();
    const naturalW = imgEl.naturalWidth;
    const naturalH = imgEl.naturalHeight;
    if (!naturalW || !naturalH) return;

    const scale = Math.min(1, maxW / naturalW, maxH / naturalH);
    const displayW = Math.round(naturalW * scale);
    const displayH = Math.round(naturalH * scale);

    dialog.style.width = `${displayW}px`;
    dialog.style.height = `${displayH}px`;
    dialog.style.maxWidth = `${maxW}px`;
    dialog.style.maxHeight = `${maxH}px`;
    imgEl.style.width = `${displayW}px`;
    imgEl.style.height = `${displayH}px`;
    imgEl.style.maxWidth = `${maxW}px`;
    imgEl.style.maxHeight = `${maxH}px`;
  };

  if (imgEl.complete && imgEl.naturalWidth) {
    applyFit();
    return;
  }

  imgEl.onload = () => {
    applyFit();
    imgEl.onload = null;
  };
};

const ensureImageModal = () => {
  let modal = document.getElementById('news-image-modal');
  if (modal) return modal;
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div id="news-image-modal" class="news-image-modal" aria-hidden="true">
      <div class="news-image-modal__backdrop" data-close-modal="true"></div>
      <div class="news-image-modal__dialog" role="dialog" aria-modal="true" aria-label="Expanded image">
        <button class="news-image-modal__nav news-image-modal__nav--prev" type="button" aria-label="Previous image" data-nav="-1">&#8249;</button>
        <button class="news-image-modal__close" type="button" aria-label="Close image" data-close-modal="true">&times;</button>
        <img class="news-image-modal__img" src="" alt="" />
        <button class="news-image-modal__nav news-image-modal__nav--next" type="button" aria-label="Next image" data-nav="1">&#8250;</button>
      </div>
    </div>
    `
  );
  modal = document.getElementById('news-image-modal');
  const imgEl = modal.querySelector('.news-image-modal__img');
  const updateModalImage = () => {
    if (!modalImageList.length || modalImageIndex < 0 || modalImageIndex >= modalImageList.length) return;
    imgEl.setAttribute('src', modalImageList[modalImageIndex]);
    fitModalToImage(modal, imgEl);
  };
  const stepModalImage = (step) => {
    if (!modalImageList.length) return;
    modalImageIndex = (modalImageIndex + step + modalImageList.length) % modalImageList.length;
    updateModalImage();
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('news-modal-open');
    imgEl.setAttribute('src', '');
    resetModalLayout(modal);
    modalImageList = [];
    modalImageIndex = -1;
  };
  modal.addEventListener('click', (evt) => {
    if (evt.target.closest('[data-close-modal="true"]')) {
      closeModal();
      return;
    }
    const navBtn = evt.target.closest('[data-nav]');
    if (navBtn) {
      const step = Number(navBtn.getAttribute('data-nav')) || 0;
      if (step) stepModalImage(step);
    }
  });
  window.addEventListener('keydown', (evt) => {
    if (!modal.classList.contains('is-open')) return;
    if (evt.key === 'Escape') {
      closeModal();
      return;
    }
    if (evt.key === 'ArrowRight') {
      evt.preventDefault();
      stepModalImage(1);
      return;
    }
    if (evt.key === 'ArrowLeft') {
      evt.preventDefault();
      stepModalImage(-1);
      return;
    }
    if (evt.key === 'Home') {
      evt.preventDefault();
      if (!modalImageList.length) return;
      modalImageIndex = 0;
      updateModalImage();
      return;
    }
    if (evt.key === 'End') {
      evt.preventDefault();
      if (!modalImageList.length) return;
      modalImageIndex = modalImageList.length - 1;
      updateModalImage();
    }
  });
  window.addEventListener('resize', () => {
    if (!modal.classList.contains('is-open') || !imgEl.getAttribute('src')) return;
    fitModalToImage(modal, imgEl);
  });
  return modal;
};

const openImageModal = (urls, startIndex) => {
  if (!Array.isArray(urls) || !urls.length) return;
  modalImageList = urls;
  modalImageIndex = Math.max(0, Math.min(startIndex || 0, urls.length - 1));
  const modal = ensureImageModal();
  const imgEl = modal.querySelector('.news-image-modal__img');
  imgEl.setAttribute('src', modalImageList[modalImageIndex]);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('news-modal-open');
  fitModalToImage(modal, imgEl);
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

const createPost = async (elPost, article) => {
  const publish = article.published_at ? new Date(article.published_at) : null;
  const publishLabel = publish && !Number.isNaN(publish.getTime())
    ? publish.toDateString()
    : 'Not yet published';
  const authorName = article.byline_override || article.author_name;
  const wordCount = article.word_count || 0;
  const minutesToRead = article.reading_time || Math.max(1, Math.ceil(wordCount / 245));
  const title = `
  ${article.title}
  <span class="infoline"> <span class="published"><a href="">${authorName}</a> <i class="material-icons">calendar_month</i> ${publishLabel} </span><span class="read-time"><i class="material-icons">menu_book</i> ${minutesToRead} minutes reading time (${wordCount} words)</span</span>
  `;
  const titleEl = elPost.querySelector('#title');
  titleEl.innerHTML = title;

  const featuredImage = resolveMediaUrl(article.featured_image_url);
  elPost.querySelectorAll('.post-hero').forEach((n) => n.remove());
  if (featuredImage) {
    const heroAlt = String(article.image_alt || article.title || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
    titleEl.insertAdjacentHTML(
      'afterend',
      `<div class="post-hero"><div class="image-container"><img id="post-main-image" src="${featuredImage}" alt="${heroAlt}" /></div></div>`
    );
  }

  const bodyHtml = normalizeArticleBody(article.body);
  const mediaThumbs = collectBodyImages(article.body);
  const thumbKeys = new Set(mediaThumbs.map((it) => normalizeMediaPathKey(it.thumb)));
  const cleanedBodyHtml = cleanupArticleHtml(bodyHtml, thumbKeys);
  const { inArticle: thumbsForArticle, extra: extraThumbs } = await splitThumbnailsByArticleFit(elPost, wordCount, mediaThumbs);
  const { html: bodyWithThumbs } = injectFloatedThumbnails(cleanedBodyHtml, thumbsForArticle, thumbsForArticle.length);
  const extraAside = buildExtraThumbsAside(extraThumbs);

  elPost.querySelector('.intro').innerHTML = bodyWithThumbs + extraAside;
  const introEl = elPost.querySelector('.intro');
  if (!introEl.dataset.modalBound) {
    introEl.dataset.modalBound = 'true';
    introEl.addEventListener('click', (evt) => {
      const thumbLink = evt.target.closest('a[data-full-image]');
      if (!thumbLink) return;
      if (evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey || evt.button === 1) return;
      evt.preventDefault();
      const modalThumbs = Array.from(introEl.querySelectorAll('a[data-full-image]'));
      const urls = modalThumbs.map((el) => el.getAttribute('data-full-image')).filter(Boolean);
      const clickedUrl = thumbLink.getAttribute('data-full-image');
      const clickedIndex = Math.max(0, urls.indexOf(clickedUrl));
      openImageModal(urls, clickedIndex);
    });
  }
  createNewsSDL(article);
  styleArticleLinks(elPost);
};
const getPost = (slug) => {
  if (!slug) return;

  const url = `${NEWSROOM_API}/${encodeURIComponent(slug)}`;
  fetch(url).then(response => {
    return response.json();
  }).then(data => {
    _log('--getPost: data');
    console.log('article:', data);
    const article = data.data;
    if (article) {
      waitForElement('#news-post .intro').then((elPostMedia) => {
        _log('getPost:');
        console.log('article:', article);
        createPost(elPostMedia.closest('#news-post'), article).catch((e) => {
          console.error('Error creating post:', e);
        });
      }).catch((e) => { console.error('Error waiting for getPost data:', e); });
    }
  }).catch((e) => { console.error('Error waiting for getPost fetch:', e); });
};

const showPreviewError = (message) => {
  waitForElement('#news-post .intro').then((elIntro) => {
    elIntro.innerHTML = `<p class="news-preview-error">${message}</p>`;
  }).catch((e) => { console.error('Error showing preview message:', e); });
};

const getPreviewPost = (slug, previewToken) => {
  if (!slug || !previewToken) {
    showPreviewError('This preview link is invalid. A slug and preview token are required.');
    return;
  }

  const url = `${NEWSROOM_PREVIEW_API}/${encodeURIComponent(slug)}?token=${encodeURIComponent(previewToken)}`;
  fetch(url).then(response => {
    return response.json().then((data) => ({ ok: response.ok, data }));
  }).then(({ ok, data }) => {
    _log('--getPreviewPost: data');
    console.log('preview article:', data);
    const article = data.data;
    if (!ok || !article) {
      showPreviewError(data.message || data.error || 'This preview link is invalid or has expired.');
      return;
    }
    waitForElement('#news-post .intro').then((elPostMedia) => {
      createPost(elPostMedia.closest('#news-post'), article).catch((e) => {
        console.error('Error creating preview post:', e);
      });
    }).catch((e) => { console.error('Error waiting for getPreviewPost data:', e); });
  }).catch((e) => {
    console.error('Error waiting for getPreviewPost fetch:', e);
    showPreviewError('Unable to load this preview. Please try again later.');
  });
};

const createPostList = (elPostList, posts) => {
  const html = posts.map(iterPost => `      
    <div class="news-list-post">
      <a href="${getArticleUrl(iterPost.slug)}">
        <img src="${resolveMediaUrl(iterPost.featured_image_url)}" alt="${iterPost.title}">
        <div class="post-title">${iterPost.title}
        </div>
        <div class="post-info">
          <div class="post-info-author">${iterPost.author_name}</div>
          <div class="post-info-published">${formatPublishedDate(iterPost.published_at)}</div> 
        </div>
      </a>
    </div> <!-- news-list-post -->

    `).join('');
  elPostList.insertAdjacentHTML('beforeend', html);
  styleArticleLinks(elPostList);
};
const getOtherPostList = (currentSlug) => {
  const url = `${NEWSROOM_API}?per_page=${SIDEBAR_ARTICLE_COUNT + 1}`;

  fetch(url).then(response => {
    return response.json();
  }).then(data => {
    _log('--getOtherPostList: data');
    console.log('articles:', data);
    const posts = (data.data || []).filter((iterPost) => iterPost.slug !== currentSlug).slice(0, SIDEBAR_ARTICLE_COUNT);
    if (posts.length) {
      waitForElement('.news-list ').then((elPostList) => {
        _log('getOtherPostList:');
        console.log('posts:', posts);
        createPostList(elPostList, posts);
      }).catch((e) => { console.error('Error waiting for getOtherPostList data:', e); });
    }
  }).catch((e) => { console.error('Error waiting for getOtherPostList fetch:', e); });
};
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(document.location.search);
  const slug = params.get('slug');

  if (document.body.dataset.source === 'news-preview') {
    getPreviewPost(slug, params.get('preview_token'));
    if (slug) getOtherPostList(slug);
    return;
  }

  getPost(slug);
  getOtherPostList(slug);
});