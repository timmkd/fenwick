// eslint-disable-line no-console
var fen = (function(){
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
        $('.gift').on('click',function(){
          $(this).find('a').tab('showDelayed');
          open($(this));
        });
      }
    };
  })();

  var tabs = (function(){
    return{
      init: function(){

        $('.load-tab').on('click',function(){
          $('.gift.open').removeClass('open');
          $(this).tab('showQuick');
        });
      }
    };
  })();

  return {
    init: function(){
      giftBoxes.init();
      tabs.init();
    }
  }
})();

$(document).ready(function(){
  fen.init();
});