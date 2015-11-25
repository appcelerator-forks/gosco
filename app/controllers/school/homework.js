var args = arguments[0] || {};

COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var homeworkModel = Alloy.createCollection('homework'); 
var homeworkAttachmentModel = Alloy.createCollection('homeworkAttachment'); 
var educationClassModel = Alloy.createCollection('education_class');
var searchKey = "";
var ec_id; 
var offset = 0;
if(OS_IOS){
	var viewTolerance = 550;
}else{
	var viewTolerance = 700;
}
var lastDistance = 0;
var nextDistance = viewTolerance;

var pageTbl = $.UI.create('TableView',{
	classes: ["wfill", "hfill", "padding", "box"]
});
 
function init(e){
	ec_id = e.ec_id;  
	loadHomework();
}   

function loadHomework(){ 
	//COMMON.hideLoading(); 
	details = homeworkModel.getHomeworkByClass(ec_id,searchKey, offset);
 	//COMMON.removeAllChildren($.homeworkSv);  
	if(details.length > 0){ 
		var count =1;
		var currentDate;
		details.forEach(function(entry) {
			var cre = entry.created.substring(0,10); 
			if(cre != currentDate){
				var view11 = $.UI.create('View',{
					classes :['hsize','themeBg','padding','box' ],  
				});
				var label0 = $.UI.create('Label',{
					classes :['h5','hsize' ,'whiteColor', 'padding-top', 'padding-bottom', 'wfill','center' ],   
					text: timeFormat(cre)
				});
				view11.add(label0);
				currentDate = cre;
				$.homeworkSv.add(view11);
			} 
			
			var statusColor = "#8A6500";
			if(entry.status == "1"){ //publish
				statusColor = "#2C8A00";
			} 
			if(entry.deadline < currentDateTime() ){  
				statusColor = "#CE1D1C";
			}
			
			var horzView = $.UI.create('View',{
				classes: ['horz','wfill'], 
				source: entry.id,  
				backgroundColor: "#ffffff",
				height: 60 
			});
			
			var statustView = $.UI.create('View',{
				classes: ['hfill'],
				source: entry.id,
				width: 10,
				backgroundColor: statusColor
			});
			horzView.add(statustView);
			
			
			//Class room
			var eduClass= educationClassModel.getEducationClassById(entry.ec_id);
			var classView = $.UI.create('View',{
				classes: ['hfill'],
				source: entry.id,
				width: 40 
			});
			
			var classLabel  = $.UI.create('Label',{
				classes :['h4', 'hsize' ,'font_light_grey','wsize' ],  
				source :entry.id,
				text: eduClass.className
			});
			classView.add(classLabel);
			horzView.add(classView);
			
			var statustView = $.UI.create('View',{
				classes: ['hfill'],
				source: entry.id,
				width: 1,
				backgroundColor: "#ececec"
			});
			horzView.add(statustView);
			
    		var view0 = $.UI.create('View',{
				classes :['hsize' ],
				source :entry.id,
				width: "auto",
				selectedBackgroundColor : "#ffffff", 
			});
			
			var view1 = $.UI.create('View',{
				classes :['hsize', 'vert'],
				source :entry.id,
				selectedBackgroundColor : "#ffffff", 
			});
			
			var label1 = $.UI.create('Label',{
				classes :['h5','hsize' ,'themeColor', 'padding-left','bold' ], 
				width: "80%",
				source :entry.id,
				top:5,
				text: entry.subject
			});
			 
			var label2 = $.UI.create('Label',{
				classes :['h6', 'hsize' ,'font_light_grey', 'padding-left' ],  
				width: "80%",
				source :entry.id,
				text: "Deadline : "+ convertFromDBDateFormat(entry.deadline)
			});
			
			var attList = homeworkAttachmentModel.getRecordByHomework(entry.id); 
			var label3 = $.UI.create('Label',{
				classes :['h6', 'hsize' ,'font_light_grey', 'padding-left','padding-bottom' ],  
				width: "80%",
				source :entry.id,
				text:  attList.length  + " Attachment(s)"
			});
			
			var imgView1 = $.UI.create('ImageView',{
				image : "/images/btn-forward.png",
				source :entry.id,
				width : 20,
				height : 20,
				right: 10
			});
		 	
			view1.add(label1);
			view1.add(label2); 
			view1.add(label3);
			view0.add(view1);
			view0.add(imgView1);
			view0.addEventListener('click', addClickEvent);
			horzView.add(view0);
			$.homeworkSv.add(horzView);
			
			if(details.length != count){
				var viewLine = $.UI.create('View',{
					classes :['gray-line']
				}); 
				$.homeworkSv.add(viewLine);
			} 
			count++; 
		});
	  	offset += 10;
	}else{
	 	COMMON.removeAllChildren($.homeworkSv);  
	 	var view11 = $.UI.create('View',{
			classes :['hsize','padding','wfill' ],  
			backgroundColor : "#ffffff" 
		});
		var label0 = $.UI.create('Label',{
			text: "No record found", 
			color: '#375540', 
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font:{fontSize:14,fontStyle:'italic'},
			top: 15,
			bottom:15,
			width: "100%"
		});
		view11.add(label0);
	 	$.homeworkSv.add(view11);
	}
	hideLoading(); 	
}


function syncData(){ 
	var param = { 
		"ec_id"	  : ec_id
	};
	API.callByPost({url:"getHomeworkList", params: param}, function(responseText){
		 
		var res = JSON.parse(responseText);  
		if(res.status == "success"){  
			var homeworkModel = Alloy.createCollection('homework'); 
			var homeworkAttachmentModel = Alloy.createCollection('homeworkAttachment'); 
			var arr = res.data;  
			homeworkModel.saveArray(arr);  
			homeworkAttachmentModel.saveArray(arr);
			
			$.homeworkSv.opacity = 0;
			COMMON.removeAllChildren($.homeworkSv);  
			offset =0;
			$.homeworkSv.opacity = 1;
			loadHomework();
		} 
	});
	
}


$.refresh.addEventListener('click', function(){
	showLoading();
	syncData();
});


$.homeworkSv.addEventListener("scroll", function(e){ 
	lastDistance = e.y;   
	 
	if(lastDistance >= nextDistance){ 
		nextDistance += viewTolerance; 
		loadHomework();
	}  
	 
});

/*** private function***/
function showLoading(){ 
	$.activityIndicator.show();
	$.loadingBar.opacity = 1;
	$.loadingBar.zIndex = 100;
	$.loadingBar.height = 120;
	 
	if(OS_ANDROID){ 
		$.activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG; 
	}else if (OS_IOS){ 
		$.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	}  
}


function hideLoading(){
	$.activityIndicator.hide();
	$.loadingBar.opacity = "0";
	$.loadingBar.height = "0"; 
}
function addClickEvent(e){ 
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);   
	var win = Alloy.createController("school/homeworkDetails", {homework_id: res.source}).getView();  
	Alloy.Globals.schooltabgroup.activeTab.open(win); 
}

exports.init = function(e){
 	init(e);
};