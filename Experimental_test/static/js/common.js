$(document).on("pagebeforeshow", function () {
    //#region foot
    $(this).find("#Footer a." + $.mobile.activeBtnClass).removeClass($.mobile.activeBtnClass);
    if ($.mobile.activePage.attr("id")) {
        $(this).find("#Footer a[data-active='" + $.mobile.activePage.attr('id').toLowerCase() + "']").addClass($.mobile.activeBtnClass);       
    }
    //#endregion 
    //#region 下拉选择
    if ($(this).find(".j_Select select").length > 0) {
        var selEl = $(this).find(".j_Select select");
        selEl.each(function () {
            $selectTextShow($(this));
        });
        selEl.bind("change", function () {
            $selectTextShow($(this));
        });
    }
    //#endregion
});
function $selectTextShow(el) {
    var elSelected = el.find("option:selected");
    if (elSelected.length == 0) {
        elSelected = el.find("option").eq(0);
    }
    el.prev().text(elSelected.text());
}
$(document).on("pageinit", function () {
    //#region tab
    $(this).delegate(".j_TabNavs li","tap", function (ev) {
        ev.preventDefault();
        var activeCls = "active", el = $(this);
        if (el.hasClass(activeCls)) {
            return;
        }
        el.siblings("." + activeCls).removeClass(activeCls);
        el.addClass(activeCls);
        var elTabContent = el.parents(".j_Tab").find(".j_TabContent");
        var cIndex = el.parents(".j_Tab").find(".j_TabNavs li").index(el);
        if (el.parents(".j_TabNavs").hasClass("tabNavsHasAll")) {
            if (el.hasClass("all")) {
                elTabContent.show();
            } else {
                elTabContent.hide();
                elTabContent.eq(cIndex - 1).show();
            }
        } else {
            elTabContent.hide();
            elTabContent.eq(cIndex).show();
        }
    });
    //#endregion

    //#region 数量加减
    $(this).delegate(".j_Minus","tap", function (ev) {
        ev.preventDefault();
        var me = $(this);
        var elNum = me.next(".ui-input-text").find("input[type=text]");
        if (Number(elNum.val()) <= 1) {
            return;
        }
        else {
            elNum.val(Number(elNum.val()) - 1);
        }
    });
    $(this).delegate(".j_Plus","tap", function (ev) {
        ev.preventDefault();
        var me = $(this);
        var elNum = me.prev(".ui-input-text").find("input[type=text]");
        var oldNum = Number(elNum.val());
        if (oldNum == "NaN")
            oldNum = 1;
        elNum.val(oldNum + 1);
    });
    $(this).delegate(".j_Positive","keydown keyup", function () {
        var me = $(this);
        var v = me.val();
        if (v == "")
            return;
        var rel = /^[1-9]\d*$/;
        if (!rel.test(v)) {
            if (parseInt(v) == 0) {
                v = 1;
            } else {
                v = isNaN(parseInt(v)) ? 1 : parseInt(v);
            }
        }
        me.val(v);
    });
    $(this).delegate(".j_Positive","blur", function () {
        var me = $(this);
        var v = me.val();
        var rel = /^[1-9]\d*$/;
        if (!rel.test(v)) {
            if (parseInt(v) == 0) {
                v = 1;
            } else {
                v = isNaN(parseInt(v)) ? 1 : parseInt(v);
            }
        }
        me.val(v);
    });
    //#endregion
});

//#region 数字转货币格式
var $To = {
    Money: function (str) {
        return parseFloat(str).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    },
    Num: function (str) {
        return Number(str.replace('。', '.').replace('￥', '').replace('¥', '').replace('，', '').replace(/,/g, ''));
    }
};
//#endregion
//#region 120秒倒计时
function $lastTime(el, disCls) {
    if (el.length < 1)
        return;
    var oldText = el.html();
    if (el.hasClass(disCls)) {
        var time = 120;
        var elTime = el.find("span");
        if (elTime.length == 0) {
            el.html("<span>" + time + "</span>秒");
            elTime = el.find("span");
        }
        var timer = setInterval(function () {
            if (time > 1) {
                var str = time - 1;
                time = time - 1;
                elTime.html(str);
            } else {
                str = "";
                el.html(oldText);
                el.removeClass(disCls);
                clearInterval(timer);
            }
            
        }, 1000);
    }
}
//#endregion

