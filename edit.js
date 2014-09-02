var winPos=[[400,20],[50,200],[10,550]];

function scriptEditor(targy){
	if(GAME.scriptEditor){
		GAME.scriptEditor.addTab(targy);
		GAME.scriptEditor.selLast();
	}else{
		GAME.scriptEditor=new ScriptEditor(targy);
		GAME.scriptEditor.selLast();//deleteIt
	}
}
var ScriptEditor=function(targy){
	var THIS=this;
	this.THIS=this;
	this.targy=targy;
	this.savedObjectList=[targy];
	this.savedObjectId=0;
	this.open();
}
ScriptEditor.prototype.addTab=function(targy){this.savedObjectList.push(targy);this.savedObjectId=this.savedObjectList.length-1;}
ScriptEditor.prototype.open=function(){						//@1
	this.THIS=this;
	this.scriptWin=new Win({height:572,width:600,title:"Script szerkesztõ"});
	this.scriptWin.onClose=function(){GAME.scriptEditor.close();}
	this.win=DIV();

	this.win.className="scriptEditorWin";
	this.win.DIV("head").DIV("leftPanel").DIV("scriptHead").DIV("script");
	this.win.head.className="scriptEditorHead";
	this.win.leftPanel.className="scriptEditorLeftPanel";
	this.win.script.className="scriptEditorScript";
	this.win.scriptHead.className="scriptEditorScriptHead";

	this.scriptWin.setContent(this.win);
	this.generateHead();
	this.generateLeft();
	this.generateRight();
	this.generateScript();
}
ScriptEditor.prototype.close=function(){					//@1.1
	for(var s in this){
		delete this[s];
	};
	delete GAME.scriptEditor;
};
	ScriptEditor.prototype.selLast=function(){
		this.generateHead();
		this.generateLeft();
		this.generateScript();
		this.generateLeftContent();
		this.generateRight();
	},
