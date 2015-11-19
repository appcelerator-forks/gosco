var args = arguments[0] || {};

//var SCHOOL = require('school'); 
/*** Initialize***/ 
COMMON.construct($);
//SCHOOL.construct($); 
var educationModel = Alloy.createCollection('education');   
 if(Ti.App.Properties.getString('LevelPick') == null) {
	Ti.App.Properties.setString('LevelPick',0);
} 
if(Ti.App.Properties.getString('TypePick') == null) {
	Ti.App.Properties.setString('TypePick',0);
} 
if(Ti.App.Properties.getString('StatePick') == null) {
	Ti.App.Properties.setString('StatePick',0);
}  
 
var listing = [];
var educationType;
var searchBar = Ti.UI.createSearchBar({
	showCancel : true,
	height:50,
	barColor: "#ffffff"
});

var schContainer = Ti.UI.createScrollView({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL 
}); 

var init = function(e){
	educationType = e.educationType;
	listing = educationModel.getSchoolList("all",educationType,"");   
	
	var hintText = "Search School"; 
	if(educationType == "2"){
		hintText = "Search Tuition Centre"; 
	}
	 
	searchBar.hintText = hintText;
	
	var bigContainer = $.UI.create('View',{
		classes: ['hfill','wfill','vert']
	});
	var optionContainer = $.UI.create('View',{
		classes: [ 'wfill','horz'],
		height:50
	});
	
	optionContainer.add(createOptions("State",Alloy.Globals.SchoolState )); 
	 
	if(educationType == "1"){
		optionContainer.add(separateLine());
		optionContainer.add(createOptions("Level",Alloy.Globals.SchoolLevel ));
		optionContainer.add(separateLine());
		optionContainer.add(createOptions("Type",Alloy.Globals.SchoolType ));
	} 
	bigContainer.add(optionContainer);
	bigContainer.add(searchBar);
	bigContainer.add(separateHozLine());
	bigContainer.add(schContainer);
	$.schoolContainer.add(bigContainer); 
	 
	//setTimeout(function(){
		filterList(); 
	//},600);
}; 

var viewSchoolAction = function(vw){ 
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
	 	var win = Alloy.createController("educationDetails", {e_id: res.source}).getView();  
		Alloy.Globals.tabgroup.activeTab.open(win); 
	 	 
	});
};


$.createOptions = function(title,options){ 
	createOptions(title,options);
};

function createOptions(title,options){ 
	var onSelected = Ti.App.Properties.getString(title+'Pick'); 
	if(onSelected == null){
		onSelected= "0";
	}
	
	var cancelBtn = options.length-1;
	if(cancelBtn != onSelected){
		var myselected= options[onSelected];
	}
	 
	//School Level
	var theView = $.UI.create('View',{
		classes: [  'vert'],
		width:'33%', 
	});
	var theLabel = $.UI.create('Label',{
		classes: [ 'center', 'font_small', 'small_padding','font_light_white'], 
		text : title+" :",
		width:'100%', 
	});
	
	var theTextLabel = $.UI.create('Label',{
		classes: [ 'center', 'font_12','font_light_white'],
		text : myselected, 
		width:Ti.UI.SIZE, 
	});
	theView.add(theLabel);
	theView.add(theTextLabel);
	
	theView.addEventListener('click',function(){
		var dialog = Ti.UI.createOptionDialog({
		  cancel: options.length-1,
		  options: options,
		  selectedIndex: Ti.App.Properties.getString(title+'Pick') || 0,
		  title: 'Filter By'
		});
		
		dialog.show();
		
		dialog.addEventListener("click", function(e){  
			 
			if(cancelBtn != e.index){ 
				dialog.setSelectedIndex(e.index);
				theTextLabel.text = options[e.index]; 
				Ti.App.Properties.setString(title+'Pick', e.index);  
				Ti.App.fireEvent('filterList');
			}
		});
		
	});
	return theView;
}

var separateHozLine = function(){  
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:1, 
		width:Ti.UI.FILL
	});
}; 

var filterList = function(){   
	var lvlpick = Ti.App.Properties.getString('LevelPick');  
	var typepick = Ti.App.Properties.getString('TypePick');  
	var statepick = Ti.App.Properties.getString('StatePick');  
	if(lvlpick == null && typepick == null && statepick == null ){
		
	}else{
		//COMMON.showLoading();
		listing = educationModel.getSchoolList("all",educationType,"");   
 		createSchoolList(); 
	}
	
};
 
Ti.App.addEventListener('filterList',filterList);

function createSchoolList(){
	COMMON.removeAllChildren(schContainer);
	if(OS_ANDROID){
		var schTable = Ti.UI.createTableView({
			height:Ti.UI.FILL,
			width: Ti.UI.FILL,
			backgroundColor: "#ffffff",
			separatorColor : "#10844D",
			search: searchBar
		});
	}else{
		var schTable = Ti.UI.createTableView({
			height:Ti.UI.FILL,
			width: Ti.UI.FILL,
			backgroundColor: "#ffffff",
			separatorColor : "#10844D" 
		});
	}
	
	var data=[]; 
	var counter = 0;
    
  	if(listing.length < 1){ 
		schTable.setData(COMMON.noRecord());
	}else{
		listing.forEach(function(entry) {
	   		var row = Titanium.UI.createTableViewRow({ 
			    height: 40,
			    source: entry.id,   
			    backgroundSelectedColor: "#ECFFF9",
			    title: entry.name,
			    color: "#ffffff",
		 		backgroundColor: "#ffffff"
			});
			 
			var tblRowView = Ti.UI.createView({
					layout: "horizontal",
					height:Ti.UI.SIZE,
					source: entry.id, 
					width:Ti.UI.FILL 
			}); 
			
			var statusColor = "#8A6500";
			if(entry.status == "2"){ //publish
				statusColor = "#2C8A00";
			} 
			 
			var statustView = $.UI.create('View',{
				classes: ['hfill'],
				source: entry.id,
				width: 10,
				backgroundColor: statusColor
			});
			tblRowView.add(statustView);
			
			var schoolTitle = $.UI.create('Label',{
					classes : ['h5','wfill','hsize','themeColor'],
					text:  entry.name, 
					source: entry.id, 
					textAlign:'left',
					top:10,
					bottom:10,
					left:10
			});	
			  
			tblRowView.add(schoolTitle);
			viewSchoolAction(tblRowView);
			row.add(tblRowView);
			data.push(row);	   
		});
		schTable.setData(data);  
	}
	//COMMON.hideLoading();
	schContainer.add(schTable);  
}


/***SEARCH FUNCTION***/
var searchResult = function(){ 
	searchBar.blur(); 
	//COMMON.showLoading();
	var str = searchBar.getValue(); 
	if(str != ""){
		listing = educationModel.getSchoolList("all",educationType,str); 
	}else{ 
		listing = educationModel.getSchoolList("all",educationType,""); 
	}	
	createSchoolList(); 
};

searchBar.addEventListener("return", searchResult);

searchBar.addEventListener('focus', function f(e){
	searchBar.removeEventListener('focus', f);
});

searchBar.addEventListener('cancel', function(e){ 
	//listing = educationModel.getSchoolList("all",educationType,""); 
//	createSchoolList(); 
	searchBar.blur();
});

searchBar.addEventListener('blur', function(e){
	
});

exports.init = function(e){
 	init(e);
};