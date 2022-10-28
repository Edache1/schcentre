var express = require('express');
var router = express.Router();
const users = require('../controllers/users');

/* GET users listing. */
router.get('/', users.users_listing);
router.post('/fetch_file', users.fetch_ajaxuserfile);


/* add new users. */
router.get('/new-user', users.renderNewUserPage);
router.post('/new-user', users.handleNewUserReg);

/* update users. */
router.get('/:userid', users.renderUpdateUserPage);
router.post('/user-update', users.handleUpdateUserForm);
/* users photo. */
router.post('/updateuserimg', users.handleAjaxUpdateUserImg);
router.post('/addUserImage', users.handleAddUserFile);
/* update users category. */
router.post('/updateusercate', users.handleUpdateUserCate);

/* delete users. */
router.get('/user-delete/:userid', users.deleteUserHandler);

/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Users' });
});*/


module.exports = router;
