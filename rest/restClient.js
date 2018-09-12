
// var googleTranslate = require('google-translate')("591097321392-m5jb77mmj9mfbv0hv3phl0dkt0ctroh6.apps.googleusercontent.com");
var googleTranslate = require('google-translate')("AIzaSyAwGAHcIZGDgr2z-3qSZ7oO-GpiooK8FnY");

function translate(str){
    
  googleTranslate.translate('Jag heter brandon', 'en', function(err, translation) {
    if(translation){
      console.log(translation.translatedText);
    }
    if(err){
      console.log(err);
    }
    return "Test"
    // =>  Mi nombre es Brandon
  });
}

module.exports = {
    translate: translate
}

translate("Jag");