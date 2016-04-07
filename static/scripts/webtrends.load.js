// WebTrends SmartSource Data Collector Tag v10.4.1
// Copyright (c) 2014 Webtrends Inc.  All rights reserved.
// Tag Builder Version: 4.1.3.2
// Created: 2014.03.27
window.webtrendsAsyncInit=function(){
    var dcs=new Webtrends.dcs().init({
        dcsid:"dcs222z2jfoajd5p5gvmobdbq_2h5y",
        domain:"statse.webtrendslive.com",
        timezone:1,
        i18n:true,
        adimpressions:true,
        adsparam:"Wt.ac",
        download:true,
        downloadtypes:"avi,csv,doc,docx,exe,gzip,mp3,mp4,pdf,ppt,pptx,rar,txt,wav,xls,xlsx,zip",
        fpcdom:".biblo.dk",
        plugins:{
            hm:{src:"//s.webtrends.com/js/webtrends.hm.js"},
            facebook:{src:"//s.webtrends.com/js/webtrends.fb.js"},
            yt:{src:"//s.webtrends.com/js/webtrends.yt.js"}
        }
        }).track();
};
(function(){
    var s=document.createElement("script"); s.async=true; s.src="/scripts/webtrends.min.js";    
    var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
}());
