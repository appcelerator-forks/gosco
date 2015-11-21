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

function do_forgotPassword(){
	var win = Alloy.createController("auth/forgotPassword").getView();
	COMMON.openWindow(win); 
}
/*** Facebook login***/  

if (Ti.Platform.name === 'android') {
    $.win.fbProxy = FACEBOOK.createActivityWorker({lifecycleContainer: $.win});
}
$.fbloginView.add(FACEBOOK.createLoginButton({
	top : 10,
	readPermissions: ['email','public_profile','user_friends'],
	style : FACEBOOK.BUTTON_STYLE_WIDE
}));  

function loginFacebook(e){    
	if (e.success) {  
		COMMON.showLoading(); 
	    FACEBOOK.requestWithGraphPath('me', {'fields': 'id, email,name,link'}, 'GET', function(e) { //'/me?fields=id,email,name,link
	  		if (e.success) { 
		    	var fbRes = JSON.parse(e.result);  
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

if(OS_ANDROID){
	$.win.addEventListener('android:back', function (e) {
		var dialog = Ti.UI.createAlertDialog({
			cancel: 1,
			buttonNames: ['Cancel','Confirm'],
			message: 'Would you like to exit Gosco App?',
			title: 'Exit app'
		});
		dialog.addEventListener('click', function(e){
			  
		    if (e.index === e.source.cancel){
			     //Do nothing
			 }
			if (e.index === 1){
				var activity = Titanium.Android.currentActivity;
				activity.finish();
			}
		});
		dialog.show(); 
		return false;
	});
		 
}

FACEBOOK.addEventListener('login', loginFacebook);    