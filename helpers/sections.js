const models = require('../models');
const { Op } = require('sequelize');

exports.createSections = objet => {
	return models.sessions.findOrCreate({
    where: { 
        section: objet.section  
      }, 
    defaults: objet
  });
}

exports.findSections = (sessid = null) => {
	if(sessid) {
    return models.sessions.findOne({
      where: {
        sessid
      },
      include: [
        {model: models.interval}
      ]
    });
	}
	return models.sessions.findAll({
    include: [
          {model: models.interval}
        ]
  });	
}

exports.updateSections = (objet, sessid) => {
	return models.sessions.findOne({
	    where: { 
	        [Op.and]: [
	          {
	            sessid: { [Op.ne]: sessid }
	          },
	          {
	            section: { [Op.eq]: objet.section }
	          }
	        ]  
      	},
  	}).then(response => {
  	if (response == null) {
        return updateSectionsFn(objet, sessid);
      }else{
        return false;
      }
  	})
}

const updateSectionsFn = (inputsObj, sessid) => {
  return models.sessions.update(inputsObj, {
    where: {
          sessid
        }
  });
};

exports.deleteSections = sessid => {
  return models.sessions.destroy({
    where: {
          sessid
        }
  });	
};