var Intenta = function(){

    var self = this;
    return {
      self : this,
      init : function(token, env){
        if(typeof env != 'undefined'){
          this.env = env;
        }
        this.token = token;
      },
      env : 'local',  //Default to production. only change for internal dev not 3rd party development.
      debug: true,

      token : null,
      settings: {
        "local" : { //Internal Dev
          "domain" : "pixel.local.intenta.io"
        },
        "development" : { //Internal Dev
          "domain" : "pixel.dev.intenta.io"
        },
        "sandbox" : { //3rd Party Integrations
          "domain" : "pixel.sandbox.intenta.io"
        },
        "production" : { //3rd Party Integrations
          "domain" : "pixel.intenta.io"
        }
      },
      config : function(key){
        return this.settings[this.env][key]
      },
      debug : function(message){
        IntentaDebug(message);
      },
      getDomain : function(){
        return this.config('domain')
      },
      populateTemplate: function(template, data){
        var params = data.params;
        for(var key in params){
          //Replace variable in template
          var regExp = new RegExp("\\[\\["+key+"\\]\\]");
          template = template.replace(regExp, params[key]);
        }
        console.log(template);
        return template;
      },
      getAndInjectSnippet : function(pixel){
        IntentaDebug(pixel);

        var ajaxVersion = false;

        if(ajaxVersion){
          templateUrl = chrome.extension.getURL('src/templates/'+pixel.template+'.js')
          IntentaDebug('Use Ajax Version');
          Ajax.request({
            url: templateUrl,
            method: 'get',
            headers: {
              'Content-type': 'text/javascript'
            }
          })
            .setHost(this)
            .done(function(template, extra) {

              IntentaDebug(" getSnippet Ajax returned");
              template = this.populateTemplate(template, pixel)
              this.injectSnippet(template);

            })
            .fail(function(xhr) {
              IntentaDebug("getSnippet Failed");
            })
            .always(function(xhr) {
              //IntentaDebug("getSnippet Always");
            });
        }else{
          IntentaDebug('Use Class Version');
          templates = IntentaTemplates();
          template = this.populateTemplate(templates[pixel.template], pixel)
          this.injectSnippet(template);
        }

      },
      addToDomAsScript: function(string){
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
      },
      injectSnippet:function(snippet){
        IntentaDebug(snippet);
        this.addToDomAsScript(snippet);
      },
      pixelResponseSuccess : function(response, extra){
        IntentaDebug("pixelResponseSuccess");
        this.getAndInjectSnippet(response.data.pixel);
      },
      pixelResponseFail : function(xhr, extra){
        IntentaDebug("pixelResponseFail Failed: " + xhr.response);
        try{
          var response = JSON.parse(xhr.response);
        }catch(error){
          IntentaDebug("Unable to handle error: " + error.message);
        }
      },
      pixelResponseAlways : function(xhr, extra){
          IntentaDebug("Always");
      },
      getPixel : function(){
        //IntentaDebug(document.location);

        var customer_id = 123; //@TODO load from localstorage / cookies.
        var pixelData = {
          "url" : document.location.href,
          "customer_id": customer_id,
          "token" : this.token
        };

        IntentaDebug(pixelData);
        IntentaDebug(localStorage);
        IntentaDebug("Ajax start");
        //Ex url: pixel.intenta.io/pixel?token=abcd&url=hij&customer_id=23#
        Ajax.request({
              json: true,
              url: document.location.protocol + '//' + this.getDomain() + '/pixel.json',
              method: 'get',
              data: pixelData,
              headers: {
                  'Content-type': 'application/json'
              }
          })

          .setHost(this) //Set context of callbacks
          .done(this.pixelResponseSuccess)
          .fail(this.pixelResponseFail)
          .always(this.pixelResponseAlways);
      }
    }
}