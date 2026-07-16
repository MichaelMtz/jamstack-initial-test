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
    if (anchor.matches('a[data-full-image], .post-media-thumb, .post-image-link, .post-tag')) return;
    if (anchor.querySelector('img')) return;
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

  if (!isDone) {
    obs = new MutationObserver(mutationsList => {
      mutationsList.forEach(record => {
        if (record && record.addedNodes && record.addedNodes.length) {
          for (let i = 0; i < record.addedNodes.length; i++) {
            const el = record.addedNodes[i].parentElement;
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
};

const waitForElement = selector => {
  return new Promise(resolve => {
    observeSelector(selector, resolve, { once: true });
  });
};

const resolveMediaUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  const value = raw.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/uploads/') || value.startsWith('uploads/')) {
    return `${NEWSROOM_BASE}${value.startsWith('/') ? value : `/${value}`}`;
  }
  return value.startsWith('/') ? `${NEWSROOM_BASE}${value}` : `${NEWSROOM_BASE}/${value}`;
};

const formatPublishedDate = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const getTagListUrl = (tag) => {
  if (!tag?.slug) return '';
  const params = new URLSearchParams({ tag: tag.slug });
  if (hasText(tag.name)) params.set('name', tag.name);
  if (window.location.hostname === 'localhost') {
    return `news-home/index.html?${params.toString()}`;
  }
  return `news-home/?${params.toString()}`;
};

const getAuthorListUrl = (authorId, authorName) => {
  if (!authorId) return '';
  const params = new URLSearchParams({ author: authorId });
  if (hasText(authorName)) params.set('name', authorName);
  if (window.location.hostname === 'localhost') {
    return `news-home/index.html?${params.toString()}`;
  }
  return `news-home/?${params.toString()}`;
};

const buildPostTagsHtml = (tags) => {
  if (!Array.isArray(tags) || !tags.length) return '';
  const pills = tags
    .filter((tag) => tag?.slug && hasText(tag.name || tag.slug))
    .map((tag) => {
      const label = escapeHtml((tag.name || tag.slug).trim());
      const href = escapeHtml(getTagListUrl(tag));
      return `<a class="post-tag" href="${href}">${label}</a>`;
    });
  if (!pills.length) return '';
  return `<span class="post-tags" aria-label="Article tags">${pills.join('')}</span>`;
};

const buildFigcaptionHtml = (caption, credit) => {
  const inner = buildFigcaptionInnerHtml(caption, credit);
  if (!inner) return '';
  return `<figcaption>${inner}</figcaption>`;
};

const buildFigcaptionInnerHtml = (caption, credit) => {
  const parts = [];
  if (hasText(caption)) {
    parts.push(`<span class="post-image-caption">${escapeHtml(caption.trim())}</span>`);
  }
  if (hasText(credit)) {
    parts.push(`<cite class="post-image-credit">${escapeHtml(credit.trim())}</cite>`);
  }
  return parts.join(' ');
};

const getImageMeta = (img) => {
  let caption = img?.getAttribute('data-caption') || '';
  let credit = img?.getAttribute('data-credit') || '';
  const figure = img?.closest('figure');
  if (figure) {
    const capEl = figure.querySelector('.post-image-caption');
    const credEl = figure.querySelector('.post-image-credit');
    if (!hasText(caption) && capEl) caption = capEl.textContent || '';
    if (!hasText(credit) && credEl) credit = credEl.textContent || '';
  }
  return {
    caption: hasText(caption) ? caption.trim() : '',
    credit: hasText(credit) ? credit.trim() : '',
  };
};

const wrapImgInFigure = (img, caption, credit) => {
  const figcaptionHtml = buildFigcaptionHtml(caption, credit);
  if (!figcaptionHtml) return;

  if (img.closest('figure')) {
    if (!img.parentElement.querySelector('figcaption')) {
      img.insertAdjacentHTML('afterend', figcaptionHtml);
    }
    return;
  }

  const figure = document.createElement('figure');
  figure.className = 'post-figure';
  const floatSide = (img.getAttribute('data-float') || '').toLowerCase();
  if (floatSide === 'left' || floatSide === 'right') {
    figure.classList.add(`post-figure--${floatSide}`);
  }
  const widthAttr = img.getAttribute('width');
  if (widthAttr && /^\d+$/.test(widthAttr)) {
    figure.style.width = `${widthAttr}px`;
    figure.style.maxWidth = '100%';
  }

  img.parentNode.insertBefore(figure, img);
  figure.appendChild(img);
  figure.insertAdjacentHTML('beforeend', figcaptionHtml);
};

const isFluffNode = (node) => {
  if (!node) return true;
  if (node.nodeType === Node.TEXT_NODE) return !node.textContent.trim();
  if (node.nodeType !== Node.ELEMENT_NODE) return true;
  if (!node.matches('p')) return false;
  if (node.querySelector('img')) return false;
  const text = (node.textContent || '').trim();
  if (!text) return true;
  return /^all images\b/i.test(text);
};

const isImageBlockNode = (node) => {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
  if (node.matches('img')) return true;
  if (node.matches('figure') && node.querySelector('img')) return true;
  if (node.matches('a') && node.querySelector(':scope > img') && node.children.length === 1) return true;
  return false;
};

const getImageFromBlock = (node) => {
  if (node.matches('img')) return node;
  return node.querySelector('img');
};

const buildGalleryAside = (items) => {
  if (items.length < 2) return '';
  const linkItem = (it) => {
    const captionAttr = hasText(it.caption) ? ` data-caption="${escapeHtml(it.caption)}"` : '';
    const creditAttr = hasText(it.credit) ? ` data-credit="${escapeHtml(it.credit)}"` : '';
    return `<a class="post-media-thumb" href="${escapeHtml(it.src)}" data-full-image="${escapeHtml(it.src)}"${captionAttr}${creditAttr}><img src="${escapeHtml(it.src)}" alt="${escapeHtml(it.alt)}" loading="lazy" decoding="async" /></a>`;
  };
  return `<aside class="post-media-extra"><div class="post-media-extra-inner"><h3 class="post-media-extra-title">More photos</h3><div class="post-media-extra-grid">${items.map(linkItem).join('')}</div></div></aside>`;
};

/** Pull consecutive trailing body images into a bottom gallery when there are 2+. */
const extractTrailingImageGallery = (container) => {
  const nodes = Array.from(container.childNodes);
  const trailing = [];
  const fluff = [];

  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (isFluffNode(node)) {
      fluff.unshift(node);
      continue;
    }
    if (isImageBlockNode(node)) {
      trailing.unshift(node);
      continue;
    }
    break;
  }

  if (trailing.length < 2) return '';

  [...fluff, ...trailing].forEach((node) => node.remove());

  const items = trailing.map((node) => {
    const img = getImageFromBlock(node);
    const src = resolveMediaUrl(img?.getAttribute('src') || '');
    const meta = getImageMeta(img);
    return {
      src,
      alt: img?.getAttribute('alt') || '',
      caption: meta.caption,
      credit: meta.credit,
    };
  }).filter((it) => it.src);

  return buildGalleryAside(items);
};

const makeImageClickable = (img) => {
  if (!img || img.closest('a[data-full-image]')) return;
  const src = resolveMediaUrl(img.getAttribute('src') || '');
  if (!src) return;

  const anchor = document.createElement('a');
  anchor.href = src;
  anchor.setAttribute('data-full-image', src);
  anchor.className = 'post-image-link';

  const meta = getImageMeta(img);
  if (hasText(meta.caption)) anchor.setAttribute('data-caption', meta.caption);
  if (hasText(meta.credit)) anchor.setAttribute('data-credit', meta.credit);

  const floatSide = (img.getAttribute('data-float') || '').toLowerCase();
  const figure = img.closest('figure.post-figure');
  const figureFloats = figure && (figure.classList.contains('post-figure--left') || figure.classList.contains('post-figure--right'));
  if (!figureFloats && (floatSide === 'left' || floatSide === 'right')) {
    anchor.classList.add(`post-image-link--${floatSide}`);
    const widthAttr = img.getAttribute('width');
    if (widthAttr && /^\d+$/.test(widthAttr)) {
      anchor.style.width = `${widthAttr}px`;
      anchor.style.maxWidth = '100%';
    }
  }

  img.parentNode.insertBefore(anchor, img);
  anchor.appendChild(img);
};

const makeArticleImagesClickable = (elPost) => {
  elPost.querySelectorAll('.post-hero img, .intro img').forEach((img) => {
    if (img.closest('.post-media-extra')) return;
    makeImageClickable(img);
  });
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

const updateModalFigcaption = (modal, item = {}) => {
  const figcaption = modal.querySelector('.news-image-modal__caption');
  if (!figcaption) return;
  const inner = buildFigcaptionInnerHtml(item.caption, item.credit);
  if (!inner) {
    figcaption.innerHTML = '';
    figcaption.hidden = true;
    return;
  }
  figcaption.innerHTML = inner;
  figcaption.hidden = false;
};

const fitModalToImage = (modal, imgEl) => {
  const dialog = modal.querySelector('.news-image-modal__dialog');
  if (!dialog || !imgEl) return;

  const applyFit = () => {
    const captionEl = modal.querySelector('.news-image-modal__caption');
    const captionH = captionEl && !captionEl.hidden ? captionEl.offsetHeight + 12 : 0;
    const { width: maxW, height: maxH } = getModalMaxSize();
    const maxImgH = Math.max(80, maxH - captionH);
    const naturalW = imgEl.naturalWidth;
    const naturalH = imgEl.naturalHeight;
    if (!naturalW || !naturalH) return;

    const scale = Math.min(1, maxW / naturalW, maxImgH / naturalH);
    const displayW = Math.round(naturalW * scale);
    const displayH = Math.round(naturalH * scale);

    dialog.style.width = `${displayW}px`;
    dialog.style.height = `${displayH + captionH}px`;
    dialog.style.maxWidth = `${maxW}px`;
    dialog.style.maxHeight = `${maxH}px`;
    imgEl.style.width = `${displayW}px`;
    imgEl.style.height = `${displayH}px`;
    imgEl.style.maxWidth = `${maxW}px`;
    imgEl.style.maxHeight = `${maxImgH}px`;
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
        <figure class="news-image-modal__figure">
          <img class="news-image-modal__img" src="" alt="" />
          <figcaption class="news-image-modal__caption" hidden></figcaption>
        </figure>
        <button class="news-image-modal__nav news-image-modal__nav--next" type="button" aria-label="Next image" data-nav="1">&#8250;</button>
      </div>
    </div>
    `
  );
  modal = document.getElementById('news-image-modal');
  const imgEl = modal.querySelector('.news-image-modal__img');
  const updateModalImage = () => {
    if (!modalImageList.length || modalImageIndex < 0 || modalImageIndex >= modalImageList.length) return;
    const item = modalImageList[modalImageIndex];
    imgEl.setAttribute('src', item.src);
    imgEl.setAttribute('alt', item.alt || '');
    updateModalFigcaption(modal, item);
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
    imgEl.setAttribute('alt', '');
    updateModalFigcaption(modal, {});
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

const openImageModal = (items, startIndex) => {
  if (!Array.isArray(items) || !items.length) return;
  modalImageList = items;
  modalImageIndex = Math.max(0, Math.min(startIndex || 0, items.length - 1));
  const modal = ensureImageModal();
  const imgEl = modal.querySelector('.news-image-modal__img');
  const item = modalImageList[modalImageIndex];
  imgEl.setAttribute('src', item.src);
  imgEl.setAttribute('alt', item.alt || '');
  updateModalFigcaption(modal, item);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('news-modal-open');
  fitModalToImage(modal, imgEl);
};

const bindImageModal = (elPost) => {
  if (elPost.dataset.modalBound === 'true') return;
  elPost.dataset.modalBound = 'true';
  elPost.addEventListener('click', (evt) => {
    const thumbLink = evt.target.closest('a[data-full-image]');
    if (!thumbLink || !elPost.contains(thumbLink)) return;
    if (evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey || evt.button === 1) return;
    evt.preventDefault();
    const modalThumbs = Array.from(elPost.querySelectorAll('a[data-full-image]'));
    const items = modalThumbs.map((el) => ({
      src: el.getAttribute('data-full-image'),
      alt: el.querySelector('img')?.getAttribute('alt') || '',
      caption: el.getAttribute('data-caption') || '',
      credit: el.getAttribute('data-credit') || '',
    })).filter((it) => it.src);
    const clickedUrl = thumbLink.getAttribute('data-full-image');
    const clickedIndex = Math.max(0, items.findIndex((it) => it.src === clickedUrl));
    openImageModal(items, clickedIndex);
  });
};

const enhanceBodyImages = (html) => {
  const wrap = document.createElement('div');
  wrap.innerHTML = html || '';
  wrap.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src) img.setAttribute('src', resolveMediaUrl(src));
    wrapImgInFigure(img, img.getAttribute('data-caption'), img.getAttribute('data-credit'));
  });
  wrap.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (href && (href.startsWith('/uploads/') || href.startsWith('uploads/'))) {
      anchor.setAttribute('href', resolveMediaUrl(href));
    }
  });
  return wrap.innerHTML;
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
  document.head.insertAdjacentHTML('beforeend', sdlHTML);
  const newsTitle = `SnoCountry News - ${article.title}`;
  document.querySelector('title').textContent = newsTitle;
  document.querySelector("meta[property='og:title']").setAttribute('content', newsTitle);

  document.querySelector("meta[name='author']").setAttribute('content', authorName);
  document.querySelector("meta[name='rights']").setAttribute('content', `Copyright © ${new Date().getFullYear()}. All Rights Reserved.`);

  const metaDescription = article.meta_description || article.excerpt || '';
  document.querySelector("meta[name='description']").setAttribute('content', metaDescription);
  document.querySelector("meta[property='og:description']").setAttribute('content', metaDescription);
  document.querySelector("meta[property='og:url']").setAttribute('content', location.href);
};

const createPost = (elPost, article) => {
  const publish = article.published_at ? new Date(article.published_at) : null;
  const publishLabel = publish && !Number.isNaN(publish.getTime())
    ? publish.toDateString()
    : 'Not yet published';
  const authorName = article.byline_override || article.author_name;
  const wordCount = article.word_count || 0;
  const minutesToRead = article.reading_time || Math.max(1, Math.ceil(wordCount / 245));
  const authorHref = getAuthorListUrl(article.author_id, authorName);
  const authorHtml = authorHref
    ? `<a class="post-author-link" href="${escapeHtml(authorHref)}">${escapeHtml(authorName || '')}</a>`
    : escapeHtml(authorName || '');
  const title = `
  ${article.title}
  <span class="infoline"> <span class="published">${authorHtml} <i class="material-icons">calendar_month</i> ${publishLabel} </span><span class="read-time"><i class="material-icons">menu_book</i> ${minutesToRead} minutes reading time (${wordCount} words)</span></span>
  ${buildPostTagsHtml(article.tags)}
  `;
  const titleEl = elPost.querySelector('#title');
  titleEl.innerHTML = title;

  const featuredImage = resolveMediaUrl(article.featured_image_url);
  elPost.querySelectorAll('.post-hero').forEach((n) => n.remove());
  if (featuredImage) {
    const heroAlt = escapeHtml(article.image_alt || article.title || '');
    const captionAttr = hasText(article.image_caption) ? ` data-caption="${escapeHtml(article.image_caption.trim())}"` : '';
    const creditAttr = hasText(article.image_credit) ? ` data-credit="${escapeHtml(article.image_credit.trim())}"` : '';
    const featuredFigcaption = buildFigcaptionHtml(article.image_caption, article.image_credit);
    const heroImg = `<img id="post-main-image" src="${featuredImage}" alt="${heroAlt}"${captionAttr}${creditAttr} />`;
    const heroInner = featuredFigcaption
      ? `<figure class="post-figure post-figure--hero"><div class="image-container">${heroImg}</div>${featuredFigcaption}</figure>`
      : `<div class="image-container">${heroImg}</div>`;
    titleEl.insertAdjacentHTML('afterend', `<div class="post-hero">${heroInner}</div>`);
  }

  const introEl = elPost.querySelector('.intro');
  introEl.innerHTML = enhanceBodyImages(article.body || '');
  const galleryHtml = extractTrailingImageGallery(introEl);
  if (galleryHtml) introEl.insertAdjacentHTML('beforeend', galleryHtml);
  makeArticleImagesClickable(elPost);
  bindImageModal(elPost);
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
        createPost(elPostMedia.closest('#news-post'), article);
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
      createPost(elPostMedia.closest('#news-post'), article);
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