ScriptEditor.prototype.CN={									//@R2
	open:function(f){if(f.currentTarget){f=f.currentTarget;};GAME.scriptEditor.CN.sel(f.i);},
	sel:function(x){
		$("tabHeaderDiv").tabs[x].blur();
		if(GAME.scriptEditor.savedObjectId==x){return;}

		$("tabHeaderDiv").tabs[GAME.scriptEditor.savedObjectId].className="";
		GAME.scriptEditor.savedObjectId=x;
		$("tabHeaderDiv").tabs[GAME.scriptEditor.savedObjectId].className="selected";
		//tab=GAME.scriptEditor.getScript().getTab(GAME.scriptEditor.savedObjectId);
		GAME.scriptEditor.generateLeft();
		GAME.scriptEditor.generateScript();
		GAME.scriptEditor.generateLeftContent();
		GAME.scriptEditor.generateRight();
	},
	cut:function(f){
		GAME.scriptEditor.getScript().copyTab(f.i);
		GAME.scriptEditor.CN.del(f);
	},
	copy:function(f){
		GAME.scriptEditor.getScript().copyTab(f.i);
	},
	paste:function(e){
		return function(f){
			GAME.scriptEditor.getScript().pasteTab(f.i);
			generateHead();
			generateLeft();
			generateScript();
		}
	},
	del:function(f){
		GAME.scriptEditor.getScript().removeTab(f.i);
		if(f.i==GAME.scriptEditor.savedObjectId){
			if(f.i!=0){
				GAME.scriptEditor.CN.sel(GAME.scriptEditor.savedObjectId-1)
			}else{
				GAME.scriptEditor.CN.sel(0);
			}
		}else if(GAME.scriptEditor.savedObjectId>f.i){
			GAME.scriptEditor.CN.sel(GAME.scriptEditor.savedObjectId-1);
		}
		generateHead();
		generateLeft();
		generateScript();
	},
	insert:function(f){
		GAME.scriptEditor.getScript().newTab(f.i);
		if(f.i<=GAME.scriptEditor.savedObjectId){GAME.scriptEditor.savedObjectId++;GAME.scriptEditor.CN.sel(GAME.scriptEditor.savedObjectId);}
		generateHead();
	},
	duplicate:function(f){
		GAME.scriptEditor.getScript().duplicate(f.i);
		if(f.i<GAME.scriptEditor.savedObjectId){GAME.scriptEditor.CN.sel(GAME.scriptEditor.savedObjectId+1);}
			generateHead();
			generateLeft();
			generateScript();
	},
	rename:function(f){
		GAME.scriptEditor.getScript().renameTab(f.i,prompt("Új név",GAME.scriptEditor.getScript().getTabNames()[f.i]));
		generateHead();
	},
	ml:function(f){
		if(f.i==0){return false;}
		return function(f){
		GAME.scriptEditor.getScript().reorder(f.i,-1);
		if(f.i-1==GAME.scriptEditor.savedObjectId){GAME.scriptEditor.CN.sel(GAME.scriptEditor.savedObjectId+1);}else
		if(f.i==GAME.scriptEditor.savedObjectId){GAME.scriptEditor.CN.sel(GAME.scriptEditor.savedObjectId-1);}
		generateHead();
	}},
	mr:function(f){
		return false;//FIXME
		if(f.i==this.savedObjectList.length-1){return;}
		return function(f){
		GAME.scriptEditor.getScript().reorder(f.i,+1);
		if(f.i+1==GAME.scriptEditor.savedObjectId){GAME.scriptEditor.CN.sel(GAME.scriptEditor.savedObjectId-1);}else
		if(f.i==GAME.scriptEditor.savedObjectId){GAME.scriptEditor.CN.sel(GAME.scriptEditor.savedObjectId+1);}
		generateHead();
	}}
}
ScriptEditor.prototype.CscriptLine={						//@R7
	CscriptLine:"[[CscriptLine]]",
	clipboard:undefined,
	edit:function(f){//ok
		this.editScriptOpen(f.obj);
	},
	del:function(f){//ok
		f.path.c=removeItem(f.path.c,f.n);
		this.generateScript();
	},
	copy:function(f){//ok
		this.CscriptLine.clipboard=copy(f.path.c[f.n]);
		this.generateScript();
	},
	cut:function(f){//ok
		this.CscriptLine.clipboard=copy(f.path.c[f.n]);
		f.path.c=removeItem(f.path.c,f.n);
		this.generateScript();
	},
	paste:function(t){//ok
		if(t.CscriptLine.clipboard==undefined){return 42;}
		return function(f){
			f.path.c[f.n]=copy(this.CscriptLine.clipboard);
			this.generateScript();
		}
	},
	pasteEnd:function(t){//ok
		if(t.CscriptLine.clipboard==undefined){return 42;}
		return function(f){
			f.path.c[f.path.c.length]=copy(this.CscriptLine.clipboard);
			this.generateScript();
		}
	},
	up:function(f){//ok
		if(f.n==0){return 42;}
		return function(f){
			var t=f.path.c[f.n];
			f.path.c[f.n]=f.path.c[f.n-1];
			f.path.c[f.n-1]=t;
			//[,f.path.c[f.n-1]]=[f.path.c[f.n-1],];
			this.generateScript();
		}
	},
	dwn:function(f){//ok
		//return false;//FIXME
		if(f.n==f.path.c.length-1){return 42;}
		return function(f){
			var t=f.path.c[f.n];
			f.path.c[f.n]=f.path.c[f.n+1];
			f.path.c[f.n+1]=t;

			//[f.path.c[f.n],f.path.c[f.n+1]]=[f.path.c[f.n+1],f.path.c[f.n]];
			this.generateScript();
		}
	},
	comment:function(f){//ok
		if(f.path.c[f.n][0].slice(0,2)=="//"){
			f.path.c[f.n][0]=f.path.c[f.n][0].slice(2);
		}else{
			f.path.c[f.n][0]="//"+f.path.c[f.n][0];
		}
		this.generateScript();
	},
	duplicate:function(f){//ok
		f.path.c=insertAfter(f.path.c,f.n,copy(f.path.c[f.n]));
		this.generateScript();
	},
	help:function(e){
		return function(f){
			console.log("HELP:",f.cmd,e,f);
		}
	},
	insert:function(f){
		console.log("insertStart",this,"f:",f);
		var w=this.scriptWin.modal({height:400,width:250,title:"Parancslista"});
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
				tab.elem("button","btn",this.generateScriptGetData(lista[t][i]).name);
				tab.btn.THIS=this;
				tab.btn.addEventListener("click",function(e){this.THIS.CscriptLine.insert2.call(this.THIS,f,w,this.cmd);},false);
				tab.btn.cmd=lista[t][i];
			}
			tabber.push(t,tab);
		}
		cont.appendChild(tabber.element);
		w.f=f;
		w.setContent(cont);
	},
	insert2:function(clickkedLine,winObj,q){
		clickkedLine.path.c=insertBefore(clickkedLine.path.c,winObj.f.n,insertBefore(this.generateScriptGetData(q).def,0,q));
		this.editScriptOpen(clickkedLine.path.c[clickkedLine.n]);
		this.generateScript();
		winObj.destroy();
	}
}
ScriptEditor.prototype.generateHead=function(){				//@2
	var tabs=this.savedObjectList;
	var soid=this.savedObjectId;
	var tab=this.getObj();
	var headHtmlObj=this.win.head.erase();
	var tabContainer=DIV();
	tabContainer.id="tabHeaderDiv";
	tabContainer.className="tabPlace";
	headHtmlObj.appendChild(tabContainer);
	headHtmlObj.tabContainer=tabContainer;

	tabContainer.tabs=[];

	for(var i=0;i<tabs.length;i++){
		var d=elem("a");
		d.i=i;
		d.addEventListener("click",this.CN.open,false);

		d.cmenu({"Megnyitás":	this.CN.open,
			 0:"HR",
			 "Kivágás":		this.CN.cut,
			 "Másolás":		this.CN.copy,
			 "Beillesztés":	this.CN.paste(d),
			 "Törlés":		this.CN.del,
			 1:"HR",
			 "Beszúrás elé":this.CN.insert,
			 "Duplikálás":	this.CN.duplicate,
			 "Átnevezés":	this.CN.rename,
			 2:"HR",
			 "Mozgatás balra":this.CN.ml(d),
			 "Mozgatás jobbra":	this.CN.mr(d),
			 3:"HR",
			 "Súgó":	false
			},this);
		d.textContent=tabs[i].C.name;
		tabContainer.tabs[i]=d;
		tabContainer.appendChild(d);
	}

	var d=elem("a");
	d.i=tabs.length;
	//d.addEventListener("click",this.CN.insert,false);
	d.textContent="+";
	//d.cmenu({"Új fül":this.CN.insert,"Beillesztés a végére":	this.CN.paste()},this);
	d.className="add";
	tabContainer.appendChild(d);
	tabContainer.DIV("tabPlace2");
	tabContainer.tabs[soid].className="selected";


};
ScriptEditor.prototype.generateLeftContent=function(){		//@4
	//for(var x in this.leftWinDivs){this.leftWinDivs[x].erase()}
	this.leftWinDivs.ds.erase().appendChild(this.getObj().image.createSelectorButton());

	this.leftWinDivs.bh.erase().str("besorolás: ").elem("select","category",["tárgy","NPC","szörny","akadály"],[this.getObj(),"category"])
	.str("Név:").elem("input","name","name",[this.getObj().C,"name"]);

	this.leftWinDivs.nf.erase().elem("textarea","leftNotes","jegyzetek",[this.getObj(),"notes"]);
	this.leftWinDivs.ns.erase().elem("textarea","leftNotes","jegyzetek",[this,"notes"]);
	this.leftWinDivs.nf.leftNotes.tab=this.getObj();
	this.leftWinDivs.ns.leftNotes.tab=this;
	this.leftWinDivs.ev.o=this.getObj();

}
ScriptEditor.prototype.generateLeft=function(){				//@3
	this.leftWinDivs={vs:DIV(),ds:DIV(),bh:DIV(),nf:DIV(),ns:DIV(),ev:DIV()};

	var vt=new Vertab();
	vt.push("megjelenés",this.leftWinDivs.ds,1);
	vt.push("viselkedés",this.leftWinDivs.bh,1);
	vt.push("változók",this.leftWinDivs.vs,0);
	vt.push("mozgatás",this.leftWinDivs.ev,1);
	vt.push("jegyzetek(fül)",this.leftWinDivs.nf,0);
	vt.push("jegyzetek(script)",this.leftWinDivs.ns,0);

	var gr=DIV();
	gr.className="leftGrad";
	with(this.leftWinDivs.ev.elem("div")){//megjegyzés: éjfélkor már ilyen szépeket lehet csak alkotni :D
		style.background="url(design/movechar.png)";
		height=128;
		width=144;
		style.cursor="pointer";
		addEventListener("click",function(e){
			this.parentNode.o.move([[["M7","Mu","Mu","M9","A0"],["Ml","Tl","Tu","Mr","A1"],["Ml","Td","Tr","Mr","A2"],["M1","Md","Md","M3","A3"]][Math.floor(e.layerY/32)][Math.floor(e.layerX/32)]],2);
		},true);}
	//.elem("button","u","fel").elem("button","l","balra").elem("button","r","jobbra").elem("button","d","le");
	this.leftWinDivs.ev.o=this.getObj();
	/*
	this.leftWinDivs.ev.u.addEventListener("click",function(){this.parentNode.o.move(["Mu"],2);},false);
	this.leftWinDivs.ev.d.addEventListener("click",function(){this.parentNode.o.move(["Md"],2);},false);
	this.leftWinDivs.ev.l.addEventListener("click",function(){this.parentNode.o.move(["Ml"],2);},false);
	this.leftWinDivs.ev.r.addEventListener("click",function(){this.parentNode.o.move(["Mr"],2);},false);*/
	this.win.leftPanel.erase().append(gr).append(vt.element);

	this.generateLeftContent();

};
ScriptEditor.prototype.generateRight=function(){			//@5
	var t=DIV();
	t.className="scriptTabber";
	var list=["Touch","Action","BeforeLv","Push","AfterLv","Enter","user1","user2","user3"];
	var names=["érintés","akció","elhagyás elött","tolás","elhagyás után","belépés","U1","U2","U3"];
	var titles=["ha valaki \"akciózik\" felé","ha valaki \"akciózik\" rajta","ha valaki elhagyJa (MEGSZAKÍTHATÓ) (1)","ha valaki elindul felé. (MEGSZAKÍTHATÓ) (2)","ha valaki elhagyTa (3)","ha valaki rááll. (4)","egyéni esemény 1","egyéni esemény 2","egyéni esemény 3"];
	var j=!this.getObj().jarhato;
	var gray=[false,j,j,false,j,j,false,false,false];
	t.l=[];
	for(var i=0;i<list.length;i++){
		var at=t.elem("a",undefined,names[i])
		at.value=list[i];
		at.i=i;
		at.title=titles[i];
		if(gray[i]){at.className="disabled"}else{at.className="enabled";}
		if(this.getObj().selectedAction==i || (this.getObj().selectedAction==undefined && i==0)){at.className+=" sel";}
		if(this.getScript(list[i]).c!=undefined && this.getScript(list[i]).c.length==0){at.className+=" empty";}else{at.className+=" notEmpty";}

		at.THIS=this;
		at.addEventListener("click",function(e){
			var THIS=this.THIS;
			var tab=THIS.getObj();
			tab.selectedAction=this.i;
			THIS.selectedScript=this.value;
			THIS.generateRight();
			THIS.generateScript();
		},false);
		t.l.push(at);
	}
	//this.getObj().c=copy(this.getObj().targy["on"+list[this.getObj().selectedAction || 0]]);//FIXME
	t.l[this.getObj().selectedAction || 0].className="s";

	this.win.scriptHead.erase().append(t);
}
ScriptEditor.prototype.generateScript=function(){			//@6
	var d=DIV();
	this.generateScriptWin(0,this.getScript().c,d,this.getObj()["on"+this.selectedScript]);
	this.win.script.erase().append(d);
}
ScriptEditor.prototype.generateScriptGetData=function(n){	//scriptname to data (R7.insert;R7.edit...)
	return merge({name:n,help:"nincs részletes súgó ehhez:"+n,varlist:[],varinfo:[],block:false,post:"",def:[]},scriptConfigJSON[n]);
}
ScriptEditor.prototype.generateScriptCmdInfo=function(c){	//@7.1
	var ret={color:"black",info:[],name:c[0]};
	var v=c;
	var w=removeFirst(c).map(function(v,a){
			var t=isArray(v)?1:0;
			var r={n:t,v:v,s:["Szöveg","Változó"][t],html:elem("span",undefined,v)};r.html.className="cIL cIL"+t;
			return r;
	});
	var info=this.generateScriptGetData(c[0]);
	for(var i=0;i<info.varinfo.length;i++){
		switch(info.varinfo[i]){
			case 0:ret.info.push(w[i].html);break;
			case 1:ret.info.push(w[i].s);break;
			case 2:ret.info.push(v[i+1]);break;
			case 3:ret.info.push(w[i].v);break;
			case 5:ret.info.push(this.generateIfStatement(v[i+1]));break;
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
	return ret;
};
ScriptEditor.prototype.generateIfStatement=function(obj){	//Szükséges a @7->IF generálásához (FIXME!)
		//console.log(obj);
		return ":)"//obj.toSource();
	}
ScriptEditor.prototype.generateScriptWin=function(lvl,obj,ap,path){//@7
	//exception(lvl);
	//called by:
	//generateScript-310(event) //ennek kellene csak lefutnia
	//init-open-generateScript-

	for(var i=0;i<obj.length;i++){
		//info
		var info=this.generateScriptCmdInfo(obj[i]);
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

		merge(sor.line,{lvl:lvl,O:obj,obj:obj[i],cmd:obj[i][0],commented:obj.slice(0,2)=="//",n:i,path:path});
		//content

		//event
		sor.THIS=this;
		sor.line.addEventListener("click",function(e){e.currentTarget.parentNode.THIS.editScriptOpen(e.currentTarget.obj);},false);
		sor.line.cmenu({"Szerkesztés":	this.CscriptLine.edit,
			 0:"HR",
			 "Kivágás":		this.CscriptLine.cut,
			 "Másolás":		this.CscriptLine.copy,
			 "Beillesztés":	this.CscriptLine.paste(this),
			 "Törlés":		this.CscriptLine.del,
			 1:"HR",
			 "Mozgatás fel":this.CscriptLine.up(sor.line),
			 "Mozgatás le":	this.CscriptLine.dwn(sor.line),
			 2:"HR",
			"Kommentálva":	this.CscriptLine.comment,
			 3:"HR",
			 "Duplikálás":	this.CscriptLine.duplicate,
			 "Beszúrás":	this.CscriptLine.insert,
			 4:"HR",
			 "Súgó":	this.CscriptLine.help("script",obj[i][0])
			},this);
		//insert
		ap.appendChild(sor);
		//block
		if(info.block!=undefined){
			sor.DIV("block");
			for(var j=0;j<info.block.length;j++){
				this.generateScriptWin(lvl+1,info.block[j].c,sor.block,info.block[j]);
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
	sor.cmenu({"Beszúrás":	this.CscriptLine.insert,
			 "Beillesztés":	this.CscriptLine.pasteEnd(this),
			 0:"HR",
			 "Súgó":	this.CscriptLine.help("script","Insert")
			},this);
	sor.THIS=this;
	sor.addEventListener("click",function(e){this.THIS.CscriptLine.insert.call(this.THIS,this);},false);
	ap.appendChild(sor);

}
ScriptEditor.prototype.editScriptOpen=function(ct){			//@8.0 szerkesztés ablak létrehozása
	var editWin=this.scriptWin.modal({height:200,width:250});
	this.openedWin=editWin;
	editWin.setContent(this.editScriptOpenGenerate(ct,editWin))
	editWin.autoSize();
	var sb=DIV();
	sb.elem("button","save","Mentés");
	sb.elem("button","close","Mégsem");
	sb.save.editWin=editWin;
	sb.save.q=ct;
	sb.close.editWin=editWin;
	sb.save.THIS=this;
	sb.close.THIS=this;
	sb.save.addEventListener("click",this.editScriptSave,false);
	sb.close.addEventListener("click",this.editScriptClose,false);
	editWin.setStatus(sb);
}
ScriptEditor.prototype.editScriptOpenGenerate=function(cm,win){//@8.1 beállítások bejárása
	var w,i,cmd=cm[0],appendTo=DIV();
	cm.I=0;
	win.inputs=[];
	var varlist=this.generateScriptGetData(cmd).varlist;
	if(varlist){
		for(var i=0;i<varlist.length;i++){
			w=this.editScriptOpenGenerateLine(varlist[i],cm,win);
			appendTo.appendChild(w);
		}
	}else{
		appendTo.str("Nincs beállítási lehetõség");
	}
	delete cm.I;
	win.title=this.generateScriptGetData(cmd).name;
	return appendTo;

}
ScriptEditor.prototype.variableDetialsWindow=function(e,btn,lnk,wnd){//@8.2 (FIXME)
	console.log("variableDetialsWindow",e,btn,lnk,wnd);
}
ScriptEditor.prototype.editScriptOpenGenerateLine=function(insor,command,wind){//@8.2 egy sor létrehozása
	insor=insor.split("|");
	var input,
		sor=insor[0],pfx=document.createElement("div"),
		val=command[1+command.I++] || "",
		x=wind.inputs;
	pfx.textContent=insor[1] || "";
	if(sor=="textvar"){
		try{
			var tabber=new Tabs();
			tabber.setMode("inline");
			var setab=isArray(val)?val[0]+1:0
			var v=isArray(val)?val[1]:val;
			var tabs=[DIV().elem("textarea","a",setab==0?v:""),
					  DIV().elem("input","a",setab==1?v:"").elem("button","b","választ"),
					  DIV().elem("input","a",setab==2?v:"").elem("button","b","választ")];
			tabs[1].b.THIS=this;
			tabs[2].b.THIS=this;
			tabs[1].b.addEventListener("click",function(e){this.THIS.variableDetialsWindow(e,tabs[1].b,tabs[1].a,wind)},false);
			tabs[2].b.addEventListener("click",function(e){this.THIS.variableDetialsWindow(e,tabs[2].b,tabs[1].a,wind)},false);
			x.push([tabber,tabs[0].a,tabs[1].a,tabs[2].a]);
			tabber.push("Szöveg",tabs[0]);
			tabber.push("lok.változó",tabs[1]);
			tabber.push("glob.változó",tabs[2]);
			tabber.selectTab(setab);
			input=tabber.element;
		}catch(e){
			exception(e,"textvar");
		}
	}else
	if(sor=="text" || sor=="number" || sor=="numeric"){
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
	}else
	if(sor=="numvar"){
		try{
			var tabber=new Tabs();
			tabber.setMode("inline");
			var setab=isArray(val)?val[0]+1:0
			var v=isArray(val)?val[1]:val;
			var tabs=[DIV().elem("input","a",setab==0?v:""),
					  DIV().elem("input","a",setab==1?v:"").elem("button","b","választ"),
					  DIV().elem("input","a",setab==2?v:"").elem("button","b","választ")];
			tabs[0].a.addEventListenr("blur",function(){this.value=parseInt(this.value);},true);
			tabs[1].b.THIS=this;
			tabs[2].b.THIS=this;
			tabs[1].b.addEventListener("click",function(e){this.THIS.variableDetialsWindow(e,tabs[1].b,tabs[1].a,wind)},false);
			tabs[2].b.addEventListener("click",function(e){this.THIS.variableDetialsWindow(e,tabs[2].b,tabs[1].a,wind)},false);
			x.push([tabber,tabs[0].a,tabs[1].a,tabs[2].a]);
			tabber.push("Szöveg",tabs[0]);
			tabber.push("lok.változó",tabs[1]);
			tabber.push("glob.változó",tabs[2]);
			tabber.selectTab(setab);
			input=tabber.element;
		}catch(e){

			exception(e,"numvar");
		}
	}else
	if(sor=="targy"){
		input=DIV();
		input.textContent="[targy FIXME]";
	}else
	if(sor=="color"){
		input=DIV();
		input.textContent="[color FIXME]]";
	}else
	if(sor=="pos"){
		input=DIV();
		input.textContent="[pos FIXME]";
	}
	else{
		input=DIV();
		input.textContent="[!!!"+sor+"!!!]";
	}
	input.value=val;
	//FIXME:value beállítása
	pfx.className=sor;
	pfx.appendChild(input);
	if(sor=="variable"){
		pfx.elem("button","b","választ");
		pfx.b.THIS=this;
		pfx.b.addEventListener("click",function(e){this.THIS.variableDetialsWindow(e,pfx.b,input,wind);},false);
	}
	return pfx;
}
ScriptEditor.prototype.editScriptClose=function(c,win){		//@8.3
	this.editWin.destroy();
}
ScriptEditor.prototype.editScriptSave=function(e){			//@8.4
	var s,t,v;
	var c=this.q;
	var win=this.editWin;
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
		console.log("editSave",c,"[",i+1,"]=",v,"|",s,t);
		c[i+1]=v;
	}
	win.destroy();
	this.THIS.generateScript();
}


ScriptEditor.prototype.getObj=function(){return this.savedObjectList[this.savedObjectId];};
ScriptEditor.prototype.getScript=function(_){return this.getObj()["on"+(_?_:this.selectedScript)];};
//ScriptEditor.prototype.savedObjectList=[];
//ScriptEditor.prototype.savedObjectId=-1;
ScriptEditor.prototype.selectedScript="Touch";

var Editor=function(){
	var tableDiv;
	var editorSelectedField;
	var selectStart;
	var mouseDown=false;
	var map=GAME.map;
	var SIZE=32;
	var editor=this;
	this.rajzMod=0;
	this.reteg=0;
	this.mezoLista=[[[0,0,0]]];
	this.mezoListaS=[0,0];
	this.selectedChipsetId=0;
	this.mapClickStart=[0,0];
	this.start=-1;//0 jobb-le, 1 jobb-fel, 2 bal-le, 3 bal-fel
	this.historyObject=[{layer:"all",mode:-1,m:copy(map.terkep)}];
	this.historyPointer=0;
	this.historyLength=1;
	this.erintettMezok=[];
	this.insertMode=-1;
	this.insertConfig={};
	this.scriptEdit=false;
	this.lastMovePos=[-1,-1];
	this.jarhatosagBekapcsolva=false;

	this.editorSelectField=function(evt){//panel kiválasztás
		if(editorSelectedField!==undefined){editorSelectedField.className="";}
		editorSelectedField=evt.target;
		editorSelectedField.className="selected";
	}
	this.editorSelectDown=function(evt){
		mouseDown=true;
		selectStart=[(evt.target.left-12)/32,(evt.target.top-47)/32];
		editor.mezoLista=[[[editor.selectedChipsetId,selectStart[0],selectStart[1]]]];
		editor.setSelectRange();
	}
	this.editorSelectMove=function(evt){
		if(mouseDown){
			editor.mezoLista=[];
			var selectEnd=[(evt.target.left-12)/SIZE,(evt.target.top-47)/SIZE];
			var min=[Math.min(selectEnd[0],selectStart[0]),Math.min(selectEnd[1],selectStart[1])];
			var ix=Math.abs(selectEnd[0]-selectStart[0])+1
			var jx=Math.abs(selectEnd[1]-selectStart[1])+1
			editor.mezoLista=new Array(ix);
			for(var i=0;i<ix;i++){
				editor.mezoLista[i]=new Array(jx);
				for(var j=0;j<jx;j++){
					editor.mezoLista[i][j]=[editor.selectedChipsetId,min[0]+i,min[1]+j];
				}
			}
			editor.mezoListaS=[ix-1,jx-1];
			editor.start=selectEnd[0]>=selectStart[0]?selectEnd[1]>=selectStart[1]?0:1:selectEnd[1]>=selectStart[1]?2:3;
			editor.setSelectRange();
		}
	}
	this.editorSelectUp=function(evt){
		mouseDown=false;
		editor.mezoLista=[];
		var selectEnd=[(evt.target.left-12)/SIZE,(evt.target.top-47)/SIZE];
		var min=[Math.min(selectEnd[0],selectStart[0]),Math.min(selectEnd[1],selectStart[1])];
		var ix=Math.abs(selectEnd[0]-selectStart[0])+1
		var jx=Math.abs(selectEnd[1]-selectStart[1])+1
		editor.mezoLista=new Array(ix);
		for(var i=0;i<ix;i++){
			editor.mezoLista[i]=new Array(jx);
			for(var j=0;j<jx;j++){
				editor.mezoLista[i][j]=[editor.selectedChipsetId,min[0]+i,min[1]+j];
			}
		}
		editor.mezoListaS=[ix-1,jx-1];//0 jobb-le, 1 jobb-fel, 2 bal-le, 3 bal-fel
		editor.start=selectEnd[0]>=selectStart[0]?selectEnd[1]>=selectStart[1]?0:1:selectEnd[1]>=selectStart[1]?2:3;
		editor.setSelectRange();
	};
	this.forceMouseUp=function(){
		mouseDown=false;
	}
	this.setSelectRange=function(cmd){
		if(cmd=="HIDE"){$('sl1').hide();return}
		this.posSelectRange(this.mezoLista[0][0][1]*SIZE,this.mezoLista[0][0][2]*SIZE,this.mezoLista[0].length*SIZE,this.mezoLista.length*SIZE,$('sl1'));
	}
	this.posSelectRange=function(l,t,h,w,obj){//kijelölõ négyzet beállítása
		obj.l.left=l;
		obj.l.top=t;
		obj.l.height=h+2;
		obj.l.width=2;

		obj.r.left=l+w;
		obj.r.top=t;
		obj.r.height=h+2;
		obj.r.width=2;

		obj.t.left=l;
		obj.t.top=t;
		obj.t.width=w+2;
		obj.t.height=2;

		obj.b.left=l;
		obj.b.top=t+h;
		obj.b.width=w+2;
		obj.b.height=2;

		obj.show()
	}
	this.editorSelected=function(evt){//lenyílólistából kiválasztva a chipset
		var span,i,j,obj;
		obj=GAME.map.getChipset(evt.target.options[evt.target.selectedIndex].value);
		editor.chipTable.erase();
		editor.selectedChipsetId=evt.target.selectedIndex;
		for(var i=-1;i<obj.height;i++){
			for(j=0;j<obj.width;j++){
				span=DIV();
				span.top=i*32+79;
				span.left=j*32+12;
				if(i==-1 && j==0){
				}else if(i==-1){
					span.imageUrl=obj.dynamic[j-1].file;
					span.imagePos=[0,0];
				}else{
					span.imageUrl=obj.file;
					span.imagePos=[j*32,i*32];
				}
				editor.chipTable.appendChild(span);
				span.addEventListener("mousedown",editor.editorSelectDown,true);
				span.addEventListener("mousemove",editor.editorSelectMove,true);
				span.addEventListener("mouseup",editor.editorSelectUp,true);
			}
		}
		editor.selectedChipsetObj=obj;
		var selectRange=DIV();
		selectRange.id="sl1";

		selectRange.className="selran";
		var r=[DIV(),DIV(),DIV(),DIV()];
		selectRange.appendChild(r[0]);selectRange.l=r[0];r[0].className="l";
		selectRange.appendChild(r[1]);selectRange.r=r[1];r[0].className="r";
		selectRange.appendChild(r[2]);selectRange.t=r[2];r[0].className="t";
		selectRange.appendChild(r[3]);selectRange.b=r[3];r[0].className="b";
		editor.chipTable.appendChild(selectRange);
		editor.setSelectRange();
		if(editor.editChipset){
			editor.editChipset.OBJ.className="";
			editor.editChipset.erase();
			editor.editChipset.parentNode.removeChild(editor.editChipset);
			editor.editChipset=false;
		}
	}
	this.createMapEditor=function(){//INIT
		var _div=DIV(),div=DIV();
		_div.className="mapEditor";
		_div.elem("select","select")
		var chipset=map.getChipset();
		for(var item in chipset){
			_div.select.elem("option",undefined,chipset[item].name).value=item;
		}
		_div.select.editor=this;
		_div.select.addEventListener("change",this.editorSelected,true);
		_div.select.selectedIndex=0;
		this.selectedChipsetId=0;
		_div.tableDiv=DIV()
		this.win.setContent(_div);

		//jobb oldali menü
		div.className="jobb";
		var dtitles=["rajzolás","Kitöltés","négyzet rajzolása","kör rajzolása","réteg 1","réteg 2","réteg 3","réteg 4","réteg 5","script réteg","háttér1","háttér2","ismét","vissza","járhatóság","Xmagasság","Xjárhatóság"];
		var ignores=[3,11,12,13];
		for(var i=0;i<dtitles.length;i++){
			var d=DIV();
			d.imageUrl="icons.png";
			d.imagePos=[0,i*42];
			d.id="jobb_"+i;
			d.i=i;
			d.addEventListener("mousedown",function(){this.className=this.className=="downed"?"downed":"down";},true);
			d.addEventListener("mouseup",function(){this.className=this.className=="downed"?"downed":"";},true);
			d.addEventListener("mouseout",function(){this.className=this.className=="downed"?"downed":"";},true);
			d.addEventListener("click",function(event){editor.menuClick(event,this);},true);
			if(arr_find(ignores,i)!=-1){d.hide();}
			d.title=dtitles[i];
			div.appendChild(d);
		}
		_div.appendChild(div);
		this.mapLay=map.containerDiv.elem("div");
		this.mapLay.className="editorDivOnMap";
		this.mapLay.addEventListener("mousedown",this.mapMouseDown,true);
		this.mapLay.addEventListener("mouseup",this.mapMouseUp,true);
		this.mapLay.addEventListener("mousemove",this.mapMouseMove,true);
		this.mapLay.addEventListener("contextmenu",this.mapContext,true);
		var selectRange=DIV();
		this.selectRange=selectRange;
		selectRange.className="selran";
		selectRange.elem("div","l").elem("div","r").elem("div","t").elem("div","b");
		selectRange.hide();
		this.mapLay.appendChild(selectRange);

		_div.elem("div","chipTable");
		this.chipTable=_div.chipTable;
		this.editorSelected({target:_div.select});

		//map scrollers
		var x=DIV().elem("div","l").elem("div","t").elem("div","r").elem("div","b");
		x.l.addEventListener("click",function(){GAME.map.moveMap(-1,0)},false);
		x.r.addEventListener("click",function(){GAME.map.moveMap(+1,0)},false);
		x.t.addEventListener("click",function(){GAME.map.moveMap(0,-1)},false);
		x.b.addEventListener("click",function(){GAME.map.moveMap(0,+1)},false);
		var d=GAME.map.display;
		x.l.top=d.h*16-16
		x.l.left=-32

		x.r.top=d.h*16-16;
		x.r.left=d.w*32;

		x.t.top=-32;
		x.t.left=d.w*16-16

		x.b.top=d.h*32;
		x.b.left=d.w*16-16;

		x.className="terkepNyilak";
		document.body.appendChild(x);
	}
	this.menuClick=function(event,obj){//JOBB MENÜ!
		switch(obj.i){
			case 0:case 1:case 2:case 3:								//rajz.mód választása
				for(var i=0;i<4;i++){
					$("jobb_"+i).className="";
				}
				obj.className="downed";
				editor.rajzMod=obj.i;
			break;
			case 4:case 5:case 6:case 7:case 8:case 9:					//réteg választása
				if(obj.i==9){editor.scriptEdit=true;}else{editor.scriptEdit=false;}//scriptedit
				if($("jobb_11").className=="downed"){
					$('l'+editor.reteg).alpha=50;
				}
				for(var i=4;i<10;i++){
					$("jobb_"+i).className="";
				}
				obj.className="downed";
				editor.reteg=obj.i-4;
				if($("jobb_11").className=="downed"){
					$('l'+editor.reteg).alpha=100;
				}
			break;
			case 10:													//lila háttér
				if(obj.className=="downed"){
					this.mapLay.parentNode.style.background=this.mapLay.parentNode.bgbak;
				}else{
					this.mapLay.parentNode.bgbak=this.mapLay.parentNode.style.background;
					this.mapLay.parentNode.style.background="#E600E6";
				}
				obj.className=obj.className=="downed"?"":"downed";
			break;
			case 11:													//átlátszó rétegek
				/*if(obj.className!="downed"){
					for(var i=0;i<5;i++){
						$('l'+i).alpha=50;
					}
					$('l'+editor.reteg).alpha=100;
				}else{
					for(var i=0;i<5;i++){
						$('l'+i).alpha=100;
					}
				}
				obj.className=obj.className=="downed"?"":"downed";*/
			break;
			case 12:case 13:											//vissza/ismét
				editor.historyMove(obj.i==12?-1:1);
			break;
			case 14:													//járhatóság a térképen ki/be
				if(obj.className=="downed"){
					editor.jarhatosagTorol();
				}else{
					editor.jarhatosagRajzol();
				}
				obj.className=obj.className=="downed"?"":"downed";
			case 15:													//magasság ki/be
				if(obj.className=="downed"){
					editor.editChipset.erase();
					editor.editChipset.parentNode.removeChild(editor.editChipset);
					editor.editChipset=false;
					obj.className="";
				}else{
					if(editor.editChipset){
						editor.editChipset.OBJ.className="";
						editor.editChipset.erase();
						editor.editChipset.parentNode.removeChild(editor.editChipset);
						editor.editChipset=false;
					}
					editor.editChipset=DIV();
					editor.editChipset.className="editChipset";
					var cs=map.getChipset(editor.selectedChipsetId);
					console.log("cs1:",cs,editor.selectedChipsetId);
					for(var i=0;i<cs.width;i++){
						for(var j=0;j<cs.height+1;j++){
							span=DIV();
							span.left=i*32+12;
							span.top=j*32;
							span.x=j;
							span.y=i;
							span.innerHTML=cs.prior[j][i];
							span.c=editor.selectedChipsetId;
							editor.editChipset.appendChild(span);
							span.q=0;
							span.addEventListener("click",function(e){
									this.innerHTML=(this.innerHTML*1+1)%6;
									GAME.map.setChipsetTo(editor.selectedChipsetId,this.x,this.y,"prior",this.innerHTML*1);
							},true);
							span.addEventListener("contextmenu",function(e){
									this.q++;
									if(this.q%3==0){
									this.innerHTML=(this.innerHTML*1+5)%6;
									GAME.map.setChipsetTo(editor.selectedChipsetId,this.x,this.y,"prior",this.innerHTML*1);
									}
							},true);
							span.className="a";
						}
					}
					editor.editChipset.OBJ=obj;
					editor.chipTable.parentNode.appendChild(editChipset);
					obj.className="downed";
				}
			break;
			case 16:													//irányzék ki/be
				if(obj.className=="downed"){
					editor.editChipset.erase();
					editor.editChipset.parentNode.removeChild(editor.editChipset);
					editor.editChipset=false;
					obj.className="";
				}else{
					if(editor.editChipset){
						editor.editChipset.OBJ.className="";
						editor.editChipset.erase();
						editor.editChipset.parentNode.removeChild(editor.editChipset);
						editor.editChipset=false;
					}
					editor.editChipset=DIV();
					editor.editChipset.className="editChipset";
					var cs=map.getChipset(editor.selectedChipsetId);
					var cl=function(){//kattintás esemény
							if(this.k==2){//középsõ
								if(this.q==2 || this.q==1){this.q=0;}else{this.q=1;}
								GAME.map.setChipsetTo(editor.selectedChipsetId,this.parentNode.y,this.parentNode.x,"jarhato",this.parentNode.bm=this.q?15:0);
								for(var i=0;i<5;i++){
									this.parentNode.childNodes[i].imagePos=[[8,0,8,0,8][i]+(this.q?0:24),[0,16,8,0,24][i]];
									this.parentNode.childNodes[i].q=this.q;
								}
							}else{//oldalsó
								var k=this.k>2?this.k-1:this.k;
								this.imagePos=[[8,0,0,8][k]+(this.q?24:0),[0,16,0,24][k]];
								this.q=this.q==1?0:1;
								GAME.map.setChipsetTo(editor.selectedChipsetId,this.parentNode.y,this.parentNode.x,"jarhato",this.parentNode.bm=this.parentNode.bm^[1,4,8,2][k]);
								if(this.parentNode.bm==0){
									this.parentNode.childNodes[2].imagePos=[32,8];
								}else if(this.parentNode.bm==15){
									this.parentNode.childNodes[2].imagePos=[8,8];
								}else{
									this.parentNode.childNodes[2].imagePos=[48,0];
								}
							}
						}//kattintás esemény vége
					for(var i=0;i<cs.width;i++){
						for(var j=0;j<cs.height+1;j++){
							span=DIV();
							var bm=cs.jarhato[j][i];
							span.title=bm;
							for(var k=0;k<5;k++){
								var ds=DIV();
								ds.left=[8,0,8,24,8][k];
								ds.top =[0,8,8,8,24][k];
								ds.height=[8,16,16,16,8][k];
								ds.width =[16,8,16,8,16][k];
								span.appendChild(ds);
								//1 fel 2 le 4 bal 8 jobb
								ds.k=k;
								if(k==2){
								ds.style.cursor="move";
								}
								if(k==0 && bm&1 || k==4 && bm&2 || k==1 && bm&4 || k==3 && bm&8 || k==2 && bm==15){
									ds.imagePos=[[8,0,8,0,8][k],[0,16,8,0,24][k]];
									ds.q=1;//igaz
								}else if(bm!=0 && k==2){
									ds.imagePos=[48,0];
									ds.q=2;//vegyes
								}else{
									ds.imagePos=[[8,0,8,0,8][k]+24,[0,16,8,0,24][k]];
									ds.q=0;//hamis
								}
								ds.addEventListener("click",cl,true);
							}
							span.bm=bm;
							span.left=i*32+12;
							span.top=j*32;
							span.x=i;
							span.y=j;
							span.className="b";
							editor.editChipset.appendChild(span);

						}
					}

					editor.editChipset.OBJ=obj;
					editor.chipTable.parentNode.appendChild(editChipset);
					obj.className="downed";
				}
			break;
			default:
					console.log("egyéb fLa",event,obj,"???");
			break;
		}
	}

	this.jarhatosagRajzol=function(){
		if(this.jarhatoReteg==undefined){
			var l=DIV();
			l.className="jarhatoReteg";
			this.mapLay.parentNode.insertBefore(l,this.mapLay);
			this.jarhatoReteg=l;
		}else{
			var l=this.jarhatoReteg;
			l.erase();
		}
		l.show();
		var x=DIV();
		for(var i=0;i<map.display.h;i++){
			for(var j=0;j<map.display.w;j++){
				var d=DIV();
				d.color=map.isJarhato(i+map.display.x,j+map.display.y)?"green":"red";
				d.left=i*SIZE;
				d.top=j*SIZE;
				d.height=SIZE;
				d.width=SIZE;
				d.style.zIndex=80;
				x.appendChild(d);
			}
		}
		x.height=i*SIZE;
		x.width=j*SIZE;
		x.alpha=30;
		l.appendChild(x);
		editor.jarhatosagBekapcsolva=true;
	}
	this.jarhatosagTorol=function(){
		this.jarhatoReteg.hide();
		editor.jarhatosagBekapcsolva=false;
	}
	this.event2pos=function(e){
		var c=map.canvas?1:0;
		if(e.originalTarget==editor.mapLay){
		return [Math.floor((e.layerX)/32)+map.display.x+c,//ABSX
				Math.floor((e.layerY)/32)+map.display.y+c,//ABSY
				Math.floor((e.layerX)/32),//RELX
				Math.floor((e.layerY)/32)];//RELY
		}else{
		return [Math.floor((e.clientX-100)/32)+map.display.x+c,//ABSX
				Math.floor((e.clientY-30)/32)+map.display.y+c,//ABSY
				Math.floor((e.clientX-100)/32),//RELX
				Math.floor((e.clientY-30)/32)];//RELY
		}
	}
	this.mapContext=function(evt){//TÉRKÉP JOBBCLICK
		editor.mezoListaS=[0,0];
		editor.mezoLista=[[map.getMezoCopy(editor.mapClickStart[0],editor.mapClickStart[1],editor.reteg)]];
		evt.stopPropagation();
		return false;
	}
	this.mapMouseDown=function(evt){//TÉRKÉP EGÉR LE(rajzolás kezdete)
		try{
		if(editor.insertMode!=-1){//Tárgy beszúrási mód
			var data=editor.insertConfig;
			data.pos=editor.event2pos(evt);
			data.pos.x=data.pos[0]
			data.pos.y=data.pos[1]
			var c=new Targy(data);
			editor.insertMode=-1;
			return;
		}
		mouseDown=true;
		editor.mapClickStart=editor.event2pos(evt);
		if(evt.button==1 || evt.button==0){

			//var x=editor.mezoLista[editor.start%2?0:editor.mezoListaS[0]][editor.start>2?0:editor.mezoListaS[1]];
			//map.generateMezo(editor.reteg,editor.mapClickStart[1],editor.mapClickStart[0],x,false);


			var mapBackup=map.getActivMapData(editor.rajzMod==1?"full":"visible");
			editor.mapBackup=mapBackup;
			editor.OriginalMapBackup=map.getActivMapData(editor.rajzMod==1?"full":"visible");

			editor.lastMovePos=[-1,-1];
			if(editor.rajzMod==0){
				editor.mapMouseMove(evt);
			}else if(editor.rajzMod==1){//kitöltés
				var mpc=[editor.mapClickStart[0],editor.mapClickStart[1]];
				var sor=[mpc];
				var mit_tolt=mapBackup.data[mpc[0]][mpc[1]][editor.reteg].toString();//ezt a típust írja felül
				if(mit_tolt==editor.mezoLista[0][0]){return;}
				while(sor.length>0){
					var s=sor.shift();
					//console.log("s",s,map.debdiv(s[0],s[1]));
					if(!inRange(0,s[0],map.display.absW-1) || !inRange(0,s[1],map.display.absH-1)){
						//console.log("kint");
						continue;
					}//kilóg
					if(mapBackup.data[s[0]]==undefined || mapBackup.data[s[0]][s[1]]==undefined){continue;}
					if(mapBackup.data[s[0]][s[1]][editor.reteg].toString()==mit_tolt){
						//console.log("added");
						mapBackup.set(s[0],s[1],editor.reteg,editor.calculateMezoPos(s[0],s[1],mpc));
						editor.erintettMezok.push(s);
						sor.push([s[0]-1,s[1]]);
						sor.push([s[0]+1,s[1]]);
						sor.push([s[0],s[1]-1]);
						sor.push([s[0],s[1]+1]);
					}
				}
				mapBackup.end(true);
				mouseDown=false;
			}
		}
		}catch(e){exception(e,"down");}
	}
	this.mapMouseUp=function(evt){//TÉRKÉP EGÉR FEL(rajzolás vége
		if(mouseDown){
			mouseDown=false;
			var end=editor.event2pos(evt);
			var list=map.keresTargy({x:end[0],y:end[1]});
			if(editor.scriptEdit && list.length>0){
				scriptEditor(list[0]);
				return;
			}
			if(editor.rajzMod!=1){
				editor.mapBackup.end(true);
				//map.forceGenerate();
			}
			editor.historyObject[++editor.historyPointer]=editor.OriginalMapBackup;
			editor.historyLength=editor.historyPointer;
			/*if(editor.jarhatosagBekapcsolva){
				for(var i=0;i<editor.erintettMezok.length;i++){
					var p=map.isJarhato(editor.erintettMezok[i][0],editor.erintettMezok[i][1]);
					$("jar_"+editor.erintettMezok[i][0]+"_"+editor.erintettMezok[i][1]).color=p?"green":"red";
				}
			}*/
		}
	}

	this.calculateMezoPos=function(i,j,pos){
		return editor.mezoLista[(i+pos[0]-editor.mapClickStart[0]+editor.mezoListaS[0]*100)%(editor.mezoListaS[0]+1)][(j+pos[1]-editor.mapClickStart[1]+editor.mezoListaS[1]*100)%(editor.mezoListaS[1]+1)];
	}
	this.mapMouseMove=function(evt){//TÉRKÉP EGÉR MOZGATÁS(rajzolás)
		try{
		var pos=editor.event2pos(evt);
		if(editor.lastMovePos[0]==pos[0] && editor.lastMovePos[1]==pos[1]){return;}
		editor.lastMovePos=pos;
		var s=editor.start;
		var l=editor.mezoListaS;
			document.title=pos.toString()

		if(mouseDown && editor.scriptEdit==false){
			var p;
			if(editor.rajzMod==0){//ceruza
				for(var i=0;i<=l[0];i++){
					for(var j=0;j<=l[1];j++){
						p=[pos[0]-(s>1?0:l[0])+i,pos[1]-(s%2?0:l[1])+j];
						//if(p[0]<0 || p[1]>=map.display.w || p[1]<0 || p[0]>=map.display.h){continue;}
						//if(p[0]<0 || p[0]>map.display.h || p[1]<0 || p[1]>map.display.w){continue;}
						editor.mapBackup.set(
							pos[0]-(s>1?0:l[0])+i,
							pos[1]-(s%2?0:l[1])+j,
							editor.reteg,
							editor.calculateMezoPos(i,j,pos),true
						);
					}
				}
				editor.mapBackup.end(false);
			}else if(editor.rajzMod==1){
				//KÉSZ
			}else if(editor.rajzMod==2){//négyzet
				var from=[Math.min(pos[2],editor.mapClickStart[2]),Math.min(pos[3],editor.mapClickStart[3])];
				var to = [Math.max(pos[2],editor.mapClickStart[2]),Math.max(pos[3],editor.mapClickStart[3])];
				editor.mapBackup=copy(editor.OriginalMapBackup);
				for(var i=from[0];i<=to[0];i++){
					for(var j=from[1];j<=to[1];j++){
						editor.mapBackup.set(i,j,editor.reteg,editor.calculateMezoPos(i,j,pos));
					}
				}
				map.setActivMapData(editor.mapBackup);
				//map.forceGenerate();
			}else if(editor.rajzMod==3){/* //kör DISABLED

				var from=[Math.min(pos[0],editor.mapClickStart[0]),Math.min(pos[1],editor.mapClickStart[1])];
				var to = [Math.max(pos[0],editor.mapClickStart[0]),Math.max(pos[1],editor.mapClickStart[1])];
				var size=[(to[0]-from[0]),(to[1]-from[1])];
				var s2=[Math.floor(size[0]/2),Math.floor(size[1]/2)]
				var tmp=copy(editor.mapBackup);
				var d=Math.max(size[0],size[1]);
				var df=new Array(size[0]);
				for(var i=0;i<=size[0];i++){df[i]=new Array(size[1]);for(var j=0;j<=size[1];j++){df[i][j]=0;}}

				for(var r=0;r < 6.28;r+=1/d){
					var px=Math.round(Math.sin(r) *s2[0]+s2[0]);
					var py=Math.round(Math.cos(r) *s2[1]+s2[1]);
					df[px][py]=1;
				}

				for(var i=0;i<=size[0];i++){
					for(var f=0;f<=size[1];f++){if(df[i][f]==1){break;}}
					for(var j=size[1];j>f;j--){
						if(df[i][j]==1){break;}
						//df[i][j]=1;
					}
				}
				dmg="";
				for(var i=0;i<size[0];i++){
					for(var j=0;j<size[0];j++){
						dmg+=df[i][j]+" ";
					}
					dmg+="|\r\n";
				}
				console.log("dmg Xlp",dmg);

				for(var i=from[0];i<=to[0];i++){
					for(var j=from[1];j<=to[1];j++){
						if(df[i-from[0]][j-from[0]]==1){
							tmp[j][i]=editor.calculateMezoPos(i,j,pos);
						}
					}
				}
				//map.forceGenerate();
				// */
			}else{
				console.log("move","noRajzMod",evt,editor.rajzMod);
			}
		}
		//befoglaló négyzet
		if((editor.scriptEdit && map.keresTargy({x:pos[0],y:pos[1]}).length>0) || !editor.scriptEdit){
			editor.posSelectRange(
				(pos[0]-(s>1?0:l[0]))*32-map.display.x*32-32,
				(pos[1]-(s%2?0:l[1]))*32-map.display.y*32-32,
				32*l[1]+32,
				32*l[0]+32,
				editor.selectRange);
		}
		}catch(e){exception(e,"move");}
	}
	this.historyMove=function(num){
		while(num!=0){
			if(num<0){//vissza
				if(0<=this.historyPointer-1){
					this.historySet(this.historyObject[--this.historyPointer]);
				}
				num++;
			}else{//elõre
				if(this.historyLength>=this.historyPointer+1){
					this.historySet(this.historyObject[++this.historyPointer]);
				}
				num--;
			}
		}
	}
	this.historySet=function(obj){
		console.log("HISTORY",obj);
		if(obj.layer=="all"){
			console.log("all");
			map.terkep=obj.m;
			for(var i=0;i<5;map.generateLayer(i++));
		}
		map.generateLayer(obj.layer,obj.m);
	}
	this.win=new Win({height:665,width:335,title:"map editor"});
	this.win.x=winPos[0][0];
	this.win.y=winPos[0][1];
	this.win.show();
	this.createMapEditor();
}
function createEditorMenu(){
	var w=new Win({height:183,width:77,title:"edit-it"});
	this.w.x=winPos[1][0];
	this.w.y=winPos[1][1];
	var bl=DIV();
	bl.className="bt6b leftEditorMenuList";
	bl.elem("button","map","térkép");
	bl.elem("button","script","script");
	bl.elem("button","game","játék");
	bl.elem("button","items","tárgyak");
	bl.elem("button","o1","");
	bl.elem("button","o2","");
	bl.elem("button","o3","");

	bl.map.addEventListener("click",function(){editor();this.disabled=true;},false);
	bl.script.addEventListener("click",function(){var e=scriptEditor();this.disabled=true;},false);
	bl.game.addEventListener("click",function(){},false);
	bl.items.addEventListener("click",function(){},false);
	bl.o1.addEventListener("click",function(){},false);
	bl.o2.addEventListener("click",function(){},false);
	bl.o3.addEventListener("click",function(){},false);
	w.setContent(bl);
}

var EditInsertTargy=function(){
	var self=this;
	var init=function(){
		this.win=new Win({height:77,width:425,title:"beszúrás"});
		this.win.x=winPos[2][0];
		this.win.y=winPos[2][1];
		this.win.show();

		var buttonList=["tárgy","NPC","szörny","akadály"];
		var buttonDivs=DIV();
		buttonDivs.className="insetTargyDivList"
		for(var i=0;i<buttonList.length;i++){
			var x=buttonDivs.elem("div",undefined,buttonList[i]);
			x.style.backgroundPosition="-"+(i*44)+"px 0";
			x.i=i;
			x.t=self;
			x.addEventListener("click",function(x){return function(){console.log(x.t,x.i);x.t.cl(x.i);}}(x),false);
		}
		var buttonList=["mentés","betöltés","beállítások","játék"];
		for(var i=0;i<buttonList.length;i++){
			var x=buttonDivs.elem("div",undefined,buttonList[i]);
			x.style.backgroundPosition="-"+(i*44+44*4)+"px 0";
			x.i=i;
			x.t=self;
			if(i!=0){x.alpha=20;continue;}
			x.addEventListener("click",function(){this.t.cm(this.i);},false);
		}
		this.win.appendChild(buttonDivs);
	}
	this.cm=function(n){
		if(n==0){//save
			if(location.href.match("127.1")!==undefined){
				var out={};
				out.map=GAME.map.getTerkep()
				out.chipset=GAME.map.getChipset();
			var targyak=[];
			var list=["Touch","Action","BeforeLv","Push","AfterLv","Enter","user1","user2","user3"];
			for(var i=0;i<GAME.map.targyak.length;i++){
				var targy=GAME.map.targyak[i].C;
				targy.evt={};
				console.log("targy:",targy);
				for(var j=0;j<list.length;j++){
					if(GAME.map.targyak[i]["on"+list[j]].c.length>0){
						targy.evt["on"+list[j]]=GAME.map.targyak[i]["on"+list[j]];
					}
				}
				targyak.push(targy);

			}
				out.targyak=targyak;
				var win=new Win({height:500,width:500,title:"mentés"});
				win.show();
				win.setContent(DIV().append("másold ki az alábbi mentési kódot:",elem("textarea",undefined,out.toSource()).Style({height:"100%",width:"100%",fontSize:"7px",color:"red"}).Property({contMen42:42})));
				return;
			}
			loader.saveToFile("@map.js",GAME.map.getTerkep());
			loader.saveToFile("@chipset.js" ,GAME.map.getChipset());
			var targyak=[];
			var list=["Touch","Action","BeforeLv","Push","AfterLv","Enter","user1","user2","user3"];
			for(var i=0;i<GAME.map.targyak.length;i++){
				var targy=GAME.map.targyak[i].C;
				targy.evt={};
				console.log("targy:",targy);
				for(var j=0;j<list.length;j++){
					if(GAME.map.targyak[i]["on"+list[j]].c.length>0){
						targy.evt["on"+list[j]]=GAME.map.targyak[i]["on"+list[j]];
					}
				}
				targyak.push(targy);

			}
			//console.log(targyak);
			loader.saveToFile("@targyak.js",targyak);
		}
		if(n==1){//load
			var win=new Win({height:500,width:500,title:"mentés"});
				win.show();
				win.setContent(DIV().str("fejlesztés alatt"));
				//win.setContent(DIV().append("illeszd be a mentett pályát:",elem("textarea",undefined,).Style({height:"100%",width:"100%",fontSize:"7px",color:"red"}).Property({contMen42:42})));
		}
	}
	this.defaultTargyConfig4All={
		charsetNum:3
	}
	this.defaultTargyConfig=[{
		/*tárgy*/
		jarhato:true,
		category:0,
		Action:{c:[["showText","tárgy"]]}
		},{
		/*NPC*/
		jarhato:false,
		name:"névtelen",
		category:1,
		Touch:{c:[["showText","szia, $nev vagyok"]]}
		},{
		/*szörny*/
		category:2,
		jarhato:false
		},{
		/*akadály*/
		jarhato:false,
		category:3
		//charset:null
	}];
	this.cl = function(i){
		var editor=this;
		editor.insertConfig=merge(this.defaultTargyConfig4All,this.defaultTargyConfig[i]);
		editor.insertMode=editor.insertMode==i?-1:i;
		console.log(editor.insertMode);
	}
	init();
}
//createEditorMenu();
