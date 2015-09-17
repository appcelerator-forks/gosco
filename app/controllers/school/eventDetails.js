var args = arguments[0] || {};
var eventsModel = Alloy.createCollection('events'); 
COMMON.construct($);
var event_id = args.event_id || ""; 

loadEventDetails();
function loadEventDetails(){
	var details = eventsModel.getRecordsById(event_id);
	console.log(details);
	 
	var titleLabel = $.UI.create('Label',{
		text: details.title,
		classes : ["news_title", "themeColor","padding"]
	});
 	
 	var contentLabel = $.UI.create('Label',{
		text: details.message,
		classes : ["font_12", "padding"]
	});
	
	var dateLabel = $.UI.create('Label',{
		text: "From : " + monthFormat(details.started) +" - "+ monthFormat(details.ended) ,
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
