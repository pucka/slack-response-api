var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
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
});

module.exports = router;
