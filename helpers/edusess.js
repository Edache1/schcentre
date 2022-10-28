const models = require('../models');
const { Op } = require('sequelize');

exports.createEduSess = objet => {
	return models.edusess.findOrCreate({
    where: { 
      [Op.and]: [
        {
          eduid: { [Op.eq]: objet.eduid }
        },
        {
          sessid: { [Op.eq]: objet.sessid }
        } 
      ]  
    }, 
    defaults: objet
  });
}

exports.findEduSess = (sessid = null) => {
	if(sessid) {
      return models.edusess.findOne({
        where: {
          sessid
        }
      });
  }
  return models.education.findAll({
    include: [
      {model: models.sessions}
    ]
  });
}

exports.deleteEduSess = sessid => {
  return models.edusess.destroy({
    where: {
        sessid
      }
  });	
};