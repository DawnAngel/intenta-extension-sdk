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