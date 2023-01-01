const resorts = require("./resorts.json");

const abbrToLongName = {
  "AL":"alabama", "AK":"alaska", "AZ":"arizona", "CA":"california", "CO":"colorado", "CT":"connecticut", "ID":"idaho", "IL":"illinois", "IN":"indiana"
  , "IA":"iowa", "ME":"maine", "MD":"maryland", "MA":"massachusetts", "MI":"michigan", "MN":"minnesota", "MO":"missouri", "MT":"montana", "NV":"nevada"
  , "NH":"new-hampshire", "NJ":"new-jersey" , "NM":"new-mexico", "NY":"new-york", "NC":"north-carolina", "ND":"north-dakota", "OH":"ohio", "OR":"oregon"
  , "PA":"pennsylvania", "RI":"rhode-island", "SD":"south-dakota", "TN":"tennessee", "UT":"utah", "VT":"vermont", "VA":"virginia", "WA":"washington"
  , "WV":"west-virginia", "WI":"wisconsin", "WY":"wyoming"
  , "MID WEST:" : "mid-west", "NORTH EAST:" : "north-east", "NORTH WEST:" : "north-west", "ROCKIES:": "rockies", "SOUTH WEST:": "south-west","SOUTH EAST:": "south-east" 
};
const longToShort = {
  "alabama": "AL",
  "alaska": "AK",
  "arizona": "AZ",
  "california": "CA",
  "colorado": "CO",
  "connecticut": "CT",
  "idaho": "ID",
  "illinois": "IL",
  "indiana": "IN",
  "iowa": "IA",
  "maine": "ME",
  "maryland": "MD",
  "massachusetts": "MA",
  "michigan": "MI",
  "minnesota": "MN",
  "missouri": "MO",
  "montana": "MT",
  "nevada": "NV",
  "new-hampshire": "NH",
  "new-jersey": "NJ",
  "new-mexico": "NM",
  "new-york": "NY",
  "north-carolina": "NC",
  "north-dakota": "ND",
  "ohio": "OH",
  "oregon": "OR",
  "pennsylvania": "PA",
  "rhode-island": "RI",
  "south-dakota": "SD",
  "tennessee": "TN",
  "utah": "UT",
  "vermont": "VT",
  "virginia": "VA",
  "washington": "WA",
  "west-virginia": "WV",
  "wisconsin": "WI",
  "wyoming": "WY",
  "mid-west": "MIDWEST:",
  "north-east": "NORTHEAST:",
  "north-west": "NORTHWEST:",
  "rockies": "ROCKIES:",
  "south-west": "SOUTHWEST:",
  "south-east": "SOUTHEAST:"
};
function upperCaseWords(input) {
  input = input.replace(/-/g, ' ');
  const iterName = input.split(" ");
  const output = iterName.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");
  return output;
}




module.exports = async function() {
  console.log("*** resorts.js");
  let iterName = {};
  //console.log("---breadcrumbs:",breadcrumbs);
  //console.log("--masterBreadCrumb:",masterBreadCrumb);
  resorts.forEach(iter => {
    if (iter.entryType === 'resort')  { //resort
      iterName = iter.stateName.split('/');
      iter["stateNameLowerCase"] = iterName[0];
      iter["stateNameAbbr"] = (longToShort[iterName[0]]) ? longToShort[iterName[0]].toLowerCase() : 'empty';
      iter["resortNameLowerCase"] = iterName[1];
      iter["stateNameProperLowerCase"] = iterName[0].replace(/-/gi, '');
      iter["resortNameProperLowerCase"] = iterName[1].replace(/-/gi, '');
      iter["stateNameProper"] = upperCaseWords(iterName[1]);
      iter["snowreport"] = iter.resort_id;
      iter["styles"] = ['font-awesome.min.css', 'resortPage-base.css', 'resortPage.css', 'tabs.css'];

      //console.log('>> redirects:',iter);
    }
  });
  return resorts;
};