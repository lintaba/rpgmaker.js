// ize#core.js by lintabá (copyright), 2009
(function(){
	var extendSetterGetter={
	height:	[function(_){if(isNaN(_)){exception("NaN height");return};this.style.height=_+"px"}
			,function(){return parseInt(this.style.height) || this.offsetHeight;}],
	width:	[function(_){if(isNaN(_)){exception("NaN width");return};this.style.width=_+"px"}
			,function(){return parseInt(this.style.width) || this.offsetWidth;},],
	top:	[function(_){if(isNaN(_)){exception("NaN top");return};if(this._T!=_){this.style.top=_+"px";this._T=_;}}
			,function(){return this._T || parseInt(this.style.top) || this.offsetTop;},],
	left:	[function(_){if(isNaN(_)){exception("NaN left");return};if(this._L!=_){this.style.left=_+"px";this._L=_;}}
			,function(){return this._L || parseInt(this.style.left) || this.offsetLeft;},],
	imageUrl:[function(_){if(this.imageUrl!=_){this.style.backgroundImage="url("+_+")";this.style.bgUrl=_}}
			,function(){return this.style.bgUrl || "";return this.style.backgroundImage.substring(4,this.style.backgroundImage.length-1);},],
	imagePos:[function(_){_=[_.x|_[0],_.y|_[1]];if(isNaN(_[0]) || isNaN(_[0])){exception("NaN imagePos");return;}this.style.backgroundPosition=""+_[0]*-1+"px "+_[1]*-1+"px"}
			,function(){var a=this.style.backgroundPosition.split(" ");return {x:a[0]*-1,0:a[0]*-1,y:a[1]*-1,1:a[1]*-1};},],
	alpha:	[function(_){if(isNaN(_)){exception("NaN alpha");return};this.style.filter="alpha(opacity="+_+")";this.style.MozOpacity=_/100;this.style.KhtmlOpacity=_/100;this.style.opacity=_/100;}
			,function(){return this.style.MozOpacity*100;},],
	color:	[function(_){this.style.backgroundColor=_;}
			,function(){return this.style.backgroundColor;},],
	Xdraggable:[function(_){if(this.dragObj==undefined){this.dragObj=new makeDraggable(this,isHtml(_)?_:this);}else if(isHtml(_)){this.dragObj.dragBy=_;}else{this.dragObj.enabled=_;};if(this.dragObj.enabled){this.style.cursor="pointer"}else{this.style.cursor="";}}
			,function(){return this.dragObj==undefined?null:this.dragObj.enabled;}],
	radius:[function(_){if(Browser=="FF"){this.style.MozBorderRadius=_;}else{this.style.WebkitBrowserRadius=_}},function(){}],
	radTL:[function(_){if(Browser=="FF"){this.style.MozBorderRadiusTopleft=_;}else{this.style.WebkitBrowserRadiusTopleft=_}},function(){}],
	radTR:[function(_){if(Browser=="FF"){this.style.MozBorderRadiusTopright=_;}else{this.style.WebkitBrowserRadiusTopright=_}},function(){}],
	radBL:[function(_){if(Browser=="FF"){this.style.MozBorderRadiusBottomleft=_;}else{this.style.WebkitBrowserRadiusBottomleft=_}},function(){}],
	radBR:[function(_){if(Browser=="FF"){this.style.MozBorderRadiusBottomright=_;}else{this.style.WebkitBrowserRadiusBottomright=_}},function(){}]
	};
	var extendFunction={
		hide:function(){this.style.display="none";return this;},
		show:function(){this.style.display="";return this;}
		,DIV:function(n,ih){var m=DIV();this[n]=m;m.className=n;this.appendChild(m);if(ih!=undefined){m.textContent=ih;};return this;}
		,elem:function(tag,name,ih,bind){
			var tmp=elem(tag,name,ih,bind);
			this.appendChild(tmp);
			if(name==undefined){return tmp;}
			this[name]=tmp;
			return this;
		},
		str:function(txt){
			this.appendChild(document.createTextNode(txt));
			return this;
		}
		,autosize:function(){
			var h=0;
			var w=0;
			for(var i=0;i<this.childNodes.length;i++){
				console.log("autosize",this.childNodes[i],this.childNodes[i].offsetHeight,this.childNodes[i].offsetWidth);
				h+=this.childNodes[i].offsetHeight;
				w+=this.childNodes[i].offsetWidth;
			}
			this.height=h;
			this.width=w;
			return this;
		}
		,$:function(x){return $(x,this);}
		,erase:function(){
			if(this==undefined){return this;}
			while(this.childNodes&&this.childNodes.length>0){
				if(this.childNodes[0].nodeName!="#text"){
					for(var s in this.childNodes[0]){
						delete this.childNodes[0][s];
					}
					this.childNodes[0].erase();
				}
				this.removeChild(this.childNodes[0]);
			}

			//this.innerHTML="";
			return this;
		}
		,cmenu:function(obj,owner){
			this.cmenuObj=obj;
			this.cmenuOwner=owner;
			this.addEventListener("contextmenu",function(e){
				openContextMenu(e.clientX,e.clientY,this.cmenuObj,this,document.body,this.cmenuOwner);
				e.stopPropagation();
			},false);
			return this;
		}
		,append:function(){
			for(var i=0;i<arguments.length;i++){
				var o=arguments[i];
				if(isString(o)){
					o=document.createTextNode(o);
				}
				this.appendChild(o);
			}
			return this;
		}
		/*,appendParent:function(e){
			var t=e.$("/*");
			for(var i=0;i<t.length;i++){
				this.appendChild(t[i].parentNode.removeChild(t[i]));
			}
		}*/,
		Style:function(o){
			for(var s in o){this.style[s]=o[s];}
			return this;
		},
		Attrib:function(o){
			for(var s in o){this.setAttribute(s,o[s]);}
			return this;
		},
		Property:function(o){
			for(var s in o){this[s]=o[s];}
			return this;
		}
	}
	for(var sor in extendSetterGetter){
		if(extendSetterGetter[sor].length==2){
			HTMLElement.prototype.__defineSetter__(sor,extendSetterGetter[sor][0]);
			HTMLElement.prototype.__defineGetter__(sor,extendSetterGetter[sor][1]);
		}
	}
	for(var sor in extendFunction){
		HTMLElement.prototype[sor]=extendFunction[sor];
	}
})();
function elem(tag,name,ih,bind){
	var tmp=document.createElement(tag);
	if(name){tmp.className=name;};
	if(isString(ih) && ih!=undefined){
		if(tag=="input"){tmp.value=ih;}else{tmp.textContent=ih;}
	}else if(isHtml(ih)){tmp.appendChild(ih);}
	if(tag=="input" || tag=="textarea"){
		tmp.addEventListener("focus",function(e){keyboard.focus(this);},false);
		tmp.addEventListener("blur",function(e){keyboard.blur(this);},false);
		tmp.key=function(a,b,e){if(e.isEsc){e.originalTarget.blur();}}
		if(isArray(bind) && bind.length==2){
			tmp.bindData=bind;
			tmp.addEventListener("change",function(){this.bindData[0][this.bindData[1]]=this.value;},false);
			tmp.title=ih;
			tmp.value="";
			if(bind[0]!=undefined && bind[0][bind[1]]){
				tmp.value=bind[0][bind[1]];
			}
		}
	}
	if(tag=="select" && isArray(ih)){
		for(var i=0;i<ih.length;i++){
			tmp.elem("option",false,ih[i]);
		}
		if(isArray(bind) && bind.length==2){
			tmp.bindData=bind;
			tmp.addEventListener("change",function(){this.bindData[0][this.bindData[1]]=this.selectedIndex;},false);
			if(bind[0]!=undefined && bind[0][bind[1]]){
				tmp.selectedIndex=bind[0][bind[1]];
			}
		}
	}
	if(tag=="a"){
		tmp.href="javascript:void(0);";
		//tmp.addEventListener("focus",function(){this.blur();},true);
	}
	return tmp;
}

