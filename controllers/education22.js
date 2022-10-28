const education = require('../helpers/education');
const sections = require('../helpers/sections');





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
	const data = {};
	const intervalArry = new Array();
	const termArray = [];
	education.findEducation().then(eduPromise => {
		data.education = eduPromise.map(eduPromise => eduPromise.dataValues);
		return sections.findSections();
	}).then(secPromise => {
		let sectns = secPromise.map(secPromise => secPromise.dataValues);
		sectns.forEach(item => {
			let sectionTermsObj = {};
			let secIntervalsArray = item.intervals.map(intObj => intObj.dataValues);
			intervalArry.push(secIntervalsArray);
			delete item.intervals;
		});

		let intervalArryObj = intervalArry.flat();
		intervalArryObj.forEach(item => {
			let mergerObj = {};
			let sessintObj = item.sessint.dataValues;
			mergerObj[item.intid] = item;
				let secTerms = mergerObj[sessintObj.intid];
				if (secTerms) {
					for(let key in secTerms){
						sessintObj[key] = secTerms[key]
					}
				}
			termArray.push(sessintObj);
		});	
		console.log(termArray);
	data.sections = sectns;
		return res.render('education/addterms', { title: 'Semesters/Terms', data: data, layout: './templates/layout'});	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });	
}

exports.termsHandler = function(req, res, next) {

}

exports.updateEducationPage = function(req, res, next) {
	const data = {};
	education.findEducation(req.params.eduid).then(eduPromise => {

		data.education = eduPromise.dataValues;
		let ab = data.education.sessints.map(e => e.dataValues);
		console.log(ab);








		return res.render('education/update', { title: 'Update Education', data: data, layout: './templates/layout'});	
	}).catch(err => {
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