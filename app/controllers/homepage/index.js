Alloy.Globals.tabgroup = $.tabGroup;
Alloy.Globals.navWin = $.navWin;
var args = arguments[0] || {}; 
COMMON.construct($); 

init();
function init(){   
	$.dashboardDetailsView.init();  
	$.schoolDetailsView.init({educationType : 1});
	$.tuitionDetailsView.init({educationType : 2});
}


