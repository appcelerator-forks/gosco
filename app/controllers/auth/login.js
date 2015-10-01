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
$.fbloginView.add(FACEBOOK.createLoginButton({
	    top : 10,
	   	readPermissions: ['email','public_profile','user_friends'],
	    style : FACEBOOK.BUTTON_STYLE_WIDE
}));  
  
function loginFacebook(e){ 
	if (e.success) { 
		common.showLoading();
	    FACEBOOK.requestWithGraphPath('me', { }, 'GET', function(e) {
	    	 
		    if (e.success) { 
		    	var fbRes = JSON.parse(e.result);
		     	Ti.App.Properties.setString('plux_email',fbRes.email);
		     	API.updateUserFromFB({
			       	email: fbRes.email,
			       	fbid: fbRes.id,
			       	link: fbRes.link,
			       	name: fbRes.name,
			       	gender:fbRes.gender,
			    }, $);
			   
		    }
		}); 
		FACEBOOK.removeEventListener('login', loginFacebook); 
	}  else if (e.error) {
		       
	} else if (e.cancelled) {
		        
	}  	 
} 
	 
FACEBOOK.addEventListener('login', loginFacebook); 
