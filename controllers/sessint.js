const sessint = require('../helpers/sessint');
const sections = require('../helpers/sections');
const interval = require('../helpers/interval');
const helpersFn = require('../helpers/modules');





exports.createSessIntPage = function(req, res, next) {
	const data = {};
	interval.findInterval().then(intPromise => {
		data.intervals = intPromise.map(intPromise => intPromise.dataValues);
		return sections.findSections();	
	}).then(secPromise => {
		data.sections = secPromise.map(secPromise => secPromise.dataValues);
		return res.render('sessint/register', { title: 'sessint', data: data, layout: './templates/layout'});	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });	
}

exports.createHandler = function(req, res, next) {
	sessint.createSessInt(req.body).then(secInstance => {
		if(secInstance[1]) {
			return res.send('Successfully added to the database...');
		}else{
			return res.send('this record already exist...');
		}	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found', layout: './templates/layout'});
    });
}

exports.listingSessInt = function(req, res, next) {
	const data = {};
	sessint.findSessInt().then(secPromise => {
		let sectionsArray = secPromise.map(secPromise => secPromise.dataValues);
		sectionsArray.forEach(item => {
			let sectionTermsObj = {};
			let secIntervalsArray = item.intervals.map(intObj => intObj.dataValues);
			let secIntArray = secIntervalsArray.map(params => params.sessint.dataValues);
			secIntervalsArray.forEach(intTerm => sectionTermsObj[intTerm.intid] = intTerm);
			const termObj = helpersFn.sessTermsArrayObj(sectionTermsObj, secIntArray, 'int');
			item.intervals = termObj;
		});
		data.sectionTermsArray = sectionsArray;
		return res.render('sessint/listing', { title: 'Sections and Terms', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.updateSessIntPage = function(req, res, next) {
	const data = {};
	sessint.findSessInt(req.params.siid).then(termPromise => {
		data.term = termPromise.dataValues;
		if (data.term.startDate != null || data.term.endDate != null) {
			data.term.startDate = helpersFn.dateFormat(data.term.startDate);
			data.term.endDate = helpersFn.dateFormat(data.term.endDate);
		}
		return res.render('sessint/update', { title: 'Update sessint', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.updateHandler = function(req, res, next) {
	const secObj = req.body; 
	console.log(secObj);
	const siid = secObj.siid; delete secObj.siid;
	sessint.updateSessInt(secObj, siid).then(response => {
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
	sessint.deleteSessInt(req.params.siid).then(response => {
		if (response) { return res.redirect('/sessint/listing') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}