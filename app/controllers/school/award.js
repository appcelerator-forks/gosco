var args = arguments[0] || {};
COMMON.construct($);
var educationModel = Alloy.createCollection('education');  
var postModel = Alloy.createCollection('post'); 
var postElementModel = Alloy.createCollection('post_element'); 	
var school_id; 

function init(e){
	school_id = e.school_id;  
	setTimeout(function(){
		loadNoticeBoard(); 
	},500); 
	
}   
function loadNoticeBoard(){
	var latestPost = postModel.getLatestPostByEducation(school_id,2); 
  	console.log("latestPost");
	if(latestPost.length > 0){  
		var tblView = $.UI.create('TableView',{
			classes: ['wfill' , 'hsize'],
			backgroundColor: "#ffffff",
			top:0
		});
		var awardData = [];
		latestPost.forEach(function(entryPost) {
			var imagePost = postElementModel.getImageByPost(entryPost.id); 
			var tblRowView = Ti.UI.createTableViewRow({  });
			
			var view1 = $.UI.create('View',{
				classes: [ 'wfill',  'hsize'],  
				source: entryPost.id
			});
			
			var imgView1 = $.UI.create('ImageView',{
				image : "/images/btn-forward.png",
				source :entryPost.id,
				width : 20,
				height : 20,
				right: 10
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
			view1.add(imgView1);
			view1.add(horzView);
			tblRowView.add(view1);
			addClickEvent(view1); 
			awardData.push(tblRowView);
			//$.awardTbl.appendRow(tblRowView); 
		});
		
		tblView.setData(awardData);
		$.awardSv.add(tblView);
	} 	
	hideLoading(); 
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
				postElementModel.addElement(post);  
				loadNoticeBoard(); 
			}   
		} 
	});
	
}

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
		 
		var win = Alloy.createController("postDetails", {p_id: res.source}).getView();
		Alloy.Globals.schooltabgroup.activeTab.open(win);
	});
}

$.refresh.addEventListener('click', function(){
	showLoading();
	syncData();
});


/*** private function***/
function showLoading(){ 
	$.activityIndicator.show();
	$.loadingBar.opacity = 1;
	$.loadingBar.zIndex = 100;
	$.loadingBar.height = 120;
	 
	if(OS_ANDROID){ 
		$.activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG; 
	}else if (OS_IOS){ 
		$.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	}  
}


function hideLoading(){
	$.activityIndicator.hide();
	$.loadingBar.opacity = "0";
	$.loadingBar.height = "0"; 
}

exports.init = function(e){
 	init(e);
};
