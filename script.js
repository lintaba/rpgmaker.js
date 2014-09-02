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
				exception("nem találtam ilyen objektumot:");
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
	var wait=1,//mennyit várjon a következõ utasítás elött
		sor=obj.c[obj.pointer++],//aktuális parancs (sor)
		params=[],paramsN=[];
	if(sor==undefined || sor.length==0){return true;}
	var paramsE=sor.slice(1),//a paraméterek tömbje
		ret=false,
		recursion=true;
	for(var i=0;i<paramsE.length;i++){
		if(isArray(paramsE[i]) && paramsE[i].length==3){//LEHET HOGY változó
			params[i]=ScriptEngine.variableGet(paramsE[i],obj);
		}else{
			params[i]=paramsE[i];
		}
		paramsN[i]=parseInt(params[i]);
		if(isNaN(paramsN[i])){
			//exception("a számmá konvertálás sikertelen:",sor[0],params[i],i,obj);
			paramsN[i]=0;
		}
	}
	var GP=function(n,t){//n. paraméter t típusúként
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
	{/* //HASZNÁLHATÓ PARANCSOK, 1. ablak
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
	{/* //HASZNÁLHATÓ PARANCSOK, 2. ablak
	!teleport(obj|player|evt,target,mode);
	scrollMap(dir,dist,speed);
	!chgMapSettings(panorama,fog,battleback);
	!fog(r,g,b,g(ray),a(lpha),time(mennyi idõ alatt váltson színt));
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
	{/* //HASZNÁLHATÓ PARANCSOK, 3. ablak
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
				msg.onClose=function(){script(obj,details);};//FIXME:optimalizálás(aka opt.)
				recursion=false;
	break;case "showTextTimed":
				msg.message(params[0]);
				msg.autoclose(params[1]);
				msg.onClose=function(){script(obj,details);};//FIXME:optimalizálás(aka opt.)
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
	break;case "fog":// !fog(r,g,b,g(ray),a(lpha),time(mennyi idõ alatt váltson színt));
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
	break;case "eraseEvent"://fixme:ha csak egy másolattal dolgozunk, az eredetit is ûrítse!
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
			default:console.warn("ismeretlen paramétertípus:",typeof sor.values[i],"(paraméter:",sor.values[i],"i:",i,"obj:",obj,")");break;
		}
	}
	{/* //HASZNÁLHATÓ PARANCSOK, 1. ablak
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
	{/* //HASZNÁLHATÓ PARANCSOK, 2. ablak
	!teleport(obj|player|evt,target,mode);
	scrollMap(dir,dist,speed);
	!chgMapSettings(panorama,fog,battleback);
	!fog(r,g,b,g(ray),a(lpha),time(mennyi idõ alatt váltson színt));
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
	{/* //HASZNÁLHATÓ PARANCSOK, 3. ablak
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
	name:megjelenítendõ név
	help:rövid leírás
	varlist:változók listája, tömb, ["típus|név",..]
	varinfo:változó típusa: 0:html,1:szöveg|változó,2:következõ elem,3:v,5:if kifelyezés
	def:alapértelmezett érték(ek)
	block:ha több blokkból áll, akkor megmondja hanyadik paraméter melyik blokk
	blockSep:a blokkokat elválasztó html kód
	post:az név után beírandó html
	
	varlist:
		select|név|x1,x2,x3,..
		numeric|név[|feltételek, pl 0-100]
		color|név
*/
	
var scriptConfigJSON={
		showText:{name:"Üzenet",help:"egy üzenet megjelenítése",varlist:["textvar|Üzenet"],varinfo:[0],def:[""]},
		readLine:{name:"Readline",help:"egy sor beolvasása és tárolása",varlist:["textvar|Üzenet","variable|változó"],varinfo:[0,0],def:["",[0,""]]},
		"if":{name:"ha",help:"kétirányú elágazás",post:" {",block:[2,3],blockSep:["<span class=post>}</span> KÜLÖNBEN <span class=post>{</span>","<span class=post>}</span>"],varinfo:[5],def:[[0],{c:[]},{c:[]}]},
		getVar:{
			name:"váltBe",
			help:"változó beolvasása",
			varlist:["variable|változó"],
			varinfo:[0],
			def:[[0,""]]
		},
		setVar:{
			name:"váltKi",
			help:"változó kiírása",
			varlist:["variable|változó"],
			varinfo:[0],
			def:[[0,""]]
		},
		showChoices:{
			name:"választás",
			help:"választás több lehetõség közül",
			varlist:["textvar|Kérdés","textvar|1. lehetõség","textvar|2. lehetõség","textvar|3. lehetõség","textvar|4. lehetõség"],
			varinfo:[0,0,0,0,0],
			def:["","","","",""]
		},
		inputNumber:{
			name:"szám bevitel",
			help:"szám bevitel",
			varlist:["textvar|kérdés","variable|változó"],
			varinfo:[0,0],
			def:["",[0,""]]
		},
		messageOptions:{
			name:"üzenetbeállítások",
			help:"üzenet megjelenítés módosítása (átlátszóság, szín, pozíció)",
			varlist:["select|pozíció|fent|lent","numeric|átlátszóság|0-100","color|szín"],
			varinfo:[0,0,0],
			def:[1,100,"0000ff"]
		},
		messageToogle:{
			name:"üzenet mutat/rejt",
			help:"üzenet ablak megjelenítése/elrejtése",
			varlist:["select|utasítás|vált|megjelenít|elrejt"],
			varinfo:[0],
			def:[0]
		},
		readChr:{
			name:"chrBe",
			help:"karakter beolvasása",
			varlist:["vartext|kérdés","variable|változó"],
			varinfo:[0,0],
			def:["",[0,""]]
		},
		wait:{
			name:"vár",
			help:"várakozás",
			varlist:["numeric|hány ms?"],
			varinfo:[0],
			def:[0]
		},
		comment:{
			name:"megjegyzés",
			help:"",
			varlist:["text|"],
			varinfo:[0],
			def:[""]
		},
		loop:{
			name:"ciklus",
			help:"elöltesztelõs ciklus",
			varinfo:[5],
			def:[[0],{c:[]}],
			block:[2],
			blockSep:["<span class=post>}</span>"],
			post:" {"
		},
		breakLoop:{
			name:"álj",
			help:"ciklus vége",
			varlist:[],
			varinfo:[],
			def:[]
		},
		exit:{
			name:"kilép",
			help:"futó program vége",
			varlist:[],
			varinfo:[],
			def:[]
		},
		ereaseEvent:{
			name:"öntörlõ",
			help:"az adott tárgy aktuális utasításait törli",
			varlist:["select|utasítás|saját|Touch|Action|BeforeLv|Push|AfterLv|Enter|user1|user2|user3"],
			varinfo:[0],
			def:[1]
		},
		call:{
			name:"hív",
			help:"script meghívása",
			varlist:["targy|tárgy","select|utasítás|aktuális|Touch|Action|BeforeLv|Push|AfterLv|Enter|user1|user2|user3"],
			varinfo:[0,0],
			def:[0,0]
		},
		label:{
			name:"címke",
			help:"címke, amire lehet hivatkozni",
			varlist:["textvar|név"],
			varinfo:[0],
			def:[""]
		},
		jump:{
			name:"ugrás",
			help:"ugrás címkére",
			varlist:["textvar|név"],
			varinfo:[0],
			def:[""]
		},
		/*setFlag:{
			name:"setFlag",
			help:"zászló beállítása",
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
			help:"elteleportál egy tárgyat valahova",
			varlist:["targy|tárgy","pos|pozíció"],
			varinfo:[1,1],
			def:[0,0]
		},
		scrollMap:{
			name:"térkép scroll",
			help:"térkép görgetése3",
			varlist:["numvar|x","numvar|x"],
			varinfo:[1,1],
			def:[0,0]
		},
		/*chgMapSettings:{
			name:"térképbeállítás",
			help:"térkép beállítások átállítása",
			varlist:["panorama,fog,stb."],
			varinfo:[],
			def:[]
		},*/
		fog:{
			name:"köd",
			help:"köd beállítása",
			varlist:["numeric|vörös","num|zöld","num|kék","num|szürke","num|áttetszõ","num|idõ"],
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
			help:"egy tárgy útvonalon való mozgatása",
			varlist:["targy|tárgy","textvar|mozgáspálya"],
			varinfo:[0,0],
			def:[0,""]
		},
		flash:{
			name:"villant",
			help:"felvillantja a térképen a megadott színt",
			varlist:["num|vörös","num|zöld","num|kék","num|szürke","num|áttetszõ","num|idõ"],
			varinfo:[0,0,0,0,0,0],
			def:[0,0,0,0,0,0]
		},
		shake:{
			name:"ráz",
			help:"a térkép rázása",
			varlist:["num|erõ","num|sebeség","num|idõ"],
			varinfo:[0,0,0],
			def:[0,0,0]
		},
		pictureAdd:{
			name:"kép nyit",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		pictureMove:{
			name:"kép mozgat",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		pictureRotate:{
			name:"kép forgat",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		pictureTone:{
			name:"kép tónus",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		pictureDel:{
			name:"kép törlés",
			help:"",
			varlist:[""],
			varinfo:[],
			def:[]
		},
		weather:{
			name:"idõjárás",
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
