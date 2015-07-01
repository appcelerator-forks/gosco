// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.tabgroup = undefined;
Alloy.Globals.schooltabgroup = undefined;

var openNewWindow = function(win, new_window, tab){
	console.log('a');
	console.log(typeof new_window);
	if(typeof Alloy.Globals.tabgroup.activeTab != "undefined" && typeof new_window == "undefined"){
		tab.activeTab.open(win);
		console.log('b');
	}else{
		console.log('c');
		win.open();
	}
};

function parent(key, e){
	if(eval("e."+key.name+"") != key.value){
		if(eval("e.parent."+key.name+"") != key.value){
			if(eval("e.parent.parent."+key.name+"") != key.value){
    			console.log("box not found");
    		}else{
    			return e.parent.parent;
    		}
    	}else{
    		return e.parent;
    	}
    }else{
    		return e;
    }
}

function children(key, e){
	if(eval("e."+key.name+"") != key.value){
		for (var i=0; i < e.children.length; i++) {
			if(eval("e.children[i]."+key.name+"") == key.value){
		  		return e.children[i];
		 	}
			for (var a=0; a < e.children[i].children.length; a++) {
			  if(eval("e.children[i].children[a]."+key.name+"") == key.value){
			  	return e.children[i].children[a];
			  }
			};
		};
    }else{
		return e;
    }
}
