var args = arguments[0] || {}; 
COMMON.construct($);
		
var loadingBar;
var add_kid = function(){
	var name       = $.name.value;
	var dob        = $.dob.value;
	var hobby  	   = $.hobby.value;
	var contact    = $.contact.value;
	
	console.log(name+"=="+contact);
}; 
		
var showSchool = function(){ 
	 var win = Alloy.createController("schoolList").getView();
	openNewWindow(win);
}; 

var selectSchool = function(e){
	console.log(e.school);
};

Ti.App.addEventListener('selectSchool',selectSchool);