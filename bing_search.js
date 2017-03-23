var Bing = require('node-bing-api')({
    accKey: process.env.BAPI
});
var url = require("url");

var searchBing = function(query, offset, callback) {
    var outputlist = Array();
    var dict;
    if (offset === undefined) {
        offset = 0;
    }

    Bing.images(query, {
        count: 10, // Number of results (max 50) 
        skip: offset * 50 // paginate results 50 at a time
    }, function(error, res, body) {


        var apiresult = body['value'];
        apiresult.forEach(function(element) {
            dict = {
                "url": url.parse(element['contentUrl'], true)['query']['r'],
                "snippet": element['name'],
                "thumbnail": element['thumbnailUrl'],
                "context": element['hostPageDisplayUrl']
            };

            outputlist.push(dict);

        });

        callback(outputlist);

    });

};

module.exports = {
    searchBing
};
