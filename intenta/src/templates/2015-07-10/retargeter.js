if( typeof _rt_cgi == "undefined" ){
  var _rt_cgi = [[_rt_cgi]];
  var _rt_base_url = "https://lt.retargeter.com/";
  var _rt_js_base_url = "https://s3.amazonaws.com/V3-Assets/prod/client_super_tag/";
  var _rt_init_src = _rt_js_base_url+"init_super_tag.js";
  var _rt_refresh_st = false;
  var _rt_record = function(params){if(typeof document.getElementsByTagName("_rt_data")[0]=="undefined"){setTimeout(function(){_rt_record(params);},25);}};
  (function() {var scr = document.createElement("script");scr.src = _rt_init_src;document.getElementsByTagName("head")[0].appendChild(scr);})();
}
