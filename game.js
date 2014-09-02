// ize#game.js by lintabá (copyright), 2010
var GAME={};
IRANY={LE:3,FEL:0,BAL:1,JOBB:2};
function getCharsetData(i){
	if(i==0){return {src:"",w:0,h:0,name:"-"};}
	var t=GAME.data.charsets[i];
	if(t==undefined){exception("getCharData nem talált semmit erre:"+i);return;}
	var r={src:"char/"+(i<10?"00":i<100?"0":"")+i+"-"+t[2]+".png",w:t[0]*32,h:t[1]*32,name:t[2]};
	return r;
}

var Variables=function(){
	if(this==window){console.warn("ERROR");return;}
	this.local={vars:[]};
	this.global={vars:[]};
	this.remote={vars:[]};
	function get(name){return vars[name];}
	function set(name,value){vars[name]=value;}
	this.local.get=get;
	this.local.set=set;
	this.global.get=get;
	this.global.set=set;
	this.remote.get=get;
	this.remote.set=set;
};

var color=new function(){
	function dec2hex(n){if(n>255){return "FF";};if(n<0){return "00";}var b,r;r=n%16;b=(n-r)/16;b=b<10?b:'ABCDEF'[b-10];return r<10?"".concat(b,r):"".concat(b,'ABCDEF'[r-10]);}
	function hex2dec(n){n=parseInt(n,16);return n>255?255:n<0?0:n;}
	function hexa2rgb(str){return [parseInt(str[0].concat(str[1]),16),parseInt(str[2].concat(str[3]),16),parseInt(str[4].concat(str[5]),16)];}
	function rgb2hexa(tmb){return "".concat(dec2hex(tmb[0]),dec2hex(tmb[1]),dec2hex(tmb[2]));}
	function rgb(x){return isArray(x) ? x : hexa2rgb(x)};
	function hex(x){return isArray(x) ? rgb2hexa(x) : x};
	
	this.light=function(color,percent){
		color=rgb(color);
		for(var i=0;i<3;i++){
			color[i]+=Math.round(color[i]*percent/100);
		}
		return hex(color);
	}
	this.dark=function(color,percent){
		color=rgb(color);
		for(var i=0;i<3;i++){
			color[i]-=Math.round(color[i]*percent/100);
		}
		return hex(color);
	}
	this.avg=function(color1,color2){
		color1=rgb(color1);
		color2=rgb(color2);
		for(var i=0;i<3;i++){
			color1[i]=Math.floor((color1[i]+color2[i])/2);
		}
		return hex(color1);
	}
	this.inv=function(color){
		color=rgb(color);
		for(var i=0;i<3;i++){
			color[i]=255-color[i];
		}
		return hex(color);
	}
}

