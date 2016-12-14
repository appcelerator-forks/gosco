var args = arguments[0] || {};  
var element_id = args.element_id  || ""; 
var post_id = args.post_id  || ""; 
var isCurriculum =  args.isCurriculum  || "";

if(isCurriculum == "1"){ 
	postElementModel = Alloy.createCollection('curriculumPost_element'); 
}else{ 
	postElementModel = Alloy.createCollection('post_element'); 	
}
var viewImage = postElementModel.getRecordsById(element_id);

init();

function init(){
	$.win.orientationModes = [ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT,Ti.UI.PORTRAIT,Ti.UI.UPSIDE_PORTRAIT ];
	
	var itemImageView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE
	});
		
	adImage = Ti.UI.createImageView({
		//defaultImage: "/images/default.png",
		image:"",
		width:"100%",
		enableZoomControls: true,
		height: Ti.UI.SIZE 
	});
	API.loadRemoteImage(adImage,viewImage.element);  
	$.imageDetailsView.add(adImage); 
}
	 
/*********************
*** Event Listener ***
**********************/ 
 
function closeWindow(){
	COMMON.closeWindow($.win); 
}
