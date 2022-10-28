var express = require('express');
var router = express.Router();
const sessint = require('../controllers/sessint');


/* add new sessint. */
router.get('/register', sessint.createSessIntPage);
router.post('/register', sessint.createHandler);

/* GET sessint listing. */
router.get('/listing', sessint.listingSessInt);

/* update sessint. */
router.get('/update/:siid', sessint.updateSessIntPage);
router.post('/update', sessint.updateHandler);

/* delete sessint. */
router.get('/delete/:siid', sessint.deleteHandler);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'sessint' });
});


module.exports = router;