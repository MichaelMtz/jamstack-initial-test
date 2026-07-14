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

  elPost.querySelector('.intro').innerHTML = article.body || '';
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
