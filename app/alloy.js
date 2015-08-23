// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.tabgroup = undefined;
Alloy.Globals.schooltabgroup = undefined;

var _ = require('underscore')._;
var API = require('api');
var COMMON = require('common'); 
var PUSH = require('push');
var DBVersionControl = require('DBVersionControl');

DBVersionControl.checkAndUpdate();

var openNewWindow = function(win, new_window, tab){ 
	if(typeof Alloy.Globals.tabgroup.activeTab != "undefined" && typeof new_window == "undefined"){
		tab.activeTab.open(win); 
	}else{ 
		win.open({
			modal:true
		});
	}
};

function parent(key, e){
	if(eval("e."+key.name+"") != key.value){
		if(eval("e.parent."+key.name+"") != key.value){
			if(eval("e.parent.parent."+key.name+"") != key.value){ 
    		}else{
    			return e.parent.parent;
    		}
    	}else{
    		return e.parent;
    	}
    }else{
    		return e;
    }
}

function children(key, e){
	if(eval("e."+key.name+"") != key.value){
		for (var i=0; i < e.children.length; i++) {
			if(eval("e.children[i]."+key.name+"") == key.value){
		  		return e.children[i];
		 	}
			for (var a=0; a < e.children[i].children.length; a++) {
			  if(eval("e.children[i].children[a]."+key.name+"") == key.value){
			  	return e.children[i].children[a];
			  }
			};
		};
    }else{
		return e;
    }
}

function separateLine(){
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:Ti.UI.FILL, 
		width:1
	});
}

function currentDateTime(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var sec = today.getSeconds();
	if (minutes < 10){
		minutes = "0" + minutes;
	} 
	if (sec < 10){
		sec = "0" + sec;
	} 
	if(dd<10) {
	    dd='0'+dd;
	} 
	
	if(mm<10) {
	    mm='0'+mm;
	} 
	
	datetime = yyyy+'-'+mm+'-'+dd + " "+ hours+":"+minutes+":"+sec;
	return datetime ;
} 

function monthFormat(date){
	var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
 
    var day = date.split('-'); 
    if(day[1] == "08"){
		day[1] = "8";
	}
	if(day[1] == "09"){
		day[1] = "9";
	}
    month = parseInt(day[1]) -1;  
    return day[2]+" "+ monthNames[month]+" "+ day[0];
}

function escapeSpecialCharacter(msg){ 
	msg = msg.replace(/<br\/>/g,"\r\n");
	msg = msg.replace(/\&quot;/g,"'");
	msg = msg.replace(/\\/g,'');
	return msg;
}

//
Alloy.Globals.SchoolLevel =  [ 'Primary School', 'Secondary School', 'College','Cancel'];
Alloy.Globals.SchoolType =  [ 'Kebangsaan', 'Jenis Kebangsaan', 'Private/International','Cancel'];
Alloy.Globals.SchoolState =  [ 'Kuala Lumpur','Selangor','Cancel'];

