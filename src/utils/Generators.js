
var generateFileName = function(original){
    var explode = original.split('.');
    var time = new Date();
    var fileName = explode[0]+"-"+time.getTime()+"."+explode[1];

    return fileName;
}

module.exports = {generateFileName};