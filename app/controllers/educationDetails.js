var args = arguments[0] || {};
var e_id = args.e_id || ""; 
var educationModel = Alloy.createCollection('education');  
var details;
var contacts = Ti.Contacts.getAllPeople(); 
var isAddedToContact = "0"; 
init();

function init(){
	syncData();
	showDetails(); 
	populateMap();
}


for (var i = 0; i < contacts.length; i++) {
	var phone = contacts[i].phone; 
    var workPhone = phone.work || null; 
    if(workPhone != null && workPhone[0] == details.contact_no ){
    	isAddedToContact = "1";
    	$.add2contact.title = "Already added to contact";
    } 
}  

function syncData(){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById("1");
	var last_updated ="";
	 
	if(isUpdate != "" ){
		last_updated = isUpdate.updated;
	}
	var param = { 
		"last_updated"	  : last_updated
	};
	
	API.callByPost({url:"getSchoolList", params: param}, function(responseText){
		 
		var res = JSON.parse(responseText);  
		
		if(res.status == "success"){  
	 		var arr = res.data; 
	 		 
	        educationModel.saveArray(arr);
			showDetails();
		} 
	});
	
}

function populateMap(){ 
	if((details.latitude != null && details.longitude != null) && (details.latitude != "" && details.longitude != "")) {  
		var annotations = [
		    Map.createAnnotation({
		        latitude:  details.latitude,
		        longitude:details.longitude,
		        title:details.name, 
		        animate: true,
		        image: '/images/marker.png',
		        //pincolor: Map.ANNOTATION_GREEN,
		    }),
		];
		var mapview = Map.createView({
		    mapType: Map.NORMAL_TYPE,
		    region: {
		        latitude:details.latitude,
		        longitude:details.longitude,
		        latitudeDelta:.05,
		        longitudeDelta:.05
		    },
		    animate:true,
		    regionFit:true,
		    userLocation:false,
		    top:0,
		    height:200,
		    annotations: annotations
		});
		$.win.add(mapview);	
		//$.educationMap.add(mapview);					
	}else{
		$.infoView.top = 0;
	}
}


function showDetails(){
	
	details  = educationModel.getSchoolById(e_id);  
	var phoneArr = []; 
	if(details != ""){  
		$.win.title = details.name;
		$.educationName.text = details.name;
		
		var add2 =details.address;
		if(add2.trim() != ""){
			add2 = add2  +"\r\n";
		}
		$.educationAddress.text = add2; 
		$.educationLocation.text = details.latitude +", "+ details.longitude;
	 
		$.educationTel.text = "TEL : " +details.contact_no || "N/A" ; 
		$.educationFax.text = "FAX : " + details.fax_no || "N/A"  ;
		phoneArr.push(details.contact_no);
		 
	}
}

 
function clickToCall(){ 
	var tel = details.contact_no; 
	tel = tel.replace(/[+]/g, ""); 
	Ti.Platform.openURL('tel:+'+tel);
}

var performAddressBookFunction = function(){ 
	var workAddress1 = {
	  'CountryCode': 'my',
	  'Street':  details.address, 
	  'State': details.state,
	  'Country': 'Malaysia', 
	};
	
	var phoneList = { 
	    work: phoneArr
	}; 
	 
	Ti.Contacts.createPerson({
	  firstName: details.name,
	  lastName:'',
	  address:{
	    'work':[workAddress1]
	  },
	  phone : phoneList
	});
	isAddedToContact = "1";
    $.add2contact.title = "Already added to contact";
	COMMON.createAlert("Success", "Successfully added to contact book.");
};

var addressBookDisallowed = function(){
	COMMON.createAlert("Cannot Access Contact Book", "You need allow GOSCO to access your contact book.");
};
	
function addToContact(){
	if(isAddedToContact != "1"){
		if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED){
		    performAddressBookFunction();
		} else if (Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN){
		    Ti.Contacts.requestAuthorization(function(e){
		        if (e.success) {
		            performAddressBookFunction();
		        } else {
		            addressBookDisallowed();
		        }
		    });
		} else {
		    addressBookDisallowed();
		}
	}
}
 
function direction2here(){
	 
	var locationCallback = function(e) {
	    if(!e.success || e.error) {
	    	alert("Please enable location services");
	        Ti.API.info('error:' + JSON.stringify(e.error));
	        return;
	    } 
	    var longitude = e.coords.longitude;
	    var latitude = e.coords.latitude; 
	 	//console.log('http://maps.google.com/maps?saddr='+latitude+','+longitude+'&daddr='+details.latitude+','+details.longitude);
	     
		var url = 'geo:'+latitude+','+longitude+"?q="+details.name+" (" + details.address   +  details.postcode +"\r\n"+  details.state + ")";
		  
		   
			if (Ti.Android){
				try {
					Ti.API.info('Trying to Launch via Intent');
					var intent = Ti.Android.createIntent({
						action: Ti.Android.ACTION_VIEW,
						data: url
						
					});
					Ti.Android.currentActivity.startActivity(intent);
				} catch (e){
					Ti.API.info('Caught Error launching intent: '+e);
					exports.Install();
				}
			}else{
				//nav.navigateWithArgs("clinic/clinicMap", {map_url:'http://maps.google.com/maps?ie=UTF8&t=h&z=16&saddr='+latitude+','+longitude+'&daddr='+details.latitude+','+details.longitude});
	   	 	} 
	    
	   	Titanium.Geolocation.removeEventListener('location', locationCallback); 
	};
	Titanium.Geolocation.addEventListener('location', locationCallback); 
}
 
function closeWindow(){
	COMMON.closeWindow($.win); 
}
 
