const models = require('../models');
const { Op } = require('sequelize');

exports.createSessInt = objet => {
	return models.sessint.findOrCreate({
    where: { 
          [Op.and]: [
            {
              sessid: { [Op.eq]: objet.sessid }
            },
            {
              intid: { [Op.eq]: objet.intid }
            }
          ]  
        }, 
    defaults: objet
  });
}

exports.findSessInt = (siid = null) => {
	if(siid) {
	    return models.sessint.findOne({
	      where: {
	        siid
	      }
	    });
	}
	return models.sessions.findAll({
    include: [
      {model: models.interval}
    ]
  });
}

exports.sessAndTerm = (siid = null, sessid = null) => {
  if(siid && sessid) {
      return models.sessint.findOne({
        where: { 
          [Op.and]: [
            {
              siid: { [Op.eq]: siid }
            },
            {
              sessid: { [Op.eq]: sessid }
            } 
          ]  
        }
      });
  }/*
  return models.sessions.findAll({
    include: [
      {model: models.interval}
    ]
  });*/
}

exports.updateSessInt = (objet, siid) => {
  return updateSessIntFn(objet, siid);
}

const updateSessIntFn = (inputsObj, siid) => {
  return models.sessint.update(inputsObj, {
    where: {
        siid
      }
  });
};

exports.deleteSessInt = siid => {
  return models.sessint.destroy({
    where: {
        siid
      }
  });	
};