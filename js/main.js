// :regex -- James Padolsay's awsome regex selector
// http://james.padolsey.com/javascript/regex-selector-for-jquery/
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? 
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

// custom functions

var coverImage = function() {
    images = new Array;
        images[0] = "img/cover/bg1.jpg";
        images[1] = "img/cover/bg2.jpg";
        images[2] = "img/cover/bg3.jpg";
        images[3] = "img/cover/bg4.jpg";
        images[4] = "img/cover/bg5.jpg";
    var randNum = Math.floor(Math.random() * 5);
    var imgUrl = "url(" + images[randNum] + ")";
    
    return imgUrl;
}

var coverClick = function() {
    $("div.cover").click(
        function() {
            $("div.cover").fadeOut(800);
        }
    );
}

// string-number manipulation
var swapStrNr = function (str, newNr) {
    return str.replace(/\d+/, ''+newNr);
}

// New gallery slider
var totalImages = function ($gallery) {
    return $gallery.find("ul > li").length;
}
var totalWidth = function ($gallery) {
    return imageWidth($gallery) * totalImages($gallery);
}
var imageWidth = function ($gallery) {
    return $gallery.find("ul > li:first").outerWidth(true);
}

var setGalleryDim = function (gallery) {
    var $gallery = $("." + gallery + "_fig");
    var imgNr = typeof(storage) !== undefined && sessionStorage[gallery] ?
                parseInt(sessionStorage[gallery]) :
                1;
        
    $gallery.find("ul").width(totalWidth($gallery));
    $gallery.find("ul").css({marginLeft: - ((imgNr - 1) * 100) + '%'});
}

var toggleGallerySize = function (gallery) {
    var $gallery = $('.' + gallery + '_fig');
    
    $gallery.find('.image_wrap').click(function () {
        if ( $(this).hasClass('size_large') ) {
            $gallery.find('.size_large').removeClass('size_large')
                                        .addClass('size_small');
            $gallery.find('img:regex(src, .*size_large.*)').each(function () {
                $(this).attr('src', $(this).attr('src').replace(/size_large/, 'size_small'));
            });
        } else if ( $(this).hasClass('size_small') ) {
            $gallery.find('.size_small').removeClass('size_small')
                                        .addClass('size_large');
            $gallery.find('img:regex(src, .*size_small.*)').each(function () {
                $(this).attr('src', $(this).attr('src').replace(/size_small/, 'size_large'));
            });
        }
        
        // recalculate the dimentions
        setGalleryDim(gallery);
        
    });
}

var navGallery = function (gallery) {
    var $gallery = $('.' + gallery + '_fig');
    
    var imgNr = typeof(storage) !== undefined && sessionStorage[gallery] ?
                parseInt(sessionStorage[gallery]) :
                1;
    
    // some side-effect functions
    // numb and activate side arrows
    var arrowFix = function (imgNr) {
        var $rightArrow = $gallery.find('.arrow_right'),
            $leftArrow = $gallery.find('.arrow_left'),
            n_img = totalImages($gallery);
    
        if (imgNr <= 1){
            $leftArrow.addClass('numb');
        }
        if (imgNr >= n_img) {
            $rightArrow.addClass('numb');
        }
        if ( $leftArrow.hasClass('numb') && 1 < imgNr ) {
            $leftArrow.removeClass('numb');
        }
        if ( $rightArrow.hasClass('numb') && imgNr < n_img ) {
            $rightArrow.removeClass('numb');
        }
    }
    
    // Fix download link
    var downloadFix = function (newImgNr) {
        var $downloadLink = $gallery.find('.download');
        if ($downloadLink[0]) {
            $downloadLink.attr('href', swapStrNr($downloadLink.attr('href'), newImgNr));
        }
    }
    
    setGalleryDim(gallery);
    
    arrowFix(imgNr);
    downloadFix(imgNr);
                
    var arrowClick = function (arrow) {
        if (arrow.match(/left/)) {
            $gallery.find("ul").animate({
                marginLeft: "+=" + 100 + "%"
            });
            imgNr -= 1;
        } else if (arrow.match(/right/)) {
            $gallery.find("ul").animate({
                marginLeft: "-=" + 100 + "%"
            });
            imgNr += 1;
        }
        
        arrowFix(imgNr);
        downloadFix(imgNr);
        sessionStorage[gallery] = ''+imgNr;
    }
    
    $gallery.find("a.arrow_left").click(function () {
        if (imgNr > 1
            && ! $gallery.find("ul").is(":animated") ) {
            
           arrowClick('left');
        }
        return false;
    });
    
    $gallery.find("a.arrow_right").click(function () {
        if (imgNr < totalImages($gallery)
            && ! $gallery.find("ul").is(":animated") ) {
            
            arrowClick('right');
        }
        return false;
    });
}

// vimeo event handler darkens the background when video is playing
var filmHandler = function () {
    var iframe = $('#film_iframe')[0],
        player = iframe !== undefined ? $f(iframe) : null;
    if (player) {
        player.addEvent('ready', function () {
            player.addEvent('play', darken);
            player.addEvent('pause', brighten);
            player.addEvent('finished', brighten);
        });
    }
    var darken = function (id) {
        $('body').animate({color: '#1A1D24'});
    }
    var brighten = function (id) {
        $('body').animate({color: '#E5E2DB'});
    }
}

