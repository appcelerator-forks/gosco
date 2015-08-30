var args = arguments[0] || {};
var SCHOOL = require('school'); 


/*** Initialize***/ 
COMMON.construct($);
SCHOOL.construct($); 
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
function init(e){
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
	
	if(educationType == "1"){
		optionContainer.add(SCHOOL.createOptions("Level",Alloy.Globals.SchoolLevel, Ti.App.Properties.getString('LevelPick')));
		optionContainer.add(separateLine());
		optionContainer.add(SCHOOL.createOptions("Type",Alloy.Globals.SchoolType,Ti.App.Properties.getString('TypePick')));
		optionContainer.add(separateLine());
	}
	
	optionContainer.add(SCHOOL.createOptions("State",Alloy.Globals.SchoolState,Ti.App.Properties.getString('StatePick'))); 
	 
	bigContainer.add(optionContainer);
	bigContainer.add(searchBar);
	bigContainer.add(separateHozLine());
	bigContainer.add(schContainer);
	$.schoolContainer.add(bigContainer); 
	 
	setTimeout(function(){
		filterList(); 
	},600);
} 
 
function createSchoolList(){
	//COMMON.removeAllChildren(schContainer);
	var schTable = Ti.UI.createTableView();
	var data=[]; 
	var counter = 0;
    
  	if(listing.length < 1){ 
		schTable.setData(COMMON.noRecord());
	}else{
		listing.forEach(function(entry) {
	   		var row = Titanium.UI.createTableViewRow({ 
			    height: Ti.UI.SIZE,
			    source: entry.id,   
			    backgroundSelectedColor: "#ECFFF9",
		 
			});
			
			var tblView = Ti.UI.createView({
					layout: "vertical",
					height:Ti.UI.SIZE,
					top:5,
			   		bottom:5,
			   		source: entry.id, 
					width:"auto" 
			}); 
			
			var tblRowView = Ti.UI.createView({
					layout: "horizontal",
					height:Ti.UI.SIZE,
					source: entry.id, 
					width:Ti.UI.FILL 
			}); 
			
			var img_path =entry.img_path;
			if(img_path == ""){
				img_path = "/images/icons/icon_"+entry.level+".png";
			}
			var logoView = Ti.UI.createView({  
				width:50 ,
				layout:"vertical",
				source: entry.id, 
				height:Ti.UI.SIZE
			}); 
			var schoolLogo = $.UI.create('ImageView',{  
					source: entry.id, 
					image: img_path, 
					width:50,
					top: 4,
					left: 4
			});	
			logoView.add(schoolLogo);
			tblRowView.add(logoView);
			var schoolTitle = $.UI.create('Label',{
					classes : ['font_regular','wfill','hsize','themeColor'],
					text:  entry.name, 
					source: entry.id, 
					textAlign:'left',
					top:5,
					left:4
			});	
			 
			tblView.add(schoolTitle);  
			tblRowView.add(tblView);
			viewSchoolAction(tblRowView);
			row.add(tblRowView);
			data.push(row);	   
		});
		schTable.setData(data);  
	}
	//COMMON.hideLoading();
	schContainer.add(schTable);  
}
 
function viewSchoolAction(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
	 	var win = Alloy.createController("educationDetails", {e_id: res.source}).getView();  
		Alloy.Globals.tabgroup.activeTab.open(win); 
	 	 
	});
}

function separateHozLine(){
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:1, 
		width:Ti.UI.FILL
	});
} 

function filterList(){ 
	var lvlpick = Ti.App.Properties.getString('LevelPick');  
	var typepick = Ti.App.Properties.getString('TypePick');  
	var statepick = Ti.App.Properties.getString('StatePick');  
	if(lvlpick == null && typepick == null && statepick == null ){
		
	}else{
		//COMMON.showLoading();
		listing = educationModel.getSchoolList("all",educationType,"");   
 		createSchoolList(); 
	}
	
}
 
Ti.App.addEventListener('filterList',filterList);
 
/***SEARCH FUNCTION***/
function searchResult(){
	searchBar.blur(); 
	//COMMON.showLoading();
	var str = searchBar.getValue(); 
	if(str != ""){
		listing = educationModel.getSchoolList("all",educationType,str); 
	}else{ 
		listing = educationModel.getSchoolList("all",educationType,""); 
	}	
	createSchoolList(); 
}

searchBar.addEventListener("return", searchResult);

searchBar.addEventListener('focus', function f(e){
	searchBar.removeEventListener('focus', f);
});

searchBar.addEventListener('cancel', function(e){ 
	listing = educationModel.getSchoolList("all",educationType,""); 
	createSchoolList(); 
	searchBar.blur();
});

searchBar.addEventListener('blur', function(e){
	
});

exports.init = function(e){
 	init(e);
};