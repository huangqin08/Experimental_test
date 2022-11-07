var w = window, doc = document, $c = false, $n = navigator;
//解决ios7顶部 状态栏覆盖在上面的问题
//function onDeviceReady() {
//    if (parseFloat(window.device.version) === 7.0) {
//        document.body.style.marginTop = "20px";
//    }
//}
//document.addEventListener('deviceready', onDeviceReady, false);
//$.support.cors = true;
//$.mobile.allowCrossDomainPages = true;

$(document).bind("mobileinit", function () {
    $.mobile.pageLoadErrorMessage = "加载失败！";
});

//localStorage
if (!w.localStorage) {
    w.localStorage.length = 0;
    w.localStorage.key = function () { };
    w.localStorage.setItem = function () { };
    w.localStorage.getItem = function () { };
    w.localStorage.clear = function () { };
}

var $ajaxInfo, $ajaxData;
function $url(url, withHost) {
    //将 Ajax.request 的 url 中 @ 替换成 当前页的名称
    if (url && url.charAt(0) == '@') {
        url = $GetPageName() + url.substr(1);
    }
    else if (url && url.charAt(0) == '~') {
        url = C_ROOT + url.substr(1);
    }

    if (withHost) {
        var l = location, host = l.href.substring(0, l.href.indexOf(l.pathname));
        if (url.indexOf(host) == -1) {
            if (url.indexOf('/') == 0) url = url.substr(1);
            url = host + url;
        }
    }
    return url;
}

