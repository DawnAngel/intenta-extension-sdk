jsStringEscape = require('./node_modules/js-string-escape')

fs = require('fs')
console.log("Start");
function getTemplateAsString(path){
  file = './templates/'+path
  console.log("Reading File: " + file)
  template = fs.readFileSync(file, {encoding : "utf8"});
  console.log(template);
  return jsStringEscape(template);
}
templates = fs.readdirSync('./templates')

fd = fs.openSync("./templates/template.js", 'w');
fs.write(fd, "function IntentaTemplate(){");
fs.write(fd, "\r\n");



templates.forEach(function(template){
  tmpStr = getTemplateAsString(template);
  fs.write(fd, "\t this." + template.replace('.js','') + " = \"" + tmpStr +"\";\r\n");
  fs.write(fd, "\r\n");
});

fs.write(fd, "\r\n");
fs.write(fd, "}");



console.log("Done");