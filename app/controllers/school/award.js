var args = arguments[0] || {};
COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var postModel = Alloy.createCollection('post'); 
var postElementModel = Alloy.createCollection('post_element'); 	
var school_id; 

function init(e){
	school_id = e.school_id;  
	//console.log(details); 
	loadNoticeBoard(school_id);
	
}  


function loadNoticeBoard(school_id){
	var latestPost = postModel.getLatestPostByEducation(school_id,2); 
 	
	if(latestPost.length > 0){  
		var tblRowView = $.UI.create('TableView',{
			classes: ['wfill' , 'hsize'],
			top:0
		});
		var awardData = [];
		latestPost.forEach(function(entryPost) {
			var imagePost = postElementModel.getImageByPost(entryPost.id); 
			var tblRowView = Ti.UI.createTableViewRow({
				hasChild: true
			});
			var horzView = $.UI.create('View',{
				classes: ['small_padding' ,'wfill','horz' ],  
				source: entryPost.id,
				height:58
			});
			
			var previewImage = "/images/preview.png";
			if(imagePost != ""){
				previewImage = 	 imagePost.element;
			} 
			var previewView = $.UI.create('ImageView',{
				classes: ['small_padding' , 'vert',  ],  
				defaultImage: "/images/preview.png",
				image: previewImage,
				width:50,
				height:50,
				source: entryPost.id
			});
			horzView.add(previewView);
			var postView = $.UI.create('View',{
				classes: ['small_padding' ,'vert', 'hsize','left'],  
				width: "auto", 
				source: entryPost.id
			});
			
			var titleLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5', 'themeColor','bold' ,'left'],  
				text: entryPost.title,
				source: entryPost.id
			});
			
			var message = escapeSpecialCharacter(entryPost.message);
			if(message.length > 80){
				message = message.substring(0, 80) + "..."; 
			}
					
			var descLbl = $.UI.create('Label',{ 
				classes: [ 'hsize','h6' ,'left'],  
				text: message,
				source: entryPost.id
			});
			var dateLbl = $.UI.create('Label',{ 
				classes: [ 'hsize','h6','font_light_grey' ,'left'],  
				text: monthFormat(entryPost.publish_date),
				source: entryPost.id
			});
			
			postView.add(titleLbl);
			//postView.add(descLbl);
			postView.add(dateLbl);
			horzView.add(postView); 
			tblRowView.add(horzView);
			addClickEvent(horzView); 
			awardData.push(tblRowView);
			//$.awardTbl.appendRow(tblRowView); 
		});
		
		tblRowView.setData(awardData);
		$.awardSv.add(tblRowView);
	} 	
}


function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
		 
		var win = Alloy.createController("postDetails", {p_id: res.source}).getView();
		Alloy.Globals.schooltabgroup.activeTab.open(win);
	});
}

exports.init = function(e){
 	init(e);
};
