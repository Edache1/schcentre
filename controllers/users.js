const users = require('../helpers/users');
const helperFns = require('../helpers/modules');
const category = require('../helpers/category');
const pivotUseCat = require('../helpers/pivotusercategory');
const userDocs = require('../helpers/userdocs');
const fs = require('fs');
const path = require('path');




//mock function
exports.notifyCustomer = function(order){
	const customer = helperFns.getUser(order.userId);

	helperFns.mail(customer.email, 'Your order was placed Successfully');
}

//mock function
exports.applyDiscount = function(order){
	let user = helperFns.getUser(order.userId);
	if (user.points > 10) order.totalPrice *= 0.9;	
}

//testing exceptions
module.exports.registerUser = function(username){
	if (!username) throw new Error("Username is required");
	return {id: new Date().getTime(), username: username};
}

//testing objects
module.exports.getProduct = function(productId){
	return {id: productId, price: 10};
}

//testing arrays
module.exports.getCurrencies = function(){
	return ["USD", "AUD", "EUR"];
}

//testing strings
module.exports.greet = function(name){
	return "Welcome "+name;
}

//testing numbers
module.exports.absolute = function(number){
	return (number >= 0) ? number : -number;
}

























exports.renderNewUserPage = function(req, res, next) {
	const data = {};
	category.obtenirCategory().then(catPromise => {
		data.categories = catPromise.map(catPromise => catPromise.dataValues);
		return res.render('users/new_user', { title: 'New User', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.handleNewUserReg = async function(req, res, next) {
	let userObj = req.body;
	let cateid = userObj.catid; delete userObj.catid;
	const folderName = helperFns.random();
	let folderPath = './public/images/users/'+folderName;
	userObj.folpath = folderPath;
	users.ajourterUsers(userObj).then(userInstance => {
		if (userInstance[1]) {
			userObj = {};
			userObj.catid = cateid;
			folderPath = userInstance[0].dataValues.folpath;
			if (!fs.existsSync(folderPath)) helperFns.createDirectory(folderPath);
			userObj.userid = userInstance[0].dataValues.userid;
			let pivotResponse = pivotUseCat.ajourterPivot(userObj);
			return pivotResponse;
		} else {
			return res.send('this user record already exist...');
		}
	}).then(response => {
		if(response[1]) {
			return res.send('Successfully added to the database...');
		}else{
			return res.send('this record already exist...');
		}	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found', layout: './templates/layout'});
    });
}

exports.users_listing = function(req, res, next) {
	const pageData = {};
	users.obtenirUsers().then(userPromise => {
		pageData.users = userPromise.map(userPromise => userPromise.dataValues);
		return res.json(pageData.users);
/*		return res.render('users/users_listing', { title: 'Users', data: pageData, layout: './templates/layout' });
*/	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });
}

exports.renderUpdateUserPage = function(req, res, next) {
	const userObj = {};
	users.obtenirUsers(req.params.userid).then(userPromise => {
		if(!userPromise) return res.status(404).send();
	    userObj.user = userPromise.dataValues;
	    userObj.userCategories = userPromise.dataValues.userCategories.map(item => item.dataValues);
	    return res.json(userObj.user);

	   /* return category.obtenirCategory();
	}).then(catPromise => {
		userObj.categories = catPromise.map(catPromise => catPromise.dataValues);
		return userDocs.obtenirUserfile(null, userObj.user.userid);
	}).then(imgPromise => {
		userObj.img = imgPromise.dataValues;
		return res.render('users/updateUser', { title: 'Update User', data: userObj, layout: './templates/layout' });
	*/}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });	
}

exports.handleUpdateUserForm = function(req, res, next) {
	const userObj = req.body; 
	const userid = userObj.userid; delete userObj.userid;
	users.updateUser(userObj, userid).then(response => {
		if (response) {
			return res.send('Successfully updated to the database...');
		} else {
			return res.send('this record already exist or something went wrong...');
		}
	}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });
}

exports.handleUpdateUserCate = function(req, res, next) {
	let arry = []; let promisArry = [];
  	let userid = req.body.personid; delete req.body.personid;
  	Object.entries(req.body).forEach(([key, val]) => arry.push(val));
	pivotUseCat.deleteUseCatePivot(userid).then(response => {
		arry.forEach(args => {
			let inputsObj = {userid: userid, catid: args};
			let outcome = pivotUseCat.ajourterPivot(inputsObj);
			promisArry.push(outcome);
		})
		return Promise.all(promisArry);
	}).then(response => {
		if (response) {
			return res.redirect('back');
		} else {
			return res.send("Whoops... something went wrong");
		}	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });
};

exports.handleAddUserFile = function(req, res, next) {
	const inputs = {};
	let validateFileInput = helperFns.validateFileInput(req.files);
	if (!validateFileInput.verdict) return res.send(validateFileInput.msg);
	users.obtenirUsers(req.body.useid).then(response => {
	  	inputs.url = response.dataValues.folpath;
	  	inputs.userid = response.dataValues.userid;
	  	(validateFileInput.fileType == "docs") ? inputs.url+='/'+'docs/' : 
	  	inputs.url+='/'+'images/';
	}).then(() => users.addUserDocs(inputs, req.files.userImg)).then(response => {
		if (!response) return res.send("Whoops... something went wrong");
		return res.send("Successfull...");
	}).catch(err => {
  		return res.render('404', {title: '404 page not found', err: err});
	});	
}

exports.handleAjaxUpdateUserImg = function(req, res, next) {
	const inputs = {};
	let validateFileInput = helperFns.validateFileInput(req.files);
	if (!validateFileInput.verdict) return res.send(validateFileInput);
	users.obtenirUsers(req.body.useimgid).then(response => {
	  	inputs.url = response.dataValues.folpath;
	  	inputs.userid = response.dataValues.userid;
	  	inputs.doid	= req.body.doid;
	  	(validateFileInput.fileType == "docs") ? inputs.url+='/'+'docs/' : 
	  	inputs.url+='/'+'images/';
	}).then(() => users.updateUserDocs(inputs, req.files.useimg)).then(response => {
		if (!response) return res.send({
			verdict:  false,
		    fileType: '',
		    msg:      'Whoops... something went wrong!'
		});
		return res.send({
			verdict:  true,
		    fileType: '',
		    msg:      'Successfully Updated'
		});
	}).catch(err => {
  		return res.render('404', {title: '404 page not found', err: err});
	});	
}

exports.fetch_ajaxuserfile = function(req, res, next) {
	userDocs.obtenirUserfile(req.body.doid).then(imgPromise => {
	   const recObj = imgPromise.dataValues;
	   return res.send(recObj);
	});
}

exports.deleteUserHandler = function(req, res, next) {
	users.deleteUser(req.params.userid).then(response => {
		if (response) { return res.redirect('/users/users-listing') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}