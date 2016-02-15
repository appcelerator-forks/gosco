var args = arguments[0] || {};
var eventsModel = Alloy.createCollection('events'); 
var eventsAttachmentModel = Alloy.createCollection('eventsAttachment'); 
COMMON.construct($);
var event_id = args.event_id || ""; 

loadEventDetails();
function loadEventDetails(){
	var details = eventsModel.getRecordsById(event_id);
	var attList = eventsAttachmentModel.getRecordByEvents(event_id);  
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
		text: "Event Date",
		classes : ["h5", "hsize",'wfill',"padding","bold"]
	});
	viewBg2.add(updatedLabel); 
 	
 	var dateEnded = " - "+ monthFormat(details.ended);
 	if(details.ended == "0000-00-00"){
 		dateEnded = "";
 	}
	var dateLabel = $.UI.create('Label',{
		text:  monthFormat(details.started) +dateEnded,
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
 	
 	if(attList.length > 0){
 		var galleryLabel = $.UI.create('Label',{
				text:"Events Attachment",
				classes : ["h5","hsize", "padding", 'themeColor']
		});
		/**EVENTS Attachment**/
	 	var view4 = $.UI.create('View',{
			classes :['hsize', 'vert','box','padding','wfill'], 
			backgroundColor : "#ffffff", 
			top:0
		});
		
		var viewBg4 = $.UI.create('View',{
			classes :['wfill', "hsize"],
			backgroundColor : "#f5f5f5", 
		});
		var attachmentLabel = $.UI.create('Label',{
			text: "Events Attachment",
			classes : ["h5", "hsize",'wfill',"padding", 'bold']
		});
		 
		viewBg4.add(attachmentLabel);  
		var galleryListingView = Ti.UI.createView({
			left:2,
			layout: "horizontal", 
			height:Ti.UI.SIZE,
			width :"auto" 
		});
	 	var gal_counter = 0;
		attList.forEach(function(entry) { 
				  
					var cell = $.UI.create('View', {
						classes: ["cell","tiny_padding","hsize",'vert'], 
						borderColor:"#10844D" , 
						width: "48.5%", 
						source_id:  entry.id, 
						position: gal_counter});
						
					var imageContainer = $.UI.create('View', { 
						backgroundColor:"#000000" ,
						width: Ti.UI.FILL, 
						height:150,  
						position: gal_counter,
						source_id:  entry.id
					});
					var pad_cell = $.UI.create('View', { 
						width: Ti.UI.FILL, 
						height:Ti.UI.SIZE, 
						position: gal_counter, 
						source_id:  entry.id
					});
					var leftImg = entry.img_path;//entry.img_thumb;
					if(leftImg == ""){
						leftImg = "/images/default.png";
					}
					var newsImage = Ti.UI.createImageView({
				   		defaultImage: "/images/loading_image.png",
						image: leftImg,
						width: Ti.UI.FILL,
						height: Ti.UI.SIZE,
						position: gal_counter,
						source_id:  entry.id
					});
					imageContainer.add(pad_cell);
					 
					pad_cell.add(newsImage);
					cell.add(imageContainer);
						 
					//addClickEvent(cell); 
					galleryListingView.add(cell); 
					//image event
					createGalleryEvent(newsImage,entry.id,gal_counter );
				  
					gal_counter++; 
			 
		});
		
		view4.add(viewBg4);
	 	view4.add(galleryListingView); 
		$.myContentView.add(view4); 
	}	
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


function createGalleryEvent(adImage,e_id,position){
	adImage.addEventListener('click', function(e) {
    	var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl);  
		var win = Alloy.createController("school/attachmentDetails",{ id:event_id,position: position, type: "events" }).getView(); 
 
		Alloy.Globals.schooltabgroup.activeTab.open(win);
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
