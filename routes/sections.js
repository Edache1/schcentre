var express = require('express');
var router = express.Router();
const sections = require('../controllers/sections');


/* add new sections. */
router.get('/register', sections.createSectionsPage);
router.post('/register', sections.createHandler);

/* GET sections listing. */
router.get('/listing', sections.listingSections);

/* update sections. */
router.get('/update/:sessid', sections.updateSectionsPage);
router.post('/update', sections.updateHandler);

/* delete sections. */
router.get('/delete/:sessid', sections.deleteHandler);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'sections' });
});


module.exports = router;