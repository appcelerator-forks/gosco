/*********************
*** APP VERSION CONTROL ***
* 
* Latest Version 1.0
* 
**********************/

// update user device token
exports.checkAndUpdate = function(e){
	API.checkAppVersion(callback_download);
};

function updateAppVersion(appVersion){
	Ti.App.Properties.setString("appVersion", appVersion);
};

function callback_download(result){
	var dialog = Ti.UI.createAlertDialog({
	  cancel: 1,
	  buttonNames: ['Download', 'Cancel'],
	  title: "Latest version download",
	  message: 'Latest version found : '+result.currentVersion
	});
	
	dialog.show();
	
	dialog.addEventListener("click", function(ex){ 
		if(ex.index == 0){
			try { 
				Ti.Platform.openURL(result.data);
				 
			} catch(e) {
			    Ti.API.info("result ==> " + JSON.stringify(result));
			}
			updateAppVersion(result.currentVersion);
		}
	});
	
}
