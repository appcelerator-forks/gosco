var args = arguments[0] || {};
var FORM = require('form');  
COMMON.construct($);
FORM.construct($);	
var kidsModel = Alloy.createCollection('kids'); 
var kidsEducationModel = Alloy.createCollection('kidsEducation'); 
var kid_id = args.kid_id || "";  
Ti.App.Properties.setString('current_kid', kid_id);
var pop; 
init(); 
function init(){
	var details = kidsModel.getKidsById(kid_id); 
	var gender = "Male";
	if(details.gender =="2"){
		gender = "Female";
	}
	
	var avatar = details.img_path;
	if(avatar == ""){
		avatar = "/images/avatar.jpg";
	}
	$.thumbPreview.image = avatar;
	$.fullname.text = details.fullname;
	$.date_value.text = COMMON.monthFormat(details.dob);
	$.gender_value.text = gender;
	$.hobby.text = details.hobby;
	$.parent_contact.text = details.contact;
	loadKidsSchool();
	loadKidsTuition();
}

/***Kids Tuition***/ 	
function loadKidsTuition(){
	COMMON.removeAllChildren($.myKidsTuitionView);
	var tuiTable = Ti.UI.createTableView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE, 
		backgroundColor: "#ffffff",
	});			
	var addTuitionTblRow = Titanium.UI.createTableViewRow({
		title: "Add Tuition",
		height:50, 
	});
	addTuitionTblRow.addEventListener("click",function(){showSchool(2);} );
	tuiTable.appendRow(addTuitionTblRow);	
	var ts = kidsEducationModel.getSchoolByKids(kid_id,2); 
	 
  	if(ts.length < 1){  
		$.myKidsTuitionView.add(tuiTable);	
	}else{
		ts.forEach(function(entry) { 
	   		var row = Titanium.UI.createTableViewRow({
			    touchEnabled: true,
			    height: Ti.UI.SIZE,
			    source: entry.id, 
			  	school: entry.e_id,
			    backgroundSelectedColor: "#FFFFFF",
		 
			});
			var tblRowView = Ti.UI.createView({
				layout: "horizontal",
				height:40,
				source: entry.id, 
				school: entry.e_id,
				width:Ti.UI.FILL 
			}); 
			var tblView = Ti.UI.createView({
				layout: "vertical",
				height:Ti.UI.SIZE,
				source: entry.id, 
				school: entry.e_id,
				width:Ti.UI.FILL 
			}); 
			var schoolTitle = $.UI.create('Label',{
				classes : ['font_medium', 'hsize','themeColor'],
				text: entry.school_name, 
				source: entry.id, 
				school: entry.e_id,
				left:4,
				top:10,
				textAlign:'left',  
			});	
			  
			tblView.add(schoolTitle); 
			tblRowView.add(tblView);  
			tblView.addEventListener('click',viewSchoolDetails); 
			 
			row.add(tblRowView); 
			tuiTable.appendRow(row);
		});
		$.myKidsTuitionView.add(tuiTable);	
	}  
 
}

