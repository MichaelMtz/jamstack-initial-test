$(function () {

    setInterval(function () {
        $('.booking-pop').toggleClass('animated pulse')
    }, 9000);
	
	//PARALLAX
    $(window).scroll(function () {
        s = $(window).scrollTop(),
        $(".slider-image").css("background-position", "50%" + (s / 6) + "px")
        $(".parallax-divider").css("background-position", "50%" + (((s / 60) - 20) * 3) + "px")
        $(".cover, .noBanner").css("background-position", "50%" + (s / 6) + "px")
    });

    $("ul.menu-group li:has(ul)").append('<a href="#" class="expand"><i class="icon-chevron-down"></i></a>');
	
    $('.section').not('.header').click(function () {
        $("ul.navigation > li").removeClass('dropped');
    });
	
	
    $("ul.navigation > li").click(function () {
        $(this).siblings().removeClass('dropped')
		if (!$(this).hasClass('dropped')) {
			$(this).addClass('dropped')
		}
		//else {
			//$(this).removeClass('dropped')
		//}
    });
    
	
	$("ul.navigation > li").hover(function () {
        $(this).siblings().removeClass('dropped')
		if (!$(this).hasClass('dropped')) {
			$(this).addClass('dropped')
		}
		else {
			$(this).removeClass('dropped')
		}
    });
	
	//FLYOUTS
	$('.section').not('.fly-box').hover(function () {
       //$("ul.feature-boxes li").removeClass('flipped');
        console.log('--remove flipped');
    });
	
	function isMobile(){
		if($(window).width() < 766){
			return true;
		}
		else {
			return false;
		}
	}
	
	 $("ul.feature-boxes li").hover(function () {
		$(this).siblings().removeClass('flipped')
		//if tab clicked is already open(flipped) close it
		if (!$(this).hasClass('flipped')) {
			$(this).addClass('flipped');
			//if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ($(window).width() < 320)) {
			//On small displays just use slider buttons as links
			if(isMobile() || $('.fly-box',this).length == 0){
				return true;
			}
			else {
				return false;
			}
		} else {
			//$(this).removeClass('flipped');
			return false;
		}
	 });
	 
	 //STOPPING the return false
	 $("ul.feature-boxes li .fly-box a").click(function(e) {
        e.stopPropagation();
   	});
	
	$("ul.feature-boxes div.fly-box").click(function(e) {
        e.stopPropagation();
   	});
	
	$("ul.navigation div.menu-dropdown").click(function(e) {
        e.stopPropagation();
   	});

    $(".search a").click(function () {
        $(".search").toggleClass("open-search")
        return false;
    });

    $(".mobile-menu").click(function () {
        $(".topnav").toggleClass("open-menu")
        $(".pace ").hide()
        $(".sticky-bar").removeClass("open-book")
        $("html, body").css("overflow", "hidden")
        $('.container').addClass('open-menu')


    });

    $(".mobile-book").click(function () {
        $(".sticky-bar").toggleClass("open-book")
        $(".topnav").removeClass("open-menu")
        $("html, body").css("overflow", "hidden")
        $('.container').addClass('open-menu')


    });

    $(".mobile-close").click(function () {
        $(".sticky-bar").removeClass("open-book")
        $(".topnav").removeClass("open-menu")
        $(".container").removeClass("open-menu")
        $('.container').remove('open-menu')
        $("html, body").css("overflow", "visible")

        return false;
    });

    //FIVEDAY FORCAST
    $(".open-5day").click(function () {
        $('.fiveforecast').toggleClass('openforecast');
        return false;
    });

    //MENU EXPAND
    $("ul.menu-group li:has(ul) .expand").click(function () {
        $('ul.menu-group li > ul').removeClass("opened");
        $(this).parent().children('ul').addClass("opened");
    });
	
	 $("ul.menu-group li:has(ul) span").click(function () {
        $('ul.menu-group li > ul').removeClass("opened");
        $(this).parent().children('ul').addClass("opened");
    });


		//SHOWCASE
    $("li.pw-box .open-showcase").click(function () {
		$(this).children('i').toggle()
        $(this).parent().children('.showcase-info').stop().slideToggle()
		return false;
	});
	
	 $(".select-booking").click(function () {
		 $(this).toggleClass("open-book");
	 });

    setInterval(function () {
        $('.scroll-down').toggleClass('shine')
    }, 7000);
    $('.whyto').click(function () {
        $('body,html').animate({
            scrollTop: $(".intro").offset().top - 300
        }, 1000);
        return false;
    });
    $('.scroll-down').click(function () {
        $('body,html').animate({
            scrollTop: $(".container").offset().top - 300
        }, 1000);
        return false;
    });
    $('.whereto').click(function () {
        $('body,html').animate({
            scrollTop: $(".our-location").offset().top - 150
        }, 1000);
        return false;
    });
	
	//TABLE HACK
	$('.table').each(function() {
	 if(($(this).find('tr').length - 1) === 1)
	 {
		$(this).find('tr').css('min-width', '100%');
	 }
	});
	$("table.table").after('<div class="clear"></div>');

    //if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ($(window).width() < 320)) {
	if(isMobile()){
		$(".slider-image").remove();
		$(".fly-box").remove();
		$("#slider-pagination").remove();
		
        $('table.table').append("<div class='scrollie-right'><i class='icon-chevron-right'></i></div><div class='scrollie-left'><i class='icon-chevron-left'></i></div> <div class='clear'></div>");
        $('.scrollie-right').click(function () {
            $(this).parent('table').children('tbody').animate({
                'scrollLeft': '+=200px'
            }, '500');
        });
        $('.scrollie-left').click(function () {
            $(this).parent('table').children('tbody').animate({
                'scrollLeft': '-=200px'
            }, '500');
        });
    }
	else {
		//init the bannerGallery
		if (typeof initBannerScroller == 'function') {
			initBannerScroller();
		}
	
			//Load the slider content for desktop version
			$("#home-report").load($("#home-report").data('src'));
			$("#offers-flybox").load($("#offers-flybox").data('src'));
			$("#latest-flybox").load($("#latest-flybox").data('src'));
		
	}

});