function openContextMenu(x,y,obj,data,parent,owner){//e,obj,q,f
	if(parent.openedContextMenu!=undefined){parent.removeChild(parent.openedContextMenu);}
	var listDiv=DIV();
	parent.openedContextMenu=listDiv;
	listDiv.className="contextMenu";
	listDiv.left=x;
	listDiv.top=y;
	listDiv.itemList=[];
	listDiv.data=data;
	listDiv.parent=parent;
	listDiv.obj=obj;
	parent.listDiv=listDiv;
	listDiv.owner=owner;
	var PAR=parent;
	function CMclose(e){
		if(e.originalTarget.DC===true){return;}
		if(listDiv.parentNode){listDiv.parentNode.removeChild(listDiv);}
		PAR.openedContextMenu=undefined;
		e.stopPropagation();
		document.removeEventListener("click",CMclose,false);
	}
	for(var i in obj){
		if(obj[i]=="HR"){
			listDiv.elem("hr").DC=true;
			continue;
		}
		var itemDiv=DIV();
		listDiv.appendChild(itemDiv);
		itemDiv.className="contextItem";
		itemDiv.textContent=i;
		itemDiv.itemFunc=obj[i];

		if(typeof obj[i]=="function"){
			itemDiv.addEventListener("click",function(e){
				this.itemFunc.call(listDiv.owner,listDiv.data,e);
				CMclose(e);
			},false);
			listDiv.itemList.push(itemDiv);
		}else if(typeof obj[i]=="object"){
			itemDiv.addEventListener("mouseover",function(e){
				this.over=true;
				setTimeout(function(that,obj,data,parent){
					if(that.over){
						openContextMenu(that.offsetLeft+that.offsetWidth,that.offsetTop,obj,data,parent)
					}
				},800,this,obj[i],data,itemDiv);
			},false);
			itemDiv.addEventListener("mouseout",function(e){this.over=false;},false);
			itemDiv.className="contextSub";
			listDiv.itemList.push(itemDiv);
		}else{
			itemDiv.className="contextItemDisabled";
			itemDiv.DC=true;
		}
	}
	document.addEventListener("click",CMclose,false);
	parent.appendChild(listDiv);
}

