var args = arguments[0] || {};
var homeworkModel = Alloy.createCollection('homework'); 
COMMON.construct($);
var homework_id = args.homework_id || ""; 
console.log( "homework_id "+homework_id);
loadHomeworktDetails();
function loadHomeworktDetails(){
	var details = homeworkModel.getHomeworkById(homework_id);
	console.log(details);
	
	var titleLabel = $.UI.create('Label',{
		text: details.subject,
		classes : ["news_title", "themeColor","padding"]
	});
 	
 	var contentLabel = $.UI.create('Label',{
		text: details.remark,
		classes : ["font_12", "padding"]
	});
	console.log(details.updated);
	var updated = details.updated;
	updated =   updated.substr(0, 10);
	console.log(updated);
	var dateLabel = $.UI.create('Label',{
		text: "Last updated :  " + monthFormat(updated) ,
		classes : ["font_12", "padding"]
	});
	var pubLabel = $.UI.create('Label',{
		text:"Published by "+details.published_by  ,
		textAlign: "right", 
		right: 10,
		classes : ['font_small','font_light_grey']
	});
	
 	$.myContentView.add(titleLabel);
 	$.myContentView.add(contentLabel);
 	
 	$.myContentView.add(dateLabel);
 	$.myContentView.add(separateHorzLine());
 	$.myContentView.add(pubLabel);
	/***
	var titleLabel = $.UI.create('Label',{
		text: postDetails.title,
		classes : ["news_title"]
	});
	***/
 
}

function separateHorzLine(){
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:1, 
		width:Ti.UI.FILL
	});
}

function closeWindow(){
	COMMON.closeWindow($.win); 
}
