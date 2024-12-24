const t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e;};
const _log = function (text, param, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`, param);};

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

const isElementInView = (el, pixelsShown = 0)=>{
  const s1 = el.offsetTop + el.offsetHeight - window.scrollY;
  const s2 = window.scrollY + window.innerHeight - el.offsetTop;
  return s1 > pixelsShown && s2 > pixelsShown;
  // return el.offsetTop + el.offsetHeight > window.scrollY && el.offsetTop < window.scrollY + window.innerHeight;
};
const scrollHandler = () => {
  const loadingIndicator = document.getElementById('loading');
  
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadingIndicator.classList.add('show');
      // Load more content here
      getNewsHomeList();
    }
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Trigger when 50% of the element is visible
  });
  
  observer.observe(document.getElementById(`post-${window.snoNewsLastPostID}`));
};
const createPostList = (elPostList, posts) => {
  const html = posts.map(iterPost => `      
    <div id="post-${iterPost.id}" class="news-list-post">
      <a href="news-post/${iterPost.eventTitle}/?postID=${iterPost.id}">
        <img src="${iterPost.image}">
        <h2 class="post-title">${iterPost.title}</h2>
        <div class="post-info">
          <div class="post-info-author">${iterPost.author}</div>
          <div class="post-info-published">${iterPost.publish_up}</div> 
        </div>
      </a>
    </div> <!-- news-list-post -->

    `).join('');
  elPostList.insertAdjacentHTML('beforeend',html);
};

const getNewsHomeList = () => {
  
  const localURL = `https://www.snow-country.com/resorts/api-easy-blog-list.php?action=news-home&lastID=${window.snoNewsLastPostID}`;
  const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/news-home-api?action=news-home&lastID=${window.snoNewsLastPostID}`: localURL;
  _log(`--getNewsHomeList: url:${url}`);
  
  fetch(url).then(response => {      
    return response.json();
  }).then(data => {
    _log('--getOtherPostList: data');    
    console.log('stories:',data);
    if (data.status) {
      waitForElement('.news-list ').then((elPostList) => {
        _log('post:',data.stories);
        window.snoNewsLastPostID = data.stories[data.stories.length-1].id;
        createPostList(elPostList,data.stories);
        scrollHandler();
      }).catch( (e) => { console.error('Error waiting for getOtherPostList data:',e);});        
    }
    
  }).catch( (e) => { console.error('Error waiting for getOtherPostList fetch:',e);});

};

document.addEventListener('DOMContentLoaded',()=> {
  window.snoNewsLastPostID = 0;  //default to latest
  window.setScrollHandler = true;
  getNewsHomeList();
});