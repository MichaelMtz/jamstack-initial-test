const t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e;};
const _log = function (text, param, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`, param);};

const NEWSROOM_API = 'https://newsroom.snow-report.org/api/v1/articles';
const NEWSROOM_AUTHORS_API = 'https://newsroom.snow-report.org/api/v1/authors';
const NEWSROOM_BASE = 'https://newsroom.snow-report.org';
const ARTICLES_PER_PAGE = 20;

const getArticleUrl = (slug) => {
  const encodedSlug = encodeURIComponent(slug);
  if (window.location.hostname === 'localhost') {
    return `article/index.html?slug=${encodedSlug}`;
  }
  return `news-post/${slug}/?slug=${encodedSlug}`;
};

const waitForElement = (selector) => {
  return new Promise(function (resolve, reject) {
    const element = document.querySelector(selector);

    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const nodes = Array.from(mutation.addedNodes);
        for (const node of nodes) {
          if (node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
};

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${NEWSROOM_BASE}${url.startsWith('/') ? url : `/${url}`}`;
};

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const formatPublishedDate = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTagLabel = (slug, name) => {
  if (name && String(name).trim()) return String(name).trim();
  if (!slug) return '';
  return String(slug)
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const getAuthorDisplayName = (author = {}) => {
  return author.display_name || author.name || window.snoNewsAuthorName || 'Author';
};

const getAuthorInitials = (name) => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return '?';
  return parts.map((part) => part.charAt(0).toUpperCase()).join('');
};

const buildNewsHomeHref = ({ cursor, tag, author } = {}) => {
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (window.snoNewsTagName && tag) params.set('name', window.snoNewsTagName);
  if (author) params.set('author', author);
  if (window.snoNewsAuthorName && author) params.set('name', window.snoNewsAuthorName);
  if (cursor) params.set('cursor', cursor);
  if (window.snoTestNextPage) params.set('test-next-page', 'yes');
  const query = params.toString();
  return query ? `news-home/?${query}` : 'news-home/';
};

const updateDocumentMeta = (titleSuffix, description) => {
  document.title = `SnoCountry News - ${titleSuffix}`;
  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) metaDescription.setAttribute('content', description);
  const ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle) ogTitle.setAttribute('content', `SnoCountry News - ${titleSuffix}`);
};

const updateListHeader = () => {
  const header = document.querySelector('.news-list-header');
  if (!header) return;

  if (window.snoNewsAuthor) {
    const label = getAuthorDisplayName({ name: window.snoNewsAuthorName });
    header.innerHTML = `Articles by <span class="news-author-label">${escapeHtml(label)}</span>`;
    updateDocumentMeta(label, `Ski and snowboarding articles by ${label} from SnoCountry.`);
    return;
  }

  if (window.snoNewsTag) {
    const label = formatTagLabel(window.snoNewsTag, window.snoNewsTagName);
    header.innerHTML = `Articles tagged <span class="news-tag-label">${escapeHtml(label)}</span>`;
    updateDocumentMeta(label, `Ski and snowboarding articles tagged ${label} from SnoCountry.`);
    return;
  }

  header.textContent = 'Ski Industry News';
};

const renderAuthorByline = (author) => {
  const bylineEl = document.getElementById('author-byline');
  if (!bylineEl) return;

  if (!author) {
    bylineEl.hidden = true;
    bylineEl.innerHTML = '';
    return;
  }

  const displayName = getAuthorDisplayName(author);
  window.snoNewsAuthorName = displayName;
  const byline = author.byline || '';
  const bio = author.bio_short || author.bio_long || '';
  const avatarUrl = resolveImageUrl(author.avatar_url);
  const mediaHtml = avatarUrl
    ? `<img class="author-byline__avatar" src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(displayName)}" />`
    : `<div class="author-byline__avatar author-byline__avatar--initials" aria-hidden="true">${escapeHtml(getAuthorInitials(displayName))}</div>`;

  bylineEl.innerHTML = `
    <div class="author-byline__media">${mediaHtml}</div>
    <div class="author-byline__content">
      <p class="author-byline__eyebrow">Author</p>
      <h2 class="author-byline__name">${escapeHtml(displayName)}</h2>
      ${byline ? `<p class="author-byline__role">${escapeHtml(byline)}</p>` : ''}
      ${bio ? `<p class="author-byline__bio">${escapeHtml(bio)}</p>` : ''}
    </div>
  `;
  bylineEl.hidden = false;
  updateListHeader();
};

const loadAuthorProfile = () => {
  if (!window.snoNewsAuthor) {
    renderAuthorByline(null);
    return Promise.resolve(null);
  }

  const url = `${NEWSROOM_AUTHORS_API}/${encodeURIComponent(window.snoNewsAuthor)}`;
  _log('--loadAuthorProfile: url:', url);

  return fetch(url)
    .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
    .then(({ ok, data }) => {
      const author = ok ? data.data : null;
      if (author) {
        renderAuthorByline(author);
        return author;
      }
      renderAuthorByline({
        id: window.snoNewsAuthor,
        name: window.snoNewsAuthorName || 'Author',
      });
      return null;
    })
    .catch((e) => {
      console.error('Error fetching author profile:', e);
      renderAuthorByline({
        id: window.snoNewsAuthor,
        name: window.snoNewsAuthorName || 'Author',
      });
      return null;
    });
};

