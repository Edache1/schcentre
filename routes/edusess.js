var express = require('express');
var router = express.Router();
const edusess = require('../controllers/edusess');


/* add new edusess. */
router.get('/register', edusess.createEduSessPage);
router.post('/register', edusess.createHandler);

/* GET edusess listing. */
router.get('/listing', edusess.listingEduSess);

/* delete edusess. */
router.get('/delete/:esid', edusess.deleteHandler);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'edusess' });
});


module.exports = router;