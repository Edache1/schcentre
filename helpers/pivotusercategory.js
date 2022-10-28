const models = require('../models');
const { Op } = require('sequelize');

exports.ajourterPivot = objet => {
	return models.pivotUserCategory.findOrCreate({
		where: { 
	        [Op.and]: [
	          {
	            userid: { [Op.eq]: objet.userid }
	          },
	          {
	            catid: { [Op.eq]: objet.catid }
	          }
	        ]  
	      },
    defaults: objet
  });
}

exports.deleteUseCatePivot = paramId => {
	return models.pivotUserCategory.destroy({
      where: {
        userid: paramId
      }
  });
}