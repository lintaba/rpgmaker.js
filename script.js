var ScriptEngine={
	p2Targy:function(param,obj){
		if(param.length==2){
			return Map.TargyAtPos(param[0],param[1]);
		}else 
		if(param=="ME"){
			return obj.root.Targy;
		}else 
		if(param=="CL"){
			return obj.root.CallerTargy;
		}else
		if(param=="PL"){
			return Targy.prototype.Player;
		}else
		if(isNumber(param)){
			return Targy.prototype.getById(param);
		}else{
			var x=Targy.prototype.getByName(param);
			if(x==undefined){
				exception("nem tal�ltam ilyen objektumot:");
				return obj.root.CallerTargy;}
			return x;
		}
	}
	,p2Script:function(param,obj){
		return ScriptEngine.p2Targy(param,obj);//FIXMEEEEE
	}
	,variableGet:function(arr,obj){
		var o;
		switch(arr[0]){
			case 0:o=obj.root.Targy;break;
			case 1:o=obj.root.temp;break;
			case 2:o=Targy.prototype.Player;break;
			case 3:o=obj.root.CallerTargy;break;
			case 4:o=ScriptEngine.p2Targy(arr[2]);break;
			case 5:o=Globals.session;break;
			case 6:o=Globals.autosync;break;
			case 7:o=42;break;
			case 8:o=0;exception("NOT_IMPLEMENTED:"+arr[0]);break;
			case 9:o=0;exception("NOT_IMPLEMENTED:"+arr[0]);;break;
			default:o=0;exception("script.js:41 UNKNOWN:"+arr[0]);;break;
		}
		if(o==42){
			//FIXME: Special;
		}else if(o==0){return "";}else{
			return o.getVar(arr[1]);
		}
		return false;
		
	}
	,variableSet:function(arr,val,obj){
		var o;
		switch(arr[0]){
			case 0:o=obj.root.Targy;break;
			case 1:o=obj.root.temp;break;
			case 2:o=Targy.prototype.Player;break;
			case 3:o=obj.root.CallerTargy;break;
			case 4:o=ScriptEngine.p2Targy(arr[2]);break;
			case 5:o=Globals.session;break;
			case 6:o=Globals.autosync;break;
			case 7:o=42;break;
			case 8:o=0;exception("NOT_IMPLEMENTED:"+arr[0]);break;
			case 9:o=0;exception("NOT_IMPLEMENTED:"+arr[0]);;break;
			default:o=0;exception("script.js:64 UNKNOWN:"+arr[0]);;break;
		}
		if(o==42){
			//FIXME: Special;
		}else if(o==0){return "";}else{
			return o.setVar(val);
		}
		return false;
	}
}