var msg=new function(){
	this.visible=false;
	var obj=document.createElement("div");
		obj.id="msg";
	this.mod="none";
	this.visible=false;
	this.value="";
	this.keret=document.createElement("div");
	this.keret.className="messageBox";
	document.body.appendChild(this.keret);
	this.reset=function(){obj.innerHTML="";this.mod="none";this.value="";};
	this.onClose=function(){};
	this.show=function(){if(!this.visible){this.keret.appendChild(obj);this.visible=true;keyboard.focus(msg);GAME.globalStop=true;}};
	this.hide=function(){if(this.visible){this.keret.removeChild(obj);this.visible=false;keyboard.blur();}};
	this.options=function(data){
		this.obj.top=data.pos=="top"?0:340;
		this.obj.alpha=data.transparent;
		this.obj.color=data.color;
		this.obj.style.borderColor=color.light(data.color,20);
	}
	this.message=function(x){
		this.reset();
		obj.innerHTML=x;
		this.show();
		};
	this.read=function(data){
		var div,input;
		this.reset();
		div=DIV();
		div.innerHTML=typeof data.info=="string"?data.info:"";
		this.data=data;
		input=document.createElement("input");
		div.appendChild(input);
		this.input=input;
		input.className="input";
		input.setAttribute("maxlength",data.max?data.max:data.type=="num"?6:20);
		input.focus();
		this.mod="read";
		obj.appendChild(div);
		this.show();
	}
	this.list=function(data){
		var div,opt,sor,i;
		this.reset();
		div=DIV();
		if(data.options!==undefined && data.options.length>0){
			div.innerHTML=typeof data.info=="string"?data.info:"";
			this.selects=[];
			var f=function(){return function(e){
					if(msg.selects[msg.selected]==e.target){
						msg.select();
					}else{
						msg.sel(e.target.i);
					}
				};};
			for(var i=0;i<data.options.length;i++){
				sor=DIV();
				sor.innerHTML=data.options[i];
				sor.className="selectable";
				div.appendChild(sor);
				this.selects[i]=sor;
				sor.i=i;
				sor.addEventListener("click",f(),true);
				if(i>4){sor.hide();}
			}
			this.selected=typeof data.selected=="number"?data.selected:0;
			this.selects[this.selected].className="selectable selected";
			this.mod="list"
		}
		obj.appendChild(div);
		this.show();
	};
	this.sel=function(n){
		this.selects[this.selected].className="selectable";
		if(n>=this.selects.length){n=0;}
		if(n<0){n=this.selects.length-1;}
		this.selects[n].className="selectable selected";
		this.selected=n;
		var l=this.selects.length
		if(l>3){
			for(var i=0;i<l;i++){
				if(n<i+4){
					this.selects[i].show()
				}else{
					this.selects[i].hide();
				}
			}
		}
	};
	this.close=function(){
		this.hide();
		this.reset();
		this.onClose();
	}
	this.key=function(op,e,evt){
		if(op=="DOWN" && msg.mod=="list"){
			
			if(keyboard.binds.down.inArray(e)){
				msg.sel(msg.selected+1);
			}else if(keyboard.binds.up.inArray(e)){
				msg.sel(msg.selected-1);
			}
			msg.value=msg.selected;
			
		}else
		if(op=="DOWN" && msg.mod=="read"){
			msg.input.focus();
			if(keyboard.binds.action.inArray(e)){
				if(typeof msg.data.action=="function"){
					msg.onClose=msg.data.action;
				}
				msg.close();
			}
		}else
		if(op=="UP" && msg.mod=="read"){
			if(msg.data.type=="num"){msg.input.value=isNaN(parseInt(msg.input.value))?0:parseInt(msg.input.value);}else
			if(msg.data.type=="upper"){msg.input.value=msg.input.value.toUpperCase();}else
			if(msg.data.type=="lower"){msg.input.value=msg.input.value.toLowerCase();}
			msg.value=msg.input.value;
		}
		if(op=="DOWN" && keyboard.binds.action.inArray(e)){
			msg.close();
		}
	};
	this.autoclose=function(t){
		setTimeout(function(){msg.close();},t);
	}
};
var keyboard={
	focusedItem:{key:function(){}},
	focusedHistory:[],
	disabled:false,
	binds:{"up":[38,87],"down":[40,83],"left":[37,65],"right":[39,68],"action":[13,32],"esc":[27],"9":[81]},
	keys:{	8:"backspace",9:"tab",12:"num5",13:"enter",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"cpLck",27:"esc",
			32:"space",33:"PgUp",34:"PgDn",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",44:"PrSc",
			45:"Ins",46:"del",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:"É",61:"Ó",
			65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",
			80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"wnKy",94:"trnOff",
			95:"slp",96:"num0",97:"num1",98:"num2",99:"num3",100:"num4",101:"num5",102:"num6",103:"num7",104:"num8",
			105:"num9",106:"num*",107:"num+",109:"num-",110:"num,",111:"num/",112:"F1",113:"F2",114:"F3",115:"F4",
			116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"nmLck",
			172:"www",180:"mail",192:"ö",191:"ü",221:"ú",222:"á",220:"û",226:"í",219:"õ"},
	focus:function(item){this.focusedHistory.push(item);this.focusedItem=item;},
	blur:function(item){if(item==undefined || item==this.focusedItem){this.focusedHistory.pop();this.focusedItem=this.focusedHistory[this.focusedHistory.length-1] || {key:function(){}};this.disabled=true;setTimeout(function(){keyboard.disabled=false;},50);}},
	readKey:function(callback){this.key_reading=callback;},
	extendEvent:function(e){
		e.isUp=keyboard.binds.up.inArray(e.keyCode);
		e.isDown=keyboard.binds.down.inArray(e.keyCode);
		e.isLeft=keyboard.binds.left.inArray(e.keyCode);
		e.isRight=keyboard.binds.right.inArray(e.keyCode);
		e.isEnter=keyboard.binds.action.inArray(e.keyCode);
		e.isEsc=keyboard.binds.esc.inArray(e.keyCode);
		return e;
	},
	pressed:{keyCode:0},
	pressedKeys:[],
	isPressed:function(key){
		if(this.binds[key]!=undefined){
			for(var i=0;i<this.binds[key].length;i++){
				if(this.pressedKeys[this.binds[key][i]]==true){
					return true;
				}
			}
			return false;
		}
		return this.pressedKeys[key]==true;
	},
	down:function(e){
		e=this.extendEvent(e);
		if(keyboard.disabled){return;}
		this.pressed=e;
		this.pressedKeys[this.keys[e.keyCode]]=true;
		this.pressedKeys[e.keyCode]=true;
		if(typeof this.focusedItem.key=="function"){
			this.focusedItem.key("DOWN",e.keyCode,e);
		}else{
			console.log("unbinded DOWN",e);
		}
	},
	up:function(e){
		e=this.extendEvent(e)
		if(keyboard.disabled){return;}
		this.pressedKeys[this.keys[e.keyCode]]=false;
		this.pressedKeys[e.keyCode]=false;
		if(typeof this.focusedItem.key=="function"){
			this.focusedItem.key("UP",e.keyCode,e);
		}else{
			console.log("unbinded UP",e);
		}
		this.press(e);
	},
	press:function(e){
		e=this.extendEvent(e)
		if(keyboard.disabled){return;}
		if(keyboard.key_reading){keyboard.key_reading(e);keyboard.key_reading=undefined;}else
		if(e.keyCode==this.pressed.keyCode && typeof this.focusedItem.key=="function"){
			this.focusedItem.key("PRESS",e.keyCode,e);
		}
	},
	init:function(){
		//var el=document.createElement("button");
		//el.focused=false;
		//document.body.appendChild(el);
		//el.addEventListener("blur",function(){GAME.map.filter="grayscale";if(this.focused){setTimeout(function(a){a.focus();},0,this)}},false);
		//el.addEventListener("focus",function(){GAME.map.filter=false},false);
		document.addEventListener("keydown",function(e){keyboard.down(e);e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation();},false);
		document.addEventListener("keyup",  function(e){keyboard.up  (e);e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation();},false);
		//document.body.addEventListener("focus",function(){el.focus();},false);
		//document.body.addEventListener("click",function(){el.focus();console.log(el)},false);
		//el.focus();
	}
};

