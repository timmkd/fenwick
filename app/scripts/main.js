// eslint-disable-line no-console
var ssm = ssm || {};
var adventData = adventData || {};
var fen = (function(){
  var currentDate = typeof adventData.currentDate !== "undefined" ? new Date(adventData.currentDate).setHours(0,0,0,0) : new Date().setHours(0,0,0,0);
  var startDate =new Date(adventData.startDate).setHours(0,0,0,0);
  console.log(currentDate);

  var calIsActive = (function(){
    if(currentDate >= startDate){
      return true;
    }
    return false;
  })();

  var convertDate = function(inputFormat) {
    var d = new Date(inputFormat);
    return [(d.getDate()), (d.getMonth()+1), d.getFullYear()].join('/');
  }

  var states = (function(){
    //set responsive states
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
    var $giftItems = $('.gift'),
    $gifts = $('.gifts');
    

    function open($gift){
      $('.gift.open').removeClass('open');
      $gift.addClass('open');
    }

    //go through all .gift items and active them if it is on or after their open date
    function activateViaDate(){
      $giftItems.each(function(){
        var date = new Date($(this).data('date')).setHours(0,0,0,0);
        if( date <= currentDate) {
          $(this).addClass('enabled');
        }
      });
    }

    function giftClick(){
      $giftItems.on('click',function(e){
        var overlaySource, template, html, context;

        e.preventDefault();

        //if calendar is active we can open active gifts
        if(calIsActive){
          if($(this).hasClass('enabled')){
            open($(this));
            $(this).find('a').tab('showQuick');
          } else {
            overlaySource = $('#day-closed').html();
            template = Handlebars.compile(overlaySource);
            context = {
              number:$(this).data('number'), 
              date:convertDate($(this).data('date'))
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
        } else {
          overlaySource = $('#cal-closed').html();
          template = Handlebars.compile(overlaySource);
          context = {
            date:convertDate(adventData.startDate)
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

    return{
      init: function(){
        activateViaDate();
        giftClick();

        $gifts.isotope({
          itemSelector: '.gift',
          layoutMode: 'packery'
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

      var source = $('#day-content').html();
      var template = Handlebars.compile(source);
      var context = adventData;
      var html = template(context);
      $('.tab-content').append(html);

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