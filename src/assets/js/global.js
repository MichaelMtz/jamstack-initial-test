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

document.addEventListener('DOMContentLoaded', function () {
  const elRights = document.getElementById('rights');
  if (elRights) {    
    const currentYear = new Date().getFullYear(); 
    elRights.content = `Copyright © ${currentYear}. All Rights Reserved.`
  }
});