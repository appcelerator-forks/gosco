/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "admin.goscoglobal.com";

// APP authenticate user and key
var USER  = 'gosco';
var KEY   = '206b53047cf312532294f7207789fdggh';

//API when app loading phase
var getSchoolPost		= "http://"+API_DOMAIN+"/api/getPostList?user="+USER+"&key="+KEY;
var getCurriculumPost	= "http://"+API_DOMAIN+"/api/getCurriculumPost?user="+USER+"&key="+KEY;
var getSchoolList  		= "http://"+API_DOMAIN+"/api/getSchoolList?user="+USER+"&key="+KEY;
var getBannerList  		= "http://"+API_DOMAIN+"/api/getBannerList?user="+USER+"&key="+KEY;
var getCurriculumList  	= "http://"+API_DOMAIN+"/api/getCurriculumList?user="+USER+"&key="+KEY;
var getHomeworkList 	= "http://"+API_DOMAIN+"/api/getHomeworkList?user="+USER+"&key="+KEY;
var getSchoolClassList  = "http://"+API_DOMAIN+"/api/getSchoolClassList?user="+USER+"&key="+KEY;
var getEventsList       = "http://"+API_DOMAIN+"/api/getEventsList?user="+USER+"&key="+KEY;
var updateKidsClass  	= "http://"+API_DOMAIN+"/api/updateKidsClass?user="+USER+"&key="+KEY;
var removeKidsClass  	= "http://"+API_DOMAIN+"/api/removeKidsClass?user="+USER+"&key="+KEY;
var updateKidsCurriculum= "http://"+API_DOMAIN+"/api/updateKidsCurriculum?user="+USER+"&key="+KEY;
var removeKidsCurriculum= "http://"+API_DOMAIN+"/api/removeKidsCurriculum?user="+USER+"&key="+KEY;
var facebookLoginUrl	= "http://"+API_DOMAIN+"/api/doFacebookLogin?user="+USER+"&key="+KEY;
//var getTuitionList   	= "http://"+API_DOMAIN+"/api/getTuitionList?user="+USER+"&key="+KEY; 
var getKidByUserList    = "http://"+API_DOMAIN+"/api/getKidByUser?user="+USER+"&key="+KEY; 
var getKidsClassByUser  = "http://"+API_DOMAIN+"/api/getKidsClassByUser?user="+USER+"&key="+KEY; 
var getKidsCurriculum   = "http://"+API_DOMAIN+"/api/getKidsCurriculum?user="+USER+"&key="+KEY; 
var deviceInfoUrl       = "http://"+API_DOMAIN+"/api/getDeviceInfo?user="+USER+"&key="+KEY;
var doLoginUrl  		= "http://"+API_DOMAIN+"/api/doLogin?user="+USER+"&key="+KEY;
var doSignUpUrl  		= "http://"+API_DOMAIN+"/api/doSignUp?user="+USER+"&key="+KEY;
var addKidUrl 			= "http://"+API_DOMAIN+"/api/addkid?user="+USER+"&key="+KEY;
var forgotPasswordUrl 	= "http://"+API_DOMAIN+"/api/doForgotPassword?user="+USER+"&key="+KEY;
var getEducationGalleryUrl = "http://"+API_DOMAIN+"/api/getEducationGallery?user="+USER+"&key="+KEY;
var doDeleteKidUrl  	= "http://"+API_DOMAIN+"/api/doDeleteKid?user="+USER+"&key="+KEY;
var authenticateKidUrl  = "http://"+API_DOMAIN+"/api/authenticateKid?user="+USER+"&key="+KEY;
var checkAppVersionUrl  = "http://"+API_DOMAIN+"/api/checkParentAppVersion?user="+USER+"&key="+KEY;

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

exports.loadRemoteImage = function (obj,url) {
	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function() { 
	 obj.image=this.responseData; 
	}; 
	xhr.open('GET',url); 
	xhr.send();
}; 

