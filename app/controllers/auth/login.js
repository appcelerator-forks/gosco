var args = arguments[0] || {};

function do_signup(){
	var win = Alloy.createController("auth/signup").getView();
	$.navWin.openWindow(win);
}

function do_login(){
	var win = Alloy.createController("main").getView();
	win.open(win);
}