function script(obj,details){
	//console.log("script",obj);
	if(obj.pointer==undefined){obj.pointer=0;}
	if(obj.pointer==obj.c.length){
		call(obj.onFinish);
		obj.pointer=0;
		GAME.globalStop=false;
		return false;
	}
	var wait=1,//mennyit v�rjon a k�vetkez� utas�t�s el�tt
		sor=obj.c[obj.pointer++],//aktu�lis parancs (sor)
		params=[],paramsN=[];
	if(sor==undefined || sor.length==0){return true;}
	var paramsE=sor.slice(1),//a param�terek t�mbje
		ret=false,
		recursion=true;
	for(var i=0;i<paramsE.length;i++){
		if(isArray(paramsE[i]) && paramsE[i].length==3){//LEHET HOGY v�ltoz�
			params[i]=ScriptEngine.variableGet(paramsE[i],obj);
		}else{
			params[i]=paramsE[i];
		}
		paramsN[i]=parseInt(params[i]);
		if(isNaN(paramsN[i])){
			//exception("a sz�mm� konvert�l�s sikertelen:",sor[0],params[i],i,obj);
			paramsN[i]=0;
		}
	}
	var GP=function(n,t){//n. param�ter t t�pus�k�nt
		//scriptConfigJSON
		//textvar,Xtext,Xnumber,Xnumeric,variable,Xmultitext,logic,select,numvar,targy,color,pos
		switch(t){
			case "number":case "numeric":case "num":
				return parseInt(paramsE[n]);
			break;
			case "text":case "multitext":return ""+paramsE[n].replace(/\<*\>*/g,"")+"";break;
			case "color":return paramsE[n].toLowerCase().replace(/[^0-9a-z]*/g,"").slice(0,6);break;
			case "textvar":if(isArray(paramsE[n])){return ScriptEngine.variableGet(paramsE[n],obj);};break;
		}
	}
	//console.log("exec ",sor[0],"(",params,");//",details);
	{/* //HASZN�LHAT� PARANCSOK, 1. ablak
k	showText(message);
k	readLine(info,&variable[,maxCharacters]);
k	 return getVar(name);
k	setVar(name,value);
	showChoices(leiras,choices[],selected,var);
	inputNumber(message,variable,length);
	messageOptions(position,transparent,color);
	messageToogle(show|hide|toogle);
	readChr(var);
	wait(ms);
	comment(txt);
	ifthen(expression,true:{no:true,c:[...]},false:{no:true,c:[...]});
	loop();
	breakLoop();
	exit();
	ereaseEvent();
	call(name);
	label(name)
	jump(name);
	setFlag(name,value);
	 getFlag(name);
	//!timer(op('start'|'stop'),time(sec));
	*/}
	{/* //HASZN�LHAT� PARANCSOK, 2. ablak
	!teleport(obj|player|evt,target,mode);
	scrollMap(dir,dist,speed);
	!chgMapSettings(panorama,fog,battleback);
	!fog(r,g,b,g(ray),a(lpha),time(mennyi id� alatt v�ltson sz�nt));
	!animate(character,animation);
	move(obj,utvonal,ignore);
	!flash(r,g,b,s(trength),time);
	!shake(power,speed,time);
	!pictureAdd(num,url,origin,pos,zoom,alpha);
	!pictureMove(num,time,origin,pos,zoom,alpha);
	!pictureRotate(num,speed);
	!pictureTone(num,r,g,b,g,time);
	!pictureDel(num);
	!weather("none"|"rain"|"storm"|"snow"|...,power,time);
	*/}
	{/* //HASZN�LHAT� PARANCSOK, 3. ablak
	!battle
	!shop
	!name(char,chars);
	!hp(char|all,"inc"|"dec"|"pinc"|"pdec",num);
	!sp(char|all,"inc"|"dec"|"pinc"|"pdec",num);
	!state(char,add|rem,state);
	!recover(char);
	!xp(char|all,"inc"|"dec",num);
	!lvl(char|all,"inc"|"dec",num);
	!params(char,param(maxHP|maxSP...),inc|dec,num);
	!skill(char,add|rem,skill);
	!eqip(char,place,item);
	!setName(char,name);
	!setClass(char,class);
	!setCharset(char,cgrap,bgrap);
	!menu();
	!save();
	!gameOver();
	!titleScreen();
	*/
	}
	switch(sor[0]){
		  case "move":
				GAME.globalStop=true
				GAME.map.targyak[params[0]].move(params[1],false,function(){GAME.globalStop=false;script(obj,details);});
				recursion=false;
				//scriptEngine.p2Targy(paramsE[0],obj).move(paramsN[1],paramsN[2],function(){script(obj,details);});
				//recursion=false;
	break;case "scrollMap": //console.log("scroll",(params[0]=="down"?1:params[0]=="up"?-1:0)*paramsN[1],(params[0]=="right"?1:params[0]=="left"?-1:0)*params[1],params[2]);
			 	wait=map.mozogRel((params[0]=="down"?1:params[0]=="up"?-1:0)*paramsN[1],(params[0]=="right"?1:params[0]=="left"?-1:0)*params[1],params[2]);
	break;case "":
				
	break;case "showText":
				msg.message(params[0]);
				msg.onClose=function(){script(obj,details);};//FIXME:optimaliz�l�s(aka opt.)
				recursion=false;
	break;case "showTextTimed":
				msg.message(params[0]);
				msg.autoclose(params[1]);
				msg.onClose=function(){script(obj,details);};//FIXME:optimaliz�l�s(aka opt.)
				recursion=false;
	break;case "readLine":
				msg.read({info:params[0],max:paramsN[2]});
				msg.onClose=function(){
						ScriptEngine.variableSet(paramsE[1],msg.value,obj);
						script(obj,details);
				};//FIXME:opt.
				recursion=false;
	break;case "showChoices":
				msg.list({info:params[0],options:paramsE[1],selected:paramsN[2]});
				msg.onClose=function(){ScriptEngine.variableSet(paramsE[3],msg.value,obj);script(obj,details);}//FIXME:opt.
				recursion=false;
	break;case "inputNumber":
				msg.read({info:params[0],max:paramsN[2],type:"num"});
				msg.onClose=function(){ScriptEngine.variableSet(paramsE[1],msg.value,obj);script(obj,details);}
				recursion=false;
	break;case "messageOptions"://(position,transparent,color);
				msg.options({pos:paramsN[0],transparent:paramsN[1],color:params[2]});
	break;case "messageToogle":
				msg[params[0]=="show"?"show":params[0]=="hide"?"hide":params[0]=="toogle"?msg.visible?"hide":"show":"hide"]();
	break;case "readChr":
				keyboard.readKey(function(e){ScriptEngine.variableSet(params[0],e.keyCode,obj);script(obj,details);});
				recursion=false;
	break;case "wait":
				wait=paramsN[0];
	break;case "comment":
				console.info(params[0]);
	break;case "if"://FIXMEEEEE
				if(params[0]){
					params[1].onFinish=function(){script(obj,details);}
					script(params[1],details);
				}else{
					params[2].onFinish=function(){script(obj);}
					script(params[2],details);
				};
				recursion=false;
	break;case "loop"://FIXMEE
				params[0].onFinish=function(){if(params[0].finished==true){script(obj,details);}else{script(params[0],details);}}
				script(params[0],details);
				recursion=false;
	break;case "breakLoop"://FIXMEEE
				obj.recursion=false;
				obj.finished=true;
	break;case "exit":
				recursion=false;
	break;case "fog":// !fog(r,g,b,g(ray),a(lpha),time(mennyi id� alatt v�ltson sz�nt));
				if(GAME.map.canvas){
					GAME.map.filter("tint",[0,params[0],params[1],params[2]]);
					//GAME.map.filter_conf=[0,params[0],params[1],params[2]];
					//GAME.map.filter="tint";
					var fv=function(d,params){
						GAME.map.filter("tint",[d/100,params[0],params[1],params[2]]);
						//GAME.map.filter_conf[0]=d/100;
						//GAME.map.generate();
						//o.style.backgroundColor="rgba("+a+","+b+","+c+","+d/100+")";
					}
					for(var i=0;i<=params[5];i+=180){
						setTimeout(fv,i,params[4]*(i/params[5]),params);
					}
				}else{
				if(GAME.map.fog){var fog=GAME.map.fog;}else{var fog=GAME.map.fog=DIV(),m=GAME.map.canvas?64:0;fog.className="fog";fog.height=GAME.map.display.h*32-m;fog.width=GAME.map.display.w*32-m;document.body.appendChild(fog);fog.left=100;fog.style.position="fixed";fog.top=30;fog.style.zIndex=10000}
				var fv=function(o,a,b,c,d){
					o.style.backgroundColor="rgba("+a+","+b+","+c+","+d/100+")";
				}
				for(var i=0;i<params[5];i+=100){
					setTimeout(fv,i,fog,params[0],params[1],params[2],params[4]*(i/params[5]));
				}
				setTimeout(fv,params[5],fog,params[0],params[1],params[2],params[4]);
				document.createElement("mapContainer");
				}
				setTimeout(function(){script(obj,details);},params[5]);
				recursion=false;
	break;case "eraseEvent"://fixme:ha csak egy m�solattal dolgozunk, az eredetit is �r�tse!
				obj.c=[];
				if(obj.root){obj.root.c=[];}
				recursion=false;
	break;case "call":
				scriptEngine.p2Script(paramsE[0],obj).onFinish=function(){script(obj,details);}
				script(paramsE[0],details);
				recursion=false;
	break;case "label":
				obj.labels[params[0]]=obj.pointer-1;
	break;case "jump":
				obj.pointer=obj.labels[params[0]];
	break;case "setFlag":
				//obj.root.flags[params[0]]=params[1];
	break;case "getFlag":
				//ret=obj.root.flags[params[0]];
	break;case "getVar":
				//ret=ScriptEngine.variableGet(params[0],obj);
	break;case "setVar":
				//ScriptEngine.variableSet(params[0],params[1],obj);
	break;default:
				console.warn("nincs ilyen parancs:",sor[0]);
	break;
	}
	if(obj.ret===true && ret!=undefined){
		return ret;
	}else if(recursion){
		setTimeout(script,wait,obj,details);
		return 0;
	}else{
		return true;
	}
}



