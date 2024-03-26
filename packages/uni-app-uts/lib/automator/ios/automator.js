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
***************************************************************************** */
var e=function(){return e=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},e.apply(this,arguments)};function t(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var r=Array(e),o=0;for(t=0;t<n;t++)for(var i=arguments[t],u=0,a=i.length;u<a;u++,o++)r[o]=i[u];return r}var n,r=Object.prototype.hasOwnProperty,o=function(e){return null==e},i=Array.isArray,u=function(e){var t=Object.create(null);return function(n){return t[n]||(t[n]=e(n))}},a=/\B([A-Z])/g,c=u((function(e){return e.replace(a,"-$1").toLowerCase()})),s=/-(\w)/g,l=u((function(e){return e.replace(s,(function(e,t){return t?t.toUpperCase():""}))})),f=u((function(e){return e.charAt(0).toUpperCase()+e.slice(1)})),d=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;function p(e,t){if(i(e))return e;if(t&&(n=t,o=e,r.call(n,o)))return[e];var n,o,u=[];return e.replace(d,(function(e,t,n,r){return u.push(n?r.replace(/\\(\\)?/g,"$1"):t||e),r})),u}function g(e,t){var n,r=p(t,e);for(n=r.shift();!o(n);){if(null==(e=e[n]))return;n=r.shift()}return e}function v(e){return e.__wxWebviewId__?e.__wxWebviewId__:e.privateProperties?e.privateProperties.slaveId:e.$page?e.$page.id:void 0}function h(e){return e.route||e.uri}function m(e){return e.options||e.$page&&e.$page.options||{}}function _(e){return{id:v(e),path:h(e),query:m(e)}}function E(e){var t=function(e){return getCurrentPages().find((function(t){return v(t)===e}))}(e);return t&&t.$vm}function w(e,t){return function(e){if(e._$weex)return e._uid;if(e._$id)return e._$id;if(e.uid)return e.uid;var t=function(e){for(var t=e.$parent;t;){if(t._$id)return t;t=t.$parent}}(e);if(!e.$parent)return"-1";var n=e.$vnode,r=n.context;return r&&r!==t&&r._$id?r._$id+";"+t._$id+","+n.data.attrs._i:t._$id+","+n.data.attrs._i}(e)===t}function y(e,t,n){var r,o,i,u,a;if(void 0===n&&(n=!1),n)if(e.component&&w(e.component,t))a=e.component;else{var c=[];e.children instanceof Array?c=e.children:(null===(o=null===(r=e.component)||void 0===r?void 0:r.subTree)||void 0===o?void 0:o.children)&&(null===(u=null===(i=e.component)||void 0===i?void 0:i.subTree)||void 0===u?void 0:u.children)instanceof Array&&(c=e.component.subTree.children),c.find((function(e){return a=y(e,t,!0)}))}else e&&(w(e,t)?a=e:e.$children.find((function(e){return a=y(e,t)})));return a}function T(e,t){var n=E(e);if(n)return x(n)?y(n.$.subTree,t,!0):y(n,t)}function S(e,t){var n,r=e.$data||e.data;return e&&(n=t?g(r,t):Object.assign({},r)),Promise.resolve({data:n})}function P(e,t){if(e){var n=x(e);Object.keys(t).forEach((function(r){n?(e.$data||e.data)[r]=t[r]:e[r]=t[r]}))}return Promise.resolve()}function b(e,t,r){return x(e)&&(e=e.$vm||e.ctx),new Promise((function(o,i){var u,a;if(!e)return i(n.VM_NOT_EXISTS);if(!e[t]&&!(null===(a=e.$.exposed)||void 0===a?void 0:a[t]))return i(n.METHOD_NOT_EXISTS);var c,s=e[t]?e[t].apply(e,r):(u=e.$.exposed)[t].apply(u,r);!(c=s)||"object"!=typeof c&&"function"!=typeof c||"function"!=typeof c.then?o({result:s}):s.then((function(e){o({result:e})}))}))}function x(e){return!e.$children}!function(e){e.VM_NOT_EXISTS="VM_NOT_EXISTS",e.METHOD_NOT_EXISTS="METHOD_NOT_EXISTS"}(n||(n={}));var $=1,O={};var M=new Map,I=function(t){return new Promise((function(n,r){var o=M.values().next().value;if(o){var i=t.method;if("onOpen"===i)return C(o,n);if(i.startsWith("on"))return o.instance[i]((function(e){n(e)}));"sendMessage"===i&&(i="send"),o.instance[i](e(e({},t),{success:function(e){n({result:e}),"close"===i&&M.delete(M.keys().next().value)},fail:function(e){r(e)}}))}else r({errMsg:"socketTask not exists."})}))};function C(e,t){if(e.isOpend)t({data:e.openData});else{var n=setInterval((function(){e.isOpend&&(clearInterval(n),t(e.openData))}),200);setTimeout((function(){clearInterval(n)}),2e3)}}var A=["stopRecord","getRecorderManager","pauseVoice","stopVoice","pauseBackgroundAudio","stopBackgroundAudio","getBackgroundAudioManager","createAudioContext","createInnerAudioContext","createVideoContext","createCameraContext","createMapContext","canIUse","startAccelerometer","stopAccelerometer","startCompass","stopCompass","hideToast","hideLoading","showNavigationBarLoading","hideNavigationBarLoading","navigateBack","createAnimation","pageScrollTo","createSelectorQuery","createCanvasContext","createContext","drawCanvas","hideKeyboard","stopPullDownRefresh","arrayBufferToBase64","base64ToArrayBuffer"],k=new Map,q=["onCompassChange","onThemeChange","onUserCaptureScreen","onWindowResize","onMemoryWarning","onAccelerometerChange","onKeyboardHeightChange","onNetworkStatusChange","onPushMessage","onLocationChange","onGetWifiList","onWifiConnected","onWifiConnectedWithPartialInfo","onSocketOpen","onSocketError","onSocketMessage","onSocketClose"],N={},D=/^\$|Sync$|Window$|WindowStyle$|sendHostEvent|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getLocale|setLocale|invokePushCallback|getWindowInfo|getDeviceInfo|getAppBaseInfo|getSystemSetting|getAppAuthorizeSetting|initUTS|requireUTS|registerUTS/,W=/^on|^off/;function U(e){return D.test(e)||-1!==A.indexOf(e)}var H={getPageStack:function(){return Promise.resolve({pageStack:getCurrentPages().map((function(e){return _(e)}))})},getCurrentPage:function(){var e=getCurrentPages(),t=e.length;return new Promise((function(n,r){t?n(_(e[t-1])):r(Error("getCurrentPages().length=0"))}))},callUniMethod:function(t,n){var r=t.method,o=t.args;return new Promise((function(t,i){if("connectSocket"!==r){var u,a;if(q.includes(r)){k.has(r)||k.set(r,new Map);var c=o[0],s=function(e){n({id:c,result:{method:r,data:e}})};return r.startsWith("onSocket")?I({method:r.replace("Socket","")}).then((function(e){return s(e)})).catch((function(e){return s(e)})):(k.get(r).set(c,s),uni[r](s)),t({result:null})}if(r.startsWith("off")&&q.includes(r.replace("off","on"))){var l=r.replace("off","on");if(k.has(l)){var f=o[0];if(void 0!==f){var d=k.get(l).get(f);uni[r](d),k.get(l).delete(f)}else{k.get(l).forEach((function(e){uni[r](e)})),k.delete(l)}}return t({result:null})}if(r.indexOf("Socket")>0)return I(e({method:r.replace("Socket","")},o[0])).then((function(e){return t(e)})).catch((function(e){return i(e)}));if(!uni[r])return i(Error("uni."+r+" not exists"));if(U(r))return t({result:uni[r].apply(uni,o)});var p=[Object.assign({},o[0]||{},{success:function(e){setTimeout((function(){t({result:e})}),"pageScrollTo"===r?350:0)},fail:function(e){i(Error(e.errMsg.replace(r+":fail ","")))}})];uni[r].apply(uni,p)}else(u=o[0].id,a=o[0].url,new Promise((function(e,t){var n=uni.connectSocket({url:a,success:function(){e({result:{errMsg:"connectSocket:ok"}})},fail:function(){t({result:{errMsg:"connectSocket:fail"}})}});M.set(u,{instance:n,isOpend:!1}),n.onOpen((function(e){M.get(u).isOpend=!0,M.get(u).openData=e}))}))).then((function(e){return t(e)})).catch((function(e){return i(e)}))}))},mockUniMethod:function(e){var t=e.method;if(!uni[t])throw Error("uni."+t+" not exists");if(!function(e){return!W.test(e)}(t))throw Error("You can't mock uni."+t);var n,r=e.result,i=e.functionDeclaration;return o(r)&&o(i)?(N[t]&&(uni[t]=N[t],delete N[t]),Promise.resolve()):(n=o(i)?U(t)?function(){return r}:function(e){setTimeout((function(){r.errMsg&&-1!==r.errMsg.indexOf(":fail")?e.fail&&e.fail(r):e.success&&e.success(r),e.complete&&e.complete(r)}),4)}:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return new Function("return "+i)().apply(n,t.concat(e.args))},n.origin=N[t]||uni[t],N[t]||(N[t]=uni[t]),uni[t]=n,Promise.resolve())},captureScreenshot:function(e){return new Promise((function(t,n){var r=getCurrentPages(),o=r.length;if(o){var i=r[o-1];if(i)if("undefined"!=typeof UniElement)i.$nativePage.viewToTempFilePath({id:e.id,offsetX:null!==e.offsetX?e.offsetX:"0",offsetY:null!==e.offsetY?e.offsetY:"0",wholeContent:1==e.fullPage,path:e.path||"screenshot",overwrite:!0,success:function(e){nativeFileManager.readFile({encoding:"base64",filePath:e.tempFilePath,success:function(e){t({data:e.data})},fail:function(e){n(Error("captureScreenshot fail: "+(e.message||e.errMsg)))}})},fail:function(e){n(Error("captureScreenshot fail: "+(e.message||e.errMsg)))}});else{var u=i.$getAppWebview(),a=new plus.nativeObj.Bitmap("captureScreenshot","captureScreenshot.png");u.draw(a,(function(e){var n=a.toBase64Data().replace("data:image/png;base64,","").replace("data:image/(null);base64,","");a.clear(),t({data:n})}),(function(e){n(Error("captureScreenshot fail: "+e.message))}),{wholeContent:!!e.fullPage})}}else n(Error("getCurrentPage fail."))}))},socketEmitter:function(t){return new Promise((function(n,r){(function(t){return new Promise((function(n,r){if(M.has(t.id)){var o=M.get(t.id),i=o.instance,u=t.method,a=t.id;if("onOpen"==u)return C(o,n);if(u.startsWith("on"))return i[u]((function(e){n({method:"Socket."+u,id:a,data:e})}));i[u](e(e({},t),{success:function(e){n(e),"close"===u&&M.delete(t.id)},fail:function(e){r(e)}}))}else r({errMsg:"socketTask not exists."})}))})(t).then((function(e){return n(e)})).catch((function(e){return r(e)}))}))}},L=H,B={getData:function(e){return S(E(e.pageId),e.path)},setData:function(e){return P(E(e.pageId),e.data)},callMethod:function(e){var t,r=((t={})[n.VM_NOT_EXISTS]="Page["+e.pageId+"] not exists",t[n.METHOD_NOT_EXISTS]="page."+e.method+" not exists",t);return new Promise((function(t,n){b(E(e.pageId),e.method,e.args).then((function(e){return t(e)})).catch((function(e){n(Error(r[e]))}))}))},callMethodWithCallback:function(e){var t,r=((t={})[n.VM_NOT_EXISTS]="callMethodWithCallback:fail, Page["+e.pageId+"] not exists",t[n.METHOD_NOT_EXISTS]="callMethodWithCallback:fail, page."+e.method+" not exists",t),o=e.args[e.args.length-1];b(E(e.pageId),e.method,e.args).catch((function(e){o({errMsg:r[e]})}))}};function j(e){return e.nodeId||e.elementId}var V={getData:function(e){return S(T(e.pageId,j(e)),e.path)},setData:function(e){return P(T(e.pageId,j(e)),e.data)},callMethod:function(e){var t,r=j(e),o=((t={})[n.VM_NOT_EXISTS]="Component["+e.pageId+":"+r+"] not exists",t[n.METHOD_NOT_EXISTS]="component."+e.method+" not exists",t);return new Promise((function(t,n){b(T(e.pageId,r),e.method,e.args).then((function(e){return t(e)})).catch((function(e){n(Error(o[e]))}))}))}};function R(e){var t=getCurrentPages().find((function(t){return t.$page.id===e}));if(!t)throw Error("page["+e+"] not found");var n=t.$vm._$weex;return n.document.__$weex__||(n.document.__$weex__=n),n.document}var X={},J={};["text","image","input","textarea","video","web-view","slider"].forEach((function(e){X[e]=!0,J["u-"+e]=!0}));var F=["movable-view","picker","ad","button","checkbox-group","checkbox","form","icon","label","movable-area","navigator","picker-view-column","picker-view","progress","radio-group","radio","rich-text","u-slider","swiper-item","swiper","switch"],z=F.map((function(e){return f(l(e))}));function Y(e){var t=e.type;if(J[t])return t.replace("u-","");var n=e.__vue__&&e.__vue__.$options.name;return"USlider"===n?"slider":n&&-1!==z.indexOf(n)?c(n):t}function G(e){var t={elementId:e.nodeId,tagName:Y(e),nvue:!0},n=e.__vue__;return n&&!n.$options.isReserved&&(t.nodeId=n._uid),"video"===t.tagName&&(t.videoId=t.nodeId),t}function K(e,t,n){for(var r=e.children,o=0;o<r.length;o++){var i=r[o];if(t(i)){if(!n)return i;n.push(i)}if(n)K(i,t,n);else{var u=K(i,t,n);if(u)return u}}return n}function Q(e,t,n){var r,o;if(0===t.indexOf("#")?(r=t.substr(1),o=function(e){return e.attr&&e.attr.id===r}):0===t.indexOf(".")&&(r=t.substr(1),o=function(e){return e.classList&&-1!==e.classList.indexOf(r)}),o){var i=K(e,o,n);if(!i)throw Error("Node("+t+") not exists");return i}if("body"===t)return Object.assign({},e,{type:"page"});0===t.indexOf("uni-")&&(t=t.replace("uni-",""));var u=X[t]?"u-"+t:t,a=-1!==F.indexOf(u)?f(l(u)):"",c=K(e,(function(e){return e.type===u||a&&e.__vue__&&e.__vue__.$options.name===a}),n);if(!c)throw Error("Node("+t+") not exists");return c}var Z=[{test:function(e){return 2===e.length&&-1!==e.indexOf("document.documentElement.scrollWidth")&&-1!==e.indexOf("document.documentElement.scrollHeight")},call:function(e){var t=e.__$weex__||e.ownerDocument.__$weex__;return new Promise((function(n){"scroll-view"===e.type&&1===e.children.length&&(e=e.children[0]),t.requireModule("dom").getComponentRect(e.ref,(function(e){e.result?n([e.size.width,e.size.height]):n([0,0])}))}))}},{test:function(e){return 1===e.length&&"document.documentElement.scrollTop"===e[0]},call:function(e){var t=e.__$weex__||e.ownerDocument.__$weex__;return new Promise((function(n){"scroll-view"===e.type&&1===e.children.length&&(e=e.children[0]),t.requireModule("dom").getComponentRect(e.ref,(function(e){n([e.size&&Math.abs(e.size.top)||0])}))}))}},{test:function(e){return 2===e.length&&-1!==e.indexOf("offsetWidth")&&-1!==e.indexOf("offsetHeight")},call:function(e){var t=e.__$weex__||e.ownerDocument.__$weex__;return new Promise((function(n){t.requireModule("dom").getComponentRect(e.ref,(function(e){e.result?n([e.size.width,e.size.height]):n([0,0])}))}))}},{test:function(e,t){return 1===e.length&&"innerText"===e[0]},call:function(e){return Promise.resolve([ee(e,[]).join("")])}}];function ee(e,t){return"u-text"===e.type?t.push(e.attr.value):e.pureChildren.map((function(e){return ee(e,t)})),t}function te(e){return e.replace(/\n/g,"").replace(/<u-/g,"<").replace(/<\/u-/g,"</")}function ne(e,t){return"outer"===t?"body"===e.role&&"scroll-view"===e.type?"<page>"+te(ne(e,"inner"))+"</page>":te(e.toString()):te(e.pureChildren.map((function(e){return e.toString()})).join(""))}var re={input:{input:function(e,t){e.setValue(t)}},textarea:{input:function(e,t){e.setValue(t)}},"scroll-view":{scrollTo:function(e,t,n){e.scrollTo(n)},scrollTop:function(e){return 0},scrollLeft:function(e){return 0},scrollWidth:function(e){return 0},scrollHeight:function(e){return 0}},swiper:{swipeTo:function(e,t){e.__vue__.current=t}},"movable-view":{moveTo:function(e,t,n){var r=e.__vue__;r.x=t,r.y=n}},switch:{tap:function(e){var t=e.__vue__;t.checked=!t.checked}},slider:{slideTo:function(e,t){e.__vue__.value=t}}};function oe(e){return R(e).body}var ie={getWindow:function(e){return oe(e)},getDocument:function(e){return oe(e)},getEl:function(e,t){var n=R(t).getRef(e);if(!n)throw Error("element destroyed");return n},getOffset:function(e){var t=e.__$weex__||e.ownerDocument.__$weex__;return new Promise((function(n){t.requireModule("dom").getComponentRect(e.ref,(function(e){e.result?n({left:e.size.left,top:e.size.top}):n({left:0,top:0})}))}))},querySelector:function(e,t){return Promise.resolve(G(Q(e,t)))},querySelectorAll:function(e,t){return Promise.resolve({elements:Q(e,t,[]).map((function(e){return G(e)}))})},queryProperties:function(e,t){var n=Z.find((function(n){return n.test(t,e)}));return n?n.call(e).then((function(e){return{properties:e}})):Promise.resolve({properties:t.map((function(t){return g(e,t)}))})},queryAttributes:function(e,t){var n=e.attr;return Promise.resolve({attributes:t.map((function(t){return"class"===t?(e.classList||[]).join(" "):String(n[t]||n[l(t)]||"")}))})},queryStyles:function(e,t){var n=e.style;return Promise.resolve({styles:t.map((function(e){return n[e]}))})},queryHTML:function(e,t){return Promise.resolve({html:ne(e,t)})},dispatchTapEvent:function(e){return e.fireEvent("click",{timeStamp:Date.now(),target:e,currentTarget:e},!0),Promise.resolve()},dispatchLongpressEvent:function(e){return e.fireEvent("longpress",{timeStamp:Date.now(),target:e,currentTarget:e},!0),Promise.resolve()},dispatchTouchEvent:function(e,t,n){return n||(n={}),n.touches||(n.touches=[]),n.changedTouches||(n.changedTouches=[]),n.touches.length||n.touches.push({identifier:Date.now(),target:e}),e.fireEvent(t,Object.assign({timeStamp:Date.now(),target:e,currentTarget:e},n),!0),Promise.resolve()},callFunction:function(e,n,r){var o=g(re,n);return o?Promise.resolve({result:o.apply(null,t([e],r))}):Promise.reject(Error(n+" not exists"))},triggerEvent:function(e,t,n){var r=e.__vue__;return r?r.$trigger&&r.$trigger(t,{},n):e.fireEvent(t,{timeStamp:Date.now(),target:e,currentTarget:e},!1,{params:[{detail:n}]}),Promise.resolve()}};function ue(){return Object.assign({},function(e){return{"Page.getElement":function(t){return e.querySelector(e.getDocument(t.pageId),t.selector)},"Page.getElements":function(t){return e.querySelectorAll(e.getDocument(t.pageId),t.selector)},"Page.getWindowProperties":function(t){return e.queryProperties(e.getWindow(t.pageId),t.names)}}}(ie),function(e){var t=function(t){return e.getEl(t.elementId,t.pageId)};return{"Element.getElement":function(n){return e.querySelector(t(n),n.selector)},"Element.getElements":function(n){return e.querySelectorAll(t(n),n.selector)},"Element.getDOMProperties":function(n){return e.queryProperties(t(n),n.names)},"Element.getProperties":function(n){var r=t(n),o=r.__vue__||r.attr||{};return r.__vueParentComponent&&(o=Object.assign({},o,r.__vueParentComponent.attrs,r.__vueParentComponent.props)),e.queryProperties(o,n.names)},"Element.getOffset":function(n){return e.getOffset(t(n))},"Element.getAttributes":function(n){return e.queryAttributes(t(n),n.names)},"Element.getStyles":function(n){return e.queryStyles(t(n),n.names)},"Element.getHTML":function(n){return e.queryHTML(t(n),n.type)},"Element.tap":function(n){return e.dispatchTapEvent(t(n))},"Element.longpress":function(n){return e.dispatchLongpressEvent(t(n))},"Element.touchstart":function(n){return e.dispatchTouchEvent(t(n),"touchstart",n)},"Element.touchmove":function(n){return e.dispatchTouchEvent(t(n),"touchmove",n)},"Element.touchend":function(n){return e.dispatchTouchEvent(t(n),"touchend",n)},"Element.callFunction":function(n){return e.callFunction(t(n),n.functionName,n.args)},"Element.triggerEvent":function(n){return e.triggerEvent(t(n),n.type,n.detail)}}}(ie))}var ae=function(){};ae.prototype={on:function(e,t,n){var r=this.e||(this.e={});return(r[e]||(r[e]=[])).push({fn:t,ctx:n}),this},once:function(e,t,n){var r=this;function o(){r.off(e,o),t.apply(n,arguments)}return o._=t,this.on(e,o,n)},emit:function(e){for(var t=[].slice.call(arguments,1),n=((this.e||(this.e={}))[e]||[]).slice(),r=0,o=n.length;r<o;r++)n[r].fn.apply(n[r].ctx,t);return this},off:function(e,t){var n=this.e||(this.e={}),r=n[e],o=[];if(r&&t){for(var i=r.length-1;i>=0;i--)if(r[i].fn===t||r[i].fn._===t){r.splice(i,1);break}o=r}return o.length?n[e]=o:delete n[e],this}};var ce=ae;function se(e){var t=new ce;return{subscribe:function(n,r,o){void 0===o&&(o=!1),t[o?"once":"on"](e+"."+n,r)},subscribeHandler:function(n,r,o){t.emit(e+"."+n,r,o)}}}var le=Object.assign,fe=le(se("service"),{publishHandler:function(e,t,n){UniViewJSBridge.subscribeHandler(e,t,n)}}),de=le(se("view"),{publishHandler:function(e,t,n){UniServiceJSBridge.subscribeHandler(e,t,n)}});if("undefined"==typeof UniServiceJSBridge&&"undefined"==typeof UniViewJSBridge){var pe="undefined"==typeof globalThis?Function("return this")():globalThis;pe.UniServiceJSBridge=fe,pe.UniViewJSBridge=de}var ge={};Object.keys(L).forEach((function(e){ge["App."+e]=L[e]})),Object.keys(B).forEach((function(e){ge["Page."+e]=B[e]})),Object.keys(V).forEach((function(e){ge["Element."+e]=V[e]}));var ve,he,me,_e=process.env.UNI_AUTOMATOR_WS_ENDPOINT;function Ee(e){me.send({data:JSON.stringify(e)})}function we(e){var t=JSON.parse(e.data),n=t.id,r=t.method,o=t.params,i={id:n},u=ge[r];if(!u){if(he){var a=he(n,r,o,i);if(!0===a)return;u=a}if(!u)return i.error={message:r+" unimplemented"},Ee(i)}try{u(o,Ee).then((function(e){e&&(i.result=e)})).catch((function(e){i.error={message:e.message}})).finally((function(){Ee(i)}))}catch(e){i.error={message:e.message},Ee(i)}}he=function(e,t,n,r){var o=n.pageId,i=function(e){var t=getCurrentPages();if(!e)return t[t.length-1];return t.find((function(t){return t.$page.id===e}))}(o);return i?!i.$page.meta.isNVue?(UniServiceJSBridge.publishHandler("sendAutoMessage",{id:e,method:t,params:n},o),!0):(ve||(ve=ue()),ve[t]):(r.error={message:"page["+o+"] not exists"},Ee(r),!0)},UniServiceJSBridge.subscribe("onAutoMessageReceive",(function(e){Ee(e)})),setTimeout((function(){if("undefined"!=typeof window&&window.__uniapp_x_)!function(e,t){var n=0;t&&(n=$++,O[n]=t);var r={data:{id:n,type:"automator",data:e}};console.log("postMessageToUniXWebView",r),"undefined"!=typeof window&&window.__uniapp_x_.postMessage(JSON.stringify(r))}({action:"ready"});else{if(_e&&_e.endsWith(":0000"))return;void 0===e&&(e={}),(me=uni.connectSocket({url:e.wsEndpoint||_e,complete:function(){}})).onMessage(we),me.onOpen((function(t){e.success&&e.success(),console.log("已开启自动化测试...")})),me.onError((function(e){console.log("automator.onError",e)})),me.onClose((function(){e.fail&&e.fail({errMsg:"$$initRuntimeAutomator:fail"}),console.log("automator.onClose")}))}var e}),500);var ye=Object.prototype.hasOwnProperty,Te=Array.isArray,Se=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;function Pe(e,t){if(Te(e))return e;if(t&&(n=t,r=e,ye.call(n,r)))return[e];var n,r,o=[];return e.replace(Se,(function(e,t,n,r){return o.push(n?r.replace(/\\(\\)?/g,"$1"):t||e),r})),o}function be(e){if(e._$weex)return e._uid;if(e._$id)return e._$id;if(e.uid)return e.uid;var t=function(e){for(var t=e.$parent;t;){if(t._$id)return t;t=t.$parent}}(e);if(!e.$parent)return"-1";var n=e.$vnode,r=n.context;return r&&r!==t&&r._$id?r._$id+";"+t._$id+","+n.data.attrs._i:t._$id+","+n.data.attrs._i}function xe(e){return"TEXT"===e.tagName||"TEXTAREA"===e.tagName}function $e(e){var t="";return e.childNodes.forEach((function(e){xe(e)?t+=e.getAttribute("value"):t+=$e(e)})),t}function Oe(e){return e.startsWith("uni-")?e.replace("uni-",""):e}var Me=new Map;function Ie(e){var t,n,r,o,i,u,a,c={elementId:(i=e,u=i._id,u||(u=Date.now()+"-"+Math.random(),i._id=u,Me.set(u,{id:u,element:i})),u),tagName:e.tagName.toLocaleLowerCase().replace("uni-","")};e.__vue__?(a=e.__vue__)&&(a.$parent&&a.$parent.$el===e&&(a=a.$parent),a&&!(null===(t=a.$options)||void 0===t?void 0:t.isReserved)&&(c.nodeId=be(a))):(a=e.__vueParentComponent)&&((null===(n=a.ctx)||void 0===n?void 0:n.$el)!==e||(null===(o=null===(r=a.proxy)||void 0===r?void 0:r.$options)||void 0===o?void 0:o.rootElement)||(c.nodeId=be(a)));return"video"===c.tagName&&(c.videoId=c.nodeId),c}var Ce={input:{input:function(e,t){var n=new UniInputEvent("input",{detail:{value:t}});n.detail.value=t,e.dispatchEvent("input",n)}},textarea:{input:function(e,t){var n=new UniInputEvent("input",{detail:{value:t}});n.detail.value=t,e.dispatchEvent("input",n)}},"scroll-view":{scrollTo:function(e,t,n){e.scrollLeft=t,e.scrollTop=n},scrollTop:function(e){return e.scrollTop},scrollLeft:function(e){return e.scrollLeft},scrollWidth:function(e){return e.scrollWidth},scrollHeight:function(e){return e.scrollHeight}},swiper:{swipeTo:function(e,t){e.setAttribute("current",t)}},"movable-view":{moveTo:function(e,t,n){e.__vue__._animationTo(t,n)}},switch:{tap:function(e){e.click()}},slider:{slideTo:function(e,t){e.setAttribute("value",t)}}};function Ae(e){var t=getCurrentPages().find((function(t){return t.$page.id===e}));if(!t)throw Error("page["+e+"] not found");return t.$el.parentNode}function ke(e){return e.map((function(e){return function(e){return new UniTouch(e)}(e)}))}var qe,Ne={getWindow:function(e){var t=Ae(e);return 1===t.childNodes.length?t.childNodes[0]:t},getDocument:function(e){return Ae(e)},getEl:function(e){var t=Me.get(e);if(!t)throw Error("element destroyed");return t.element},getOffset:function(e){var t=e.getBoundingClientRect();return Promise.resolve({left:t.left,top:t.top})},querySelector:function(e,t){return"page"===(t=Oe(t))&&(t="body"),Promise.resolve(Ie(e.querySelector(t)))},querySelectorAll:function(e,t){t=Oe(t);var n=[],r=e.querySelectorAll(t);return[].forEach.call(r,(function(e){try{n.push(Ie(e))}catch(e){}})),Promise.resolve({elements:n})},queryProperties:function(e,t){return Promise.resolve({properties:t.map((function(t){return"innerText"==t?xe(e)?e.getAttribute("value"):$e(e):"value"==t?e.getAnyAttribute("value"):"offsetWidth"==t?e.offsetWidth:"offsetHeight"==t?e.offsetHeight:"document.documentElement.scrollWidth"===t?e.scrollWidth:"document.documentElement.scrollHeight"===t?e.scrollHeight:"document.documentElement.scrollTop"===t?e.scrollTop:e.getAttribute(t)||e[t](qe||(n=["Element.getDOMProperties not support ",""],r=["Element.getDOMProperties not support ",""],Object.defineProperty?Object.defineProperty(n,"raw",{value:r}):n.raw=r,qe=n),t);var n,r}))})},queryAttributes:function(e,t){return Promise.resolve({attributes:t.map((function(t){return String(e.getAnyAttribute(t))}))})},queryStyles:function(e,t){var n=e._style;return Promise.resolve({styles:t.map((function(e){return n[e]}))})},queryHTML:function(e,t){return Promise.resolve({html:(n="outer"===t?e.outerHTML:e.innerHTML,n.replace(/\n/g,"").replace(/(<uni-text[^>]*>)(<span[^>]*>[^<]*<\/span>)(.*?<\/uni-text>)/g,"$1$3").replace(/<\/?[^>]*>/g,(function(e){return-1<e.indexOf("<body")?"<page>":"</body>"===e?"</page>":0!==e.indexOf("<uni-")&&0!==e.indexOf("</uni-")?"":e.replace(/uni-/g,"").replace(/ role=""/g,"").replace(/ aria-label=""/g,"")})))});var n},dispatchTapEvent:function(e){return e.dispatchEvent("click",new UniPointerEvent("click")),Promise.resolve()},dispatchLongpressEvent:function(e){return this.dispatchTouchEvent(e,"longpress"),Promise.resolve()},dispatchTouchEvent:function(e,t,n){n||(n={}),n.touches||(n.touches=[]),n.changedTouches||(n.changedTouches=[]),n.touches.length||n.touches.push({identifier:Date.now(),target:e});var r=ke(n.touches),o=ke(n.changedTouches);return e.dispatchEvent(t,new UniTouchEvent(t,{cancelable:!0,bubbles:!0,touches:r,changedTouches:o})),Promise.resolve()},callFunction:function(e,n,r){var o=function(e,t){var n,r=Pe(t,e);for(n=r.shift();null!=n;){if(null==(e=e[n]))return;n=r.shift()}return e}(Ce,n);return o?Promise.resolve({result:o.apply(null,t([e],r))}):Promise.reject(Error(n+" not exists"))},triggerEvent:function(e,t,n){return function(e,t,n){var r={input:{input:UniInputEvent},textarea:{input:UniInputEvent},"scroll-view":{scroll:UniScrollEvent,scrollend:UniScrollEvent,scrolltoupper:UniScrollToUpperEvent,scrolltolower:UniScrollToLowerEvent}},o=e.tagName.toLocaleLowerCase();if(r[o]&&r[o][t]){var i=new(0,r[o][t])(t,{detail:n});return n&&Object.assign(i,{detail:n}),Promise.resolve(e.dispatchEvent(t,i))}return Promise.reject(Error(o+" component "+t+" event not exists"))}(e,t,n)},callContextMethod:function(e,t,n){return e[t]?Promise.resolve(e[t].apply(e,n)):Promise.reject(Error(t+" method not exists"))}};var De=Object.assign({},function(e){return{"Page.getElement":function(t){return e.querySelector(e.getDocument(t.pageId),t.selector)},"Page.getElements":function(t){return e.querySelectorAll(e.getDocument(t.pageId),t.selector)},"Page.getWindowProperties":function(t){return e.queryProperties(e.getWindow(t.pageId),t.names)}}}(Ne),function(e){var t=function(t){return e.getEl(t.elementId,t.pageId)};return{"Element.getElement":function(n){return e.querySelector(t(n),n.selector)},"Element.getElements":function(n){return e.querySelectorAll(t(n),n.selector)},"Element.getDOMProperties":function(n){return e.queryProperties(t(n),n.names)},"Element.getProperties":function(n){var r=t(n);return e.queryProperties(r,n.names)},"Element.getOffset":function(n){return e.getOffset(t(n))},"Element.getAttributes":function(n){return e.queryAttributes(t(n),n.names)},"Element.getStyles":function(n){return e.queryStyles(t(n),n.names)},"Element.getHTML":function(n){return e.queryHTML(t(n),n.type)},"Element.tap":function(n){return e.dispatchTapEvent(t(n))},"Element.longpress":function(n){return e.dispatchLongpressEvent(t(n))},"Element.touchstart":function(n){return e.dispatchTouchEvent(t(n),"touchstart",n)},"Element.touchmove":function(n){return e.dispatchTouchEvent(t(n),"touchmove",n)},"Element.touchend":function(n){return e.dispatchTouchEvent(t(n),"touchend",n)},"Element.callFunction":function(n){return e.callFunction(t(n),n.functionName,n.args)},"Element.triggerEvent":function(n){return e.triggerEvent(t(n),n.type,n.detail)},"Element.callContextMethod":function(n){return e.callContextMethod(t(n),n.method,n.args)}}}(Ne));function We(e){return UniViewJSBridge.publishHandler("onAutoMessageReceive",e)}UniViewJSBridge.subscribe("sendAutoMessage",(function(e){var t=e.id,n=e.method,r=e.params,o={id:t};if("ping"==n)return o.result="pong",void We(o);var i=De[n];if(!i)return o.error={message:n+" unimplemented"},We(o);try{i(r).then((function(e){e&&(o.result=e)})).catch((function(e){o.error={message:e.message}})).finally((function(){We(o)}))}catch(e){o.error={message:e.message},We(o)}}));
