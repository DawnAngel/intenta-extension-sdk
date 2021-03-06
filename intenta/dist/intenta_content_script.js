/**
* Intenta.io Chrome Extension SDK
*   Version: 2.0.1
*   Homepage: www.intenta.io
*   Support: support@intenta.io
**/
var IntentaEnvironment = function(env){

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
    settings: IntentaVars[env],
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
  var debug = false;
  if ( debug && (typeof console == "object")) {
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
function IntentaTemplates(){
  this.getTemplate = function(templateName){

    if(this.templates.hasOwnProperty(templateName)){
      var templateObject = this.templates[templateName];
      return templateObject;
    }else{
      return false;
    }
  }

  this.templates = {
    "adroll": {
        "src": "var adroll_adv_id=\"[[adroll_adv_id]]\",adroll_pix_id=\"[[adroll_pix_id]]\";!function(){__adroll_loaded=!0;var t=document.createElement(\"script\"),e=\"https:\"==document.location.protocol?\"https://s.adroll.com\":\"http://a.adroll.com\";t.setAttribute(\"async\",\"true\"),t.type=\"text/javascript\",t.src=e+\"/j/roundtrip.js\",((document.getElementsByTagName(\"head\")||[null])[0]||document.getElementsByTagName(\"script\")[0].parentNode).appendChild(t)}();",
        "type": ".js"
    },
    "connexity": {
        "src": "CxTv={Ve:\"[[Ve]]\",A:\"[[A]]\",X:\"[[X]]\",Op:\"[[Op]]\"},CxTp=\"https:\"==document.location.protocol?\"https:\":\"http:\",CxTr=\"https:\"==CxTp?\"//t\":\"//s\",CxTs=document.createElement(\"script\"),CxTs.type=\"text/javascript\",CxTs.async=!0,CxTs.src=CxTp+CxTr+\".cxt.ms/action2.js\",CxTn=document.getElementsByTagName(\"script\")[0],CxTn.parentNode.insertBefore(CxTs,CxTn);",
        "type": ".js"
    },
    "facebook": {
        "src": "!function(){var e=window._fbq||(window._fbq=[]);if(!e.loaded){var d=document.createElement(\"script\");d.async=!0,d.src=\"https://connect.facebook.net/en_US/fbds.js\";var n=document.getElementsByTagName(\"script\")[0];n.parentNode.insertBefore(d,n),e.loaded=!0}e.push([\"addPixelId\",\"[[addPixelId]]\"])}(),window._fbq=window._fbq||[],window._fbq.push([\"track\",\"PixelInitialized\",{}]);",
        "type": ".js"
    },
    "retargeter": {
        "src": "if(\"undefined\"==typeof _rt_cgi){var _rt_cgi=[[_rt_cgi]],_rt_base_url=\"https://lt.retargeter.com/\",_rt_js_base_url=\"https://s3.amazonaws.com/V3-Assets/prod/client_super_tag/\",_rt_init_src=_rt_js_base_url+\"init_super_tag.js\",_rt_refresh_st=!1,_rt_record=function(t){\"undefined\"==typeof document.getElementsByTagName(\"_rt_data\")[0]&&setTimeout(function(){_rt_record(t)},25)};!function(){var t=document.createElement(\"script\");t.src=_rt_init_src,document.getElementsByTagName(\"head\")[0].appendChild(t)}()}",
        "type": ".js"
    },
    "tradedesk": {
        "src": "\"http://insight.adsrvr.org/tags/[[p1]]/[[p2]]/iframe\"",
        "type": ".iframe"
    }
  };
  return this;
}
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

var intentaPixel = new IntentaPixeler();
intentaPixel.watch();
// End: Intenta.io Chrome Extension Content Script code
