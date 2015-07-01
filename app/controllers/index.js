Alloy.Globals.tabgroup = $.tabGroup;
Alloy.Globals.school_tab = $.school_tab;

var user = require("user");

if(user.checkAuth()){
	$.tabGroup.open();
}