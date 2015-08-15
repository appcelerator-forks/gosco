var args = arguments[0] || {}; 
COMMON.construct($);
var schoolModel = Alloy.createCollection('school'); 
var school_id; 

function init(e){
	school_id = e.school_id;
	var details = schoolModel.getSchoolById(school_id);
	$.schoolName.text = details.name;
	$.schoolAddress.text = details.address;
	$.schoolTel.text = details.contact_no;
	//console.log(details);
}  
 

 exports.init = function(e){
 	init(e);
 };
