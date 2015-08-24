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
    setEnv: function(env){
      this.config = new IntentaEnvironment(env);
    },
    setToken: function(token){
      this.config.set("token", token);
    },
    run : function(){

      if(this.config.get("token") == null){
        IntentaDebug("Please set your config token ex: config.set('token', 'abc'); ");
        return false;
      }

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