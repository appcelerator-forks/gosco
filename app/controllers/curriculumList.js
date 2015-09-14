var args = arguments[0] || {};
var school_id = args.school_id || "";
var curriculumModel = Alloy.createCollection('curriculum');   
/*** Initialize***/ 
COMMON.construct($);
init(); 
if(OS_IOS){
	$.educationView.top = 50;
}

var searchBar = Ti.UI.createSearchBar({
	showCancel : true ,
	barColor: "#ffffff"
});

function createList(){
	var curTable = $.UI.create('TableView',{
		classes : ['wfill', 'hfill', 'padding', 'box'], 
		backgroundColor: "#ffffff",
		bottom:5,
		top:0,
		//search : searchBar
	});			
	var details = curriculumModel.getCurriculumByEducation(school_id);
	 
	if(details.length > 0){ 
		details.forEach(function(entry) { 
    		var tblRowView = Ti.UI.createTableViewRow({
				hasChild: true,
				c_id: entry.id,
				height: 50,
				left: 10,
				//title: entry.curriculum
			});
			
			var titleView = $.UI.create('View', { 
				classes: ['horz', 'wfill', 'hsize'],
				height: Ti.UI.SIZE, 
				c_id: entry.id
			});
			
			var titleLbl = $.UI.create('Label', { 
				classes: ['horz',  'hsize'], 
				text: entry.curriculum,
				left:10,
				color: "#000000",
				c_id: entry.id
			});
			titleView.add(titleLbl);
			tblRowView.add(titleView);
			tblRowView.addEventListener('click',readCurriculumDetails);  
			
			var addView = Ti.UI.createView({ 
					width: 50,
					height: Ti.UI.SIZE,
					right:20,
					isAdd:1,
					c_id: entry.id 
				});
				var addBtn = Ti.UI.createImageView({
					width: 25,
					height: 25,
					c_id: entry.id,
					isAdd:1, 
					image: "/images/add.png"
				});
				addView.add(addBtn);
				tblRowView.add(addView);
				addView.addEventListener('click',selectCurriculum);  
			//tblRowView.addEventListener('click',selectCurriculum); 
			curTable.appendRow(tblRowView);
		});
	}else{
		var tblRowView = Ti.UI.createTableViewRow({ 
			title: "No Curriculum at moment",
			height: 50,
			left: 10,
		});
		curTable.appendRow(tblRowView); 
	}
	 $.curriculumContainer.add(curTable);
}

function selectCurriculum(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);    
	Ti.App.fireEvent('selectCurriculum',{c_id:res.c_id});
 
	$.win.close();  
}

function readCurriculumDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);    
	if(res.isAdd == "1"){
		return false;
	}
	var win = Alloy.createController("school/curriculum_post_list", {c_id: res.c_id, showHeader: 1}).getView(); 
 	openModal(win);
}

/***SEARCH FUNCTION***/
var searchResult = function(){ 
	searchBar.blur(); 
	//COMMON.showLoading();
	var str = searchBar.getValue(); 
	if(str != ""){
	//	listing = educationModel.getSchoolList("all",educationType,str); 
	}else{ 
	//	listing = educationModel.getSchoolList("all",educationType,""); 
	}	
	loadCurriculumList(school_id); 
};

searchBar.addEventListener("return", searchResult);

searchBar.addEventListener('focus', function f(e){
	searchBar.removeEventListener('focus', f);
});

searchBar.addEventListener('cancel', function(e){ 
	//listing = educationModel.getSchoolList("all",educationType,""); 
	loadCurriculumList(school_id); 
	searchBar.blur();
});

searchBar.addEventListener('blur', function(e){
	
});

function init(){
	createList();
} 

function closeWin(){
	$.win.close();
}

$.win.addEventListener("close", function(){  
	optionContainer = null;
});