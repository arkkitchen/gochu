(function($){
  $(function(){
    $('.dropdown-button').dropdown({
      hover: true,
      belowOrigin: true,
      constrainWidth: false
    });
    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $('.modal').modal();
    $('#alt_address_check').click(()=>{
      $('#alt_address').toggle();
    });
  });
})(jQuery);