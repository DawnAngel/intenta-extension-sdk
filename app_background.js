console.log("Loaded BG");

var IntentaConfig = new IntentaEnvironment('local');
IntentaConfig.set('token', 'test');

var intentaAgent = new IntentaAgent();
intentaAgent.init();

