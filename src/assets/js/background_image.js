function BackgroundLoader(){
    
    var loadQue = 0;
    var maxQue = 1;
    var hiddenLoaderHolder;
    var fallbackMode = true;
    
    var customLoaderObject = {

        hasLoaded : function(e, settings, slide){
            //has loaded handler
            //console.log('slide ' + slide + ' has loaded = ' + $(settings.jCarousel.children('li')[slide]).attr('data-loaded'));
            if(fallbackMode){
                return 'true';   
            }
            
            
            if($(settings.jCarousel.children('li')[slide]).attr('data-loaded') != 'error'){
                return $(settings.jCarousel.children('li')[slide]).attr('data-loaded');
            }else{
                return 'true';
            }
                        
        },
        
        loadSlide : function(e, settings, slide){
            //load slide handler
            //console.log('trying to load slide ' + slide);
            
            if(fallbackMode){
                
                if($(settings.jCarousel.children('li')[slide]).attr('data-src') != undefined){
                    $(settings.jCarousel.children('li')[slide]).css('background-image', 'url(' + $(settings.jCarousel.children('li')[slide]).attr('data-src') + ')'); 
                }
                
            }else{
                if($(settings.jCarousel.children('li')[slide]).attr('data-src') != undefined){
                    var newImg = $('<img/>').attr('src', $(settings.jCarousel.children('li')[slide]).attr('data-src'));
            
                    $(newImg).imagesLoaded()
                    .done(function(instance){
                        $(newImg).remove(); 
                        $(settings.jCarousel.children('li')[slide]).css('background-image', 'url(' + $(settings.jCarousel.children('li')[slide]).attr('data-src') + ')');
                        $(settings.jCarousel.children('li')[slide]).attr('data-loaded', 'true');
                        $(customLoaderObject).triggerHandler('slideLoaded.ThriveCarousel', [slide]);
                        
                        if(slide < settings.jCarousel.children('li').length){
                            customLoaderObject.loadSlide(e, settings, slide + 1);   
                        }
                        
                    })
                    .progress(function(instance, image){
                        //var result = image.isLoaded ? 'loaded' : 'broken';
                    });
                }else{
                    $(settings.jCarousel.children('li')[slide]).attr('data-loaded', 'error');
                    if(slide < settings.jCarousel.children('li').length){
                        customLoaderObject.loadSlide(e, settings, slide + 1);   
                    }
                    //console.log('error no data-src found on slide ' + slide);   
                    
                }
                
            }
            
        },
        
        beginLoad : function(e, settings){
            //has loaded handler
            
            if ('querySelectorAll' in document) {
                fallbackMode = false;
            }
            
            hiddenLoaderHolder = $("<div>").hide();
            
            
            settings.jCarousel.children('li').each(function(i){
                if($(this).attr('data-loaded') == 'false'){
                    if(fallbackMode){
                        customLoaderObject.loadSlide(e, settings, i); 
                    }else{
                        customLoaderObject.loadSlide(e, settings, i);
                        return false;
                    }
                }else{
                    //console.log('not loading slide ' + i);   
                }
            });
            
            return true
        },
        
        setEventListeners : function(jCarousel){
            jCarousel.on('beginLoad.ThriveCarousel', this.beginLoad);
            jCarousel.on('hasLoaded.ThriveCarousel', this.hasLoaded);

        }
    
    }
    

    return customLoaderObject;    
}

