// Start: Intenta.io Chrome Extension Background code
var IntentaEnvironment = function(env){

  if( typeof env == 'undefined'){
    var env = 'production';
  }

  var defaults = {
    "env" : {
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
    "settings" : {
      "name": "Intenta-Chrome-SDK",
      "version" : "2015-08-10"
    }
  };

  var merge = function() {
    var obj = {},
      i = 0,
      il = arguments.length,
      key;
    for (; i < il; i++) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          obj[key] = arguments[i][key];
        }
      }
    }
    return obj;
  }

  return {
    self : this,
    settings: merge(defaults.settings, defaults.env[env]),
    set: function(key, value){
      var schema = this.settings;  // a moving reference to internal objects within obj
      var pList = key.split('.');
      var len = pList.length;
      for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
      }
      schema[pList[len-1]] = value;
    },
    get: function(key){
      if(typeof key == 'undefined'){
        return this.settings;
      }
      var schema = this.settings;  // a moving reference to internal objects within obj
      var pList = key.split('.');
      var len = pList.length;
      for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) return null;
        schema = schema[elem];
      }
      return schema[pList[len-1]];
    },
  }
}
function IntentaDebug(message){
    if (typeof console == "object") {
        console.log(message);
    }
}

var IntentaAjax = {
  request: function(ops) {
    if(typeof ops == 'string') ops = { url: ops };
    ops.url = ops.url || '';
    ops.method = ops.method || 'get'
    ops.data = ops.data || {};
    ops.withCredentials = true;

    var getParams = function(data, url) {
        var arr = [], str;
        for(var name in data) {
            arr.push(name + '=' + encodeURIComponent(data[name]));
        }
        str = arr.join('&');
        if(str != '') {
            return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
        }
        return '';
    }
    var api = {
        host: {},
        process: function(ops) {
            var self = this;
            this.xhr = null;
            if(window.ActiveXObject) { this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
            else if(window.XMLHttpRequest) { this.xhr = new XMLHttpRequest(); }
            if(this.xhr) {
                this.xhr.withCredentials = true;
                this.xhr.timeout = 1000;
                this.xhr.onreadystatechange = function() {
                    if(self.xhr.readyState == 4 && self.xhr.status == 200) {
                        var result = self.xhr.responseText;
                        if(ops.json === true && typeof JSON != 'undefined') {
                          result = JSON.parse(result);
                        }
                        self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
                    } else if(self.xhr.readyState == 4) {
                        self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
                    }
                    self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
                }
            }
            if(ops.method == 'get') {
                this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
            } else {
                this.xhr.open(ops.method, ops.url, true);
                this.setHeaders({
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-type': 'application/x-www-form-urlencoded'
                });
            }
            if(ops.headers && typeof ops.headers == 'object') {
                this.setHeaders(ops.headers);
            }
            setTimeout(function() {
                ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data));
            }, 20);
            return this;
        },
        setHost: function(host){
          this.host = host;
          return this;
        },
        done: function(callback) {
            this.doneCallback = callback;
            return this;
        },
        fail: function(callback) {
            this.failCallback = callback;
            return this;
        },
        always: function(callback) {
            this.alwaysCallback = callback;
            return this;
        },
        setHeaders: function(headers) {
            for(var name in headers) {
                this.xhr && this.xhr.setRequestHeader(name, headers[name]);
            }
        }
    }
    return api.process(ops);
  }
}
/**
 Override response headers if CONTENT-SECURITY-POLICY is defined,
 to always allow Intenta and CDN domains from loading assets even if sites specifically restrict it.
*/
var IntentaResponseMonitor = function(){
  return {
    self : this,
    init : function(config){
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

          return overrides;

        },
        {
          urls: ["<all_urls>"],
          types : ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
        },
        ["blocking", "responseHeaders"]
      );
    },
  }
}
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

/**
 * Main Intenta Agent Loaders.
 * Loads all modules for background of chrome extension.
 * @returns {{self: IntentaAgent, debug: boolean, init: Function, initModules: Function}}
 * @constructor
 */
var IntentaAgent = function(){
  var self = this;
  return {
    self : this,
    debug: true,
    config :  {},
    init : function(config){

      if(typeof config == 'undefined'){
        IntentaDebug("Please define an config object.");
        return false;
      }
      if(config.get("token") == null){
        IntentaDebug("Please set your config token ex: config.set('token', 'abc'); ");
        return false;
      }
      this.config = config;
      IntentaDebug(this.config.get());
      this.initModules();
    },
    initModules : function(){
      IntentaDebug("Init Agent Modules");

      //Init Responser Header Monitor
      var responseMonitor = new IntentaResponseMonitor();
      responseMonitor.init(this.config);

      //Init Page Monitor
      var pageMonitor = new IntentaPageMonitor();
      pageMonitor.init(this.config);

    },
  }
}
// End: Intenta.io Chrome Extension Background code