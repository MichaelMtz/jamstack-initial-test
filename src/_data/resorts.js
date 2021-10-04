const resorts = require("./resorts.json");

module.exports = async function() {
  let iterStateNameProper, iterName;
  resorts.forEach(iter => {
    iterStateNameProper = iter.stateName.replace('-', ' ');
    iter["stateNameProperLowerCase"] = iterStateNameProper;
    iterName = iterStateNameProper.split(" ");
    iterStateNameProper = iterName.map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
    iter["stateNameProper"] = iterStateNameProper;
  })
  return resorts;
};