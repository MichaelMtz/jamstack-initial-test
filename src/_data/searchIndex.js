const resorts = require("./resorts.json");

module.exports = function() {
    return resorts
        .filter(r => r.entryType === 'resort' && r.stateName)
        .map(r => {
            const parts = r.stateName.replace(/^\/|\/$/g, '').split('/');
            if (parts.length < 2) return null;
            return { p: parts[0] + '/' + parts[1], id: r.resort_id };
        })
        .filter(Boolean);
};
