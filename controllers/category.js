const category = require('../helpers/category');
const helperFns = require('../helpers/modules');

exports.renderNewCategoryPage = function(req, res, next) {
	const data = {};
	category.obtenirCategory().then(catPromise => {
		data.categories = catPromise.map(catPromise => catPromise.dataValues);
		return res.render('category/register', { title: 'Add category', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });
}

exports.handleRegisterCategory = function(req, res, next) {
	let validateFileInput = helperFns.validateFileInput(req.files);
	if (!validateFileInput) return res.send('No file selected');
	let categoryObj = req.body;
	let fileName = helperFns.random();
  	let fileUrl = './public/images/category/'+fileName;
  	categoryObj.catIcon = fileUrl;
	category.ajourterCategory(categoryObj).then(catInstance => {
		if (catInstance[1]) {
			let imgUpload = helperFns.fileUpload(req.files.catIcon, fileUrl);
			if(!imgUpload) return res.send('Image not uploaded...');
			return res.send('Successfully added to the database...');
		} else {
			return res.send('this record already exist...');
		}
	}).catch(err => {
      	return res.render('404', {title: '404 page not found', layout: './templates/layout'});
    });	
}

exports.getAllCategory = function(req, res, next) {
	const data = {};
	category.obtenirCategory().then(catPromise => {
		data.categories = catPromise.map(catPromise => catPromise.dataValues);
		return res.render('category/listing', { title: 'Category', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });
}

exports.renderUpdateCategory = function(req, res, next) {
	const data = {};
	data.catid = req.params.catid;
	category.obtenirCategory().then(catPromise => {
		data.categories = catPromise.map(catPromise => catPromise.dataValues);
		const catObjArry = data.categories.filter(category => category.catid == data.catid);
		data.catObj = catObjArry[0];
	    return res.render('category/update', { title: 'Update Category', data: data, layout: './templates/layout' }); 
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.handleUpdateCatForm = function(req, res, next) {
	const catid = req.body.catid; delete req.body.catid;
	/*decode catid b4 use in the db*/
	category.updateCategory(req.body, catid).then(response => {
		if (response) {
			return res.send('Successfully updated to the database...');
		} else {
			return res.send('this record already exist or something went wrong...');
		}
	}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });	
}

exports.handleUpdateCatIcon = function(req, res, next) {
	let inputs = {};
	let validateFileInput = helperFns.validateFileInput(req.files);
	if (!validateFileInput) return res.send('No file selected');
	    category.obtenirCategory(req.body.cateid).then(response => {
		  	inputs.oldIconUrl = response.dataValues.catIcon;
		}).then(() => category.updateCategoryIcon(inputs, req.body.cateid, req.files)).then(response => {
			if (!response[0]) return res.send("Whoops... something went wrong");
			return res.send("Updated Successfully");
		}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });	 	
}

exports.catDeleteHandler = function(req, res, next) {
	category.deleteCategory(req.params.catid).then(response => {
		if (response) { return res.redirect('/category/listing') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}