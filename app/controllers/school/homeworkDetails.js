var args = arguments[0] || {};
var homeworkModel = Alloy.createCollection('homework'); 
var homeworkAttachmentModel = Alloy.createCollection('homeworkAttachment'); 
COMMON.construct($);
var homework_id = args.homework_id || "";  
loadHomeworktDetails();
function loadHomeworktDetails(){
	var details = homeworkModel.getHomeworkById(homework_id);
	var attList = homeworkAttachmentModel.getRecordByHomework(homework_id);  
	 
	var titleLabel = $.UI.create('Label',{
		text: details.subject,
		classes : ["h4", "themeColor","padding",'bold']
	});
 	
 	var view1 = $.UI.create('View',{
		classes :['hsize', 'vert','box','padding','wfill'], 
		backgroundColor : "#ffffff", 
		top:0
	});
	
	var viewBg = $.UI.create('View',{
		classes :['wfill', "hsize"],
		backgroundColor : "#f5f5f5", 
	});
	var remarkLabel = $.UI.create('Label',{
		text: "Homework Remark",
		classes : ["h5", "hsize",'wfill',"padding","bold"]
	});
	viewBg.add(remarkLabel);
 	var contentLabel = $.UI.create('Label',{
		text: details.remark,
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
  
	var updated = details.updated;
	updated =   updated.substr(0, 10);
 
	var dateLabel = $.UI.create('Label',{
		text: monthFormat(updated) ,
		classes : ["h5", "padding","hsize",,"font_light_grey"]
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
		text: "Homework Publisher",
		classes : ["h5", "hsize",'wfill',"padding","bold"]
	});
	
 	var pubLabel = $.UI.create('Label',{
		text: details.published_by, 
		classes : ["h5", "padding","hsize","font_light_grey"]
	});
	
	viewBg3.add(publishedLabel); 
 	view3.add(viewBg3);
 	view3.add(pubLabel); 
 	$.myContentView.add(titleLabel);
 	$.myContentView.add(view1); 
 	$.myContentView.add(view2); 
 	$.myContentView.add(view3);
 //	$.myContentView.add(separateHorzLine());
 	
 	if(attList.length > 0){
 		var galleryLabel = $.UI.create('Label',{
				text:"Homework Attachment",
				classes : ["h5","hsize", "padding", 'themeColor']
		});
		/**Homework Attachment**/
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
			text: "Homework Attachment",
			classes : ["h5", "hsize",'wfill',"padding",'bold']
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
	/***
	var titleLabel = $.UI.create('Label',{
		text: postDetails.title,
		classes : ["news_title"]
	});
	***/
 
}


function createGalleryEvent(adImage,e_id,position){
	adImage.addEventListener('click', function(e) {
    	var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl);  
		var win = Alloy.createController("school/attachmentDetails",{  id:homework_id,position: position, type: "homework" }).getView(); 
 
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

function closeWindow(){
	COMMON.closeWindow($.win); 
}
