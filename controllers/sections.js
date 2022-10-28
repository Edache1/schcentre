const sections = require('../helpers/sections');



const dateFormat = dateArgs => {
	const dateFn = new Date(dateArgs);
	return dateFn.toLocaleString("en-US");
} 

exports.createSectionsPage = function(req, res, next) {
	return res.render('sections/register', { title: 'New Academic Sections', layout: './templates/layout'});	
}

exports.createHandler = function(req, res, next) {
	sections.createSections(req.body).then(secInstance => {
		if(secInstance[1]) {
			return res.send('Successfully added to the database...');
		}else{
			return res.send('this record already exist...');
		}	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found', layout: './templates/layout'});
    });
}

exports.listingSections = function(req, res, next) {
	const data = {};
	sections.findSections().then(secPromise => {
		data.sections = secPromise.map(secPromise => secPromise.dataValues);
		return res.render('sections/listing', { title: 'Sections', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.updateSectionsPage = function(req, res, next) {
	const data = {};
	sections.findSections(req.params.sessid).then(secPromise => {
		data.section = secPromise.dataValues;
		if (data.section.startDate != null || data.section.endDate != null) {
			data.section.startDate = dateFormat(data.section.startDate);
			data.section.endDate = dateFormat(data.section.endDate);
		}
		return res.render('sections/update', { title: 'Update Sections', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.updateHandler = function(req, res, next) {
	const secObj = req.body; 
	const sessid = secObj.sessid; delete secObj.sessid;
	sections.updateSections(secObj, sessid).then(response => {
		if (response) {
			return res.send('Successfully updated to the database...');
		} else {
			return res.send('this record already exist or something went wrong...');
		}
	}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });
}

exports.deleteHandler = function(req, res, next) {
	sections.deleteSections(req.params.sessid).then(response => {
		if (response) { return res.redirect('/sections/listing') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}