const updateNextPageLink = (nextCursor) => {
  const nextPageEl = document.getElementById('next-page');
  if (!nextPageEl) return;

  if (nextCursor) {
    nextPageEl.href = buildNewsHomeHref({
      cursor: nextCursor,
      tag: window.snoNewsTag,
      author: window.snoNewsAuthor,
    });
    nextPageEl.style.display = '';
  } else {
    nextPageEl.style.display = 'none';
  }
};

const setLoadingState = (isLoading) => {
  const loadingIndicator = document.getElementById('loading');
  if (!loadingIndicator) return;
  loadingIndicator.classList.toggle('show', isLoading);
};

const createPostList = (elPostList, posts) => {
  const html = posts.map(iterPost => `      
    <div id="post-${iterPost.id}" class="news-list-post">
      <a href="${getArticleUrl(iterPost.slug)}">
        <img src="${resolveImageUrl(iterPost.featured_image_url)}" alt="${iterPost.title}">
        <h2 class="post-title">${iterPost.title}</h2>
        <div class="post-info">
          <div class="post-info-author">${iterPost.author_name}</div>
          <div class="post-info-published">${formatPublishedDate(iterPost.published_at)}</div> 
        </div>
      </a>
    </div> <!-- news-list-post -->

    `).join('');
  elPostList.insertAdjacentHTML('beforeend', html);
};

const buildArticlesUrl = (cursor) => {
  const params = new URLSearchParams({ per_page: ARTICLES_PER_PAGE });
  if (cursor) params.set('cursor', cursor);
  if (window.snoNewsTag) params.set('tag', window.snoNewsTag);
  if (window.snoNewsAuthor) params.set('author', window.snoNewsAuthor);
  return `${NEWSROOM_API}?${params.toString()}`;
};

const getEmptyListMessage = () => {
  if (window.snoNewsAuthor) return 'No articles found for this author.';
  if (window.snoNewsTag) return 'No articles found for this tag.';
  return 'No articles found.';
};

const loadNextPage = () => {
  if (window.snoTestNextPage) return;
  if (!window.snoNewsReadyForMore || !window.snoNewsFetchAllowed || window.snoNewsHasMore === false || window.snoNewsFetching) return;
  window.snoNewsFetchAllowed = false;
  getNewsHomeList();
};

const getNewsHomeList = () => {
  if (window.snoNewsFetching || window.snoNewsHasMore === false) return;

  window.snoNewsFetching = true;
  setLoadingState(true);

  const url = buildArticlesUrl(window.snoNewsNextCursor);
  _log('--getNewsHomeList: url:', url);

  fetch(url).then(response => {
    return response.json();
  }).then(data => {
    _log('--getNewsHomeList: data');
    console.log('articles:', data);

    const posts = data.data || [];
    if (!posts.length) {
      window.snoNewsHasMore = false;
      setLoadingState(false);
      updateNextPageLink(null);
      window.snoNewsFetching = false;
      if (!window.snoNewsNextCursor) {
        waitForElement('.news-list ').then((elPostList) => {
          elPostList.insertAdjacentHTML(
            'beforeend',
            `<p class="news-empty">${getEmptyListMessage()}</p>`
          );
        }).catch(() => {});
      }
      return;
    }

    waitForElement('.news-list ').then((elPostList) => {
      _log('posts:', posts);
      createPostList(elPostList, posts);
      window.snoNewsNextCursor = data.next_cursor || null;
      window.snoNewsHasMore = Boolean(data.next_cursor);
      window.snoNewsFetchAllowed = true;
      window.snoNewsReadyForMore = true;
      setLoadingState(false);
      updateNextPageLink(data.next_cursor);
      window.snoNewsFetching = false;
      startInfiniteScroll();
    }).catch((e) => {
      console.error('Error waiting for getNewsHomeList data:', e);
      window.snoNewsFetchAllowed = true;
      setLoadingState(false);
      window.snoNewsFetching = false;
    });
  }).catch((e) => {
    console.error('Error waiting for getNewsHomeList fetch:', e);
    setLoadingState(false);
    window.snoNewsFetchAllowed = true;
    window.snoNewsFetching = false;
  });
};

const setInfiniteScroll = () => {
  const sentinel = document.querySelector('.news-list-footer');
  if (!sentinel) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadNextPage();
    }
  }, {
    root: null,
    rootMargin: '200px',
    threshold: 0,
  });

  observer.observe(sentinel);
};

const startInfiniteScroll = () => {
  if (window.snoNewsInfiniteScrollStarted) return;
  window.snoNewsInfiniteScrollStarted = true;
  setInfiniteScroll();
};

const setNextPageClickHandler = () => {
  const nextPageEl = document.getElementById('next-page');
  if (!nextPageEl) return;

  nextPageEl.addEventListener('click', (event) => {
    event.preventDefault();
    loadNextPage();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const searchParams = new URLSearchParams(window.location.search);
  window.snoNewsNextCursor = searchParams.get('cursor');
  window.snoNewsTag = searchParams.get('tag');
  window.snoNewsAuthor = searchParams.get('author');
  window.snoNewsTagName = window.snoNewsAuthor ? null : searchParams.get('name');
  window.snoNewsAuthorName = window.snoNewsAuthor ? searchParams.get('name') : null;
  window.snoNewsLoadingIndicator = document.getElementById('loading');
  window.snoNewsFetchAllowed = true;
  window.snoNewsHasMore = true;
  window.snoNewsFetching = false;
  window.snoNewsReadyForMore = false;
  window.snoNewsInfiniteScrollStarted = false;
  window.snoTestNextPage = searchParams.get('test-next-page');
  updateListHeader();
  setNextPageClickHandler();
  loadAuthorProfile();
  getNewsHomeList();
});
