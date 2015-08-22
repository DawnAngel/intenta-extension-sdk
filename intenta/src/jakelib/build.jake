var UglifyJS = require('../node_modules/uglify-js');
var JSStringEscape = require('../node_modules/js-string-escape')


var Config = {
  templates_dir : "templates/",
  libs_dir:"libs/"
};

namespace('build', function(){

  desc('This builds everything for production');
  task('production', [], function () {
    start("********** PRODUCTION BUILD *****************");
    var main = jake.Task['build:concat'];

    main.addListener('complete', function () {
      complete();
      end("************* END PRODUCTION BUILD ****************");
    });
    main.invoke();

  });

  desc('Creates a templates class from all templates in /templates dir.');
  task('templates', [], function () {
    // Code to concat and minify goes here
    fs = require('fs')
    console.log("Creating a templates class from:");
    function getTemplateAsString(path){
      file = Config.templates_dir + path;
      console.log("Loading Template:" + file);
      response = UglifyJS.minify([file]);
      response = JSStringEscape(response.code);
      return response;
    }

    templates = fs.readdirSync('templates')


    fd = fs.openSync(Config.libs_dir + "/templates.js", 'w');
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

    end("Done creating templates class.");
  });


  desc('Concat all files for build.');
  task('concat_bg', [], function () {
    console.log("Concatenating the source background files");

    var result = concat({
      src: [
        "./libs/env.js",
        "./libs/debugger.js",
        "./libs/ajax.js",
        "./libs/agent_modules/response_monitor.js",
        "./libs/agent_modules/page_monitor.js",
        "./libs/agent.js",
      ],
      dest: '../dist/intenta_background.js',           // optional
      header: '// Start: Intenta.io Chrome Extension Background code',  // optional
      separator: '\n',                      // optional
      footer: '// End: Intenta.io Chrome Extension Background code'               // optional
    });

    // returned result is an object containing:
    //     {String} code   The concatenated data
    //     {String} src    The list with resolved filenames

    end("Done Concatenating the  background files");
  });

  desc('Concat all files for build.');
  task('concat_cs', ['templates'], function () {
    console.log("Concatenating the content script files");

    var result = concat({
      src: [
        "./libs/env.js",
        "./libs/debugger.js",
        "./libs/ajax.js",
        "./libs/templates.js",
        "./libs/pixeler.js",
      ],
      dest: '../dist/intenta_content_script.js',           // optional
      header: '// Start: Intenta.io Chrome Extension Content Script code',  // optional
      separator: '\n',                      // optional
      footer: '// End: Intenta.io Chrome Extension Content Script code'               // optional
    });

    // returned result is an object containing:
    //     {String} code   The concatenated data
    //     {String} src    The list with resolved filenames
    return result;
    end("Done Concatenating the content script files");

  });

  desc('Concat all files for build.');
  task('concat', ['concat_cs','concat_bg'], function (result) {
    end("Done concatenating source files");
  });


});