/*function script(obj){
	console.log("script",obj);
	if(obj.pointer==undefined){obj.pointer=0;}
	if(obj.pointer==obj.c.length){
		if(typeof obj.onFinish=="function"){
			obj.onFinish();
		}
		return false;
	}
	var wait=1;
	var sor=obj.c[obj.pointer++];
	var params=[];
	var ret;
	var recursion=true;
	for(var i=0;i<sor.values.length;i++){
		switch(typeof sor.values[i]){
			case "boolean":case "string":case "number":params.push(sor.values[i]);break;
			case "object":
				if(isArray(sor.values[i]) || sor.values[i].no===true){
					params.push(sor.values[i]);
				}else{
					params.push(script({ret:true,c:[sor.values[i]]}));
				};break;
			default:console.warn("ismeretlen param�tert�pus:",typeof sor.values[i],"(param�ter:",sor.values[i],"i:",i,"obj:",obj,")");break;
		}
	}
	{/* //HASZN�LHAT� PARANCSOK, 1. ablak
k	showText(message);
k	readLine(info,&variable[,maxCharacters]);
k	 return getVar(name);
k	setVar(name,value);
	showChoices(leiras,choices[],selected,var);
	inputNumber(message,variable,length);
	messageOptions(position,transparent,color);
	messageToogle(show|hide|toogle);
	readChr(var);
	wait(ms);
	comment(txt);
	ifthen(expression,true:{no:true,c:[...]},false:{no:true,c:[...]});
	loop();
	breakLoop();
	exit();
	ereaseEvent(name|'this');
	call(name);
	label(name)
	jump(name);
	setFlag(name,value);
	 getFlag(name);
	//!timer(op('start'|'stop'),time(sec));
	* /}
	{/* //HASZN�LHAT� PARANCSOK, 2. ablak
	!teleport(obj|player|evt,target,mode);
	scrollMap(dir,dist,speed);
	!chgMapSettings(panorama,fog,battleback);
	!fog(r,g,b,g(ray),a(lpha),time(mennyi id� alatt v�ltson sz�nt));
	!animate(character,animation);
	move(obj,utvonal,ignore);
	!flash(r,g,b,s(trength),time);
	!shake(power,speed,time);
	!pictureAdd(num,url,origin,pos,zoom,alpha);
	!pictureMove(num,time,origin,pos,zoom,alpha);
	!pictureRotate(num,speed);
	!pictureTone(num,r,g,b,g,time);
	!pictureDel(num);
	!weather("none"|"rain"|"storm"|"snow"|...,power,time);
	* /}
	{/* //HASZN�LHAT� PARANCSOK, 3. ablak
	!battle
	!shop
	!name(char,chars);
	!hp(char|all,"inc"|"dec"|"pinc"|"pdec",num);
	!sp(char|all,"inc"|"dec"|"pinc"|"pdec",num);
	!state(char,add|rem,state);
	!recover(char);
	!xp(char|all,"inc"|"dec",num);
	!lvl(char|all,"inc"|"dec",num);
	!params(char,param(maxHP|maxSP...),inc|dec,num);
	!skill(char,add|rem,skill);
	!eqip(char,place,item);
	!setName(char,name);
	!setClass(char,class);
	!setCharset(char,cgrap,bgrap);
	!menu();
	!save();
	!gameOver();
	!titleScreen();
	* /
	}
	switch(sor.cmd){
		  case "move":
				params[0].move(params[1],params[2],function(){script(obj);});
				recursion=false;
	break;case "scrollMap":
			 console.log("scroll",(params[0]=="down"?1:params[0]=="up"?-1:0)*params[1],(params[0]=="right"?1:params[0]=="left"?-1:0)*params[1],params[2]);
			 	wait=map.mozogRel((params[0]=="down"?1:params[0]=="up"?-1:0)*params[1],(params[0]=="right"?1:params[0]=="left"?-1:0)*params[1],params[2]);
	break;case "":
				
	break;case "":
				
	break;case "":
				
	break;case "":
				
	break;case "":
				
	break;case "":
				
	break;case "":
				
	break;case "showText":
				msg.message(params[0]);
				msg.onClose=function(){script(obj);};
				recursion=false;
	break;case "readLine":
				msg.read({info:params[0],max:params[2]});
				msg.onClose=function(){vars.set(params[1],msg.value);script(obj);};
				recursion=false;
	break;case "showChoices":
				msg.list({info:params[0],options:params[1],selected:params[2]});
				msg.onClose=function(){vars.set(params[3],msg.value);script(obj);}
				recursion=false;
	break;case "inputNumber":
				msg.read({info:params[0],max:params[2],type:"num"});
				msg.onClose=function(){vars.set(params[1],msg.value);script(obj);}
				recursion=false;
	break;case "messageOptions"://(position,transparent,color);
				msg.options({pos:params[0],transparent:params[1],color:params[2]});
	break;case "messageToogle":
				msg[params[0]=="show"?"show":params[0]=="hide"?"hide":params[0]=="toogle"?msg.visible?"hide":"show":"hide"]();
	break;case "readChr":
				keyboard.readKey(function(e){vars.set(params[0],e.keyCode);script(obj);});
				recursion=false;
	break;case "wait":
				wait=params[0];
	break;case "comment":
				console.info(params[0]);
	break;case "ifthen":
				if(params[0]){
					params[1].onFinish=function(){script(obj);}
					script(params[1]);
				}else{
					params[2].onFinish=function(){script(obj);}
					script(params[2]);
				};
				recursion=false;
	break;case "loop":
				params[0].onFinish=function(){if(params[0].finished==true){script(obj);}else{script(params[0]);}}
				script(params[0]);
				recursion=false;
	break;case "breakLoop":
				obj.recursion=false;
				obj.finished=true;
	break;case "exit":
				recursion=false;
	break;case "ereaseEvent":
				if(params[0]=="this"){
					obj.c=[];
				}else{
					params[0].c=[];
				}
				recursion=false;
	break;case "call":
				params[0].onFinish=function(){script(obj);}
				script(params[0]);
				recursion=false;
	break;case "label":
				obj.labels[params[0]]=obj.pointer-1;
	break;case "jump":
				obj.pointer=obj.labels[params[0]];
	break;case "setFlag":
				obj.flags[params[0]]=params[1];
	break;case "getFlag":
				ret=obj.flags[params[0]];
	break;case "getVar":
				ret=vars.get(params[0]);
	break;case "setVar":
				vars.set(params[0],params[1]);
	break;default:
				console.warn("NINCS ILYEN:",sor.cmd);
	break;
	}
	if(obj.ret===true && ret!=undefined){
		return ret;
	}else if(recursion){
		setTimeout(script,wait,obj);
		return 0;
	}else{
		return true;
	}
}*/
/*
function Script(){
	var tabs=[];
	this.vars={data:[],get:function(a){return this.data[a];},set:function(a,b){return this.data[a]=b;}}
	this.save=function(){return tabs.toSource();}
	this.load=function(str){tabs=str;}
	this.newTab=function(n,t){
		var ty=t?t:new Targy({});
		tabs=insertBefore(tabs,n,{
		name:tabs.length,
		condition:["locval=true","true","@globval=true"],
		image:new IMG(0),
		options:{moveAnimation:true,stopAnimation:false,dirFix:false,throught:false,aot:false},
		trigger:0,
		c:[],
		notes:"",
		targy:ty,
		movement:{type:0,speed:3,freq:3}});
		ty.script=this;
	}
	this.duplicate=function(n){
		this.newTab(n+1);
		tabs[n+1]=copy(tabs[n]);
	}
	this.removeTab=function(n){
		var x=[];
		for(var i=0;i<tabs.length;i++){
			if(i!=n){x.push(tabs[i]);}
		}
		delete tabs;
		tabs=x;
	}
	this.copyTab=function(n){
		this.copyedTab=copy(tabs[n]);
	}
	this.pasteTab=function(n){
		if(this.copyedTab!=undefined){
			tabs[n]=copy(this.copyedTab);
		}
	}
	this.clearTab=function(n){
		tabs[n].c=[];
		//console.log(tabs[n].toSource());
	}
	this.reorder=function(n,x){
		var tmp=tabs[n];
		tabs[n]=tabs[n+x];
		tabs[n+x]=tmp;
	}
	this.getTab=function(n){return tabs[n];}
	this.renameTab=function(n,x){if(x==undefined){return tabs[n].name};tabs[n].name=x;return true;}
	this.getTabNames=function(){var r=[];for(var i=0;i<tabs.length;i++){r.push(tabs[i].name);}return r;};
	this.newTab();
	this.__defineGetter__("tabLength",function(){return tabs.length;});
	this.execute=function(caller){
		var szal=copy(this.autotab().script);
		szal.obj=this;
		szal.caller=caller;
		script(szal);
	}
	this.notes="";
}
*/




