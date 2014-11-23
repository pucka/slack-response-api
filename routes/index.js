var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    settings = require('../settings'),
    trip = require('../controllers/TripController')(),
    bus = require('../controllers/BusController')();

/* GET home page. */
/*router.get('/', function(req, res) {
  res.json({title:'hej'});
});

router.get('/trip', function(req, res) {
    console.log('sl', res.statusCode);
    trip.getRoute('radiohuset', 'karlaplan');
    res.json({title:'sl'});
});*/

router.get('/bus', function(req, res) {

    var token = req.query.token;

    if (settings.slackToken == token) {
        var busNumber = req.query.text || '4';

        console.log(busNumber);

        if (['4', '56', '42', 'alla', 'all'].indexOf(busNumber) > -1) {
            bus.getBus(busNumber, function(err, item) {
                if (err) {
                    res.send("Ett fel uppstod");
                    console.log("Error", err);
                } else if (item) {
                    var time = moment(item.ExpectedDateTime);
                    res.send("Nästa buss linje " + item.LineNumber + " avgår från Radiohuset om " + item.MinutesLeft + (item.MinutesLeft > 1 ? " minuter" : " minut") + " (" + time.format("HH:mm") + ")");
                } else {
                    res.send('');
                }

            });
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