// Get user device info
exports.getDeviceInfo = function(ex){
	var records = { 
			'u_id' : Ti.App.Properties.getString('user_id') || 0,
			'deviceToken':Ti.App.Properties.getString('deviceToken'),
			'version' : Ti.Platform.version,
			'os' : 	Ti.Platform.osname,
			'model' : Ti.Platform.model,
			'macaddress' :Ti.Platform.macaddress 
	};
 	console.log(records);
	var url = deviceInfoUrl;
	var _result = contactServerByPost(url,records);   
	_result.onload = function(e) { 
		 
	};
	
	_result.onerror = function(e) { 
	};
};

exports.checkAppVersion = function(callback_download){
	var appVersion = Ti.App.Properties.getString('appVersion') || "";
	var os = "android";
	if(OS_IOS){
		os = "ios";
	}
	var url = checkAppVersionUrl+"&appVersion="+appVersion+"&appPlatform="+os ; 
	console.log(url);
	var _result = contactServerByGet(url);   
	_result.onload = function(e) {
		var result = JSON.parse(this.responseText); 
		if(result.status == "error"){
		 	callback_download && callback_download(result);
		} 
		
	};
	
	
};

exports.updateKidsClass = function(ex){
	//console.log(updateKidsClass+"&k_id="+ex.k_id+"&ec_id="+ex.item+"&e_id="+ex.e_id);
	var url = updateKidsClass+"&k_id="+ex.k_id+"&ec_id="+ex.item+"&e_id="+ex.e_id; 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) {};
};

exports.removeKidsClass = function(ex){
	var url = removeKidsClass+"&id="+ex.id; 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) {};
};

exports.updateKidsCurriculum = function(ex){
	var url = updateKidsCurriculum+"&k_id="+ex.k_id+"&c_id="+ex.c_id;
	 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) {};
};

exports.removeKidsCurriculum = function(ex){
	var url = removeKidsCurriculum+"&k_id="+ex.k_id+"&c_id="+ex.c_id;
	 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) {};
};

//Get school announcement / awards
exports.getSchoolPost = function(e_id){ 
	var url = getSchoolPost+"&e_id="+e_id;
	var _result = contactServerByGet(url);   
	console.log(url);
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
				 Ti.App.Properties.setString('post', '1');
				  
				 checkLoadDone(); 
			 } 
			 
			// Ti.App.fireEvent('endLoad'); 
	     }
	};
	
	_result.onerror = function(e) { 
	};
};

exports.getCurriculumPost = function(e, onReturn){
	
	var url = getCurriculumPost+"&c_id="+e.c_id; 
	var _result = contactServerByGet(url);   
	
	_result.onload = function(e) { 
		onReturn(this.responseText);
	};
	
	_result.onerror = function(e) { 
	};
	
};

exports.getEventsList = function(e_id){ 
	var url = getEventsList+"&e_id="+e_id;
 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data[0]);
			return false;
		}else{
			var eventsModel = Alloy.createCollection('events'); 
			var eventsAttachmentModel = Alloy.createCollection('eventsAttachment'); 
			var arr = result.data; 
			 
			eventsModel.saveArray(arr); 
			eventsAttachmentModel.saveArray(arr);
			Ti.App.Properties.setString('events', '1');
			 
			checkLoadDone(); 
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
			Ti.App.Properties.setString('class', '1');
			 
			checkLoadDone(); 
		}
	};
	
	_result.onerror = function(e) { 
	};
};

//Get kid curriculum
exports.getKidsCurriculum = function(k_id){ 
	var url = getKidsCurriculum+"&k_id="+k_id;
	//console.log(url);
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data[0]);
			return false;
		}else{
			var kidsCurriculumClassModel = Alloy.createCollection('kidsCurriculum'); 
			var arr = result.data; 
			 
			kidsCurriculumClassModel.saveArray(arr); 
			Ti.App.Properties.setString('curriculum', '1'); 
			 
			checkLoadDone(); 
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
			
			Ti.App.Properties.setString('kidsCurriculum', '1'); 
			 
			checkLoadDone(); 
		}
	};
	
	_result.onerror = function(e) { 
	};
};

