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
const validXCStates = [
  'california','maine','massachusetts','new-hampshire','new-jersey','new-mexico','new-york','vermont','west-virginia','wyoming'
];
const validXCStatesAbbr = [
  'CA','ME','MA','NH','NJ','NM','NY','VT','WV','WY'
];
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
  const crossCountry = [];
  lists.forEach(iter => {

    iter["stateNameProperLowerCase"] = iter.stateName.replace('-', ' ');
    iter["stateNameProper"] = upperCaseWords(iter.stateName);
    iter["breadCrumbList"] = formatBreadCrumbs(iter.breadcrumbs);
    iter["snowreport"] = iter.stateName;
    iter["resortType"] = 'alpine';
    
    iter["styles"] = ['state-page.css','state-page-card.css' ];
    iter["hasXC"] = false;
    if ( (iter.entryType === 'state') && (validXCStates.includes(iter.stateName))) {
      iter['hasXC'] = true;
      const tempEntry = Object.assign({},iter);
      tempEntry.breadcrumbs = Object.assign({}, iter.breadcrumbs);
      tempEntry["alpineName"] = tempEntry["stateName"];
      tempEntry["stateName"] = `${tempEntry['stateName']}-cross-country`;
      tempEntry["resortType"] = 'xc';
      const xcBreadcrumbs = [];
      tempEntry['breadCrumbList'].forEach(iterBreadCrumb => {
        if (validXCStatesAbbr.includes(iterBreadCrumb.abbrName)) {
          xcBreadcrumbs.push(iterBreadCrumb); 
        }
      });
      tempEntry.breadCrumbList = xcBreadcrumbs; //Object.assign({}, xcBreadcrumbs);
      crossCountry.push(tempEntry);
    }
  });

  //const completeList = [...lists, ...crossCountry];
  //console.log('--- completeList',completeList);
  return [...lists, ...crossCountry];
};