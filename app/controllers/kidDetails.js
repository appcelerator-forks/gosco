var args = arguments[0] || {};
var FORM = require('form');  
COMMON.construct($);
FORM.construct($);	
var kidsModel = Alloy.createCollection('kids'); 
var kidsEducationModel = Alloy.createCollection('kidsEducation'); 
var kid_id = args.kid_id || "";  
var details = kidsModel.getKidsById(kid_id);
var pop;
init();

function init(){
	var gender = "Male";
	if(details.gender){
		gender = "Female";
	}
	$.thumbPreview.image = details.img_path;
	$.fullname.text = details.fullname;
	$.date_value.text = COMMON.monthFormat(details.dob);
	$.gender_value.text = gender;
	$.hobby.text = details.hobby;
	$.parent_contact.text = details.contact;
	loadKidsSchool();
}
 		 				 
function loadKidsSchool(){
	COMMON.removeAllChildren($.myKidsFormView);
	var ksTable = Ti.UI.createTableView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		top:10
	});				 
	var addSchoolTblRow = Titanium.UI.createTableViewRow({
		title: "Add School"
	});
	addSchoolTblRow.addEventListener("click",function(){showSchool();} );
	ksTable.appendRow(addSchoolTblRow);	 
	var ks = kidsEducationModel.getSchoolByKids(kid_id);   
  
  	if(ks.length < 1){  
		$.myKidsFormView.add(ksTable);	
	}else{
		ks.forEach(function(entry) {
	   		var row = Titanium.UI.createTableViewRow({
			    touchEnabled: true,
			    height: Ti.UI.SIZE,
			    source: entry.id, 
			  	school: entry.e_id,
			    selectedBackgroundColor: "#FFFFFF",
		 
			});
			var tblRowView = Ti.UI.createView({
				layout: "horizontal",
				height:50,
				source: entry.id, 
				school: entry.e_id,
				width:Ti.UI.FILL 
			}); 
			var tblView = Ti.UI.createView({
				layout: "vertical",
				height:Ti.UI.SIZE,
				source: entry.id, 
				school: entry.e_id,
				width:"58%" 
			}); 
			var schoolTitle = $.UI.create('Label',{
				classes : ['font_medium', 'hsize','themeColor'],
				text: entry.school_name, 
				source: entry.id, 
				school: entry.e_id,
				left:4,
				textAlign:'left',  
			});	
			 
			var mySt= Alloy.Globals.SchoolType[entry.school_type];
			
			var schoolType = $.UI.create('Label',{
				classes : ['font_small', 'hsize'],
				text: mySt, 
				source: entry.id, 
				school: entry.e_id,
				left:4,
				textAlign:'left',  
			});	
			
			//STANDARD
			var kidSd = entry.standard;
			if(kidSd == ""){
				kidSd ="N/A";
			}
			var tblStandardView = Ti.UI.createView({
				layout: "vertical",
				height:Ti.UI.SIZE,
				source: entry.id, 
				school: entry.e_id,
				width:"20%" 
			}); 
			
			var standardName = $.UI.create('Label',{
				classes : ['font_medium', 'hsize','themeColor' ],
				text: "Standard", 
				source: entry.id, 
				school: entry.e_id,
				top:0,
				textAlign:'center',  
			});	
			var standardValue = $.UI.create('Label',{
				classes : ['font_small', 'hsize' ],
				text: kidSd, 
				source: entry.id, 
				school: entry.e_id,
				textAlign:'center',  
			});	
			tblStandardView.add(standardName);
			tblStandardView.add(standardValue);
			
			//CLASS NAME
			var kidcn = entry.class_name;
			if(kidcn == ""){
				kidcn ="N/A";
			}
			var tblClassView = Ti.UI.createView({
				layout: "vertical",
				height:Ti.UI.SIZE,
				source: entry.id, 
				school: entry.e_id,
				width:"20%" 
			}); 
			var className = $.UI.create('Label',{
				classes : ['font_medium' ,'hsize' ,'themeColor'],
				text: "Class", 
				source: entry.id, 
				school: entry.e_id,
				top:0,
				textAlign:'center' 
			});	
			var classNameValue = $.UI.create('Label',{
				classes : ['font_small', 'hsize' ],
				text: kidcn, 
				source: entry.id, 
				school: entry.school_id,
				textAlign:'center',  
			});	
			tblClassView.add(className);
			tblClassView.add(classNameValue);
			
			tblView.add(schoolTitle);
			tblView.add(schoolType);
			tblRowView.add(tblView);
			tblRowView.add(separateLine());
			tblRowView.add(tblStandardView);
			tblRowView.add(separateLine());
			tblRowView.add(tblClassView);
			tblView.addEventListener('click',viewSchoolDetails);
			tblStandardView.addEventListener('click',standardPop);
			tblClassView.addEventListener('click',classPop);
			row.add(tblRowView); 
			ksTable.appendRow(row);
		});
		$.myKidsFormView.add(ksTable);	
	}
	
}

function viewSchoolDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl); 
	console.log("kid details :"+ res.school);
	var win = Alloy.createController("school/index",{school_id: res.school}).getView();
	COMMON.openWindow(win);
}

function standardPop(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);  
	popUpForm("standard",res.source);
}

function classPop(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);  
	popUpForm("class",res.source);
}

function popUpForm(iType,source_id){
	if(Ti.Platform.osname == "android"){
		var textfield = Ti.UI.createTextField({ keyboardType : Ti.UI.KEYBOARD_DEFAULT});
		var dialog = Ti.UI.createAlertDialog({
		    title: "Kid's "+iType, 
		    message: "Kid's "+iType+" in at school ", 
		   	androidView: textfield,
		    buttonNames: ['Confirm', 'Cancel'], 
		}); 
	}else{ 
		var dialog = Ti.UI.createAlertDialog({
		    title: "Kid's "+iType, 
		    message: "Kid's "+iType+" in at school ", 
		    style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
		    buttonNames: ['Confirm', 'Cancel'] 
		}); 
	}
	
	dialog.show(); 
	dialog.addEventListener('click', function(e){  
		if(e.index == 0) {  
			var itemData;
			if(Ti.Platform.osname == "android"){
				itemData = textfield.value;
			}else{
				itemData = e.text;
			}
			
			var param = {
				id: source_id,
				item: itemData,
				type: iType,
			};
			kidsEducationModel.updatePartialRecords(param); 
			console.log(param);
			loadKidsSchool();  
		}else{
			
		}
	}); 
}

function showSchool(){  
	var win = Alloy.createController("schoolList").getView();
	openNewWindow(win);
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
	loadKidsSchool();	 
};
 

Ti.App.addEventListener('selectSchool',selectSchool);