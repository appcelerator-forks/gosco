var args = arguments[0] || {};
COMMON.construct($);
var curriculumModel = Alloy.createCollection('curriculum'); 
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
	var details = curriculumModel.getCurriculumById(c_id);
	if( details.img_path !=  ""){
		$.thumbPreview.image = details.img_path;
	}
	$.curName.text = details.curriculum;
	$.curDesc.text = details.description;
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
		classes: [ 'vert', 'hsize'], 
	});
	
	COMMON.hideLoading();
	COMMON.removeAllChildren($.latestView);
	if(latestPost.length > 0){ 
		 
		latestPost.forEach(function(entryPost) {
			var view1 = $.UI.create('View',{
				classes: [ 'wfill',  'hsize'],  
				source: entryPost.id
			});
			
			var horzView = $.UI.create('View',{
				classes: ['horz','wfill'], 
				source: entryPost.id,  
				backgroundColor: "#ffffff",
				height: 60 
			});
			
			var dateViewLbl = $.UI.create('View',{
				classes: [ 'hsize'],  
				width:'20%',
				source: entryPost.id
			});
			var dateLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5','themeColor','center' ],  
				text: monthFormat(entryPost.publish_date),
				source: entryPost.id
			});
			dateViewLbl.add(dateLbl);
			var statustView = $.UI.create('View',{
				classes: ['hfill'],
				source: entryPost.id,
				width: 1,
				backgroundColor: "#ececec"
			});
			
			
			var postView = $.UI.create('View',{
				classes: ['small_padding' ,'vert', 'hsize'],  
				source: entryPost.id,
				width: "60%", 
			});
			 
			
			var imgView1 = $.UI.create('ImageView',{
				image : "/images/btn-forward.png",
				source :entryPost.id,
				width : 20,
				height : 20,
				right: 10
			});
			
			
			var titleLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5','themeColor'],  
				text: entryPost.title,
				source: entryPost.id
			});
			/**var descLbl = $.UI.create('Label',{ 
				classes: [ 'hsize','h6','font_light_grey'],  
				text: entryPost.message,
				source: entryPost.id
			});**/
			
			var publishView = $.UI.create('View',{
				classes: [  ,'horz', 'hsize'], 
				top:5,
				width: "auto",
				source: entryPost.id 
			});
			var publisherViewLbl = $.UI.create('View',{
				classes: [ 'wsize','hsize'], 
				top:0,  
				source: entryPost.id
			});
			var publisherLbl = $.UI.create('Label',{
				classes: [ 'hsize','h6','font_light_grey','left'],  
				text: entryPost.published_by,
				source: entryPost.id
			});
			
			publisherViewLbl.add(publisherLbl); 
			publishView.add(publisherViewLbl); 
			
			postView.add(titleLbl);
			//postView.add(descLbl);
			postView.add(publishView);
			horzView.add(dateViewLbl);
			horzView.add(statustView);
			horzView.add(postView);
			view1.add(horzView);
			view1.add(imgView1);
			boardPost.add(view1);
			boardPost.add(separateHozLine());
			addClickEvent(view1); 
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

function separateHozLine(){
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:1,  
		width:Ti.UI.FILL
	});
} 

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
		 
		var win = Alloy.createController("postDetails", {p_id: res.source, isCurriculum: "1", showHeader : showHeader,  from: "school"}).getView(); 
		//COMMON.openWindow(win); 
		if(showHeader == "1"){
			openModal(win);
		}else{
			Alloy.Globals.schooltabgroup.activeTab.open(win);
		}
	});
}