var IMG=function(src){
	/*
	blurfast	amount(0 to 5)
	desaturate	average(true or false)
	flip		axis(vertical or horizontal)
	hsl    hue(-180 to 180)	saturation (-100 to 100)	lightness (-100 to 100)
	invert
	mosaic	blockSize(1 to n)
	resize	width	height
	rotate	angle
	*/
	var image=new Image();
	image.that=this;
	this.teendok=[];
	this.ready=false;
	this.SRC="";
	image.addEventListener("load",function(){image.that.finished();},false);
	this.__defineGetter__("obj",function(){return image;});
	this.__defineSetter__("src",function(src){if(isString(src)){this.ready=false;image.src=src;this.SRC=src;}});
	this.__defineGetter__("src",function(){return this.SRC;});

	this.filters={};
	this.process=function(mit,params){
		if(this.ready===true){
			this.ready=false;
			Pixastic.process(image,mit,params,function(){image.that.finished();});
			this.filters.mit=params;
		}else{
			console.log("notReady");
			this.teendok.push([mit,params]);
		}
	};
	this.finished=function(){
		this.ready=true;
		if(this.teendok.length!=0){
			var sor=this.teendok.shift();
			this.process(sor[0],sor[1]);
		}
	};
	this.save=function(){
		return {src:this.src,filters:this.filters};
	};
	this.load=function(obj){
		this.src=obj.src;
		for(var sor in obj.filters)
			this.process(sor,obj.filters[sor]);
	};
	this.src=src;
	this.copy=function(){
		var x=new IMG();
		x.load(this.save());
		return x;
	};
	this.createSelectorButton=function(){
		var contDiv=DIV().elem("div","div");
		var div=contDiv.div;

		div.width=getCharsetData(this.owner.C.charsetNum).w/4;
		div.height=getCharsetData(this.owner.C.charsetNum).h/4;
		div.imageUrl=getCharsetData(this.owner.C.charsetNum).src;
		div.imagePos=[this.owner.anim*div.width,[3,1,2,0][this.owner.irany]*div.height];
		div.obj=this;
		div.className="ImageSelector";
		div.owner=this.owner;

		div.addEventListener("click",function(e){
			var win=Win.modal({});
			var d=DIV();
			win.height=300;
			win.width=500;
			win.title="Kép módosítása";
			//bal
			var lf=d.elem("div");
			lf.className="setImageLeftList";
			lf.elem("select","s");
			lf.s.multiple=true;
			var selIn=0;
			for(var i=0;i<GAME.data.charsets.length;i++){
				var option=lf.s.elem("option",undefined,getCharsetData(i9.name));
				option.value=i;
				if(i==this.owner.C.charsetNum){lf.s.selectedIndex=i;selIn=i;}
			}
			lf.s.optSel=function(index,obj){
				var img=obj.parentNode.parentNode.img;
				img.src=getCharsetData(index).src;
				img.SRC=getCharsetData(index).src;
				img.height=getCharsetData(index).h;
				img.width=getCharsetData(index).w;
				img.selIn=index;
				img.e.style.visibility="visible";
				var pos=[img.obj.owner.anim,[3,1,2,0][img.obj.owner.irany]];
				img.e.left=pos[0]*img.width/4+img.left
				img.e.top=pos[1]*img.height/4+img.top
				img.e.width=img.width/4;
				img.e.height=img.height/4;
				img.pos=pos;
			}
			lf.s.addEventListener("change",function(e){this.optSel(this.selectedIndex,this);},false);


			d.elem("img","img");
			d.elem("div","e");
			d.e.style.border="2px solid red";
			d.e.style.position="absolute";
			d.e.style.visibility="hidden";
			d.img.e=d.e;
			d.img.obj=this.obj;
			d.img.addEventListener("click",function(e){
				var pos=[(Math.floor((e.layerX-this.left)/this.width*4)+4)%4,(Math.floor((e.layerY)/this.height*4)+4)%4];
				this.e.style.visibility="visible";
				this.e.left=pos[0]*this.width/4+this.left
				this.e.top=pos[1]*this.height/4+this.top
				this.e.width=this.width/4;
				this.e.height=this.height/4;
				this.pos=pos;
			},true);
			var sb=DIV();
			sb.elem("button","save","Mentés");
			sb.elem("button","close","Mégsem");
			sb.save.obj=this.obj;
			sb.d=d;
			sb.save.addEventListener("click",function(e){
				//mentés...
				//visszatesszük az img-be
				var img=this.parentNode.d.img
				this.obj.src=img.SRC;
				//this.obj.datas={x:img.pos[0],y:img.pos[1],h:img.height/4,w:img.width/4};
				this.obj.owner.C.charsetNum=img.selIn;
				this.obj.owner.irany=[3,1,2,0][img.pos[1]];
				this.obj.owner.anim=img.pos[0];


				var div=this.obj.selectorButton.div;
				div.width=getCharData(this.obj.owner.C.charsetNum).w/4;
				div.height=getCharData(this.obj.owner.C.charsetNum).h/4;
				div.imageUrl=getCharData(this.obj.owner.C.charsetNum).src;
				div.imagePos=[this.obj.owner.anim*div.width,[3,1,2,0][this.obj.owner.irany]*div.height];


				win.destroy()
			},false);
			sb.close.addEventListener("click",function(){win.destroy()},false);
			win.setStatus(sb);
			win.setContent(d);
			lf.s.optSel(selIn,lf.s);
		},false);
		this.selectorButton=contDiv;
		return contDiv;
	}
}
if(window.console==undefined){
	var names = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
	window.console = {};
	for(var i=0;i<names.length;++i)window.console[names[i]]=function(){};
	}else{

}
function copy(obj,n){
	if(n==undefined){n=0;}
	if(n>10){return "TooManyRecursion";}
	var newObj=(obj instanceof Array)?[]:{};
	for(var i in obj){
		if(obj[i] instanceof IMG){
			newObj[i]=obj[i].copy();
		}else if(obj[i] && typeof obj[i]=="object"){
			newObj[i]=copy(obj[i]);
		}else{
			newObj[i]=obj[i];
		}
	}
	return newObj;
}

