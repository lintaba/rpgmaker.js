interface Prototargy(){
	public type={unique|clone|twin}
	public image of IMG;
	public events [Touch,Action,BeforeLeave,Push,AfterLeave,Enter] of Script default null;
}
interface Targy(defaultData of JSON) inherits Prototargy{
	public function setData(data of JSON);
	public function move(irany,ignore,onFinish);
	public for private function chain(that,items,ignore,onFinish);
	private updateImage();
	public function destroy();
	
	public variables of Variables;
}