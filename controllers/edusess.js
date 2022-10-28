const edusess = require('../helpers/edusess');
const sections = require('../helpers/sections');
const education = require('../helpers/education');





exports.createEduSessPage = function(req, res, next) {
	const data = {};
	education.findEducation().then(eduPromise => {
		data.education = eduPromise.map(eduPromise => eduPromise.dataValues);
		return sections.findSections();	
	}).then(secPromise => {
		data.sections = secPromise.map(secPromise => secPromise.dataValues);
		return res.render('edusess/register', { title: 'edusess', data: data, layout: './templates/layout'});	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found'});
    });	
}

exports.createHandler = function(req, res, next) {
	edusess.createEduSess(req.body).then(response => {
		if(response[1]) {
			return res.send('Successfully added to the database...');
		}else{
			return res.send('this record already exist...');
		}	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found', layout: './templates/layout'});
    });
}

const dateFormat = dateArgs => {
	const dateFn = new Date(dateArgs);
	return dateFn.toLocaleString("en-US");
} 

exports.listingEduSess = function(req, res, next) {
	const data = {};
	edusess.findEduSess().then(edu => {
		let eduArray = edu.map(edu => edu.dataValues);
		console.log(eduArray);
		eduArray.forEach(school => {
			let sectionObj = {};
			let sectionArray = school.sessions.map(secObj => secObj.dataValues);
			let eduSecArray = sectionArray.map(params => params.edusess.dataValues);
			sectionArray.forEach(sessn => sectionObj[sessn.sessid] = sessn);
			const secsnObj = eduSecArray.map(sub => {
				if (sub.startDate != null || sub.endDate != null) {
					sub.startDate = dateFormat(sub.startDate);
					sub.endDate = dateFormat(sub.endDate);
				}
				let secTerms = sectionObj[sub.sessid];
				if (secTerms) {
					for(let key in secTerms){
						sub[key] = secTerms[key]
					}
				}
				return sub;
			});
			school.sessions = secsnObj;
		});
		data.eduSecnArry = eduArray;
		/*console.log(eduArray)*/
		return res.render('edusess/listing', { title: 'Schools with Sections', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.deleteHandler = function(req, res, next) {
	edusess.deleteEduSess(req.params.esid).then(response => {
		if (response) { return res.redirect('/edusess/listing') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}