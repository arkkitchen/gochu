(function($){
  $(function(){
    $('#alt_address').hide();

    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $('.modal').modal();
    $('#alt_address_check').click(()=>{
      $('#alt_address').toggle();
    });

    $('.add').click(function(){
      let str = this.className;
      // TODO: method needs to be updated after 9 products
      let id = str.substr(str.indexOf('product-'),str.indexOf('product-')+9);
      let amount = ($(`#${id}-id`).val()) ? Number($(`#${id}-id`).val()) + 1 : 1 ;
      if(amount > 0){
        $(`#${id}-id`).val(amount);
      }
    });

    $('.remove').click(function(){
      let str = this.className;
      // TODO: method needs to be updated after 9 products
      let id = str.substr(str.indexOf('product-'),str.indexOf('product-')+9);
      let amount = ($(`#${id}-id`).val()) ? Number($(`#${id}-id`).val()) - 1 : 0 ;
      if(amount >= 0) {
        $(`#${id}-id`).val(amount);
      }
    });
  });
})(jQuery);