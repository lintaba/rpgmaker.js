// ize#loader.js by lintabá (copyright), 2010
if('\v'=='v'){//is_ie
	document.write("A játék csak igazi böngészõvel játszható!");
}
//function haha(){return 42;}
if(false){//nincs manuális konzol
	if(window.console==undefined){
		window.console={error:function(){console.log.apply(console,arguments);},log:function(){
			if(this.a){
				try{
					this.obj=document.createElement("div");
					document.body.appendChild(this.obj);
					with(this.obj.style){
						height="250px";
						width="350px";
						right="20px";
						top="20px";
						border="2px inset black";
						position="fixed";
					}
					this.a=false;
				}catch(e){}}
			var sor=document.createElement("div");
			var mk=function(a){
				var q=document.createElement("span");
				switch(typeof a){
					case "string":q.style.color="red";q.textContent='"'+a+'"';break;
					case "number":q.style.color="blue";q.textContent=a;break;
					case "boolean":q.style.color="brown";q.textContent=a?"true":"false";break;
					case "function":q.style.color="green";q.textContent=a.name+"()";q.title=a.toString();break;
					case "undefined":with(q.style){color="white";backgroundColor="gray";border="1px solid black";}q.textContent="undefined";break;
					case "object":
						if(a==null){
							with(q.style){color="white";backgroundColor="gray";border="1px solid black";}
							q.textContent="null";
					break;
						}
						if(a instanceof Array){
							q.appendChild(document.createTextNode("["));
							for(var i=0;i<a.length;i++){
								q.appendChild(arguments.callee(a[i]));
								if(i!=a.length-1){q.appendChild(document.createTextNode(", "));}
							}
							q.appendChild(document.createTextNode("]"));
					break;
						}
						with(q.style){color="green";fontWeight="bold";}
						if(typeof q.toSource=="function"){q.textContent="Object "+q.toSource();}else{q.textContent="{Object Object}";}
					break;
				}
				q.style.marginRight="2px";
				q.style.paddingRight="2px";
				return q;
			}
			for(var i=0;i<arguments.length;i++){
				sor.appendChild(mk(arguments[i]));
			}
			this.obj.appendChild(sor);
		},obj:false,a:true};
	}
}
window.__defineGetter__("___",function(){//konzol engedélyezve
	return "lintabá";
	console.error("A firebug használata a játék során tilos!");
	try{
	if (! ('console' in window) || !('firebug' in console)) {
		var names = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
		window.console = {};
		for(var i=0;i<names.length;++i)window.console[names[i]]=function(){};
	}
	}catch(e){}try{
	var x=document.getElementById("_firebugConsole")
	x.parentNode.removeChild(x);
	delete x;
	}catch(e){}try{
	loader.lock();
	}catch(e){}
});
var loader={
	jsn:1,
	onLoadJs:null,
	nAt:1,
	loadFile:function(f,n){
		var t=f.split(".").pop();
		var r;
		if(t=="js"){
			r=document.createElement('script');
			r.type="text/javascript";
			document.getElementsByTagName("head")[0].appendChild(r);
			if (r.readyState){
				r.onreadystatechange=function(){
					if(r.readyState=="loaded"||r.readyState=="complete"){
						loader.jsn--;
						r.onreadystatechange=null;
						r.parentNode.removeChild(r);
						loader.loadedFile(f,n);

				}
				};
			}else{
				r.onload = function(){loader.jsn--;r.parentNode.removeChild(r);loader.loadedFile(f,n);};
			}
			r.src=f+(!getConf("cache",true)?"?rn"+Math.floor(Math.random()*1000):"");
			this.jsn++;
			return;
		}else if(t=="css"){
			r=document.createElement("link");
			r.setAttribute("rel", "stylesheet");
			r.setAttribute("type", "text/css");
			r.setAttribute("href", f+(!getConf("cache",true)?"?"+Math.floor(Math.random()*1000):""));
			loader.loadedFile(f,n);
		}else if(t=="jpg" || t=="png" || t=="gif"){
			r=new Image();
			r.src=f;
			r.onload=function(){loader.loadedFile(f,n);}
			r.onerror=function(){loader.loadedFail(f,n);}
			return;
		}else{
			loader.loadedFile(f,n);
			return;
		}
		document.getElementsByTagName("head")[0].appendChild(r);
	},
	loadJson:function(url){
		//if(url[0]=="@"){if(location.protocol=="http:"){url="load.php?f="+url+"&n="+this.nAt;}else{url="@/"+this.nAt+"/"+url;}}
		if(url[0]=="@"){if(location.protocol=="http:"){url="load.json";}else{url="@/"+this.nAt+"/"+url;}}
		var l=new XMLHttpRequest();
		l.open("GET",url,false);
		l.overrideMimeType("text/plain");
		l.send(false);
		try{
			var r=eval(l.responseText);
			return r;
		}catch(e){
			return function(l,e){exception(e,"JSON FELDOLGOZÁSI HIBA"); return {}}(l,e)
		}
	},
	saveToFile:function(url,data){
		url="save.php?f="+url+"&n="+this.nAt;
		var l=new XMLHttpRequest();
		l.open("POST",url,false);
		if(isString(data)){
			data="data="+B64_encode(data);
		}else{
			data="data="+B64_encode(data.toSource());
		}
		l.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		l.setRequestHeader("Content-length", l.length);
		l.setRequestHeader("Connection", "close");
		l.send(data);

	},
	loadedFile:function(obj,n){
		if(this.jsn==0 && this.onLoadJs!=null){this.onLoadJs();this.onLoadJs=null;}
		this.loadingList[n][2](this.loadingList[n]);
		if(this.loadingList[n][1]--<2){this.loadingList[n][0]();};

	},
	loadedFail:function(obj,n){
		if(window.console!=undefined){console.warn("NOT LOADED:",obj);}
		if(this.loadingList[n][1]--<2){this.loadingList[n][0]();};
	},
	load:function(obj,onFinish,onEach){
		if(typeof onFinish!="function"){onFinish=function(){}}
		if(typeof onEach!="function"){onEach=function(){}}
		this.loadingList.push([onFinish,obj.length,onEach,obj]);
		var n=this.loadingList.length-1;
		for(var i=0;i<obj.length;i++){
			this.loadFile(obj[i],n);
		}
	},
	Percent:0,LoadingText:"Programkód betöltése",Sub:"",
	LD:function(txt,prc,sub){this.LoadingText=txt;this.Percent=prc;this.Sub=sub;this.regenLoadbar();},
	regenLoadbar:function(){
		if(this.loadbar==undefined){
			var lb=document.createElement("div");
			lb.className="loadingArea";
			var txt=document.createElement("div")
			txt.className="txt";
			var subtxt=document.createElement("div")
			subtxt.className="subtxt";
			var status=document.createElement("div")
			status.className="status";
			var substat=document.createElement("div")
			substat.className="substat";
			lb.txt=txt;
			lb.subtxt=subtxt;
			lb.appendChild(txt);
			lb.appendChild(subtxt);
			lb.status=status;
			lb.appendChild(status);
			status.substat=substat;
			status.appendChild(substat);

			if(document.body){
				this.loadbar=lb;
				document.body.appendChild(lb);
			}
		}
		if(this.loadbar){
			this.loadbar.subtxt.textContent=this.Sub;
			this.loadbar.subtxt.title=this.Sub;
			this.loadbar.txt.textContent=this.LoadingText;
			this.loadbar.txt.title=this.LoadingText;
			if(this.Percent<0){with(this.loadbar.status.substat){color="red";style.width="100%";innerHTML="hiba";style.fontSize="8px";style.textAlign="center";style.paddingTop=0};
				return;}
			this.loadbar.status.substat.style.width=this.Percent+"%";
			this.loadbar.status.substat.title=Math.round(this.Percent)+"%";
			if(this.Percent>99){this.loadbar.style.display="none";}
		}
	},
	loadingList:[],
	lock:function(){for(var sor in this){if(typeof this[sor]=="function"){this[sor]=function(){};}else{this[sor]=undefined}}},
	bl:function(){//onLoad-re ez indítja be a dolgokat
		//loader.load(document.getElementsByTagName("script")[0].innerHTML.split(","),function(){init();},function(){if(loader.percent%5!=0){loader.percent=5;}else{loader.percent+=5}});
		loader.load(document.getElementsByTagName("script")[0].innerHTML.split(";")[0].split(","),function(){init();},function(a){loader.Percent+=10/a[3].length;loader.regenLoadbar()});
		loader.bl=function(){}
	}

}
if(window.console){___}
window.onload=loader.bl;

