var args = arguments[0] || {};
COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var eventsModel = Alloy.createCollection('events'); 
var school_id; 

var eventTbl = $.UI.create('TableView',{
	classes: ["wfill", "hfill", "padding", "box"]
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
				classes:["horz"]
			});
			var leftView = $.UI.create('View',{
				classes: ['padding'  ,'vert', 'hsize'],  
				width: 80,
				source: entry.id
			});
	 
			var dateLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_12'],  
				text: monthFormat(entry.started) +" - "+ monthFormat(entry.ended),
				source: entry.id
			}); 
			
			leftView.add(dateLbl); 
			
			var centerView = Ti.UI.createView({
				height: 100,  
				width: 1, 
				backgroundColor:"#dfe0e4",
				source: entry.id
			});
			 
			var rightView = $.UI.create('View',{
				classes: ['padding' ,'wfill' ,'vert', 'hsize'],  
				source: entry.id
			});
	 
			var titleLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_medium'],  
				text: entry.title,
				source: entry.id
			}); 
			var messageLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_12'],  
				text: entry.message,
				source: entry.id
			}); 
			rightView.add(titleLbl);
			rightView.add(messageLbl); 
			tblRowView.add(leftView);	
			tblRowView.add(centerView);	
    		tblRowView.add(rightView);	 
    	 	eventTbl.appendRow(tblRowView);
		});
		$.eventSv.add(eventTbl);
	}	
}

exports.init = function(e){
 	init(e);
};