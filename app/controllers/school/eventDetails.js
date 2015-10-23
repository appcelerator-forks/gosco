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
		classes : ["h4", "themeColor","padding",'bold']
	});
 	
 	var view1 = $.UI.create('View',{
		classes :['hsize', 'vert','box','padding','wfill','font_light_grey'], 
		backgroundColor : "#ffffff", 
		top:0
	});
	
	var viewBg = $.UI.create('View',{
		classes :['wfill', "hsize"],
		backgroundColor : "#f5f5f5", 
	});
	var remarkLabel = $.UI.create('Label',{
		text: "Event Details",
		classes : ["h5", "hsize",'wfill',"padding","bold"]
	});
	viewBg.add(remarkLabel);
	
 	var contentLabel = $.UI.create('Label',{
		text: details.message,
		classes : ["h5", "padding","hsize","font_light_grey"]
	});
	
 	view1.add(viewBg);
 	view1.add(contentLabel);
 	
 	/**Updated**/
 	var view2 = $.UI.create('View',{
		classes :['hsize', 'vert','box','padding','wfill'], 
		backgroundColor : "#ffffff", 
		top:0
	});
	
	var viewBg2 = $.UI.create('View',{
		classes :['wfill', "hsize"],
		backgroundColor : "#f5f5f5", 
	});
	var updatedLabel = $.UI.create('Label',{
		text: "Last Updated",
		classes : ["h5", "hsize",'wfill',"padding","bold"]
	});
	viewBg2.add(updatedLabel); 
 
	var dateLabel = $.UI.create('Label',{
		text:  monthFormat(details.started) +" - "+ monthFormat(details.ended),
		classes : ["h5", "padding","hsize","font_light_grey"]
	});
 	view2.add(viewBg2);
 	view2.add(dateLabel); 
	 
	/**Published**/
 	var view3 = $.UI.create('View',{
		classes :['hsize', 'vert','box','padding','wfill'], 
		backgroundColor : "#ffffff", 
		top:0
	});
	
	var viewBg3 = $.UI.create('View',{
		classes :['wfill', "hsize"],
		backgroundColor : "#f5f5f5", 
	});
	var publishedLabel = $.UI.create('Label',{
		text: "Event Publisher",
		classes : ["h5", "hsize",'wfill',"padding","bold"]
	});
	
 	var pubLabel = $.UI.create('Label',{
		text: details.published_by, 
		classes : ["h5", "padding","hsize",'font_light_grey']
	});
	
	viewBg3.add(publishedLabel); 
 	view3.add(viewBg3);
 	view3.add(pubLabel); 
  
	var saveBtn = $.UI.create('Button',{
		title:"Add to Calendar ", 
		backgroundColor: "#5375BD",
		width : "90%",
		classes : ['button']
	});
	
	$.myContentView.add(titleLabel);
 	$.myContentView.add(view1);
 	$.myContentView.add(view3);
 	$.myContentView.add(view2);
 	//$.myContentView.add(separateHorzLine());
 	
 	$.myContentView.add(saveBtn); 
 	saveBtn.addEventListener('click', function(e){
		if(Ti.Platform.osname == "android"){
			setAndroidCalendarEvent(details); 
		}else{
			if(Ti.Calendar.eventsAuthorization == Ti.Calendar.AUTHORIZATION_AUTHORIZED) {
			    setCalendarEvent(details);
			} else {
			    Ti.Calendar.requestEventsAuthorization(function(e){
		            if (e.success) {
		                setCalendarEvent(details);
		            } else {
		                alert('Access to calendar is not allowed');
		            }
		        });
			}
		}
	});
		
}

function separateHorzLine(){
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:1, 
		width:Ti.UI.FILL
	});
}
 
function setCalendarEvent(details){
	var started = details.started;
	 
	if(started != "0000-00-00"){
		var cal = Ti.Calendar.defaultCalendar;
		var active_date = started.split("-");
		var start_date = new Date(active_date[0], active_date[1]-1, active_date[2], 10, 0, 0);
		var end_date = new Date(active_date[0], active_date[1]-1, active_date[2], 23, 59, 59);
	 
		 var event = cal.createEvent({
		    title: details.title,
		    begin: start_date,
		    end: end_date,
		    availability: Ti.Calendar.AVAILABILITY_FREE,
		    allDay: true
		});

		 var mil = 60*1000;
		
		 //adding alert to your event , this alert will be before the start _date with 1 minutes
		 var alert1 = event.createAlert({
		    relativeOffset: mil
		});
		
		 event.alerts = [alert1];
		 event.save(Ti.Calendar.SPAN_FUTUREEVENTS);
		 COMMON.createAlert("Message", details.title+" added into your calendar.");
	}else{
		COMMON.createAlert("Message", details.title+" started.");
	}
}


function setAndroidCalendarEvent(details){
	var started = details.started; 
	 console.log(started);
	if(started != "0000-00-00"){
		var CALENDAR_TO_USE = 3;
		var calendar = Ti.Calendar.getCalendarById(CALENDAR_TO_USE);
		var active_date = started.split("-");
		var eventBegins = new Date(active_date[0], active_date[1]-1, active_date[2], 10, 0, 0);
		var eventEnds = new Date(active_date[0], active_date[1]-1, active_date[2], 23, 59, 59);
		// Create the event
		var details = {
		    title: details.title,
		    description: details.message,
		    begin: eventBegins,
		    end: eventEnds
		};
		
		var event = calendar.createEvent(details);
		
		// Now add a reminder via e-mail for 10 minutes before the event.
		var reminderDetails = {
		    minutes: 10,
		    method: Ti.Calendar.METHOD_ALERT
		};
		
		event.createReminder(reminderDetails);
		COMMON.createAlert("Message", details.title+" reminder added into your calendar.");
	}else{
		COMMON.createAlert("Message", details.title+" started.");
	}
}


  
function closeWindow(){
	COMMON.closeWindow($.win); 
}
