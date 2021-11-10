// Logic to pull in snow report from SnoCountry Feed API
var t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e};
var _log = function (text, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`);};
_log('Initialized.');

document.addEventListener('DOMContentLoaded',(event)=> {
  let target = document.body.dataset.snowreport;
  let src = document.body.dataset.source;
  // const url = (window.location.hostname !== 'localhost') ? `.netlify/functions/snowreport-api?target=${target}&src=${src}` : `http://localhost/sno/snoCountryHeadless/snow-reports/headless-snow-report-list.php?target=${target}`;
  // fetch(url,{"headers": {"sec-fetch-mode": "cors","Access-Control-Allow-Origin":"*"}, "mode":"cors"}).then(response => {

  const url = `.netlify/functions/snowreport-api?target=${target}&src=${src}` ;
  fetch(url).then(response => {
    return response.json();
  }).then(data => {

    document.querySelector('#container-snow-reports').innerHTML = data.snowreport;
    //process progressbars
    (function() {
        let progressBarList = document.querySelectorAll('.progress-bar');
        if (progressBarList) {
            progressBarList.forEach(iterBar => {
                iterBar.style.width = iterBar.dataset.percentage;
                //console.log(`pb:`,iterBar.dataset.percentage); 
            });
        }
    })();
  });
});