//var Browser=(function x(){})[-5]=='x'||(function x(){})[-6]=='x'||/a/[-1]=='a'?'FF':'\v'=='v'?'IE':/a/.__proto__=='//'?'Saf':'xx';
var Browser=navigator.userAgent.indexOf("Firefox")!=-1?"FF":"xx";

Array.prototype.inArray=function(value){for(var i=0;i<this.length;i++){if(this[i]===value){return true;}}return false;};
function DIV(ih){var x=document.createElement("div");if(ih){x.textContent=ih;};return x;}
function isArray(_){return _ instanceof Array;}
function isHtml (_){return _ instanceof HTMLElement;}
function isString(_){return typeof _ =="string";}
function isNumeric(_){return typeof _ =="number";}
function isFunction(_){return typeof _ =="function";}
function rnd(a,b){return Math.floor(Math.random()*(b!=undefined?b-a:a)+(b==undefined?0:a));}
function randomSelect(arr){return arr[rnd(arr.length)];}
function $(x,y){
	if(y==undefined){y=document;}
	if(isString(x)){
		if(x.charAt(0)=="."){
			return y.getElementsByClassName(x.substr(1,x.length-1))[0];
		}else if(x.charAt(0)=="/"){
			var iterator=document.evaluate(x,y,null,6,null);
			var out=[];
			for(var i=0;i<iterator.snapshotLength;i++){
				out.push(iterator.snapshotItem(i));
			}
			return out;
		}else{
			return y.getElementById(x);
		}
	}else{
		return x;
	}
};
function style(item,obj){
	for(var name in obj){
		if(item.style[name]!=obj[name]){
			item.style[name]=obj[name];
		}
	}
}

