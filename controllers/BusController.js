
var request = require('request'),
    settings = require('../settings.js'),
    async= require('async'),
    moment = require('moment');

var API_URL = "http://api.sl.se/api2/realtimedepartures.json?key={key}&siteid=1110&timewindow=60".replace("{key}", settings.realTimeAPIKey);

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
        getBus: function(busNumber, cb) {

            fetchData(API_URL, function(err, resJson) {
                if(!err) {
                    if (resJson && resJson.ResponseData) {
                        var resp = resJson.ResponseData;
                        resp.Buses.every(function(item) {
                            if (item.LineNumber == busNumber || ['alla', 'all'].indexOf(busNumber) > -1) {

                                var timeLeft = moment(item.ExpectedDateTime).diff(moment(new Date()));
                                var d = moment.duration(timeLeft).asMinutes();

                                if (d >= 1) {
                                    item.MinutesLeft = Math.floor(d);
                                    cb(null, item);
                                    return false;
                                }
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