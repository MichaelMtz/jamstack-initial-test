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
  breadcrumbs.forEach(iterBreadCrumb => {
    if (abbrToLongName[iterBreadCrumb]) {
      const link = formatBreadCrumbLink(iterBreadCrumb);
      const aBreadCrumb = { link: link, abbrName: iterBreadCrumb};
      breadCrumbList.push(aBreadCrumb);
    }
  });
  return breadCrumbList;
}

module.exports = async function() {
  console.log("*** resorts.js");
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
      iter["stateNameProper"] = upperCaseWords(iterName[1]);
      iter['stateNameActual'] = iterName[0];
      iter["snowreport"] = iter.resort_id;
      iter["styles"] = ['font-awesome.min.css', 'resortPage-base.css', 'resortPage.css', 'tabs.css'];
      
      //Third party scripts
      iter["scripts"] = ['https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js'];
      if (masterBreadCrumb[iterName[0]]) {
        //iter["breadCrumbList"] = formatBreadCrumbs(masterBreadCrumb[iterName[0]]);
        iter["breadCrumbList"] = masterBreadCrumb[iterName[0]];
      }
      
    }
  });
  return resorts;
};