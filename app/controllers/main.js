var args = arguments[0] || {};

var schoolModel = Alloy.createCollection('school'); 
var school = schoolModel.getSchoolList();
console.log(school);
var addKid = function(){
	var win = Alloy.createController("kidsForm").getView();
	win.open(win);
};
