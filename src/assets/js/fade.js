function FadeAnimation(){
    
    var left_value;
    
    var customAnimationObject = {
        
        positionSlides : function(e, settings){
            settings.jCarousel.children('li').each(function(){
                $(this).css({
					position: 'absolute',
					opacity: 0,
					'z-index': 0
				});
                if(!settings.supportsOpacity){
                    $(this).css('visibility', 'hidden');
                }
            });
            
            
            return true
        },
        
        endInit : function(e, settings){
            $(settings.jCarousel.children('li')[0]).css({
				opacity: 1,
				'z-index': 1
			});
            if(!settings.supportsOpacity){
                $(settings.jCarousel.children('li')[0]).css('visibility', 'visible');
            }
            return true
        },
        
        endResize : function(e, settings){
            left_value = 0; 
            settings.jCarousel.css({'left' : left_value});
            
            return true
        },
        
        gotoSetSlide : function(e, settings, slideNumber){
            //go to set slide handler
            
            //this can be used if the gotoSetSlide function is the same as animateSlides function
            $(customAnimationObject).triggerHandler('animationForceCallback.ThriveCarousel', [slideNumber, 'forward']);

            return true
            
        },
        
        beginAnimation : function(e, settings, newSlide, direction){
            //begin animation handler
            if(!settings.supportsOpacity){
                $(settings.jCarousel.children('li')[settings.currentSlide]).css('visibility', 'visible');
                $(settings.jCarousel.children('li')[newSlide]).css('visibility', 'visible');
            }
            
            if(settings.useAnimations){
                
                if(!$(settings.jCarousel.children('li')[settings.currentSlide]).hasClass(settings.transitionClass)){
                    $(settings.jCarousel.children('li')[settings.currentSlide]).addClass(settings.transitionClass);
                }
                
                if(!$(settings.jCarousel.children('li')[newSlide]).hasClass(settings.transitionClass)){
                    $(settings.jCarousel.children('li')[newSlide]).addClass(settings.transitionClass);
                }
                
                $(settings.jCarousel.children('li')[settings.currentSlide]).css({
					opacity: 0,
					'z-index': 0
				});
                $(settings.jCarousel.children('li')[newSlide]).css({
					opacity: 1,
					'z-index': 1
				});
                
                $(settings.jCarousel.children('li')[settings.currentSlide]).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){$(customAnimationObject).triggerHandler('animationCallback.ThriveCarousel', [direction, $(settings.jCarousel.children('li')[settings.currentSlide])]);});
                
                $(settings.jCarousel.children('li')[newSlide]).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){$(customAnimationObject).triggerHandler('animationCallback.ThriveCarousel', [direction, $(settings.jCarousel.children('li')[newSlide])]);});
                
            }else{
                $(settings.jCarousel.children('li')[settings.currentSlide]).css('z-index', 0).animate({'opacity':0}, settings.slideAnimationTime);
                
                if(!settings.supportsOpacity){
                    $(settings.jCarousel.children('li')[settings.currentSlide]).css('visibility', 'hidden');
                    $(settings.jCarousel.children('li')[newSlide]).css('visibility', 'visible');
                }
                $(settings.jCarousel.children('li')[newSlide]).css('z-index', 1).animate({'opacity':1}, settings.slideAnimationTime, function(){$(customAnimationObject).triggerHandler('animationCallback.ThriveCarousel', [direction, $(settings.jCarousel.children('li')[newSlide])]);});  
            }
            
            return true
        },
        
        endAnimation : function(e, settings, direction, caller){
            //end animation handler
            $(caller).removeClass(settings.transitionClass);
            $(caller).off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");

            return true
        },
        
        

        
        setEventListeners : function(jCarousel){
            jCarousel.on('endInit.ThriveCarousel', this.endInit);
            jCarousel.on('positionSlides.ThriveCarousel', this.positionSlides);
            jCarousel.on('endResize.ThriveCarousel', this.endResize);
            jCarousel.on('gotoSetSlide.ThriveCarousel', this.gotoSetSlide);
            jCarousel.on('beginAnimation.ThriveCarousel', this.beginAnimation);
            jCarousel.on('endAnimation.ThriveCarousel', this.endAnimation);
            jCarousel.on('resetSlides.ThriveCarousel', this.resetSlides);
            
        }
    
    }
    

    return customAnimationObject;    
}
