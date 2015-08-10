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

      if(typeof IntentaConfig == 'undefined'){
        IntentaDebug("Please define an config object var IntentaConfig = new IntentaEnvironment();");
        return false;
      }
      if(IntentaConfig.get("token") == null){
        IntentaDebug("Please set your config token ex: IntentaConfig.set('token', 'abc'); ");
        return false;
      }
      IntentaDebug(IntentaConfig.get());
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