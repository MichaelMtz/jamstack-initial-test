$(function () {

  
  //PARALLAX

  $("ul.menu-group li:has(ul)").append('<a href="#" class="expand"><i class="icon-chevron-down"></i></a>');

  $('.section').not('.header').click(function () {
    $("ul.navigation > li").removeClass('dropped');
  });
  $('.section').not('.header').hover(function () {
    $("ul.navigation > li").removeClass('dropped');
  });

  $("ul.navigation > li").click(function () {  
    $(this).siblings().removeClass('dropped');
    if (!$(this).hasClass('dropped')) {
      $(this).addClass('dropped');
    } else {
      $(this).removeClass('dropped');
    }
  });
  

  $("ul.navigation > li").hover(function () {
    $(this).siblings().removeClass('dropped');
    
    if (!$(this).hasClass('dropped')) {
      $(this).addClass('dropped');
      const temp = this;
      console.log('--this?',temp);
    }
    else {
      $(this).removeClass('dropped');
    }
  });
  
  //FLYOUTS
  $('.section').not('.fly-box').hover(function () {
    //$("ul.feature-boxes li").removeClass('flipped');
    
  });
  $('.section').not('.fly-box').click(function () {
    $("ul.feature-boxes li").removeClass('flipped');
    
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
    console.log(`flip?:${window.snoCloseNewsProcessing}`);
    if (!window.snoCloseNewsProcessing) {
      $(this).siblings().removeClass('flipped');
      //if tab clicked is already open(flipped) close it
      if (!$(this).hasClass('flipped')) {
        console.log('----flipping----');
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
        //console.log('--here');
        return false;
      }
    }
    
  });
   

  
  $("ul.navigation div.menu-dropdown").click(function(e) {
    e.stopPropagation();
  });


  $(".mobile-menu").click(function () {
    $(".topnav").toggleClass("open-menu");
    $(".pace ").hide();
    $(".sticky-bar").removeClass("open-book");
    $("html, body").css("overflow", "hidden");
    $('.container').addClass('open-menu');
  });

  $(".mobile-book").click(function () {
    $(".sticky-bar").toggleClass("open-book");
    $(".topnav").removeClass("open-menu");
    $("html, body").css("overflow", "hidden");
    $('.container').addClass('open-menu');
  });

  $(".mobile-close").click(function () {
    $(".sticky-bar").removeClass("open-book");
    $(".topnav").removeClass("open-menu");
    $(".container").removeClass("open-menu");
    $('.container').remove('open-menu');
    $("html, body").css("overflow", "visible");

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


  
  //TABLE HACK
  $('.table').each(function() {
    if(($(this).find('tr').length - 1) === 1)  {
      $(this).find('tr').css('min-width', '100%');
    }
  });
  $("table.table").after('<div class="clear"></div>');

  //if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ($(window).width() < 320)) {
  if(isMobile()){
    
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

});
