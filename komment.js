/*kommentált kódok, amik akár még kellhetnek is*/

/*core.js*/

/*
Object.prototype.copy=function(reclvl){
	reclvl=reclvl==undefined?0:reclvl+1;
	if(reclvl>20){return null;}
	var newObj=(this instanceof Array)?[]:{};
	for(var i in this){
		if(i=='copy'){continue;}
		if(this[i] && typeof this[i]=="object"){
			newObj[i]=this[i].copy(reclvl);
		}else newObj[i]=this[i]
	}
	return newObj;
};*/

//document.createElement("input").__proto__={get innerHTML(){return this.value;},set innerHTML(_){this.value=_;}}
//document.createElement("textarea").__proto__={get value(){return this.textContent;},set value(_){this.textContent=_;}}
/*HTMLElement.prototype={
//DIV().__proto__.__proto__.__proto__={
	set height(_){if(isNaN(_)){console.warn("NaN height",_,this);return};this.style.height=_+"px"},
	get height(){return parseInt(this.style.height);},
	set width(_){if(isNaN(_)){console.warn("NaN width",_,this);return};this.style.width=_+"px"},
	get width(){return parseInt(this.style.width);},
	set top(_){if(isNaN(_)){console.warn("NaN top",_,this);return};this.style.top=_+"px"},
	get top(){return parseInt(this.style.top);},
	set left(_){if(isNaN(_)){console.warn("NaN left",_,this);return};this.style.left=_+"px"},
	get left(){return parseInt(this.style.left);},
	set imageUrl(_){if(this.imageUrl!=_){this.style.backgroundImage="url("+_+")";this.style.bgUrl=_}},
	get imageUrl(){return this.style.bgUrl;return this.style.backgroundImage.substring(4,this.style.backgroundImage.length-1);},
	set imagePos(_){_=[_.x|_[0],_.y|_[1]];if(isNaN(_[0]) || isNaN(_[0])){console.warn("NaN pos ",_,this);}this.style.backgroundPosition=""+_[0]*-1+"px "+_[1]*-1+"px"},
	get imagePos(){var a=this.style.backgroundPosition.split(" ");return {x:a[0]*-1,0:a[0]*-1,y:a[1]*-1,1:a[1]*-1};},
	set alpha(_){if(isNaN(_)){console.warn("NaN alpha",_,this);return};this.style.filter="alpha(opacity="+_+")";this.style.MozOpacity=_/100;this.style.KhtmlOpacity=_/100;this.style.opacity=_/100;},
	get alpha(){return this.style.MozOpacity*100;},
	set color(_){this.style.backgroundColor=_;},
	get color(){return this.style.backgroundColor;},
	set radius(){if(arguments.length==1){if(Browser=="FF3"){this.style.MozBorderRadius=arguments[0];}else{this.style.WebkitBrowserRadius=arguments[0]};return;};},
	hide:function(){this.style.display="none";},
	show:function(){this.style.display="";}
	,DIV:function(n,ih){var m=DIV();this[n]=m;m.className=n;this.appendChild(m);if(ih!=undefined){m.innerHTML=ih;};return this;}
	,elem:function(t,n,ih){var x=document.createElement(t);if(n){this[n]=x;x.className=n;};this.appendChild(x);if(ih!=undefined){if(t=="input"){x.value=ih;}else{x.innerHTML=ih;}};return this;}
	,autosize:function(){
		var h=0;
		var w=0;
		for(var i=0;i<this.childNodes.length;i++){
			console.log(this.childNodes[i],this.childNodes[i].offsetHeight,this.childNodes[i].offsetWidth);
			h+=this.childNodes[i].offsetHeight;
			w+=this.childNodes[i].offsetWidth;
		}
		this.height=h;
		this.width=w;
	}
}*/


	//this.html.head.addEventListener("mousedown",function(e){Win.prototype.mouseSelected=that;that.md(e);},false);
	//this.html.addEventListener("mousemove",function(e){that.mm(e);},false);
	//document.body.addEventListener("mousemove",function(e){try{Win.prototype.mouseSelected.mm(e);}catch(e){}},false);
	//document.body.addEventListener("mouseup",function(e){try{Win.prototype.mouseSelected.mu(e);}catch(e){}},false);//*/
	/*this.mouse={down:false,lx:0,ly:0,px:0,py:0};
	this.md=function(e){
		//átméretezés
		this.mouse.down=true;
		this.mouse.lx=e.layerX;
		this.mouse.ly=e.layerY;
		this.mouse.px=e.clientX;
		this.mouse.py=e.clientY;
		/*
		if(e.layerX<5 && e.layerY<5){
			this.edit.moveX=true;
			this.edit.moveY=true;
			this.edit.32X=true;
			this.edit.32Y=true;
		}else if(e.layerX<5 && e.layerY>this.height-5){
			this.edit.moveX=true;
			this.edit.moveY=false;
			this.edit.32X=true;
			this.edit.32Y=true;
		}else if(e.layerX>this.width-5 && e.layerY<5){
			this.edit.moveX=false;
			this.edit.moveY=true;
			this.edit.32X=true;
			this.edit.32Y=true;
		}else if(e.layerX>this.width-5 && e.layerY>this.height-5){
			this.edit.moveX=false;
			this.edit.moveY=false;
			this.edit.32X=true;
			this.edit.32Y=true;
		}else * /if(e.layerY<this.html.head.height){
			this.edit.moveX=true;
			this.edit.moveY=true;
			this.edit.32X=false;
			this.edit.32Y=false;
		}else{
			this.edit.moveX=false;
			this.edit.moveY=false;
			this.edit.32X=false;
			this.edit.32Y=false;
		}
	}
	this.mm=function(e){
		if(this.mouse.down){
			if(this.edit.moveX){
				this.x=e.clientX-this.mouse.lx;
			}
			if(this.edit.moveY){
				this.y=e.clientY-this.mouse.ly;
			}
			if(this.edit.32X){
				this.width=e.clientX+this.mouse.lx-this.mouse.px
			}
			if(this.edit.32Y){
				this.height=e.clientY+this.mouse.ly-this.mouse.py
			}
		}else{
			//if(e.layerX>this.width-5 && e.layerY>this.height-5){document.body.style.cursor="se-re32";}else
			if(e.layerY<this.html.head.height){document.body.style.cursor="pointer";}else
			{document.body.style.cursor="";}
		}
	}
	this.mu=function(e){
		this.mouse.down=false;
	}*/
	
	
	
	