/*
	name:megjelen�tend� n�v
	help:r�vid le�r�s
	varlist:v�ltoz�k list�ja, t�mb, ["t�pus|n�v",..]
	varinfo:v�ltoz� t�pusa: 0:html,1:sz�veg|v�ltoz�,2:k�vetkez� elem,3:v,5:if kifelyez�s
	def:alap�rtelmezett �rt�k(ek)
	block:ha t�bb blokkb�l �ll, akkor megmondja hanyadik param�ter melyik blokk
	blockSep:a blokkokat elv�laszt� html k�d
	post:az n�v ut�n be�rand� html
	
	varlist:
		select|n�v|x1,x2,x3,..
		numeric|n�v[|felt�telek, pl 0-100]
		color|n�v
*/
	
var scriptConfigJSON={
		showText:{name:"�zenet",help:"egy �zenet megjelen�t�se",varlist:["textvar|�zenet"],varinfo:[0],def:[""]},
		readLine:{name:"Readline",help:"egy sor beolvas�sa �s t�rol�sa",varlist:["textvar|�zenet","variable|v�ltoz�"],varinfo:[0,0],def:["",[0,""]]},
		"if":{name:"ha",help:"k�tir�ny� el�gaz�s",post:" {",block:[2,3],blockSep:["<span class=post>}</span> K�L�NBEN <span class=post>{</span>","<span class=post>}</span>"],varinfo:[5],def:[[0],{c:[]},{c:[]}]},
		getVar:{
			name:"v�ltBe",
			help:"v�ltoz� beolvas�sa",
			varlist:["variable|v�ltoz�"],
			varinfo:[0],
			def:[[0,""]]
		},
		setVar:{
			name:"v�ltKi",
			help:"v�ltoz� ki�r�sa",
			varlist:["variable|v�ltoz�"],
			varinfo:[0],
			def:[[0,""]]
		},
		showChoices:{
			name:"v�laszt�s",
			help:"v�laszt�s t�bb lehet�s�g k�z�l",
			varlist:["textvar|K�rd�s","textvar|1. lehet�s�g","textvar|2. lehet�s�g","textvar|3. lehet�s�g","textvar|4. lehet�s�g"],
			varinfo:[0,0,0,0,0],
			def:["","","","",""]
		},
		inputNumber:{
			name:"sz�m bevitel",
			help:"sz�m bevitel",
			varlist:["textvar|k�rd�s","variable|v�ltoz�"],
			varinfo:[0,0],
			def:["",[0,""]]
		},
		messageOptions:{
			name:"�zenetbe�ll�t�sok",
			help:"�zenet megjelen�t�s m�dos�t�sa (�tl�tsz�s�g, sz�n, poz�ci�)",
			varlist:["select|poz�ci�|fent|lent","numeric|�tl�tsz�s�g|0-100","color|sz�n"],
			varinfo:[0,0,0],
			def:[1,100,"0000ff"]
		},
		messageToogle:{
			name:"�zenet mutat/rejt",
			help:"�zenet ablak megjelen�t�se/elrejt�se",
			varlist:["select|utas�t�s|v�lt|megjelen�t|elrejt"],
			varinfo:[0],
			def:[0]
		},
		readChr:{
			name:"chrBe",
			help:"karakter beolvas�sa",
			varlist:["vartext|k�rd�s","variable|v�ltoz�"],
			varinfo:[0,0],
			def:["",[0,""]]
		},
		wait:{
			name:"v�r",
			help:"v�rakoz�s",
			varlist:["numeric|h�ny ms?"],
			varinfo:[0],
			def:[0]
		},
		comment:{
			name:"megjegyz�s",
			help:"",
			varlist:["text|"],
			varinfo:[0],
			def:[""]
		},
		loop:{
			name:"ciklus",
			help:"el�ltesztel�s ciklus",
			varinfo:[5],
			def:[[0],{c:[]}],
			block:[2],
			blockSep:["<span class=post>}</span>"],
			post:" {"
		},
		breakLoop:{
			name:"�lj",
			help:"ciklus v�ge",
			varlist:[],
			varinfo:[],
			def:[]
		},
		exit:{
			name:"kil�p",
			help:"fut� program v�ge",
			varlist:[],
			varinfo:[],
			def:[]
		},
		ereaseEvent:{
			name:"�nt�rl�",
			help:"az adott t�rgy aktu�lis utas�t�sait t�rli",
			varlist:["select|utas�t�s|saj�t|Touch|Action|BeforeLv|Push|AfterLv|Enter|user1|user2|user3"],
			varinfo:[0],
			def:[1]
		},
		call:{
			name:"h�v",
			help:"script megh�v�sa",
			varlist:["targy|t�rgy","select|utas�t�s|aktu�lis|Touch|Action|BeforeLv|Push|AfterLv|Enter|user1|user2|user3"],
			varinfo:[0,0],
			def:[0,0]
		},
		label:{
			name:"c�mke",
			help:"c�mke, amire lehet hivatkozni",
			varlist:["textvar|n�v"],
			varinfo:[0],
			def:[""]
		},
		jump:{
			name:"ugr�s",
			help:"ugr�s c�mk�re",
			varlist:["textvar|n�v"],
			varinfo:[0],
			def:[""]
		},
		/*setFlag:{
			name:"setFlag",
			help:"z�szl� be�ll�t�sa",
			varlist:[""],
			varinfo:[0],
			def:[""]
		},*/
		/*getFlag:{
			name:"",
			help:"",
			varlist:[""],
			varinfo:[0],
			def:[""]
		},*/
		
		teleport:{
			name:"teleport",
			help:"elteleport�l egy t�rgyat valahova",
			varlist:["targy|t�rgy","pos|poz�ci�"],
			varinfo:[1,1],
			def:[0,0]
		},
		scrollMap:{
			name:"t�rk�p scroll",
			help:"t�rk�p g�rget�se3",
			varlist:["numvar|x","numvar|x"],
			varinfo:[1,1],
			def:[0,0]
		},
		/*chgMapSettings:{
			name:"t�rk�pbe�ll�t�s",
			help:"t�rk�p be�ll�t�sok �t�ll�t�sa",
			varlist:["panorama,fog,stb."],
			varinfo:[],
			def:[]
		},*/
		fog:{
			name:"k�d",
			help:"k�d be�ll�t�sa",
			varlist:["numeric|v�r�s","num|z�ld","num|k�k","num|sz�rke","num|�ttetsz�","num|id�"],
			varinfo:[0,0,0,0,0,0],
			def:[0,0,0,0,0,0]
		},
		/*animate:{
			name:"",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},*/
		move:{
			name:"mozgat",
			help:"egy t�rgy �tvonalon val� mozgat�sa",
			varlist:["targy|t�rgy","textvar|mozg�sp�lya"],
			varinfo:[0,0],
			def:[0,""]
		},
		flash:{
			name:"villant",
			help:"felvillantja a t�rk�pen a megadott sz�nt",
			varlist:["num|v�r�s","num|z�ld","num|k�k","num|sz�rke","num|�ttetsz�","num|id�"],
			varinfo:[0,0,0,0,0,0],
			def:[0,0,0,0,0,0]
		},
		shake:{
			name:"r�z",
			help:"a t�rk�p r�z�sa",
			varlist:["num|er�","num|sebes�g","num|id�"],
			varinfo:[0,0,0],
			def:[0,0,0]
		},
		pictureAdd:{
			name:"k�p nyit",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		pictureMove:{
			name:"k�p mozgat",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		pictureRotate:{
			name:"k�p forgat",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		pictureTone:{
			name:"k�p t�nus",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		pictureDel:{
			name:"k�p t�rl�s",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		weather:{
			name:"id�j�r�s",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		
		battle:{},
		shop:{},
		name:{},
		hp:{},
		sp:{},
		state:{},
		recover:{},
		xp:{},
		lvl:{},
		params:{},
		skill:{},
		eqip:{},
		setName:{},
		setClass:{},
		setCharset:{},
		menu:{},
		save:{},
		gameOver:{},
		titleScreen:{}
	};
