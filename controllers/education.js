const education = require('../helpers/education');
const sections = require('../helpers/sections');
const edusessint = require('../helpers/edusessint');
const sessint = require('../helpers/sessint');
const edusess = require('../helpers/edusess');
const interval = require('../helpers/interval');
const helpersFn = require('../helpers/modules');





exports.createEducationPage = function(req, res, next) {
	return res.render('education/register', { title: 'Education Level', layout: './templates/layout'});	
}

exports.createHandler = async function(req, res, next) {
	education.createEducation(req.body).then(eduInstance => {
		if(eduInstance[1]) {
			return res.send('Successfully added to the database...');
		}else{
			return res.send('this record already exist...');
		}	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found', layout: './templates/layout'});
    });
}

exports.termsHandler = function(req, res, next) {
	const objInput = {};
	education.findEducation(req.body.eduid).then(eduPromise => {
		if (!eduPromise) return res.send('foul play');
		return sessint.sessAndTerm(req.body.termid, req.body.sessid);
	}).then(termPromise => {
		if (!termPromise) return res.send('foul play');
		objInput.sessid = req.body.sessid;
		objInput.eduid = req.body.eduid;
		req.body.siid = req.body.termid;
		delete req.body.sessid; delete req.body.termid;
		return edusessint.createEduSessInt(req.body);
	}).then(response => {
		return (response[1]) ? edusess.createEduSess(objInput) : 
		res.send('this record already exist...');	
	}).then(response => {
		return (response[1]) ? res.send('Successfully added to the database...') :
		res.send('this record already exist...');
	}).catch(err => {
      	return res.render('404', {title: '404 page not found', layout: './templates/layout'});
    });
}

exports.listingEducation = function(req, res, next) {
	const data = {};
	education.findEducation().then(eduPromise => {
		data.education = eduPromise.map(eduPromise => eduPromise.dataValues);
		return res.render('education/listing', { title: 'All Education Level', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.termsPage = function(req, res, next) {
	const data = {}, intervalArry = new Array(), termArray = []; let mergerObj = {};
	education.findEducation().then(eduPromise => {
		data.education = eduPromise.map(eduPromise => eduPromise.dataValues);
		return sections.findSections();
	}).then(secPromise => {
		let sectns = secPromise.map(secPromise => secPromise.dataValues);
		sectns.forEach(item => {
			let secIntervalsArray = item.intervals.map(intObj => intObj.dataValues);
			intervalArry.push(secIntervalsArray);
			delete item.intervals;
		});
		data.sections = sectns;
		return res.render('education/addterms', { title: 'Semesters/Terms', data: data, layout: './templates/layout'});	
	}).catch(err => {
		console.log(err);
      	return res.render('404', {title: '404 page not found'});
    });	
}

exports.getAjaxTermSiid = async function(req, res, next) {
	const intervalArry = new Array(), sectionTermsObj = {};
	const sectionId = req.body.sectionId;
	console.log(sectionId);
	sections.findSections(sectionId).then(secPromise => {
		let sectnsObj = secPromise.dataValues;
		let secIntervalsArray = sectnsObj.intervals.map(intarry => intarry.dataValues);
		secIntervalsArray.forEach(intTerm => sectionTermsObj[intTerm.intid] = intTerm);
		let secIntArray = secIntervalsArray.map(params => params.sessint.dataValues);
		const termsArrayObj = helpersFn.sessTermsArrayObj(sectionTermsObj, secIntArray, 'int');
		return res.send(termsArrayObj);
	}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });	
}

exports.updateEducationPage = function(req, res, next) {
	const data = {}; let sessintArray, sessArray, sectionTermsObj = {};
	education.findEducation(req.params.eduid).then(eduPromise => {
		data.education = eduPromise.dataValues;
		sessArray = eduPromise.dataValues.sessions.map(e => e.dataValues);
		data.sections = sessArray;
		sessintArray = eduPromise.dataValues.sessints.map(e => e.dataValues);
		return interval.findInterval();
	}).then(intResponse => {
		const termsArray = intResponse.map(int => int.dataValues);
		termsArray.forEach(term => sectionTermsObj[term.intid] = term);
		const termsArrayObj = helpersFn.sessTermsArrayObj(sectionTermsObj, sessintArray, 'int');
		sectionTermsObj = {}; 
		sessArray.forEach(sess => {
			if (sess.startDate != null || sess.endDate != null) {
				sess.startDate = helpersFn.dateFormat(sess.startDate);
				sess.endDate = helpersFn.dateFormat(sess.endDate);
			}	
			sectionTermsObj[sess.sessid] = sess;
		});
		const objNoRef = JSON.parse(JSON.stringify(sectionTermsObj));
		Object.entries(objNoRef).forEach(([key, val]) => {
		 	delete val.startDate; delete val.endDate;
		});
		const rrayObj = helpersFn.sessTermsArrayObj(objNoRef, termsArrayObj);
		data.terms = rrayObj;
		return res.render('education/update', { title: 'Update Education', data: data, layout: './templates/layout'});	
	}).catch(err => {
		console.log(err);
      return res.render('404', {title: '404 page not found', err: err});
    });	
}

exports.updateHandler = function(req, res, next) {
	const eduObj = req.body; 
	const eduid = eduObj.eduid; delete eduObj.eduid;
	education.updateEducation(eduObj, eduid).then(response => {
		console.log(response);
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
	education.deleteEducation(req.params.eduid).then(response => {
		if (response) { return res.redirect('/education/listing') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}

exports.removeTermHandler = function(req, res, next) {
	edusessint.deleteEduSessInt(req.params.siid).then(response => {
		if (response) { return res.redirect('back') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}

exports.removeSessHandler = function(req, res, next) {
	edusess.deleteEduSess(req.params.sessid).then(response => {
		if (response) { return res.redirect('back') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}