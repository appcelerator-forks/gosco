var args = arguments[0] || {};
COMMON.construct($);
var postModel;
var postElementModel; 
var post_id = args.p_id  || "";
var isCurriculum = args.isCurriculum  || "";  
var showHeader = args.showHeader || "";
var from = args.from || ""; 
var postDetails;
var details;
 
if(showHeader == "1"){
	$.showHeader.visible = true;
	$.showHeader.height = 50;
}
 
if(isCurriculum == "1"){
 	postModel = Alloy.createCollection('curriculumPost'); 
	postElementModel = Alloy.createCollection('curriculumPost_element'); 
}else{
	postModel = Alloy.createCollection('post'); 
	postElementModel = Alloy.createCollection('post_element'); 	
}



init();
function init(){
	postDetails = postModel.getRecordsById(post_id);
	details = postElementModel.getListByPost(post_id);
	loadPostDetails();
	loadBanner();
}

function loadBanner(){ 
	//banner
	var bannerModel = Alloy.createCollection('banner');   
	var bannerListing = bannerModel.getBannerList(3); 
	if(bannerListing.length > 0){ 
		bannerListing.forEach(function(bannerEntry) {
			var bannerL = $.UI.create('ImageView',{
				classes: ['wfill'],
				height: 50,
				bottom: 0,
				name : bannerEntry.b_name || "",
				url : bannerEntry.b_link || "",
				image : bannerEntry.img_path
			});
			bannerL.addEventListener('click', function(be){
				var elbl = JSON.stringify(be.source); 
				var res = JSON.parse(elbl); 
				if(res.url != ""){
					COMMON.modalWebView(res.name, res.url);
				}
			});
			$.postDetailsView.add(bannerL);
		});
	} 
	 
}
function loadPostDetails(){ 
	var titleLabel = $.UI.create('Label',{
		text: escapeSpecialCharacter(postDetails.title),
		classes : ["news_title", "themeColor"]
	});
	$.myContentView.add(titleLabel);
	var authorDateView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height: Ti.UI.SIZE,
		layout: "vertical",  
	});
	authorDateView.add($.UI.create('Label',{
		text:postDetails.publisher_position + " @ "+ monthFormat(postDetails.publish_date),
		textAlign: "right", 
		right: 10,
		classes : ['font_small','font_light_grey']
	}));
	 
	
	var dateView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height: Ti.UI.SIZE,
		layout: "horizontal",  
	});
 
	dateView.add(authorDateView);
	$.myContentView.add(dateView);		
	 
	details.forEach(function(entry) {
		 
		var msg = escapeSpecialCharacter(entry.element); 
	 
		if(entry.type == "1"){
			var dynaLabel = $.UI.create('Label',{
				text:msg,
				height: Ti.UI.SIZE,
				classes : ["news_subtitle"]
			});
			$.myContentView.add(dynaLabel);
		}
		
		if(entry.type == "2"){  
			
			if(OS_IOS){
				$.myContentView.add(COMMON.displayHTMLArticle(msg));
			}else{
				$.myContentView.add($.UI.create('Label',{
					html: msg,
					height: Ti.UI.SIZE,
					classes: ['news_paragraph'],
				}));
			} 
		}
		
		if(entry.type == "3"){
			var imageVw = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				backgroundColor: "#ffffff", 
			}); 
			var dynaImage = Ti.UI.createImageView({
				image: entry.element,
				width : Ti.UI.FILL,
				//defaultImage :  "/images/default.png"
			});
			imageVw.add(dynaImage);
			API.loadRemoteImage(dynaImage,entry.element);  
			$.myContentView.add(imageVw); 
			
			//image event
			 imageVw.addEventListener('click', function(e) {
		     
				var win = Alloy.createController("imageDetails",{element_id:entry.id, isCurriculum: isCurriculum}).getView(); 
			  	if(from == "school"){
			  		Alloy.Globals.schooltabgroup.activeTab.open(win);  
			  	}else{
			  		Alloy.Globals.tabgroup.activeTab.open(win);	
			  	}
		    });
			
			//caption
			var caption = ""; 
			
			if(entry.caption != "" &&  entry.caption != "null"){
				caption = escapeSpecialCharacter(entry.caption);
			}
			var dynaLabel = $.UI.create('Label',{
				text:caption,
				classes : ["image_caption"]
			});
	 
			$.myContentView.add(dynaLabel);
		}
		
		if(entry.type == "4"){
			var yTImage = Ti.UI.createView({
				width : Ti.UI.FILL,
				height: 200,
				backgroundColor: "#000000",  
				top: 10,
				bottom:10
			});
			
			if(OS_IOS){
				var osname = Ti.Platform.osname;    
		    	switch(osname) {
			        case 'ipad':
			           var vidWidth = "50%";
			           break;
			        case 'iphone':
			           var vidWidth = "80%";
			           break;
	            }
	            
				var webView = Ti.UI.createWebView({
				    url: 'http://www.youtube.com/embed/'+entry.element+'?autoplay=1&autohide=1&cc_load_policy=0&color=white&controls=0&fs=0&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0',
				    enableZoomControls: false,
				  //  scalesPageToFit: false,
				    scrollsToTop: false,
				    scalesPageToFit :true,
				    disableBounce: true,
				    showScrollbars: false,
				    width: vidWidth
				});
				yTImage.add(webView);
				$.myContentView.add(yTImage);
			}else{
				var androidYtView = Ti.UI.createView({
					width:Ti.UI.FILL, 
					height:Ti.UI.SIZE,
					top:0,
					bottom:20,
					backgroundColor: "#000000",  
					layout: "vertical"
				});
				var youtubePlayer = require("titutorial.youtubeplayer");
				var playIcon = Ti.UI.createImageView({
					image: "http://img.youtube.com/vi/"+entry.element+"/hqdefault.jpg", 
					width:Ti.UI.SIZE, 
					height:Ti.UI.SIZE
				});
				androidYtView.add(playIcon);
				
				var androidSeperatorView = Ti.UI.createView({ 
					height:30, 
				});
				
				$.myContentView.add(androidYtView); 
				$.myContentView.add(androidSeperatorView); 
				androidYtView.addEventListener( "click", function(){ 
					youtubePlayer.playVideo(entry.element);
				 });
			} 
		}
	});
	COMMON.hideLoading();
}

function closeWindow(){
	COMMON.closeWindow($.win); 
}
