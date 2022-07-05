(function ( $ ) {
    $.fn.carousel = function( options ) {
        return this.each(function(){
            
            //settins for the carousel
            var settings = $.extend({
                slideInterval : 10000,
                slideAnimationTime : 500, //set to 0 for no animation
                loaderObject : [],
                animationObject : [],
                transitionClass : '',
                easingType: 'linear', //Note easing is not supported in Jquery fall back mode
                imageLayout : 'default', //use this to override default layout to either stacked or row
                isResponsive : false, //if true width/height settings are ignored
                scaleImages : false, //helper function, will scale images to size of slider for responsiveness. Only use if slider is only containing imgs
                fixedWidth : 600, 
                fixedHeight : 400,
                randomOrder : false,
                autoSlide : false,
                prev : '',
                next : '',
                bullets : '',
                bulletsActiveClass : '',
                imgScale : 0,
                rightCount: 1,
                stopSlider : false
                
            
            }, options );
            

            //private vars
            var inUse = false;
            var carouselDiv;
            var carouselParentDiv;
            var carouselTimer;
            var carousel = this;
            var jCarousel = $(carousel);
            settings.totalSlides = 0;
            settings.currentSlide = 0;
            settings.item_width = jCarousel.children('li').outerWidth();
            var duration_text = settings.slideAnimationTime / 1000;
            var isBullets = false;
            var isNext = false;
            var isPrev = false;
            var currentDirection = 'forward';
            var nextSlide = 0;
            var nextSlideWhenLoaded = 0;
            var paused = false;
            var recentlyResized = false;
            var resizeWait;
            var resizeInQue = false;
            
            //detection vars
            settings.useAnimations = supportsTransitions();
            settings.supportsOpacity = supportsOpacity();
            
            if(settings.animationObject != ''){
                settings.animationObject.setEventListeners(jCarousel);
                $(settings.animationObject).on('animationCallback.ThriveCarousel', function(e, direction, caller){endAnimation(direction, caller);});
                $(settings.animationObject).on('animationForceCallback.ThriveCarousel', function(e, slideNumber, direction){animateSlides(slideNumber, direction);});
                $(settings.animationObject).on('resetSlidesCallback.ThriveCarousel', function(e, slidesToMove, shortestDirection){
                     resetSlides(slidesToMove, shortestDirection);
                });
            }
            if(settings.loaderObject != ''){
                settings.loaderObject.setEventListeners(jCarousel);
                $(settings.loaderObject).on('slideLoaded.ThriveCarousel', function(e, slide){
                    if(nextSlideWhenLoaded > 0 && nextSlideWhenLoaded == slide){
                        gotoSetSlide(nextSlideWhenLoaded);
                        nextSlideWhenLoaded = 0;
                    }            
                });
            }
            
            
            //PUBLIC EXPOSED METHODS         
            $.fn.carousel.play = function(){
                if(jCarousel.triggerHandler('play.ThriveCarousel', [settings]) != false){
                    paused = false;
                    clearTimeout(carouselTimer);
                    carouselTimer = setTimeout(function(){transitionSlides()}, settings.slideInterval);
                }
            }
            
            $.fn.carousel.pause = function(){
                if(jCarousel.triggerHandler('pause.ThriveCarousel', [settings]) != false){
                    paused = true;
                    clearTimeout(carouselTimer);
                }
            }
            
            $.fn.carousel.next = function(e){
                gotoNextSlide();
                if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
            };

            
            $.fn.carousel.prev = function(e){
                gotoPrevSlide();
                if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
            };
            
            $.fn.carousel.slide = function(slideNumber){
                gotoSetSlide(slideNumber);
            }
            
            $.fn.carousel.isPaused = function(){
                return paused;   
            }
            
            $.fn.carousel.getCurrentSlide = function(){
                return settings.currentSlide;   
            }
            
            $.fn.carousel.getCurrentSlideID = function(){
                //console.log(settings.currentSlide);
                //console.log($(jCarousel.children('li')[settings.currentSlide]));
                //console.log($(jCarousel.children('li')[settings.currentSlide]).attr('id'));
                return $(jCarousel.children('li')[settings.currentSlide]).attr('id');   
            }
             
            $.fn.carousel.insert = function(content){
                if(jCarousel.triggerHandler('insert.ThriveCarousel', [carousel, content]) != false){
                
                    lock();
                    
                    jCarousel.children('li:last').after('<li>' + content + '</li>').attr('data-loaded', 'true');
    
    
                    jCarousel.children('li:last').each(function(){
                        if(settings.imageLayout == 'default'){
        
                            $(this).css('position','relative');
                        
                        }else if(settings.imageLayout == 'stacked'){
                            
                            $(this).css('position','absolute');
                            
                        }
                        $(this).css('float','left');
                    });
                
                    resizeCarousel();
                    
                    settings.totalSlides = jCarousel.children('li').length;
                    release();
                    //BUG: with loading param being undefined after inserting new slide. All slides should be loading before inserting a new slide anyway.
                    jCarousel.children('li').each(function(i){
                         $(this).attr('data-loaded', 'true');                    
                    });
                }
                
            }
            
            
            var lock = function(){
                if(jCarousel.triggerHandler('lock.ThriveCarousel', [settings]) != false){
                    inUse = true;
                }
            }

            
            var release = function(){
                if(jCarousel.triggerHandler('release.ThriveCarousel', [settings]) != false){
                    inUse = false;
                }
            }
            
            
            function isTouchDevice() { 
                return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
            }
            
            
            
            
            var initCarousel = function(carousel) {
                
                settings.carousel = carousel;
                settings.jCarousel = jCarousel;
                
                carouselDiv = jCarousel.parent();
                carouselParentDiv = $(carouselDiv).parent();

                
                settings.totalSlides = jCarousel.children('li').length;
                
                if(settings.totalSlides < 2){
                    //console.error('Carousel needs more than one slide to function');   
                }
                
                
                if(jCarousel.triggerHandler('beginInit.ThriveCarousel', [settings]) != false){
                              
                    
                    //rearrange slides in a random order
                    if(settings.randomOrder){
                        var list_items = jCarousel.children('li')
                              
                        var temp,x;
                        for (var i = 0; i < settings.totalSlides; i++) {
                            temp = list_items[i];
                            x = Math.floor(Math.random() * settings.totalSlides);
                            list_items[i] = list_items[x];
                            list_items[x] = temp;
                        }
                        $(list_items).remove();
                        jCarousel.append($(list_items));
                    }
                    
                    
                    
                    //apply positioning to slides
                    jCarousel.children('li').each(function(){
                        
                        if(settings.imageLayout == 'default'){
    
                            $(this).css('position','relative');
                            
                        }else if(settings.imageLayout == 'stacked'){
                            
                            $(this).css('position','absolute');
                            
                        }
                        $(this).css('float','left');
                    });
                    
                    
                   
                    
                    
                    //move last slide to before first slide incase previous button clicked
                    if(settings.imageLayout != 'stacked'){
                        for(var i = 0; i < settings.rightCount; i++){
                            jCarousel.children('li:first').before(jCarousel.children('li:last')); 
                        }
                    }
                    
                    
                    jCarousel.triggerHandler('positionSlides.ThriveCarousel', [settings]);
                    
                    resizeCarousel();
       
                    
                    //add events to passed in buttons
                    if(settings.prev != ''){
                        $('#' + settings.prev).click(function(e){
                            gotoPrevSlide();
                            if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
                        });   
                        isPrev = true;
                    }
                    if(settings.next != ''){
                        $('#' + settings.next).click(function(e){
                            gotoNextSlide();
                            if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
                        });
                        isNext = true;
                    }
                    if(settings.bullets != ''){
                        $('#' + settings.bullets).children('li').each(function(i){
                            $(this).click(function(bullet_counter){gotoSetSlide(i);});
                        });
                        isBullets = true;
                        //apply active class to current bullet
                        $($('#' + settings.bullets).children('li')[settings.currentSlide]).addClass(settings.bulletsActiveClass);
                    }
                    
                     
                    
                    //start timer
                    if(settings.autoSlide){
                        carouselTimer = setTimeout(function(){transitionSlides()}, settings.slideInterval);
                    }
                }//end begin init trigger check
                
                
                if(jCarousel.triggerHandler('applyStyle.ThriveCarousel', [settings]) != false){
                    
                    //setting UL styles
                    jCarousel.css('list-style', 'none');
                    jCarousel.css('position', 'relative');
                    jCarousel.css('margin', '0');
                    jCarousel.css('padding', '0');
                    jCarousel.css('-webkit-backface-visibility', 'hidden');
                    jCarousel.css('-ms-touch-action', 'pan-y');

                    
                    //setting UL LI styles
                    jCarousel.children('li').css('-webkit-backface-visibility', 'hidden');

                    
                    //set UL parent DIV style
                    carouselDiv.css('position', 'relative');
                    carouselDiv.css('overflow', 'hidden');
                    
                    if(settings.isResponsive){
                        carouselDiv.css('width', '100%');
                        carouselDiv.css('height', '100%');
                    }else{
                        carouselDiv.css('width', settings.fixedWidth + 'px');
                        carouselDiv.css('height', settings.fixedHeight + 'px'); 
                    }
                    carouselDiv.css('-ms-touch-action', 'none');

                }
                
                if(jCarousel.triggerHandler('endInit.ThriveCarousel', [settings]) != false){
                    release();
                    jCarousel.children('li').attr('data-loaded', 'false');
                    jCarousel.triggerHandler('beginLoad.ThriveCarousel', [settings]);
                }
            }
            
            
            var resizeCarousel = function(){
                
                if(jCarousel.triggerHandler('beginResize.ThriveCarousel', [settings]) != false){
                    
                    if(settings.imgScale == 0){
                        if($(jCarousel.children('li').children('img').length > 0 && $(jCarousel.children('li').children('img')[0]).height() > 0)){
                           settings.imgScale = $(jCarousel.children('li').children('img')[0]).height() / $(jCarousel.children('li').children('img')[0]).width();
                        }else if(jCarousel.children('li').height() > 0){
                            settings.imgScale = jCarousel.children('li').height() / jCarousel.children('li').width();
                        }else{
                            settings.imgScale = 9/16;
                        }
                    }


                    
                    //if responsive then resize carousel to current width/height 
                    if(settings.isResponsive){
                        if(settings.imageLayout == 'default'){
                            //TODO CHECK outerWidth calcs in firefox and IE as shouldn't need the +10 here
                            //Have removed +10 and seems to be working now
                            jCarousel.css('width', ($(carouselParentDiv).outerWidth(true)) * jCarousel.children('li').length + 'px');
                        }else{
                            jCarousel.css('width', $(carouselParentDiv).outerWidth() + 'px');
                            
                        }
                        jCarousel.css('height', $(carouselParentDiv).height() + 'px');
                        if(settings.scaleImages == 'full'){
                            jCarousel.children('li').each(function(){
                               $(this).width($(carouselParentDiv).width());
                               $(this).height($(carouselParentDiv).height());
                            });
                            jCarousel.children('li').children().each(function(){
                               $(this).width($(carouselParentDiv).width());
                               $(this).height($(carouselParentDiv).height());
                            });
                        }
						else if(settings.scaleImages == 'widthonly'){
							jCarousel.css('height','');
                            $(carouselDiv).width(carouselParentDiv.width());
                            jCarousel.children('li').width($(carouselDiv).width());
                            
                        }
						else if(settings.scaleImages == 'height'){
                            $(carouselDiv).width(carouselParentDiv.width());
                            jCarousel.children('li').width($(carouselDiv).width());   
                        }else{
                            $(carouselDiv).height($(carouselDiv).width() * settings.imgScale);

                            jCarousel.height($(carouselDiv).height());
                            jCarousel.children('li').width($(carouselDiv).width());
                            jCarousel.children('li').height($(carouselDiv).height());
                            
                            
                            //NOT SURE IF BELOW CODE IS NEEDED/SHOULD BE USED
                            jCarousel.children('li').children('img').each(function(){
                                $(this).width($(carouselDiv).width());
                                $(this).height($(carouselDiv).height());
                                //console.log('setting width = ' + $(carouselParentDiv).width());
                                //console.log('setting height = ' + $(this).width() * settings.imgScale);
                            });

                        }
                    }else{
                        //not responsive so just keeps at fied width
                        if(settings.imageLayout == 'default'){
                            jCarousel.css('width', settings.fixedWidth * jCarousel.children('li').length + 'px');
                        }else{
                            jCarousel.css('width', settings.fixedWidth * 'px');
                        }
                        jCarousel.css('height', settings.fixedHeight + 'px');
                        
                        jCarousel.children('li').width($(carouselParentDiv).width());
                        jCarousel.children('li').height($(carouselParentDiv).height());
                    }
                    
                    //set slides to same height/width as carousel
                    //jCarousel.children('li').width($(carouselParentDiv).width());
                    //jCarousel.children('li').height($(carouselParentDiv).height());
                    
                    
                    settings.item_width = jCarousel.children('li').outerWidth();

                    
                }//end begin resize trigger check
                //console.log(inUse);
                if(!inUse){
                    jCarousel.triggerHandler('endResize.ThriveCarousel', [settings]);
                }else{
                    resizeInQue = true;   
                }
                
            }
            
            var gotoNextSlide = function(){
                if(jCarousel.triggerHandler('gotoNextSlide.ThriveCarousel', [settings]) != false){

                    var nextSlide = settings.currentSlide + 1;
                    if(nextSlide == settings.totalSlides){
                        nextSlide = 0;   
                    }
                    
                    gotoSlide(nextSlide, true, 'forward');
                }
            }
            
            var gotoPrevSlide = function(){
                
                if(jCarousel.triggerHandler('gotoPrevSlide.ThriveCarousel', [carousel]) != false){
                
                    var nextSlide = settings.currentSlide - 1;
                    if(nextSlide < 0){
                        nextSlide = settings.totalSlides - 1;
                    }
                    
                    gotoSlide(nextSlide, true, 'backward');
                }
            }
            
            var gotoSetSlide = function(slideNumber){
                if(!inUse && slideNumber != settings.currentSlide){
                    lock();
                    if(jCarousel.triggerHandler('gotoSetSlide.ThriveCarousel', [settings, slideNumber]) != false){
                        
                        
                        if(isBullets){
                            $('#' + settings.bullets).children('li').removeClass(settings.bulletsActiveClass);
                            $($('#' + settings.bullets).children('li')[slideNumber]).addClass(settings.bulletsActiveClass);
                        }
                        
                        
                        
                        settings.currentSlide = slideNumber;
                        // mim modify existing logic,  when you click on slide x,  carousel stops rotating
                        clearTimeout(carouselTimer);
                        settings.autoSlide = false;
                        
                        /*  previous logic 
                        if(settings.autoSlide){
                            clearTimeout(carouselTimer);
                            carouselTimer = setTimeout(function(){transitionSlides()}, settings.slideInterval);
                        }
                        //*/
                    }
                }
            }
            
            
            //TODO pass in caller to here so can remove class/animatio end callback
            var resetSlides = function(slidesToLoop, shortestDirection){
                if(jCarousel.triggerHandler('resetSlides.ThriveCarousel', [settings, slidesToLoop, shortestDirection]) != false){
                    release();
                }
            }
            
            
            var transitionSlides = function(){
                if(jCarousel.triggerHandler('transistionSlides.ThriveCarousel', [settings]) != false){
                    
                    nextSlide = settings.currentSlide + 1;
                    if(nextSlide == settings.totalSlides){
                        nextSlide = 0;
                        settings.stopSlider = true;   
                    }
                    currentDirection = 'forward';
                    gotoSlide(nextSlide, false, currentDirection);
                }
            
            }
            
            
            var gotoSlide = function(newSlide, resetTimer, direction){
                if(settings.loaderObject == '' || jCarousel.triggerHandler('hasLoaded.ThriveCarousel', [settings, newSlide]) == 'true'){
                    if(newSlide <= settings.totalSlides && !inUse){
                        if(resetTimer && settings.autoSlide){
                            clearTimeout(carouselTimer);
                            carouselTimer = setTimeout(function(){transitionSlides()}, settings.slideInterval);
                        }
                        animateSlides(newSlide, direction);
                        if (settings.stopSlider){
                            clearTimeout(carouselTimer);
                            settings.autoSlide = false;
                        }
                    }
                }else{
                    
                    //restart timer, not sure if this is needed
                    if(settings.autoSlide){
                        clearTimeout(carouselTimer);
                        carouselTimer = setTimeout(function(){transitionSlides()}, settings.slideInterval);
                    }
                    
                    
                    if(nextSlideWhenLoaded == 0){
                        nextSlideWhenLoaded = newSlide;  
                    }
                }
            }
            
                        
            var animateSlides = function(newSlide, direction){
                if(jCarousel.triggerHandler('beginAnimation.ThriveCarousel', [settings, newSlide, direction]) != false){
                    lock();
                    
                    if(isBullets){
                        $('#' + settings.bullets).children('li').removeClass(settings.bulletsActiveClass);
                        $($('#' + settings.bullets).children('li')[newSlide]).addClass(settings.bulletsActiveClass);  
                    }
    
                    settings.currentSlide = newSlide;
                }
  
            }
            
            
            var endAnimation = function(direction, caller){
                if(jCarousel.triggerHandler('endAnimation.ThriveCarousel', [settings, direction, caller]) != false){
                    release();
                    
                    if(resizeInQue){
                        resizeInQue = false;
                        jCarousel.triggerHandler('endResize.ThriveCarousel', [settings]);
                    }
                    if(settings.autoSlide){
                        clearTimeout(carouselTimer);
                        carouselTimer = setTimeout(function(){transitionSlides()}, settings.slideInterval);
                    }
                    
                    
                }
                
                jCarousel.triggerHandler('endTransition.ThriveCarousel', [settings]);
            }
            

            
            initCarousel(carousel);
            
            $(window).resize(function() {
                if(!recentlyResized){
                    recentlyResized = true;
                    clearTimeout(resizeWait);
                    resizeWait = setTimeout(function(){
                        resizeCarousel(); 
                        recentlyResized = false;
                       
                    }, 25);
                                
                }
            });
            
            $(window).bind('orientationchange', function() {
                resizeCarousel();
            });

            
            if(isTouchDevice()){  
            //Jquery Touch Swipe
                
				var touchsurface = jCarousel.get(0);
                var startX;
                var startY;
                var dist;
                var distY;
                var swipedir;
                var threshold = 15; //required min distance traveled to be considered swipe
                var allowedTime = 400; // maximum time allowed to travel that distance
                var elapsedTime;
                var startTime;
                var hasSwiped;
                
                function handleswipe(swipehandledr){
                    if (swipehandledr == 'right'){
                        jCarousel.triggerHandler('touchSwipeRight');
                        gotoPrevSlide();
                    }else if(swipehandledr == 'left'){
                        jCarousel.triggerHandler('touchSwipeLeft');
                        gotoNextSlide();
                    }
                    hasSwiped = true;
                }
                
                
                function handleTouchStart(e){
                    if (window.navigator.msPointerEnabled) {
                        startX = e.clientX;
                        startY = e.clientY;                        
                    }else{
                        var touchobj = e.changedTouches[0];
                        startX = touchobj.pageX;
                        startY = touchobj.pageY;
                    }
                    dist = 0;
                    startTime = new Date().getTime(); // record time when finger first makes contact with surface
                    hasSwiped = false;
                 
                }
                 
                function handleTouchMove(e){
                    if(!hasSwiped){
                        if(calcTouch(e)){
                            e.preventDefault(); // prevent scrolling when inside DIV
                        }
                    }
                }
                 
                function handleTouchEnd(e){
                    if(!hasSwiped){
                        if(calcTouch(e)){
                            e.preventDefault(); // prevent scrolling when inside DIV
                        }
                    }
  
                }
                
                function calcTouch(e){
                    
                    if (window.navigator.msPointerEnabled) {
                        dist = e.clientX - startX; // get total dist traveled by finger while in contact with surface
                        distY = e.clientY - startY;
                    }else{
                        var touchobj = e.changedTouches[0];
                        dist = touchobj.pageX - startX; // get total dist traveled by finger while in contact with surface
                        distY = touchobj.pageY - startY;
                    }
                    elapsedTime = new Date().getTime() - startTime; // get time elapsed
                    // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
                    if (elapsedTime <= allowedTime){ // first condition for awipe met
                        if (Math.abs(dist) >= threshold){ // 2nd condition for horizontal swipe met
                            swipedir = (dist < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                            handleswipe(swipedir);
                            return true
                        }
                    }
                    return false;
                    
                }
                
                if (window.navigator.msPointerEnabled) {
                  touchsurface.addEventListener("MSPointerDown", handleTouchStart, false);
                  touchsurface.addEventListener("MSPointerMove", handleTouchMove, false);
                  touchsurface.addEventListener("MSPointerUp", handleTouchEnd, false);
                }
                touchsurface.addEventListener('touchstart', handleTouchStart, false);
                touchsurface.addEventListener('touchmove', handleTouchMove, false);
                touchsurface.addEventListener('touchend', handleTouchEnd, false);
			}//end touch swipe check
            
            
            //check if CSS3 transitions/transforms can be used
            function supportsTransitions() {
                
                if(checkCssProperty('transition') && checkCssProperty('transform')){
                    return true;                    
                }
                return false;
            }
            
            function supportsOpacity(){

                if(typeof carousel.style.opacity == 'undefined'){
                    return false;
                }
                return true; 
            }
           
            function checkCssProperty(cssProp){
                var b = document.body || document.documentElement;
                var s = b.style;
                var p = cssProp;
                
                if(typeof s[p] == 'string') {return true; }
                
                // Tests for vendor specific prop
                var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
                p = p.charAt(0).toUpperCase() + p.substr(1);
                for(var i=0; i<v.length; i++) {
                  if(typeof s[v[i] + p] == 'string') { return true; }
                }
                return false;
            }
      
        });
            
    };
}( jQuery ));


