var args = arguments[0] || {}; 
COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var postModel = Alloy.createCollection('post'); 
var school_id; 

function init(e){
	school_id = e.school_id; 
	var details = educationModel.getSchoolById(school_id);
	$.schoolName.text = details.name;
	$.schoolAddress.text = details.address;
	$.schoolTel.text = details.contact_no;
	$.thumbPreview.image = details.img_path; 
	loadNoticeBoard(school_id);
}  

function loadNoticeBoard(school_id){
	var latestPost = postModel.getLatestPostByEducation(school_id,1); 
 
	if(latestPost.length > 0){ 
		latestPost.forEach(function(entryPost) {
			var tblRowView = Ti.UI.createTableViewRow({
				hasChild: true
			});
			var postView = $.UI.create('View',{
				classes: ['padding' ,'wfill','vert', 'hsize'],  
				source: entryPost.id
			});
			
			var titleLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5','bold','themeColor'],  
				text: entryPost.title,
				source: entryPost.id
			});
			
			var message = escapeSpecialCharacter(entryPost.message);
			if(message.length > 80){
				message = message.substring(0, 80) + "..."; 
			}
					
			var descLbl = $.UI.create('Label',{ 
				classes: [ 'hsize','h6'],  
				text: message,
				source: entryPost.id
			});
			var dateLbl = $.UI.create('Label',{ 
				classes: [ 'hsize','font_12','font_light_grey'],  
				text: monthFormat(entryPost.publish_date),
				source: entryPost.id
			});
			
			postView.add(titleLbl);
			postView.add(descLbl);
			postView.add(dateLbl);
			tblRowView.add(postView);
			addClickEvent(postView); 
			$.boardTbl.appendRow(tblRowView);
		});
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