function getScrollXY() {
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfX, scrOfY ];
}
function makeDraggable(obj,dragBy){
	var that=this;
	this.dragBy=dragBy;
	this.enabled=true;
	obj.x=this;
	obj.addEventListener("mousedown",function(e){
		if(that==undefined){var that=this.x;}
		if(that.enabled==false){return;}
		that.start=[e.layerX || e.offsetX,e.layerY || e.offsetY];
		document.body.onmousemove=that.move;
		document.body.onmouseup=that.up;
	},true);
	this.move=function(e){
		that.dragBy.left=e.clientX-that.start[0]+getScrollXY()[0];
		that.dragBy.top=e.clientY-that.start[1]+getScrollXY()[1];
	}
	this.up=function(e){
		document.body.onmousemove=document.body.onmouseup="";
	}
}

function exception(msg){
	document.g=msg;
	if(msg instanceof Object){
		console.group("KIVÉTEL:",arguments[1],{e:msg});
		console.warn("file:",msg.filename);
		console.warn("line:",msg.lineNumber);
		console.warn("message:",msg.message);
		console.warn("name:",msg.name);
	}else{
		console.group("Kivétel keletkezett, "+(msg!=undefined?"leírás: /"+msg+"/":"")+"  stack:");
		if(arguments.length>1){console.info.apply(console,arguments);}
	}
	var P=arguments.callee.caller,i=0;
	while(P){
		console.log(P,P.arguments);
		P=P.caller;
		if(++i>10){console.log("too many recursion");break;}
	}
	console.groupEnd();
}

