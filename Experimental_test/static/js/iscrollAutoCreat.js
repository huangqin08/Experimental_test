/*s:需要做拉动的element；
*d:更新
*u:[elCont, url]更多,
*tE:位于滑动元素上方元素（头部除外）
*bE:位于滑动元素下方元素（尾部除外）
*/
function $AutoCreatIscroll(s, d, u, tE, bE) {
    var pullDownEl = "",
        pullUpEl = "";
    //#region 动态创建iscroll
    var parentPage = s.parents(".ui-page");
    if (parentPage.find(".j_Scroller").length == 0) {
        $scrollerParent = $('<div class="j_Scroller scrollerBox"></div>');
        $scrollerParent.insertBefore(s);
        $scrollerMain = $('<div class="scrollerMain"></div>')
        $scrollerParent.append($scrollerMain);
        $scrollerMain.append(s);

        if (d != "" && d != undefined) {
            $scrollerPullDown = $('<div class="sl_pullDown">下拉刷新...</div>');
            $scrollerMain.prepend($scrollerPullDown);
            pullDownEl = $scrollerPullDown;
        }

        if (u != "" && u != undefined) {
            $scrollerPullUp = $('<div class="sl_pullUp">上拉加载更多...</div>');
            $scrollerMain.append($scrollerPullUp);
            pullUpEl = $scrollerPullUp;
        }

    } else {
        $scrollerParent = parentPage.find(".j_Scroller");
        if (d != "" && d != undefined) {
            $scrollerPullDown = $scrollerParent.find('.sl_pullDown');
            pullDownEl = $scrollerPullDown;
        }
        if (u != "" && u != undefined) {
            $scrollerPullUp = $scrollerParent.find('.sl_pullUp');
            pullUpEl = $scrollerPullUp;
        }
    }

    //#endregion
    if (window.myScroll != undefined && window.myScroll != null) {
        window.myScroll.destroy();
        window.myScroll = null;
    }
    var loadingStep = 0;
    var top = 0, bottom = 0;
    setTimeout(function () {
        if (parentPage.find(".ui-header").length > 0) {
            top = parentPage.find(".ui-header").outerHeight(true);
        }
        if (parentPage.find(".ui-footer").length > 0) {
            bottom = parentPage.find(".ui-footer").outerHeight(true);
        }
        if (tE != undefined && tE != "") {
            $.each(tE, function () {
                top += $(this).outerHeight(true);
            });
        }
        if (bE != undefined && bE != "") {
            $.each(bE, function () {
                bottom += $(this).outerHeight(true);
            });
        }
        $scrollerParent.css({
            "top": top - 1,
            "bottom": bottom
        });

        loaded();
        s.undelegate("a", "click tap").delegate("a", "click tap", function (ev) {
            ev.preventDefault();
            var me = $(this);

            if (me.attr("href") != "#" && me.attr("href") != "" && !/.*(.jpg|.png|.gif|.svg)$/.test(me.attr("href"))) {
                if (/^tel:.*$/.test(me.attr("href"))) {
                    location.href = me.attr("href");                    
                } else {
                    $Goto(me.attr("href"));
                }
                return false;
            }
        });
    }, 300);

    function pullUpAction() {
        pullUpEl.removeClass('press').removeClass('loading');
        pullUpEl.html('上拉显示更多...');
        pullUpEl.hide();
        window.myScroll.refresh();
        loadingStep = 0;
    }
    function loaded() {
        var el = (s.parent().parent())[0];
        window.myScroll = new IScroll(el, {
            probeType: 3,
            mouseWheel: true
        });
        window.myScroll.refresh();
        function scrollEvent() {
            if (pullDownEl == "" && pullUpEl == "") {
                return;
            }
            if (pullDownEl != "" && loadingStep == 0 && !pullDownEl.attr('class').match('press|loading')) {
                if (this.y > 15) {
                    pullDownEl.show();
                    loadingStep = 1;
                    window.myScroll.refresh();
                    setTimeout(function () {
                        pullDownEl.html('松开刷新...');
                        pullDownEl.removeClass('loading').addClass('press');
                    }, 500);
                }
            }
            if (pullUpEl != "" && loadingStep == 0 && !pullUpEl.attr('class').match('press|loading')) {
                if (this.y < (this.maxScrollY - 50)) {
                    pullUpEl.show();
                    window.myScroll.refresh();
                    setTimeout(function () {
                        pullUpEl.html('松开加载更多...');
                        pullUpEl.removeClass('loading').addClass('press');
                    }, 500);
                    loadingStep = 1;
                }
            }
        }
        window.myScroll.on('scroll', scrollEvent);
        function scrollEndEvent() {
            if (loadingStep == 1) {
                if (pullDownEl != "" && pullDownEl.attr('class').match('press')) {
                    pullDownEl.removeClass('press').addClass('loading');
                    pullDownEl.html('正在刷新...');
                    loadingStep = 2;
                    if (d) {
                        d();
                    }
                    setTimeout(function () {
                        pullDownEl.hide();
                        pullDownEl.removeClass('press').removeClass('loading');
                        pullDownEl.html('下拉刷新...');
                        window.myScroll.refresh();
                        loadingStep = 0;
                    }, 1000); //1秒
                }

                if (pullUpEl != "" && pullUpEl.attr('class').match('press')) {
                    pullUpEl.removeClass('press').addClass('loading');
                    pullUpEl.html('正在加载...');
                    loadingStep = 2;

                    if (u != "" && u != undefined) {
                        var elCont = u[0],
                           loginName = u[1],
                           orderType = u[2] ;
                        var loginName = sessionStorage.getItem("loginName");
                        var pIndex = (elCont.attr("data-page") - 0) + 1 || 2
                        var url = '/exclusive/selOrder/'+loginName+'/'+ orderType +'/'+ pIndex +'';
                        console.log(url);
                        var orderDetail ='';
                        $.ajax({
                            type: "get",
                            url: url,
                            success: function (data) {
                                console.log(pIndex + JSON.stringify(data));
                                if (data.success) {
                                    // var p = $ajaxData || {};
                                    // if (callback != "") {
                                    //     callback(resText, pIndex, xhr)
                                    // }
                                    if (data.data.length>0) {
                                        for(var i=0;i<data.data.length;i++){
                                            orderDetail +='<li><div class="orderItem"><div class="order-no">订单号：'+ data.data[i].orderParentNo +'</div><a class="order-goods" href="order_detail.html?orderType='+ data.data[i].orderType +'&id='+ data.data[i].id +'">';
                                            orderDetail +='<div class="goodsItem">';
                                            if(data.data[i].materialCode=="9901000102" || data.data[i].materialCode=="990100001"){
                                                orderDetail +='<img class="goods-img" src="/common/imgs/myOrder/cwq_detail.jpg" />';
                                            }else if(data.data[i].materialCode=="9901000201" || data.data[i].materialCode=="990100008"){
                                                orderDetail +='<img class="goods-img" src="/common/imgs/myOrder/cwm_detail.jpg" />';
                                            }else if(data.data[i].materialCode=="9901000401" || data.data[i].materialCode=="990100011"){
                                                orderDetail +='<img class="goods-img" src="/common/imgs/myOrder/cwn_detail.jpg" />';
                                            }else if(data.data[i].materialCode=="9901000601" || data.data[i].materialCode=="990100023"){
                                                orderDetail +='<img class="goods-img" src="/common/imgs/myOrder/cwy_detail.jpg" />';
                                            }else if(data.data[i].materialCode=="9901000901" || data.data[i].materialCode=="990300001"){
                                                orderDetail +='<img class="goods-img" src="/common/imgs/myOrder/fzq_detail.jpg" />';
                                            }else if(data.data[i].materialCode=="0102000301" || data.data[i].materialCode=="010200015"){
                                                orderDetail +='<img class="goods-img" src="/common/imgs/myOrder/ppg_detail.jpg" />';
                                            }
                                            orderDetail +='<div class="goods-title">'+ data.data[i].materialName +'</div>';
                                            if(data.data[i].orderStatus=="1"){
                                                orderDetail +='<div class="order-status">已关闭</div>';
                                            }else if(data.data[i].orderStatus=="2"){
                                                orderDetail +='<div class="order-status">待支付</div>';
                                            }else if(data.data[i].orderStatus=="3"){
                                                orderDetail +='<div class="order-status">已支付</div>';
                                            }
                                            orderDetail +='<div class="goods-count2">X'+ data.data[i].orderParentQty +'</div> <div class="goods-money2">￥'+ data.data[i].marketPrice +'</div></div></a>';
                                            if (data.data[i].orderMaker=="朱叶青") {
                                                orderDetail +='<div class="order-payment"> 实付:<span class="text-blue">￥'+ data.data[i].discountPrice +'</span></div>';

                                            }else{
                                                orderDetail +='<div class="order-payment"> 实付:<span class="text-blue">￥'+ data.data[i].marketPrice +'</span></div>';

                                            }

                                            orderDetail +=' <div class="order-events2 clearfix"><a href="order_detail.html?orderType='+ data.data[i].orderType +'&id='+ data.data[i].id +'" class="btn-border-blue ">订单详情</a>';
                                            if(data.data[i].orderStatus=="2"){
                                                orderDetail +='<a href="n_pay.html?orderid='+ data.data[i].id + '" class="btn-border-gray">去支付</a></div></div></li>';
                                            }

                                        }
                                        elCont.append(orderDetail);
                                        orderDetail ='';
                                        elCont.attr('data-page', pIndex);
                                    } else {
                                        $setAlert("没有更多了", "bottom");
                                    }

                                }
                                pullUpAction();
                            },
                            error: function () {
                                pullUpAction();
                            }
                        });
                    } else {
                        pullUpAction();
                    }
                }
            }
        }
        window.myScroll.on('scrollEnd', scrollEndEvent);
    }
}