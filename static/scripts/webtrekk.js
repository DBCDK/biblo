window._tiConfig = window._tiConfig || {
  tiDomain: 'responder.wt-safetag.com',// Domain for tracking
  tiId: '476651662471322',// Tracking ID
  option: { }
};

/** start TagIntegration loader  */
(function(c,d,a,f){c.wts=c.wts||[];var g=function(b){var a="";b.customDomain&&b.customPath?a=b.customDomain+"/"+b.customPath:b.tiDomain&&b.tiId&&(a=b.tiDomain+"/resp/api/get/"+b.tiId+"?url="+encodeURIComponent(c.location.href)+"&v=5");if(b.option)for(var d in b.option)a+="&"+d+"="+encodeURIComponent(b.option[d]);return a};if(-1===d.cookie.indexOf("wt_r=1")){var e=d.getElementsByTagName(a)[0];a=d.createElement(a);a.async=!0;a.onload=function(){if("undefined"!==typeof c.wt_r&&!isNaN(c.wt_r)){var b=
  new Date,a=b.getTime()+1E3*parseInt(c.wt_r);b.setTime(a);d.cookie="wt_r=1;path=/;expires="+b.toUTCString()}};a.onerror=function(){"undefined"!==typeof c.wt_mcp_hide&&"function"===typeof c.wt_mcp_hide.show&&(c.wt_mcp_hide.show(),c.wt_mcp_hide.show=function(){})};a.src="//"+g(f);e.parentNode.insertBefore(a,e)}})(window,document,"script",_tiConfig);
