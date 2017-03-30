$(function(){
	var setTimerExpiration = false, regularStartRender;
	// If the window has never been resized then we might have the dialogBox uncentered
	regularStartRender = window.setInterval(function(){
		if ($('#TheDialogBox').is(":visible")){
			dimensionAdjustment();
			if (setTimerExpiration == false){
				setTimerExpiration = true;
				expiring();
			}
		}
	}, 1000);
	function expiring(){
		setTimeout(function(){window.clearInterval(regularStartRender);}, 1000);
	}
	$(window).on('resize', function(){
		dimensionAdjustment();
	}).trigger('resize');
	
	function dimensionAdjustment(){
		if($(window).width()<($('#TheDialogBox').width()+200)){
			$('#TheDialogBox').css('margin-left','1%');
		} else {
			$('#TheDialogBox').css({"margin":"0 auto"});
		}
	}
});