var express = require('express');
var router = express.Router();
const education = require('../controllers/education');


/* add new education. */
router.get('/register', education.createEducationPage);
router.post('/register', education.createHandler);

/* GET education listing. */
router.get('/listing', education.listingEducation);

/* update education. */
router.get('/update/:eduid', education.updateEducationPage);
router.post('/update', education.updateHandler);

/* education terms. */
router.get('/terms', education.termsPage);
router.post('/getterms', education.getAjaxTermSiid);
router.post('/terms', education.termsHandler);


/* delete education. */
router.get('/delete/:eduid', education.deleteHandler);
router.get('/removeterm/:siid', education.removeTermHandler);
router.get('/removesess/:sessid', education.removeSessHandler);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'education' });
});


module.exports = router;