exports.getHomeworkList = function(ec_id, skipLoadDone){ 
	skipLoadDone = skipLoadDone || "";
	var url = getHomeworkList+"&ec_id="+ec_id;
	// console.log(url);
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data[0]);
			return false;
		}else{
			var homeworkModel = Alloy.createCollection('homework'); 
			var homeworkAttachmentModel = Alloy.createCollection('homeworkAttachment'); 
			var arr = result.data;  
			homeworkModel.saveArray(arr);  
			homeworkAttachmentModel.saveArray(arr);
			if(skipLoadDone == ""){
				Ti.App.Properties.setString('kidsHomework', '1'); 
				 
				checkLoadDone(); 
			}
			
		}
	};
	
	_result.onerror = function(e) { 
	};
};

//Do FB Login
exports.doFacebookLogin = function(e){
	var url = facebookLoginUrl+"&email="+e.email+"&fbid="+e.fbid+"&link="+e.link+"&name="+e.name; 
	 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText);
		
		if(result.status == "error"){
			COMMON.hideLoading(); 
			COMMON.createAlert("Error", result.data[0]);
			return false;
		}else{
			var userModel = Alloy.createCollection('user'); 
			var arr = result.data; 
			 
			userModel.saveArray(arr);
	   		Ti.App.Properties.setString('user_id', arr.id);
	   		Ti.App.Properties.setString('fullname', arr.fullname);
	   		
	   		//UPDATE / SYNC kids from server
	   		API.getKidsInfoByUser({login: 1}); 
	   		API.getKidByUser(); 
		}
	};
	
	_result.onerror = function(e) { 
	};
};

// Do login
exports.doLogin = function(ex){ 
	var url = doLoginUrl+"&username="+ex.username+"&password="+ex.password;
	 console.log(url);
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText);
		//console.log(result);
		if(result.status == "error"){
			COMMON.hideLoading();
			COMMON.createAlert("Error", result.data[0]);
			return false;
		}else{
			var userModel = Alloy.createCollection('user'); 
			var arr = result.data; 
			userModel.saveArray(arr);
	   		Ti.App.Properties.setString('user_id', arr.id);
	   		Ti.App.Properties.setString('fullname', arr.fullname);
	   		
	   		//UPDATE / SYNC kids from server
	   		API.getKidsInfoByUser({login: 1}); 
	   		API.getKidByUser(); 
	   		checkLoadDone();
		}
	};
	
	_result.onerror = function(e) { 
	};
};


exports.getKidByUser = function(ex){
	var url = getKidByUserList+"&u_id="+Ti.App.Properties.getString('user_id'); 
	console.log(url); 
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText);
		//console.log(result); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data);
			return false;
		}else{
			var kidsModel = Alloy.createCollection('kids'); 
			var arr = result.data;  
			kidsModel.saveArray(arr);   
			
		}
		checkLoadDone(); 
	};
	
	_result.onerror = function(e) { 
	}; 
};

exports.getKidsInfoByUser = function(ex){
	var url = getKidsClassByUser+"&u_id="+Ti.App.Properties.getString('user_id'); 
	console.log(url); 
	Ti.App.Properties.setString('isLoadHomepage', "0");			
	var _result = contactServerByGet(url);   
	_result.onload = function(e) { 
		var result = JSON.parse(this.responseText);
		 //console.log(result); 
		if(result.status == "error"){
			COMMON.createAlert("Error", result.data);
			return false;
		}else{
			var kidsEducationModel = Alloy.createCollection('kidsEducation'); 
			kidsEducationModel.resetData(); 
			var arr = result.data; 
			if(arr.length > 0){
				arr.forEach(function(entry) { 
					Ti.App.Properties.setString('curriculum', '0');
					Ti.App.Properties.setString('post', '0');
					Ti.App.Properties.setString('class', '0');
					Ti.App.Properties.setString('events', '0');
					Ti.App.Properties.setString('kidsCurriculum','0');
					Ti.App.Properties.setString('kidsHomework','0');
					API.getKidsCurriculum(entry.k_id);
					API.getSchoolPost(entry.e_id);
					API.getSchoolClassList(entry.e_id);
					API.getCurriculumList(entry.e_id);  
					API.getEventsList(entry.e_id);  
					API.getHomeworkList(entry.ec_id);  
				});
				 
				kidsEducationModel.saveArray(arr); 
			}else{
				Ti.App.Properties.setString('curriculum', '1');
				Ti.App.Properties.setString('post', '1');
				Ti.App.Properties.setString('class', '1');
				Ti.App.Properties.setString('events', '1');
				Ti.App.Properties.setString('kidsCurriculum','1');
				Ti.App.Properties.setString('kidsHomework','1');
				API.getSchoolPost("");
			}
			
			if(ex.login == "1"){
			//	checkLoadDone(); 
			}  
		}
		
		checkLoadDone(); 
	};
	
	_result.onerror = function(e) { 
	}; 
};

