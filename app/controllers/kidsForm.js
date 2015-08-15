var args = arguments[0] || {}; 
var FORM = require('form'); 

COMMON.construct($);
FORM.construct($);		
 
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth(); 
var yyyy = today.getFullYear();
var toolbar;
var datePicker = Ti.UI.createPicker({
	  type: Ti.UI.PICKER_TYPE_DATE,
	  minDate: new Date(1930,0,1),
	  maxDate: new Date(yyyy,mm,dd),
	  id: "datePicker", 
});
var dpView = Titanium.UI.createView({
		layout: "vertical",
		height: 0,
		width: Ti.UI.FILL,
		visible: false
	});
	
function setupPersonalData(){
	var done = Titanium.UI.createButton({
	    title: 'Done',
	    style: Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});
	  
	
	done.addEventListener('click', function(){
		var all_picker = $.selectorView.children;
		all_picker[0].visible="false";
		all_picker[1].visible="false";
		$.selectorView.height=0;
		dpView.height=0;
	});
	
	flexSpace = Titanium.UI.createButton({
	    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	}); 
	toolbar = Titanium.UI.iOS.createToolbar({
	    items:[  done], 
	    extendBackground:true,
	    borderTop:true,
   		borderBottom:false
	}); 
	dpView.add(toolbar);
	dpView.add(datePicker);
	
	$.selectorView.add(dpView);    
	datePicker.addEventListener("change", changeDate);
	
	//Set Gender
	var genderValue =["Not Set", "Female", "Male"]; 
	for(var i = 0 ; i < genderValue.length; i++){
		 
		var genderData = genderValue[i]; 
		var gendata = Ti.UI.createPickerRow({
			title:genderData.toString() 
		}); 
		$.genderPicker.add(gendata); 
	}
	$.genderPicker.setSelectedRow(0,0,true); 	
}

var add_kid = function(){ 
	var imgBlob    = FORM.getImageData(); 
	var birthdate  = $.date_value.text; 
	var gender     = $.gender_value.text; 
	var fullname   = $.fullname.value; 
	var hobby  	   = $.hobby.value;
	var contact    = $.contact.value;
	if(birthdate != "Not Set" && birthdate != ""){ 
		var bdate =birthdate.split('(');
		var s_date  = bdate[0].split('/');
		var newDate = s_date[2] + "-"+s_date[1]+"-"+s_date[0];   
	}
	
	if(fullname.trim() == ""){
		COMMON.createAlert("Error", "Please fill in your kids's full name");
		return false;
	}
	if(gender == "Not Set"){
		COMMON.createAlert("Error", "Please fill in your kids's gender");
		return false;
	}
	if(contact.trim() == ""){
		COMMON.createAlert("Error", "Please fill in your contact number");
		return false;
	}
	
	var params = { 
	 	fullname : fullname.trim(), 
	 	gender : gender, 
	 	contact : contact.trim(),
		birthdate : birthdate, 
		hobby : hobby,  
		photo : imgBlob, 
		type : "kid" 
	};
 	API.saveKids(params,$);
	 
}; 
//
function takePhoto(){
	 FORM.loadPhoto($.thumbPreview, "","");
}

function showDatePicker(e){ 
	var all_picker = $.selectorView.children;
	$.selectorView.height = Ti.UI.SIZE;
	dpView.height = Ti.UI.SIZE;
	if(OS_ANDROID){ 
		datePicker.showDatePickerDialog({
			 //value: new Date(sBday[0],parseInt(sBday[1]) - 1, parseInt(sBday[2]) ),
			 callback: function(e) {
			   if (e.cancel) { 
			   } else {
			     changeDate(e);
			   }
			 }
		});
	}else{   
		//toolbar.visible = "true"; 
		var dobPicker = all_picker[1]; 
		dobPicker.visible = "true";
		$.genderPicker.visible = "false"; 
	}
	resetTextColor();
	$.date_value.color = "#10844D";  
}

function changeDate(e){ 
	 
	var pickerdate = e.value; 
    var day = pickerdate.getDate();
    day = day.toString();
 
    if (day.length < 2) {
        day = '0' + day;
    }
  
    var month = pickerdate.getMonth();
    month = month + 1;
    month = month.toString();
 
    if (month.length < 2) {
        month = '0' + month;
    }
 
    var year = pickerdate.getFullYear(); 
    selDate = day + "/" + month + "/" + year; 
    
    var age = "";
    if(e.age == "1"){
    	age = "("+getAge(year+"-"+month+"-"+day)+")";  
    } 
	$.date_value.text = selDate + age; 
	//hd.changeDate({date: e.value, age : 1});
}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function showGenderPicker(){  
	$.selectorView.height = Ti.UI.SIZE;  
	resetTextColor();
	$.gender_value.color = "#10844D";
	$.genderPicker.visible = "true"; 
}  

function resetTextColor(){ 
	$.date_value.color = "#757575";
	$.gender_value.color = "#757575"; 
}

function changeGender(e){   
	$.gender_value.text = e.selectedValue[0]; 
	resetTextColor(); 
	$.selectorView.height=0;
	$.genderPicker.visible = "false";
}
//		 

setupPersonalData();