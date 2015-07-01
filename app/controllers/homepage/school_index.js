$.table_list.addEventListener('click', function(e){
	var win = Alloy.createController('/school/index').getView();
	openNewWindow(win, true);
});
