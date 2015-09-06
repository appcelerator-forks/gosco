Alloy.Globals.tabgroup = $.tabGroup;
Alloy.Globals.navWin = $.navWin;
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
	//Do logout  
	Ti.App.Properties.removeProperty('user_id');
	Ti.App.Properties.removeProperty('fullname');
	   		
	var win = Alloy.createController("auth/login").getView();
  	openModal(win); 
}

if(OS_IOS){
	$.btnLogout.addEventListener('touchend', function(){
		doLogout();
	});
} 

function doOpen() { 
	//Add a title to the tabgroup. We could also add menu items here if needed
	var activity = $.win1.activity;

	if (activity.actionBar) {
		activity.actionBar.title = "Gosco";
	}

	activity.onCreateOptionsMenu = function(e) {
		var menuItem = e.menu.add({
			title : "Logout",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			icon :   "/images/logout.png"
		});
		menuItem.addEventListener("click", function(e) {
			 doLogout();
		});
	};
}

