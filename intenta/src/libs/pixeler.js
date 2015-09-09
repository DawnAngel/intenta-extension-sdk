var IntentaPixeler = function(){
  return {
    self : this,
    watch : function(){
      IntentaDebug("Set Watcher");
      var self = this;
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          //IntentaDebug(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
          //Background will first check to see if tab is ready to pixel.
          if (request.hasOwnProperty('intenta') && (request.intenta.action == 'can_pixel?')){
            sendResponse({reply: "yes"});
          }
          if (request.hasOwnProperty('intenta') && (request.intenta.action == 'pixel')){
            self.setPixel(request.intenta.pixel);
            sendResponse({reply: "pixeled"});
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
      var templates = IntentaTemplates();
      return templates.getTemplate(pixel.template);
    },
    populateTemplate: function(template, params){
      for(var key in params){
        // Replace variable in template
        var regExp = new RegExp("\\[\\["+key+"\\]\\]");
        template.src = template.src.replace(regExp, params[key]);
      }

      return template;
    },
    addToDom: function(templateObj){

      if (templateObj.type == ".js"){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        var code = templateObj.src;
        try {
          s.appendChild(document.createTextNode(code));
          document.body.appendChild(s);
        } catch (e) {
          IntentaDebug("Unable to load" + code);
        }
      }
      if (templateObj.type == ".iframe"){

        try {

          var iframe = document.createElement('iframe');
          iframe.height = 0;
          iframe.width = 0;
          iframe.src = templateObj.src.replace(/"/g, "");

          document.body.appendChild(iframe);

        } catch (e) {
          IntentaDebug(templateObj.template_name + "failed to load.");
        }
      }

    }
  }
}