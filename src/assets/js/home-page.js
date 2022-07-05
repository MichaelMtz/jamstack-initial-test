var t = function (e) {return "font-weight:bold;font-size:1em;font-family:arial,helvitica,sans-serif;color:" + e};
var _log = function (text, color = 'DeepSkyBlue') {  console.log(`%cs%cn%co%cw %c==> ${text}`, t("#ADD8E6"), t("#87CEEB"), t("#87CEFA"), t("#00BFFF"), `font-size:11px; font-weight:500; color:${color}; padding:3px 50px 3px 3px; width:100%;`);};

document.addEventListener('DOMContentLoaded',()=> {
  
  const thrive_carousel_fade = new FadeAnimation();
  const thrive_carousel_loader = new BackgroundLoader();
  
  //thrive.init.ready(function(){
  
  function initBannerScroller() {
    $('#banner_carousel').carousel({
      slideInterval : 8000,
      slideAnimationTime : 300, 
      loaderObject : thrive_carousel_loader,
      animationObject: thrive_carousel_fade,
      transitionClass : 'fade_animate',
      easingType : 'ease-in-back',
      imageLayout : 'stacked', 
      isResponsive : true, 
      scaleImages : 'none',
      randomOrder : false,
      autoSlide : false,
      bullets : 'bullets',
      bulletsActiveClass : 'active'
    });
    $('#banner_carousel #customText').removeClass('hidden');
    $(thrive_carousel_loader).on('slideLoaded.ThriveCarousel', function(e, settings, newSlide, direction){
      $('.pano-loader').hide();
      return true;
    });
    window.onload = function() {
      $('.pano-loader').hide();
      var now = new Date().getTime();
      var page_load_time = now - performance.timing.navigationStart;
      page_load_time = page_load_time / 1000;
      page_load_time.toFixed(2);
      $("#browsertime").html( page_load_time);
    };
  };
  initBannerScroller();
  var pageLoadTime = (performance.timing.domContentLoadedEventStart -  performance.timing.navigationStart) / 1000;
  console.log(`>>> load: ${pageLoadTime}`);
  document.querySelector("#browsertime").innerText = pageLoadTime;
  
  document.querySelector('li.updates-box').dispatchEvent(new Event('mouseover'));
  _log('Home page initialized.');

  
  
  
});