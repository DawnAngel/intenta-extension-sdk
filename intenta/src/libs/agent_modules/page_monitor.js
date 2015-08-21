var IntentaPageMonitor = function(){
  return {
    self : this,
    getDomain : function(){
      return this.config('domain')
    },
    init : function(config){
      this.config = config;
      this.token = this.config.get('token');
      this.activateTabUpdatedListener();
    },
    activateTabUpdatedListener : function(){
      var self = this;
      chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

        if (changeInfo.status == 'complete') {
          console.log("Tab Completed Change");
          var tabData = {
            tabId : tabId,
            changeInfo : changeInfo,
            tab : tab
          };

          self.request(tabData);
        }
      });
    },
    pixelResponseSuccess : function(data, pixelData){
      IntentaDebug("pixelResponseSuccess");
      IntentaDebug(data);

      var message = {
        intenta : {
          action: 'pixel',
          pixel:data.pixel
        }
      };

      chrome.tabs.sendMessage(pixelData.tab.id, message, function(response) {
        console.log("Reponse from Pixeler");
        console.log(response);
      });

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

    getProtocol: function(url){
      var link = document.createElement('a');
      link.setAttribute('href', url);
      return link.protocol;
    },
    request : function(tabData){
      var self = this;

      var message = {
        intenta : {
          action: 'can_pixel?'
        }
      };

      IntentaDebug("Asking Pixeler if can_pixel?");
      chrome.tabs.sendMessage(tabData.tab.id, message, function(response) {
        IntentaDebug("Pixeler replied.");
        IntentaDebug(response);

        if(response.hasOwnProperty('reply') && (response.reply == 'yes')){
          var protocol = self.getProtocol(tabData.tab.url);

          //Only Monitor http & https
          var allowedProtocols = ['http:', 'https:'];
          if(allowedProtocols.indexOf(protocol) >= 0){
            IntentaAjax.request({
              json: true,
              url: protocol + '//' + this.config.get("domain") + '/pixel.json',
              method: 'get',
              data: {
                "url" : tabData.tab.url,
                "token" : self.token,
                "v" : self.config.get('version')
              },
              headers: {
                'Content-type': 'application/json',
              }
            })
              .setHost(this) //Set context of callbacks
              .done(function(response, xhr){
                if(response.hasOwnProperty('data') && response.data.hasOwnProperty("pixel")){
                  self.pixelResponseSuccess(response.data, tabData);
                }
              })
              .fail(this.pixelResponseFail)
              .always(this.pixelResponseAlways);
          }
        }else{
          console.log("You need to setup the content script side of the Intenta code. It is not receiving a response to can_send?");
        }

      });
    }
}}
