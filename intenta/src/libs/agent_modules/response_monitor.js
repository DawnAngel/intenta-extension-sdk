/**
 Override response headers if CONTENT-SECURITY-POLICY is defined,
 to always allow Intenta and CDN domains from loading assets even if sites specifically restrict it.
*/
var IntentaResponseMonitor = function(){
  return {
    self : this,
    init : function(config){
      IntentaDebug(config);
      if(typeof config == 'undefined'){
        this.config = config;
      }
      IntentaDebug("Loaded Response Monitor");
      this.overrideResponseHeaders();
    },
    overrideResponseHeaders: function () {
      /**
       *	Override requestHeaders of Content-Security-Policy
       * 	* http://content-security-policy.com/
       **/

      /*

      Until Chrome developers fix bug: https://code.google.com/p/chromium/issues/detail?id=526367 we can't override headers.

      var domainsToAdd = ['*.intenta.io', 's3.amazonaws.com'];

      function appendDomainsToPolicyHeaders(policy, domainsToAdd){

        var rules  = policy.split(';');
        rules = rules.map(function(s) { return s.trim() });
        for(var i = 0; i < rules.length; i++){
          var rulesToAppendTo = [
            'script-src', //Allow scripts to be loaded from other domains.
            'connect-src' //Allow xhr requests to other domain
          ];
          var rule = rules[i];
          var endOfRuleNameIndex = rule.indexOf(" ");

          if(endOfRuleNameIndex > 0){

            var ruleName = rule.substr(0, endOfRuleNameIndex);
            if(rulesToAppendTo.indexOf(ruleName) >= 0){
              rules[i] = rules[i] + ' ' + domainsToAdd.join(" ");
            }
          }
        }
        rules = rules.join(";"); //Concat rules and add last semi colon
        return rules;
      }

      //Add a listener to add Intenta to the response headers which allows intenta to run scripts and making xhr requests.
      chrome.webRequest.onHeadersReceived.addListener(function (details){

          var overrides = {};
          var blacklist = ["google.com"]; //Don't override on these sites, they cause problems.
          for(var blackIndex = 0; blackIndex < blacklist.length; blackIndex++){
            if(details.url.indexOf(blacklist[blackIndex])<0){

              for (i = 0; i < details.responseHeaders.length; i++) {
                if (details.responseHeaders[i].name.toUpperCase() == "CONTENT-SECURITY-POLICY") {

                  var policy = details.responseHeaders[i].value;
                  newRules = appendDomainsToPolicyHeaders(policy, domainsToAdd);
                  details.responseHeaders[i].value = newRules;

                }
              }


              overrides = { responseHeaders : details.responseHeaders};
            }
          }
          console.log("Logger");
          console.log(details.url);
          //console.log(details.responseHeaders);
          console.log(overrides)
          return overrides;

        },
        {
          urls: ["<all_urls>"],
          types : ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
        },
        ["blocking", "responseHeaders"]
      );
       */
    },
  }
}