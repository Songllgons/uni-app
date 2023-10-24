"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("fs"),e=require("path"),n=require("debug"),s=require("merge"),i=require("jsonc-parser"),o=require("licia/isRelative"),r=require("ws"),a=require("events"),c=require("licia/uuid"),l=require("licia/stringify"),p=require("licia/dateFormat"),u=require("licia/waitUntil"),h=require("os"),d=require("address"),m=require("default-gateway"),g=require("licia/isStr"),y=require("licia/getPort"),f=require("qrcode-terminal"),v=require("licia/fs"),w=require("licia/isFn"),P=require("licia/trim"),M=require("licia/startWith"),k=require("licia/isNum"),E=require("licia/sleep"),I=require("licia/isUndef"),b=require("child_process"),A=require("licia/toStr");function C(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var T=C(t),S=C(e),D=C(n),N=C(o),U=C(r),_=C(c),R=C(l),O=C(p),j=C(u),x=C(h),$=C(d),q=C(m),L=C(g),F=C(y),H=C(f),W=C(v),B=C(w),X=C(P),J=C(M),V=C(k),G=C(E),z=C(I),K=C(A);class Y extends a.EventEmitter{constructor(t){super(),this.ws=t,this.ws.addEventListener("message",(t=>{this.emit("message",t.data)})),this.ws.addEventListener("close",(()=>{this.emit("close")}))}send(t){this.ws.send(t)}close(){this.ws.close()}}const Q=new Map,Z=["onCompassChange","onThemeChange","onUserCaptureScreen","onWindowResize","onMemoryWarning","onAccelerometerChange","onKeyboardHeightChange","onNetworkStatusChange","onPushMessage","onLocationChange","onGetWifiList","onWifiConnected","onWifiConnectedWithPartialInfo","onSocketOpen","onSocketError","onSocketMessage","onSocketClose"];const tt=new Map;function et(t,e){(null==t?void 0:t.success)&&"function"==typeof(null==t?void 0:t.success)&&(e?t.success(e):t.success()),(null==t?void 0:t.complete)&&"function"==typeof(null==t?void 0:t.complete)&&(e?t.complete(e):t.complete())}function nt(t,e){(null==t?void 0:t.fail)&&"function"==typeof(null==t?void 0:t.fail)&&(e?t.fail(e):t.fail()),(null==t?void 0:t.complete)&&"function"==typeof(null==t?void 0:t.complete)&&(e?t.complete(e):t.complete())}async function st(t,e){const[n,s]=function(t){return L.default(t)?[!0,[t]]:[!1,t]}(e),i=await t(s);return n?i[0]:i}function it(t){try{return require(t)}catch(e){return require(require.resolve(t,{paths:[process.cwd()]}))}}/^win/.test(process.platform);const ot="Connection closed";class rt extends a.EventEmitter{constructor(t,e,n){super(),this.puppet=e,this.namespace=n,this.callbacks=new Map,this.transport=t,this.isAlive=!0,this.id=Date.now(),this.debug=D.default("automator:protocol:"+this.namespace),this.onMessage=t=>{var e,n;if(this.isAlive=!0,"true"===process.env.UNI_APP_X&&t.includes("pong"))return;this.debug(`${O.default("yyyy-mm-dd HH:MM:ss:l")} ◀ RECV ${t}`);const{id:s,method:i,error:o,result:r,params:a}=JSON.parse(t);if(null===(e=null==r?void 0:r.method)||void 0===e?void 0:e.startsWith("on"))return void((t,e)=>{const n=Q.get(t.method);(null==n?void 0:n.has(e))&&n.get(e)(t.data)})(r,s);if(null===(n=null==r?void 0:r.method)||void 0===n?void 0:n.startsWith("Socket.")){return void((t,e,n)=>{const s=tt.get(e);(null==s?void 0:s.has(t))&&s.get(t)(n)})(r.method.replace("Socket.",""),r.id,r.data)}if(!s)return this.puppet.emit(i,a);const{callbacks:c}=this;if(s&&c.has(s)){const t=c.get(s);c.delete(s),o?t.reject(Error(o.message||o.detailMessage||o.errMsg)):t.resolve(r)}},this.onClose=()=>{this.callbacks.forEach((t=>{t.reject(Error(ot))}))},this.transport.on("message",this.onMessage),this.transport.on("close",this.onClose)}send(t,e={},n=!0){if(n&&this.puppet.adapter.has(t))return this.puppet.adapter.send(this,t,e);const s=_.default(),i=R.default({id:s,method:t,params:e});return"ping"!==t&&this.debug(`${O.default("yyyy-mm-dd HH:MM:ss:l")} SEND ► ${i}`),new Promise(((t,e)=>{try{this.transport.send(i)}catch(t){e(Error(ot))}this.callbacks.set(s,{resolve:t,reject:e})}))}dispose(){this.transport.close()}startHeartbeat(){if("true"===process.env.UNI_APP_X&&"android"===process.env.UNI_APP_PLATFORM){const t=new Map,e=it("adbkit"),n=5e3,s=x.default.platform();let i="",o="";"darwin"===s?(i='dumpsys activity | grep "Run"',o=`logcat -b crash | grep -C 10 ${"io.dcloud.uniappx"}`):"win32"===s&&(i='dumpsys activity | findstr "Run"',o="logcat | findstr UncaughtExceptionHandler"),t.set(this.id,setInterval((async()=>{if(!this.isAlive){const n=e.createClient(),s=await n.listDevices();if(!s.length)throw Error("Device not found");const r=s[0].id;return n.shell(r,i).then((function(t){let e,n="";t.on("data",(function(t){n+=t.toString(),e&&clearTimeout(e),e=setTimeout((()=>{n.includes("io.dcloud")||D.default("automator:runtime ")("Stop the test process.")}),100)}))})),n.shell(r,o).then((t=>{let e,n="";t.on("data",(t=>{n+=t.toString(),e&&clearTimeout(e),e=setTimeout((()=>{D.default("automator:runtime ")(`crash log: ${n}`)}),100)}))})),clearInterval(t.get(this.id)),t.delete(this.id),void this.dispose()}this.send("ping"),this.isAlive=!1}),n))}}static createDevtoolConnection(t,e){return new Promise(((n,s)=>{const i=new U.default(t);i.addEventListener("open",(()=>{n(new rt(new Y(i),e,"devtool"))})),i.addEventListener("error",s)}))}static createRuntimeConnection(t,e,n){return new Promise(((s,i)=>{D.default("automator:runtime")(`${O.default("yyyy-mm-dd HH:MM:ss:l")} port=${t}`);const o=new U.default.Server({port:t});j.default((async()=>{if(e.runtimeConnection)return!0}),n,1e3).catch((()=>{o.close(),i("Failed to connect to runtime, please make sure the project is running")})),o.on("connection",(function(t){D.default("automator:runtime")(`${O.default("yyyy-mm-dd HH:MM:ss:l")} connected`);const n=new rt(new Y(t),e,"runtime");e.setRuntimeConnection(n),n.startHeartbeat(),s(n)})),e.setRuntimeServer(o)}))}}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function at(t,e,n,s){var i,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,n):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,n,s);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(r=(o<3?i(r):o>3?i(e,n,r):i(e,n))||r);return o>3&&r&&Object.defineProperty(e,n,r),r}var ct;function lt(t,e){const n=e.value;return e.value=async function(e){return(await(null==n?void 0:n.call(this,e)))(t)},e}function pt(t,e,n){return lt(ct.RUNTIME,n)}function ut(t,e,n){return lt(ct.DEVTOOL,n)}!function(t){t.RUNTIME="runtime",t.DEVTOOL="devtool"}(ct||(ct={}));class ht{constructor(t){this.puppet=t}invoke(t,e){return async n=>this.puppet.devtoolConnection?(n===ct.DEVTOOL?this.puppet.devtoolConnection:this.puppet.runtimeConnection).send(t,e):this.puppet.runtimeConnection.send(t,e)}on(t,e){this.puppet.on(t,e)}}class dt extends ht{constructor(t,e){super(t),this.id=e.elementId,this.pageId=e.pageId,this.nodeId=e.nodeId,this.videoId=e.videoId}async getData(t){return this.invokeMethod("Element.getData",t)}async setData(t){return this.invokeMethod("Element.setData",t)}async callMethod(t){return this.invokeMethod("Element.callMethod",t)}async getElement(t){return this.invokeMethod("Element.getElement",t)}async getElements(t){return this.invokeMethod("Element.getElements",t)}async getOffset(){return this.invokeMethod("Element.getOffset")}async getHTML(t){return this.invokeMethod("Element.getHTML",t)}async getAttributes(t){return this.invokeMethod("Element.getAttributes",t)}async getStyles(t){return this.invokeMethod("Element.getStyles",t)}async getDOMProperties(t){return this.invokeMethod("Element.getDOMProperties",t)}async getProperties(t){return this.invokeMethod("Element.getProperties",t)}async tap(){return this.invokeMethod("Element.tap")}async longpress(){return this.invokeMethod("Element.longpress")}async touchstart(t){return this.invokeMethod("Element.touchstart",t)}async touchmove(t){return this.invokeMethod("Element.touchmove",t)}async touchend(t){return this.invokeMethod("Element.touchend",t)}async triggerEvent(t){return this.invokeMethod("Element.triggerEvent",t)}async callFunction(t){return this.invokeMethod("Element.callFunction",t)}async callContextMethod(t){return this.invokeMethod("Element.callContextMethod",t)}invokeMethod(t,e={}){return e.elementId=this.id,e.pageId=this.pageId,this.nodeId&&(e.nodeId=this.nodeId),this.videoId&&(e.videoId=this.videoId),this.invoke(t,e)}}at([pt],dt.prototype,"getData",null),at([pt],dt.prototype,"setData",null),at([pt],dt.prototype,"callMethod",null),at([ut],dt.prototype,"getElement",null),at([ut],dt.prototype,"getElements",null),at([ut],dt.prototype,"getOffset",null),at([ut],dt.prototype,"getHTML",null),at([ut],dt.prototype,"getAttributes",null),at([ut],dt.prototype,"getStyles",null),at([ut],dt.prototype,"getDOMProperties",null),at([ut],dt.prototype,"getProperties",null),at([ut],dt.prototype,"tap",null),at([ut],dt.prototype,"longpress",null),at([ut],dt.prototype,"touchstart",null),at([ut],dt.prototype,"touchmove",null),at([ut],dt.prototype,"touchend",null),at([ut],dt.prototype,"triggerEvent",null),at([ut],dt.prototype,"callFunction",null),at([ut],dt.prototype,"callContextMethod",null);const mt=Object.prototype.hasOwnProperty,gt=Array.isArray,yt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;function ft(t,e){if(gt(t))return t;if(e&&(n=e,s=t,mt.call(n,s)))return[t];var n,s;const i=[];return t.replace(yt,(function(t,e,n,s){return i.push(n?s.replace(/\\(\\)?/g,"$1"):e||t),s})),i}function vt(t,e){const n=ft(e,t);let s;for(s=n.shift();null!=s;){if(null==(t=t[s]))return;s=n.shift()}return t}const wt=require("util");class Pt{constructor(t,e,n){this.puppet=t,this.id=e.elementId,this.pageId=e.pageId,this.nodeId=e.nodeId||null,this.videoId=e.videoId||null,this.tagName=e.tagName,this.nvue=e.nvue,this.elementMap=n,"body"!==this.tagName&&"page-body"!==this.tagName||(this.tagName="page"),this.api=new dt(t,e)}toJSON(){return JSON.stringify({id:this.id,tagName:this.tagName,pageId:this.pageId,nodeId:this.nodeId,videoId:this.videoId})}toString(){return this.toJSON()}[wt.inspect.custom](){return this.toJSON()}async $(t){try{const e=await this.api.getElement({selector:t});return Pt.create(this.puppet,Object.assign({},e,{pageId:this.pageId}),this.elementMap)}catch(t){return null}}async $$(t){const{elements:e}=await this.api.getElements({selector:t});return e.map((t=>Pt.create(this.puppet,Object.assign({},t,{pageId:this.pageId}),this.elementMap)))}async size(){const[t,e]=await this.domProperty(["offsetWidth","offsetHeight"]);return{width:t,height:e}}async offset(){const{left:t,top:e}=await this.api.getOffset();return{left:t,top:e}}async text(){return this.domProperty("innerText")}async attribute(t){if(!L.default(t))throw Error("name must be a string");return(await this.api.getAttributes({names:[t]})).attributes[0]}async value(){return this.property("value")}async property(t){if(!L.default(t))throw Error("name must be a string");if(this.puppet.checkProperty){let e=this.publicProps;if(e||(this.publicProps=e=await this._property("__propPublic")),!e[t])throw Error(`${this.tagName}.${t} not exists`)}return this._property(t)}async html(){return(await this.api.getHTML({type:"inner"})).html}async outerHtml(){return(await this.api.getHTML({type:"outer"})).html}async style(t){if(!L.default(t))throw Error("name must be a string");return(await this.api.getStyles({names:[t]})).styles[0]}async tap(){return this.api.tap()}async longpress(){return this.nvue||"true"===process.env.UNI_APP_X?this.api.longpress():(await this.touchstart(),await G.default(350),this.touchend())}async trigger(t,e){const n={type:t};return z.default(e)||(n.detail=e),this.api.triggerEvent(n)}async touchstart(t){return this.api.touchstart(t)}async touchmove(t){return this.api.touchmove(t)}async touchend(t){return this.api.touchend(t)}async domProperty(t){return st((async t=>(await this.api.getDOMProperties({names:t})).properties),t)}_property(t){return st((async t=>(await this.api.getProperties({names:t})).properties),t)}send(t,e){return e.elementId=this.id,e.pageId=this.pageId,this.nodeId&&(e.nodeId=this.nodeId),this.videoId&&(e.videoId=this.videoId),this.puppet.send(t,e)}async callFunction(t,...e){return(await this.api.callFunction({functionName:t,args:e})).result}static create(t,e,n){let s,i=n.get(e.elementId);if(i)return i;if(e.nodeId)s=Mt;else switch(e.tagName.toLowerCase()){case"input":s=kt;break;case"textarea":s=Et;break;case"scroll-view":s=It;break;case"swiper":s=bt;break;case"movable-view":s=At;break;case"switch":s=Ct;break;case"slider":s=Tt;break;case"video":s=St;break;default:s=Pt}return i=new s(t,e,n),n.set(e.elementId,i),i}}class Mt extends Pt{async setData(t){return this.api.setData({data:t})}async data(t){const e={};if(t&&(e.path=t),"true"!==process.env.UNI_APP_X)return(await this.api.getData(e)).data;const n=(await this.api.getData(e)).data;return t?vt(n,t):n}async callMethod(t,...e){return(await this.api.callMethod({method:t,args:e})).result}}class kt extends Pt{async input(t){return this.callFunction("input.input",t)}}class Et extends Pt{async input(t){return this.callFunction("textarea.input",t)}}class It extends Pt{async scrollTo(t,e){return this.callFunction("scroll-view.scrollTo",t,e)}async property(t){return"scrollTop"===t?this.callFunction("scroll-view.scrollTop"):"scrollLeft"===t?this.callFunction("scroll-view.scrollLeft"):super.property(t)}async scrollWidth(){return this.callFunction("scroll-view.scrollWidth")}async scrollHeight(){return this.callFunction("scroll-view.scrollHeight")}}class bt extends Pt{async swipeTo(t){return this.callFunction("swiper.swipeTo",t)}}class At extends Pt{async moveTo(t,e){return this.callFunction("movable-view.moveTo",t,e)}async property(t){return"x"===t?this._property("_translateX"):"y"===t?this._property("_translateY"):super.property(t)}}class Ct extends Pt{async tap(){return this.callFunction("switch.tap")}}class Tt extends Pt{async slideTo(t){return this.callFunction("slider.slideTo",t)}}class St extends Pt{async callContextMethod(t,...e){return await this.api.callContextMethod({method:t,args:e})}}class Dt extends ht{constructor(t,e){super(t),this.id=e.id}async getData(t){return this.invokeMethod("Page.getData",t)}async setData(t){return this.invokeMethod("Page.setData",t)}async callMethod(t){return this.invokeMethod("Page.callMethod",t)}async callMethodWithCallback(t){return this.invokeMethod("Page.callMethodWithCallback",t)}async getElement(t){return this.invokeMethod("Page.getElement",t)}async getElements(t){return this.invokeMethod("Page.getElements",t)}async getWindowProperties(t){return this.invokeMethod("Page.getWindowProperties",t)}invokeMethod(t,e={}){return e.pageId=this.id,this.invoke(t,e)}}at([pt],Dt.prototype,"getData",null),at([pt],Dt.prototype,"setData",null),at([pt],Dt.prototype,"callMethod",null),at([pt],Dt.prototype,"callMethodWithCallback",null),at([ut],Dt.prototype,"getElement",null),at([ut],Dt.prototype,"getElements",null),at([ut],Dt.prototype,"getWindowProperties",null);const Nt=require("util");class Ut{constructor(t,e){this.puppet=t,this.id=e.id,this.path=e.path,this.query=e.query,this.elementMap=new Map,this.api=new Dt(t,e)}toJSON(){return JSON.stringify({id:this.id,path:this.path,query:this.query})}toString(){return this.toJSON()}[Nt.inspect.custom](){return this.toJSON()}async waitFor(t){return V.default(t)?await G.default(t):B.default(t)?j.default(t,0,50):L.default(t)?j.default((async()=>{if("true"===process.env.UNI_APP_X){return!!await this.$(t)}return(await this.$$(t)).length>0}),0,50):void 0}async $(t){try{const e=await this.api.getElement({selector:t});return Pt.create(this.puppet,Object.assign({selector:t},e,{pageId:this.id}),this.elementMap)}catch(t){return null}}async $$(t){const{elements:e}=await this.api.getElements({selector:t});return e.map((e=>Pt.create(this.puppet,Object.assign({selector:t},e,{pageId:this.id}),this.elementMap)))}async data(t){const e={};if(t&&(e.path=t),"true"!==process.env.UNI_APP_X)return(await this.api.getData(e)).data;const n=(await this.api.getData(e)).data;return t?vt(n,t):n}async setData(t){return this.api.setData({data:t})}async size(){const[t,e]=await this.windowProperty(["document.documentElement.scrollWidth","document.documentElement.scrollHeight"]);return{width:t,height:e}}async callMethod(t,...e){return(await this.api.callMethod({method:t,args:e})).result}async callMethodWithCallback(t,...e){return await this.api.callMethodWithCallback({method:t,args:e})}async scrollTop(){return this.windowProperty("document.documentElement.scrollTop")}async windowProperty(t){const e=L.default(t);e&&(t=[t]);const{properties:n}=await this.api.getWindowProperties({names:t});return e?n[0]:n}static create(t,e,n){let s=n.get(e.id);return s?(s.query=e.query,s):(s=new Ut(t,e),n.set(e.id,s),s)}}class _t extends ht{async getPageStack(){return this.invoke("App.getPageStack")}async callUniMethod(t){return this.invoke("App.callUniMethod",t)}async getCurrentPage(){return this.invoke("App.getCurrentPage")}async mockUniMethod(t){return this.invoke("App.mockUniMethod",t)}async captureScreenshotByRuntime(t){return this.invoke("App.captureScreenshot",t)}async captureScreenshotWithADBByRuntime(t){return this.invoke("App.captureScreenshotWithADB",t)}async socketEmitter(t){return this.invoke("App.socketEmitter",t)}async callFunction(t){return this.invoke("App.callFunction",t)}async captureScreenshot(t){return this.invoke("App.captureScreenshot",t)}async exit(){return this.invoke("App.exit")}async addBinding(t){return this.invoke("App.addBinding",t)}async enableLog(){return this.invoke("App.enableLog")}onLogAdded(t){return this.on("App.logAdded",t)}onBindingCalled(t){return this.on("App.bindingCalled",t)}onExceptionThrown(t){return this.on("App.exceptionThrown",t)}}at([pt],_t.prototype,"getPageStack",null),at([pt],_t.prototype,"callUniMethod",null),at([pt],_t.prototype,"getCurrentPage",null),at([pt],_t.prototype,"mockUniMethod",null),at([pt],_t.prototype,"captureScreenshotByRuntime",null),at([pt],_t.prototype,"captureScreenshotWithADBByRuntime",null),at([pt],_t.prototype,"socketEmitter",null),at([ut],_t.prototype,"callFunction",null),at([ut],_t.prototype,"captureScreenshot",null),at([ut],_t.prototype,"exit",null),at([ut],_t.prototype,"addBinding",null),at([ut],_t.prototype,"enableLog",null);class Rt extends ht{async getInfo(){return this.invoke("Tool.getInfo")}async enableRemoteDebug(t){return this.invoke("Tool.enableRemoteDebug")}async close(){return this.invoke("Tool.close")}async getTestAccounts(){return this.invoke("Tool.getTestAccounts")}onRemoteDebugConnected(t){this.puppet.once("Tool.onRemoteDebugConnected",t),this.puppet.once("Tool.onPreviewConnected",t)}}function Ot(t){return new Promise((e=>setTimeout(e,t)))}at([ut],Rt.prototype,"getInfo",null),at([ut],Rt.prototype,"enableRemoteDebug",null),at([ut],Rt.prototype,"close",null),at([ut],Rt.prototype,"getTestAccounts",null);class jt extends a.EventEmitter{constructor(t,e){super(),this.puppet=t,this.options=e,this.pageMap=new Map,this.appBindings=new Map,this.appApi=new _t(t),this.toolApi=new Rt(t),this.appApi.onLogAdded((t=>{this.emit("console",t)})),this.appApi.onBindingCalled((({name:t,args:e})=>{try{const n=this.appBindings.get(t);n&&n(...e)}catch(t){}})),this.appApi.onExceptionThrown((t=>{this.emit("exception",t)}))}async pageStack(){return(await this.appApi.getPageStack()).pageStack.map((t=>Ut.create(this.puppet,t,this.pageMap)))}async navigateTo(t){return this.changeRoute("navigateTo",t)}async redirectTo(t){return this.changeRoute("redirectTo",t)}async navigateBack(){return this.changeRoute("navigateBack")}async reLaunch(t){return this.changeRoute("reLaunch",t)}async switchTab(t){return this.changeRoute("switchTab",t)}async currentPage(){const{id:t,path:e,query:n}=await this.appApi.getCurrentPage();return Ut.create(this.puppet,{id:t,path:e,query:n},this.pageMap)}async systemInfo(){return this.callUniMethod("getSystemInfoSync")}async callUniMethod(t,...e){return(await this.appApi.callUniMethod({method:t,args:e})).result}async mockUniMethod(t,e,...n){return B.default(e)||(s=e,L.default(s)&&(s=X.default(s),J.default(s,"function")||J.default(s,"() =>")))?this.appApi.mockUniMethod({method:t,functionDeclaration:e.toString(),args:n}):this.appApi.mockUniMethod({method:t,result:e});var s}async restoreUniMethod(t){return this.appApi.mockUniMethod({method:t})}async evaluate(t,...e){return(await this.appApi.callFunction({functionDeclaration:t.toString(),args:e})).result}async pageScrollTo(t){await this.callUniMethod("pageScrollTo",{scrollTop:t,duration:0})}async close(){try{await this.appApi.exit()}catch(t){}await Ot(1e3),this.puppet.disposeRuntimeServer(),await this.toolApi.close(),this.disconnect()}async teardown(){return this["disconnect"===this.options.teardown?"disconnect":"close"]()}async remote(t){if(!this.puppet.devtools.remote)return console.warn(`Failed to enable remote, ${this.puppet.devtools.name} is unimplemented`);const{qrCode:e}=await this.toolApi.enableRemoteDebug({auto:t});var n;e&&await(n=e,new Promise((t=>{H.default.generate(n,{small:!0},(e=>{process.stdout.write(e),t(void 0)}))})));const s=new Promise((t=>{this.toolApi.onRemoteDebugConnected((async()=>{await Ot(1e3),t(void 0)}))})),i=new Promise((t=>{this.puppet.setRemoteRuntimeConnectionCallback((()=>{t(void 0)}))}));return Promise.all([s,i])}disconnect(){this.puppet.dispose()}on(t,e){return"console"===t&&this.appApi.enableLog(),super.on(t,e),this}async exposeFunction(t,e){if(this.appBindings.has(t))throw Error(`Failed to expose function with name ${t}: already exists!`);this.appBindings.set(t,e),await this.appApi.addBinding({name:t})}async checkVersion(){}async screenshot(t){const e=this.puppet.isX&&"app-plus"===this.puppet.platform?(null==t?void 0:t.adb)?"captureScreenshotWithADBByRuntime":"captureScreenshotByRuntime":"captureScreenshot",{data:n}=await this.appApi[e]({fullPage:null==t?void 0:t.fullPage,area:null==t?void 0:t.area});if(!(null==t?void 0:t.path))return n;await W.default.writeFile(t.path,n,"base64")}async testAccounts(){return(await this.toolApi.getTestAccounts()).accounts}async changeRoute(t,e){return await this.callUniMethod(t,{url:e}),await Ot(3e3),this.currentPage()}async socketEmitter(t){return this.appApi.socketEmitter(t)}}class xt{constructor(t){this.options=t}has(t){return!!this.options[t]}send(t,e,n){const s=this.options[e];if(!s)return Promise.reject(Error(`adapter for ${e} not found`));const i=s.reflect;return i?(s.params&&(n=s.params(n)),"function"==typeof i?i(t.send.bind(t),n):(e=i,t.send(e,n))):Promise.reject(Error(`${e}'s reflect is required`))}}const $t=D.default("automator:puppet"),qt=".automator.json";function Lt(t){try{return require(t)}catch(t){}}function Ft(t,e,n,s){const i=function(t,e,n){let s,i;return process.env.UNI_OUTPUT_DIR?(i=S.default.join(process.env.UNI_OUTPUT_DIR,`../.automator/${e}`,qt),s=Lt(i)):(i=S.default.join(t,`dist/${n}/.automator/${e}`,qt),s=Lt(i),s||(i=S.default.join(t,`unpackage/dist/${n}/.automator/${e}`,qt),s=Lt(i))),$t(`${i}=>${JSON.stringify(s)}`),s}(t,n,s);if(!i||!i.wsEndpoint)return!1;const o=require("../package.json").version;if(i.version!==o)return $t(`unmet=>${i.version}!==${o}`),!1;const r=function(t){let e;try{const t=q.default.v4.sync();e=$.default.ip(t&&t.interface),e&&(/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(e)||(e=void 0))}catch(t){}return"ws://"+(e||"localhost")+":"+t}(e);return $t(`wsEndpoint=>${r}`),i.wsEndpoint===r}class Ht extends a.EventEmitter{constructor(t,e){if(super(),this.isX=!1,"true"===process.env.UNI_APP_X&&(this.isX=!0),e)this.target=e;else{if(this.target=null,"h5"===t)try{this.target=it("@dcloudio/uni-h5/lib/h5/uni.automator.js")}catch(t){}this.target||(this.target=it(`@dcloudio/uni-${"app"===t?"app-plus":t}/lib/uni.automator.js`))}if(!this.target)throw Error("puppet is not provided");this.platform=t,this.adapter=new xt(this.target.adapter||{})}setCompiler(t){this.compiler=t}setRuntimeServer(t){this.wss=t}setRemoteRuntimeConnectionCallback(t){this.remoteRuntimeConnectionCallback=t}setRuntimeConnection(t){this.runtimeConnection=t,this.remoteRuntimeConnectionCallback&&(this.remoteRuntimeConnectionCallback(),this.remoteRuntimeConnectionCallback=null)}setDevtoolConnection(t){this.devtoolConnection=t}disposeRuntimeServer(){this.wss&&this.wss.close()}disposeRuntime(){this.runtimeConnection.dispose()}disposeDevtool(){this.compiler&&this.compiler.stop(),this.devtoolConnection&&this.devtoolConnection.dispose()}dispose(){this.disposeRuntime(),this.disposeDevtool(),this.disposeRuntimeServer()}send(t,e){return this.runtimeConnection.send(t,e)}validateProject(t){const e=this.target.devtools.required;return!e||!e.find((e=>!T.default.existsSync(S.default.join(t,e))))}validateDevtools(t){const e=this.target.devtools.validate;return e?e(t,this):Promise.resolve(t)}createDevtools(t,e,n){const s=this.target.devtools.create;return s?(e.timeout=n,s(t,e,this)):Promise.resolve()}shouldCompile(t,e,n,s){this.compiled=!0;const i=this.target.shouldCompile;return i?this.compiled=i(n,s):!0===n.compile?this.compiled=!0:this.compiled=!Ft(t,e,this.platform,this.mode),this.compiled}get checkProperty(){return"mp-weixin"===this.platform}get devtools(){return this.target.devtools}get mode(){const t=this.target.mode;return t||("production"===process.env.NODE_ENV?"build":"dev")}}const Wt=D.default("automator:compiler"),Bt=/The\s+(.*)\s+directory is ready/;class Xt{constructor(t){this.puppet=t,this.puppet.setCompiler(this)}compile(t){const e=this.puppet.mode,n=this.puppet.platform;let s=t.silent;const i=t.port,o=t.host,r=`${e}:${n}`,a=t.projectPath,[c,l]=this.getSpawnArgs(t,r);l.push("--auto-port"),l.push(K.default(i)),o&&(l.push("--auto-host"),l.push(o));const p={cwd:t.cliPath,env:Object.assign(Object.assign({},process.env),{NODE_ENV:"build"===e?"production":"development"})};return new Promise(((t,i)=>{const o=o=>{const r=o.toString().trim();if(!s&&console.log(r),r.includes("- Network")||r.includes("> Network")||r.includes("➜  Network")){const e=r.match(/Network:(.*)/)[1].trim();Wt(`url: ${e}`),t({path:e})}else if(r.includes("DONE  Build failed"))i(r);else if(r.includes("DONE  Build complete")){const i=r.match(Bt);let o="";if(i&&i.length>1)o=S.default.join(a,i[1]);else{const t=this.puppet.isX&&"app-plus"===n?"app":n;o=S.default.join(a,`dist/${e}/${t}`),T.default.existsSync(o)||(o=S.default.join(a,`unpackage/dist/${e}/${t}`))}s=!0,this.stop(),t({path:o})}};Wt(`${c} ${l.join(" ")} %o`,p),this.cliProcess=b.spawn(c,l,p),this.cliProcess.on("error",(t=>{i(t)})),this.cliProcess.stdout.on("data",o),this.cliProcess.stderr.on("data",o)}))}stop(){this.cliProcess&&this.cliProcess.kill("SIGTERM")}getSpawnArgs(t,e){let n;const s=t.cliPath;try{n=require(S.default.join(s,"package.json"))}catch(t){}let i=this.puppet.isX;if(n&&(n.devDependencies&&n.devDependencies["@dcloudio/vite-plugin-uni"]&&(i=!0),!i&&n.dependencies&&n.dependencies["@dcloudio/vite-plugin-uni"]&&(i=!0),n.scripts&&n.scripts[e]))return[process.env.UNI_NPM_PATH||(/^win/.test(process.platform)?"npm.cmd":"npm"),["run",e,"--"]];["android","ios"].includes(process.env.UNI_OS_NAME)&&(process.env.UNI_APP_PLATFORM=process.env.UNI_OS_NAME);let o=this.puppet.platform;if("app-plus"===this.puppet.platform&&this.puppet.isX&&(o="app"),process.env.UNI_INPUT_DIR=t.projectPath,process.env.UNI_OUTPUT_DIR=S.default.join(t.projectPath,`unpackage/dist/${this.puppet.mode}/${o}`),process.env.UNI_HBUILDERX_PLUGINS||T.default.existsSync(S.default.resolve(s,"../about"))&&(process.env.UNI_HBUILDERX_PLUGINS=S.default.dirname(s)),i){const t="app-plus"===this.puppet.platform?"app":this.puppet.platform;return process.env.UNI_PLATFORM=t,[process.env.UNI_NODE_PATH||"node",[require.resolve("@dcloudio/vite-plugin-uni/bin/uni.js",{paths:[s]}),"-p",t]]}return[process.env.UNI_NODE_PATH||"node",[S.default.join(s,"bin/uniapp-cli.js")]]}}const Jt=D.default("automator:launcher");class Vt{async launch(t){const{port:e,cliPath:n,timeout:i,projectPath:o}=await this.validate(t);let r={};"app"===t.platform||"app-plus"===t.platform?(r=t.app||t["app-plus"],"true"===process.env.UNI_APP_X&&r["uni-app-x"]&&(r=s.recursive(!0,r,r["uni-app-x"])),delete r["uni-app-x"]):r=t[t.platform],r||(r={}),r.projectPath=o,Jt(r),this.puppet=new Ht(t.platform,r.puppet),r=await this.puppet.validateDevtools(r);let a=this.puppet.shouldCompile(o,e,t,r),c=process.env.UNI_OUTPUT_DIR||o;if(a||this.puppet.validateProject(c)||(c=S.default.join(o,"dist/"+this.puppet.mode+"/"+this.puppet.platform),this.puppet.validateProject(c)||(c=S.default.join(o,"unpackage/dist/"+this.puppet.mode+"/"+this.puppet.platform),this.puppet.validateProject(c)||(a=!0))),a){this.puppet.compiled=t.compile=!0,this.compiler=new Xt(this.puppet);const s=await this.compiler.compile({host:t.host,port:e,cliPath:n,projectPath:o,silent:!!t.silent});s.path&&(c=s.path)}const l=[];return l.push(this.createRuntimeConnection(e,i)),l.push(this.puppet.createDevtools(c,r,i)),new Promise(((t,n)=>{Promise.all(l).then((([n,s])=>{n&&this.puppet.setRuntimeConnection(n),s&&this.puppet.setDevtoolConnection(s),D.default("automator:program")("ready");const i=r.teardown||"disconnect";t(new jt(this.puppet,{teardown:i,port:e}))})).catch((t=>n(t)))}))}resolveCliPath(t){if(!t)return t;try{const{dependencies:e,devDependencies:n}=require(S.default.join(t,"package.json"));if(Gt(n)||Gt(e))return t}catch(t){}}resolveProjectPath(t,e){return t||(t=process.env.UNI_INPUT_DIR||process.cwd()),N.default(t)&&(t=S.default.resolve(t)),T.default.existsSync(t)||function(t){throw Error(t)}(`Project path ${t} doesn't exist`),t}async validate(t){const e=this.resolveProjectPath(t.projectPath,t);let n=process.env.UNI_CLI_PATH||t.cliPath;if(n=this.resolveCliPath(n||""),!n&&(n=this.resolveCliPath(process.cwd())),!n&&(n=this.resolveCliPath(e)),!n)throw Error("cliPath is not provided");if("false"!==process.env.UNI_APP_X){const t=this.getManifestJson(e);"uni-app-x"in t&&(process.env.UNI_APP_X="true",t.appid&&(process.env.UNI_APP_ID=t.appid))}process.env.UNI_AUTOMATOR_PORT&&(t.port=parseInt(process.env.UNI_AUTOMATOR_PORT));return{port:await async function(t,e){const n=await F.default(t||e);if(t&&n!==t)throw Error(`Port ${t} is in use, please specify another port`);return n}(t.port||9520),cliPath:n,timeout:t.timeout||6e5,projectPath:e}}getManifestJson(t){if(t){const e=S.default.join(t,"manifest.json");if(T.default.existsSync(e))return i.parse(T.default.readFileSync(e,"utf8"))}return{}}async createRuntimeConnection(t,e){return rt.createRuntimeConnection(t,this.puppet,e)}}function Gt(t){return!!t&&!(!t["@dcloudio/vue-cli-plugin-uni"]&&!t["@dcloudio/vite-plugin-uni"])}exports.default=class{constructor(){this.launcher=new Vt}async launch(t){return this.launcher.launch(t)}},exports.initUni=t=>new Proxy({},{get(e,n){return"connectSocket"===n?async(...e)=>{const s=`${Date.now()}-${Math.random()}`;return e[0].id=s,await t.callUniMethod(n,...e).then((n=>{et(e[0],n),tt.set(s,new Map);const i={id:s,onMessage:e=>{t.socketEmitter({id:s,method:"onMessage"}),tt.get(s).set("onMessage",e)},send:e=>{t.socketEmitter({id:s,method:"send",data:e.data}).then((t=>{et(e,t)})).catch((t=>{nt(e,t)}))},close:e=>{t.socketEmitter({id:s,method:"close",code:e.code,reason:e.reason}).then((t=>{et(e,t),tt.delete(s)})).catch((t=>{nt(e,t)}))},onOpen:e=>{t.socketEmitter({id:s,method:"onOpen"}),tt.get(s).set("onOpen",e)},onClose:e=>{t.socketEmitter({id:s,method:"onClose"}),tt.get(s).set("onClose",e)},onError:e=>{t.socketEmitter({id:s,method:"onError"}),tt.get(s).set("onError",e)}};return tt.get(s).set("socketTask",i),i})).catch((t=>(nt(e[0],t),null)))}:(s=n,Z.includes(s)?e=>{Q.has(n)||Q.set(n,new Map);const s=Q.get(n),i=`${Date.now()}-${Math.random()}`;s.set(i,e),t.callUniMethod(n,i)}:function(t){return t.startsWith("off")&&Z.includes(t.replace("off","on"))}(n)?async e=>{const s=n.replace("off","on");if(Q.has(s))if(e){const i=Q.get(s);i.forEach(((s,o)=>{s===e&&(i.delete(o),t.callUniMethod(n,o))}))}else Q.delete(s),t.callUniMethod(n)}:async(...e)=>await t.callUniMethod(n,...e).then((t=>(et(e[0],t),t))).catch((t=>(nt(e[0],t),t))));var s}});