function Win(data){
	var that=this;
	this.html=DIV();
	this.html.className="window";
	this.html.DIV("head");
	this.html.head.DIV("nw");
	this.html.head.nw.DIV("n");
	this.html.head.nw.n.DIV("ne");
	this.html.head.nw.n.ne.DIV("closex");
	this.html.head.nw.n.ne.DIV("data");
	this.html.DIV("content");
	this.html.content.DIV("w")
	this.html.content.w.DIV("e")
	this.html.content.w.e.DIV("data")
	this.html.DIV("status");
	this.html.status.DIV("sw");
	this.html.status.sw.DIV("se");
	this.html.status.sw.se.DIV("s");
	this.html.status.sw.se.s.DIV("data");
	this.html.DIV("lock");
	this.html.win=this;
	this.html.head.nw.n.ne.closex.addEventListener("click",function(){that.destroy();},true);
	this.n=++Win.prototype.counter;
	Win.prototype.windows.push(this);
	Win.prototype.mouseSelected=this;
	style(this.html,{zIndex:Win.prototype.counter+142});
	this.html.lock.draggable=false;
	this.html.head.nw.n.ne.data.Xdraggable=this.html;

	$("//body")[0].appendChild(this.html);
	this.config={minHeight:40,minWidth:55,maxHeight:0,maxWidth:0};
	this.edit={};

	this.__defineSetter__("height",function(_){
		if(this.config.minHeight!=0 && this.config.minHeight>_){_=this.config.minHeight;}
		if(this.config.maxHeight!=0 && this.config.maxHeight<_){_=this.config.maxHeight;}
		this.html.style.minHeight=_+"px";
		this.html.heigh=_;
		this.html.content.height=_-25;
		this.html.content.w.e.data.height=_-25;
	});
	this.__defineGetter__("height",function(){return this.html.heigh});
	this.__defineSetter__("width",function(_){
		if(this.config.minWidth!=0 && this.config.minWidth>_){_=this.config.minWidth;}
		if(this.config.maxWidth!=0 && this.config.maxWidth<_){_=this.config.maxWidth;}
		this.html.width=_;
		//this.html.content.width=_;
		//this.html.status.width=_;
	});
	this.__defineGetter__("width",function(){return this.html.width});
	this.__defineSetter__("x",function(_){this.html.left=_;});
	this.__defineGetter__("x",function(){return this.html.left});
	this.__defineSetter__("y",function(_){this.html.top=_;});
	this.__defineGetter__("y",function(){return this.html.top});
	this.__defineSetter__("title",function(_){this.html.head.nw.n.ne.data.textContent=_;});
	this.__defineGetter__("title",function(){return this.html.head.nw.n.ne.data.textContent;});
	this.__defineSetter__("status",function(_){this.html.status.sw.se.s.data.textContent=_;});
	this.__defineGetter__("status",function(){return this.html.status.sw.se.s.data.textContent;});
	this.show=function(){this.html.show();}
	this.hide=function(){this.html.hide();}
	this.lock=function(){this.html.className="window locked";}
	this.unlock=function(){this.html.className="window";}
	this.modal=function(d){
		var x=new Win(d);
		x.x=rnd(200,400);
		x.y=rnd(100,300);
		x.parent=this;
		this.lock();
		return x;
	}
	this.setTitle=function(o){this.html.head.nw.n.ne.data.erase().appendChild(o);}
	this.setContent=function(o){this.html.content.w.e.data.erase().appendChild(o);}
	this.setStatus=function(o){this.html.status.sw.se.s.data.erase().appendChild(o);}
	this.destroy=function(){
		if(isFunction(this.onClose)){this.onClose();}
		if(this.parent){this.parent.unlock();}
		Win.prototype.counter--;
		this.html.parentNode.removeChild(this.html);
		var tmp=[];
		for(var i=0;i<Win.prototype.windows.length;i++){
			if(i==this.n){continue;}
			tmp.push(Win.prototype.windows[i]);
		}
		Win.prototype.windows=tmp;
		for(var a in this){delete this[a];}
	}
	this.activateData=function(data){
		this.height=data.height || 100;
		this.width=data.width || 100;
		this.title=data.title || "";
		this.content=data.content || "";
		this.status=data.status || "";

		//for(var a in data){this.config[a]=data[a];}
	}

	this.activateData(data);
	this.autoSize=function(){
		this.height=this.html.content.firstChild.offsetHeight+40;
		this.width=this.html.content.firstChild.offsetWidth;
	}
	this.appendChild=function(x){this.html.content.w.e.data.appendChild(x);}
	this.erease=function(){this.html.content.w.e.data.erease();}
}
Win.modal=function(a){return Win.prototype.windows[Win.prototype.counter-1].modal(a);}
Win.prototype.counter=0;
Win.prototype.windows=[];
function call(fv,x){
	if(fv==null || fv==undefined || fv==false){return null;}
	if(isFunction(fv)){return fv(x);}
	if(fv.c!=undefined && fv.c.length>0){return script(fv,x);}
	return false;
}
function Vertab(){
	var that=this;
	var theDiv=new DIV();
	theDiv.className="vertabCont";
	this.autoClose=false;
	var tabs=[];
	this.push=function(name,div,v){
		var tab=DIV();
		tab.className="oneBlock"
		tab.DIV("head");
		tab.head.elem("a","x");
		tab.head.DIV("t",name);

		tab.DIV("content");
		tab.content.appendChild(div);

		tab.head.x.that=this;
		tab.head.x.tab=tab;
		tab.opened=true;
		tab.head.x.className="xc";
		if(v==0){
			this.exCl({},tab.head.x);
		}

		tab.head.x.addEventListener("click",function(e){that.exCl(e,this);},false);

		tabs.push([name,div]);
		theDiv.appendChild(tab);
	}
	this.exCl=function(e,o){
		if(o.tab.opened==true){
			o.tab.content.hide();
			o.className="xo";
		}else{
			o.tab.content.show();
			o.className="xc";
		}
		o.tab.opened=!o.tab.opened;
	}
	this.__defineGetter__("element",function(){return theDiv;});

}

