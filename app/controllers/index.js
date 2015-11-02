Alloy.Globals.tabgroup = $.tabGroup;
//Alloy.Globals.school_tab = $.school_tab;
Alloy.Globals.navWin = $.navWin; 
COMMON.construct($); 
init();
function init(){  
	//load API loadAPIBySequence
	
	COMMON.showLoading(); 
	/***Check school updates***/
	var kidsEducationModel = Alloy.createCollection('kidsEducation'); 
	var ks = kidsEducationModel.getSchoolList();
	if(ks.length > 0){   
		ks.forEach(function(entry) {
			API.getSchoolPost(entry.e_id);
			API.getSchoolClassList(entry.e_id);
			API.getCurriculumList(entry.e_id);  
			API.getEventsList(entry.e_id);  
		});
	}
	API.loadAPIBySequence(); 
}
 
if(OS_IOS){
	$.navWin.open();
}else{
	$.index.open();
}


function loadToDashboard(){
	var user = require("user"); 
	user.checkAuth();
	Ti.App.removeEventListener('app:loadingViewFinish', loadToDashboard); 
}

Ti.App.addEventListener('app:loadingViewFinish', loadToDashboard); 