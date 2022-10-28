const interval = require('../helpers/interval');





exports.createIntervalPage = function(req, res, next) {
	return res.render('interval/register', { title: 'Register Interval', layout: './templates/layout'});	
}

exports.createHandler = function(req, res, next) {
	interval.createInterval(req.body).then(intInstance => {
		if(intInstance[1]) {
			return res.send('Successfully added to the database...');
		}else{
			return res.send('this record already exist...');
		}	
	}).catch(err => {
      	return res.render('404', {title: '404 page not found', layout: './templates/layout'});
    });
}

exports.listingInterval = function(req, res, next) {
	const data = {};
	interval.findInterval().then(intPromise => {
		data.interval = intPromise.map(intPromise => intPromise.dataValues);
		return res.render('interval/listing', { title: 'Intervals', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.updateIntervalPage = function(req, res, next) {
	const data = {};
	interval.findInterval(req.params.intid).then(intPromise => {
		data.interval = intPromise.dataValues;
		return res.render('interval/update', { title: 'Update Interval', data: data, layout: './templates/layout'});	
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });	
}

exports.updateHandler = function(req, res, next) {
	const intObj = req.body; 
	const intid = intObj.intid; delete intObj.intid;
	interval.updateInterval(intObj, intid).then(response => {
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
	interval.deleteInterval(req.params.intid).then(response => {
		if (response) { return res.redirect('/interval/listing') };
	}).catch(err => {
      return res.render('404', {title: '404 page not found'});
    });		
}