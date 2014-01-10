$(document).ready(function() {
	var el = $('#user-name').find('ul');
	$('body:not(el)').on('click', function(){
		if (el.is(':visible')) {
			el.hide();
	}})
	$('#user-name').on('click', function(){
		if (el.is(':hidden')) {
			el.show();
		} else {
			el.hide();
		}	
	})
	event.stopPropagation();
	var pinnedText = $('.pinned').html();
	$('.page-title h1').text(pinnedText);
});