function Tabs(){
	var that=this;
	var theDiv=new DIV();
	theDiv.className="tabContainer";
	theDiv.DIV("tabList");
	theDiv.DIV("tabContent");
	theDiv.tabs=this;
	this.tabs=[];
	var tabNames=[];
	this.selectedTab=0;
	this.__defineGetter__("aktiv",function(){return this.tabs[this.selectedTab];});
	this.__defineGetter__("element",function(){return theDiv;});
	this.onChange=null;
	function generateHead(){
		theDiv.tabList.innerHTML="";
		for(var i=0;i<tabNames.length;i++){
			var oneTab=DIV();
			oneTab.textContent=tabNames[i];
			oneTab.className="tabSel"+(i==that.selectedTab?" selected":"");
			oneTab.i=i;
			oneTab.addEventListener("click",function(){that.selectTab(this.i);},true);
			theDiv.tabList.appendChild(oneTab);
		}
	}
	this.setMode=function(to){
		if(to=="inline"){
			theDiv.className="tabContainerInline";
		}
	}
	this.selectTab=function(n){
		if(this.selectedTab==n){return;}
		if(n==undefined || n>=this.tabs.length){n=0;}
		this.tabs[this.selectedTab].hide();
		this.selectedTab=n;
		this.tabs[this.selectedTab].show();
		generateHead();
		if(this.onChange!=null){this.onChange();};
	}
	this.push=function(name,content){
		content.className="tab";
		theDiv.tabContent.appendChild(content);
		this.tabs.push(content);
		tabNames.push(name);
		content.hide();
		this.selectTab();
	}
}
//array
function removeFirst(arr){
	var o=[];
	for(var i=1;i<arr.length;i++){
		o.push(arr[i]);
	}
	return o;
}
function removeItem(arr,n){
	var o=[];
	for(var i=0;i<arr.length;i++){
		if(i!=n){
			o.push(arr[i]);
		}
	}
	return o;
}
function insertAfter(arr,n,item){
	var o=[];
	for(var i=0;i<arr.length;i++){
		o.push(arr[i]);
		if(i==n){o.push(item);}
	}
	if(arr.length==o.length){o.push(item);}
	return o;
}
function insertBefore(arr,n,item){
	var o=[];
	for(var i=0;i<arr.length;i++){
		if(i==n){o.push(item);}
		o.push(arr[i]);
	}
	if(arr.length==o.length){o.push(item);}
	return o;
}
function unique(arr){
	var o=[],l=arr.length,i,j;
	ck:for(var i=0;i<l;i++){
		for(var j=0;j<o.length;j++){
			if(o[j]===arr[i]){continue ck;}
		}
        o.push(arr[i]);
	}
    return o;
}
document.addEventListener("contextmenu",function(e){if(e.explicitOriginalTarget.contMen42==42){return;};console.log(e,e.explicitOriginalTarget);e.stopPropagation();e.cancel=true;delete e;},false);

