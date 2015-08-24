  this.getTemplate = function(templateName){

    if(this.templates.hasOwnProperty(templateName)){
      var templateObject = this.templates[templateName];
      return templateObject;
    }else{
      return false;
    }
  }