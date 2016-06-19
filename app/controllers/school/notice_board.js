var args = arguments[0] || {}; 
COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var postModel = Alloy.createCollection('post'); 
var post_element_model = Alloy.createCollection('post_element');  
var school_id; 
var latestPost;
var currentTab =1;
function init(e){ 
	showLoading();
	school_id = e.school_id;  
	var details = educationModel.getSchoolById(school_id);
	$.schoolName.text = details.name;
	$.schoolAddress.text = details.address;
	$.schoolTel.text = details.contact_no;
	$.thumbPreview.image = details.img_path; 
	//loadNoticeBoard(school_id);
	syncData();
}  


function syncData(){
	var param = { 
		"e_id"	  : school_id
	};
	API.callByPost({url:"getSchoolPost", params: param}, function(responseText){
		 
		var res = JSON.parse(responseText);  
		if(res.status == "success"){  
			var postData = res.data; 
			 if(postData != ""){ 
			 	 var post = res.data.post;   
				 postModel.addPost(post);  
				 post_element_model.addElement(post);   
			 }  
		} 
		
		if(currentTab == 1){
			latestPost = postModel.getLatestPostByEducation(school_id,1,1); 
		}else{
			latestPost = postModel.getLatestPostByEducation(school_id,4,1); 
		}
		
		loadNoticeBoard(latestPost);
	}, function(){
		latestPost = postModel.getLatestPostByEducation(school_id,1,1); 
		loadNoticeBoard(latestPost);
	});
	
}

$.lbleInfo.addEventListener('click',function(){
	currentTab = 2;
	$.containerInfo.backgroundColor = "#E8E8E8";
	$.containerAnnouncement.backgroundColor = "#FFFFFF";
	latestPost = postModel.getLatestPostByEducation(school_id,4,1); 
	loadNoticeBoard(latestPost);
}); 

$.lblAnnouncement.addEventListener('click',function(){
	currentTab = 1;
	$.containerAnnouncement.backgroundColor = "#E8E8E8";
	$.containerInfo.backgroundColor = "#FFFFFF";
	latestPost = postModel.getLatestPostByEducation(school_id,1,1); 
	loadNoticeBoard(latestPost);
}); 

function loadNoticeBoard(latestPost){ 
 	var tblView = $.UI.create('TableView',{
		classes: ['wfill' , 'hsize'],
		top:0
	}); 
	COMMON.removeAllChildren($.boardSv);
	if(latestPost.length > 0){ 
		
		var postData= []; 
		
		latestPost.forEach(function(entryPost) {
			var tblRowView = Ti.UI.createTableViewRow({
				 
			});
			
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
				classes: [ 'hsize','h5','themeColor','center'],  
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
			
			var imgView1 = $.UI.create('ImageView',{
				image : "/images/btn-forward.png",
				source :entryPost.id,
				width : 20,
				height : 20,
				right: 10
			});
			
			var postView = $.UI.create('View',{
				classes: ['small_padding' ,'wfill','vert', 'hsize'],  
				source: entryPost.id
			});
			
			var title = entryPost.title;
			if(title.trim() != "" &&  title.trim() != null){
				title = title.replace("&quot;", "'"); 
			}
			
			var titleLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5','bold','themeColor'],  
				text: title,
				source: entryPost.id
			});
			
			/**var message = escapeSpecialCharacter(entryPost.message);
			if(message.length > 80){
				message = message.substring(0, 80) + "..."; 
			}
					
			var descLbl = $.UI.create('Label',{ 
				classes: [ 'hsize','h6'],  
				text: message,
				source: entryPost.id
			});**/
			
			var publishView = $.UI.create('View',{
				classes: [  'horz', 'hsize'], 
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
				text: entryPost.publisher_position,
				source: entryPost.id
			});
			
			publisherViewLbl.add(publisherLbl); 
			publishView.add(publisherViewLbl); 
			postView.add(titleLbl);
			postView.add(publishView);
			//postView.add(descLbl);
			//postView.add(dateLbl);
			horzView.add(dateViewLbl);
			horzView.add(statustView);
			horzView.add(postView);
			view1.add(horzView);
			view1.add(imgView1); 
			tblRowView.add(view1);
			postData.push(tblRowView);
			addClickEvent(view1);  
		});
		tblView.setData(postData); 
	} else{
		tblView.setData(COMMON.noRecord());
	}	
	$.boardSv.add(tblView);
	hideLoading();
}

$.refresh.addEventListener('click', function(){
	showLoading();
	syncData();
});

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
		 
		var win = Alloy.createController("postDetails", {p_id: res.source, from: "school"}).getView();
		Alloy.Globals.schooltabgroup.activeTab.open(win);
	});
}

$.schoolInfo.addEventListener('click', function(){
	var win = Alloy.createController("educationDetails", {e_id:  school_id, from:"school"}).getView();  
	Alloy.Globals.schooltabgroup.activeTab.open(win); 
});
/*** private function***/
function showLoading(){ 
	$.activityIndicator.show();
	$.loadingBar.opacity = 1;
	$.loadingBar.zIndex = 100;
	$.loadingBar.height = 120;
	$.activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG; 
}


function hideLoading(){
	$.activityIndicator.hide();
	$.loadingBar.opacity = "0";
	$.loadingBar.height = "0"; 
}


exports.init = function(e){
 	init(e);
};