// AJAX functions
var PAGES = new Array;
    PAGES[2] = "index.html";
    PAGES[3] = "manifesto.html";
    PAGES[4] = "lookbook.html";
    PAGES[5] = "12_05_12.html";
    PAGES[6] = "about.html";

var loadNewContent = function (href, data) {
    var href = href.split('#');
    var oldPageNr = parseInt($('footer .page_nr').text());
    var newPageNr = PAGES.indexOf(href[0].split('/').reverse()[0]);

    var $section = $('div.contents section');
    var newFooter = href[0] + ' footer >';
    var newContents = href[0] + ' div.contents >';;
    
    if ( oldPageNr > newPageNr ) {
        $section.animate({marginLeft: "110%"}, function () {
            $("div.contents").load(newContents, function () {
                ready();
            })
            .css({marginLeft: "-150%"})
            .animate({marginLeft: "0"}, function () {
                if (data.section) {
                    $('html, body').animate({
                        scrollTop: $('#'+ data.section).offset().top || 0
                    });
                }
            });
        });
    } else if ( oldPageNr < newPageNr ) {
        $section.animate({marginLeft: "-150%"}, function () {
            $("div.contents").load(newContents, function () {
                ready();
            })
            .css({marginLeft: "110%"})
            .animate({marginLeft: "0"}, function () {
                if ( data.section) {
                    $('html, body').animate({
                        scrollTop: $('#'+ data.section).offset() !== undefined ? $('#'+ data.section).offset().top : 0
                    });
                }
            });
        });
    }
    $('footer').load(newFooter);
}

var newAjaxLink = function (href, title) {
    $('a:regex(href,' + href + ')').click(function () {
        History.pushState({section: $(this).attr('href').split('#')[1] || null}, title, href);
        return false;
    });
}

// setup ready state handlers from the above functions
var ready = function () {
    
    newAjaxLink('index.html', "Beast: Man is an animal");
    newAjaxLink('manifesto.html', "Beast: Man is an animal — Manifesto");
    newAjaxLink('lookbook.html', "Beast: Man is an animal — Lookbook");
    newAjaxLink('12_05_12.html', "Beast: Man is an animal — 12/05/12");
    newAjaxLink('about.html', "Beast: Man is an animal — About");
    
    navGallery('lookbook');
    navGallery('prep');
    navGallery('show');
    navGallery('backstage');
    
    toggleGallerySize('lookbook');
    
    filmHandler();
}
    
$(document).ready(function () {
    

    // the cover function
    if (typeof(Storage) !== "undefined") {
        if ( (! sessionStorage.visited)
             && ($(window).width() > 800) ) {
            $("div.cover").removeClass("hidden");   
            coverClick();
            $(".cover").css("background-image", coverImage());
            sessionStorage.visited = true;
        }
    }

    // history.js event handler
    History.Adapter.bind(window, 'statechange', function () {
        var State = History.getState();
        History.log(State.data, State.title, State.url);
        loadNewContent(State.url, State.data);
    });
    
    ready();
    
    $(document).bind('swiperight', function () {
        var newPageNr = parseInt($('.page_nr').text()) - 1,
            newPage = PAGES[newPageNr];
        if (newPage) {
            History.pushState({section: null},
                              "Beast: Man is an animal — "+newPage.split('.')[0],
                              newPage);
        }
    });
    $(document).bind('swipeleft', function () {
        var newPageNr = parseInt($('.page_nr').text()) + 1,
            newPage = PAGES[newPageNr];
        if (newPage) {
            History.pushState({section: null},
                              "Beast: Man is an animal — "+newPage.split('.')[0],
                              newPage);
        }
    });
    
    // preload all html content
    $(window).load(function () {
        // new page preloader
        /*var currentPage = window.location.pathname.substr(1) || 'index';
        PAGES.map(function (page) {
            var pageName = (page[0].match(/\d/) && '_' || '') + page.split('.')[0];
            var newSection = '<section class="'+pageName+' hidden">';
            if (page != currentPage) {
                if (PAGES.indexOf(page) < PAGES.indexOf(currentPage)) {
                    $('.contents').prepend(newSection);
                } else if (PAGES.indexOf(page) > PAGES.indexOf(currentPage)) {
                    $('.contents').append(newSection);
                }
                $('section.'+pageName).load(page + ' section.'+pageName+' >');
            }
        });*/
        
        // Old image preloader
        // XXX obsolute with new page preloader
        // Add hidden container on to the page
        $('body').append('<div>');
        $('div').last().addClass('preload hidden');
        
        // load the preloading content in it
        PAGES.map(function (page) {
            var preloadPage = 'preload_' + page.split('.')[0];
            $('.preload').append('<div class="' + preloadPage + '">');
            $('.' + preloadPage).load(page + ' img');
        });
    });
});
