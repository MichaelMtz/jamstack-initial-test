const resorts = require("./resorts.json");

const abbrToLongName = {
  "AL":"alabama", "AK":"alaska", "AZ":"arizona", "CA":"california", "CO":"colorado", "CT":"connecticut", "ID":"idaho", "IL":"illinois", "IN":"indiana"
  , "IA":"iowa", "ME":"maine", "MD":"maryland", "MA":"massachusetts", "MI":"michigan", "MN":"minnesota", "MO":"missouri", "MT":"montana", "NV":"nevada"
  , "NH":"new-hampshire", "NJ":"new-jersey" , "NM":"new-mexico", "NY":"new-york", "NC":"north-carolina", "ND":"north-dakota", "OH":"ohio", "OR":"oregon"
  , "PA":"pennsylvania", "RI":"rhode-island", "SD":"south-dakota", "TN":"tennessee", "UT":"utah", "VT":"vermont", "VA":"virginia", "WA":"washington"
  , "WV":"west-virginia", "WI":"wisconsin", "WY":"wyoming"
  , "MID WEST:" : "mid-west", "NORTH EAST:" : "north-east", "NORTH WEST:" : "north-west", "ROCKIES:": "rockies", "SOUTH WEST:": "south-west","SOUTH EAST:": "south-east" 
}

function upperCaseWords(input) {
  input = input.replace('-', ' ');
  let iterName = input.split(" ");
  let output = iterName.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");
  return output;
}

function formatBreadCrumbLink(breadcrumb) {
  return "snow-report/" + abbrToLongName[breadcrumb];
};

function formatBreadCrumbs(breadcrumbs) {
  let breadCrumbList = []; 
  breadcrumbs.forEach(iterBreadCrumb => {
    if (abbrToLongName[iterBreadCrumb]) {
      let link = formatBreadCrumbLink(iterBreadCrumb);
      let aBreadCrumb = { link: link, abbrName: iterBreadCrumb};
      breadCrumbList.push(aBreadCrumb);
    }
  });
  return breadCrumbList;
}

module.exports = async function() {
  let iterStateNameProper, iterName;
  resorts.forEach(iter => {
    if (iter.entryType  === 'state') {
      iter["stateNameProperLowerCase"] = iter.stateName.replace('-', ' ');
      iter["stateNameProper"] = upperCaseWords(iter.stateName);
      iter["breadCrumbList"] = formatBreadCrumbs(iter.breadcrumbs);
      // console.log('Iter:',{iter});
      // console.log('BC:',iter["breadCrumbList"])

    } 
  })
  return resorts;
};