function IntentaTemplates(){
	 this.facebook = "!function(){var e=window._fbq||(window._fbq=[]);if(!e.loaded){var d=document.createElement(\"script\");d.async=!0,d.src=\"https://connect.facebook.net/en_US/fbds.js\";var n=document.getElementsByTagName(\"script\")[0];n.parentNode.insertBefore(d,n),e.loaded=!0}e.push([\"addPixelId\",\"[[addPixelId]]\"])}(),window._fbq=window._fbq||[],window._fbq.push([\"track\",\"PixelInitialized\",{}]);";

	 this.retargeter = "if(\"undefined\"==typeof _rt_cgi){var _rt_cgi=[[_rt_cgi]],_rt_base_url=\"https://lt.retargeter.com/\",_rt_js_base_url=\"https://s3.amazonaws.com/V3-Assets/prod/client_super_tag/\",_rt_init_src=_rt_js_base_url+\"init_super_tag.js\",_rt_refresh_st=!1,_rt_record=function(t){\"undefined\"==typeof document.getElementsByTagName(\"_rt_data\")[0]&&setTimeout(function(){_rt_record(t)},25)};!function(){var t=document.createElement(\"script\");t.src=_rt_init_src,document.getElementsByTagName(\"head\")[0].appendChild(t)}()}";

	 this.getTemplate = function(template){ 
 	 if(this.hasOwnProperty(template)){
 		 return this[template];
 		}else{
 			return false;
 		}
 		}
return this; 
}