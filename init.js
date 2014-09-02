var init={};
init.init=function(){
	init.LOAD_JS();
	init.LOAD_IMG();
	init.SHOW_INIT_WINDOW();
}
init.SHOW_INIT_WINDOW=function(){
	w=window();
	w.button("tervezõ nézet",init.MODE_1);
	w.button("szerkesztõ nézet",init.MODE_2);
	w.button("játék nézet",init.MODE_3);
	w.button("moderátor nézet",init.MODE_4);
}
init.MODE_1=function(){
	init.SHOW_OPTIONS_WINDOW();
}
init.SHOW_OTIONS_WINDOW=function(){
	w=window();
	w.input("játék neve");
}
init.MODE_2=function(){
	init.SHOW_OBJECT_TREE_WINDOW();
	init.SHOW_OBJECT_EDITOR_WINDOW();
	init.SHOW_OBJECT_INSERT_WINDOW();
	init.SHOW_MAP();
}
init.MODE_3=function(){
	init.SHOW_MAP();
	keyboard.assign(map.getPlayer());
}
init.MODE_4=function(){
	init.SHOW_MAP();
	keyboard.assign(map.getPlayer());
	init.SHOW_MODERATOR_INTERFACE();
}