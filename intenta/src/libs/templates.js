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
        "src": "adroll_adv_id=\"[[adroll_adv_id]]\",adroll_pix_id=\"[[adroll_pix_id]]\",function(){var t=window.onload;window.onload=function(){__adroll_loaded=!0;var o=document.createElement(\"script\"),d=\"https:\"==document.location.protocol?\"https://s.adroll.com\":\"http://a.adroll.com\";o.setAttribute(\"async\",\"true\"),o.type=\"text/javascript\",o.src=d+\"/j/roundtrip.js\",((document.getElementsByTagName(\"head\")||[null])[0]||document.getElementsByTagName(\"script\")[0].parentNode).appendChild(o),t&&t()}}();",
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
        "src": "\"http://insight.adsrvr.org/tags/[[p1]]/[[p2]]/iframe\";",
        "type": ".iframe"
    }
};
	 return this; 
}