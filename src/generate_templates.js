jsStringEscape = require('./node_modules/js-string-escape')
var UglifyJS = require('./node_modules/uglify-js')

fs = require('fs')
console.log("Start");
function getTemplateAsString(path){
  file = './templates/'+path
  console.log("Reading File: " + file);
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
  fs.write(fd, "\t this." + template.replace('.js','') + " = \"" + tmpStr +"\";\r\n");
  fs.write(fd, "\r\n");
});

fs.write(fd, "\t this.getTemplate = function(template){ \r\n \t if(this.hasOwnProperty(template)){\r\n \t\t return this[template];\r\n \t\t}else{\r\n \t\t\treturn false;\r\n \t\t}\r\n \t\t}");

fs.write(fd, "\r\n");
fs.write(fd, "\t return this; \r\n");
fs.write(fd, "}");

console.log("Done");