Alloy.Globals.tabgroup = $.tabGroup; 
var args = arguments[0] || {}; 
COMMON.construct($); 

index_init();
function index_init(){   
	$.dashboardDetailsView.init();  
	$.schoolDetailsView.init({educationType : 1});
	$.tuitionDetailsView.init({educationType : 2});
	$.othersDetailsView.init();
}

$.doLogout = function(){
	doLogout();
};

function doLogout(){ 
	var dialog = Ti.UI.createAlertDialog({
	    cancel: 0,
	    buttonNames: ['Cancel','Confirm'],
	    message: 'Would you like to logout?',
	    title: 'Logout account'
	});
	dialog.addEventListener('click', function(e){
	  
		if (e.index === e.source.cancel){
	      //Do nothing
	    }
	    if (e.index === 1){
	    	//Do logout  
			Ti.App.Properties.removeProperty('user_id');
			Ti.App.Properties.removeProperty('fullname');
			   		
			var win = Alloy.createController("auth/login").getView();
		  	openModal(win); 
	    }
	});
	dialog.show();
}

if(OS_IOS){
	$.btnLogout.addEventListener('touchend', function(){
		doLogout();
	});
} 

function doOpen() { 
	if(OS_ANDROID){
		//Add a title to the tabgroup. We could also add menu items here if needed
		var activity = $.tabGroup.activity;
	
		if (activity.actionBar) {
			activity.actionBar.title = "My Dashboard";
		}
		
		activity.actionBar.displayHomeAsUp = true;
		activity.actionBar.onHomeIconItemSelected = function(){
			doLogout();
		};
		/***
		activity.onCreateOptionsMenu = function(e) {
			var menuItem = e.menu.add({
				title : "Logout",
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS 
			});
			menuItem.addEventListener("click", function(e) {
				 doLogout();
			});
		};
		***/
	}
}

$.tabGroup.addEventListener('android:back', function (e) {
	doLogout();
	return false;
});