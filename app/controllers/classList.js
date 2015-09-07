var args = arguments[0] || {};

var e_id = args.school || "";
var ks_id = args.id || "";
var class_id = args.class_id || "";
var year = new Date().getFullYear(); 
var educationClassModel = Alloy.createCollection('education_class'); 
var listing = []; 

/*** Initialize***/ 
COMMON.construct($); 
var schContainer = Ti.UI.createScrollView({
	width: Ti.UI.FILL,
	height: Ti.UI.FILL,
	backgroundColor: "#ffffff" 
});
init();

function init(){
	listing = educationClassModel.getEducationClassList(year,e_id); 
	createClassList();
}

function createClassList(){
	//COMMON.removeAllChildren(schContainer);
	var clsTable = Ti.UI.createTableView();
	var data=[]; 
	var counter = 0;
    
  	if(listing.length < 1){ 
		clsTable.setData(COMMON.noRecord());
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
					source: entry.id, 
					width:Ti.UI.FILL 
			}); 
			
			var tblRowView = Ti.UI.createView({
					layout: "horizontal",
					height:Ti.UI.SIZE,
					source: entry.id, 
					width:Ti.UI.FILL 
			});  
			
			var classTitleView = Ti.UI.createView({ 
					height:Ti.UI.SIZE,
					source: entry.id, 
					width:"85%" 
			});  
			
			var classTitle = $.UI.create('Label',{
					classes : ['font_regular','wsize' ,'hsize','themeColor','padding'],
					text:  entry.className, 
					source: entry.id, 
					textAlign:'left' ,
					
			});	
			classTitleView.add(classTitle);
			tblRowView.add(classTitleView); 
			if(class_id == entry.id){ 
				var tickView = $.UI.create('ImageView',{
					classes : [ 'themeColor','padding'],
					image:  '/images/tick.png', 
					source: entry.id,
					width:20,
					height:20, 
				});	
				tblRowView.add(tickView);  
			}
			tblView.add(tblRowView);   
			
			addClassAction(tblRowView);
			row.add(tblView);
			data.push(row);	   
		});
		clsTable.setData(data);  
	}
	COMMON.hideLoading();
	schContainer.add(clsTable); 
	$.schoolContainer.add(schContainer); 
}

function addClassAction(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl);   
	 	Ti.App.fireEvent('selectClass',{e_id:e_id, className:res.source, ks_id:ks_id });
	 	$.win.close(); 
	});
}


function closeWin(){
	$.win.close();
}

$.win.addEventListener("close", function(){ 
});