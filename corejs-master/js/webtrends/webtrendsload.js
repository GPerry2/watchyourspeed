window.webtrendsAsyncInit=function(){
    var dcs=new Webtrends.dcs().init({
        // begin: user modifiable
        dcsid:dcsid_var,
        domain:"stats.elignum.net",
        timezone:-5,
        i18n:true,
        offsite:true,
        onsite:true,
        formbutton:true, //Added for form button support
        rightclick:true, //Added for right click support
        download:true,
        downloadtypes:"xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip,mp3,mp4,ppt,pptx,swf,avi,docm,xlsm,pptm",
        anchor:true,
        javascript: true,
        mailto:true, //Added for mail tracking support
        metanames:"DC.title,DC.identifier", //Comma delimited list of Meta tags to scrape from header and add in SDC request
        onsitedoms:new RegExp("\.toronto.ca"),
        fpcdom:".toronto.ca",
        plugins:{
            //hm:{src:"//s.webtrends.com/js/webtrends.hm.js"}
            debug:{src:"//www1.toronto.ca/wcmAsset/js/web_analytics/webtrends.debug.js" }
        }
    }).track();
};
