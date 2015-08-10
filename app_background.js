console.log("Loaded BG");

var config = new IntentaEnvironment('local');
config.set('token', 'test');

var intentaAgent = new IntentaAgent();
intentaAgent.init(config);

