var args = arguments[0] || {};
COMMON.construct($);
var curriculumModel = Alloy.createCollection('curriculum'); 

var school_id; 

function init(e){
	school_id = e.school_id; 
	 
	loadCurriculumList(school_id);
}  

function loadCurriculumList(school_id){
	var details = curriculumModel.getCurriculumByEducation(school_id);
	 console.log(details);
	if(details.length > 0){ 
		details.forEach(function(entry) {
			 console.log(entry);
    		var tblRowView = Ti.UI.createTableViewRow({
				hasChild: true,
				title: entry.curriculum
			});
			$.curriculumTbl.appendRow(tblRowView);
		});
	}
	 
}

exports.init = function(e){
 	init(e);
 };
