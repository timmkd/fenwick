// eslint-disable-line no-console
var ssm = ssm || {};
var fen = (function(){

  var states = (function(){
    return{
      init: function(){
        ssm.addState({
          id: 'narrow',
          query: '(max-width: 599px)',
          onEnter: function(){
              console.log('enter narrow');
          }
        });
        ssm.addState({
          id: 'medium',
          query: '(min-width: 600px) and (max-width: 991px)',
          onEnter: function(){
              console.log('enter medium');
          }
        });
        ssm.addState({
          id: 'wide',
          query: '(min-width: 992px)',
          onEnter: function(){
              console.log('enter wide');
          }
        });
      }
    };
  })();

  var giftBoxes = (function(){
    function open($gift){
      $('.gift.open').removeClass('open');
      $gift.addClass('open');
    }

    return{
      init: function(){
        $('.gifts').isotope({
          itemSelector: '.gift',
          layoutMode: 'packery'
        });

        $('.gift').on('click',function(e){
          var overlaySource, template, html, context;

          e.preventDefault();

          if($(this).hasClass('enabled')){
            open($(this));
            $(this).find('a').tab('showQuick');
          } else {
            overlaySource = $('#dayclosed').html();
            template = Handlebars.compile(overlaySource);
            context = {
              number:$(this).data('number'), 
              date:$(this).data('date')
            };
            html = template(context);
            
            if(ssm.getState('narrow').active){
              $.colorbox({width:"300", opacity:0.29, html: html});
            }
            if(ssm.getState('medium').active){
              $.colorbox({width:"500", opacity:0.29, html: html});
            }
            if(ssm.getState('wide').active){
              $.colorbox({width:"600", opacity:0.29, html: html});
            }
          }
        });
      }
    };
  })();

  var tabs = (function(){
    return{
      init: function(){

        $('.load-tab').on('click',function(e){
          e.preventDefault();
          $('.gift.open').removeClass('open');
          $(this).tab('showQuick');
        });
      }
    };
  })();

  var overlays = (function(){
    return{
      init: function(){

        $(".product-image").on('click',function(){
          if(ssm.getState('narrow').active){
            //$(".inline-overlay").colorbox({inline:true, width:"900", opacity:0.29});
          }
          if(ssm.getState('medium').active){
            $.colorbox({inline:true, width:"600", opacity:0.29, href: $(this).attr('href')});
          }
          if(ssm.getState('wide').active){
            $.colorbox({inline:true, width:"900", opacity:0.29, href: $(this).attr('href')});
          }
        });
      }
    };
  })();



  return {
    init: function(){
      states.init();
      giftBoxes.init();
      tabs.init();
      overlays.init();

    }
  }
})();

$(document).ready(function(){
  fen.init();
});