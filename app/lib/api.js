/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "14.102.151.167";

// APP authenticate user and key
var USER  = 'gosco';
var KEY   = '206b53047cf312532294f7207789fdggh';

//API when app loading phase
var getSchoolList  		= "http://"+API_DOMAIN+"/gosco/api/getSchoolList?user="+USER+"&key="+KEY;
var getTuitionList   	= "http://"+API_DOMAIN+"/gosco/api/getTuitionList?user="+USER+"&key="+KEY; 

var deviceInfoUrl       = "http://"+API_DOMAIN+"/gosco/api/getDeviceInfo?user="+USER+"&key="+KEY;
var getMerchantListByCategory  = "http://"+API_DOMAIN+"/api/getMerchantListByCategory?user="+USER+"&key="+KEY;
//API that call in sequence 
var APILoadingList = [
	{url: getSchoolList, model: "school", checkId: "1"},
	{url: getTuitionList, model: "tuition", checkId: "2"},
 	
];

/*********************
**** API FUNCTION*****
**********************/

exports.loadAPIBySequence = function (ex, counter){ 
	counter = (typeof counter == "undefined")?0:counter;
	if(counter >= APILoadingList.length){
		Ti.App.fireEvent('app:loadingViewFinish');
		return false;
	}
	
	var api = APILoadingList[counter];
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById(api['checkId']);
	var last_updated ="";
	
	var model = Alloy.createCollection(api['model']);
	if(isUpdate != "" ){
		last_updated = isUpdate.updated;
	}
	  
	 var url = api['url']+"&last_updated="+last_updated; 
	 var _result = contactServerByGet(url);    
	 _result.onload = function(e) {  
	 	var res = JSON.parse(this.responseText);
	 	if(res.status == "Success" || res.status == "success"){
	 		/**load new set of category from API**/
	 		var arr = res.data; 
	        model.saveArray(arr);
	   	}
		Ti.App.fireEvent('app:update_loading_text', {text: APILoadingList[counter]['model']+" loading..."});
		checker.updateModule(APILoadingList[counter]['checkId'],APILoadingList[counter]['model'], COMMON.now());
			
		counter++;
		API.loadAPIBySequence(ex, counter);
	 };
	 
	 // function called when an error occurs, including a timeout
	 _result.onerror = function(e) { 
	 	console.log("API getCategoryList fail, skip sync with server");
	    API.loadAPIBySequence(ex, counter);
	 }; 
};

// Get user device info
exports.getDeviceInfo = function(ex){
	var records = {};
	records['version'] =  Ti.Platform.version;
	records['os'] =  Ti.Platform.osname;
	records['model'] =  Ti.Platform.model;
	records['macaddress'] =  Ti.Platform.macaddress;  
	 
	var url = deviceInfoUrl;
	var _result = contactServerByPost(url,records);   
	_result.onload = function(e) { 
		 
	};
	
	_result.onerror = function(e) { 
	};
};

/*********************
 * Private function***
 *********************/
function contactServerByGet(url) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	client.open("GET", url);
	client.send(); 
	return client;
};

function contactServerByPost(url,records) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	if(OS_ANDROID){
	 	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
	 }
	client.open("POST", url);
	client.send({list: JSON.stringify(records)}); 
	return client;
};

function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};