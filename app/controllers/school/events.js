var args = arguments[0] || {};
COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var eventsModel = Alloy.createCollection('events'); 
var school_id; 

var eventTbl = $.UI.create('TableView',{
	classes: ["wfill", "hsize" ]
});

 
function init(e){
	school_id = e.school_id; 
	//console.log(details);
	loadEvent(school_id);
}   

function loadEvent(school_id){
	var details = eventsModel.getLatestEventByEducation(school_id);
	if(details.length > 0){ 
		details.forEach(function(entry) {
			var tblRowView = $.UI.create('TableViewRow',{
				hasChild: true,
				height : 70,
				classes:["horz"],
				backgroundColor: "#ffffff",
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
				backgroundColor: statusColor
			});
			
			var leftView = $.UI.create('View',{
				classes: ['padding'  ,'vert', 'hsize'],  
				width: 80,
				source: entry.id
			});
	 		
	 		
	 		var eventDate;
	 		if(entry.ended == "0000-00-00"){
	 			eventDate = "FROM "+monthFormat(entry.started);
	 		}else{
	 			eventDate = monthFormat(entry.started) +" - "+ monthFormat(entry.ended);
	 		}
			var dateLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5', 'font_dark_grey'],  
				text: eventDate,
				source: entry.id
			}); 
			
			leftView.add(dateLbl); 
			
			var centerView = Ti.UI.createView({
				height: 70,  
				width: 1, 
				backgroundColor:"#dfe0e4",
				source: entry.id
			});
			 
			var rightView = $.UI.create('View',{
				classes: ['padding' ,'wfill' ,'vert', 'hsize'],  
				source: entry.id
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
			rightView.add(titleLbl);
			//rightView.add(messageLbl); 
			tblRowView.add(statustView);	
			tblRowView.add(leftView);	
			tblRowView.add(centerView);	
    		tblRowView.add(rightView);	
    		addClickEvent(tblRowView); 
    	 	eventTbl.appendRow(tblRowView);
		});
		$.eventSv.add(eventTbl);
	}	
}

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl);  
		var win = Alloy.createController("school/eventDetails", {event_id: res.source}).getView();  
		Alloy.Globals.schooltabgroup.activeTab.open(win);
	});
}

exports.init = function(e){
 	init(e);
};