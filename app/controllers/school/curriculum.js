var args = arguments[0] || {};
COMMON.construct($);
var curriculumModel = Alloy.createCollection('curriculum');  
var kidsCurriculumModel = Alloy.createCollection('kidsCurriculum');
var school_id; 
var details;
var thisView = $;
var searchBar = Ti.UI.createSearchBar({
	showCancel : true ,
	barColor: "#ffffff"
});


//$.curScrollView.add(searchBar);

function init(e){
	school_id = e.school_id;  
	loadCurriculumList(school_id,"");
}  
 
function loadCurriculumList(school_id, isShowRemove){
	var curTable = $.UI.create('TableView',{
		classes : ['wfill','hsize' , 'padding' ], 
		backgroundColor: "#ffffff",
		bottom:5,
		top:0 
	}); 
	 
	var data = []; 		
	details = kidsCurriculumModel.getCurriculumList(Ti.App.Properties.getString('current_kid'),school_id);
 
	if(details.length > 0){ 
		details.forEach(function(entry) { 
    		var tblRowView = Ti.UI.createTableViewRow({ 
				height: 50, 
				c_id: entry.c_id,
				kc_id: entry.id
			}); 
			var view1 = $.UI.create('View',{
				classes: [ 'wfill',  'hsize'],  
				source: entry.id
			});
			var titleView = $.UI.create('View', { 
				classes: ['horz', 'wfill', 'hsize'],
				height: Ti.UI.SIZE, 
				top: 10,
				c_id: entry.c_id,
				kc_id: entry.id
			});
			
			var ccImg = "/images/koku.png";
			if(entry.img_path != ""){
				ccImg = entry.img_path;
			}
			var cocuImg = $.UI.create('ImageView', {  
				image: ccImg,
				left:10, 
				height:30,
				width:30,
				borderRadius: 15,
				c_id: entry.c_id,
				kc_id: entry.id
			});
			
			var titleLbl = $.UI.create('Label', { 
				classes: ['horz',  'hsize','h5','font_dark_grey'], 
				text: entry.curriculum,
				left:5, 
				c_id: entry.c_id,
				kc_id: entry.id
			});
			
			var imgView1 = $.UI.create('ImageView',{
				image : "/images/btn-forward.png",
				source :entry.id,
				width : 20,
				height : 20,
				right: 10
			});
			titleView.add(cocuImg);
			titleView.add(titleLbl);
			view1.add(titleView);
			view1.add(imgView1);
			tblRowView.add(view1);
			tblRowView.addEventListener('click',readCurriculumDetails);  
			if(isShowRemove == 1){ 
				var deleteView = Ti.UI.createView({ 
					width: 50,
					height: Ti.UI.SIZE,
					right:20,
					isDelete:1,
					c_id: entry.c_id,
					kc_id: entry.id
				});
				var deleteBtn = Ti.UI.createImageView({
					width: 25,
					height: 25,
					c_id: entry.c_id,
					isDelete:1,
					kc_id: entry.id,
					image: "/images/remove.png"
				});
				deleteView.add(deleteBtn);
				tblRowView.add(deleteView);
				deleteView.addEventListener('click',deleteCurriculum);  
			}
		 
			data.push(tblRowView);
		});
	}else{
		var tblRowView = Ti.UI.createTableViewRow({
			hasChild: true,
			title: "Add curriculum to kid",
			height: 50,
			left:10
		});
		curTable.appendRow(tblRowView); 
		tblRowView.addEventListener('click',showCurriculumList); 
		data.push(tblRowView);  
	}
	curTable.setData(data);
	details = null; 
	COMMON.removeAllChildren(thisView.curList);
	thisView.curList.add(curTable);
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
	loadCurriculumList(school_id,""); 
};

searchBar.addEventListener("return", searchResult);

searchBar.addEventListener('focus', function f(e){
	searchBar.removeEventListener('focus', f);
});

searchBar.addEventListener('cancel', function(e){ 
	//listing = educationModel.getSchoolList("all",educationType,""); 
	loadCurriculumList(school_id,""); 
	searchBar.blur();
});

searchBar.addEventListener('blur', function(e){
	
});
 
function readCurriculumDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);    
	if(res.isDelete == "1"){
		return false;
	}
	var win = Alloy.createController("school/curriculum_post_list", {c_id: res.c_id}).getView(); 
 	Alloy.Globals.schooltabgroup.activeTab.open(win);
}

function deleteCurriculum(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);   
	
	 var dialog = Ti.UI.createAlertDialog({
	    cancel: 1,
	    buttonNames: ['Cancel','Confirm'],
	    message: 'Are you sure want to remove this curriculum from your kid?',
	    title: 'Remove curriculum from kid'
	});
	dialog.addEventListener('click', function(e){
	  
		if (e.index === e.source.cancel){
	      //Do nothing
	    }
	    
	    if (e.index === 1){ 
	    	//remove from local DB
	    	kidsCurriculumModel.removeById(res.kc_id);   
			//sync to server
			API.removeKidsCurriculum({k_id:Ti.App.Properties.getString('current_kid'),c_id: res.c_id  }); 
			//reload list
			loadCurriculumList(school_id,1);
	    }
	});
	dialog.show(); 
}
 
$.refreshList = function(e){  
	school_id = Ti.App.Properties.getString('current_school'); 
	loadCurriculumList(school_id,e.showRemove); 
};

function selectCurriculum(e){  
	$.removeBtn.visible = true; 
	$.doneBtn.visible = false; 
	school_id = Ti.App.Properties.getString('current_school'); 
	var param = { 
		k_id: Ti.App.Properties.getString('current_kid'), 
		c_id: e.c_id, 
		created: currentDateTime(),
		updated: currentDateTime()
	};  
	//save to local DB
	kidsCurriculumModel.addNewKidsCurriculum(param);  
	//sync to server
	API.updateKidsCurriculum({k_id:Ti.App.Properties.getString('current_kid'),c_id: e.c_id  }); 
	//reload list
	loadCurriculumList(school_id,"");
}


function showRemoveList(){
	$.removeBtn.visible = false;  
	$.doneBtn.visible = true; 
	loadCurriculumList(school_id,1);
}

function doneRemove(){
	$.removeBtn.visible = true; 
	$.doneBtn.visible = false; 
	loadCurriculumList(school_id,"");
}

function showCurriculumList(){  
	var win = Alloy.createController("curriculumList",{school_id:school_id}).getView();
	openModal(win);
}
 
Ti.App.addEventListener('selectCurriculum',selectCurriculum);

 
//release memory when close
exports.removeEvent = function(){ 
	console.log("yes close and remove event");
    Ti.App.removeEventListener('selectCurriculum',selectCurriculum);  
};

exports.init = function(e){
 	init(e);
};
