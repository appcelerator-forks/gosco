var args = arguments[0] || {};
COMMON.construct($);
var curriculumPostModel = Alloy.createCollection('curriculumPost'); 
var curriculumPost_element_model = Alloy.createCollection('curriculumPost_element');  
var c_id = args.c_id || "";  
var showHeader = args.showHeader || "";
COMMON.showLoading();
API.getCurriculumPost({c_id: c_id}, onReturn);
init(); 

if(OS_ANDROID){
	showHeader = "0";
}

if(showHeader == "1"){
	$.showHeader.visible = true;
	$.showHeader.height = 50;
}
function init(){
	displayLatestBoard();  
}

function onReturn(result){
	var res = JSON.parse(result);  
	
	if(res.status == "success"){	  
	 var postData = res.data; 
	 if(postData != ""){ 
	 	 var post = res.data.post;   
		 curriculumPostModel.addPost(post);  
		 curriculumPost_element_model.addElement(post);   
	 }  
	 init();
	// Ti.App.fireEvent('endLoad'); 
	}
	
}

function closeWindow(){
	COMMON.closeWindow($.win); 
}

function displayLatestBoard(){
	var latestPost = curriculumPostModel.getLatestPost(c_id,5);  
	var boardPost = $.UI.create('View',{
		classes: ['padding' ,'box', 'hsize'], 
	});
	
	COMMON.hideLoading();
	COMMON.removeAllChildren($.latestView);
	if(latestPost.length > 0){ 
		 
		latestPost.forEach(function(entryPost) {
			
			var postView = $.UI.create('View',{
				classes: ['padding' ,'wfill','vert', 'hsize'],  
				source: entryPost.id
			});
			
			var titleLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_regular'],  
				text: entryPost.title,
				source: entryPost.id
			});
			var descLbl = $.UI.create('Label',{ 
				classes: [ 'hsize','font_12','font_light_grey'],  
				text: entryPost.message,
				source: entryPost.id
			});
			
			var publishView = $.UI.create('View',{
				classes: [ 'wfill','horz', 'hsize'], 
				top:5,
				source: entryPost.id 
			});
			var publisherViewLbl = $.UI.create('View',{
				classes: [ 'hsize'], 
				top:0, 
				width:'60%',
				source: entryPost.id
			});
			var publisherLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_12','themeColor','left'],  
				text: entryPost.published_by,
				source: entryPost.id
			});
			
			publisherViewLbl.add(publisherLbl);
			
			var dateViewLbl = $.UI.create('View',{
				classes: [ 'hsize'], 
				top:0, 
				width:'auto',
				source: entryPost.id
			});
			var dateLbl = $.UI.create('Label',{
				classes: [ 'hsize','font_12','themeColor','right'],  
				text: monthFormat(entryPost.publish_date),
				source: entryPost.id
			});
			dateViewLbl.add(dateLbl);
			publishView.add(publisherViewLbl);
			publishView.add(dateViewLbl);
			
			postView.add(titleLbl);
			postView.add(descLbl);
			postView.add(publishView);
			boardPost.add(postView);
			addClickEvent(postView); 
		}); 
		$.latestView.add(boardPost);
	}else{
		var postView = $.UI.create('View',{
			classes: ['padding' ,'wfill','vert', 'hsize'],   
		});
			
		var titleLbl = $.UI.create('Label',{
			classes: [ 'hsize','font_regular'],  
			text: "No record(s) found"
		});
		postView.add(titleLbl);
		boardPost.add(postView);
		$.latestView.add(boardPost);
	} 
}

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
		 
		var win = Alloy.createController("postDetails", {p_id: res.source, isCurriculum: "1", showHeader : showHeader}).getView(); 
		//COMMON.openWindow(win); 
		if(showHeader == "1"){
			openModal(win);
		}else{
			Alloy.Globals.schooltabgroup.activeTab.open(win);
		}
	});
}