
// ize#_map.js by lintaba (copyright), 2009

var _Map=function(){
	this.toString=function(){return (this.canvas?"canvas":"html")+" map (-:"}
	var terkep_gyujtemeny=[{d:[[[]]]}];
	var terkep=terkep_gyujtemeny[0].d;
	var chipset={};
	var tgm=[];
	this.repeatMode=true;
	this.display={w:0,h:0,lat:2,plus:0,x:0,y:0,absH:0,absW:0};
	this.canvas=true;
	this.halfCanvas=false;
	this.multiBg=false;//bugos, css3 multiplaBackground kell hozzá, csak hibásan mûködik
	this.activMap=0;
	this.objMask=[];
	this.Filter=false;
	this.charCache=[];
	var map=this;
	this.filter=function(f,p){this.Filter=f;this.filter_conf=p;this.GEN();};
	//this.__defineSetter__("filter",function(t){if(this.Filter!=t){this.Filter=t;this.GEN();}});
	this.addMaps=function(arr){
		/*
		[{//egy tömb, hogy szükség esetén többet is be lehessen tölteni
		dimension:0,//dimenzió, pl szobák/házak belsejéhez másik dimenzióba mutat
		relative:[0,0],//honnan kezdje a térkép felépítését
		data:[[[1,1,1]],[[1,1,2]]],//adathalmaz,[X][Y][Z]=[,,]
		chipsets:[0,1]//melyik charset-ek kellenek hozzá(ID)
		}]*/
	
		for(var i=0;i<arr.length;i++){
			terkep_gyujtemeny[i]=arr[i];
			var wt=terkep_gyujtemeny[arr[i].dimension]
			wt.d=[];
			if(wt.chipsets==undefined){wt.chipsets=arr[i].chipsets;}else{wt.chipsets.push.apply(wt.chipsets,arr[i].chipsets);}
			for(var x=0;x<arr[i].data.length;x++){
				if(wt.d[x+arr[i].relative[0]]==undefined){wt.d[x+arr[i].relative[0]]=[];}
				for(var y=0;y<arr[i].data[x].length;y++){
					wt.d[x+arr[i].relative[0]][y+arr[i].relative[1]]=arr[i].data[x][y];
				}
			}
			if(this.activMap==arr[i].dimension){terkep=wt.d;this.display.absW=terkep.length;this.display.absH=terkep[0].length;}
		}
	}
	this.setChipset=function(_){for(var chip in _){chipset[chip]=_[chip];};};
	this.getChipset=function(_){return _!=undefined?chipset[_]:chipset;};
	this.setChipsetTo=function(c,x,y,mit,to){chipset[c][mit][x][y]=to;}
	this.getTerkep=function(){return copy(terkep);};
	this.setTerkep=function(_){terkep=_;};
	this.getActivMapData=function(size){
		var data=[];
		if(size=="visible"){
			var startX=this.display.x+this.canvas?1:0;
			var startY=this.display.y+this.canvas?1:0;
			var endX=this.display.w+startX-(this.canvas?1:0);
			var endY=this.display.h+startY-(this.canvas?1:0);
		}else if(size=="full"){
			var startX=0
			var startY=0
			var endX=terkep.length;
			var endY=terkep[0].length
		}else{exception("ismeretlen size",size);}
		
		for(var x=startX;x<endX;x++){
			data[x]=[];
			for(var y=startY;y<endY;y++){
				if(terkep[x]==undefined || terkep[x][y]==undefined){
					data[x][y]=[];
				}else{
					data[x][y]=copy(terkep[x][y]);
				}
			}
		}
		return {type:"mapPiece",x:startX,y:startY,data:data,w:endX,h:endY,tiny:false,
			set:function(x,y,z,d){//abszolút pozíciót vár
				try{
				if(this.tiny){
					this.minX=Math.min(this.minX,x);
					this.maxX=Math.max(this.maxX,x);
					this.minY=Math.min(this.minY,y);
					this.maxY=Math.max(this.maxY,y);
				}else{
					this.tiny=true;
					this.minX=this.maxX=x;
					this.minY=this.maxY=y;
				}
				if(this.data[x]==undefined){this.data[x]=[];}
				if(this.data[x][y]==undefined){this.data[x][y]=[];}
				this.data[x][y][z]=d;
				}catch(e){exception(e,"set");}
				if(arguments.length==5){map.GEN(x,y);}
			},
			end:function(s){//ha igaz, a környezetét is frissíti (+-1)
				try{
				//csak a változott terület frissítése!
				s=s?1:0
				for(var x=toRange(this.x,this.minX-s,this.w);x<=toRange(this.x,this.maxX+s,this.w);x++){
					for(var y=toRange(this.y,this.minY-s,this.h);y<=toRange(this.y,this.maxY+s,this.h);y++){
						terkep[x][y]=this.data[x][y];
					}
				}
				for(var x=toRange(this.x,this.minX-s,this.w);x<=toRange(this.x,this.maxX+s,this.w);x++){
					for(var y=toRange(this.y,this.minY-s,this.h);y<=toRange(this.y,this.maxY+s,this.h);y++){
						try{
						map.GEN(x,y);
						}catch(e){exception(e,[x,y]);}
					}
				}
				}catch(e){exception(e,"end");}
			},
			delete:function(){
				this.data=null;
				this.set=null
				this.end=null;
				delete this;
			}
			
			};
	}
	
	this.setActivMapData=function(o){
		console.log("NEEEEM",o);return;/*
		if(o.type=="mapPiece"){
			var X=o.x;
			var Y=o.y;
			console.log("XY",X,Y);
			for(var x=0;x<o.w;x++){
				if(!isArray(terkep[x+X])){terkep[x+X]=[];}
				for(var y=0;y<o.h;y++){
					terkep[x+X][y+Y]=o.data[x][y];
				}
			}
			if(o.tiny){
				console.log("tiny regen:",x,y);
				for(var x=o.minX-1;x<=o.maxX+1;x++){
					for(var y=o.minY-1;y<=o.maxY+1;y++){
						this.GEN(x,y);
					}
				}
				//console.log("generate:",o,"db:",o.minX-1,"->",o.maxX+1,";",o.minY-1,"->",o.maxY+1);
			}else{
				console.log("regen:",x,"->",o.w,",",y,"->",o.h);
				for(var x=0;x<o.w;x++){
					for(var y=0;y<o.h;y++){
						this.GEN(x,y);
					}
				}
			}
		}*/
	}
	this.editPiece=function(x,y,z,to){
		terkep[x][y][z]=to;
		this.generateMezo(x,y);
	}
	this.getMezo=function(x,y,z){return terkep[x][y][z].toString();}
	this.getMezoCopy=function(x,y,z){return copy(terkep[x][y][z]);}
	this.targyak=[];
	this.targyAt=function(koord,kihagy){
		var r=[];
		for(var i=0;i<this.targyak.length;i++){
			var q=this.targyak[i];
			if(q.isset && q!=kihagy && q.pos.x==koord.x && q.pos.y==koord.y){r.push(q);}
		}
		return r;
	}
	this.resize=function(w,h){
		this.display.h=h;
		this.display.w=w;
		var container=this.containerDiv;
		container.style.overflow="hidden";
		if(this.canvas){
			this.display.h+=2;
			this.display.w+=2;
			this.display.x--;
			this.display.y--;
			this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
			this.ctx.canvas.width=this.display.w*32;
			this.ctx.canvas.height=this.display.h*32;
container.mapArea.left=-32;container.mapArea.top=-32;container.width=this.display.w*32-64;container.height=this.display.h*32-64;
			this.tmpCanvas.width=this.display.w*32;
			this.tmpCanvas.height=this.display.h*32;
		}else{
			container.width=this.display.w*32;
			container.height=this.display.h*32;
		}
		this.GEN();
	}
	this.drawMapFromSkratch=function(){
		try{
		var container=DIV();
		container.className="mapContainer";
		//container.mapArea=document.createElement("div");
		//container.mapArea.className="mapArea";
		container.DIV("mapArea");
		this.moverD=DIV();
		this.moverD.style.position="absolute";
		this.moverD.top=0;
		this.moverD.left=0;
		document.body.appendChild(this.moverD);
		}catch(e){console.error(container,container.DIV);alert("hogy miért nem mûködik google chrome-vel másodikra? \nnem tudom!");}
		if(this.canvas){
			var c=container.mapArea.elem("canvas");
			c.width=this.display.w*32;
			c.height=this.display.h*32;
			this.ctx=c.getContext('2d');
			this.tmpCanvas=elem("canvas")
			this.tmpCanvas.width=c.width;
			this.tmpCanvas.height=c.height;
			this.tmpC=this.tmpCanvas.getContext('2d');
			if(getConf("debug",false)){
			document.body.appendChild(this.tmpCanvas);
			this.tmpCanvas.style.marginLeft="500px";
			this.tmpCanvas.style.border="1px solid purple";
			this.tmpCanvas.style.backgroundColor="#DDD";
			this.tmpCanvas.style.backgroundImage="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZSURBVBhXYziMBP4jAQYqSiCbi2wsA/UkAO+XqMEJVwNnAAAAAElFTkSuQmCC)";
			}
			//container.mapArea.style.backgroundImage="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZSURBVBhXYziMBP4jAQYqSiCbi2wsA/UkAO+XqMEJVwNnAAAAAElFTkSuQmCC)";
//container.mapArea.left=-32;container.mapArea.top=-32;container.width=this.display.w*32-64;container.height=this.display.h*32-64;
		}else{
			container.height=this.display.h*32;
			container.width=this.display.w*32;
		}
		this.mapArea=container.mapArea;
		this.containerDiv=container;
		document.body.appendChild(container);
	}
	this.pol=function(x,y,d,la){
		if(x>terkep.length-1 || x<0 || y>terkep[x].length-1 || y<0){
			return -1;
		}else{try{
			var a=terkep[x][y][la]
			}catch(e){exception(e,terkep);}
			if(a==undefined){return -1;}
			return d[0]==a[0] && d[1]==a[1] && d[2]==a[2]?1:0;
		}
	};
	/*this.setMapPieceCanvas=function(absX,absY){////////////////////////////////////FV_KEZD
		var d=this.display,
			relX=absX-d.x,
			relY=absY-d.y,
			tt=isArray(terkep[absX])?isArray(terkep[absX][absY])?terkep[absX][absY]:[]:[],
			user_list=this.keresTargyMap(absX,absY);
		if(relX<0 || relX>=d.w || relY<0 || relY>=d.h){return;}
		
		var orderedList=[];//megnézzük mik vannak itt, és sorba tesszük
		for(var i=0;i<tt.length;i++){//layer+priority*5
			orderedList[i+chipset[tt[i][0]].prior[tt[i][2]][tt[i][1]]*6]=tt[i];
		}
		user_list.sort(function(a,b){return a.pos.y-b.pos.y});//rendezés
		
		for(var i=0;i<user_list.length;i++){
			if(user_list[i]==undefined){console.warn("hiba az user_list-el:",user_list);return;}
			var n=user_list[i].C.level*6 || 6;
			if(!isArray(orderedList[n])){orderedList[n]=["player"];};
			orderedList[n].push(user_list[i]);
		}
		this.ctx.clearRect(relX*32,relY*32,32,32);
		for(var z=0;z<orderedList.length;z++){
			var t=orderedList[z];
			if(t==undefined || (t[0]!=="player" && t[1]==0 && t[2]==0)){
				//áttetszõ/semmi
			}else if(t[0]==="player"){//player
				try{
				this.tmpC.putImageData(this.ctx.getImageData(relX*32,relY*32,32,32),relX*32,relY*32);//háttér másolása
				if(arguments[2]){
					this.ctx.strokeStyle="red";
					this.ctx.strokeRect(relX*32-1,relY*32-1,34,34);
					sleep(200);
				}
				}catch(e){
					exception("copypaste canvas error",[relX,relY]);
				}
				for(var pz=1;pz<orderedList[z].length;pz++){
					t=orderedList[z][pz];//t=aktuális játékos
					if(!map.charCache[t.C.charsetNum].loaded){map.charCache[t.C.charsetNum].a.push(arguments);return;}//ha nincs betöltve, akkor majd megpróbáljuk újra
					if(t.C.charsetNum==0){continue;}//ha a karakternek nincs képe, akkor nem törõdünk vele
					var charset=getCharsetData(t.C.charsetNum);
					this.tmpC.drawImage(//kitöltés az alakzattal
						map.charCache[t.C.charsetNum],//img
						t.C.anim*charset.w/4,//fromX
						[3,1,2,0][t.C.irany]*charset.h/4,//fromY
						charset.w/4,//sizeW
						charset.h/4,//sizeH
						(t.pos.x-d.x)*32-(charset.w/8-16),//toX !!abs pos!!	FIXME
						(t.pos.y-d.y)*32-16-(charset.h/8-16),//toY
						charset.w/4,//sizeW
						charset.h/4//sizeH
					);
					if(arguments.length>2){eval(arguments[2].toSource().slice(14,-2));}//DEBUG POINTER!
				}
				/*
				//console.log("VL",relX,relY);
				var volt=this.ctx.getImageData(relX*32,relY*32,32,32);//aktuális, rajta a régi adattal
				var lesz=this.tmpC.getImageData(relX*32,relY*32,32,32);//tmp, rajta a karakterrel
				for(var i=0;i<32;i++){
					for(var j=0;j<32;j++){
						var m=(i*32+j)*4;
						if(lesz.data[m+3]==255){//ha áttetszõ
							volt.data[m+0]=lesz.data[m+0];
							volt.data[m+1]=lesz.data[m+1];
							volt.data[m+2]=lesz.data[m+2];
						}
					}
				}
				
				this.ctx.putImageData(volt,relX*32,relY*32);
				this.ctx.fillStyle="purple";
				//this.ctx.fillRect(relX*32+8,relY*32+8,8,8);
				alert(relX+","+relY);
				this.tmpC.putImageData(volt,0,0);
				this.tmpC.putImageData(lesz,32,0);
				* /
				this.ctx.putImageData(this.tmpC.getImageData(relX*32,relY*32,32,32),relX*32,relY*32);//háttér másolása
				if(arguments[2]){
					this.tmpC.strokeStyle="red";
					this.tmpC.strokeRect(relX*32-1,relY*32-1,34,34);
					sleep(200);
				}
				
			}else if(t[2]==0 && t[1]!=0){
				if(chipset[t[0]].dynamic[t[1]-1].cache){
					var img=chipset[t[0]].dynamic[t[1]-1].cache;
					if(!img.complete){
						img.a.push(arguments);
						this.ctx.fillStyle="yellow";this.ctx.fillRect(relX*32,relY*32,32,32);
						return;
					}
				}else{
					var img=new Image();
					img.src=chipset[t[0]].dynamic[t[1]-1].file;
					chipset[t[0]].dynamic[t[1]-1].cache=img;
					img.a=[arguments];
					img.m=this;
					img.onload=function(){for(var i=0;i<this.a.length;this.m.GEN.apply(this.m,this.a[i++]));}
					this.ctx.fillStyle="orange";
					this.ctx.fillRect(relX*32,relY*32,32,32);
					if(this.reload){clearTimeout(this.reload);this.reload=false;};this.reload=setTimeout(function(a){a.GEN();},100,this);
					return;
				}
				var p,l=[];
				for(var i=0;i<9;i++){
					if(i==4){l[i]=-2;continue;}
					l[i]=this.pol(i%3==0?absX-1:i%3==1?absX:absX+1,i<3?absY-1:i<6?absY:absY+1,t,z);
				}
				p=[	l[1]?l[3]?l[0]?l[5]?l[7]?[1,2]:[1,3]:l[7]?[2,2]:[1,3]:[2,0]:[0,2]:l[3]?[1,1]:[0,1],
					l[1]?l[5]?l[2]?l[3]?l[7]?[1,2]:[1,3]:l[7]?[0,2]:[1,3]:[2,0]:[2,2]:l[5]?[1,1]:[2,1],
					l[7]?l[3]?l[6]?l[5]?l[1]?[1,2]:[1,1]:l[1]?[2,2]:[1,1]:[2,0]:[0,2]:l[3]?[1,3]:[0,3],
					l[7]?l[5]?l[8]?l[3]?l[1]?[1,2]:[1,1]:l[1]?[0,2]:[1,1]:[2,0]:[2,2]:l[5]?[1,3]:[2,3]];
				this.ctx.drawImage(img,p[0][0]*32   ,p[0][1]*32   ,16,16,relX*32   ,relY*32   ,16,16);
				this.ctx.drawImage(img,p[1][0]*32+16,p[1][1]*32   ,16,16,relX*32+16,relY*32   ,16,16);
				this.ctx.drawImage(img,p[2][0]*32   ,p[2][1]*32+16,16,16,relX*32   ,relY*32+16,16,16);
				this.ctx.drawImage(img,p[3][0]*32+16,p[3][1]*32+16,16,16,relX*32+16,relY*32+16,16,16);
			}else{
				if(chipset[t[0]].cache){
					var img=chipset[t[0]].cache
					if(!img.complete){
						img.b.push(arguments);
						this.ctx.fillStyle="purple";
						this.ctx.fillRect(relX*32,relY*32,32,32);
					}else{
						this.ctx.drawImage(img,t[1]*32,t[2]*32-32,32,32,relX*32,relY*32,32,32);
					}
				}else{
					var img=new Image();
					img.src=chipset[t[0]].file;
					chipset[t[0]].cache=img;
					img.b=[arguments];
					img.m=this;
					img.onload=function(){for(var i=0;i<this.b.length;this.m.GEN.apply(this.m,this.b[i++]));}
					this.ctx.fillStyle="yellow";
					this.ctx.fillRect(relX*32,relY*32,32,32);
					if(this.reload){clearTimeout(this.reload);this.reload=false;};this.reload=setTimeout(function(a){a.GEN();},100,this);
				}
				
			}
			//console.log("draw canvas, to:",x,y,"data:",tt[z],"z:",z);
		}
		//this.filter="grayscale"|"invert"
		//filter
		if(this.Filter!=false){
			var f=this.Filter;
			var piece=this.ctx.getImageData(relX*32,relY*32,32,32);
			var cnf=this.filter_conf;
			for(var i=0;i<piece.data.length;i+=4){
				if(f=="grayscale"){
					var g=(piece.data[i+0]+piece.data[i+1]+piece.data[i+2])/3
					piece.data[i+0]=g;
					piece.data[i+1]=g;
					piece.data[i+2]=g;
				}else
				if(f=="tint"){
					piece.data[i+0]=(piece.data[i+0]*(1-cnf[0])+cnf[1]*cnf[0]);
					piece.data[i+1]=(piece.data[i+1]*(1-cnf[0])+cnf[2]*cnf[0]);
					piece.data[i+2]=(piece.data[i+2]*(1-cnf[0])+cnf[3]*cnf[0]);
					piece.data[i+3]=(piece.data[i+3]*(1-cnf[0])+255*cnf[0]);
				}else
				if(f=="recolor"){
					var g=(piece.data[i+0]+piece.data[i+1]+piece.data[i+2])/3
					piece.data[i+(cnf[0])%3]=g;
					piece.data[i+(cnf[0]+1)%3]=cnf[1];
					piece.data[i+(cnf[0]+2)%3]=cnf[2];
				}
			}
			this.ctx.putImageData(piece,relX*32,relY*32);
		}
		if(getConf("canvasCoord",false)){
		this.ctx.fillStyle="black";
		this.ctx.fillText(absX+","+absY,relX*32+2,relY*32+12);
		this.ctx.fillRect(relX*32-1,relY*32-1,2,2);
		}
	}*/
	
	/*this.setMapPiece=function(div,t){
		if(t[1]==0 && t[2]==0){
			div.style.background="transparent";
			div.erase();
		}else if(t[2]==0 && t[1]!=0){
			var d,p,l=[],k=0,o=div.childNodes.length!=4,x=div.x,y=div.y;
			for(var i=0;i<9;i++){
				if(i==4){l[i]=-2;continue;}
				l[i]=this.pol(i%3==0?x-1:i%3==1?x:x+1,i<3?y-1:i<6?y:y+1,t,div.z);
			}
			p=[	l[1]?l[3]?l[0]?l[5]?l[7]?[1,2]:[1,3]:l[7]?[2,2]:[1,3]:[2,0]:[0,2]:l[3]?[1,1]:[0,1],
				l[1]?l[5]?l[2]?l[3]?l[7]?[1,2]:[1,3]:l[7]?[0,2]:[1,3]:[2,0]:[2,2]:l[5]?[1,1]:[2,1],
				l[7]?l[3]?l[6]?l[5]?l[1]?[1,2]:[1,1]:l[1]?[2,2]:[1,1]:[2,0]:[0,2]:l[3]?[1,3]:[0,3],
				l[7]?l[5]?l[8]?l[3]?l[1]?[1,2]:[1,1]:l[1]?[0,2]:[1,1]:[2,0]:[2,2]:l[5]?[1,3]:[2,3]];
			if(this.multiBg){var bgI=bgP=bgC="";}
			for(;k<4;k++){
				if(this.multiBg){
					bgI+="url("+chipset[t[0]].dynamic[t[1]-1].file+")"+(k==3?"":",");
					bgP+=(k>1?"top":"bottom")+" "+(k%2==1?"left":"right")+(k==3?"":",");
					bgC+=p[k][0]*32+(k%2?32/2:0)+"px "+p[k][1]*32+(k<2?0:32/2)+"px"+(k==3?"":",");
				}else{
					if(o){
						d=DIV();
						if(k>1){d.top=32/2;}
						if(k%2==1){d.left=32/2}
					}else{
						d=div.childNodes[k];
					}
					d.imageUrl=chipset[t[0]].dynamic[t[1]-1].file;
					d.imagePos=d.pos=[p[k][0]*32+(k%2?32/2:0),p[k][1]*32+(k<2?0:32/2)];
					if(o){div.appendChild(d);}
				}
			}
			if(this.multiBg){
				div.style.backgroundImage=bgI;
				div.style.backgroundPosition=bgP;
				div.style.backgroundOrigin=bgC;
				//alert(bgC);asdfgoj();
				div.style.backgroundRepeat="no-repeat";
				
				}
			//alert(bg);asfogj();
		}else{
			div.erase();
			div.imageUrl=chipset[t[0]].file;
			div.imagePos=[t[1]*32,t[2]*32-32];
		}
	}*/
	this.calculateGenerateTime=function(){
		var start=+new Date();
		var x=y=z=0;
			var d=DIV();
			d.x=x;
			d.y=y;
			d.z=z;
			d.left=x*32;
			d.top=y*32;
			d.style.zIndex=z+chipset[terkep[x][y][z][0]].prior[terkep[x][y][z][2]][terkep[x][y][z][1]]*6;
			tgm[z+"_"+x+"_"+y]=d;
			this.setMapPiece(d,terkep[x][y][z]);
			this.mapArea.appendChild(d);
		var end=+new Date();
		this.mapArea.removeChild(d);
		return end-start;
	}
	/*this.generateMezo=function(x,y,force){
		if(terkep[x]!=undefined && terkep[x][y]!=undefined){
			if(this.canvas){
					this.GEN(x,y);
			}else{
				for(var z=0;z<terkep[x][y].length;z++){
					if(tgm[z+"_"+x+"_"+y]!=undefined){
						if(force || tgm[z+"_"+x+"_"+y].dataSource!=terkep[x][y][z].toString()){
							this.setMapPiece(tgm[z+"_"+x+"_"+y],terkep[x][y][z]);
							tgm[z+"_"+x+"_"+y].dataSource=terkep[x][y][z].toString();
							if(force){
								tgm[z+"_"+x+"_"+y].style.zIndex=z+chipset[terkep[x][y][z][0]].prior[terkep[x][y][z][2]][terkep[x][y][z][1]]*6;
							}
						}
					}else{
						var d=DIV();
						d.x=x;
						d.y=y;
						d.z=z;
						d.left=x*32;
						d.top=y*32;
						d.style.zIndex=z+chipset[terkep[x][y][z][0]].prior[terkep[x][y][z][2]][terkep[x][y][z][1]]*6;
						tgm[z+"_"+x+"_"+y]=d;
						this.setMapPiece(d,terkep[x][y][z]);
						this.mapArea.appendChild(d);
					}
				}
			}
		}
	}*/
	this.forceGenerate=function(){
		for(var x=this.display.x-this.display.plus;x<this.display.w+this.display.plus+this.display.x;x++){
			for(var y=this.display.y-this.display.plus;y<this.display.h+this.display.plus+this.display.y;y++){
				this.generateMezo(x,y,true);
			}
		}
	}
	this.generate=function(show,by){
		if(getConf("debug",false)){var t=+new Date();}
		for(var x=this.display.x-this.display.plus;x<=this.display.w+this.display.plus+this.display.x;x++){
			for(var y=this.display.y-this.display.plus;y<=this.display.h+this.display.plus+this.display.y;y++){
				this.generateMezo(x,y);
			}
		}
		$('.mapContainer').style.backgroundImage="url("+terkep_gyujtemeny[this.activMap].background+")";
		if(getConf("debug",false)){console.log("generated in ",new Date()-t,"ms");}
	}
	this.moveMap=function(_x,_y,s,q){//relX,relY,részletesség,idõ
		if(_x==0 && _y==0 || this.moving){return;}
		//console.log("move map:",this.display.x,this.display.y);
		this.moving=true;
		var a=[this.display.x,this.display.y];
		var b=[a[0]+_x,a[1]+_y];
		
		var mezoLista=[];
		var mapH=this.display.h;
		var mapW=this.display.w;
		var x=this.display.x;
		var y=this.display.y;
		for(var X=x+_x;X<x+_x+mapW;X++){
			for(var Y=y+_y;Y<y+_y+mapH;Y++){
				if(X<x||X>=x+mapW||Y<y||Y>=y+mapH){mezoLista.push([X,Y]);}
			}
		}
		if(this.canvas){
			var tim=q?q:100;//time,ms
			var d=this.display;
			var c=this.ctx;
			
			//mozgatás következik: elösször az egészet elmentjük (ami kell)
			var mv=[0,0,d.w*32,d.h*32];
			if(_y==0){mv[2]=d.w*32-32;}else
			if(_x==0){mv[3]=d.h*32-32;}
			if(_x==1  && _y==0){mv[0]=32;}else
			if(_x==0 && _y==1){mv[1]=32;}
			
			//aztán a mozgatás alapján elmozdítjuk n-szer
			
			var cfter=function(ml,that,x,y){//rajzoló függvény
				var d=that.display;
				that.ctx.fillStyle="black";
				if(x==-1){that.ctx.fillRect(0,0,32,d.h*32);}else
				if(x==+1){that.ctx.fillRect(d.w*32-32,0,32,d.h*32);}else
				if(y==-1){that.ctx.fillRect(0,0,d.w*32,32);}else
				if(y==+1){that.ctx.fillRect(0,d.h*32-32,d.w*32,32);}
				d.x+=x;
				d.y+=y;
				for(var n=0;n<ml.length;n++){
					var absX=ml[n][0];
					var absY=ml[n][1];
					var relX=absX-d.x;
					var relY=absY-d.y;
					if(terkep[absX] && terkep[absX][absY]){
						that.GEN(absX,absY);
					}
				}
				that.moverD.left=-map.display.x*32-32;
				that.moverD.top=-map.display.y*32-32;
				that.moving=false;
			}
			var cfv=function(x,y,pc,c,mv,obj){
				$('.mapContainer').style.backgroundPosition=-(16*x*pc+obj.display.x*16+16)+"px "+(-(16*y*pc+obj.display.y*16+16))+"px";
				if(pc==1){//érkezés
					c.putImageData(c.getImageData.apply(c,mv),Math.round(mv[0]-x*pc*32),Math.round(mv[1]-y*pc*32));
					obj.ctx.canvas.left=0;
					obj.ctx.canvas.top=0;
					cfter(mezoLista,obj,x,y);
				}else{//mozog
					obj.ctx.canvas.left=-x*(pc)*32;
					obj.ctx.canvas.top=-y*(pc)*32;
				}
			}
			
			if(s>0){
				this.ctx.canvas.style.position="absolute";
				for(var i=0;i<=s;i++){
					setTimeout(cfv,(i/s)*tim,_x,_y,(i/s),c,mv,this);
				}
			}else{
				cfv(_x,_y,1,c,mv,this);
			}
			//aztán megrajzoljuk az új részeket
			//setTimeout(cfter,i==0?0:tim,mezoLista,this,_x,_y);
			//if(this.mapSleep){clearTimeout(this.mapSleep);this.mapSleep=false;}
			//this.mapSleep=setTimeout(function(a){a.GEN();},120,this);//FIXME: ez egy ideiglenes megoldás :D
		}else{
			this.display.x+=_x;
			this.display.y+=_y;
			//console.log("move");
			
			for(var i=0;i<mezoLista.length;i++){
				this.GEN(mezoLista[i][0],mezoLista[i][1]);
			}
			if(s==undefined){
				this.mapArea.left=-this.display.x*32;
				this.mapArea.top =-this.display.y*32;
			}else{
				var fv=function(o,x,y,q){o.left=-32*x;o.top=-32*y;q.backgroundPosition=-16*x+"px "+(-16*y)+"px";};
				var xz=sorozat(a[0],b[0],s);
				var yz=sorozat(a[1],b[1],s);
				for(var i=0;i<s;i++){
					setTimeout(fv,(i/s)*100,this.mapArea,xz[i],yz[i],$('.mapContainer').style);
				}
			}
			this.moving=false;
		}
	//console.log("moveD map:",this.display.x,this.display.y);
	}
	this.isJarhato=function(x,y){
		if(terkep[x]==undefined || terkep[x][y]==undefined){return false;}
		var ok=false;
		var q;
		for(var i=0;i<terkep[x][y].length;i++){
			q=terkep[x][y][i]
			if(q==undefined || q.length!=3){return false;}
			if(q[1]==0 && q[2]==0){continue;}
			if(chipset[q[0]].prior[q[2]][q[1]]!=0){continue;}
			ok=chipset[q[0]].jarhato[q[2]][q[1]]==15;
		}
		var t=isArray(this.objMask[x])?isArray(this.objMask[x][y])?this.objMask[x][y]:[]:[];
		for(var i=0;i<t.length;i++){
			if(!t[i].C.jarhato && t[i].pos.y<=y){ok=false;break;}
		}
		//var targyak=this.keresTargy({x:x,y:y});
		//for(var i=0;i<targyak.length;i++){if(!targyak[i].C.jarhato){ok=false;break;}}
		return ok;
	}
	
	this.key=function(evt,e){
		if(evt=="DOWN"){
			var a=0;
			var b=0;
			if(keyboard.binds.up.inArray(e)){this.moveMap(0,-1);}
			if(keyboard.binds.down.inArray(e)){this.moveMap(0,1);}
			if(keyboard.binds.left.inArray(e)){this.moveMap(-1,0);}
			if(keyboard.binds.right.inArray(e)){this.moveMap(1,0);}
			//this.mozogRel(a,b);
		}
	};
	this.addTargy=function(obj,data){
		this.targyak.push(obj);
		obj.insertedIDatMap=this.targyak.length-1;
		if(this.canvas && !this.halfCanvas){
			if(map.charCache==undefined){map.charCache=[];}
			//console.log("NOT IMPLEMENTED:ADD TARGY@canvas",obj);
		}else{
			var bHtmlObj=DIV();
			bHtmlObj.obj=obj;
			obj.bHtmlObj=bHtmlObj;
			bHtmlObj.style.zIndex=data.level*6;
			this.mapArea.appendChild(bHtmlObj);
		}
	}
	this.updateTargy=function(obj,d){
		//console.log("update targy, pos:",obj.pos.x,obj.pos.y,"map:",this.display.x,this.display.y);
		if(this.canvas && !this.halfCanvas){
	
			if(obj.C.charsetNum==0){return;}
			//this.ctx.drawImage(img,obj.C.anim*cs.w/4,[3,1,2,0][obj.C.irany]*cs.h/4,cs.w/4,cs.h/4,pos.x*32,pos.y*32,cs.w/4,cs.h/4);
			
			var cs=getCharsetData(obj.C.charsetNum);
			var pos=obj.C.pos
			if(map.charCache[obj.C.charsetNum]==undefined){
				var img=new Image();
				img.src=cs.src;
				map.charCache[obj.C.charsetNum]=img;
				img.a=[];
				img.m=this;
				img.n=obj.C.charsetNum;
				img.loaded=false;
				img.onload=function(){map.charCache[obj.C.charsetNum].loaded=true;for(var i=0;i<this.a.length;this.m.GEN.apply(this.m,this.a[i++]));}
			}else{
				var img=map.charCache[obj.C.charsetNum];
			}
			//térképes pozíció frissítése
			//objMask[x][y]=array of Targyak;
			if(obj.last==undefined){obj.last=[];}
			var l=obj.last,m=this.objMask;
			//console.log("l",l,"m",m);
			for(var i=0;i<l.length;i++){
				removeItemS(m[l[i][0]][l[i][1]],l[i][2]);//eltávolítja az objMask-ból a saját referenciáit
			}
			
			//új pozíciók megtalálása
			//var endX=Math.ceil(obj.pos.x+cs.w/4)
			
			var startX=Math.floor(obj.pos.x-(cs.w/256-0.5));
			var endX=Math.ceil(obj.pos.x+(cs.w/256+0.5));
			
			var startY=Math.floor(((obj.pos.y*32+32)-(cs.h/4)) / 32)
			var endY=Math.ceil((obj.pos.y*32+cs.h/8+8)/32);
			if(cd=getConf("cdxq",false)){var d=DIV();
			d.style.position="absolute";
			d.left=startX*32+100;
			d.top=startY*32+30;
			d.width=(endX-startX)*32;
			d.height=(endY-startY)*32;
			document.body.appendChild(d);
			console.group("x",startX,"-",endX,"y",startY,"-",endY,d);
			}
			var ujHalmaz=[];
			for(var i=startX;i<endX;i++){
				for(var j=startY;j<endY;j++){
					put2arr(m,i,j,obj);
					this.GEN(i,j);
					ujHalmaz.push([i,j,obj]);
					//if(cd){console.log(i,j);}
				}
			}
			if(cd){console.groupEnd();}
			var b=array_complement(obj.last,ujHalmaz);
			obj.last=ujHalmaz;
			b.map(function(v){this.GEN(v[0],v[1]);},this);
			
			var mPos=[obj.pos.x*32+16-cs.w/8,obj.pos.y*32+32-cs.h/4]
			mPos[2]=cs.w/4;
			mPos[3]=cs.h/4;
			mPos[4]=mPos[0]+cs.w/4;
			mPos[5]=mPos[1]+cs.h/4;
			obj.mPos=mPos;

		}else{
			if(isString(d)){
				if(d=="pos"){
					var charset=getCharsetData(obj.C.charsetNum);
					var pos=obj.C.pos
					obj.bHtmlObj.left=pos.x*32;
					obj.bHtmlObj.top=pos.y*32-(charset.h/4-32);
				}
				if(d=="img"){
					var charset=getCharsetData(obj.C.charsetNum);
					var pos=obj.C.pos
					obj.bHtmlObj.imageUrl=charset.src;
					obj.bHtmlObj.height=charset.h/4;
					obj.bHtmlObj.width=charset.w/4;
					obj.bHtmlObj.imagePos=[obj.C.anim*charset.w/4,[3,1,2,0][obj.C.irany]*charset.h/4];
				}
			}else
			if(d!=undefined){
				if(d.x){obj.bHtmlObj.left=d.x;}
				if(d.y){obj.bHtmlObj.top=d.y;}
				if(d.imUrl){obj.bHtmlObj.imageUrl=d.imUrl;}
				if(d.h){obj.bHtmlObj.height=d.h;}
				if(d.w){obj.bHtmlObj.width=d.w;}
				if(d.imPos){obj.bHtmlObj.imagePos=d.imPos;}
				if(d.alpha){obj.bHtmlObj.alpha=d.alpha;}
				//if((d.x || d.y) && obj.C.alwaysOnMap){this.positionateByTargy(obj,2);}
			}else{
				var charset=getCharsetData(obj.C.charsetNum);
				var pos=obj.C.pos
				if(charset!=null){
					obj.bHtmlObj.imageUrl=charset.src;
					obj.bHtmlObj.height=charset.h/4;
					obj.bHtmlObj.width=charset.w/4;
					obj.bHtmlObj.imagePos=[obj.C.anim*charset.w/4,[3,1,2,0][obj.C.irany]*charset.h/4];
					obj.bHtmlObj.left=pos.x*32;
					obj.bHtmlObj.top=pos.y*32-(charset.h/4-32);
					obj.bHtmlObj.alpha=obj.C.alpha;
				}
				//if(obj.C.alwaysOnMap){this.positionateByTargy(obj,1);}
			}
		}
	}
	this.positionateByTargy=function(obj,n){
		//left,right,top,bottom
		if(n==undefined){n=10;}
		if(n==0){return;}
		var r=0,q=[this.display.x,this.display.y],
			t=[	obj.pos.x-q[0],
				q[0]+this.display.w-obj.pos.x-1,
				obj.pos.y-q[1],
				q[1]+this.display.h-obj.pos.y-1];
		for(var i=0;i<4;i++){
			if(Math.ceil(t[i]<this.display.lat)){
				this.moveMap(i==0?-1:i==1?1:0,i==2?-1:i==3?1:0,10);r++;
			}
		}
		if(r==1 || r==2){this.positionateByTargy(obj,n-1);}
		
	}
	this.removeTargy=function(obj){
		this.targyak=removeItem(this.targyak,obj.insertedIDatMap);
		if(this.canvas){
			
		}else{
			obj.bHtmlObj.parentNode.removeChild(obj.bHtmlObj);
			obj.bHtmlObj.erase();
		}
	}
	this.keresTargyMap=function(x,y){
		return this.objMask[x] && this.objMask[x][y] || [];/*
		var r=[],q;
		x*=32;
		y*=32;
		for(var i=0;i<this.targyak.length;i++){
			q=this.targyak[i].mPos || [0,0,0,0];
			if(this.targyak[i].isset && q[0]<=x && q[4]>=x && q[1]<=y && q[5]>=y){
					r.push(this.targyak[i]);
			}
		}
		return r;*/
	}
	this.keresTargy=function(koord,kihagy){
		var r=[],q;
		for(var i=0;i<this.targyak.length;i++){
			q=this.targyak[i];
			if(q.isset && q!=kihagy && q.pos.x==koord.x && q.pos.y==koord.y){r.push(q);}
		}
		return r;
	}
	this.texts=[];
	this.showText=function(txt,x,y){
		var txtObj=new MapTextObject(txt,x,y,this);
		txtObj.azonosito=this.texts.length;
		this.texts.push(txtObj);
		
		return txtObj;
	}
	//this.drawMapFromSkratch();
	
	this.GEN=function(){
		if(arguments.length>1){
			absX=arguments[0];
			absY=arguments[1];
			var d=this.display,
				relX=absX-d.x,
				relY=absY-d.y;
			if(relX<0 || relX>=d.w || relY<0 || relY>=d.h){return;}
		if(this.canvas){
			var tt=isArray(terkep[absX])?isArray(terkep[absX][absY])?terkep[absX][absY]:[]:[],
				user_list=this.keresTargyMap(absX,absY);
			
			var orderedList=[];//megnézzük mik vannak itt, és sorba tesszük
			for(var i=0;i<tt.length;i++){//layer+priority*5
				orderedList[i+chipset[tt[i][0]].prior[tt[i][2]][tt[i][1]]*6]=tt[i];
			}
			user_list.sort(function(a,b){return a.pos.y-b.pos.y});//rendezés
			
			for(var i=0;i<user_list.length;i++){
				if(user_list[i]==undefined){console.warn("hiba az user_list-el:",user_list);return;}
				var n=user_list[i].C.level*6 || 6;
				if(!isArray(orderedList[n])){orderedList[n]=["player"];};
				orderedList[n].push(user_list[i]);
			}
			this.ctx.clearRect(relX*32,relY*32,32,32);
			for(var z=0;z<orderedList.length;z++){
				var t=orderedList[z];
				if(t==undefined || (t[0]!=="player" && t[1]==0 && t[2]==0)){//áttetszõ/semmi
					continue;
				}else if(t[0]==="player"){//player
					try{
					this.tmpC.putImageData(this.ctx.getImageData(relX*32,relY*32,32,32),relX*32,relY*32);//háttér másolása
					if(arguments[2]){
						this.ctx.strokeStyle="red";
						this.ctx.strokeRect(relX*32-1,relY*32-1,34,34);
						sleep(200);
					}
					}catch(e){
						exception("copypaste canvas error",[relX,relY]);
					}
					for(var pz=1;pz<orderedList[z].length;pz++){
						t=orderedList[z][pz];//t=aktuális játékos
						if(!map.charCache[t.C.charsetNum].loaded){map.charCache[t.C.charsetNum].a.push(arguments);return;}
						if(t.C.charsetNum==0){continue;}//ha a karakternek nincs képe, akkor nem törõdünk vele
						var charset=getCharsetData(t.C.charsetNum);
						this.tmpC.drawImage(//kitöltés az alakzattal
							map.charCache[t.C.charsetNum],//img
							t.C.anim*charset.w/4,//fromX
							[3,1,2,0][t.C.irany]*charset.h/4,//fromY
							charset.w/4,//sizeW
							charset.h/4,//sizeH
							(t.pos.x-d.x)*32-(charset.w/8-16),//toX !!abs pos!!	FIXME
							(t.pos.y-d.y)*32-16-(charset.h/8-16),//toY
							charset.w/4,//sizeW
							charset.h/4//sizeH
						);
						if(arguments.length>2){eval(arguments[2].toSource().slice(14,-2));}//DEBUG POINTER!
					}
					this.ctx.putImageData(this.tmpC.getImageData(relX*32,relY*32,32,32),relX*32,relY*32);//háttér másolása
					if(arguments[2]){
						this.tmpC.strokeStyle="red";
						this.tmpC.strokeRect(relX*32-1,relY*32-1,34,34);
						sleep(200);
					}
					
				}else if(t[2]==0 && t[1]!=0){
					if(chipset[t[0]].dynamic[t[1]-1].cache){
						var img=chipset[t[0]].dynamic[t[1]-1].cache;
						if(!img.complete){
							img.a.push(arguments);
							this.ctx.fillStyle="yellow";this.ctx.fillRect(relX*32,relY*32,32,32);
							return;
						}
					}else{
						var img=new Image();
						img.src=chipset[t[0]].dynamic[t[1]-1].file;
						chipset[t[0]].dynamic[t[1]-1].cache=img;
						img.a=[arguments];
						img.m=this;
						img.onload=function(){for(var i=0;i<this.a.length;this.m.GEN.apply(this.m,this.a[i++]));}
						this.ctx.fillStyle="orange";
						this.ctx.fillRect(relX*32,relY*32,32,32);
						if(this.reload){clearTimeout(this.reload);this.reload=false;};this.reload=setTimeout(function(a){a.GEN();},100,this);
						return;
					}
					var p,l=[];
					for(var i=0;i<9;i++){
						if(i==4){l[i]=-2;continue;}
						l[i]=this.pol(i%3==0?absX-1:i%3==1?absX:absX+1,i<3?absY-1:i<6?absY:absY+1,t,z);
					}
					p=[	l[1]?l[3]?l[0]?l[5]?l[7]?[1,2]:[1,3]:l[7]?[2,2]:[1,3]:[2,0]:[0,2]:l[3]?[1,1]:[0,1],
						l[1]?l[5]?l[2]?l[3]?l[7]?[1,2]:[1,3]:l[7]?[0,2]:[1,3]:[2,0]:[2,2]:l[5]?[1,1]:[2,1],
						l[7]?l[3]?l[6]?l[5]?l[1]?[1,2]:[1,1]:l[1]?[2,2]:[1,1]:[2,0]:[0,2]:l[3]?[1,3]:[0,3],
						l[7]?l[5]?l[8]?l[3]?l[1]?[1,2]:[1,1]:l[1]?[0,2]:[1,1]:[2,0]:[2,2]:l[5]?[1,3]:[2,3]];
					this.ctx.drawImage(img,p[0][0]*32   ,p[0][1]*32   ,16,16,relX*32   ,relY*32   ,16,16);
					this.ctx.drawImage(img,p[1][0]*32+16,p[1][1]*32   ,16,16,relX*32+16,relY*32   ,16,16);
					this.ctx.drawImage(img,p[2][0]*32   ,p[2][1]*32+16,16,16,relX*32   ,relY*32+16,16,16);
					this.ctx.drawImage(img,p[3][0]*32+16,p[3][1]*32+16,16,16,relX*32+16,relY*32+16,16,16);
				}else{
					if(chipset[t[0]].cache){
						var img=chipset[t[0]].cache
						if(!img.complete){
							img.b.push(arguments);
							this.ctx.fillStyle="purple";
							this.ctx.fillRect(relX*32,relY*32,32,32);
						}else{
							this.ctx.drawImage(img,t[1]*32,t[2]*32-32,32,32,relX*32,relY*32,32,32);
						}
					}else{
						var img=new Image();
						img.src=chipset[t[0]].file;
						chipset[t[0]].cache=img;
						img.b=[arguments];
						img.m=this;
						img.onload=function(){for(var i=0;i<this.b.length;this.m.GEN.apply(this.m,this.b[i++]));}
						this.ctx.fillStyle="yellow";
						this.ctx.fillRect(relX*32,relY*32,32,32);
						if(this.reload){clearTimeout(this.reload);this.reload=false;};this.reload=setTimeout(function(a){a.GEN();},100,this);
					}
					
				}
			}
			//this.filter="grayscale"|"invert"
			//filter
			if(this.Filter!=false){
				var f=this.Filter;
				var piece=this.ctx.getImageData(relX*32,relY*32,32,32);
				var cnf=this.filter_conf;
				for(var i=0;i<piece.data.length;i+=4){
					if(f=="grayscale"){
						var g=(piece.data[i+0]+piece.data[i+1]+piece.data[i+2])/3
						piece.data[i+0]=g;
						piece.data[i+1]=g;
						piece.data[i+2]=g;
					}else
					if(f=="tint"){
						piece.data[i+0]=(piece.data[i+0]*(1-cnf[0])+cnf[1]*cnf[0]);
						piece.data[i+1]=(piece.data[i+1]*(1-cnf[0])+cnf[2]*cnf[0]);
						piece.data[i+2]=(piece.data[i+2]*(1-cnf[0])+cnf[3]*cnf[0]);
						piece.data[i+3]=(piece.data[i+3]*(1-cnf[0])+255*cnf[0]);
					}else
					if(f=="recolor"){
						var g=(piece.data[i+0]+piece.data[i+1]+piece.data[i+2])/3
						piece.data[i+(cnf[0])%3]=g;
						piece.data[i+(cnf[0]+1)%3]=cnf[1];
						piece.data[i+(cnf[0]+2)%3]=cnf[2];
					}
				}
				this.ctx.putImageData(piece,relX*32,relY*32);
			}
			if(getConf("canvasCoord",false)){
				this.ctx.fillStyle="black";
				this.ctx.fillText(absX+","+absY,relX*32+2,relY*32+12);
				this.ctx.fillRect(relX*32-1,relY*32-1,2,2);
			}
			//CANVAS EDDIG
		}else{
			//CANVAS NÉLKÜL INNEN
			
			var smp=function(div,t){
				if(t[1]==0 && t[2]==0){
					div.style.background="transparent";
					div.erase();
				}else if(t[2]==0 && t[1]!=0){
					var d,p,l=[],k=0,o=div.childNodes.length!=4,x=div.x,y=div.y;
					for(var i=0;i<9;i++){
						if(i==4){l[i]=-2;continue;}
						l[i]=map.pol(i%3==0?x-1:i%3==1?x:x+1,i<3?y-1:i<6?y:y+1,t,div.z);
					}
					p=[	l[1]?l[3]?l[0]?l[5]?l[7]?[1,2]:[1,3]:l[7]?[2,2]:[1,3]:[2,0]:[0,2]:l[3]?[1,1]:[0,1],
						l[1]?l[5]?l[2]?l[3]?l[7]?[1,2]:[1,3]:l[7]?[0,2]:[1,3]:[2,0]:[2,2]:l[5]?[1,1]:[2,1],
						l[7]?l[3]?l[6]?l[5]?l[1]?[1,2]:[1,1]:l[1]?[2,2]:[1,1]:[2,0]:[0,2]:l[3]?[1,3]:[0,3],
						l[7]?l[5]?l[8]?l[3]?l[1]?[1,2]:[1,1]:l[1]?[0,2]:[1,1]:[2,0]:[2,2]:l[5]?[1,3]:[2,3]];
					if(this.multiBg){var bgI=bgP=bgC="";}
					for(;k<4;k++){
						if(this.multiBg){
							bgI+="url("+chipset[t[0]].dynamic[t[1]-1].file+")"+(k==3?"":",");
							bgP+=(k>1?"top":"bottom")+" "+(k%2==1?"left":"right")+(k==3?"":",");
							bgC+=p[k][0]*32+(k%2?32/2:0)+"px "+p[k][1]*32+(k<2?0:32/2)+"px"+(k==3?"":",");
						}else{
							if(o){
								d=DIV();
								if(k>1){d.top=32/2;}
								if(k%2==1){d.left=32/2}
							}else{
								d=div.childNodes[k];
							}
							d.imageUrl=chipset[t[0]].dynamic[t[1]-1].file;
							d.imagePos=d.pos=[p[k][0]*32+(k%2?32/2:0),p[k][1]*32+(k<2?0:32/2)];
							if(o){div.appendChild(d);}
						}
					}
				}else{
					div.erase();
					div.imageUrl=chipset[t[0]].file;
					div.imagePos=[t[1]*32,t[2]*32-32];
				}
			};
			var x=absX,y=absY;
			try{
			for(var z=0;z<terkep[x][y].length;z++){
				if(tgm[z+"_"+x+"_"+y]!=undefined){
					if(tgm[z+"_"+x+"_"+y].dataSource!=terkep[x][y][z].toString()){
						smp(tgm[z+"_"+x+"_"+y],terkep[x][y][z]);
						tgm[z+"_"+x+"_"+y].dataSource=terkep[x][y][z].toString();
						tgm[z+"_"+x+"_"+y].style.zIndex=z+chipset[terkep[x][y][z][0]].prior[terkep[x][y][z][2]][terkep[x][y][z][1]]*6;
					}
				}else{
					var d=DIV();
					d.x=x;
					d.y=y;
					d.z=z;
					d.left=x*32;
					d.top=y*32;
					d.style.zIndex=z+chipset[terkep[x][y][z][0]].prior[terkep[x][y][z][2]][terkep[x][y][z][1]]*6;
					tgm[z+"_"+x+"_"+y]=d;
					smp(d,terkep[x][y][z]);
					this.mapArea.appendChild(d);
				}
			}
			}catch(e){exception(e,"GEN.h");}
			//CANVAS NÉLKÜL EDDIG
		}
	}else{
		for(var x=this.display.x-this.display.plus;x<=this.display.w+this.display.plus+this.display.x;x++){
			for(var y=this.display.y-this.display.plus;y<=this.display.h+this.display.plus+this.display.y;y++){
				this.GEN(x,y);
			}
		}
		$('.mapContainer').style.backgroundImage="url("+terkep_gyujtemeny[this.activMap].background+")";
	}
	}

this.debdiv=function(x,y){
	var d=DIV();
	d.style.position="absolute";
	d.left=x*32+100;
	d.top=y*32+30;
	d.width=32;
	d.height=32;
	d.style.zIndex="1000";
	d.style.backgroundColor="rgba(255,0,0,0.5)";
	this.moverD.appendChild(d);
	return d;
}
}
function MapTextObject(txt,x,y,_map){
	var map=_map;
	this.txt=txt;
	this.x=x;
	this.y=y;
	this.create=function(txt,x,y){
		if(map.canvas){
			
		}else{
			var s=DIV(txt);
			s.left=x*32;
			s.top=y*32-16;
			s.className="message";
			s.alpha=100;
			this.div=s;
			map.mapArea.appendChild(s);
		}
	}
	this.changeAlpha=function(to){
		var fv=function(a,b){a.style.opacity=b/100;};
		var from=this.div.alpha;
		for(var i=0;i<11;i++){//FIXME:nem lesz átlátszó
			setTimeout(fv,50*i,this.div,((to*(i/10)+(from*(1-i/10)))));
		}
	}
	this.create(txt,x,y);
}