/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "14.102.151.167";

// APP authenticate user and key
var USER  = 'gosco';
var KEY   = '206b53047cf312532294f7207789fdggh';

//API when app loading phase
var getSchoolPost		= "http://"+API_DOMAIN+"/gosco/api/getPostList?user="+USER+"&key="+KEY;
var getSchoolList  		= "http://"+API_DOMAIN+"/gosco/api/getSchoolList?user="+USER+"&key="+KEY;
var getBannerList  		= "http://"+API_DOMAIN+"/gosco/api/getBannerList?user="+USER+"&key="+KEY;
var getCurriculumList  	= "http://"+API_DOMAIN+"/gosco/api/getCurriculumList?user="+USER+"&key="+KEY;
var getSchoolClassList  = "http://"+API_DOMAIN+"/gosco/api/getSchoolClassList?user="+USER+"&key="+KEY;
var updateKidsClass  	= "http://"+API_DOMAIN+"/gosco/api/updateKidsClass?user="+USER+"&key="+KEY;

//var getTuitionList   	= "http://"+API_DOMAIN+"/gosco/api/getTuitionList?user="+USER+"&key="+KEY; 
var getKidByUserList    = "http://"+API_DOMAIN+"/gosco/api/getKidByUser?user="+USER+"&key="+KEY; 
var getKidsClassByUser  = "http://"+API_DOMAIN+"/gosco/api/getKidsClassByUser?user="+USER+"&key="+KEY; 
var deviceInfoUrl       = "http://"+API_DOMAIN+"/gosco/api/getDeviceInfo?user="+USER+"&key="+KEY;
var doLoginUrl  		= "http://"+API_DOMAIN+"/gosco/api/doLogin?user="+USER+"&key="+KEY;
var doSignUpUrl  		= "http://"+API_DOMAIN+"/gosco/api/doSignUp?user="+USER+"&key="+KEY;
var addKidUrl 			= "http://"+API_DOMAIN+"/gosco/api/addkid?user="+USER+"&key="+KEY;
//API that call in sequence 
var APILoadingList = [
	{url: getSchoolList, model: "education", checkId: "1"},
	{url: getBannerList, model: "banner", checkId: "2"}, 
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
	 console.log(url);
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

exports.updateKidsClass = function(ex){
	var url = updateKidsClass+"&k_id="+ex.k_id+"&ec_id="+ex.item+"&e_id="+ex.e_id;
 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		
	};
};

//Get school announcement / awards
exports.getSchoolPost = function(e_id){
	var url = getSchoolPost+"&e_id="+e_id;
	var _result = contactServerByGet(url);   
	
	_result.onload = function(e) { 
		var res = JSON.parse(this.responseText);  
	    if(res.status == "success"){	  
			 var postData = res.data; 
			 if(postData != ""){ 
			 	 var post = res.data.post;  
				 var post_model = Alloy.createCollection('post');  
				 post_model.addPost(post);
				 
				 var post_element_model = Alloy.createCollection('post_element');  
				 post_element_model.addElement(post);
				  
			 } 
			 
			// Ti.App.fireEvent('endLoad'); 
	     }
	};
	
	_result.onerror = function(e) { 
	};
};

//Get school class
exports.getSchoolClassList = function(e_id){
	 
	var url = getSchoolClassList+"&e_id="+e_id;
	//console.log(url);
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data[0]);
			return false;
		}else{
			var educationClassModel = Alloy.createCollection('education_class'); 
			var arr = result.data; 
			 
			educationClassModel.saveArray(arr); 
		}
	};
	
	_result.onerror = function(e) { 
	};
};

//Get curriculum list
exports.getCurriculumList = function(e_id){
	var url = getCurriculumList+"&e_id="+e_id;
	// console.log(url);
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data[0]);
			return false;
		}else{
			var curriculumModel = Alloy.createCollection('curriculum'); 
			var arr = result.data;  
			curriculumModel.saveArray(arr); 
		}
	};
	
	_result.onerror = function(e) { 
	};
};

// Do login
exports.doLogin = function(ex){ 
	var url = doLoginUrl+"&username="+ex.username+"&password="+ex.password;
	 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText);
		COMMON.hideLoading(); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data[0]);
			return false;
		}else{
			var userModel = Alloy.createCollection('user'); 
			var arr = result.data; 
			userModel.saveArray(arr);
	   		Ti.App.Properties.setString('user_id', arr.id);
	   		Ti.App.Properties.setString('fullname', arr.fullname);
	   		
	   		//UPDATE / SYNC kids from server
	   		API.getKidByUser({login: 1});
			API.getKidsClassByUser();
		}
	};
	
	_result.onerror = function(e) { 
	};
};


exports.getKidByUser = function(ex){
	var url = getKidByUserList+"&u_id="+Ti.App.Properties.getString('user_id'); 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText);
		 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data);
			return false;
		}else{
			var kidsModel = Alloy.createCollection('kids'); 
			var arr = result.data;  
			kidsModel.saveArray(arr);  
			
			if(ex.login == "1"){
				var win = Alloy.createController("homepage/index").getView();
				openModal(win);
			}
		}
	};
	
	_result.onerror = function(e) { 
	}; 
};

exports.getKidsClassByUser = function(ex){
	var url = getKidsClassByUser+"&u_id="+Ti.App.Properties.getString('user_id'); 
	//console.log(url);
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText);
		 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data);
			return false;
		}else{
			var kidsEducationModel = Alloy.createCollection('kidsEducation'); 
			kidsEducationModel.resetData(); 
			var arr = result.data; 
			arr.forEach(function(entry) {
				API.getSchoolClassList(entry.e_id);
				API.getCurriculumList(entry.e_id);  
			});
			 
			kidsEducationModel.saveArray(arr);   
		}
	};
	
	_result.onerror = function(e) { 
	}; 
};

// Do Sign Up
exports.doSignUp = function(ex,mainView){ 
	var url = doSignUpUrl+"&fullname="+ex.fullname+"&email="+ex.email+"&mobile="+ex.mobile+"&username="+ex.username+"&password="+ex.password+"&confirmation="+ex.password;
	//console.log(url);
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText);
		COMMON.hideLoading(); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data);
			return false;
		}else{
			var userModel = Alloy.createCollection('user'); 
			var arr = result.data; 
			userModel.saveArray(arr);
	   	
			COMMON.createAlert("Success", "Gosco account registration successful!");
			Alloy.Globals.navWin.closeWindow(mainView.signUpWin); 
		}
	};
	
	_result.onerror = function(e) { 
	};
};

// Do save Kids
exports.saveKids = function(ex,onAPIReturn){
	 
 	ex.gender = 1;
	if(ex.gender == "Female"){
		ex.gender = 2;
	} 
	var url = addKidUrl+"&isEdit="+ex.isEdit+"&fullname="+ex.fullname+
				"&dob="+ex.birthdate+"&contact="+ex.contact+"&gender="+ex.gender+
				"&hobby="+ex.hobby+"&u_id="+Ti.App.Properties.getString('user_id');
 	
 	if(ex.isEdit == "1"){
 		url += "&id="+ex.k_id;
 	}
 	
 	console.log(url);
	return false;
 	
	if(ex.photo == ""){
		var _result = contactServerByGet(url);   
	}else{
		var _result = contactServerByPostImage(url+"&photoLoad=1", ex.photo);   
	} 
	_result.onload = function(e) { 
		onAPIReturn(this.responseText); 
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

function contactServerByPostImage(url,photo) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
	 
	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
	client.open("POST", url);
	client.send({Filedata: photo}); 
	return client;
};

function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};