function merge(base,extend){
	if(extend==undefined){return base;}
	for(var x in extend){
		base[x]=extend[x];
	}
	return base;
}


function B64_encode(input){
	var _keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var output="",c=[],e=[];
	var utftext="";

	input=input.replace(/\r\n/g,"\n");

	for(var n=0;n<input.length;n++){
		var c=input.charCodeAt(n);
		if(c<128){
			utftext+=String.fromCharCode(c);
		}
		else if((c>127)&&(c<2048)){
			utftext+=String.fromCharCode((c>>6)|192)+String.fromCharCode((c&63)|128);
		}
		else{
			utftext+=String.fromCharCode((c>>12)|224)+String.fromCharCode(((c>>6)&63)|128)+String.fromCharCode((c&63)|128);
		}
	}

	input=utftext;
	for(var i=0;i<input.length;i){
		c=[input.charCodeAt(i++),input.charCodeAt(i++),input.charCodeAt(i++)];
		e=[c[0]>>2,((c[0]&3)<<4)|(c[1]>>4),((c[1]&15)<<2)|(c[2]>>6),c[2]&63];
		if(isNaN(c[1])){
			e[2]=e[3]=64;
		}else if(isNaN(c[2])){
			e[3]=64;
		}
		output+=_keyStr.charAt(e[0])+_keyStr.charAt(e[1])+_keyStr.charAt(e[2])+_keyStr.charAt(e[3]);

	}

	return output;
}

function sorozat(a,b,n){for(var i=0,o=[];i<n;o[i++]=(b-a)/n*i+a){};return o}
function put2arr(arr,x,y,data){
	if(!isArray(arr[x])){arr[x]=[];}
	if(!isArray(arr[x][y])){arr[x][y]=[data];}else
	arr[x][y].push(data);
	return arr[x][y].length;
}

function sleep(ms){
	var a=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP")
	if(a){
		a.open("GET", "sleep.php?t="+ms, false);
		a.send(null);
		return true;
	}
	return false;
}
function removeItem(arr,n){
	var p=arr.pop();
    if(arr.length!=n){arr[n]=p;}
	return arr;
}
function arr_find(arr,t){for(var i=0;i<arr.length;i++){if(arr[i]==t){return i;}};return -1;}
function removeItemS(arr,n){
	for(var i=0;i<arr.length;i++){if(arr[i]==n){return removeItem(arr,i);}}
}

function array_complement(a,b){//csak az elsõ két elemet hasonlítja össze!	visszatér A azon elemeivel, amiket B nem tartalmaz
	var c=[],v;
	for(var i=0;i<a.length;i++){
		v=true;
		for(var j=0;j<b.length;j++){
			if(a[i][0]==b[j][0] && a[i][1]==b[j][1]){v=false;break;}
		}
		if(v){c.push(a[i]);}
	}
	return c;
}
function inRange(min,n,max){return min<=n && n<=max}
function toRange(min,n,max){return Math.min(max,Math.max(n,min));}
