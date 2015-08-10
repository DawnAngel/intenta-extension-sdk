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
      "version" : "2015-07-25"
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