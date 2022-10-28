var express = require('express');
var router = express.Router();
const interval = require('../controllers/interval');


/* add new interval. */
router.get('/register', interval.createIntervalPage);
router.post('/register', interval.createHandler);

/* GET interval listing. */
router.get('/listing', interval.listingInterval);

/* update interval. */
router.get('/update/:intid', interval.updateIntervalPage);
router.post('/update', interval.updateHandler);

/* delete interval. */
router.get('/delete/:intid', interval.deleteHandler);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'interval' });
});


module.exports = router;