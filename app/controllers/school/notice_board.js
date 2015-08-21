var args = arguments[0] || {}; 
COMMON.construct($);
var educationModel = Alloy.createCollection('education'); 
var school_id; 

function init(e){
	school_id = e.school_id;
	console.log("notice board :"+school_id);
	var details = educationModel.getSchoolById(school_id);
	$.schoolName.text = details.name;
	$.schoolAddress.text = details.address;
	$.schoolTel.text = details.contact_no;
	//console.log(details);
}  
 

 exports.init = function(e){
 	init(e);
 };
