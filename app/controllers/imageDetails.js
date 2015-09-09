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
	var itemImageView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE
	});
		
	adImage = Ti.UI.createImageView({
		defaultImage: "/images/default.png",
		image: viewImage.element,
		width:"100%",
		height: Ti.UI.SIZE 
	});
	$.imageDetailsView.add(adImage); 
}
	 
/*********************
*** Event Listener ***
**********************/ 
 
function closeWindow(){
	COMMON.closeWindow($.win); 
}
