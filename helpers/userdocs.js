const models = require('../models');
const { Op } = require('sequelize');
const helperFns = require('./modules');


exports.addUserFile = objet => {
	return models.userDocs.create({
		userid: objet.userid,
		url: 	objet.url
	});
}

exports.updateUserFile = objet => {
	const doid = objet.doid; delete objet.doid;
	const userid = objet.userid; delete objet.userid;
	return models.userDocs.findOne({
	    where: {
         [Op.and]: [
	          {
	            doid: { [Op.eq]:  doid }
	          },
	          {
	            userid: { [Op.eq]: userid }
	          }
	      	] 
		}
	}).then(response => {
		if (response == null) {
			return false;
	    } else {
	    	let url = response.dataValues.url;
	    	let result = helperFns.unlinkFile(url);
	    	if(!result) return false;
	       return updateUserDocsFn(objet, doid, userid);
	    }
	});
}

exports.obtenirUserfile = (doid = null, userid = null) => {
	if(doid) {
	    return models.userDocs.findOne({
	      where: {
	        doid
	      }
	 });
	}else if (userid) {
		return models.userDocs.findOne({
	      where: {
	        userid
	      }
	 });
	} else {
		return models.userDocs.findAll();
	}
}

const updateUserDocsFn = (inputsObj, doid, userid) => {
  return models.userDocs.update(inputsObj, {
    where: {
         [Op.and]: [
	          {
	            doid: { [Op.eq]:  doid }
	          },
	          {
	            userid: { [Op.eq]: userid }
	          }
	      	] 
		}
  });
};