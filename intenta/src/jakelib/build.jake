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
    var templates = {};
    var fs = require('fs');
    function getTemplateAsString(file){
      console.log("Loading Template:" + file);
      var response = UglifyJS.minify([file]);
      //response = JSStringEscape(response.code);
      response = response.code;
      return response;
    }

    function addTemplates(templates, dir){
      var pathFinder = require('path')


      var path = Config.templates_dir + dir;
      var files = fs.readdirSync(path);
      files.forEach(function(file){
        var extension = pathFinder.extname(file);

        templates[file.replace(extension,'')] = {
          template_name : templates[file.replace(extension,'')],
          src : getTemplateAsString(path + '/' + file),
          type : extension
        };

      });
    }

    function loadTemplates(templates){
      //Loop through each dir and append template files to array.
      var templateDirs = fs.readdirSync('templates');
      templateDirs.forEach(function(dir){

        addTemplates(templates, dir);
      });
    }

    loadTemplates(templates);

    //Write Templates Class
    function createTemplatesClass(templates){

      fd = fs.openSync(Config.libs_dir + "/templates.js", 'w');
      fs.write(fd, "function IntentaTemplates(){");
      fs.write(fd, "\r\n");

      //for (var templateName in templates){
      //  fs.write(fd, "\t this." + templateName + " = \"" + templates[templateName] +"\";\r\n");
      //  fs.write(fd, "\r\n");
      //}


      var methods = fs.readFileSync(Config.libs_dir + "/_template_methods.js", "utf8");

      //fs.write(fd, "\t this.getTemplate = function(template){ \r\n \t if(this.hasOwnProperty(template)){\r\n \t\t return this[template];\r\n \t\t}else{\r\n \t\t\treturn false;\r\n \t\t}\r\n \t\t}");
      fs.write(fd, methods);
      fs.write(fd, "\r\n\r\n\tthis.templates = " + JSON.stringify(templates, null, 4) + ";");

      fs.write(fd, "\r\n");
      fs.write(fd, "\t return this; \r\n");
      fs.write(fd, "}");
    }

    createTemplatesClass(templates);
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