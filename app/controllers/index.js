Alloy.Globals.tabgroup = $.tabGroup;
Alloy.Globals.school_tab = $.school_tab;


/**
 * Lets add a loading animation - Just for Fun!
 */
var loadingView = Alloy.createController("loader");
loadingView.getView().open();
loadingView.start();

function loadingViewFinish(){
	loadingView.finish(function(){ 
		init();
		loadingView = null;
	});
}

function init(){
	var user = require("user"); 
	user.checkAuth();
}

Ti.App.addEventListener('app:loadingViewFinish', loadingViewFinish);

