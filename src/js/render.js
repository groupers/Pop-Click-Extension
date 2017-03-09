$(function(){
	var $window = $(window).on('resize', function(){
		// if(){
			console.log($(window).width()+" "+($('#TheDialogBox').width()+200))
			var modWidth = 50;
			if($(window).width()<($('#TheDialogBox').width()+200)){
				$('#TheDialogBox').css('margin-left','1%');
			} else {
				$('#TheDialogBox').css({"margin":"0 auto"});
			}
		}).trigger('resize');
});