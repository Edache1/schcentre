const models = require('../models');
const { Op } = require('sequelize');

exports.createEducation = objet => {
	return models.education.findOrCreate({
    where: { 
        school: objet.school  
      }, 
    defaults: objet
  });
}

exports.findEducation = (eduid = null) => {
	if(eduid) {
	    return models.education.findOne({
	      where: {
	        eduid
	       },
        include: [
          {model: models.sessint}, {model: models.sessions}
        ]
	   });
	}
	return models.education.findAll();	
}

exports.updateEducation = (objet, eduid) => {
	return models.education.findOne({
	    where: { 
        [Op.and]: [
          {
            eduid: { [Op.ne]: eduid }
          },
          {
            school: { [Op.eq]: objet.school }
          }
        ]  
    	},
    	}).then(response => {
    	if (response == null) {
          return updateEducationFn(objet, eduid);
      }else{
        return false;
      }
    })
}

const updateEducationFn = (inputsObj, eduid) => {
  return models.education.update(inputsObj, {
    where: {
          eduid
        }
  });
};

exports.deleteEducation = eduid => {
  return models.education.destroy({
    where: {
          eduid
        }
  });	
};