var specialObject={
	multiFocus:function(items){//egyszerre több objektum irányítható ezzel
		this.multiFocusItems=items;
		keyboard.focus(this);
	},
	key:function(a,b,c){
		for(var i=0;i<specialObject.multiFocusItems.length;i++){setTimeout(specialObject.multiFocusItems[i],0,a,b,c);}
	}
}
function emptyScript(){
	return {c:[]};
}
function Targy(data){
	this.toString=function(){return "T"+this.insertedIDatMap}
	this._="";
	var map=GAME.map;
	map.addTargy(this,data);//var bHtmlObj=DIV();
	var that=this;
	this.onTouch	=emptyScript();//ha valaki "akciózik" felé
	this.onAction	=emptyScript();//ha valaki "akciózik" rajta
	this.onBeforeLv	=emptyScript();//ha valaki elhagyJa (MEGSZAKÍTHATÓ) (1)
	this.onPush		=emptyScript();//ha valaki elindul felé. (MEGSZAKÍTHATÓ) (2)
	this.onAfterLv	=emptyScript();//ha valaki elhagyTa (3)
	this.onEnter	=emptyScript();//ha valaki rááll. (4)
	this.onuser1	=emptyScript();
	this.onuser2	=emptyScript();
	this.onuser3	=emptyScript();
	
	this.mozog=false;
	this.speed=100;//FIXME
	this.isset=true;
	this.image=new IMG();
	this.image.owner=this;
	this.updateData=function(data){
		var defaultData={
				name:"(névtelen)",
				level:0,
				controllable:false,
				//charset:{url:"char/001-Fighter01.png",x:0,y:0,h:0,w:0},
				charsetNum:0,
				pos:{x:0,y:0},
				alpha:100,
				canFly:false,
				canSwim:false,
				canWalk:true,
				status:"normal",
				hp:1,
				mp:1,
				items:[],
				skills:[],
				abilitys:[],
				stats:[],
				speed:1,
				irany:0,//ULRD
				jarhato:false,
				anim:0,//animálciós fázis
				ghost:false,//átmehet mindenen
				evt:{}
			}
		if(this.C==undefined){this.C=defaultData;}
		for(var item in data){
			this.C[item]=data[item]
		}
		for(var e in data.evt){
			this["on"+e]=data.evt[e];
		}
		this.image.src=getCharsetData(this.C.charsetNum).url;
		this.update()
	}
	this.move=function(irany,ignore,onFinish){//tömb
		//példa: ["down","up","jump:2:2","switch:ON:42"];
		if(this.mozog){return;}this.mozog=true;
		this.chain(this,irany,ignore?ignore:true,onFinish);
	}
	this.chain=function(that,items,ignore,onFinish){
		if(items.length==0){that.mozog=false;if(isFunction(onFinish)){onFinish()};return;}
		var item,action,time,pos1,pos2,irany1,irany2;
		pos1=copy(that.pos);
		pos2=copy(that.pos);
		irany1=that.irany;
		irany2=that.irany;
		item=items.shift();
		action=0;
		time=1;
		//{M:[u,d,l,r,7,9,1,3,f,b],J:"?:?",G:"?:?",T:[d(own),u(p),l(eft),r(ight),L(eft 90),R(ight 90),t(urn 180),s(el l/r),(ra)n(dom)]}
		switch(item[0]){//paraméter nélküliek
			case "M":
				var a={"u":[-1,0,0],"d":[1,0,3],"l":[0,-1,1],"r":[0,1,2],"7":[-1,-1,1],"9":[-1,1,2],"1":[1,-1,1],"3":[1,1,2]}[item[1]]
				if(a==undefined && (item[1]=="f" || item[1]=="b")){//elõre(f)/hátra(b)
					var a=[0,0,irany1]
					switch(irany1){
						case 0:a[0]--;break;
						case 1:a[1]--;break;
						case 2:a[1]++;break;
						case 3:a[0]++;break;
						default:console.warn("HIBA:ismeretlen irány(",irany1,")");break;
					}
					if(item[1]=="b"){a[0]*=-1;a[1]*=-1;}
				}
				if(a==undefined || a.length==0){console.warn("HIBA:move.<",item[1],"> nem ismert!");break;}
				pos2.x=pos1.x+a[1];
				pos2.y=pos1.y+a[0];
				irany2=a[2];
				action="move";
				if(ignore!=2 && !map.isJarhato(pos2.x,pos2.y)){action="turn";}
				time=10000/that.speed;
			break;
			case "J":case "G":
				var a=item.slice(2).split(":");
				if(item[0]=="J"){
					pos2.x=parseInt(pos1.x)+parseInt(a[0]);
					pos2.y=parseInt(pos1.y)+parseInt(a[1]);
				}else{
					pos2.x=parseInt(a[0]);
					pos2.y=parseInt(a[1]);
				}
				irany2=irany1;//FIXME
				action="move";
				time=10000/that.speed;
			break;
			case "T": 
				switch(item[1]){
					case "d":irany2=3;break;
					case "u":irany2=0;break;
					case "l":irany2=1;break;
					case "r":irany2=2;break;
					case "L":irany2=[1,3,0,2][irany1];break;
					case "R":irany2=[2,0,3,1][irany1];break;
					case "t":irany2=[3,2,1,0][irany1];break;
					case "s":irany2=randomSelect([[1,2],[0,3],[0,3],[1,2]][irany1]);break;
					case "n":irany2=randomSelect([0,1,2,3]);break;
				}
				time=100;
				action="turn";
			break;
			case "A":
				switch(item[1]){
					case "0":that.anim=0;break;
					case "1":that.anim=1;break;
					case "2":that.anim=2;break;
					case "3":that.anim=3;break;
					case "+":that.anim=(that.anim+1)%5;break;
					case "-":that.anim=(that.anim+4)%5;break;
				}
				time=50;
				action="wait";
			break;
			case "S":
				//move animation ON/OFF, stop animation ON/OFF, direction fix ON/OFF, throught ON/OFF, always on top ON/OFF, 
				that.set(item[1],item[2]);//FIXME
				action="wait";
			break;
			case "W":
				action="wait";
				time=parseInt(item.slice(1));
			break;
			default:console.warn("UNKOWN HANDLER:",item);break;
		}
		if(action=="move"){
			if(pos1.x==pos2.x && pos1.y==pos2.y){action="wait";}
			//célnál lévõ objektumok
			var ojc=map.keresTargy(pos2,that);
			var ojs=map.keresTargy(pos1,that);
			//precheck
			for(var i=0;i<ojs.length;i++){if(call(ojs[i].onBeforeLv,{owner:that,evt:ojs[i],type:"onBeforeLv"})=="STOP"){action="turn";}}
			for(var i=0;i<ojc.length;i++){if(call(ojc[i].onPush,{owner:that,evt:ojc[i],type:"onPush"})=="STOP"){action="turn";}}
		}
		if(action=="move"){
			///move
			var pulzus=Math.round(time/10);
			//FIXME: lépések(animálció)
			var fv=function(){return function(o,t,a){o.C.anim=a;o.pos=t;}};
			for(var i=0;i<pulzus;i++){
				setTimeout(fv(),i*10,that,{x:(pos2.x-pos1.x)*i/pulzus+pos1.x , y:(pos2.y-pos1.y)*i/pulzus+pos1.y},Math.floor((i%16)/4));
			}
			setTimeout(fv(),time-1,that,{x:pos2.x , y:pos2.y},0);
			setTimeout(function(t){if(t.C.alwaysOnMap){map.positionateByTargy(t,3);}},time+1,that);
			///postcheck
			for(var i=0;i<ojs.length;i++){call(ojs[i].onAfterLv,{owner:that,evt:ojs[i],type:"onAfterLv"});}
			for(var i=0;i<ojc.length;i++){call(ojc[i].onEnter,{owner:that,evt:ojc[i],type:"onEnter"});}
			action="turn";
		}
		if(action=="turn"){
			that.irany=irany2;
			action="wait";
		}
		if(action=="wait"){
			setTimeout(that.chain,time,that,items,ignore,onFinish);
		}
	}
	
	this.key=function(evt,e){
		if(this.mozog){return;}
		var a="";
		if(keyboard.isPressed("down")){a="Md";}else
		if(keyboard.isPressed("right")){a="Mr";}else
		if(keyboard.isPressed("up")){a="Mu";}else
		if(keyboard.isPressed("left")){a="Ml";}else
		if(keyboard.isPressed("9")){a="M9";}else
		if(keyboard.isPressed("action")){that.action();return;}else
		{return;}
		this.move([a],true,function(){if(GAME.globalStop!=true){that.key();}});
	}
	this.action=function(){
		var ojs,os;
		ojs=map.keresTargy(this.pos,this);
		for(os in ojs){if(ojs[os].onAction!=null){call(ojs[os].onAction,{owner:that,evt:ojs[i],type:"onAction"});}}
		var p={x:this.pos.x+(this.irany==1?-1:this.irany==2?1:0),y:this.pos.y+(this.irany==0?-1:this.irany==3?1:0)};
		ojs=map.keresTargy(p,this);
		for(os in ojs){if(ojs[os].onTouch!=null){call(ojs[os].onTouch,{owner:that,evt:ojs[i],type:"onTouch"});}}
		delete ojs;
	}
	this.update=function(){
		//chipset beállítása
		map.updateTargy(this);
		/*var charset=this.C.charset;
		var pos=this.C.pos
		bHtmlObj.imageUrl=charset.url;
		bHtmlObj.height=charset.h;
		bHtmlObj.width=charset.w;
		bHtmlObj.imagePos=[charset.y*charset.w+charset.w*this.C.anim,charset.x*charset.h+this.C.irany*charset.h];
		bHtmlObj.top=pos.x*32-(charset.h-32);
		bHtmlObj.left=pos.y*32;
		bHtmlObj.alpha=this.C.alpha;*/
	}
	this.__defineGetter__("pos",function(){return this.C.pos;});
	this.__defineSetter__("pos",function(_){this.C.pos=_;map.updateTargy(this,"pos")});
	this.__defineGetter__("irany",function(){return this.C.irany;});
	this.__defineSetter__("irany",function(_){this.C.irany=_;map.updateTargy(this,"img");});
	this.__defineGetter__("anim",function(){return this.C.anim;});
	this.__defineSetter__("anim",function(_){this.C.anim=_;map.updateTargy(this,"img");});
	this.__defineGetter__("name",function(){return this.C.name;});
	this.__defineSetter__("name",function(_){this.C.name=_;});
	this.__defineSetter__("charset",function(_){charset=_;this.update();});
	this.updateData(data);
	this.vars={
		data:[],
		get:function(a){return this.data[a];},
		set:function(a,b){return this.data[a]=b;}
	}
	this.destruct=function(){
		this.isset=false;
		map.removeTargy(this);
		for(var i in that){
			delete that[i];
		}
		delete that;
	}
}



loader.onLoadJs=init;