////#region 服务倒计时
//var $Countdown = {
//    ExpireTime: function (et) {
//        if (et <= 0) {
//            return "00：00：00";
//        }
//        var tDay = Math.floor(et / 86400000);
//        et -= tDay * 86400000;
//        tHour = Math.floor(et / 3600000);
//        et -= tHour * 3600000;
//        tHour = tHour + tDay * 24;
//        if (tHour < 10) {
//            tHour = "0" + tHour;
//        }
//        tMinute = Math.floor(et / 60000);
//        et -= tMinute * 60000;
//        if (tMinute < 10) {
//            tMinute = "0" + tMinute;
//        }
//        tSecond = Math.floor(et / 1000);
//        if (tSecond < 10) {
//            tSecond = "0" + tSecond;
//        }
//        return tHour + "：" + tMinute + "：" + tSecond + "";
//    },
//    ShowTime: function (el,serverT) {
//        var elTime = el;
//        var endTime = (new Date(elTime.attr("data-end"))).getTime();
//        var nowTime = serverT.getTime();
//        var et = endTime - nowTime;
//        var timer = setInterval(function () {
//            elTime.html($Countdown.ExpireTime(et));
//            if (et < 0) {
//                clearInterval(timer);
//            }
//            et -= 1000;
//        }, 1000);
//    }
//};
////#endregion
////#region 双选择dual operation弹窗  a:提示语;
//function $dualOperationDialog(a, callback1, callback2, btnText1, btnText2) {
//    var dialogId = "J_DualOperationDialogId";
//    var text1 = btnText1 == undefined ? "重试" : btnText1,
//        text2 = btnText2 == undefined ? "联系客服" : btnText2,
//        href = text2 == "联系客服" ? "tel:0571-87240555" : "#";
//    if ($("#" + dialogId).length == 0) {
//        var dialogHtml = '<div data-role="popup" data-overlay-theme="b" class="confirmDialog" id="' + dialogId + '" >';
//        dialogHtml += '<div class="confirmDialog-content">' + a + '</div>';
//        dialogHtml += '<ul class="confirmDialog-btns clearfix"><li><a href="#" class="ui-btn j_DualOperationRetry">' + text1 + '</a></li><li><a href="' + href + '" class="ui-btn j_DualOperationContact">' + text2 + '</a></li></div>';
//        $(dialogHtml).appendTo($.mobile.pageContainer);
//        $.mobile.pageContainer.trigger("create");
//        $("#" + dialogId).popup({
//            afteropen: function (event) {
//                $(event.target).attr("data-isretry", "false");
//                $(event.target).attr("data-iscontact", "false");
//            }
//        });
//        $("#" + dialogId).find(".j_DualOperationRetry").on("tap", function (ev) {
//            ev.preventDefault();
//            $("#" + dialogId).attr("data-isretry", "true");
//            $("#" + dialogId).popup('close');
//        });
//        if (text2 != "联系客服") {
//            $("#" + dialogId).find(".j_DualOperationContact").on("tap", function (ev) {
//                ev.preventDefault();
//                $("#" + dialogId).attr("data-iscontact", "true");
//                $("#" + dialogId).popup('close');
//            });
//        }
//    } else {
//        $("#" + dialogId).find(".confirmDialog-content").html(a);
//        $("#" + dialogId).find(".j_DualOperationRetry").html(text1);
//        $("#" + dialogId).find(".j_DualOperationContact").html(text2);
//    }
//    $("#" + dialogId).popup({
//        afterclose: function (event) {
//            if ($(event.target).attr("data-isretry") == "true") {
//                callback1();
//            }
//            if ($(event.target).attr("data-iscontact") == "true") {
//                callback2();
//            }
//        }
//    });
//    $("#" + dialogId).popup('open');
//}
////#endregion

//#region 噗噗 alert弹窗  a:提示语;
function $alertDialog_p(a, callback, btnText) {
    var dialogId = "J_AlertDialogId_P";
    if ($("#" + dialogId).length == 0) {
        var dialogHtml = '<div class="p-alertDialog" id="' + dialogId + '" >';
        dialogHtml += '<div class="alertDialog-title"> 提示：</div>';       
        dialogHtml += '<div class="alertDialog-content">' + a + '</div>';
        dialogHtml += '<div class="alertDialog-btns"><a href="#" class="ui-btn j_AlertCancel"></a></div>';
        $(dialogHtml).appendTo($("body"));
    } else {
        $("#" + dialogId).find(".alertDialog-content").html(a);
    }
    var me = $("#" + dialogId);
    me.find('a').html(btnText || '确&nbsp;&nbsp;定');

    var elMMask = null;
    if ($("body").find(".j_MainMask").length == 0) {
        elMMask = $("<div class='mask j_MainMask'></div>");
        elMMask.appendTo($("body"));
    } else {
        elMMask = $("body").find(".j_MainMask");
    }
    elMMask.show();
    $("#" + dialogId).show();

    $(document).on("pagebeforehide", "#" + $.mobile.activePage.attr("id"), function () {
        if ($("#" + dialogId).length > 0) {
            $("#" + dialogId).hide();
            elMMask.hide();
        }
    });
    $(document).delegate("#" + dialogId +" .j_AlertCancel","tap", function (ev) {
        ev.preventDefault();
        $("#" + dialogId).hide();
        elMMask.delay(100).hide(0);
        if (callback) {
            callback();
        }
    });



}


//#region 获取网址参数
function request(paras)
{
    var url = location.href;
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
    var paraObj = {}
    for (i=0; j=paraString[i]; i++){
        paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if(typeof(returnValue)=="undefined"){
        return "";
    }else{
        return returnValue;
    }
}
//#endregion
//#region 全局ajax判断登录状态
$.ajaxSetup({
    complete: function(XMLHttpRequest, textStatus) {
        // debugger;
        //判断登录是否过期
        var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
        if (sessionstatus == "TIMEOUT") {
             $setAlert("登录失效！请重新登录！")
            setTimeout(function(){
                window.location.href= XMLHttpRequest.getResponseHeader("contextpath");
            }, 1000);
        }
    }
});
//#endregion
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {},
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling $.cookie().
            cookies = document.cookie ? document.cookie.split('; ') : [],
            i = 0,
            l = cookies.length;

        for (; i < l; i++) {
            var parts = cookies[i].split('='),
                name = decode(parts.shift()),
                cookie = parts.join('=');

            if (key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));