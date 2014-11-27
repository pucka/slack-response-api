
var request = require('request'),
    settings = require('../settings.js');

var API_URL = "https://www.kimonolabs.com/api/ej2zhcjc?apikey={key}".replace("{key}", settings.snusketAPIKey);

var fetchData = function(url, cb) {
    request({json: true, url: url}, function (error, response, body) {
        console.log(body);
      if (!error && response.statusCode == 200) {
        cb(null, body);
      } else {
        cb(error);
      }
    });
};

module.exports = function() {
    return {
        getMenu: function(day, cb) {

            fetchData(API_URL, function(err, resJson) {
                if(!err) {
                    if (resJson && resJson.results) {
                        var resp = resJson.results;

                        resp.menus.every(function(item) {

                            if (item.day.toLowerCase() == day) {
                                cb(null, item);
                                return false;
                            }

                            return true;
                        });

                    }

                    cb('');
                } else {
                    cb(err);
                }
           });
        }
    }
};