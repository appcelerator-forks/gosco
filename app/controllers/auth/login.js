var args = arguments[0] || {};
COMMON.construct($); 
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

/*** Facebook login***/ 
/***Facebook Library***/ 
var FACEBOOK = require('facebook');
FACEBOOK.appid = "1636245926664883";
FACEBOOK.permissions = ['email','public_profile','user_friends']; // Permissions your app needs
FACEBOOK.initialize(1000); 
FACEBOOK.forceDialogAuth = true; 

$.fbloginView.add(FACEBOOK.createLoginButton({
	top : 10,
	readPermissions: ['email','public_profile','user_friends'],
	style : FACEBOOK.BUTTON_STYLE_WIDE
}));  

 
function loginFacebook(e){   
	if (e.success) { 
		COMMON.showLoading();
	    FACEBOOK.requestWithGraphPath('/me?fields=id,email,name,link', { }, 'GET', function(e) { //'/me?fields=id,email,name,link'
		    if (e.success) { 
		    	var fbRes = JSON.parse(e.result); 
		     	console.log(fbRes);
		     	API.doFacebookLogin({
			       	email: fbRes.email,
			       	fbid: fbRes.id,
			       	link: fbRes.link,
			       	name: fbRes.name
			    }, $);
			   
		    }
		}); 
		//FACEBOOK.removeEventListener('login', loginFacebook); 
	}  else if (e.error) {
		       
	} else if (e.cancelled) {
		        
	}  	 
} 
	 
FACEBOOK.addEventListener('login', loginFacebook);    