var fullname;
var mobile;
var username;
var login = false;

exports.checkAuth = function() {
	var u_id = Ti.App.Properties.getString('user_id');
	if(u_id != "" ){
		login = true;
	}
	
    if(!login){
    	var win = Alloy.createController("auth/login").getView();
    	openNewWindow(win);
    } 
    return login;
};