var args = arguments[0] || {};
COMMON.construct($);
console.log("load login start");
if(OS_IOS){
	Alloy.Globals.navWin = $.navWin;
}

function do_signup(){
	var win = Alloy.createController("auth/signup").getView();
	COMMON.openWindow(win);
}

function do_login(){
	var username     = $.username.value;
	var password	 = $.password.value;
	if(username ==""){
		COMMON.createAlert("Fail","Please fill in your username");
		return false;
	}
	if(password =="" ){
		COMMON.createAlert("Fail","Please fill in your password");
		return false;
	}
	var params = { 
	 
		username: username,  
		password: password
	};
	COMMON.showLoading();    
	API.doLogin(params, $); 
	
}
 console.log("load login end");