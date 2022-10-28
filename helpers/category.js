const models = require('../models');
const { Op } = require('sequelize');
const helperFns = require('./modules');

exports.ajourterCategory = objet => {
	return models.userCategory.findOrCreate({
    where: { 
        catName: objet.catName  
      }, 
    defaults: objet
  });
}

exports.obtenirCategory = (catid = null) => {
	if(catid) {
	    return models.userCategory.findOne({
	      where: {
	        catid
	      }
	    });
	}
	return models.userCategory.findAll();	
}

exports.updateCategory = (objet, catid) => {
	return models.userCategory.findOne({
	    where: {
	      	[Op.or]: [{ 
	      		catName: { [Op.eq]: objet.catName } 
	      	}],
	    	[Op.and]: [{
	          	catid: { [Op.ne]: catid }
	        }] 
	    }
  	}).then(response => {
  	if (response == null) {
        return updateCategoryFn(objet, catid);
      }else{
        return false;
      }
  	})
}

exports.updateCategoryIcon = async (objet, catid, filesObj) => {
	let verdict = false;
	const catIcon = filesObj.catIcon;
	let fileName = helperFns.random();
	let fileUrl = './public/images/category/'+fileName;
	let oldIconUrl = objet.oldIconUrl; delete objet.oldIconUrl;
	objet.catIcon = fileUrl;
	verdict = helperFns.unlinkFile(oldIconUrl);
	if(!verdict) return false;
	let imgUpload = await helperFns.fileUpload(catIcon, fileUrl);
	if(!imgUpload) return false;
	return updateCategoryFn(objet, catid);
}

exports.deleteCategory = catid => {
  return models.userCategory.destroy({
    where: {
          catid
        }
  });	
};

const updateCategoryFn = (inputsObj, catid) => {
  return models.userCategory.update(inputsObj, {
    where: {
          catid
        }
  });
};