document.onerror=function(e){console.warn(e);alert("az oldalon valami hiba történt, technikai részletek:\n"+e.fileName+":"+e.lineNumber+"#"+e.message);}

var getConf=function(){
	var GAME;
	if(GAME==undefined){GAME={};}
	GAME.CONFIG={
	};
	var c=document.getElementsByTagName("script")[0].innerHTML.split(";")
	if(c.length>1){
		c.shift()
		c=c.join(";");
		eval("GAME.CONFIG="+c);
	}
	return function(val,def){return GAME.CONFIG[val]==undefined?def:GAME.CONFIG[val];}
}()
//function getConf(val,def){return GAME.CONFIG[val]==undefined?def:GAME.CONFIG[val];}
function haha(){return [
"polimorfok inicializálása",
"vektormaszkrészecske-kompútáció",
"energiaegyensúly kibillentése",
"ingerületátvitel gyorsítása",
"lehetetlen lehetõvé tétele",
"kávé elfogyasztása",
"tuningolás",
"inverz negálása",
"tavaszi nagytakarítás",
"csalók diszkvalifikálása",
][Math.floor(Math.random()*8)]}
function init(){
	try{
	//config betöltése

	loader.LD("Inicializálás",10,haha());
	document.title=getConf("title","Izé! (By lintabá) v11.02");
	var c=["elem","_Map","Targy"];
	for(var i=0;i<c.length;i++){
		if(window[c[i]]==undefined){
			loader.LD("szintaktikai hiba:",-100,c[i]);return;
		}
	}
	loader.loadingText="Képek letöltése";
	if(GAME==undefined){GAME={};}



	GAME.n=1;//KÉSÕBBI HASZNÁLATRA: itt dõl el, hogy melyik játékot tölti be!
	loader.LD("Adatok letöltése",12.5,haha());
	//GAME.data=loader.loadJson("load.php?op=load&n="+GAME.n);
	GAME.data=loader.loadJson("load.json");
	loader.LD("kicsomagolás",15,haha());
//betölti az adatokat(chipset,charset,imgset)
	GAME.charsetImages=GAME.data.charsets;
	loader.LD("Képek elõkészítése",17.5,haha());
	try{
		var loadImages=loader.loadJson("images.json");
		for(var i=0;i<GAME.data.map.length;i++){
			for(var j=0;j<GAME.data.map[i].chipsets.length;j++){
				loadImages.push(GAME.data.chipsets[GAME.data.map[i].chipsets[j]].file);
			}
			if(GAME.data.map[i].background){loadImages.push(GAME.data.map[i].background);}
		}
		for(var i=0;i<GAME.data.targyak.length;i++){
			var a=GAME.data.targyak[i].charsetNum;
			if(a==undefined){continue;}
			loadImages.push(getCharsetData(a).src);
		}
	}catch(e){
		exception(e,"képsortöltési hiba");
	}
	loader.LD("Képek letöltése",20,haha());

	loader.load(unique(loadImages),function(){//képek betöltve
	try{
		loader.LD("Térkép generálása...",40,haha());
		var map=new _Map();
		map.canvas=getConf("canvas",true);
		map.addMaps(GAME.data.map);
		map.setChipset(GAME.data.chipsets);
		map.drawMapFromSkratch();
		GAME.map=map;
		map.resize(getConf("width",5),getConf("height",5))
		loader.LD("játékos generálása",60,haha());
		var targyak=GAME.data.targyak;
		var leptek=25/targyak.length;
		var player=new Targy(targyak[0]);
		loader.Percent+=leptek;
		loader.regenLoadbar();
		for(var i=1;i<targyak.length;i++){
			loader.LD(i+". tárgy generálása",loader.Percent+leptek,haha());
			var t=new Targy(targyak[i]);
		}
		GAME.scripts=GAME.data.script;
		loader.LD("indítás",85,haha());
		keyboard.init();
		if(window.ScriptEditor==undefined){
			loader.LD("indítás mint játék",95,haha());
			keyboard.focus(player);
			if(GAME.scripts){call(GAME.scripts.onload,{owner:null,evt:null,type:"onLoad"})}
		}else{
			loader.LD("indítás mint szerkesztõ",95,haha());
			keyboard.focus(map);
			GAME.editor=new Editor();
			new EditInsertTargy();
		}
		loader.LD("kész",100,"");
	}catch(e){loader.LD("betöltési hiba",-100,e);exception(e,"betöltési dzsuva");}

		if(getConf("scroll",false)){



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



	},function(a){loader.percent+=30/a[3].length});
	loader.loadingText="Betöltés...";
	}catch(e){
		loader.LD("Betöltési hiba",-100,e.message);
		exception(e,"betöltés.huba");
	}


}
