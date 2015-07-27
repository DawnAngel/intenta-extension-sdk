jsStringEscape = require('./node_modules/js-string-escape')
var UglifyJS = require('./node_modules/uglify-js')

fs = require('fs')
console.log("Start");
function getTemplateAsString(path){
  file = './templates/'+path
  console.log("Reading File: " + file);
  //template = fs.readFileSync(file, {encoding : "utf8"});
  //console.log(template);
  //return jsStringEscape(template);
  response = UglifyJS.minify([file]);
  response = jsStringEscape(response.code);
  return response;
}
templates = fs.readdirSync('./templates')

fd = fs.openSync("./libs/templates.js", 'w');
fs.write(fd, "function IntentaTemplates(){");
fs.write(fd, "\r\n");


templates.forEach(function(template){
  tmpStr = getTemplateAsString(template);
  fs.write(fd, "\r\n");
  fs.write(fd, "\t this." + template.replace('.js','') + " = \"" + tmpStr +"\";\r\n");
  fs.write(fd, "\r\n");
});

fs.write(fd, "\r\n");
fs.write(fd, "return this; \r\n");
fs.write(fd, "}");

console.log("Done");