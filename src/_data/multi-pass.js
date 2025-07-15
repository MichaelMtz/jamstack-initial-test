const lists = require("./multi-pass.json");

function upperCaseWords(input) {
  input = input.replace(/-/g, ' ');
  const iterName = input.split(" ");
  const output = iterName.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");
  return output;
}

function formatBreadCrumbLink(breadcrumb) {
  return "snow-report/multi-pass/" + breadcrumb.replace(' ', '-').toLowerCase() + "/";
};

function formatBreadCrumbs(breadcrumbs, passName) {
  const breadCrumbList = []; 
  breadcrumbs.forEach(iterBreadCrumb => {
    const link = formatBreadCrumbLink(iterBreadCrumb);
    const aBreadCrumb = { link: link, breadCrumbName: iterBreadCrumb};
    breadCrumbList.push(aBreadCrumb);
  });
  return breadCrumbList;
}

module.exports = async function() {
  console.log("*** multi-pass.js");
  lists.forEach(iter => {
    iter["passNameProperLowerCase"] = iter.passName.replace(' ', '-').toLowerCase();
    iter["breadCrumbList"] = formatBreadCrumbs(iter.breadcrumbs, iter.passName);
    iter["styles"] = ['state-page.css','state-page-card.css' ];
  });
  return [...lists];
};