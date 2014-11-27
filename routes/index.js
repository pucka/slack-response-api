var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    /*NodeCache = require( "node-cache" ),
    cache = new NodeCache(),*/
    settings = require('../settings'),
    trip = require('../controllers/TripController')(),
    bus = require('../controllers/BusController')(),
    snusket = require('../controllers/SnusketController')();

/* GET home page. */
/*router.get('/', function(req, res) {
  res.json({title:'hej'});
});

router.get('/trip', function(req, res) {
    console.log('sl', res.statusCode);
    trip.getRoute('radiohuset', 'karlaplan');
    res.json({title:'sl'});
});*/

function busResponse(item) {
     var time = moment(item.ExpectedDateTime);
     return "Nästa buss, linje " + item.LineNumber + ", avgår från Radiohuset om " + item.MinutesLeft + (item.MinutesLeft > 1 ? " minuter" : " minut") + " (" + time.format("HH:mm") + ")";
}

router.get('/bus', function(req, res) {

    var token = req.query.token;

    if (settings.slackTokenBuss == token) {
        var busNumber = req.query.text || '4';

        console.log(busNumber);

        if (['4', '56', '42', 'alla', 'all'].indexOf(busNumber.trim()) > -1) {
            //var cachedItem = cache.get('bus_' + busNumber);

            //console.log(cachedItem);

            /*if (cachedItem.LineNumber) {
                console.log('from cache');
                res.send(busResponse(cachedItem));

            } else {*/
            bus.getBus(busNumber, function(err, item) {
                if (err) {
                    res.send("Ett fel uppstod");
                    console.log("Error", err);
                } else if (item) {
                    //cache.set('bus_' + busNumber, item, 30);
                    res.send(busResponse(item));
                } else {
                    res.send('');
                }

            });
            //}

        } else {
            res.send('Du kan endast söka på busslinjerna 4, 42 och 56. Skriver du "/buss alla" så söker du på alla tre busslinjer.');
        }


    } else {
        res.render('error', {
            message: 'No access',
            error: {}
        });
    }
});

router.get('/snusket', function(req, res) {
    var token = req.query.token;

    if (settings.slackTokenSnusket == token) {
        today = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"][new Date().getDay()];
        snusket.getMenu(today, function(err, item) {
                if (err) {
                    res.send("Ett fel uppstod");
                    console.log("Error", err);
                } else if (item) {
                    //cache.set('bus_' + busNumber, item, 30);
                    res.send("Idag på snusket:\n" + item.menu);
                } else {
                    res.send('nada');
                }

            });
    } else {
        res.render('error', {
            message: 'No access',
            error: {}
        });
    }

});
/*
router.post('/bus', function(req, res) {

    var busNumber = req.query.bus || '4';

    console.log(busNumber);

    bus.getBus(busNumber, function(err, item) {
        if (err) {
            res.send("Ett fel uppstod");
            console.log("Error", err);
        } else if (item) {
            var time = moment(item.ExpectedDateTime);
            res.send("Nästa buss linje " + item.LineNumber + " avgår om " + item.MinutesLeft + (item.MinutesLeft > 1 ? " minuter" : " minut") + " (" + time.format("HH:mm") + ")");
        } else {
            res.send('');
        }

    });
});*/

module.exports = router;
