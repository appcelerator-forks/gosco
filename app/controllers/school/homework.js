var args = arguments[0] || {};

COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var homeworkModel = Alloy.createCollection('homework'); 
var ec_id; 

var pageTbl = $.UI.create('TableView',{
	classes: ["wfill", "hfill", "padding", "box"]
});
 
function init(e){
	ec_id = e.ec_id; 
	//console.log(details);
	loadHomework(ec_id);
}   

function loadHomework(ec_id){
	console.log(ec_id);
	var details = homeworkModel.getHomeworkByClass(ec_id);
	console.log(details);
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
			
			var created = entry.created;
	 		created =   created.substr(0, 10);
			var dateLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_medium'],  
				text: monthFormat(created) ,
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
				text: entry.subject,
				source: entry.id
			}); 
			var publishedLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_12'],  
				text: entry.published_by,
				source: entry.id
			}); 
			var deadlineLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_12'],  
				text: "Due date : " + monthFormat(entry.deadline),
				source: entry.id
			}); 
			rightView.add(titleLbl);
			rightView.add(publishedLbl); 
			rightView.add(deadlineLbl); 
			tblRowView.add(leftView);	
			tblRowView.add(centerView);	
    		tblRowView.add(rightView);	 
    		addClickEvent(tblRowView); 
    	 	pageTbl.appendRow(tblRowView);
		});
		$.homeworkSv.add(pageTbl);
	}
}

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl);  
		var win = Alloy.createController("school/homeworkDetails", {homework_id: res.source}).getView();  
		Alloy.Globals.schooltabgroup.activeTab.open(win);
	});
}

exports.init = function(e){
 	init(e);
};