function $GetPageName(url) {
    try {
        url = url || $.mobile.navigate.history.getActive().url;
    }
    catch (e) {
        url = location.pathname;
    }
    return url.replace(/.*?(\w+)(|-(\w+))(.((html?)|(aspx)|(ashx))(#\w+)?).*/i, "$1$4");
}

$.ajaxSetup({
    type: "POST"
});

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    //$.mobile.loading('show');
    options.url = $url(options.url);
    var success = options.success;
    options.success = function (data, textStatus, jqXHR) {
        $ValidateResponse(jqXHR);
        if (typeof (success) === "function") {
            //$.mobile.loading('hide');
            return success(data, textStatus, jqXHR);
        }
    };
});

function $ValidateResponse(xhr) {
    if (xhr.valid === undefined) {
        var info = $ajaxInfo = $GetAjaxInfo(xhr);
        if (!$ajaxInfo) return true;
        $ajaxData = $ajaxInfo.data;

        if ($ajaxData && $ajaxData.NeedLogin) {
            $Goto($ajaxData.LoginUrl);
        }
        else if (info.msgtype && info.msg) {
            var msg = unescape(info.msg);
            var title = unescape(info.msgtitle);

            switch (info.msgtype) {
                case 'Alert':
                    $alertDialog(msg);
                    break;
                case 'Flash':
                    $setAlert(msg);
                    break;
                default:
                    $setAlert(msg);
                    break;
            }
        }
        xhr.valid = info.type == 'Succ';
    }
    return xhr.valid;
}

function $GetAjaxInfo(response) {
    if (response.getResponseHeader) {
        return $.parseJSON(response.getResponseHeader("AjaxInfo"));
    }
    else
        return typeof response.text == "string" ? $.parseJSON(response.text) : response.text;
}

function $Goto(url, opts) {
    opts = opts || {};
    opts.reloadPage = true;
    opts.allowSamePageTransition = true;
    if (url == null || url == '') {
        url = location.pathname;
    }
    else {
        url = $url(url);
    }

    $.mobile.changePage(url, opts);
}

function nano(template, data) {
    return template.replace(/\{\$([\w\.]*)\}/ig, function (str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.serializeJSON = function () {
    return JSON.stringify(this.serializeObject());
}

$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

//#region jqm redefine
var __jqm_changepage = $.mobile.changePage;
$.mobile.changePage = function (url, opts) {
    opts = opts || {};
    opts.showLoadMsg = true;
    opts.transition = 'none';
    if (typeof url == 'string' && $GetPageName(url) == $GetPageName(location.pathname)) {
        opts.changeHash = false;
    }
    return __jqm_changepage.call(this, url, opts);
}

var __jqm_back = $.mobile.back;
$.mobile.back = function () {
    var index = $.mobile.navigate.history.activeIndex - 1;
    var validIndex = index >= 0 && index < $.mobile.navigate.history.stack.length;
    if (validIndex) $.mobile.hashListeningEnabled = false;
    var v = __jqm_back.call(this);
    if (validIndex) $.mobile.hashListeningEnabled = true;
    return v;
}

var __jqm_on_func = $.fn.on;
$.fn.on = function () {
    var a = arguments, me = $(this);
    if (a[0] == "pageinit" || a[0] == "pagecreate" || a[0] == "pageshow") {
        for (var i = 1; i < a.length; i++) {
            if (typeof a[i] == "function") {
                var func = a[i];
                if (/#\w+/.test(a[i - 1])) {
                    a[i] = function () {
                        _removeDom(arguments);
                        func.apply(this, arguments);
                        me.off(a[0], a[i - 1], func);//auto unbind
                    }
                }
                else {
                    a[i] = function () {
                        _removeDom(arguments);
                        func.apply(this, arguments);
                        me.off(a[0], func);//auto unbind
                    }
                }
            }
        }
    }
    return __jqm_on_func.apply(this, arguments);

    function _removeDom(args) {
        if (args[0] && args[0].target && args[0].target.id) {
            var prevDom = $('#' + args[0].target.id)[0];
            if (prevDom && prevDom != args[0].target) {
                $(prevDom).remove();
            }
        }
    }
}
//#endregion

//#region 自动消失弹窗  a:提示语;
function $setAlert(message, position, delay) {
    var $w = $(w), $toast = $('<div class="ui-popup disappearDialog">' + message + '</div>');
    var top = '50%', left = "50%", m = "0 0 0 0";
    if (!isNaN(position)) {
        delay = Math.max(1000, Number(position));
    }
    else {
        delay = 2000;
    }

    var removeToast = function () {
        $(this).remove();
    };

    $toast.click(removeToast);

    $toast.appendTo($.mobile.pageContainer).delay(delay);
    if (position == 'top') {
        top = 75;
    }
    else if (position == 'bottom') {
        top = $w.height() - $toast.outerHeight() / 2;
    }
    if ($(w).width() == $toast.outerWidth(true)) {
        left = 0;
        m = '-' + $toast.outerHeight() / 2 + 'px 1em 0 1em';
    } else {
        m = '-' + $toast.outerHeight() / 2 + 'px 0 0 -' + $toast.outerWidth() / 2 + 'px';
    }
    $toast.css({
        left: left,
        top: top,
        margin: m,
        visibility: 'visible'
    });
    $toast.fadeOut(400, removeToast);
}
//#endregion

//#region alert弹窗  a:提示语;
function $alertDialog(a, callback) {
    var dialogId = "J_AlertDialogId";
    if ($("#" + dialogId).length == 0) {
        var dialogHtml = '<div data-role="popup" data-overlay-theme="b" class="alertDialog" id="' + dialogId + '" >';
        dialogHtml += '<div class="alertDialog-content">' + a + '</div>';
        dialogHtml += '<div class="alertDialog-btns"><a href="#" class="ui-btn ui-mini ui-btn-inline" data-rel="back">确定</a></div>';
        $(dialogHtml).appendTo($.mobile.pageContainer);
        $.mobile.pageContainer.trigger("create");

        $("#" + dialogId).popup({
            afterclose: callback
        });
    } else {
        $("#" + dialogId).find(".alertDialog-content").html(a);
    }
    $("#" + dialogId).popup('open');
}
//#endregion
//#region alert弹窗  a:提示语;
function $dialogFrame(a) {
    var dialogId = "J_DialogFrameId";
    var delay = 100;
    setTimeout(function () {
        if ($.mobile.pageContainer.find("#" + dialogId).length == 0) {
            var dialogHtml = '<div data-role="popup" data-overlay-theme="b" class="dialogFrame" id="' + dialogId + '" >';
            dialogHtml += '<div class="dialogFrame-content">' + a + '</div>';
            $(dialogHtml).appendTo($.mobile.pageContainer);
            $.mobile.pageContainer.trigger("create");
        } else {
            $.mobile.pageContainer.find("#" + dialogId).find(".dialogFrame-content").html(a);
        }
        $.mobile.pageContainer.find("#" + dialogId).popup('open');
    }, delay);
}
//#endregion
//#region confirm弹窗  a:提示语;
function $confirmDialog(a, callback, okBtnText, cancelBtnText) {
    var dialogId = "J_ConfirmDialogId";
    var okText = okBtnText == undefined ? "确定" : okBtnText,
        cancelText = cancelBtnText == undefined ? "取消" : cancelBtnText;
    if ($("#" + dialogId).length == 0) {
        var dialogHtml = '<div data-role="popup" data-overlay-theme="b" class="confirmDialog" id="' + dialogId + '" >';
        dialogHtml += '<div class="confirmDialog-content">' + a + '</div>';
        dialogHtml += '<ul class="confirmDialog-btns clearfix"><li><a href="#" class="ui-btn j_ConfirmCancel" data-rel="back">' + cancelText + '</a></li><li><a href="#" class="ui-btn j_ConfirmOK">' + okText + '</a></li></div>';
        $(dialogHtml).appendTo($.mobile.pageContainer);
        $.mobile.pageContainer.trigger("create");
        $("#" + dialogId).popup({
            afteropen: function (event) {
                $(event.target).attr("data-isok", "false");
            }
        });
        $("#" + dialogId).find(".j_ConfirmOK").on("tap", function (ev) {
            ev.preventDefault();
            $("#" + dialogId).attr("data-isok", "true");
            $("#" + dialogId).popup('close');
        });
    } else {
        $("#" + dialogId).find(".confirmDialog-content").html(a);
        $("#" + dialogId).find(".j_ConfirmOK").html(okText);
        $("#" + dialogId).find(".j_ConfirmCancel").html(cancelText);
    }
    $("#" + dialogId).popup({
        afterclose: function (event) {
            if ($(event.target).attr("data-isok") == "true") {
                callback();
            }
        }
    });
    $("#" + dialogId).popup('open');
}
//#endregion
//#region 双选择dual operation弹窗  a:提示语;
function $dualOperationDialog(a, callback1,callback2, btnText1, btnText2) {
    var dialogId = "J_DualOperationDialogId";
    var text1 = btnText1 == undefined ? "重试" : btnText1,
        text2 = btnText2 == undefined ? "联系客服" : btnText2;
    if ($("#" + dialogId).length == 0) {
        var dialogHtml = '<div data-role="popup" data-overlay-theme="b" class="confirmDialog" id="' + dialogId + '" >';
        dialogHtml += '<div class="confirmDialog-content">' + a + '</div>';
        dialogHtml += '<ul class="confirmDialog-btns clearfix"><li><a href="#" class="ui-btn j_DualOperationRetry">' + text1 + '</a></li><li><a href="#" class="ui-btn j_DualOperationContact">' + text2 + '</a></li></div>';
        $(dialogHtml).appendTo($.mobile.pageContainer);
        $.mobile.pageContainer.trigger("create");
        $("#" + dialogId).popup({
            afteropen: function (event) {
                $(event.target).attr("data-isretry", "false");
                $(event.target).attr("data-iscontact", "false");
            }
        });
        $("#" + dialogId).find(".j_DualOperationRetry").on("tap", function (ev) {
            ev.preventDefault();
            $("#" + dialogId).attr("data-isretry", "true");
            $("#" + dialogId).popup('close');
        });
        $("#" + dialogId).find(".j_DualOperationContact").on("tap", function (ev) {
            ev.preventDefault();
            $("#" + dialogId).attr("data-iscontact", "true");
            $("#" + dialogId).popup('close');
        });
    } else {
        $("#" + dialogId).find(".confirmDialog-content").html(a);
        $("#" + dialogId).find(".j_DualOperationRetry").html(text1);
        $("#" + dialogId).find(".j_DualOperationContact").html(text2);
    }
    $("#" + dialogId).popup({
        afterclose: function (event) {
            if ($(event.target).attr("data-isretry") == "true") {
                callback1();
            }
            if ($(event.target).attr("data-iscontact") == "true") {
                callback2();
            }
        }
    });
    $("#" + dialogId).popup('open');
}
//#endregion
function _setTitle(pTitle) {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    console.log(bIsIphoneOs)
    if (bIsIphoneOs) {
        document.title = pTitle;
        var $body = $('body');
        var $iframe = $("<iframe style='display:none;' src='/Template/default/common/jQuery/images/ajax-loader.gif'></iframe>");
        $iframe.on('load', function () {
            setTimeout(function () {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);
    }

}