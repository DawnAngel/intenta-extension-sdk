function IntentaDebug(message){
  var debug = false;
  if ( debug && (typeof console == "object")) {
    console.log(message);
  }
}