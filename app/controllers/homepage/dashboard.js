var args = arguments[0] || {};
COMMON.construct($); 
//Alloy.Globals.navWin = $.mainWin;
var kidsModel = Alloy.createCollection('kids'); 
var postModel = Alloy.createCollection('post');  
var post_element_model = Alloy.createCollection('post_element');  
var educationModel = Alloy.createCollection('education'); 
function init(e){ 
	showLoading(); 
	
	setTimeout(function(){ 
		API.getDeviceInfo();
	},500);
	setTimeout(function(){ 
		var AppVersionControl = require('AppVersionControl');
		AppVersionControl.checkAndUpdate();
	},8000);
	
	setTimeout(function(){
		displayLatestBoard();  
	},2000);
	setTimeout(function(){
		displayMyKids();  
	},3000);
	
	if(OS_ANDROID){
		$.kidsView.bottom = 0;
		$.sepLineKids.bottom = 80;
	}
}

function displayLatestBoard(){
	var latestPost = postModel.getLatestPost(10,1);   
	var boardPost = $.UI.create('View',{
		classes: ['padding', 'hsize', 'vert'], 
		top:0
	});
	if(latestPost.length > 0){ 
		latestPost.forEach(function(entryPost) {
			var schThumb= "/images/full_logo.png";
			
			if(entryPost.e_id != null || entryPost.e_id != ""){
				var school = educationModel.getSchoolById(entryPost.e_id); 
				if(school.img_path != "" && school.img_path != null){
					schThumb = school.img_path;
				} 
			}  
			var view1 = $.UI.create('View',{
				classes: [ 'wfill',  'hsize'],  
				source: entryPost.id
			});
			
			var schImg = $.UI.create('ImageView', {  
				defaultImage: "/images/full_logo.png",
				image: schThumb,
				left:5, 
				height:40,
				width:40,
				borderRadius: 20,
				source: entryPost.id 
			});
			
			var postView = $.UI.create('View',{
				classes: ['small_padding'  ,'vert', 'hsize'],  
				source: entryPost.id,
				left:55
			});
			
			var title = entryPost.title;
			if(title.trim() != "" &&  title.trim() != null){
				title = title.replace("&quot;", "'"); 
			}
			
			var titleLbl = $.UI.create('Label',{
				classes: [ 'hsize','h5', 'themeColor','bold'],  
				text: title,
				source: entryPost.id
			});
			/**var descLbl = $.UI.create('Label',{ 
				classes: [ 'hsize','h6'],  
				text: entryPost.message,
				source: entryPost.id
			});
			**/
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
				classes: [ 'hsize','h6','font_light_grey','left'],  
				text: entryPost.publisher_position,
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
				classes: [ 'hsize','h6','font_light_grey','right'],  
				text: monthFormat(entryPost.publish_date),
				source: entryPost.id
			});
			dateViewLbl.add(dateLbl);
			publishView.add(publisherViewLbl);
			publishView.add(dateViewLbl);
			
			postView.add(titleLbl);
			//postView.add(descLbl);
			postView.add(publishView);
			
			view1.add(schImg);
			view1.add(postView);
			boardPost.add(view1);
			boardPost.add(separateHozLine());
			addClickEvent(postView); 
		});
		
		$.latestBoardView.add(boardPost);
	} 
	hideLoading();
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
		 
		var win = Alloy.createController("postDetails", {p_id: res.source, from: "dashboard"}).getView(); 
		//COMMON.openWindow(win); 
		Alloy.Globals.tabgroup.activeTab.open(win);
	});
}

function displayMyKids(){
	COMMON.removeAllChildren($.myKidsContainer); 
	var myKids = kidsModel.getMyKids(Ti.App.Properties.getString('user_id'));
	if(myKids.length > 0){ 
		myKids.forEach(function(entry) {
			var myKidView = $.UI.create('View',{
				classes: ['padding'],
				height:60,
				width:60,
				borderRadius: 30,
				kid_id: entry.id,
				backgroundColor: "#f5f5f5" 
			}); 
			
			var avatar = entry.img_path;
			 
			if(avatar == ""){
				avatar = "/images/avatar.jpg";
			}
			var kidImg =Ti.UI.createImageView({
				height:Ti.UI.FILL,
				width:Ti.UI.FILL, 
				kid_id: entry.id,
				image: avatar
			});
			myKidView.add(kidImg);
			myKidView.addEventListener('click',function(e){
				var elbl = JSON.stringify(e.source); 
				var res = JSON.parse(elbl); 
				var win = Alloy.createController("kidDetails", {kid_id:res.kid_id }).getView();
				Alloy.Globals.tabgroup.activeTab.open(win);
			}); 
			$.myKidsContainer.add(myKidView);  
			 
		}); 
	} 
}

var addKid = function(){ 
	var win = Alloy.createController("kidsForm").getView();
	Alloy.Globals.tabgroup.activeTab.open(win);
};

var refreshKids = function(){ 
	displayMyKids(); 
};

function syncData(){ 
	//COMMON.showLoading();
	COMMON.removeAllChildren($.latestBoardView); 
	/***Check school updates***/
	var kidsEducationModel = Alloy.createCollection('kidsEducation'); 
	var ks = kidsEducationModel.getSchoolList();
	//console.log(ks);
	if(ks.length > 0){   
		ks.forEach(function(entry) {
			 
			//API.getSchoolPost(entry.e_id);
			var param = { 
				"e_id"	  : entry.e_id
			};
			
			API.callByPost({url:"getSchoolPost", params: param}, function(responseText){ 
				var res = JSON.parse(responseText);  
				if(res.status == "success"){ 
					var postData = res.data; 
					 if(postData != ""){ 
					 	 var post = res.data.post;   
						 postModel.addPost(post);  
						 post_element_model.addElement(post);  
						 displayLatestBoard(); 
					 }  
				} 
			});
		});
	}else{
		displayLatestBoard(); 
	}
	
}

$.refresh.addEventListener('click', function(){
	showLoading();
	syncData();
});
  
Ti.App.addEventListener('refreshKids',refreshKids);

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