/*var Map=function(){
	var terkep=[[[]]];
	var chipset={};
	this.__defineGetter__("chipset",function(){return chipset;});
	this.elerheto=function(x,y){var a=this.mezoGet(x,y);if(a===false){return -1};if(a.jarhato===true){return 1;};return 0;};
	this.setChipset=function(_){for(var chip in _){chipset[chip]=_[chip];}};
	this.pos={x:0,y:0};
	this.layer=0;
	this.height=0;
	this.width=0;
	this.__defineGetter__("terkep",function(){return copy(terkep);});
	this.__defineSetter__("terkep",function(_){terkep=copy(_);});
	this.mozog=false;
	this.jarhato_map=[[]];
	this.objects=[];
	this.objectSearch=function(koord,kihagy){
		var r=[];
		for(var i=0;i<this.objects.length;i++){
			var q=this.objects[i];
			if(q.isset && q!=kihagy && q.pos.x==koord.x && q.pos.y==koord.y){r.push(q);}
		}
		return r;
	}
	this.isJarhato=function(x,y){
		if(y>this.width || x>this.height || x<0 ||y<0){return false;}
		if(this.jarhato_map[x]==undefined){return false;}
		if(this.jarhato_map[x][y]==undefined){return this.jarhato(x,y);}
		return this.jarhato_map[x][y]
	}
	this.load=function(json){
		terkep[this.layer]=json;
		//this.reload();
	};
	this.jarhato=function(x,y){
		var ok=false;
		var q;
		if(y>this.width || x>this.height || x<0 ||y<0){return false;}
		for(var i=0;i<5;i++){
			q=terkep[i][x][y];
			if(q==undefined || q.length!=3){return false;}
			if(q[1]==0 && q[2]==0){continue;}
			if(chipset[q[0]].prior[q[2]][q[1]]!=0){continue;}
			ok=chipset[q[0]].jarhato[q[2]][q[1]]==15;
		}
		this.jarhato_map[x][y]=ok;
		return ok;
	}
	this.mozog=function(x,y,t){
		this.animove({x:x,y:y},t);
	};
	this.mozogRel=function(x,y,t){
		if(x===0 && y===0){return 0;}
		return this.animove({x:this.pos.x+x,y:this.pos.y+y},t);
	};
	this.setPos=function(t){
		$('layer').top=t.x;
		$('layer').left=t.y;
		this.pos=t;
	};
	this.animove=function(c,ido){
	if(this.mozog){return 0;}this.mozog=true;
		var p=this.pos;
		var pulzus=Math.round(ido/10);
		var fv=function(){return function(o,t){o.pos=t;}};
		for(var i=0;i<pulzus;i++){
			setTimeout(fv(),i*10,this,{x:(c.x-p.x)*i/pulzus+p.x , y:(c.y-p.y)*i/pulzus+p.y});
		}
		setTimeout(fv(),time-1,that,{x:pos2.x , y:pos2.y},1000);
		return i*ido;
	};
	this.mezoGet=function(x,y,layer){
		if(layer==undefined){layer=this.layer};
		if(x>=map.height || x<0 || y>=map.width || y<0){
			return true;
		}else{
			return terkep[layer][x][y];
		}
	};
	this.key=function(evt,e){
		if(evt=="DOWN"){
			var a=0;
			var b=0;
			if(keyboard.binds.up.inArray(e)){a=-32;}
			if(keyboard.binds.down.inArray(e)){a=32;}
			if(keyboard.binds.left.inArray(e)){b=-32;}
			if(keyboard.binds.right.inArray(e)){b=32;}
			this.mozogRel(a,b);
		}
	};
	this.setMap32=function(height,width){
		terkep=new Array(5);
		this.height=height;
		this.width=width;
		this.jarhato_map=new Array(height);
		for(var k=0;k<5;k++){
			var l=$('l'+k);
			l.innerHTML="";
			terkep[k]=new Array(i);
			for(var i=0;i<height;i++){
				terkep[k][i]=new Array(height);
				if(k==0){this.jarhato_map[i]=new Array(width);}
				for(var j=0;j<width;j++){
					var d=DIV();
					l.appendChild(d);
					d.left=j*32;
					d.top=i*32;
					d.id="m_"+k+"_"+i+"_"+j;
					d.className="gameCell";
					terkep[k][i][j]=[0,0,0];
				}
			}
		}
	}
	this.generateLayer=function(layer,obj){
		if(obj==undefined){obj=terkep[layer];}else{terkep[layer]=obj;}
		for(var x=0;x<obj.length;x++){
			for(var y=0;y<obj[x].length;y++){
				this.generateMezo(layer,x,y,undefined,true);
			}
		}
	}
	this.pol=function(x,y,d,layer){
		if(x>terkep[layer].length-1 || x<0 || y>terkep[layer][0].length-1 || y<0){
			return -1;
		}else{
			var a=terkep[layer][x][y]
			return d[0]==a[0] && d[1]==a[1] && d[2]==a[2]?1:0;
		}
	};
	
	this.generateMezo=function(layer,x,y,t,noUpdate){
		if(layer<0 || layer>6 || x<0 || y<0 || x>terkep[layer].length || y>terkep[layer][x].length){console.warn("generateMezo",layer,x,y,t,noUpdate,"out of intervall");return;}
		var div,l,i;
		div=$('m_'+layer+'_'+x+'_'+y);
		if(t!==undefined){
			terkep[layer][x][y]=t;
		}else{
			t=terkep[layer][x][y];
		}
		
		if(chipset[t[0]]==undefined){console.warn("nincs ilyen mezõ a chipset-ben",t,x,y,layer);return;}
		
		l=[];
		for(var i=0;i<9;i++){
			if(i==4){continue;}//önmagát ne nézze meg
			l[i]=this.pol(i<3?x-1:i<6?x:x+1,i%3==0?y-1:i%3==1?y:y+1,t,layer);
			if(noUpdate!==true && l[i]!==-1){
				this.generateMezo(layer,i<3?x-1:i<6?x:x+1,i%3==0?y-1:i%3==1?y:y+1,undefined,true);
			}
		}
		if(t[1]==0 && t[2]==0){
			div.style.background="transparent";
			while(div.childNodes.length!=0){
				div.removeChild(div.firstChild);
			}
		}else if(t[2]==0 && t[1]!=0){//dynamic
			var d,p,l,k,o;
			o=div.childNodes.length!=4;
			p=[	l[1]?l[3]?l[0]?l[5]?l[7]?[1,2]:[1,3]:l[7]?[2,2]:[1,3]:[2,0]:[0,2]:l[3]?[1,1]:[0,1],
				l[1]?l[5]?l[2]?l[3]?l[7]?[1,2]:[1,3]:l[7]?[0,2]:[1,3]:[2,0]:[2,2]:l[5]?[1,1]:[2,1],
				l[7]?l[3]?l[6]?l[5]?l[1]?[1,2]:[1,1]:l[1]?[2,2]:[1,1]:[2,0]:[0,2]:l[3]?[1,3]:[0,3],
				l[7]?l[5]?l[8]?l[3]?l[1]?[1,2]:[1,1]:l[1]?[0,2]:[1,1]:[2,0]:[2,2]:l[5]?[1,3]:[2,3]];
			for(k=0;k<4;k++){
				if(o){
					d=DIV();
					if(k>1){d.top=32/2;}
					if(k%2==1){d.left=32/2}
				}else{
					d=div.childNodes[k];
				}
				//p =	l[k<2?1:7]?l[k%2?5:3]?l[(k<2?0:6)+k%2?2:0]?l[k%2?6:8]?l[k%2?1:7]?[1,2]:[1,k<2?3:1]:
					//l[k<2?7:1]?[k%2?0:2,2]:[1,k<2?3:1]:[2,0]:[k%2?2:0,2]:l[k%2?5:3]?[1,k<2?1:3]:[k%2?2:0,k<2?1:3];
				d.imageUrl=chipset[t[0]].dynamic[t[1]-1].file;
				d.imagePos=d.pos=[p[k][0]*32+(k%2?32/2:0),p[k][1]*32+(k<2?0:32/2)];
				if(o){
					div.appendChild(d);
				}
			}
		}else{
			while(div.childNodes.length!=0){
				div.removeChild(div.firstChild);
			}
			div.imageUrl=chipset[t[0]].file;
			div.imagePos=[t[1]*32,t[2]*32-32];
		}
	}
};


//editor.js

if(false){


function XscriptEditor(obj){
	//keyboard.focus(scriptEditor);
	scriptEditor.save=function(){return scriptObj.save();}
	scriptEditor.load=function(str){scriptObj.load(str);generateHead();generateLeft();generateScript();}
	console.log("kyb.fI=",keyboard.focusedItem);
	this.key=function(op,kc,e){
		if(op=="PRESS"){
			if(e.isDown){scriptEditor.select.down();}else
			if(e.isUp){scriptEditor.select.up();}else
			if(e.isEnter){scriptEditor.select.enter();}
		}
	}
	this.select={
		down:function(){},
		up:function(){},
		enter:function(){},
		select:function(e){}
		
	};
	
	scriptEditor.CM={
		edit:function(f){
			console.log("edit");
			this.openEditWin(f.obj);
		},
		del:function(f){
			f.path.c=removeItem(f.path.c,f.n);
			generateScript();
		},
		copy:function(f){
			scriptEditor.CM.clipboard=copy(f.path.c[f.n]);
		},
		cut:function(f){
			scriptEditor.CM.clipboard=copy(f.path.c[f.n]);
			f.path.c=removeItem(f.path.c,f.n);
			generateScript();
		},
		paste:function(){
			if(scriptEditor.CM.clipboard==undefined){return 42;}
			return function(f){
			f.path.c[f.n]=copy(scriptEditor.CM.clipboard);
			generateScript();
			}
		},
		pasteEnd:function(){
			if(scriptEditor.CM.clipboard==undefined){return 42;}
			return function(f){
			f.path.c[f.path.c.length]=copy(scriptEditor.CM.clipboard);
			generateScript();
			}
		},
		up:function(f){
			if(f.n==0){return 42;}
			return function(f){
				var tmp=f.path.c[f.n];
				f.path.c[f.n]=f.path.c[f.n-1];
				f.path.c[f.n-1]=tmp;
				generateScript();
			}
		},
		dwn:function(f){
			if(f.n==f.path.c.length-1){return 42;}
			return function(f){
				var tmp=f.path.c[f.n];
				f.path.c[f.n]=f.path.c[f.n+1];
				f.path.c[f.n+1]=tmp;
				generateScript();
			}
		},
		comment:function(f){
			if(f.path.c[f.n][0].slice(0,2)=="//"){
				f.path.c[f.n][0]=f.path.c[f.n][0].slice(2);
			}else{
				f.path.c[f.n][0]="//"+f.path.c[f.n][0];
			}
			generateScript();
		},
		duplicate:function(f){
			f.path.c=insertAfter(f.path.c,f.n,copy(f.path.c[f.n]));
			generateScript();
		},
		help:function(e){
			return function(f){
				console.log("HELP:",f.cmd,e,f);
			}
		},
		insert:function(f){
			console.log("insertStart",scriptEditor,scriptWin,"f:",f);
			var w=that.scriptWin.modal({height:400,width:250,title:"Parancslista"});
			var cont=DIV();
			var lista=[
		["showText","readLine","getVar","setVar","showChoices","inputNumber","messageOptions","messageToogle","readChr","wait","comment","if","loop","breakLoop","exit","ereaseEvent","call","label","jump","setFlag","getFlag"],
		["teleport","scrollMap","chgMapSettings","fog","animate","move","flash","shake","pictureAdd","pictureMove","pictureRotate","pictureTone","pictureDel","weather"],
		["battle","shop","name","hp","sp","state","recover","xp","lvl","params","skill","eqip","setName","setClass","setCharset","menu","save","gameOver","titleScreen"]];
			var tabber=new Tabs();
			for(var t=0;t<lista.length;t++){
				var tab=DIV();
				tab.id="commandList";
				for(var i=0;i<lista[t].length;i++){
					tab.elem("button","btn",getScriptData(lista[t][i]).name);
					tab.btn.addEventListener("click",function(e){scriptEditor.CM.insert2(f,w,this.cmd);},false);
					tab.btn.cmd=lista[t][i];
				}
				tabber.push(t,tab);
			}
			cont.appendChild(tabber.element);
			w.f=f;
			w.setContent(cont);
		},
		insert2:function(clickkedLine,winObj,q){
			console.log("before:",clickkedLine.path.c);
			console.log("insertBefore",clickkedLine.path.c,winObj.f.n,insertBefore(getScriptData(q).def,0,q));
			clickkedLine.path.c=insertBefore(clickkedLine.path.c,winObj.f.n,insertBefore(getScriptData(q).def,0,q));
			console.log("after:",clickkedLine.path.c);
			//generateScript();
			//console.log("clickkedLine",clickkedLine,"w",w,"q",q);
			console.log("arguments",arguments);
			//console.log("clickkedLine",clickkedLine,"fp",clickkedLine.path,"fc",clickkedLine.path.c,"fn",clickkedLine.n);
			//openEditWin(clickkedLine.path.c[clickkedLine.n]);
			//winObj.destroy();
		}
	}
	scriptEditor.CN={
		/*OK* /open:function(f){if(f.currentTarget){f=f.currentTarget;};scriptEditor.CN.sel(f.i);},
		/*OK* /sel:function(x){
			$("tabHeaderDiv").tabs[x].blur();
			if(tabNum==x){return;}
			
			$("tabHeaderDiv").tabs[tabNum].className="";
			tabNum=x;
			$("tabHeaderDiv").tabs[tabNum].className="selected";
			tab=scriptObj.getTab(tabNum);
			generateLeft();
			generateScript();
		},
		/*OK* /cut:function(f){
			scriptObj.copyTab(f.i);
			scriptEditor.CN.del(f);
		},
		/*OK* /copy:function(f){
			scriptObj.copyTab(f.i);
		},
		/*OK* /paste:function(e){
			return function(f){
				scriptObj.pasteTab(f.i);
				generateHead();
				generateLeft();
				generateScript();
			}
		},
		/*OK* /del:function(f){
			scriptObj.removeTab(f.i);
			if(f.i==tabNum){
				if(f.i!=0){
					scriptEditor.CN.sel(tabNum-1)
				}else{
					scriptEditor.CN.sel(0);
				}
			}else if(tabNum>f.i){
				scriptEditor.CN.sel(tabNum-1);
			}
			generateHead();
			generateLeft();
			generateScript();
		},
		/*OK * /insert:function(f){
			scriptObj.newTab(f.i);
			if(f.i<=tabNum){tabNum++;scriptEditor.CN.sel(tabNum);}
			generateHead();
		},
		/*OK * /duplicate:function(f){
			scriptObj.duplicate(f.i);
			if(f.i<tabNum){scriptEditor.CN.sel(tabNum+1);}
				generateHead();
				generateLeft();
				generateScript();
		},
		/*OK * /rename:function(f){
			scriptObj.renameTab(f.i,prompt("Új név",scriptObj.getTabNames()[f.i]));
			generateHead();
		},
		ml:function(f){
			if(f.i==0){return false;}
			return function(f){
			scriptObj.reorder(f.i,-1);
			if(f.i-1==tabNum){scriptEditor.CN.sel(tabNum+1);}else
			if(f.i==tabNum){scriptEditor.CN.sel(tabNum-1);}
			generateHead();
		}},
		mr:function(f){
			if(f.i==scriptObj.tabLength-1){return false;}
			return function(f){
			scriptObj.reorder(f.i,+1);
			if(f.i+1==tabNum){scriptEditor.CN.sel(tabNum-1);}else
			if(f.i==tabNum){scriptEditor.CN.sel(tabNum+1);}
			generateHead();
		}}
	}
	
	//if(obj instanceof Targy==false){console.warn("scriptEditor csak Targy-at fogad el:",obj);return false;}
	var that=this;
	this.scriptWin=new Win({height:572,width:600,title:"Script szerkesztõ"});
	var scriptObj=obj;
	var tabNum=0;
	var tab=scriptObj.getTab(tabNum);
	console.log("TAB=",tab);
	this.rgL={};
	var scriptData={
		showText:{name:"Üzenet",help:"egy üzenet megjelenítése",varlist:["textvar|Üzenet"],varinfo:[0],def:[""]},
		readLine:{name:"Readline",help:"egy sor beolvasása és tárolása",varlist:["textvar|Üzenet","variable|változó"],varinfo:[0,0],def:["",[0,""]]},
		"if":{name:"ha",help:"kétirányú elágazás",post:" {",block:[2,3],blockSep:["<span class=post>}</span> KÜLÖNBEN <span class=post>{</span>","<span class=post>}</span>"],varinfo:[5],def:[[0],{c:[]},{c:[]}]}
	};
	this.getScriptData=function(n){
		var def={name:n,help:"nincs részletes súgó ehhez:"+n,varlist:[],varinfo:[],block:false,post:"",def:[]};
		return merge(def,scriptData[n]);
	}
	function generateHead(){
		var tab=scriptObj.getTab(tabNum)
		var h=this.win.head.erase();
		var tabs=DIV();
		tabs.id="tabHeaderDiv";
		tabs.className="tabPlace";
		h.appendChild(tabs);
		h.tabs=tabs;
		var tabArray=scriptObj.getTabNames();
		tabs.tabs=[];
		for(var i=0;i<tabArray.length;i++){
			var d=elem("a");
			d.i=i;
			d.addEventListener("click",scriptEditor.CN.open,false);
			d.cmenu({"Megnyitás":	scriptEditor.CN.open,
				 0:"HR",
				 "Kivágás":		scriptEditor.CN.cut,
				 "Másolás":		scriptEditor.CN.copy,
				 "Beillesztés":	scriptEditor.CN.paste(d),
				 "Törlés":		scriptEditor.CN.del,
				 4:"HR",
				 "Beszúrás elé":scriptEditor.CN.insert,
				 "Duplikálás":	scriptEditor.CN.duplicate,
				 "Átnevezés":	scriptEditor.CN.rename,
				 1:"HR",
				 "Mozgatás balra":scriptEditor.CN.ml(d),
				 "Mozgatás jobbra":	scriptEditor.CN.mr(d),
				 3:"HR",
				 "Súgó":	scriptEditor.CM.help("scripttab","")
				});
			d.textContent=tabArray[i];
			tabs.tabs[i]=d;
			tabs.appendChild(d);
		}
		
		var d=elem("a");
		d.i=tabArray.length;
		d.addEventListener("click",scriptEditor.CN.insert,false);
		d.textContent="+";
		d.cmenu({
				 "Új fül":scriptEditor.CN.insert,
				"Beillesztés a végére":	scriptEditor.CN.paste()
				});
		d.className="add";
		tabs.appendChild(d);
		tabs.DIV("tabPlace2");
		
		tabs.tabs[tabNum].className="selected";
		
	}
	function generateScriptHead(){
		var t=DIV();
		t.className="scriptTabber";
		var list=["Touch","Action","BeforeLeave","Push","AfterLeave","Enter","user1","user2","user3"];
		var titles=["ha valaki \"akciózik\" felé","ha valaki \"akciózik\" rajta","ha valaki elhagyJa (MEGSZAKÍTHATÓ) (1)","ha valaki elindul felé. (MEGSZAKÍTHATÓ) (2)","ha valaki elhagyTa (3)","ha valaki rááll. (4)* /"];
		var j=!tab.targy.jarhato;
		var gray=[false,j,j,false,j,j,false,false,false];
		t.l=[];
		for(var i=0;i<list.length;i++){
			var at=t.elem("a",undefined,list[i])
			at.i=i;
			at.title=titles[i];
			at.setAttribute("gray",gray[i]);
			at.gray=gray[i];
			at.addEventListener("click",function(e){
				if(this.gray==true){return;}
				tab.selectedAction=this.i;
				generateScriptHead();
				tab.targy["on"+list[tab.selectedAction || 0]]=copy(tab.c);
				generateScript();
			},false);
			t.l.push(at);
		}
		tab.c=copy(tab.targy["on"+list[tab.selectedAction || 0]]);
		t.l[tab.selectedAction || 0].className="s";
		this.win.scriptHead.erase().append(t);
	}
	function generateLeft(){
		for(var x in this.rgL){this.rgL[x].erase()}
		this.rgL.ds.erase().appendChild(tab.image.createSelectorButton());
		
		this.rgL.bh.erase().str("besorolás: ").elem("select","category",["primitív","karakter","tárgy"],[tab,"category"])
		.elem("select","list");

		this.rgL.nf.erase().elem("textarea","leftNotes","jegyzetek",[tab,"notes"]);
		this.rgL.ns.erase().elem("textarea","leftNotes","jegyzetek",[scriptObj,"notes"]);
		this.rgL.nf.leftNotes.tab=tab;
		this.rgL.ns.leftNotes.tab=scriptObj;
		//this.rgL.nf.leftNotes.addEventListener("keyup",function(e){this.tab.notes=this.value;},false);
		//this.rgL.ns.leftNotes.addEventListener("keyup",function(e){this.tab.notes=this.value;},false);
		
		
	}
	function genLeftPanel(){
		
		this.rgL.vs=DIV();
		this.rgL.ds=DIV();
		this.rgL.bh=DIV();
		this.rgL.nf=DIV();
		this.rgL.ns=DIV();
		this.rgL.ev=DIV();
		var vt=new Vertab();
		vt.push("megjelenés",this.rgL.ds,1);
		vt.push("viselkedés",this.rgL.bh,1);
		vt.push("változók",this.rgL.vs,0);
		vt.push("esemény",this.rgL.ev,1);
		vt.push("jegyzetek(fül)",this.rgL.nf,0);
		vt.push("jegyzetek(script)",this.rgL.ns,0);
		
		var gr=DIV();
		gr.className="leftGrad";
		
		this.win.leftPanel.erase().append(gr).append(vt.element);
		generateLeft();
		
	}
	function generateScript(){
		var d=DIV();
		console.log("GENERATE SCRIPT, tab.c=",tab.c);
		drawScriptWin(0,tab.c,d,tab);
		this.win.script.erase().append(d);
	}
	
	function variableInfo(v,a){
		var t=0;
		var val=v;
		if(isArray(v)){t=1;}
		
		var r={};
		r.n=t;
		r.v=val;
		r.s=["Szöveg","Változó"][t];
		r.html=elem("span",undefined,val);
		r.html.className="cIL cIL"+t;
		//r.html="<span class='cIL cIL"+t+"' title='"+r.s+"'>"+val+"</span>";
		return r;
	}
	function IF2str(obj){
		//console.log(obj);
		return ":)"//obj.toSource();
	}
	function cmdInfo(c){
		var ret={color:"black",info:[],name:c[0]};
		var v=c;
		var w=removeFirst(c).map(variableInfo);
		var info=this.getScriptData(c[0]);
		for(var i=0;i<info.varinfo.length;i++){
			switch(info.varinfo[i]){
				case 0:ret.info.push(w[i].html);break;
				case 1:ret.info.push(w[i].s);break;
				case 2:ret.info.push(v[i+1]);break;
				case 3:ret.info.push(w[i].v);break;
				case 5:ret.info.push(IF2str(v[i+1]));break;
			}
		}
		var q=elem("span");
		for(var i=0;i<ret.info.length;i++){
			q.append(ret.info[i]).str(i==ret.info.length-1?"":",");
		}
		ret.info=q;//ret.info.toString();
		ret.name=info.name;
		ret.post=info.post;
		if(info.block){
			ret.block=[];
			for(var i=0;i<info.block.length;i++){ret.block[i]=v[info.block[i]];}
			ret.blockSep=info.blockSep;
			ret.blockx=info.block;
		}
		/*
		switch(c[0]){
			case "showText":
				//ret.info=v[0][0]==undefined?"<i>"+v[0]+"</i>":"<b>"+v[0].values[0]+"</b>";
				ret.info=w[0].html
				ret.name="üzenet";
			break;
			case "readLine":
				//ret.info="<i>"+v[0]+"</i>-><b>"+v[1].values[0]+"</b>";
				ret.info=w[0].html+","+w[1].html;
				ret.name="beolvas";
			break;
			case "if":
				ret.info=v[1]
				ret.post=" {";
				ret.name="HA";
				ret.block=[v[2],v[3]];
				ret.blockSep=["<span class=post>}</span> KÜLÖNBEN <span class=post>{</span>","<span class=post>}</span>"];
				ret.blockx=[2,3];
			break;
		}* /
		return ret;
	}
	function cmdWinOpen(command,wind){
		//statikus: text,multitext,number,logic,select
		//változók: variable,boolvar
		//vegyes:   textvar;
		//(speciális:TAB[])
		//var data={showText:[["variable","multitext"]],readLine:["text","variable"]}
		exception("hiba?");
		var w,i,cmd=command[0],appendTo=DIV();
		command.I=0;
		wind.inputs=[];
		var varlist=this.getScriptData(cmd).varlist;
		if(varlist){
			for(var i=0;i<varlist.length;i++){
				w=this.cmdWinOpenV2X(varlist[i],command,wind);
				appendTo.appendChild(w);
			}
		}else{
			appendTo.str("Nincs beállítási lehetõség");
		}
		delete command.I;
		wind.title=this.getScriptData(cmd).name;
		return appendTo;
	}
	
	this.cmdWinOpenV2X=function(insor,command,wind){
		/*if(isArray(insor)){//tabs
			var tabber=new Tabs()
			tabber.selectedTab=command==false?0:command.values[command.I++] || 0;
			for(var i=0;i<insor.length;i++){
				var nd=DIV();
				tabber.push(insor[i][0],nd);
				for(var j=1;j<insor[i].length;j++){
					nd.appendChild(this.cmdWinOpenV2X(insor[i][j]),i==tabber.selectedTab?command:false);
				}
			}
			return tabber.element;
		}* /
		var input;
		insor=insor.split("|");
		var sor=insor[0];
		var pfx=document.createElement("div");
		pfx.textContent=insor[1] || "";
		var val=command[1+command.I++] || "";
		var x=wind.inputs;
		if(sor=="textvar"){
			try{
			var tabber=new Tabs();
			tabber.setMode("inline");
			var setab=isArray(val)?val[0]+1:0
			var v=isArray(val)?val[1]:val;
			var tabs=[DIV().elem("textarea","a",setab==0?v:""),
					  DIV().elem("input","a",setab==1?v:"").elem("button","b","választ"),
					  DIV().elem("input","a",setab==2?v:"").elem("button","b","választ")];
			tabs[1].b.addEventListener("click",function(e){variableDetialsWindow(e,tabs[1].b,tabs[1].a,wind)},false);
			tabs[2].b.addEventListener("click",function(e){variableDetialsWindow(e,tabs[2].b,tabs[1].a,wind)},false);
			x.push([tabber,tabs[0].a,tabs[1].a,tabs[2].a]);
			tabber.push("Szöveg",tabs[0]);
			tabber.push("lok.változó",tabs[1]);
			tabber.push("glob.változó",tabs[2]);
			tabber.selectTab(setab);
			input=tabber.element;
			}catch(e){console.warn(e);}
		}else
		if(sor=="text" || sor=="number"){
			input=document.createElement("input");
			input.t=sor=="text"?0:2;
			x.push(input);
		}else
		if(sor=="variable"){
			input=document.createElement("input");
			input.t=3;
			val=val[1];
			x.push(input);
		}else
		if(sor=="multitext"){
			input=document.createElement("textarea");
			input.t=1;
			x.push(input);
		}else
		if(sor=="logic"){
			input=document.createElement("select");
			input.elem("option",false,"Nem");
			input.elem("option",false,"Igen");
			input.t=5;
			x.push(input);
		}else
		if(sor=="select"){
			input=document.createElement("select");
			for(var i=2;i<insor.length;i++){
				input.elem("option",false,insor[i]);
			}
			input.t=6;
			x.push(input);
		}else{
			input=DIV();
			input.textContent="[!!"+sor+"!!]";
		}
		input.value=val;
		//FIXME:value beállítása
		pfx.className=sor;
		pfx.appendChild(input);
		if(sor=="variable"){
			pfx.elem("button","b","választ");
			pfx.b.addEventListener("click",function(e){variableDetialsWindow(e,pfx.b,input,wind);},false);
		}
		return pfx;
	}
	//###################################
	
	function cmdWinClose(c,win){
		var s,t,v;
		for(var i=0;i<win.inputs.length;i++){
			s=win.inputs[i]
			t=s.t;
			if(s.length==4){
				t=[0,3,4][s[0].selectedTab];
				s=(s[s[0].selectedTab+1]);
			}
			pf="";
			switch(t){
				case 0: //text
					pf="&";
					v=s.value;
				break;
				case 1: //multiline text
					pf="$";
					v=s.value;
				break;
				case 2: //numeric
					pf="#";
					v=parseInt(s.value);
				break;
				case 3: //lok-var
					//pf="@";
					//v=s.value;
					pf=false;
					//v={cmd:"getVar",values:[s.value,"local"]}
					v=[0,s.value];
				break;
				case 4: //glob-var
					//pf="*";
					//v=s.value;
					pf=false;
					//v={cmd:"getVar",values:[s.value,"global"]}
					v=[1,s.value];
				break;
				case 5: //logic
					pf="?";
					v=s.selectedIndex==0?1:0;
				break;
				case 6: //select
					pf="|";
					v=s.selectedIndex;
				break;
			}
			//if(pf){v=pf+v;}
			console.log(c,"[",i+1,"]=",v,"|",s,t);
			c[i+1]=v;
		}
		generateScript();
	}
	function drawScriptWin(lvl,obj,append,path){
		for(var i=0;i<obj.length;i++){
			//info
			var info=cmdInfo(obj[i]);
			//html
			var sor=DIV();
			sor.className="scriptsor";
			sor.DIV("line");
			sor.line.elem("span","parancs",info.name);
			sor.line.elem("span","z0","(");
			sor.line.elem("span","params",info.info);
			sor.line.elem("span","z1",")");
			sor.line.elem("span","post",info.post);
			sor.line.parancs.style.color=info.color;
			sor.line.addEventListener("mouseover",function(){this.parentNode.className="scriptsorOver";},false);
			sor.line.addEventListener("mouseout",function(){this.parentNode.className="scriptsor";},false);
			
			//data
			sor.line.lvl=lvl;
			sor.line.O=obj;
			sor.line.obj=obj[i];
			sor.line.cmd=obj[i][0];
			sor.line.commented=obj.slice(0,2)=="//";
			sor.line.n=i;
			sor.line.path=path;
			//content
			
			//event
			sor.line.addEventListener("click",function(e){openEditWin(e.currentTarget.obj);},false);
			sor.line.cmenu({"Szerkesztés":	scriptEditor.CM.edit,
				 0:"HR",
				 "Kivágás":		scriptEditor.CM.cut,
				 "Másolás":		scriptEditor.CM.copy,
				 "Beillesztés":	scriptEditor.CM.paste(),
				 "Törlés":		scriptEditor.CM.del,
				 1:"HR",
				 "Mozgatás fel":scriptEditor.CM.up(sor.line),
				 "Mozgatás le":	scriptEditor.CM.dwn(sor.line),
				 2:"HR",
				"Kommentálva":	scriptEditor.CM.comment,
				 3:"HR",
				 "Duplikálás":	scriptEditor.CM.duplicate,
				 "Beszúrás":	scriptEditor.CM.insert,
				 4:"HR",
				 "Súgó":	scriptEditor.CM.help("script",obj[i][0])
				});
			//insert
			append.appendChild(sor);
			//block
			if(info.block!=undefined){
				sor.DIV("block");
				for(var j=0;j<info.block.length;j++){
					drawScriptWin(lvl+1,info.block[j].c,sor.block,info.block[j]);
					if(info.blockSep.length>j){
						var q=DIV();
						q.innerHTML=info.blockSep[j];
						q.className="scriptsorSep";
						sor.block.appendChild(q);
						q.addEventListener("mouseover",function(){this.parentNode.parentNode.className="scriptsorOver";},false);
						q.addEventListener("mouseout",function(){this.parentNode.parentNode.className="scriptsor";},false);
					}
				}
			}
		}
		var sor=DIV("[+]");
		sor.className="scriptsorInsert";
		sor.lvl=lvl;
		sor.O=obj;
		sor.path=path
		sor.cmd="insert";
		sor.n=obj.length;
		sor.cmenu({"Beszúrás":	scriptEditor.CM.insert,
				 "Beillesztés":	scriptEditor.CM.pasteEnd(),
				 0:"HR",
				 "Súgó":	scriptEditor.CM.help("script","Insert")
				});
		sor.addEventListener("click",function(e){scriptEditor.CM.insert(this);},false);
		append.appendChild(sor);
	}
	function openEditWin(ct){
		console.log(ct);
		var m=that.scriptWin.modal({height:200,width:250});
		that.openedWin=m;
		m.setContent(cmdWinOpen(ct,m))
		m.autoSize();
		var sb=DIV();
		sb.elem("button","save","Mentés");
		sb.elem("button","close","Mégsem");
		sb.save.m=m;
		sb.save.q=ct;
		sb.close.m=m;
		sb.save.addEventListener("click",that.scriptEditSave,false);
		sb.close.addEventListener("click",that.scriptEditClose,false);
		m.setStatus(sb);
	}
	this.win=DIV();
	this.win.className="scriptEditorWin";
	this.win.DIV("head").DIV("leftPanel").DIV("scriptHead").DIV("script");
	this.win.head.className="scriptEditorHead";
	this.win.leftPanel.className="scriptEditorLeftPanel";
	this.win.script.className="scriptEditorScript";
	this.win.scriptHead.className="scriptEditorScriptHead";
	
	this.scriptWin.setContent(this.win);
	generateHead();
	genLeftPanel();
	generateScriptHead();
	generateScript();
	
	
	this.nameInputKeyup=function(e){scriptObj.renameTab(tabNum,e.currentTarget.value);that.win.head.tabs.tabs[tabNum].textContent=e.currentTarget.value;}
	this.delClick=function(e){if(scriptObj.tabLength>1){scriptObj.removeTab(tabNum);if(tabNum!=0){tabNum--;generateLeft();generateScript();};generateHead();}};
	this.copyClick=function(e){scriptObj.copyTab(tabNum);generateHead()};
	this.pasteClick=function(e){scriptObj.pasteTab(tabNum);generateHead();generateLeft();generateScript();};
	this.clearClick=function(e){scriptObj.clearTab(tabNum);generateHead();generateScript();};
	this.tabSelect=function(e){tabNum=e.currentTarget.i;generateHead();generateLeft();generateScript();};
	this.tabAdd=function(e){scriptObj.newTab();tabNum=scriptObj.tabLength-1;generateHead();generateLeft();generateScript();};* /
	
	this.scriptEditSave=function(e){cmdWinClose(this.q,this.m);this.m.destroy();}
	this.scriptEditClose=function(e){this.m.destroy();}
	function variableDetialsWindow(a,b,c,d){console.log(a,b,c,d);}
}
}

*/