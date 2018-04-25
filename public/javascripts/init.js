(function($){
  $(function(){
    $('#billing').hide();
    $('.dropdown-button').dropdown({
      hover: true,
      belowOrigin: true,
      constrainWidth: false
    });
    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $('.modal').modal();
    $('.collapsible').collapsible();
    $('#alt_address_check').click(()=>{
      $('#billing').toggle();
    });
  });
})(jQuery);