const resorts = require("./resorts.json");
const breadcrumbs = require("./breadcrumbs.json");

const abbrToLongName = {
  "AL":"alabama", "AK":"alaska", "AZ":"arizona", "CA":"california", "CO":"colorado", "CT":"connecticut", "ID":"idaho", "IL":"illinois", "IN":"indiana"
  , "IA":"iowa", "ME":"maine", "MD":"maryland", "MA":"massachusetts", "MI":"michigan", "MN":"minnesota", "MO":"missouri", "MT":"montana", "NV":"nevada"
  , "NH":"new-hampshire", "NJ":"new-jersey" , "NM":"new-mexico", "NY":"new-york", "NC":"north-carolina", "ND":"north-dakota", "OH":"ohio", "OR":"oregon"
  , "PA":"pennsylvania", "RI":"rhode-island", "SD":"south-dakota", "TN":"tennessee", "UT":"utah", "VT":"vermont", "VA":"virginia", "WA":"washington"
  , "WV":"west-virginia", "WI":"wisconsin", "WY":"wyoming"
  , "MID WEST:" : "mid-west", "NORTH EAST:" : "north-east", "NORTH WEST:" : "north-west", "ROCKIES:": "rockies", "SOUTH WEST:": "south-west","SOUTH EAST:": "south-east" 
};

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function upperCaseWords(input) {
  input = input.replace(/-/g, ' ');
  const iterName = input.split(" ");
  const output = iterName.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");
  return output;
}

function formatBreadCrumbLink(breadcrumb) {
  return "snow-report/" + abbrToLongName[breadcrumb] + "/";
};

function formatBreadCrumbs(breadcrumbs) {
  const breadCrumbList = []; 
  let first = true;
  breadcrumbs.forEach(iterBreadCrumb => {
    if (abbrToLongName[iterBreadCrumb]) {
      const link = formatBreadCrumbLink(iterBreadCrumb);
      if (first) {
        iterBreadCrumb = iterBreadCrumb.toLowerCase().replace(/\s/g, "");
        iterBreadCrumb = iterBreadCrumb.charAt(0).toUpperCase() + iterBreadCrumb.slice(1);
      } 
      const aBreadCrumb = { link: link, abbrName: iterBreadCrumb, active: ''};
      //console.log("--formatBreadCrumbs:aBreadCrumb",aBreadCrumb);
      breadCrumbList.push(aBreadCrumb);
      first = false;
    }
  });
  
  const region = breadCrumbList.shift();
  const returnBreadCrumbList = { region, breadCrumbList};
  
  return returnBreadCrumbList;
}

module.exports = async function() {
  //console.log("*** resorts.js");
  let iterStateNameProper, iterName, masterBreadCrumb = {};
  //console.log("---breadcrumbs:",breadcrumbs);
  breadcrumbs.forEach(iterBreadCrumb => {
    masterBreadCrumb[iterBreadCrumb.stateName] = formatBreadCrumbs(iterBreadCrumb.breadcrumbs); 
  });
  //console.log("--masterBreadCrumb:",masterBreadCrumb);
  resorts.forEach(iter => {
    if (iter.entryType === 'resort')  { //resort
      iterName = iter.stateName.split('/');
      iter["stateNameProperLowerCase"] = iter["resortName"] = iterName[1].replace('-', ' ');
      iter["stateNameProper"] = upperCaseWords(iterName[2]);
      iter['stateNameActual'] = iterName[1];
      iter['stateNameAbbr'] = getKeyByValue(abbrToLongName, iterName[1]);
      iter["snowreport"] = iter.resort_id; 
      iter['scripts'] = ['assets/js/global.js'];
      //iter["styles"] = ['font-awesome.min.css', 'resortPage-base.css', 'resortPage.css', 'tabs.css'];
      
      //Third party scripts
      //iter["scripts"] = ['https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js'];
      // console.log('---- Master BreadCrumbs', masterBreadCrumb);
      // console.log('==== IterName-0',iterName[0]);

      if (masterBreadCrumb[iterName[1]]) {
        //iter["breadCrumbList"] = formatBreadCrumbs(masterBreadCrumb[iterName[0]]);
        let tempBreadCrumbs = masterBreadCrumb[iterName[1]];
        //let abbrState = stateLongToAbbr(iterName[0]);
        tempBreadCrumbs.breadCrumbList.forEach(iterBreadCrumb => {
          if (iterBreadCrumb.abbrName === iter.stateNameAbbr.toUpperCase()) {
            iterBreadCrumb.active = 'bg-gradient-to-br from-sky-500 to-blue-500 text-white active';
          }
        });
         iter['resortRegion'] =  tempBreadCrumbs.region;
         // console.log('----iter', iter);
         // console.log('----tempBreadCrumbs', tempBreadCrumbs.breadCrumbList);
         // console.log('----------------------------------------------------------------');
         // iter["breadCrumbList"] = tempBreadCrumbs;
         iter["breadCrumbList"] = tempBreadCrumbs.breadCrumbList;
        
      }
      
    }
  });
  return resorts;
};