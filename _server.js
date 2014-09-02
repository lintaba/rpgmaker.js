
interface Variables(){
	public localVar;
		public get(name of string);
		public set(name of string,value of mixed);
		public list([newlist of AssocArray of mixed]);
	public remoteVar;
		public get(name of string);
		public set(name of string,value of mixed);
		public list([newlist of AssocArray of mixed]);
	public globalVar;
		public get(name of string);
		public set(name of string,value of mixed);
		public list([newlist of AssocArray of mixed]);
}
interface server(){
	public function syn();//called in every pulse
	public function change(obj,data,value);
	
	public variables of Variables;
	
	public config{
		reloadSpeed
		gameSpeed
		
	}
}
