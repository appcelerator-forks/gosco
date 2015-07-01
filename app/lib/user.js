var fullname;
var mobile;
var username;
var login = false;

exports.checkAuth = function() {
    if(!login){
    	var win = Alloy.createController("auth/login").getView();
    	openNewWindow(win);
    }
    return login;
};