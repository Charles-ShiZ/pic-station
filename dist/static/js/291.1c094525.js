(()=>{var e,t,a,r,s={10230:()=>{},11713:()=>{},27277:()=>{},29140:()=>{},42915:()=>{},50343:()=>{},72571:()=>{},91361:(e,t,a)=>{"use strict";var r=a(15388);r._K2.localModelPath="../../../models/nllb-200-distilled-600M",r._K2.allowRemoteModels=!1,r._K2.backends.onnx.wasm.wasmPaths="../../../wasms";class s{static task="translation";static model="Xenova/nllb-200-distilled-600M";static instance=null;static async getInstance(e=null){return null===this.instance&&(this.instance=(0,r.TkF)(this.task,this.model,{progress_callback:e})),this.instance}}self.addEventListener("message",(async e=>{let t=await s.getInstance((e=>{self.postMessage(e)})),a=await t(e.data.text,{tgt_lang:e.data.tgt_lang,src_lang:e.data.src_lang});self.postMessage({status:"complete",output:a})}))}},n={};function o(e){var t=n[e];if(void 0!==t)return t.exports;var a=n[e]={exports:{}};return s[e](a,a.exports,o),a.exports}o.m=s,o.x=()=>{var e=o.O(void 0,[388],(()=>o(91361)));return e=o.O(e)},e=[],o.O=(t,a,r,s)=>{if(!a){var n=1/0;for(f=0;f<e.length;f++){for(var[a,r,s]=e[f],l=!0,i=0;i<a.length;i++)(!1&s||n>=s)&&Object.keys(o.O).every((e=>o.O[e](a[i])))?a.splice(i--,1):(l=!1,s<n&&(n=s));if(l){e.splice(f--,1);var c=r();void 0!==c&&(t=c)}}return t}s=s||0;for(var f=e.length;f>0&&e[f-1][2]>s;f--)e[f]=e[f-1];e[f]=[a,r,s]},a=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,o.t=function(e,r){if(1&r&&(e=this(e)),8&r)return e;if("object"==typeof e&&e){if(4&r&&e.__esModule)return e;if(16&r&&"function"==typeof e.then)return e}var s=Object.create(null);o.r(s);var n={};t=t||[null,a({}),a([]),a(a)];for(var l=2&r&&e;"object"==typeof l&&!~t.indexOf(l);l=a(l))Object.getOwnPropertyNames(l).forEach((t=>n[t]=()=>e[t]));return n.default=()=>e,o.d(s,n),s},o.d=(e,t)=>{for(var a in t)o.o(t,a)&&!o.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},o.f={},o.e=e=>Promise.all(Object.keys(o.f).reduce(((t,a)=>(o.f[a](e,t),t)),[])),o.u=e=>"static/js/"+e+".57a90e25.js",o.miniCssF=e=>{},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.p="/",(()=>{var e={291:1};o.f.i=(t,a)=>{e[t]||importScripts(o.p+o.u(t))};var t=self.webpackChunkpic_station=self.webpackChunkpic_station||[],a=t.push.bind(t);t.push=t=>{var[r,s,n]=t;for(var l in s)o.o(s,l)&&(o.m[l]=s[l]);for(n&&n(o);r.length;)e[r.pop()]=1;a(t)}})(),r=o.x,o.x=()=>o.e(388).then(r);o.x()})();