var IntentaPageMonitor = function(){
  return {
    self : this,
    getDomain : function(){
      return this.config('domain')
    },
    init : function(config){
      this.config = config;
      this.token = IntentaConfig.get('token');
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
    pixelResponseSuccess : function(response, pixelData){

      IntentaDebug("pixelResponseSuccess");
      IntentaDebug(pixelData);
      chrome.tabs.sendMessage(pixelData.tab.id, message, function(response) {
        console.log("Reponse from Listener");
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

      //  get any piece of the url you're interested in
      link.hostname;  //  'example.com'
      link.port;      //  12345
      link.search;    //  '?startIndex=1&pageSize=10'
      link.pathname;  //  '/blog/foo/bar'
      link.protocol;  //  'http:'
      return link.protocol;
    },
    request : function(tabData){
      IntentaDebug("Page Monitor Request");
      IntentaDebug(tabData);
      message = {
        intenta: {
          action:'pixel',
          pixel :{
            template: "facebook",
            params:{
              addPixelId : '123423422'
            }
          }
        }
      }
      message = {
        intenta: {
          action:'pixel',
          pixel :{
            template: "retargeter",
            params:{
              _rt_cgi : '232'
            }
          }
        }
      }

      IntentaDebug("Local Storage");
      IntentaDebug(localStorage);

      var pixelData = {
        "url" : tabData.tab.url,
        "token" : this.token
      };

      var protocol = this.getProtocol(tabData.tab.url);

      //Skip some chrome specific protocols.
      var protocolsToSkip = ['chrome'];
      if(protocolsToSkip.indexOf(protocol) == -1){
        //Ex url: pixel.intenta.io/pixel?token=abcd&url=hij&customer_id=23#

        var customHeaders = {
          'Content-type': 'application/json',
        };

        IntentaAjax.request({
          json: true,
          url: protocol + '//' + IntentaConfig.get("domain") + '/pixel.json',
          method: 'get',
          data: pixelData,
          headers: customHeaders
        })
        .setHost(this) //Set context of callbacks
        .done(function(response, xhr){
          this.pixelResponseSuccess(response, tabData);
        })
        .fail(this.pixelResponseFail)
        .always(this.pixelResponseAlways);
      }

    }
}}
