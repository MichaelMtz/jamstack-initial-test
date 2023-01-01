const lists = require("./lists.json");


const abbrToLongName = {
  "AL":"alabama", "AK":"alaska", "AZ":"arizona", "CA":"california", "CO":"colorado", "CT":"connecticut", "ID":"idaho", "IL":"illinois", "IN":"indiana"
  , "IA":"iowa", "ME":"maine", "MD":"maryland", "MA":"massachusetts", "MI":"michigan", "MN":"minnesota", "MO":"missouri", "MT":"montana", "NV":"nevada"
  , "NH":"new-hampshire", "NJ":"new-jersey" , "NM":"new-mexico", "NY":"new-york", "NC":"north-carolina", "ND":"north-dakota", "OH":"ohio", "OR":"oregon"
  , "PA":"pennsylvania", "RI":"rhode-island", "SD":"south-dakota", "TN":"tennessee", "UT":"utah", "VT":"vermont", "VA":"virginia", "WA":"washington"
  , "WV":"west-virginia", "WI":"wisconsin", "WY":"wyoming"
  , "MID WEST:" : "mid-west", "NORTH EAST:" : "north-east", "NORTH WEST:" : "north-west", "ROCKIES:": "rockies", "SOUTH WEST:": "south-west","SOUTH EAST:": "south-east" 
  , 'AB':'alberta','BC':'british-columbia','MB':'manitoba','NB':'new-brunswick','NS':'nova-scotia','ON':'ontario','QC':'quebec'
  ,"ARG":"argentina","AUS":"australia","CHL": "chile","NZL": "new-zealand"
  ,"AND":'andorra',"AUT":'austria',"CHE":'switzerland',"CZE": 'czech-republic',"DEU": 'germany',"ESP": 'spain',"FIN": 'finland',"FRA": 'france'
  ,"ITA":'italy',"NOR":'norway',"SWE": 'switzerland'
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
  return "snow-report/" + abbrToLongName[breadcrumb];
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
  console.log("*** lists.js");
  let iterStateNameProper, iterName, masterBreadCrumb = {};
  lists.forEach(iter => {
    if (iter.entryType !== 'resort') {
      iter["stateNameProperLowerCase"] = iter.stateName.replace('-', ' ');
      iter["stateNameProper"] = upperCaseWords(iter.stateName);
      iter["breadCrumbList"] = formatBreadCrumbs(iter.breadcrumbs);
      iter["snowreport"] = iter.stateName;

      iter["styles"] = ['state-page.css','state-page-card.css' ];
      
      //Save breadcrumb for resort usage later, 
      //note this requires "state" and "region" entryTypes to be declared before associated "resort" types
      //masterBreadCrumb[iter.stateName] = iter.breadcrumbs;
      masterBreadCrumb[iter.stateName] = iter["breadCrumbList"];

    } else { //resort
      iterName = iter.stateName.split('/');
      iter["stateNameProperLowerCase"] = iterName[1].replace('-', ' ');
      iter["stateNameProper"] = upperCaseWords(iterName[1]);
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
  return lists;
};