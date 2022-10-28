const fs = require('fs');
const util = require('util');
const _this = this;


/*exports.getUser = async function(id) {
  return new Promise((resolve, reject) => {
    console.log('reading customer from database');
    resolve({id: id, points: 10});
  });
}*/

exports.mail = function(email, message) {
  return false;
}

exports.getUser = function(id) {
  console.log('Reading customer from database');
  return {id: id, points: 11};
}

exports.dateFormat = dateArgs => {
  const dateFn = new Date(dateArgs);
  return dateFn.toLocaleString("en-US");
} 

exports.sessTermsArrayObj = (objArg, arryArg, key = 'sess') => {
  let ids = (key == 'sess') ? 'sessid' : 'intid';
  const result = arryArg.map(sub => {
    let xtraload = (sub['edusess']) ? 'edusess' : (sub['edusessint']) ? 'edusessint' : 'sessint';
    if (sub['startDate'] != null || sub['endDate'] != null){
      sub['startDate'] = _this.dateFormat(sub['startDate']);
      sub['endDate'] = _this.dateFormat(sub['endDate']);
    }
    let secTerms = objArg[sub[ids]];
    if (secTerms) {
      for(let index in secTerms){
        sub[index] = secTerms[index];
      }
    }
    delete sub[xtraload];
    return sub;
  });
  return result;
}

const makeDir = util.promisify(fs.mkdir);
exports.createDirectory = async path => {
  const userDir = await makeDir(path);
  const imgDir = await makeDir(path+'/'+'images');
  const docsDir = await makeDir(path+'/'+'docs');   
}

exports.fileUpload = (file, url) => {
  file.mv(url, function(err) {
   	if (err) return false;
 });
  return true;
} // fileUpload

exports.unlinkFile = fileurl => {
	if (fileurl == null) return true;
  	fs.unlink(fileurl, (err) => {
      if(err) return false;
    });
    return true;
}; // delete file

exports.random = (length = 14) => {
  return Math.random().toString(16).substr(2, length);
};

exports.validateFileInput = function (fileObj) {
  const variables = {
    verdict:  false,
    fileType: '',
    msg:      ''
  };
  const validExtentions = ["image/jpeg", "image/png", "image/jpg", "pdf"];
  if(!fileObj || Object.keys(fileObj).length === 0) { 
    variables.msg = "No files selected";
    return variables;
  };
  Object.values(fileObj).forEach(val => {
      if (!validExtentions.includes(val.mimetype)) { 
        variables.msg = "invalid file format";
      } else if (val.mimetype == "pdf") {
        variables.verdict = true;
        variables.fileType = "docs";
      }else {
        variables.verdict = true;
        variables.fileType = "images";
      }
  });
  return variables;
}


var looperfn = function(collection, callback){
    var length = collection.length;
    var results = [];
    var result;
    for (var i = 0; i < collection.length; i++){
        result = callback(collection[i], i);
        if (result){
            results = results.concat(result);
        }
    }
    return results;
};

function nestedInnerArryLoop(args) {
    var layers = iterator(args, function(inte){ return inte.intervals; });

    var rows = iterator(layers, function(secints){
        return (secints.dataValues.sessint.dataValues) ? secints.dataValues.sessint.dataValues : null;
    });
    return iterator(rows, function(item) { return item; });
}
/*let secints = nestedInnerArryLoop(secs);*/


/*const abc = (obj, arrArg, key = 'sess') => {
  let ids = (key == 'sess') ? 'sessid' : 'intid';
  const result = arrArg.map(sub => {
    let xtraload = (sub.edusess) ? 'edusess' : (sub.edusessint) ? 'edusessint' : 'sessint';
    if(sub.xtraload) delete sub.xtraload;
    if (sub.startDate != null || sub.endDate != null){
        sub.startDate = helpersFn.dateFormat(sub.startDate);
        sub.endDate = helpersFn.dateFormat(sub.endDate);
      }
      let secTerms = obj[sub[ids]];
      if (secTerms) {
        for(let index in secTerms){
          sub[index] = secTerms[index]
        }
      }
      delete sub.sessint;
      return sub;
    });
  return result;
}*/