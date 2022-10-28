const models = require('../models');
const { Op } = require('sequelize');
const helperFns = require('./modules');
const userDocs = require('./userdocs');

exports.addMultipleUsers = array => {
	return models.Users.bulkCreate(array, {returning: true});
}

exports.ajourterUsers = objet => {
  return models.Users.findOrCreate({
    where: { 
        email: objet.email  
      }, 
    defaults: objet
  });
}

exports.obtenirUsers = (userid = null) => {
	if(userid) {
	    return models.Users.findOne({
	      where: {
	        userid
	      },
        include: [
        {model: models.userCategory}
      ]
	 });
	}
	return models.Users.findAll();	
}

exports.updateUser = (objet, userid) => {
	return models.Users.findOne({
	    where: {
         [Op.and]: [
          {
            email: { [Op.eq]:  objet.email }
          },
          {
            userid: { [Op.ne]: userid }
          }
        ] 
	    }
  	}).then(response => {
  	if (response == null) {
        return updateUserFn(objet, userid);
      }else{
        return false;
      }
  	})
}

exports.addUserDocs = async (objet, fileObj) => {
  const verdict = arrangeAndUpload(objet, fileObj);
  if (!verdict) return false;
  return userDocs.addUserFile(objet);
}

exports.updateUserDocs = async (objet, fileObj) => {
  const verdict = arrangeAndUpload(objet, fileObj);
  if (!verdict) return false;
  return userDocs.updateUserFile(objet);
}

const updateUserFn = (inputsObj, userid) => {
  return models.Users.update(inputsObj, {
    where: {
        userid
      }
  });
};

const arrangeAndUpload =  async (objet, fileObj) => {
  let fileName = helperFns.random();
  let folderPath = objet.url;
  folderPath+=fileName;
  objet.url = folderPath;
  let fileUpload = await helperFns.fileUpload(fileObj, folderPath);
  if(!fileUpload) return false;
  return true;
}

exports.deleteUser = (userid = null) => {
  if (!userid) return models.Users.destroy({truncate: true});
  return models.Users.destroy({
    where: {
        userid
      }
  }); 
};