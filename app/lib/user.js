var fullname;
var mobile;
var username; 

exports.checkAuth = function() {
	var u_id = Ti.App.Properties.getString('user_id'); 
	if(u_id == "" || u_id == null){
		var win = Alloy.createController("auth/login").getView();
    	openNewWindow(win);
	} else {
    	var win = Alloy.createController("main").getView();
    	openNewWindow(win);
    } 
    
};