const models = require('../models');
const { Op } = require('sequelize');

exports.createInterval = objet => {
	return models.interval.findOrCreate({
    where: { 
        term: objet.term  
      }, 
    defaults: objet
  });
}

exports.findInterval = (intid = null) => {
	if(intid) {
    return models.interval.findOne({
      where: {
        intid
      }
    });
	}
	return models.interval.findAll();	
}

exports.updateInterval = (objet, intid) => {
	return models.interval.findOne({
	    where: { 
        [Op.and]: [
          {
            intid: { [Op.ne]: intid }
          },
          {
            term: { [Op.eq]: objet.term }
          }
        ]  
    	},
  	}).then(response => {
  	if (response == null) {
        return updateIntervalFn(objet, intid);
      }else{
        return false;
      }
  	})
}

const updateIntervalFn = (inputsObj, intid) => {
  return models.interval.update(inputsObj, {
    where: {
        intid
      }
  });
};

exports.deleteInterval = intid => {
  return models.interval.destroy({
    where: {
        intid
      }
  });	
};