/*function folderIconToggle(classObj){
	var folderClass = classObj.find('span');
	var className = folderClass.attr('class');

	// Remove the existing classes
	folderClass.removeClass('icon-folder icon-folder-open');
	
	// Check to see what the state was, and do the opposite
	if (className == "icon-folder"){
		folderClass.addClass('icon-folder-open');
	}else{
		folderClass.addClass('icon-folder');
	}
};


$(document).ready(function() {
	$('.devcenter-plt-list li:not(.devcenter-plt-list-folder) a').on("click", (function(){
		$("a").removeClass('devcenter-plt-list-selectedItem');
		$(this).addClass('devcenter-plt-list-selectedItem');
	}));
	$('.folder-name').on("click", (function(){
		$(this).closest("li").find('.folder-contents').slideToggle('fast');
		folderIconToggle($(this));
	}));

	$('#plt-name-edit').on("click", (function(){
		$("#plt-name").css({"display":"none"})

	}));
});
*/

/*
$(document).ready(function() {
	$('.devcenter-plt-list li:not(.devcenter-plt-list-folder) a').on("click", (function(){
		$('this a').toggleClass('devcenter-plt-list-selectedItem');
	}))
	$('.folder-name').on("click", (function(){
		$(this).closest("li").find('.folder-contents').slideToggle('fast');
		folderIconToggle($(this));
	}))
});*/



