var initPhotoSwipeFromDOM = function (gallerySelector) {
    //#region 动态创建pswp
    var parentPage = $(gallerySelector).parents(".ui-page");
    if (parentPage.find(".pswp").length == 0) {
        var pswpHtml = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">';
        pswpHtml +='<div class="pswp__bg"></div>';
        pswpHtml +='<div class="pswp__scroll-wrap">';
        pswpHtml +='<div class="pswp__container">';
        pswpHtml +='<div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div>';
        pswpHtml +='</div>';
        pswpHtml +='<div class="pswp__ui pswp__ui--hidden">';
        pswpHtml +='<div class="pswp__top-bar">';
        pswpHtml +='<div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>';
        pswpHtml +='<div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div>';
        pswpHtml +='</div>';
        pswpHtml +='<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>';
        pswpHtml +='<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>';
        pswpHtml +='<div class="pswp__caption"><div class="pswp__caption__center"></div></div>';
        pswpHtml +='</div></div></div>';	
        parentPage.append(pswpHtml);
    }   
    //#endregion    
    //#region 加载图片尺寸大小
    parentPage.find("figure").each(function (i) {
        var me = $(this);
        var src = me.find("a").attr("href");
        var a = me.find("a");
        var obj = new Image();
        obj.src = src;
        obj.onload = function () {
            var imgsize = obj.width + "x" + obj.height;
            a.attr("data-size", imgsize);
        }
    });
    //#endregion
    var parseThumbnailElements = function (el) {
        var thumbElements = $(el).find("figure"),
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            childElements,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {


            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if (figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = $(figureEl).find("a"); // <a> element

            size = linkEl.attr('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.attr('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = $(figureEl).find(".title").html();
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.find("img").attr('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };
    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }


        // find index of clicked item
        var clickedGallery = clickedListItem.parentNode,
            childNodes = $(clickedGallery).find('figure'),
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
        params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        if (!params.hasOwnProperty('pid')) {
            return params;
        }
        params.pid = parseInt(params.pid, 10);
        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation) {
        var pswpElement = parentPage.find('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            index: index,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of docs for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            },

            // history & focus options are disabled on CodePen
            // remove these lines in real life:
            historyEnabled: false,
            focus: false

        };

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        window.PhotoSwipeInstance = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        window.PhotoSwipeInstance.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = parentPage.find(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        //解决IOS tap 问题
        $(galleryElements[i]).on('tap', onThumbnailsClick);
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid > 0 && hashData.gid > 0) {
        openPhotoSwipe(hashData.pid - 1, galleryElements[hashData.gid - 1], true);
    }
};