!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e){e.exports={a:"0.0.1"}},function(e,t,n){var o=n(2);e.exports=o},function(e,t,n){var o;!function(i,r){var a=i.document,s="whats-element",l=s+"-tip-container",d=s+"-tip-delete",c=s+"-copy",u=s+"-unique-container",p=s+"-unique-id",f=function(e){this.options=Object.assign({},{draw:!0},e),this.lastClick=a.body;var t=this;a.addEventListener("mousedown",function(e){t.lastClick=e.target,t.focusedElement!==t.lastClick&&y.clean()})},y=f.prototype;function h(){a.querySelectorAll("."+s+"-active").forEach(function(e){e.classList.remove(s+"-active")})}function m(e,t){var n=a.createElement(e||"div");return t&&(n.id=t),n}y.getUniqueId=function(e,t){if(!((e=e||this.lastClick)instanceof HTMLElement))return console.error("invalid input,not a HTML element"),null;var n={wid:"",type:""},o=e.id,i=e.name,r=e.tagName.toLowerCase(),s=e.type?e.type.toLowerCase():"",l="";if((e.classList||[]).forEach(function(e){l+="."+e}),"body"!==r&&"html"!==r||(n.wid=r,n.type=r),o&&a.getElementById(o)===e){var d=new RegExp("^[a-zA-Z]+");t?d.test(o)&&(n.wid=r+"#"+o):n.wid=o,n.type="byId"}if(!n.wid&&i&&a.getElementsByName(i)[0]===e&&(n.wid=i,n.type="byName"),!n.wid&&l&&a.querySelector(r+l)===e&&(n.wid=r+l,n.type="byClass"),"radio"===s){var c=r+"[value='"+e.value+"']";i&&(c+="[name='"+i+"']"),a.querySelector(c)===e&&(n.wid=c,n.type="byValue")}if(n.wid||(c=r,c=l?c+l:c,c=i?c+"[name='"+i+"']":c,y.getTarget(c)===e&&(n.wid=c,n.type="byMixed")),!n.wid){c=r,c=l?c+l:c;var u=a.querySelectorAll(c);if(u&&u.length>0){for(var p=null,h=0;h<u.length;h++)if(e===u[h]){p=h+1;break}p&&(c=c+":nth-child("+p+")",a.querySelector(c)===e&&(n.wid=c,n.type="byOrder"))}}if(!n.wid){var m=f.prototype.getUniqueId(e.parentNode,!0).wid;if(!m)return;var g=r;if(l&&(g+=l),c=m+">"+g,a.querySelectorAll(c).length>1){c=null,p=null;for(var E=0;E<e.parentNode.children.length;E++)if(e.parentNode.children[E]===e){p=E+1;break}p>=1&&(c=m+">"+g+":nth-child("+p+")",a.querySelector(c)!=e&&(c=null))}n.wid=c,n.type="byParent"}return this.focusedElement=y.getTarget(n.wid),!t&&this.options.draw&&f.prototype.draw(n),n},y.getTarget=function(e){return a.getElementById(e)||a.getElementsByName(e)[0]||a.querySelector(e)},y.draw=function(e){var t=y.getTarget(e.wid);if(t){var n=a.getElementById(l)?a.getElementById(l):m("aside",l);n.innerHTML="",n.addEventListener("mousedown",function(e){e.stopPropagation()});var o=m("div",d);o.innerText="x",o.onclick=function(e){e.stopPropagation(),f.prototype.clean()},n.appendChild(o);var r=m("div",u),s=m("input",p);s.readOnly=!0,s.className=e.type,s.value=e.wid;var g=m("div",c);g.setAttribute("query-type",e.type),g.innerText="复制",g.onclick=function(){s.select(),a.execCommand("Copy")},r.appendChild(s),r.appendChild(g),n.appendChild(r);var E=t.getBoundingClientRect().top+t.offsetHeight,x=t.getBoundingClientRect().left+i.screenX,b=x<100?x:x-(240|n.offsetWidth)/2+t.offsetWidth/2-a.body.getBoundingClientRect().left;n.style.left=b+"px",n.style.top=E+i.scrollY+10+"px",a.body.appendChild(n),h(),t.classList.add("whats-element-active")}else console.error("no this element:"+e.wid)},y.clean=function(){h();var e=a.getElementById(l);e&&(e.outerHTML="")},void 0!==i&&null!==i&&(i.whatsElement=f),void 0!==i&&null!==i||(this.whatsElement=f),void 0!==e&&e.exports&&(e.exports=f),void 0===(o=function(){return f}.call(t,n,t,e))||(e.exports=o);var g=m("style"),E="#"+l+"{position:absolute;color:#8ed3fb;font-size:14px;z-index:1000;background-color:rgba(255, 255, 255,0.9);box-sizing:border-box;box-shadow:rgba(0, 0, 0, 0.2) 0px 1px 10px 3px;padding: 10px 20px;border-radius: 36px;}";E+="#"+d+"{cursor:pointer;position:absolute;top:-10px;width:20px;height: 20px;left:calc(50% - 8px);text-align:center;clip-path: polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;}",E+="#"+d+":hover{background:#fffbf0}",E+="#"+u+"{display:flex;justify-content:space-around;}",E+="#"+p+"{border:1px solid #d1d5da;box-shadow:inset 0 1px 2px rgba(27,31,35,0.075);text-indent:10px;}",E+="#"+c+"{background:aliceblue;cursor: pointer;}",E+="#"+c+"::after{position:absolute;z-index:1000000;padding: 0.1em 0.75em;color: #fff;text-align:center;text-shadow:none;text-transform:none;content:attr(query-type);background: #a88462;border-radius: 3px;opacity: 0;transition:all .5s}",E+="#"+c+":hover:after{display:inline-block;opacity: 1;}",E+=".whats-element-active{outline:red 1px dashed !important}",g.innerText=E,a.head.appendChild(g),i.whatsElement=f}(window)},function(e,t,n){"use strict";n.r(t);var o=n(0),i={EASYSHARECONTAINER:"easyshare-container",MENUID:"easyshare-menu",SHAREID:"easyshare-complete",WAITING:"WAITING",RECORDING:"RECORDING",PAUSE:"PAUSE",RECORDED:"RECORDED",FINNISHED:"FINNISHED",REPLAYING:"REPLAYING",REPLAYFINISHED:"REPLAYFINISHED"};function r(e,t,n){var o=document.createElement(e||"div");return t&&(o.id=t),n instanceof HTMLElement?o.appendChild(n):o.innerHTML=n,o}const a=function(){const e=r("button",i.MENUID,"分享"),t=r("button",i.SHAREID,"生成链接"),n=r("aside",i.EASYSHARECONTAINER,e);n.style.position="absolute",n.style.top=0,n.style.left=0,n.style.transition="0.5s",n.appendChild(t),document.body.appendChild(n)};var s=n(1);const l=new(n.n(s).a)({draw:!1}),d="ontouchstart"in window?"touchend":"mouseup",c="ontouchstart"in window?e=>{const t=e.touches[0]||e.changedTouches[0];return t?{x:t.pageX,y:t.pageY}:{x:0,y:0}}:e=>({x:(e=event||window.event).pageX||e.clientX+u().x,y:e.pageY||e.clientY+u().y});function u(){return{x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}}function p(e={autoReplay:!0,hightligth:!0}){this.options=e,this.recordedSteps=[];let t=i.PAUSE,n={};window.addEventListener("load",e=>{const t=window.location.search;if(t.indexOf("easyshare")>0){const e=t.substr(1).split("&");for(let t=0;t<e.length;t++){const n=e[t];if(n.indexOf("easyshare")>-1){const e=n.split("=");if(2===e.length){const t=[];e[1].split("a").forEach(e=>{const n={x:e.split("-")[0],y:e.split("-")[1]};t.push(n)}),this.replay(0,t)}break}}}}),a();const r=document.getElementById(i.MENUID),s=document.getElementById(i.SHAREID);r.onclick=(e=>{if(this.status!==i.RECORDED){if(this.status!=i.WAITING)return alert("当前状态不可记录"),!1;this.record(),r.innerHTML=t}else console.log("已经记录")}),s.onclick=(t=>{if(0===this.recordedSteps.length)return;let n="&easyshare=";this.recordedSteps.forEach((e,t)=>{0!=t&&(n+="a"),n+=e.x+"-"+e.y});let o=window.location.href,i=o.indexOf("&easyshare");""==window.location.search&&(o+="?"),i>-1&&(o=o.substr(0,i)),e.autoReplay&&(n+="&autoreplay=true"),history.pushState("","EasyShare 预览",o+n)}),document.addEventListener(d,e=>{const t=function(e){return{text:document.getSelection().toString().trim(),id:l.getUniqueId(e.target)}}(e);if(t.text===n.text)return void console.log("不再监听");const o=document.getElementById(i.EASYSHARECONTAINER);if(t.text){const{x:r,y:a}=c(e);o.style.transform=`translateX(${r}px) translateY(${a}px)`,o.style.display="block",this.status=i.WAITING,n={x:document.documentElement.scrollLeft,y:document.documentElement.scrollTop,text:t.text,id:t.id?t.id.wid:null}}else n={},o.style.display="none",this.status=i.PAUSE}),this.finished=function(){this.status=i.FINNISHED,this.setps=[]},this.record=function(e){this.status=i.RECORDING,this.recordedSteps.push(n),this.status=i.RECORDED,"function"==typeof e&&e()},this.replay=function(t=0,n=null){if((n=n||this.recordedSteps)<t+1)return;const{x:o,y:r,id:a}=n[t],s=l.getTarget(a);s&&e.hightligth&&(s.style.background="#e8d2bb"),this.status=i.REPLAYING,function(e=0,t=0,n){const o=setInterval(function(){const{x:i,y:r}=u(),a=e-i,s=t-r;!function(e=0,t=0){document.documentElement.scrollLeft=document.body.scrollLeft=e,document.documentElement.scrollTop=document.body.scrollTop=t}(i+Math.floor(a/6),Math.floor(r+s/6));const{x:l,y:d}=u();r===d&&i===l&&(clearInterval(o),n())},30)}(o,r,()=>{n.length!==t+1?e.autoReplay&&setTimeout(()=>this.replay(t+1,n),5e3):this.status=i.REPLAYFINISHED})},Object.defineProperty(this,"status",{get:()=>t,set:e=>{t=e,r.innerHTML=e}}),Object.defineProperty(this,"version",{value:o.a})}p.prototype.init=function(){console.log("init")},window.EasyShare=p}]);
//# sourceMappingURL=easyshare.js.map