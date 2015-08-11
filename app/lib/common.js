var mainView = null;

exports.construct = function(mv){
	mainView = mv;
};
exports.deconstruct = function(){  
	mainView = null;
};

function openWindow(win){
	if(Ti.Platform.osname == "android"){
	  	win.open(); //{fullscreen:false, navBarHidden: false}
	}else{ 
		var nav = Alloy.Globals.navMenu;
		nav.openWindow(win,{animated:true});  
	} 
}


//function closeWindow(win){
exports.closeWindow = function(win){
	if(Ti.Platform.osname == "android"){ 
	  	win.close(); 
	}else{ 
		var nav = Alloy.Globals.navMenu;
		nav.closeWindow(win,{animated:true});  
	} 
};

function removeAllChildren (viewObject){
    //copy array of child object references because view's "children" property is live collection of child object references
    var children = viewObject.children.slice(0);
 
    for (var i = 0; i < children.length; ++i) {
        viewObject.remove(children[i]);
    }
};

function createAlert (tt,msg){
	var box = Titanium.UI.createAlertDialog({
		title: tt,
		ok: 'OK',
		message: msg
	});
	box.show();
};

exports.openWindow = _.throttle(openWindow, 500, true);
//exports.closeWindow = _.debounce(closeWindow, 0, true);
exports.removeAllChildren = _.debounce(removeAllChildren, 0, true);
exports.createAlert = _.throttle(createAlert, 500, true);

/***Date Time related and format***/
exports.now = function(){
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
};

exports.monthFormat = function(date){
	var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
 
    var day = date.split('-'); 
    month = parseInt(day[1]) -1; 
    return day[2]+" "+ monthNames[month]+" "+ day[0];
};

exports.timeFormat = function(datetime){
	var timeStamp = datetime.split(" ");  
	var newFormat;
	var ampm = "am";
	var date = timeStamp[0].split("-");  
	var time = timeStamp[1].split(":");  
	if(time[0] > 12){
		ampm = "pm";
		time[0] = time[0] - 12;
	}
	
	newFormat = date[2]+"/"+date[1]+"/"+date[0] + " "+ time[0]+":"+time[1]+ " "+ ampm;
	return newFormat;
};
