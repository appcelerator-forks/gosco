Alloy.Globals.schooltabgroup = $.school_tg;
var args = arguments[0] || {};
COMMON.construct($); 
var school_id = args.school_id || ""; 
var ke_id = args.ke_id || ""; 
var ec_id = args.ec_id || ""; 
var details;
var educationModel = Alloy.createCollection('education');  
init();
function init(){   
	details = educationModel.getSchoolById(school_id);
	
	setTimeout(function(){
		$.noticeBoardDetailsView.init({school_id:school_id}); 
	},800);
	
	
	setTimeout(function(){
		$.eventsDetailsView.init({school_id:school_id}); 
	},1000);
	
	//setTimeout(function(){
	//	$.curriculumDetailsView.init({school_id:school_id}); 
	//},1300);
	
	setTimeout(function(){
		$.awardDetailsView.init({school_id:school_id}); 
	},1600);
	
	setTimeout(function(){
		API.getHomeworkList(ec_id,1);
		$.homeworkDetailsView.init({ec_id:ec_id,school_id:school_id});
	},2000); 
}

$.backToHome = function(){
	backToHome();
};

function backToHome(){
	//$.curriculumDetailsView.removeEvent(); 
	$.school_tg.close();
}

function doOpen() { 
	if(OS_ANDROID){
		
		
		//Add a title to the tabgroup. We could also add menu items here if needed
		var activity = $.school_tg.activity;
	
		if (activity.actionBar) {
			activity.actionBar.title = details.name;
		}
		
		activity.actionBar.displayHomeAsUp = true;
		activity.actionBar.onHomeIconItemSelected = function(){
			backToHome();
		};
		 
		activity.onCreateOptionsMenu = function(e) {
			var menuItem = e.menu.add({
				title : "Remove",
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS  
			});
			menuItem.addEventListener("click", function(e) {
				removeEducation();
			});
		};
		 
	}
}

function removeEducation(){
	var schoolType = "school";
	if(details.education_type == "2"){
		schoolType = "tuition";
	}
	
	 var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Cancel','Confirm'],
		    message: 'Are you sure want to remove this '+schoolType+' from your kid?',
		    title: 'Remove '+schoolType+' from kid'
		});
		dialog.addEventListener('click', function(e){
		  
			if (e.index === e.source.cancel){
		      //Do nothing
		    }
		    
		    if (e.index === 1){
		    	var kidsEducationModel = Alloy.createCollection('kidsEducation'); 
		    	kidsEducationModel.removeById(ke_id); 
		    	API.removeKidsClass({id:ke_id }); 
		    	Ti.App.fireEvent('refreshKidsDetails');
		    	backToHome();
		    }
		});
		dialog.show(); 
}

