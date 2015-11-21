var args = arguments[0] || {};
COMMON.construct($);

function doForgotPassword(){
	var email = $.email.value;  
	//authentication / checking
	if(email.trim() == ""){
		COMMON.createAlert("Error", "Email cannot be empty");
		return false;
	}else if(validateEmail(email) != "1"){
		COMMON.createAlert("Error", "Please fill in an valid email");
		return false;	
	}
	 
	
	//submit to server
	var param = { 
		"email"	  :  email 
	};
	 
	API.callByPost({url:"forgotPasswordUrl", params: param}, function(responseText){ 
		var res = JSON.parse(responseText);   
		if(res.status == "success"){    
			COMMON.createAlert("Success", "Please check your email to reset your password", function(){
				 closeWindow();
			});
		}else{
			COMMON.createAlert("Error", res.data);
			return false;
		} 
	});
}

function closeWindow(){
	COMMON.closeWindow($.win); 
}
