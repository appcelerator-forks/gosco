exports.LoadRemoteImage = function (obj,url) {
   var xhr = Titanium.Network.createHTTPClient();

xhr.onload = function(){ 
 obj.image=this.responseData;
 
};
// open the client
xhr.open('GET',url);

// send the data
xhr.send();
};
