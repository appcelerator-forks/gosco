Alloy.Globals.schooltabgroup = $.school_tg;
var args = arguments[0] || {};
COMMON.construct($); 
var school_id = args.school_id || ""; 
init();
function init(){  
	$.noticeBoardDetailsView.init({school_id:school_id}); 
}

function backToHome(){
	$.school_tg.close();
}
