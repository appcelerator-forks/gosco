var args = arguments[0] || {};
/*** Initialize***/ 
COMMON.construct($);
var bannerModel = Alloy.createCollection('banner');   
var listing = bannerModel.getBannerList(1);
   		 
function init(){   
	COMMON.removeAllChildren($.bannerSv);
	if(listing.length < 1){ 
		$.bannerSv.add($.UI.create('Label',{
			classes: ['font_dark_grey', 'h5'],
			text  : "No records", 
		}));
	}else{
		listing.forEach(function(entry) {
			var bannerView = $.UI.create("View",{
				classes: ["wfill","hsize","padding","box","vert"],
				top: 0,
			});    	
			
			var bannerBox = $.UI.create("View",{
				classes: ["wfill","hsize","padding" ,"vert"],
				top: 0,
			}); 
			
			var bannerImage = Ti.UI.createImageView({
				image : entry.img_path,
				
			});
			
			var bannerLabel = $.UI.create('Label',{
				classes: ['font_dark_grey', 'h5'],
				text  : entry.b_desc, 
			});	
			bannerBox.add(bannerImage);
			bannerBox.add(bannerLabel);
			bannerView.add(bannerBox);
			$.bannerSv.add(bannerView);
		});
	}
}

exports.init = function(e){
 	init(e);
};