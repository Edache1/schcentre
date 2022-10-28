var express = require('express');
var router = express.Router();
const category = require('../controllers/category');


/* add new category. */
router.get('/register', category.renderNewCategoryPage);
router.post('/register', category.handleRegisterCategory);

/* GET category listing. */
router.get('/listing', category.getAllCategory);

/* update category. */
router.get('/update/:catid', category.renderUpdateCategory);
router.post('/update', category.handleUpdateCatForm);
/* update category Icon. */
router.post('/updateIcon', category.handleUpdateCatIcon);

/* delete category. */
router.get('/delete/:catid', category.catDeleteHandler);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Category' });
});


module.exports = router;