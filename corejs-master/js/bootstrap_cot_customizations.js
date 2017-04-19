function querystring(key) {
    var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
    var r=[], m;
    while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
    return r;
}

function changeFontSize(newVal, reset) {
    if (reset) {
        deleteCookie('fontsize');
    } else {
        setCookie('fontsize', newVal);
    }
    $('body').css('font-size', newVal);
    $('#increaseFontSize')[0].disabled = newVal == '1.5em';
    $('#decreaseFontSize')[0].disabled = newVal == '.7em'

    if ($.isFunction(window["setPageTabHeight"])) {
        setPageTabHeight();
    }
    setConsistentHeight(".tabNavigation", ".nav-tabs a");
    setConsistentHeight(".carousel", ".item");
    if (typeof($gallery) != "undefined") {
        $gallery.flickity('resize');
        setConsistentHeightHP(".r5", ".linkBoxInside");
    }
}
function increaseFontSize() {
    var val = getCookie('fontsize') || '1.1em';
    changeFontSize(Math.min(parseFloat(val) + 0.1, 1.5) + 'em');
}

function decreaseFontSize() {
    var val = getCookie('fontsize') || '.9em';
    changeFontSize(Math.max(parseFloat(val) - 0.1, 0.7) + 'em');
}

function resetFontSize() {
    changeFontSize('1em', true);
}

function applyFontSize() {
    var val = getCookie('fontsize');
    if(val) {
        changeFontSize(val);
    }
}

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000))
    document.cookie = key + '=' + value + ';path=/;expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function deleteCookie(key) {
    document.cookie = key + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function gglTranslate(key) {
    var oURL;
    if (document.referrer!="") {oURL=encodeURIComponent(document.referrer);} else {oURL="http%3a%2f%2fwww1.toronto.ca%2f";}
    document.location.href="http://translate.google.com/translate?u=" + oURL + "&sl=en&tl=" + key + "&hl=en&ie=UTF-8";
}
function translatePage() {
    document.location.href = "/wps/portal/contentonly?vgnextoid=4be8b9bd23805410VgnVCM10000071d60f89RCRD&vgnextchannel=8e79f9be8db1c310VgnVCM1000006cd60f89RCRD";
}
function setConsistentHeight(strParentSelector, strChildSelector) {
    var itemsParent = $(strParentSelector);
    var heights = [];
    var tallest;

    itemsParent.each (
        function () {
            var items = $(this).find(strChildSelector);
            if (items.length) {
                items.each( function () {$(this).css('height','auto'); });
                items.each( function () { heights.push($(this).height()); });
                tallest = Math.max.apply(null, heights) + 10;
                items.each( function () {$(this).css('height',tallest + 'px'); });
            }
        })
}

function dismissLD() {
    document.cookie = "lddismiss=true; path=/";
}

function processLDResponse(data) {
    if (data.items.title=="Notice") {
        var sModal = '<div class="modal fade" tabindex="-1" role="dialog" id="ldModal" style="z-index: 9999999;"><div class="modal-dialog"><div class="modal-content">';
        sModal += '<div class="modal-header">';
        sModal += '<h4 class="modal-title">' + data.items.title + '</h4></div><div class="modal-body"><p>' + data.items.summary + '</p></div>'
        sModal += '<div class="modal-footer" style="text-align: center;"><button onclick="dismissLD();" type="button" class="btn btn-primary" data-dismiss="modal">Continue</button>';
        sModal += '</div></div></div></div>';
        $( "body" ).append( sModal );
        $( ".modal a").css('text-decoration', 'underline');
        $('#ldModal').modal({backdrop: false});
    }
}

$(function() {

    if (querystring("tab")!="") {
        if ($(".tabNavigation").length>0) {
            $(".tabNavigation ul.nav li.active").removeClass("active");
            $(".tabNavigation .tab-content .tab-pane.active").removeClass("active");
            var strSelector = ".tabNavigation ul.nav li:eq(" + parseInt(querystring("tab")) +")";
            $(strSelector).addClass("active");
            strSelector = ".tabNavigation .tab-content .tab-pane:eq(" + parseInt(querystring("tab")) +")";
            $(strSelector).addClass("active");
        }
    }

});