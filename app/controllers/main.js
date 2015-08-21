var args = arguments[0] || {};
COMMON.construct($);
Alloy.Globals.navWin = $.mainWin;
var kidsModel = Alloy.createCollection('kids'); 
var myKids = kidsModel.getMyKids(Ti.App.Properties.getString('user_id'));
displayMyKids(); 

function displayMyKids(){ 
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
			
			var kidImg =Ti.UI.createImageView({
				height:Ti.UI.FILL,
				width:Ti.UI.FILL, 
				kid_id: entry.id,
				image: entry.img_path
			});
			myKidView.add(kidImg);
			myKidView.addEventListener('click',function(e){
				var elbl = JSON.stringify(e.source); 
				var res = JSON.parse(elbl); 
				var win = Alloy.createController("kidDetails", {kid_id:res.kid_id }).getView();
				COMMON.openWindow(win); 
			}); 
			$.myKidsContainer.add(myKidView);  
			 
		}); 
	} 
}

var addKid = function(){ 
	var win = Alloy.createController("kidsForm").getView();
	COMMON.openWindow(win);
};


$.btnLogout.addEventListener('touchend', function(){
	//Do logout  
	Ti.App.Properties.removeProperty('user_id');
	Ti.App.Properties.removeProperty('fullname');
	   		
	var win = Alloy.createController("auth/login").getView();
  	openNewWindow(win);
});
