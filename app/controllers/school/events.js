var args = arguments[0] || {};
COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var eventsModel = Alloy.createCollection('events'); 
var school_id; 


 
function init(e){
	school_id = e.school_id; 
	//console.log(details);
	loadEvent();
}   

function loadEvent(){
	var details = eventsModel.getLatestEventByEducation(school_id);
	var eventTbl = $.UI.create('TableView',{
		classes: ["wfill", "hsize" ],
		backgroundColor : "#ffffff" 
	});
	COMMON.removeAllChildren($.eventSv);
	if(details.length > 0){ 
		
		var postData= []; 
		details.forEach(function(entry) { 
			var tblRowView = $.UI.create('TableViewRow',{ 
				height : 70, 
				backgroundColor: "#ffffff",
				source: entry.id
			});
			
			var view1 = $.UI.create('View',{
				classes: [ 'wfill',  'hsize'],  
				source: entry.id
			});
			
			var statusColor = "#8A6500";
			if(entry.status == "1"){ //publish
				statusColor = "#2C8A00";
			} 
			if(entry.ended < currentDateTime() ){  
				statusColor = "#CE1D1C";
			}
			
			var statustView = $.UI.create('View',{
				classes: ['hfill'],
				source: entry.id,
				width: 10,
				height:65,
				left: 0,
				backgroundColor: statusColor
			});
			
			var leftView = $.UI.create('View',{
				classes: ['padding'  ,'vert', 'hsize'],  
				width: 90,
				left:10,
				source: entry.id
			});
	 		
	 		
	 		var eventDate;
	 		if(entry.ended == "0000-00-00"){
	 			eventDate = "FROM "+monthFormat(entry.started);
	 		}else{
	 			eventDate = monthFormat(entry.started) +" - "+ monthFormat(entry.ended);
	 		}
			var dateLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5', 'themeColor', 'center'],  
				text: eventDate,
				source: entry.id
			}); 
			
			leftView.add(dateLbl); 
			
			var centerView = Ti.UI.createView({
				height: 70,  
				width: 1, 
				backgroundColor:"#dfe0e4",
				source: entry.id,
				left:100,
			});
			 
			var rightView = $.UI.create('View',{
				classes: ['padding'  ,'vert', 'hsize'],  
				source: entry.id,
				left:105,
				width:"50%"
			});
	 
			var titleLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5', 'themeColor', 'bold' ],  
				text: entry.title,
				source: entry.id
			}); 
			/**var messageLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_12'],  
				text: textLimit(entry.message,40),
				source: entry.id
			}); **/
			var imgView1 = $.UI.create('ImageView',{
				image : "/images/btn-forward.png",
				source :entry.id,
				width : 20,
				height : 20,
				right: 10
			});
			
			rightView.add(titleLbl);
			//rightView.add(messageLbl); 
			
			view1.add(statustView);	
			view1.add(leftView);	
			view1.add(centerView);	
    		view1.add(rightView);	
    		view1.add(imgView1);	
    		tblRowView.add(view1);
    		postData.push(tblRowView);
    		addClickEvent(view1);  
		});
		eventTbl.setData(postData);
		
	}else{
		eventTbl.setData(COMMON.noRecord());
	}	
	hideLoading();
	$.eventSv.add(eventTbl);
}

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl);  
		var win = Alloy.createController("school/eventDetails", {event_id: res.source}).getView();  
		Alloy.Globals.schooltabgroup.activeTab.open(win);
	});
}


function syncData(){
	var checker = Alloy.createCollection('updateChecker'); 
	
	var param = { 
		"e_id"	  : school_id
	};
	API.callByPost({url:"getEventsList", params: param}, function(responseText){
		 
		var res = JSON.parse(responseText);  
		if(res.status == "success"){  
			var eventsAttachmentModel = Alloy.createCollection('eventsAttachment'); 
			var arr = res.data; 
			 
			eventsModel.saveArray(arr); 
			eventsAttachmentModel.saveArray(arr);
			loadEvent();
		} 
	});
	
}


$.refresh.addEventListener('click', function(){
	showLoading();
	syncData();
});

/*** private function***/
function showLoading(){ 
	$.activityIndicator.show();
	$.loadingBar.opacity = 1;
	$.loadingBar.zIndex = 100;
	$.loadingBar.height = 120;
	$.activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG; 
}


function hideLoading(){
	$.activityIndicator.hide();
	$.loadingBar.opacity = "0";
	$.loadingBar.height = "0"; 
}

exports.init = function(e){
 	init(e);
};