const t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e;};
const _log = function (text, param, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`, param);};

const NEWSROOM_API = 'https://newsroom.snow-report.org/api/v1/articles';
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

const formatPublishedDate = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const updateNextPageLink = (nextCursor) => {
  const nextPageEl = document.getElementById('next-page');
  if (!nextPageEl) return;

  if (nextCursor) {
    let href = `news-home/?cursor=${encodeURIComponent(nextCursor)}`;
    if (window.snoTestNextPage) href += '&test-next-page=yes';
    nextPageEl.href = href;
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
  return `${NEWSROOM_API}?${params.toString()}`;
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
  window.snoNewsLoadingIndicator = document.getElementById('loading');
  window.snoNewsFetchAllowed = true;
  window.snoNewsHasMore = true;
  window.snoNewsFetching = false;
  window.snoNewsReadyForMore = false;
  window.snoNewsInfiniteScrollStarted = false;
  window.snoTestNextPage = searchParams.get('test-next-page');
  setNextPageClickHandler();
  getNewsHomeList();
});
