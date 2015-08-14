var args = arguments[0] || {};
COMMON.construct($);

function doRegister(){
	var fullname     = $.fullname.value;
	var mobile       = $.mobile.value;
	var email  	  	 = $.email.value;
	var username     = $.username.value;
	var password	 = $.password.value;
	var confirm 	 = $.confirm.value;
	if(fullname ==""){
		COMMON.createAlert("Fail","Please fill in your full name");
		return false;
	}
	if(mobile ==""){
		COMMON.createAlert("Fail","Please fill in your contact number");
		return false;
	}
	if(email ==""){
		COMMON.createAlert("Fail","Please fill in your email address");
		return false;
	}
	if(username ==""){
		COMMON.createAlert("Fail","Please fill in your username");
		return false;
	}
	if(password =="" || confirm ==""){
		COMMON.createAlert("Fail","Please fill in your password");
		return false;
	}
	if(password != confirm){
		COMMON.createAlert("Fail","Both password must be same");
		return false;
	}
	if(password.length < 6){
		COMMON.createAlert("Fail","Password must at least 6 alphanumberic");
		return false;
	}
	
	var params = { 
		fullname: fullname,
		mobile: mobile,
		email: email,
		username: username,  
		password: password
	};
	COMMON.showLoading();   
	API.doSignUp(params, $);
}