function checkLoadDone(){
	var load1 = Ti.App.Properties.getString('curriculum');
	var load2 = Ti.App.Properties.getString('post');
	var load3 = Ti.App.Properties.getString('class');
	var load4 = Ti.App.Properties.getString('kidsCurriculum'); 
	var load5 = Ti.App.Properties.getString('events');
	var load6 = Ti.App.Properties.getString('kidsHomework');
	/**
	console.log("load1 :"+load1);
	console.log("load2 :"+load2);
	console.log("load3 :"+load3);
	console.log("load4 :"+load4);
	console.log("load5 :"+load5);
	console.log("load6 :"+load6);
	**/
	if(load1 == "1" && load2 == "1" && load3 == "1" && load4 == "1" && load5 =="1" && load6 =="1"){
		var loadHP = Ti.App.Properties.getString('isLoadHomepage');		
 		
		if(loadHP == "0"){
			COMMON.hideLoading();
			Ti.App.Properties.setString('isLoadHomepage', "1");			
			var win = Alloy.createController("homepage/index").getView();
			openModal(win); 
		}
				
	}else{
	//	checkLoadDone();
	}
	
}

// Do Sign Up
exports.doSignUp = function(ex,mainView){ 
	var url = doSignUpUrl+"&fullname="+ex.fullname+"&email="+ex.email+"&mobile="+ex.mobile+"&username="+ex.username+"&password="+ex.password+"&confirmation="+ex.password;
	//console.log(url);
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
	   	
			COMMON.createAlert("Success", "Successfully created Gosco account!");
			COMMON.closeWindow(mainView.win);   
		}
	};
	
	_result.onerror = function(e) { 
	};
};

// Do save Kids
exports.saveKids = function(ex,onAPIReturn){
	 
 	var gender = 1;
	if(ex.gender == "Female"){
		gender = 2;
	} 
	var url = addKidUrl+"&isEdit="+ex.isEdit+"&fullname="+ex.fullname+
				"&dob="+ex.birthdate+"&contact="+ex.contact+"&gender="+gender+
				"&hobby="+ex.hobby+"&u_id="+Ti.App.Properties.getString('user_id');
 	
 	if(ex.isEdit == "1"){
 		url += "&id="+ex.k_id;
 	}
 	 
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

exports.callByPostImage = function(e, onload, getParam){
	var url =  eval(e.url);
	var _result = contactServerByPostImage(url, e.params || {});   
	_result.onload = function(e) {   
		onload && onload(this.responseText); 
	};
		
	_result.onerror = function(e) { 
		onerror && onerror(); 
	};	
};
 
 
exports.callByPost = function(e, onload, onerror){
	var url =  eval(e.url);
	  
	var _result = contactServerByPost(url, e.params || {});   
	_result.onload = function(e) {   
		onload && onload(this.responseText); 
	};
		
	_result.onerror = function(e) { 
		onerror && onerror(); 
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
	client.send(records); 
	return client;
};

function contactServerByPostImage(url,photo) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 50000
	});
	 
	//client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
	client.open("POST", url);
	client.send({Filedata: photo}); 
	return client;
};

function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};