var Cloud = require('ti.cloud');  
var redirect = false;
var app_status;
if(Ti.Platform.osname == "android"){ 
	var CloudPush = require('ti.cloudpush'); 
	CloudPush.addEventListener('callback', function (evt) { 
		var payload = JSON.parse(evt.payload); 

		Ti.App.Payload = payload;
		// if trayClickLaunchedApp or trayClickFocusedApp set redirect as true
		if(redirect){ 
			receivePush(payload);
		}else{ 
			var dialog = Ti.UI.createAlertDialog({
					cancel: 1,
					buttonNames: ['Cancel','OK'],
					message: 'New message available. Do you want to read now?',
					title: 'Confirmation'
				});
				dialog.addEventListener('click', function(e){
					if (e.index === 0){
						//Do nothing
					}

					if (e.index === 1){
						receivePush(payload);
					}
				});
				dialog.show();  
		}
	});
	
	CloudPush.addEventListener('trayClickLaunchedApp', function (evt) {
		redirect = true;
		app_status = "not_running";  
	});
	CloudPush.addEventListener('trayClickFocusedApp', function (evt) {
		redirect = true;
		app_status = "running";  
	}); 
} 

function getNotificationNumber(payload){ 
	//console.log(payload);
}
	
// Process incoming push notifications
function receivePush(e) { 
	if (OS_IOS) {
		Titanium.UI.iPhone.setAppBadge("0");
	}
	
	//console.log(e);
	
	if(OS_IOS){
		Titanium.UI.iPhone.setAppBadge("0"); 
		 
		target = e.data.category;
		url = e.data.target;
	}else{ 
		target = e.category;
		url = e.target;
	}  
	
	if(target == "announcement"){
		var postModel = Alloy.createCollection('post');  
		var post_element_model = Alloy.createCollection('post_element');  
		var param = { 
			"e_id"	  : url
		};
		 
			API.callByPost({url:"getSchoolPost", params: param}, function(responseText){ 
				var res = JSON.parse(responseText);  
				if(res.status == "success"){ 
					var postData = res.data;   
					 if(postData != ""){ 
					 	 var post = res.data.post;   
						 postModel.addPost(post);  
						 post_element_model.addElement(post);   
					 } 
					 
					setTimeout(function(){ 
						var win = Alloy.createController("postDetails", {p_id: url, from: "dashboard"}).getView();  
						Alloy.Globals.tabgroup.activeTab.open(win);
					},3000);
					 
					 
				} 
			});
		
		
	}
	
	//Action after receiving push message
	 
	return false;
}

function deviceTokenSuccess(ex) {
    deviceToken = ex.deviceToken;
    Cloud.Users.login({
	    login: 'gosco',
	    password: '123456'
	}, function (e) {
		if (e.success) {
			 //subscribe
						Cloud.PushNotifications.subscribe({
						    channel: 'general',
						    type:Ti.Platform.name == 'android' ? 'android' : 'ios', 
						    device_token: deviceToken
						}, function (e) { 
						    if (e.success  ) { 
						    	/** User device token**/
				         		Ti.App.Properties.setString('deviceToken', deviceToken);  
								API.getDeviceInfo();
						    } else {
						    	registerPush();
						    }
						});
		    
		   
	    } else {
	    	 
	    }
	});
}
function deviceTokenError(e) {
    alert('Failed to register for push notifications! ' + e.error);
}

function registerPush(){
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
 
	 // Wait for user settings to be registered before registering for push notifications
	    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
	 
	 // Remove event listener once registered for push notifications
	        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
	 
	        Ti.Network.registerForPushNotifications({
	            success: deviceTokenSuccess,
	            error: deviceTokenError,
	            callback: receivePush
	        });
	    });
	 
	 // Register notification types to use
	    Ti.App.iOS.registerUserNotificationSettings({
		    types: [
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
	        ]
	    });
	}else if(Ti.Platform.osname == "android"){
		CloudPush.retrieveDeviceToken({
		    success: deviceTokenSuccess,
		    error: deviceTokenError
		});
	}else{
		Titanium.Network.registerForPushNotifications({
		    types: [
		        Titanium.Network.NOTIFICATION_TYPE_BADGE,
		        Titanium.Network.NOTIFICATION_TYPE_ALERT,
		        Titanium.Network.NOTIFICATION_TYPE_SOUND
		    ],
			success:deviceTokenSuccess,
			error:deviceTokenError,
			callback:receivePush
		});
	}
	
}

exports.registerPush = function(){
	registerPush();
};