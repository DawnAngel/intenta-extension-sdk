var IntentaPixeler = function(){
  return {
    self : this,
    watch : function(){
      console.log("Set Watcher");
      var self = this;
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          console.log(self);
          console.log("message");
          console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
          //Background will first check to see if tab is ready to pixel.
          if (request.hasOwnProperty('intenta') && (request.intenta.action == 'can_pixel?')){
            sendResponse({reply: "yes"});
          }
          if (request.hasOwnProperty('intenta') && (request.intenta.action == 'pixel')){
            self.setPixel(request.intenta.pixel);
            //sendResponse({farewell: "goodbye"});
          }

        });
    },
    setPixel: function(pixel){
      //If a template exists for this pixel set it.
      if(template = this.getTemplate(pixel)){
        template = this.populateTemplate(template, pixel.params);
        this.addToDom(template);
      }
    },
    getTemplate: function(pixel){
      templates = IntentaTemplates();
      return templates.getTemplate(pixel.template);
    },
    populateTemplate: function(template, params){
      for(var key in params){
        // Replace variable in template
        var regExp = new RegExp("\\[\\["+key+"\\]\\]");
        template = template.replace(regExp, params[key]);
      }
      console.log(template);
      return template;
    },
    addToDom: function(string){
      var s = document.createElement('script');
      s.type = 'text/javascript';
      var code = string;
      try {
        s.appendChild(document.createTextNode(code));
        document.body.appendChild(s);
      } catch (e) {
        s.text = code;
        document.body.appendChild(s);
      }
    }
  }
}