/***Kids School***/ 		 				 
function loadKidsSchool(){
	COMMON.removeAllChildren($.myKidsSchoolView);
	var ksTable = Ti.UI.createTableView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		backgroundColor: "#ffffff",
		top:10
	});				 
	var addSchoolTblRow = Titanium.UI.createTableViewRow({
		title: "Add School",
		height:50, 
	});
	addSchoolTblRow.addEventListener("click",function(){showSchool(1);} );
	ksTable.appendRow(addSchoolTblRow);	 
	var ks = kidsEducationModel.getSchoolByKids(kid_id,1); 
	 
  	if(ks.length < 1){  
		$.myKidsSchoolView.add(ksTable);	
	}else{
		ks.forEach(function(entry) { 
	   		var row = Titanium.UI.createTableViewRow({
			    touchEnabled: true,
			    height: Ti.UI.SIZE,
			    source: entry.id, 
			  	school: entry.e_id,
			  	ec_id : entry.class_name,
			    backgroundSelectedColor: "#FFFFFF",
		 
			});
			var tblRowView = Ti.UI.createView({
				layout: "horizontal",
				height:50,
				source: entry.id, 
				school: entry.e_id,
				ec_id : entry.class_name,
				width:Ti.UI.FILL 
			}); 
			var tblView = Ti.UI.createView({
				layout: "vertical",
				height:Ti.UI.SIZE,
				source: entry.id, 
				school: entry.e_id,
				ec_id : entry.class_name,
				width:"80%" 
			}); 
			var schoolTitle = $.UI.create('Label',{
				classes : ['font_medium', 'hsize','themeColor'],
				text: entry.school_name, 
				source: entry.id, 
				school: entry.e_id,
				ec_id : entry.class_name,
				left:4,
				textAlign:'left',  
			});	
			 
			var mySt= Alloy.Globals.SchoolType[entry.school_type];
			
			var schoolType = $.UI.create('Label',{
				classes : ['font_small', 'hsize'],
				text: mySt, 
				source: entry.id, 
				school: entry.e_id,
				ec_id : entry.class_name,
				left:4,
				textAlign:'left',  
			});	
			 
			//CLASS NAME
			var kidcn = entry.class_name;
			if(kidcn == ""){
				kidcn ="N/A";
			}else{
				var educationClassModel = Alloy.createCollection('education_class'); 
				var ec = educationClassModel.getEducationClassById(entry.class_name);
				kidcn = ec.className;
			}
			var tblClassView = Ti.UI.createView({
				layout: "vertical",
				height:Ti.UI.SIZE,
				source: entry.id, 
				school: entry.e_id, 
				ec_id : entry.class_name,
				width:"auto" 
			}); 
			var className = $.UI.create('Label',{
				classes : ['font_medium' ,'hsize' ,'themeColor'],
				text: "Class", 
				source: entry.id, 
				school: entry.e_id, 
				ec_id : entry.class_name,
				top:0,
				textAlign:'center' 
			});	
			var classNameValue = $.UI.create('Label',{
				classes : ['font_small', 'hsize' ],
				text: kidcn, 
				source: entry.id, 
				school: entry.e_id, 
				ec_id : entry.class_name,
				textAlign:'center',  
			});	
			tblClassView.add(className);
			tblClassView.add(classNameValue);
			
			tblView.add(schoolTitle);
			tblView.add(schoolType);
			tblRowView.add(tblView); 
			tblRowView.add(separateLine());
			tblRowView.add(tblClassView);
			tblView.addEventListener('click',viewSchoolDetails); 
			tblClassView.addEventListener('click',classPop);
			row.add(tblRowView); 
			ksTable.appendRow(row);
		});
		$.myKidsSchoolView.add(ksTable);	
	} 
}

function viewSchoolDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl); 
	Ti.App.Properties.setString('current_school',  res.school);  
	var win = Alloy.createController("school/index",{school_id: res.school, ke_id: res.source, ec_id:res.ec_id}).getView();
	//Alloy.Globals.tabgroup.activeTab.open(win);
	openModal(win);
	//COMMON.openWindow(win);
} 

function classPop(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);   
	var win = Alloy.createController("classList",{id:res.source ,school:res.school, class_id: res.ec_id }).getView();
	openModal(win);
}
 

function showSchool(educationType){  
	var win = Alloy.createController("schoolList",{education:educationType}).getView();
	openModal(win);
}; 
 
var selectClass = function(e){
	 
	var param = {
		id: e.ks_id,
		e_id: e.e_id,
		item: e.className,
		k_id : kid_id 
	};
 	
	kidsEducationModel.updatePartialRecords(param);  
	API.updateKidsClass(param);
	API.getHomeworkList(e.className);  
	loadKidsSchool();  
};

var selectSchool = function(e){   
	var param = { 
		k_id: kid_id, 
		e_id: e.school,
		status: 1,
		created: currentDateTime(),
		updated: currentDateTime()
	};  
	kidsEducationModel.addNewKidsSchool(param);  
	
	if(e.educationType == "1"){ 
		API.getSchoolClassList(e.school);
		API.getCurriculumList(e.school); 
		loadKidsSchool();	 
	}else{
		console.log("tuition");
		loadKidsTuition();	 
	}
	
};

function doEditKids(){
	var win = Alloy.createController("kidsForm",{edit:1, k_id:kid_id}).getView();
	Alloy.Globals.tabgroup.activeTab.open(win);
}

function closeWindow(){
	Ti.App.fireEvent('refreshKids');
	COMMON.closeWindow($.win); 
}

var refreshKids = function(){ 
	init(); 
};

Ti.App.addEventListener('refreshKidsDetails',refreshKids);
Ti.App.addEventListener('selectClass',selectClass);
Ti.App.addEventListener('selectSchool',selectSchool);

//release memory when close
$.win.addEventListener("close", function(){
    Ti.App.removeEventListener('refreshKidsDetails',refreshKids);
	Ti.App.removeEventListener('selectClass',selectClass);
	Ti.App.removeEventListener('selectSchool',selectSchool);
});
