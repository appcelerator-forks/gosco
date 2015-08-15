var args = arguments[0] || {};
var SCHOOL = require('school'); 

/*** Initialize***/ 
COMMON.construct($);
SCHOOL.construct($);
var schoolModel = Alloy.createCollection('school');   
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
listing = schoolModel.getSchoolList();   
var bigContainer = $.UI.create('View',{
	classes: ['hfill','wfill','vert']
});
var optionContainer = $.UI.create('View',{
	classes: [ 'wfill','horz'],
	height:65
});
var schContainer = Ti.UI.createScrollView({
	width: Ti.UI.FILL,
	height: Ti.UI.FILL 
});
  
optionContainer.add(SCHOOL.createOptions("Level",Alloy.Globals.SchoolLevel, Ti.App.Properties.getString('LevelPick')));
optionContainer.add(separateLine());
optionContainer.add(SCHOOL.createOptions("Type",Alloy.Globals.SchoolType,Ti.App.Properties.getString('TypePick')));
optionContainer.add(separateLine());
optionContainer.add(SCHOOL.createOptions("State",Alloy.Globals.SchoolState,Ti.App.Properties.getString('StatePick'))); 
 
bigContainer.add(optionContainer);
bigContainer.add(separateHozLine());
bigContainer.add(schContainer);
$.schoolContainer.add(bigContainer); 


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
			    touchEnabled: true,
			    height: Ti.UI.SIZE,
			    source: entry.id, 
			   // layout: "vertical",
			    backgroundSelectedColor: "#ECFFF9",
		 
			});
			
			var tblView = Ti.UI.createView({
					layout: "vertical",
					height:Ti.UI.SIZE,
					width:"auto" 
			}); 
			
			var tblRowView = Ti.UI.createView({
					layout: "horizontal",
					height:Ti.UI.SIZE,
					width:Ti.UI.FILL 
			}); 
			
			var img_path =entry.img_path;
			if(img_path == ""){
				img_path = "/images/icons/icon_"+entry.level+".png";
			}
			var logoView = Ti.UI.createView({  
				width:50 ,
				layout:"vertical",
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
			var schoolAddress = $.UI.create('Label',{
				classes : ['font_medium','wfill','hsize'],
				text:  entry.address, 
				source: entry.id,
				color: "#848484", 
				textAlign:'left',
				top:5,
				left:4,  
			});	
			var schoolContact = $.UI.create('Label',{
				classes : ['font_medium','wfill','hsize'],
				text:  entry.contact_no, 
				source: entry.id,
				color: "#848484", 
				textAlign:'left',
				top:5,
				bottom:5,
				left:4 
			});	
			tblView.add(schoolTitle); 
			tblView.add(schoolAddress); 
			tblView.add(schoolContact); 
			tblRowView.add(tblView);
			addSchoolAction(tblRowView);
			row.add(tblRowView);
			data.push(row);	   
		});
		schTable.setData(data);  
	}
	COMMON.hideLoading();
	schContainer.add(schTable); 
}
 
function addSchoolAction(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
	 	Ti.App.fireEvent('selectSchool',{school:res.source });
	 	$.schoolListWin.close(); 
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
		COMMON.showLoading();
		listing = schoolModel.getSchoolList();   
 		createSchoolList(); 
	}
	
}
setTimeout(function(){
	filterList(); 
},600);
 
Ti.App.addEventListener('filterList',filterList);

function closeWin(){
	$.schoolListWin.close();
}

$.schoolListWin.addEventListener("close", function(){ 
	Ti.App.removeEventListener('filterList',filterList);
	optionContainer = null;
});