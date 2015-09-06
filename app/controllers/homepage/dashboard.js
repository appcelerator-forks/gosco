var args = arguments[0] || {};
COMMON.construct($);
//Alloy.Globals.navWin = $.mainWin;
var kidsModel = Alloy.createCollection('kids'); 
var postModel = Alloy.createCollection('post'); 
  
function init(e){
	displayLatestBoard();  
	displayMyKids();  
}

function displayLatestBoard(){
	var latestPost = postModel.getLatestPost(5,1); 
 
	var boardPost = $.UI.create('View',{
		classes: ['padding' ,'box', 'hsize'], 
	});
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
		
		$.latestBoardView.add(boardPost);
	} 
}

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
		 
		var win = Alloy.createController("postDetails", {p_id: res.source}).getView(); 
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
				height:80,
				width:80,
				borderRadius: 40,
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

Ti.App.addEventListener('refreshKids',refreshKids);

  
exports.init = function(e){
 	init(e);
};
