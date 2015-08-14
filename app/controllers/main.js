var args = arguments[0] || {};
COMMON.construct($);
//var schoolModel = Alloy.createCollection('school'); 
//var school = schoolModel.getSchoolList();
//console.log(school);
var addKid = function(){ 
	var win = Alloy.createController("kidsForm").getView();
	$.mainWin.openWindow(win);
};


$.btnLogout.addEventListener('touchend', function(){
	//Do logout  
	Ti.App.Properties.removeProperty('user_id');
	Ti.App.Properties.removeProperty('fullname');
	   		
	var win = Alloy.createController("auth/login").getView();
  	openNewWindow(win);
});
