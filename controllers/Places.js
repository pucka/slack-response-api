
var request = require('request'),
    settings = require('../settings.js'),
    async= require('async');

var API_URL = "http://api.sl.se/api2/typeahead.json?key={key}&searchstring={search}&stationsonly=true&maxresults=1".replace("{key}", settings.placeAPIKey);

function getStationFromAPI(name) {
    var url = API_URL.replace("{search}", name);
    console.log(url);
    return request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('first', body) // Print the google web page.
      }
    });
}

var fetchData = function(url, cb) {
    request({json: true, url: url}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log('first', body) // Print the google web page.
        cb(null, body);
      } else {
        cb(err);
      }
    });
}

module.exports = function() {
    return {
        getRoute: function(from, to) {
            /*getStationFromAPI(name).on('end', function(response) {
                console.log('response', response.toJSON());
            })*/

            var urlFrom = API_URL.replace("{search}", from),
                urlTo = API_URL.replace("{search}", to);

            async.series([
                    function(callback){
                        fetchData(urlFrom, callback);
                    },
                    function(callback){
                        fetchData(urlTo, callback);
                    }
                ],
                // optional callback
                function(err, results){
                    console.log('results',results[0].ResponseData[0].SiteId, results[1].ResponseData[0].SiteId);
                }
            );

            /*async.map(["file1", "file2", "file3"], fetch, function(err, results){
                if ( err){
                   // either file1, file2 or file3 has raised an error, so you should not use results and handle the error
                } else {
                   // results[0] -> "file1" body
                   // results[1] -> "file2" body
                   // results[2] -> "file3" body
                }
            });*/
        }
    }
};