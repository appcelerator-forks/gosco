var args = arguments[0] || {};
var h_id = args.h_id;
var position = args.position;   
var homeworkAttachmentModel = Alloy.createCollection('homeworkAttachment'); 
 
init(); 

function init(){
	var items  = homeworkAttachmentModel.getRecordByHomework(h_id);
	var counter = 0;
	var imagepath, adImage, row = '';
	var my_page = 0; 
	var the_view = [];
	
	for (var i=0; i< items.length; i++) {  
		adImage = Ti.UI.createImageView({
			image: items[i].img_path,
			width:"100%",
			top: 50,
		});
		
		var scrollView = Ti.UI.createScrollView({
			contentWidth: 'auto',
		  	contentHeight: Ti.UI.SIZE,
		   	maxZoomScale: 30,
		    minZoomScale: 1,
		    zoomScale: 1,
		  	height: Ti.UI.FILL,
		  	width: '100%'
		});
		 
		row = $.UI.create('View', { 
			id:"view"+counter
		});
		 
		row.add(adImage); 
		scrollView.add(row);
		the_view.push(scrollView); 
		
		counter++;
	} 

	var scrollableView = Ti.UI.createScrollableView({
		  id: "scrollableView",
		  views:the_view, 
		  backgroundColor : "#000000",
		  showPagingControl:true
	});
	
	$.albumView.add(scrollableView);
	
	scrollableView.scrollToView(position, true); 
	 
	scrollableView.addEventListener( 'scrollend', function(e) {
		if((scrollableView.currentPage+1) === items.length){
			if(scrollableView.currentPage === my_page){
				scrollableView.currentPage=0;
			}
		} 
		my_page =  scrollableView.currentPage;
	}); 
	 
}; 