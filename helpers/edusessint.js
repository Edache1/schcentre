const models = require('../models');
const { Op } = require('sequelize');

exports.createEduSessInt = objet => {
	return models.edusessint.findOrCreate({
    where: { 
          [Op.and]: [
            {
              eduid: { [Op.eq]: objet.eduid }
            },
            {
              siid: { [Op.eq]: objet.siid }
            }
          ]  
        }, 
    defaults: objet
  });
}

exports.findEduSessInt = (esiid = null) => {
	if(siid) {
	    return models.edusessint.findOne({
	      where: {
	        esiid
	      }
	    });
	}
	return models.sessions.findAll({
    include: [
      {model: models.interval}
    ]
  });
}

exports.updateEduSessInt = (objet, esiid) => {
  return updateEduSessIntFn(objet, esiid);
}

const updateEduSessIntFn = (inputsObj, esiid) => {
  return models.edusessint.update(inputsObj, {
    where: {
        esiid
      }
  });
};

exports.deleteEduSessInt = siid => {
  return models.edusessint.destroy({
    where: {
        siid
      }
  });	
};