(function () {var module=function(exports,require){if(typeof require !== "undefined" && require.main === module){return require("./src")}

const redoc$1 = require('./redoc.standalone.js');


module.exports = redoc$1;
};
if(typeof require !== "undefined" && require.register){require.register("./src", module)}


/*! For license information please see redoc.standalone.js.LICENSE.txt */
      @media ${t?"print, ":""} screen and (max-width: ${t=>t.theme.breakpoints[e]}) ${n||""} {
        ${ca(...r)};
      }
    `},greaterThan(e){return(...t)=>ca`
      @media (min-width: ${t=>t.theme.breakpoints[e]}) {
        ${ca(...t)};
      }
    `},between(e,t){return(...n)=>ca`
      @media (min-width: ${t=>t.theme.breakpoints[e]}) and (max-width: ${e=>e.theme.breakpoints[t]}) {
        ${ca(...n)};
      }
    `}};var ha=la;function ma(e){return t=>{if(t.theme.extensionsHook)return t.theme.extensionsHook(e,t)}}const ga=ha.div`
  padding: 20px;
  color: red;
`;class ya extends n.Component{constructor(e){super(e),this.state={error:void 0}}componentDidCatch(e){return this.setState({error:e}),!1}render(){return this.state.error?n.createElement(ga,null,n.createElement("h1",null,"Something went wrong..."),n.createElement("small",null," ",this.state.error.message," "),n.createElement("p",null,n.createElement("details",null,n.createElement("summary",null,"Stack trace"),n.createElement("pre",null,this.state.error.stack))),n.createElement("small",null," ReDoc Version: ","2.1.3")," ",n.createElement("br",null),n.createElement("small",null," Commit: ","b2d8e0f")):n.createElement(n.Fragment,null,n.Children.only(this.props.children))}}const va=pa`
  0% {
    transform: rotate(0deg); }
  100% {
    transform: rotate(360deg);
  }
`,ba=ha((e=>n.createElement("svg",{className:e.className,version:"1.1",width:"512",height:"512",viewBox:"0 0 512 512"},n.createElement("path",{d:"M275.682 147.999c0 10.864-8.837 19.661-19.682 19.661v0c-10.875 0-19.681-8.796-19.681-19.661v-96.635c0-10.885 8.806-19.661 19.681-19.661v0c10.844 0 19.682 8.776 19.682 19.661v96.635z"}),n.createElement("path",{d:"M275.682 460.615c0 10.865-8.837 19.682-19.682 19.682v0c-10.875 0-19.681-8.817-19.681-19.682v-96.604c0-10.885 8.806-19.681 19.681-19.681v0c10.844 0 19.682 8.796 19.682 19.682v96.604z"}),n.createElement("path",{d:"M147.978 236.339c10.885 0 19.681 8.755 19.681 19.641v0c0 10.885-8.796 19.702-19.681 19.702h-96.624c-10.864 0-19.661-8.817-19.661-19.702v0c0-10.885 8.796-19.641 19.661-19.641h96.624z"}),n.createElement("path",{d:"M460.615 236.339c10.865 0 19.682 8.755 19.682 19.641v0c0 10.885-8.817 19.702-19.682 19.702h-96.584c-10.885 0-19.722-8.817-19.722-19.702v0c0-10.885 8.837-19.641 19.722-19.641h96.584z"}),n.createElement("path",{d:"M193.546 165.703c7.69 7.66 7.68 20.142 0 27.822v0c-7.701 7.701-20.162 7.701-27.853 0.020l-68.311-68.322c-7.68-7.701-7.68-20.142 0-27.863v0c7.68-7.68 20.121-7.68 27.822 0l68.342 68.342z"}),n.createElement("path",{d:"M414.597 386.775c7.7 7.68 7.7 20.163 0.021 27.863v0c-7.7 7.659-20.142 7.659-27.843-0.062l-68.311-68.26c-7.68-7.7-7.68-20.204 0-27.863v0c7.68-7.7 20.163-7.7 27.842 0l68.291 68.322z"}),n.createElement("path",{d:"M165.694 318.464c7.69-7.7 20.153-7.7 27.853 0v0c7.68 7.659 7.69 20.163 0 27.863l-68.342 68.322c-7.67 7.659-20.142 7.659-27.822-0.062v0c-7.68-7.68-7.68-20.122 0-27.801l68.311-68.322z"}),n.createElement("path",{d:"M386.775 97.362c7.7-7.68 20.142-7.68 27.822 0v0c7.7 7.68 7.7 20.183 0.021 27.863l-68.322 68.311c-7.68 7.68-20.163 7.68-27.843-0.020v0c-7.68-7.68-7.68-20.162 0-27.822l68.322-68.332z"}))))`
  animation: 2s ${va} linear infinite;
  width: 50px;
  height: 50px;
  content: '';
  display: inline-block;
  margin-left: -25px;

  path {
    fill: ${e=>e.color};
  }
`,xa=ha.div`
  font-family: helvetica, sans;
  width: 100%;
  text-align: center;
  font-size: 25px;
  margin: 30px 0 20px 0;
  color: ${e=>e.color};
`;class wa extends n.PureComponent{render(){return n.createElement("div",{style:{textAlign:"center"}},n.createElement(xa,{color:this.props.color},"Loading ..."),n.createElement(ba,{color:this.props.color}))}}var ka=r(5697);const Oa=n.createContext(new Si({})),Sa=Oa.Provider,Ea=Oa.Consumer;var _a=r(3675),Aa=r(3777),ja=r(8925),Ca=(e,t,n)=>new Promise(((r,i)=>{var o=e=>{try{s(n.next(e))}catch(e){i(e)}},a=e=>{try{s(n.throw(e))}catch(e){i(e)}},s=e=>e.done?r(e.value):Promise.resolve(e.value).then(o,a);s((n=n.apply(e,t)).next())}));var Pa=r(1851),Ta=r(6729),Ra=r(3573),Ia=r.n(Ra);const $a=Ra.parse;class Na{static baseName(e,t=1){const n=Na.parse(e);return n[n.length-t]}static dirName(e,t=1){const n=Na.parse(e);return Ra.compile(n.slice(0,n.length-t))}static relative(e,t){const n=Na.parse(e);return Na.parse(t).slice(n.length)}static parse(e){let t=e;return"#"===t.charAt(0)&&(t=t.substring(1)),$a(t)}static join(e,t){const n=Na.parse(e).concat(t);return Ra.compile(n)}static get(e,t){return Ra.get(e,t)}static compile(e){return Ra.compile(e)}static escape(e){return Ra.escape(e)}}Ra.parse=Na.parse,Object.assign(Na,Ra);var La=r(6470),Da=r(3578),Ma=Object.defineProperty,Fa=Object.defineProperties,za=Object.getOwnPropertyDescriptors,Ua=Object.getOwnPropertySymbols,Ba=Object.prototype.hasOwnProperty,qa=Object.prototype.propertyIsEnumerable,Va=(e,t,n)=>t in e?Ma(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Wa=(e,t)=>{for(var n in t||(t={}))Ba.call(t,n)&&Va(e,n,t[n]);if(Ua)for(var n of Ua(t))qa.call(t,n)&&Va(e,n,t[n]);return e},Ha=(e,t)=>Fa(e,za(t));function Ya(e){return"string"==typeof e&&/\dxx/i.test(e)}function Qa(e,t=!1){if("default"===e)return t?"error":"success";let n="string"==typeof e?parseInt(e,10):e;if(Ya(e)&&(n*=100),n<100||n>599)throw new Error("invalid HTTP code");let r="success";return n>=300&&n<400?r="redirect":n>=400?r="error":n<200&&(r="info"),r}const Ga={get:!0,post:!0,put:!0,head:!0,patch:!0,delete:!0,options:!0,$ref:!0};function Xa(e){return e in Ga}const Ka={multipleOf:"number",maximum:"number",exclusiveMaximum:"number",minimum:"number",exclusiveMinimum:"number",maxLength:"string",minLength:"string",pattern:"string",contentEncoding:"string",contentMediaType:"string",items:"array",maxItems:"array",minItems:"array",uniqueItems:"array",maxProperties:"object",minProperties:"object",required:"object",additionalProperties:"object",unevaluatedProperties:"object",properties:"object",patternProperties:"object"};function Za(e,t=e.type){if(e["x-circular-ref"])return!0;if(void 0!==e.oneOf||void 0!==e.anyOf)return!1;if(e.if&&e.then||e.if&&e.else)return!1;let n=!0;const r=ci(t);return("object"===t||r&&(null==t?void 0:t.includes("object")))&&(n=void 0!==e.properties?0===Object.keys(e.properties).length:void 0===e.additionalProperties&&void 0===e.unevaluatedProperties&&void 0===e.patternProperties),!ci(e.items)&&!ci(e.prefixItems)&&(void 0!==e.items&&!ui(e.items)&&("array"===t||r&&(null==t?void 0:t.includes("array")))&&(n=Za(e.items,e.items.type)),n)}function Ja(e){return-1!==e.search(/json/i)}function es(e,t,n){return ci(e)?e.map((e=>e.toString())).join(n):"object"==typeof e?Object.keys(e).map((t=>`${t}${n}${e[t]}`)).join(n):t+"="+e.toString()}function ts(e,t){return ci(e)?(console.warn("deepObject style cannot be used with array value:"+e.toString()),""):"object"==typeof e?Object.keys(e).map((n=>`${t}[${n}]=${e[n]}`)).join("&"):(console.warn("deepObject style cannot be used with non-object value:"+e.toString()),"")}function ns(e,t,n){const r="__redoc_param_name__",i=t?"*":"";return Da.parse(`{?${r}${i}}`).expand({[r]:n}).substring(1).replace(/__redoc_param_name__/g,e)}function rs(e,t){return Ja(t)?JSON.stringify(e):(console.warn(`Parameter serialization as ${t} is not supported`),"")}function is(e,t){return e.in?decodeURIComponent(function(e,t){const{name:n,style:r,explode:i=!1,serializationMime:o}=e;if(o)switch(e.in){case"path":case"header":return rs(t,o);case"cookie":case"query":return`${n}=${rs(t,o)}`;default:return console.warn("Unexpected parameter location: "+e.in),""}if(!r)return console.warn(`Missing style attribute or content for parameter ${n}`),"";switch(e.in){case"path":return function(e,t,n,r){const i=n?"*":"";let o="";"label"===t?o=".":"matrix"===t&&(o=";");const a="__redoc_param_name__";return Da.parse(`{${o}${a}${i}}`).expand({[a]:r}).replace(/__redoc_param_name__/g,e)}(n,r,i,t);case"query":return function(e,t,n,r){switch(t){case"form":return ns(e,n,r);case"spaceDelimited":return ci(r)?n?ns(e,n,r):`${e}=${r.join("%20")}`:(console.warn("The style spaceDelimited is only applicable to arrays"),"");case"pipeDelimited":return ci(r)?n?ns(e,n,r):`${e}=${r.join("|")}`:(console.warn("The style pipeDelimited is only applicable to arrays"),"");case"deepObject":return!n||ci(r)||"object"!=typeof r?(console.warn("The style deepObject is only applicable for objects with explode=true"),""):ts(r,e);default:return console.warn("Unexpected style for query: "+t),""}}(n,r,i,t);case"header":return function(e,t,n){if("simple"===e){const e=t?"*":"",r="__redoc_param_name__",i=Da.parse(`{${r}${e}}`);return decodeURIComponent(i.expand({[r]:n}))}return console.warn("Unexpected style for header: "+e),""}(r,i,t);case"cookie":return function(e,t,n,r){return"form"===t?ns(e,n,r):(console.warn("Unexpected style for cookie: "+t),"")}(n,r,i,t);default:return console.warn("Unexpected parameter location: "+e.in),""}}(e,t)):String(t)}const os=/^#\/components\/(schemas|pathItems)\/([^/]+)$/;function as(e){return os.test(e||"")}function ss(e){var t;const[n]=(null==(t=null==e?void 0:e.match(os))?void 0:t.reverse())||[];return n}function ls(e,t,n){let r;return void 0!==t&&void 0!==n?r=t===n?`= ${t} ${e}`:`[ ${t} .. ${n} ] ${e}`:void 0!==n?r=`<= ${n} ${e}`:void 0!==t&&(r=1===t?"non-empty":`>= ${t} ${e}`),r}function cs(e){const t=[],n=ls("characters",e.minLength,e.maxLength);void 0!==n&&t.push(n);const r=ls("items",e.minItems,e.maxItems);void 0!==r&&t.push(r);const i=ls("properties",e.minProperties,e.maxProperties);void 0!==i&&t.push(i);const o=function(e){if(void 0===e)return;const t=e.toString(10);return/^0\.0*1$/.test(t)?`decimal places <= ${t.split(".")[1].length}`:`multiple of ${t}`}(e.multipleOf);void 0!==o&&t.push(o);const a=function(e){var t,n;const r="number"==typeof e.exclusiveMinimum?Math.min(e.exclusiveMinimum,null!=(t=e.minimum)?t:1/0):e.minimum,i="number"==typeof e.exclusiveMaximum?Math.max(e.exclusiveMaximum,null!=(n=e.maximum)?n:-1/0):e.maximum,o="number"==typeof e.exclusiveMinimum||e.exclusiveMinimum,a="number"==typeof e.exclusiveMaximum||e.exclusiveMaximum;return void 0!==r&&void 0!==i?`${o?"( ":"[ "}${r} .. ${i}${a?" )":" ]"}`:void 0!==i?`${a?"< ":"<= "}${i}`:void 0!==r?`${o?"> ":">= "}${r}`:void 0}(e);return void 0!==a&&t.push(a),e.uniqueItems&&t.push("unique"),t}function us(e,t=[]){const n=[],r=[],i=[];return e.forEach((e=>{e.required?t.includes(e.name)?r.push(e):i.push(e):n.push(e)})),r.sort(((e,n)=>t.indexOf(e.name)-t.indexOf(n.name))),[...r,...i,...n]}function ps(e,t){return[...e].sort(((e,n)=>e[t].localeCompare(n[t])))}function ds(e,t){const n=void 0===e?function(e){try{const t=si(e);return t.search="",t.hash="",t.toString()}catch(t){return e}}((()=>{if(!Qr)return"";const e=window.location.href;return e.endsWith(".html")?(0,La.dirname)(e):e})()):(0,La.dirname)(e);return 0===t.length&&(t=[{url:"/"}]),t.map((e=>{return Ha(Wa({},e),{url:(t=e.url,function(e,t){let n;if(t.startsWith("//"))try{n=`${new URL(e).protocol||"https:"}${t}`}catch(e){n=`https:${t}`}else if(function(e){return/(?:^[a-z][a-z0-9+.-]*:|\/\/)/i.test(e)}(t))n=t;else if(t.startsWith("/"))try{const r=new URL(e);r.pathname=t,n=r.href}catch(e){n=t}else n=ti(e)+"/"+t;return ti(n)}(n,t)),description:e.description||""});var t}))}let fs="section/Authentication/";const hs=e=>({delete:"del",options:"opts"}[e]||e);function ms(e,t){return Object.keys(e).filter((e=>!0===t?e.startsWith("x-")&&!function(e){return e in{"x-circular-ref":!0,"x-parentRefs":!0,"x-refsStack":!0,"x-code-samples":!0,"x-codeSamples":!0,"x-displayName":!0,"x-examples":!0,"x-ignoredHeaderParameters":!0,"x-logo":!0,"x-nullable":!0,"x-servers":!0,"x-tagGroups":!0,"x-traitTag":!0,"x-additionalPropertiesName":!0,"x-explicitMappingOnly":!0}}(e):e.startsWith("x-")&&t.indexOf(e)>-1)).reduce(((t,n)=>(t[n]=e[n],t)),{})}var gs=r(5660);r(7874),r(4279),r(5433),r(6213),r(2731),r(9016),r(7046),r(57),r(2503),r(6841),r(6854),r(4335),r(1426),r(8246),r(9945),r(366),r(2939),r(9385),r(2886),r(5266),r(874),r(3358),r(7899);const ys="clike";function vs(e,t=ys){t=t.toLowerCase();let n=gs.languages[t];return n||(n=gs.languages[function(e){return{json:"js","c++":"cpp","c#":"csharp","objective-c":"objectivec",shell:"bash",viml:"vim"}[e]||ys}(t)]),gs.highlight(e.toString(),n,t)}gs.languages.insertBefore("javascript","string",{"property string":{pattern:/([{,]\s*)"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,lookbehind:!0}},void 0),gs.languages.insertBefore("javascript","punctuation",{property:{pattern:/([{,]\s*)[a-z]\w*(?=\s*:)/i,lookbehind:!0}},void 0);var bs=Object.defineProperty,xs=Object.defineProperties,ws=Object.getOwnPropertyDescriptors,ks=Object.getOwnPropertySymbols,Os=Object.prototype.hasOwnProperty,Ss=Object.prototype.propertyIsEnumerable,Es=(e,t,n)=>t in e?bs(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,_s=(e,t)=>{for(var n in t||(t={}))Os.call(t,n)&&Es(e,n,t[n]);if(ks)for(var n of ks(t))Ss.call(t,n)&&Es(e,n,t[n]);return e},As=(e,t)=>xs(e,ws(t));const js={};function Cs(e,t,n){if("function"==typeof n.value)return function(e,t,n){if(!n.value||n.value.length>0)throw new Error("@memoize decorator can only be applied to methods of zero arguments");const r=`_memoized_${t}`,i=n.value;return e[r]=js,As(_s({},n),{value(){return this[r]===js&&(this[r]=i.call(this)),this[r]}})}(e,t,n);if("function"==typeof n.get)return function(e,t,n){const r=`_memoized_${t}`,i=n.get;return e[r]=js,As(_s({},n),{get(){return this[r]===js&&(this[r]=i.call(this)),this[r]}})}(e,t,n);throw new Error("@memoize decorator can be applied to methods or getters, got "+String(n.value)+" instead")}function Ps(e){let t=1;return"-"===e[0]&&(t=-1,e=e.substr(1)),(n,r)=>-1==t?r[e].localeCompare(n[e]):n[e].localeCompare(r[e])}var Ts=Object.defineProperty,Rs=Object.getOwnPropertyDescriptor;const Is="hashchange";class $s{constructor(){this.emit=()=>{this._emiter.emit(Is,this.currentId)},this._emiter=new Ta.EventEmitter,this.bind()}get currentId(){return Qr?decodeURIComponent(window.location.hash.substring(1)):""}linkForId(e){return e?"#"+e:""}subscribe(e){const t=this._emiter.addListener(Is,e);return()=>t.removeListener(Is,e)}bind(){Qr&&window.addEventListener("hashchange",this.emit,!1)}dispose(){Qr&&window.removeEventListener("hashchange",this.emit)}replace(e,t=!1){Qr&&null!=e&&e!==this.currentId&&(t?window.history.replaceState(null,"",window.location.href.split("#")[0]+this.linkForId(e)):(window.history.pushState(null,"",window.location.href.split("#")[0]+this.linkForId(e)),this.emit()))}}((e,t,n,r)=>{for(var i,o=Rs(t,n),a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(t,n,o)||o);o&&Ts(t,n,o)})([Pa.bind,Pa.debounce],$s.prototype,"replace");const Ns=new $s;var Ls=r(813);class Ds{constructor(){this.map=new Map,this.prevTerm=""}add(e){this.map.set(e,new Ls(e))}delete(e){this.map.delete(e)}addOnly(e){this.map.forEach(((t,n)=>{-1===e.indexOf(n)&&(t.unmark(),this.map.delete(n))}));for(const t of e)this.map.has(t)||this.map.set(t,new Ls(t))}clearAll(){this.unmark(),this.map.clear()}mark(e){(e||this.prevTerm)&&(this.map.forEach((t=>{t.unmark(),t.mark(e||this.prevTerm)})),this.prevTerm=e||this.prevTerm)}unmark(){this.map.forEach((e=>e.unmark())),this.prevTerm=""}}let Ms={baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1};const Fs=/[&<>"']/,zs=/[&<>"']/g,Us=/[<>"']|&(?!#?\w+;)/,Bs=/[<>"']|&(?!#?\w+;)/g,qs={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Vs=e=>qs[e];function Ws(e,t){if(t){if(Fs.test(e))return e.replace(zs,Vs)}else if(Us.test(e))return e.replace(Bs,Vs);return e}const Hs=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function Ys(e){return e.replace(Hs,((e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}const Qs=/(^|[^\[])\^/g;function Gs(e,t){e="string"==typeof e?e:e.source,t=t||"";const n={replace:(t,r)=>(r=(r=r.source||r).replace(Qs,"$1"),e=e.replace(t,r),n),getRegex:()=>new RegExp(e,t)};return n}const Xs=/[^\w:]/g,Ks=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function Zs(e,t,n){if(e){let e;try{e=decodeURIComponent(Ys(n)).replace(Xs,"").toLowerCase()}catch(e){return null}if(0===e.indexOf("javascript:")||0===e.indexOf("vbscript:")||0===e.indexOf("data:"))return null}t&&!Ks.test(n)&&(n=function(e,t){Js[" "+e]||(el.test(e)?Js[" "+e]=e+"/":Js[" "+e]=al(e,"/",!0));const n=-1===(e=Js[" "+e]).indexOf(":");return"//"===t.substring(0,2)?n?t:e.replace(tl,"$1")+t:"/"===t.charAt(0)?n?t:e.replace(nl,"$1")+t:e+t}(t,n));try{n=encodeURI(n).replace(/%25/g,"%")}catch(e){return null}return n}const Js={},el=/^[^:]+:\/*[^/]*$/,tl=/^([^:]+:)[\s\S]*$/,nl=/^([^:]+:\/*[^/]*)[\s\S]*$/,rl={exec:function(){}};function il(e){let t,n,r=1;for(;r<arguments.length;r++)for(n in t=arguments[r],t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}function ol(e,t){const n=e.replace(/\|/g,((e,t,n)=>{let r=!1,i=t;for(;--i>=0&&"\\"===n[i];)r=!r;return r?"|":" |"})).split(/ \|/);let r=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),n.length>t)n.splice(t);else for(;n.length<t;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(/\\\|/g,"|");return n}function al(e,t,n){const r=e.length;if(0===r)return"";let i=0;for(;i<r;){const o=e.charAt(r-i-1);if(o!==t||n){if(o===t||!n)break;i++}else i++}return e.slice(0,r-i)}function sl(e){e&&e.sanitize&&!e.silent&&console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options")}function ll(e,t){if(t<1)return"";let n="";for(;t>1;)1&t&&(n+=e),t>>=1,e+=e;return n+e}function cl(e,t,n,r){const i=t.href,o=t.title?Ws(t.title):null,a=e[1].replace(/\\([\[\]])/g,"$1");if("!"!==e[0].charAt(0)){r.state.inLink=!0;const e={type:"link",raw:n,href:i,title:o,text:a,tokens:r.inlineTokens(a,[])};return r.state.inLink=!1,e}return{type:"image",raw:n,href:i,title:o,text:Ws(a)}}class ul{constructor(e){this.options=e||Ms}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const e=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?e:al(e,"\n")}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const e=t[0],n=function(e,t){const n=e.match(/^(\s+)(?:```)/);if(null===n)return t;const r=n[1];return t.split("\n").map((e=>{const t=e.match(/^\s+/);if(null===t)return e;const[n]=t;return n.length>=r.length?e.slice(r.length):e})).join("\n")}(e,t[3]||"");return{type:"code",raw:e,lang:t[2]?t[2].trim():t[2],text:n}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(/#$/.test(e)){const t=al(e,"#");this.options.pedantic?e=t.trim():t&&!/ $/.test(t)||(e=t.trim())}const n={type:"heading",raw:t[0],depth:t[1].length,text:e,tokens:[]};return this.lexer.inline(n.text,n.tokens),n}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){const e=t[0].replace(/^ *>[ \t]?/gm,"");return{type:"blockquote",raw:t[0],tokens:this.lexer.blockTokens(e,[]),text:e}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n,r,i,o,a,s,l,c,u,p,d,f,h=t[1].trim();const m=h.length>1,g={type:"list",raw:"",ordered:m,start:m?+h.slice(0,-1):"",loose:!1,items:[]};h=m?`\\d{1,9}\\${h.slice(-1)}`:`\\${h}`,this.options.pedantic&&(h=m?h:"[*+-]");const y=new RegExp(`^( {0,3}${h})((?:[\t ][^\\n]*)?(?:\\n|$))`);for(;e&&(f=!1,t=y.exec(e))&&!this.rules.block.hr.test(e);){if(n=t[0],e=e.substring(n.length),c=t[2].split("\n",1)[0],u=e.split("\n",1)[0],this.options.pedantic?(o=2,d=c.trimLeft()):(o=t[2].search(/[^ ]/),o=o>4?1:o,d=c.slice(o),o+=t[1].length),s=!1,!c&&/^ *$/.test(u)&&(n+=u+"\n",e=e.substring(u.length+1),f=!0),!f){const t=new RegExp(`^ {0,${Math.min(3,o-1)}}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))`),r=new RegExp(`^ {0,${Math.min(3,o-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);for(;e&&(p=e.split("\n",1)[0],c=p,this.options.pedantic&&(c=c.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),!t.test(c))&&!r.test(e);){if(c.search(/[^ ]/)>=o||!c.trim())d+="\n"+c.slice(o);else{if(s)break;d+="\n"+c}s||c.trim()||(s=!0),n+=p+"\n",e=e.substring(p.length+1)}}g.loose||(l?g.loose=!0:/\n *\n *$/.test(n)&&(l=!0)),this.options.gfm&&(r=/^\[[ xX]\] /.exec(d),r&&(i="[ ] "!==r[0],d=d.replace(/^\[[ xX]\] +/,""))),g.items.push({type:"list_item",raw:n,task:!!r,checked:i,loose:!1,text:d}),g.raw+=n}g.items[g.items.length-1].raw=n.trimRight(),g.items[g.items.length-1].text=d.trimRight(),g.raw=g.raw.trimRight();const v=g.items.length;for(a=0;a<v;a++){this.lexer.state.top=!1,g.items[a].tokens=this.lexer.blockTokens(g.items[a].text,[]);const e=g.items[a].tokens.filter((e=>"space"===e.type)),t=e.every((e=>{const t=e.raw.split("");let n=0;for(const e of t)if("\n"===e&&(n+=1),n>1)return!0;return!1}));!g.loose&&e.length&&t&&(g.loose=!0,g.items[a].loose=!0)}return g}}html(e){const t=this.rules.block.html.exec(e);if(t){const e={type:"html",raw:t[0],pre:!this.options.sanitizer&&("pre"===t[1]||"script"===t[1]||"style"===t[1]),text:t[0]};return this.options.sanitize&&(e.type="paragraph",e.text=this.options.sanitizer?this.options.sanitizer(t[0]):Ws(t[0]),e.tokens=[],this.lexer.inline(e.text,e.tokens)),e}}def(e){const t=this.rules.block.def.exec(e);if(t)return t[3]&&(t[3]=t[3].substring(1,t[3].length-1)),{type:"def",tag:t[1].toLowerCase().replace(/\s+/g," "),raw:t[0],href:t[2],title:t[3]}}table(e){const t=this.rules.block.table.exec(e);if(t){const e={type:"table",header:ol(t[1]).map((e=>({text:e}))),align:t[2].replace(/^ *|\| *$/g,"").split(/ *\| */),rows:t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split("\n"):[]};if(e.header.length===e.align.length){e.raw=t[0];let n,r,i,o,a=e.align.length;for(n=0;n<a;n++)/^ *-+: *$/.test(e.align[n])?e.align[n]="right":/^ *:-+: *$/.test(e.align[n])?e.align[n]="center":/^ *:-+ *$/.test(e.align[n])?e.align[n]="left":e.align[n]=null;for(a=e.rows.length,n=0;n<a;n++)e.rows[n]=ol(e.rows[n],e.header.length).map((e=>({text:e})));for(a=e.header.length,r=0;r<a;r++)e.header[r].tokens=[],this.lexer.inlineTokens(e.header[r].text,e.header[r].tokens);for(a=e.rows.length,r=0;r<a;r++)for(o=e.rows[r],i=0;i<o.length;i++)o[i].tokens=[],this.lexer.inlineTokens(o[i].text,o[i].tokens);return e}}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t){const e={type:"heading",raw:t[0],depth:"="===t[2].charAt(0)?1:2,text:t[1],tokens:[]};return this.lexer.inline(e.text,e.tokens),e}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const e={type:"paragraph",raw:t[0],text:"\n"===t[1].charAt(t[1].length-1)?t[1].slice(0,-1):t[1],tokens:[]};return this.lexer.inline(e.text,e.tokens),e}}text(e){const t=this.rules.block.text.exec(e);if(t){const e={type:"text",raw:t[0],text:t[0],tokens:[]};return this.lexer.inline(e.text,e.tokens),e}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:Ws(t[1])}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:this.options.sanitize?"text":"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(t[0]):Ws(t[0]):t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const e=t[2].trim();if(!this.options.pedantic&&/^</.test(e)){if(!/>$/.test(e))return;const t=al(e.slice(0,-1),"\\");if((e.length-t.length)%2==0)return}else{const e=function(e,t){if(-1===e.indexOf(t[1]))return-1;const n=e.length;let r=0,i=0;for(;i<n;i++)if("\\"===e[i])i++;else if(e[i]===t[0])r++;else if(e[i]===t[1]&&(r--,r<0))return i;return-1}(t[2],"()");if(e>-1){const n=(0===t[0].indexOf("!")?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=""}}let n=t[2],r="";if(this.options.pedantic){const e=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n);e&&(n=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):"";return n=n.trim(),/^</.test(n)&&(n=this.options.pedantic&&!/>$/.test(e)?n.slice(1):n.slice(1,-1)),cl(t,{href:n?n.replace(this.rules.inline._escapes,"$1"):n,title:r?r.replace(this.rules.inline._escapes,"$1"):r},t[0],this.lexer)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let e=(n[2]||n[1]).replace(/\s+/g," ");if(e=t[e.toLowerCase()],!e||!e.href){const e=n[0].charAt(0);return{type:"text",raw:e,text:e}}return cl(n,e,n[0],this.lexer)}}emStrong(e,t,n=""){let r=this.rules.inline.emStrong.lDelim.exec(e);if(!r)return;if(r[3]&&n.match(/[\p{L}\p{N}]/u))return;const i=r[1]||r[2]||"";if(!i||i&&(""===n||this.rules.inline.punctuation.exec(n))){const n=r[0].length-1;let i,o,a=n,s=0;const l="*"===r[0][0]?this.rules.inline.emStrong.rDelimAst:this.rules.inline.emStrong.rDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+n);null!=(r=l.exec(t));){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(o=i.length,r[3]||r[4]){a+=o;continue}if((r[5]||r[6])&&n%3&&!((n+o)%3)){s+=o;continue}if(a-=o,a>0)continue;if(o=Math.min(o,o+a+s),Math.min(n,o)%2){const t=e.slice(1,n+r.index+o);return{type:"em",raw:e.slice(0,n+r.index+o+1),text:t,tokens:this.lexer.inlineTokens(t,[])}}const t=e.slice(2,n+r.index+o-1);return{type:"strong",raw:e.slice(0,n+r.index+o+1),text:t,tokens:this.lexer.inlineTokens(t,[])}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(/\n/g," ");const n=/[^ ]/.test(e),r=/^ /.test(e)&&/ $/.test(e);return n&&r&&(e=e.substring(1,e.length-1)),e=Ws(e,!0),{type:"codespan",raw:t[0],text:e}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2],[])}}autolink(e,t){const n=this.rules.inline.autolink.exec(e);if(n){let e,r;return"@"===n[2]?(e=Ws(this.options.mangle?t(n[1]):n[1]),r="mailto:"+e):(e=Ws(n[1]),r=e),{type:"link",raw:n[0],text:e,href:r,tokens:[{type:"text",raw:e,text:e}]}}}url(e,t){let n;if(n=this.rules.inline.url.exec(e)){let e,r;if("@"===n[2])e=Ws(this.options.mangle?t(n[0]):n[0]),r="mailto:"+e;else{let t;do{t=n[0],n[0]=this.rules.inline._backpedal.exec(n[0])[0]}while(t!==n[0]);e=Ws(n[0]),r="www."===n[1]?"http://"+e:e}return{type:"link",raw:n[0],text:e,href:r,tokens:[{type:"text",raw:e,text:e}]}}}inlineText(e,t){const n=this.rules.inline.text.exec(e);if(n){let e;return e=this.lexer.state.inRawBlock?this.options.sanitize?this.options.sanitizer?this.options.sanitizer(n[0]):Ws(n[0]):n[0]:Ws(this.options.smartypants?t(n[0]):n[0]),{type:"text",raw:n[0],text:e}}}}const pl={newline:/^(?: *(?:\n|$))+/,code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,hr:/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,html:"^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",def:/^ {0,3}\[(label)\]: *(?:\n *)?<?([^\s>]+)>?(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,table:rl,lheading:/^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,text:/^[^\n]+/,_label:/(?!\s*\])(?:\\.|[^\[\]\\])+/,_title:/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/};pl.def=Gs(pl.def).replace("label",pl._label).replace("title",pl._title).getRegex(),pl.bullet=/(?:[*+-]|\d{1,9}[.)])/,pl.listItemStart=Gs(/^( *)(bull) */).replace("bull",pl.bullet).getRegex(),pl.list=Gs(pl.list).replace(/bull/g,pl.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+pl.def.source+")").getRegex(),pl._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",pl._comment=/<!--(?!-?>)[\s\S]*?(?:-->|$)/,pl.html=Gs(pl.html,"i").replace("comment",pl._comment).replace("tag",pl._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),pl.paragraph=Gs(pl._paragraph).replace("hr",pl.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pl._tag).getRegex(),pl.blockquote=Gs(pl.blockquote).replace("paragraph",pl.paragraph).getRegex(),pl.normal=il({},pl),pl.gfm=il({},pl.normal,{table:"^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"}),pl.gfm.table=Gs(pl.gfm.table).replace("hr",pl.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pl._tag).getRegex(),pl.gfm.paragraph=Gs(pl._paragraph).replace("hr",pl.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("table",pl.gfm.table).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pl._tag).getRegex(),pl.pedantic=il({},pl.normal,{html:Gs("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",pl._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:rl,paragraph:Gs(pl.normal._paragraph).replace("hr",pl.hr).replace("heading"," *#{1,6} *[^\n]").replace("lheading",pl.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()});const dl={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:rl,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(ref)\]/,nolink:/^!?\[(ref)\](?:\[\])?/,reflinkSearch:"reflink|nolink(?!\\()",emStrong:{lDelim:/^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,rDelimAst:/^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[^*]+(?=[^*])|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,rDelimUnd:/^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/},code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:rl,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,punctuation:/^([\spunctuation])/};function fl(e){return e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")}function hl(e){let t,n,r="";const i=e.length;for(t=0;t<i;t++)n=e.charCodeAt(t),Math.random()>.5&&(n="x"+n.toString(16)),r+="&#"+n+";";return r}dl._punctuation="!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~",dl.punctuation=Gs(dl.punctuation).replace(/punctuation/g,dl._punctuation).getRegex(),dl.blockSkip=/\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g,dl.escapedEmSt=/\\\*|\\_/g,dl._comment=Gs(pl._comment).replace("(?:--\x3e|$)","--\x3e").getRegex(),dl.emStrong.lDelim=Gs(dl.emStrong.lDelim).replace(/punct/g,dl._punctuation).getRegex(),dl.emStrong.rDelimAst=Gs(dl.emStrong.rDelimAst,"g").replace(/punct/g,dl._punctuation).getRegex(),dl.emStrong.rDelimUnd=Gs(dl.emStrong.rDelimUnd,"g").replace(/punct/g,dl._punctuation).getRegex(),dl._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,dl._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,dl._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,dl.autolink=Gs(dl.autolink).replace("scheme",dl._scheme).replace("email",dl._email).getRegex(),dl._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,dl.tag=Gs(dl.tag).replace("comment",dl._comment).replace("attribute",dl._attribute).getRegex(),dl._label=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,dl._href=/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/,dl._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,dl.link=Gs(dl.link).replace("label",dl._label).replace("href",dl._href).replace("title",dl._title).getRegex(),dl.reflink=Gs(dl.reflink).replace("label",dl._label).replace("ref",pl._label).getRegex(),dl.nolink=Gs(dl.nolink).replace("ref",pl._label).getRegex(),dl.reflinkSearch=Gs(dl.reflinkSearch,"g").replace("reflink",dl.reflink).replace("nolink",dl.nolink).getRegex(),dl.normal=il({},dl),dl.pedantic=il({},dl.normal,{strong:{start:/^__|\*\*/,middle:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,endAst:/\*\*(?!\*)/g,endUnd:/__(?!_)/g},em:{start:/^_|\*/,middle:/^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,endAst:/\*(?!\*)/g,endUnd:/_(?!_)/g},link:Gs(/^!?\[(label)\]\((.*?)\)/).replace("label",dl._label).getRegex(),reflink:Gs(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",dl._label).getRegex()}),dl.gfm=il({},dl.normal,{escape:Gs(dl.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/}),dl.gfm.url=Gs(dl.gfm.url,"i").replace("email",dl.gfm._extended_email).getRegex(),dl.breaks=il({},dl.gfm,{br:Gs(dl.br).replace("{2,}","*").getRegex(),text:Gs(dl.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()});class ml{constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ms,this.options.tokenizer=this.options.tokenizer||new ul,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={block:pl.normal,inline:dl.normal};this.options.pedantic?(t.block=pl.pedantic,t.inline=dl.pedantic):this.options.gfm&&(t.block=pl.gfm,this.options.breaks?t.inline=dl.breaks:t.inline=dl.gfm),this.tokenizer.rules=t}static get rules(){return{block:pl,inline:dl}}static lex(e,t){return new ml(t).lex(e)}static lexInline(e,t){return new ml(t).inlineTokens(e)}lex(e){let t;for(e=e.replace(/\r\n|\r/g,"\n"),this.blockTokens(e,this.tokens);t=this.inlineQueue.shift();)this.inlineTokens(t.src,t.tokens);return this.tokens}blockTokens(e,t=[]){let n,r,i,o;for(e=this.options.pedantic?e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e.replace(/^( *)(\t+)/gm,((e,t,n)=>t+"    ".repeat(n.length)));e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some((r=>!!(n=r.call({lexer:this},e,t))&&(e=e.substring(n.raw.length),t.push(n),!0)))))if(n=this.tokenizer.space(e))e=e.substring(n.raw.length),1===n.raw.length&&t.length>0?t[t.length-1].raw+="\n":t.push(n);else if(n=this.tokenizer.code(e))e=e.substring(n.raw.length),r=t[t.length-1],!r||"paragraph"!==r.type&&"text"!==r.type?t.push(n):(r.raw+="\n"+n.raw,r.text+="\n"+n.text,this.inlineQueue[this.inlineQueue.length-1].src=r.text);else if(n=this.tokenizer.fences(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.heading(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.hr(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.blockquote(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.list(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.html(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.def(e))e=e.substring(n.raw.length),r=t[t.length-1],!r||"paragraph"!==r.type&&"text"!==r.type?this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title}):(r.raw+="\n"+n.raw,r.text+="\n"+n.raw,this.inlineQueue[this.inlineQueue.length-1].src=r.text);else if(n=this.tokenizer.table(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.lheading(e))e=e.substring(n.raw.length),t.push(n);else{if(i=e,this.options.extensions&&this.options.extensions.startBlock){let t=1/0;const n=e.slice(1);let r;this.options.extensions.startBlock.forEach((function(e){r=e.call({lexer:this},n),"number"==typeof r&&r>=0&&(t=Math.min(t,r))})),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(this.state.top&&(n=this.tokenizer.paragraph(i)))r=t[t.length-1],o&&"paragraph"===r.type?(r.raw+="\n"+n.raw,r.text+="\n"+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=r.text):t.push(n),o=i.length!==e.length,e=e.substring(n.raw.length);else if(n=this.tokenizer.text(e))e=e.substring(n.raw.length),r=t[t.length-1],r&&"text"===r.type?(r.raw+="\n"+n.raw,r.text+="\n"+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=r.text):t.push(n);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}return this.state.top=!0,t}inline(e,t){this.inlineQueue.push({src:e,tokens:t})}inlineTokens(e,t=[]){let n,r,i,o,a,s,l=e;if(this.tokens.links){const e=Object.keys(this.tokens.links);if(e.length>0)for(;null!=(o=this.tokenizer.rules.inline.reflinkSearch.exec(l));)e.includes(o[0].slice(o[0].lastIndexOf("[")+1,-1))&&(l=l.slice(0,o.index)+"["+ll("a",o[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;null!=(o=this.tokenizer.rules.inline.blockSkip.exec(l));)l=l.slice(0,o.index)+"["+ll("a",o[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;null!=(o=this.tokenizer.rules.inline.escapedEmSt.exec(l));)l=l.slice(0,o.index)+"++"+l.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);for(;e;)if(a||(s=""),a=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some((r=>!!(n=r.call({lexer:this},e,t))&&(e=e.substring(n.raw.length),t.push(n),!0)))))if(n=this.tokenizer.escape(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.tag(e))e=e.substring(n.raw.length),r=t[t.length-1],r&&"text"===n.type&&"text"===r.type?(r.raw+=n.raw,r.text+=n.text):t.push(n);else if(n=this.tokenizer.link(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.reflink(e,this.tokens.links))e=e.substring(n.raw.length),r=t[t.length-1],r&&"text"===n.type&&"text"===r.type?(r.raw+=n.raw,r.text+=n.text):t.push(n);else if(n=this.tokenizer.emStrong(e,l,s))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.codespan(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.br(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.del(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.autolink(e,hl))e=e.substring(n.raw.length),t.push(n);else if(this.state.inLink||!(n=this.tokenizer.url(e,hl))){if(i=e,this.options.extensions&&this.options.extensions.startInline){let t=1/0;const n=e.slice(1);let r;this.options.extensions.startInline.forEach((function(e){r=e.call({lexer:this},n),"number"==typeof r&&r>=0&&(t=Math.min(t,r))})),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(n=this.tokenizer.inlineText(i,fl))e=e.substring(n.raw.length),"_"!==n.raw.slice(-1)&&(s=n.raw.slice(-1)),a=!0,r=t[t.length-1],r&&"text"===r.type?(r.raw+=n.raw,r.text+=n.text):t.push(n);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}else e=e.substring(n.raw.length),t.push(n);return t}}class gl{constructor(e){this.options=e||Ms}code(e,t,n){const r=(t||"").match(/\S*/)[0];if(this.options.highlight){const t=this.options.highlight(e,r);null!=t&&t!==e&&(n=!0,e=t)}return e=e.replace(/\n$/,"")+"\n",r?'<pre><code class="'+this.options.langPrefix+Ws(r,!0)+'">'+(n?e:Ws(e,!0))+"</code></pre>\n":"<pre><code>"+(n?e:Ws(e,!0))+"</code></pre>\n"}blockquote(e){return`<blockquote>\n${e}</blockquote>\n`}html(e){return e}heading(e,t,n,r){return this.options.headerIds?`<h${t} id="${this.options.headerPrefix+r.slug(n)}">${e}</h${t}>\n`:`<h${t}>${e}</h${t}>\n`}hr(){return this.options.xhtml?"<hr/>\n":"<hr>\n"}list(e,t,n){const r=t?"ol":"ul";return"<"+r+(t&&1!==n?' start="'+n+'"':"")+">\n"+e+"</"+r+">\n"}listitem(e){return`<li>${e}</li>\n`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "}paragraph(e){return`<p>${e}</p>\n`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"}tablerow(e){return`<tr>\n${e}</tr>\n`}tablecell(e,t){const n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>\n`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return this.options.xhtml?"<br/>":"<br>"}del(e){return`<del>${e}</del>`}link(e,t,n){if(null===(e=Zs(this.options.sanitize,this.options.baseUrl,e)))return n;let r='<a href="'+Ws(e)+'"';return t&&(r+=' title="'+t+'"'),r+=">"+n+"</a>",r}image(e,t,n){if(null===(e=Zs(this.options.sanitize,this.options.baseUrl,e)))return n;let r=`<img src="${e}" alt="${n}"`;return t&&(r+=` title="${t}"`),r+=this.options.xhtml?"/>":">",r}text(e){return e}}class yl{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,n){return""+n}image(e,t,n){return""+n}br(){return""}}class vl{constructor(){this.seen={}}serialize(e){return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-")}getNextSafeSlug(e,t){let n=e,r=0;if(this.seen.hasOwnProperty(n)){r=this.seen[e];do{r++,n=e+"-"+r}while(this.seen.hasOwnProperty(n))}return t||(this.seen[e]=r,this.seen[n]=0),n}slug(e,t={}){const n=this.serialize(e);return this.getNextSafeSlug(n,t.dryrun)}}class bl{constructor(e){this.options=e||Ms,this.options.renderer=this.options.renderer||new gl,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new yl,this.slugger=new vl}static parse(e,t){return new bl(t).parse(e)}static parseInline(e,t){return new bl(t).parseInline(e)}parse(e,t=!0){let n,r,i,o,a,s,l,c,u,p,d,f,h,m,g,y,v,b,x,w="";const k=e.length;for(n=0;n<k;n++)if(p=e[n],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[p.type]&&(x=this.options.extensions.renderers[p.type].call({parser:this},p),!1!==x||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(p.type)))w+=x||"";else switch(p.type){case"space":continue;case"hr":w+=this.renderer.hr();continue;case"heading":w+=this.renderer.heading(this.parseInline(p.tokens),p.depth,Ys(this.parseInline(p.tokens,this.textRenderer)),this.slugger);continue;case"code":w+=this.renderer.code(p.text,p.lang,p.escaped);continue;case"table":for(c="",l="",o=p.header.length,r=0;r<o;r++)l+=this.renderer.tablecell(this.parseInline(p.header[r].tokens),{header:!0,align:p.align[r]});for(c+=this.renderer.tablerow(l),u="",o=p.rows.length,r=0;r<o;r++){for(s=p.rows[r],l="",a=s.length,i=0;i<a;i++)l+=this.renderer.tablecell(this.parseInline(s[i].tokens),{header:!1,align:p.align[i]});u+=this.renderer.tablerow(l)}w+=this.renderer.table(c,u);continue;case"blockquote":u=this.parse(p.tokens),w+=this.renderer.blockquote(u);continue;case"list":for(d=p.ordered,f=p.start,h=p.loose,o=p.items.length,u="",r=0;r<o;r++)g=p.items[r],y=g.checked,v=g.task,m="",g.task&&(b=this.renderer.checkbox(y),h?g.tokens.length>0&&"paragraph"===g.tokens[0].type?(g.tokens[0].text=b+" "+g.tokens[0].text,g.tokens[0].tokens&&g.tokens[0].tokens.length>0&&"text"===g.tokens[0].tokens[0].type&&(g.tokens[0].tokens[0].text=b+" "+g.tokens[0].tokens[0].text)):g.tokens.unshift({type:"text",text:b}):m+=b),m+=this.parse(g.tokens,h),u+=this.renderer.listitem(m,v,y);w+=this.renderer.list(u,d,f);continue;case"html":w+=this.renderer.html(p.text);continue;case"paragraph":w+=this.renderer.paragraph(this.parseInline(p.tokens));continue;case"text":for(u=p.tokens?this.parseInline(p.tokens):p.text;n+1<k&&"text"===e[n+1].type;)p=e[++n],u+="\n"+(p.tokens?this.parseInline(p.tokens):p.text);w+=t?this.renderer.paragraph(u):u;continue;default:{const e='Token with "'+p.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return w}parseInline(e,t){t=t||this.renderer;let n,r,i,o="";const a=e.length;for(n=0;n<a;n++)if(r=e[n],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[r.type]&&(i=this.options.extensions.renderers[r.type].call({parser:this},r),!1!==i||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(r.type)))o+=i||"";else switch(r.type){case"escape":case"text":o+=t.text(r.text);break;case"html":o+=t.html(r.text);break;case"link":o+=t.link(r.href,r.title,this.parseInline(r.tokens,t));break;case"image":o+=t.image(r.href,r.title,r.text);break;case"strong":o+=t.strong(this.parseInline(r.tokens,t));break;case"em":o+=t.em(this.parseInline(r.tokens,t));break;case"codespan":o+=t.codespan(r.text);break;case"br":o+=t.br();break;case"del":o+=t.del(this.parseInline(r.tokens,t));break;default:{const e='Token with "'+r.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return o}}function xl(e,t,n){if(null==e)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");if("function"==typeof t&&(n=t,t=null),sl(t=il({},xl.defaults,t||{})),n){const r=t.highlight;let i;try{i=ml.lex(e,t)}catch(e){return n(e)}const o=function(e){let o;if(!e)try{t.walkTokens&&xl.walkTokens(i,t.walkTokens),o=bl.parse(i,t)}catch(t){e=t}return t.highlight=r,e?n(e):n(null,o)};if(!r||r.length<3)return o();if(delete t.highlight,!i.length)return o();let a=0;return xl.walkTokens(i,(function(e){"code"===e.type&&(a++,setTimeout((()=>{r(e.text,e.lang,(function(t,n){if(t)return o(t);null!=n&&n!==e.text&&(e.text=n,e.escaped=!0),a--,0===a&&o()}))}),0))})),void(0===a&&o())}try{const n=ml.lex(e,t);return t.walkTokens&&xl.walkTokens(n,t.walkTokens),bl.parse(n,t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",t.silent)return"<p>An error occurred:</p><pre>"+Ws(e.message+"",!0)+"</pre>";throw e}}xl.options=xl.setOptions=function(e){var t;return il(xl.defaults,e),t=xl.defaults,Ms=t,xl},xl.getDefaults=function(){return{baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1}},xl.defaults=Ms,xl.use=function(...e){const t=il({},...e),n=xl.defaults.extensions||{renderers:{},childTokens:{}};let r;e.forEach((e=>{if(e.extensions&&(r=!0,e.extensions.forEach((e=>{if(!e.name)throw new Error("extension name required");if(e.renderer){const t=n.renderers?n.renderers[e.name]:null;n.renderers[e.name]=t?function(...n){let r=e.renderer.apply(this,n);return!1===r&&(r=t.apply(this,n)),r}:e.renderer}if(e.tokenizer){if(!e.level||"block"!==e.level&&"inline"!==e.level)throw new Error("extension level must be 'block' or 'inline'");n[e.level]?n[e.level].unshift(e.tokenizer):n[e.level]=[e.tokenizer],e.start&&("block"===e.level?n.startBlock?n.startBlock.push(e.start):n.startBlock=[e.start]:"inline"===e.level&&(n.startInline?n.startInline.push(e.start):n.startInline=[e.start]))}e.childTokens&&(n.childTokens[e.name]=e.childTokens)}))),e.renderer){const n=xl.defaults.renderer||new gl;for(const t in e.renderer){const r=n[t];n[t]=(...i)=>{let o=e.renderer[t].apply(n,i);return!1===o&&(o=r.apply(n,i)),o}}t.renderer=n}if(e.tokenizer){const n=xl.defaults.tokenizer||new ul;for(const t in e.tokenizer){const r=n[t];n[t]=(...i)=>{let o=e.tokenizer[t].apply(n,i);return!1===o&&(o=r.apply(n,i)),o}}t.tokenizer=n}if(e.walkTokens){const n=xl.defaults.walkTokens;t.walkTokens=function(t){e.walkTokens.call(this,t),n&&n.call(this,t)}}r&&(t.extensions=n),xl.setOptions(t)}))},xl.walkTokens=function(e,t){for(const n of e)switch(t.call(xl,n),n.type){case"table":for(const e of n.header)xl.walkTokens(e.tokens,t);for(const e of n.rows)for(const n of e)xl.walkTokens(n.tokens,t);break;case"list":xl.walkTokens(n.items,t);break;default:xl.defaults.extensions&&xl.defaults.extensions.childTokens&&xl.defaults.extensions.childTokens[n.type]?xl.defaults.extensions.childTokens[n.type].forEach((function(e){xl.walkTokens(n[e],t)})):n.tokens&&xl.walkTokens(n.tokens,t)}},xl.parseInline=function(e,t){if(null==e)throw new Error("marked.parseInline(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked.parseInline(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");sl(t=il({},xl.defaults,t||{}));try{const n=ml.lexInline(e,t);return t.walkTokens&&xl.walkTokens(n,t.walkTokens),bl.parseInline(n,t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",t.silent)return"<p>An error occurred:</p><pre>"+Ws(e.message+"",!0)+"</pre>";throw e}},xl.Parser=bl,xl.parser=bl.parse,xl.Renderer=gl,xl.TextRenderer=yl,xl.Lexer=ml,xl.lexer=ml.lex,xl.Tokenizer=ul,xl.Slugger=vl,xl.parse=xl,xl.options,xl.setOptions,xl.use,xl.walkTokens,xl.parseInline,bl.parse,ml.lex;var wl=Object.defineProperty,kl=Object.defineProperties,Ol=Object.getOwnPropertyDescriptors,Sl=Object.getOwnPropertySymbols,El=Object.prototype.hasOwnProperty,_l=Object.prototype.propertyIsEnumerable,Al=(e,t,n)=>t in e?wl(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,jl=(e,t)=>{for(var n in t||(t={}))El.call(t,n)&&Al(e,n,t[n]);if(Sl)for(var n of Sl(t))_l.call(t,n)&&Al(e,n,t[n]);return e},Cl=(e,t)=>kl(e,Ol(t));const Pl=new xl.Renderer;xl.setOptions({renderer:Pl,highlight:(e,t)=>vs(e,t)});const Tl="(?:^ {0,3}\x3c!-- ReDoc-Inject:\\s+?<({component}).*?/?>\\s+?--\x3e\\s*$|(?:^ {0,3}<({component})([\\s\\S]*?)>([\\s\\S]*?)</\\2>|^ {0,3}<({component})([\\s\\S]*?)(?:/>|\\n{2,})))";class Rl{constructor(e,t){this.options=e,this.parentId=t,this.headings=[],this.headingRule=(e,t,n,r)=>(1===t?this.currentTopHeading=this.saveHeading(e,t):2===t&&this.saveHeading(e,t,this.currentTopHeading&&this.currentTopHeading.items,this.currentTopHeading&&this.currentTopHeading.id),this.originalHeadingRule(e,t,n,r)),this.parentId=t,this.parser=new xl.Parser,this.headingEnhanceRenderer=new xl.Renderer,this.originalHeadingRule=this.headingEnhanceRenderer.heading.bind(this.headingEnhanceRenderer),this.headingEnhanceRenderer.heading=this.headingRule}static containsComponent(e,t){return new RegExp(Tl.replace(/{component}/g,t),"gmi").test(e)}static getTextBeforeHading(e,t){const n=e.search(new RegExp(`^##?\\s+${t}`,"m"));return n>-1?e.substring(0,n):e}saveHeading(e,t,n=this.headings,r){e=e.replace(/&#(\d+);/g,((e,t)=>String.fromCharCode(parseInt(t,10)))).replace(/&amp;/g,"&").replace(/&quot;/g,'"');const i={id:r?`${r}/${ai(e)}`:`${this.parentId||"section"}/${ai(e)}`,name:e,level:t,items:[]};return n.push(i),i}flattenHeadings(e){if(void 0===e)return[];const t=[];for(const n of e)t.push(n),t.push(...this.flattenHeadings(n.items));return t}attachHeadingsDescriptions(e){const t=e=>new RegExp(`##?\\s+${e.name.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}s*(\n|\r\n|$|s*)`),n=this.flattenHeadings(this.headings);if(n.length<1)return;let r=n[0],i=t(r),o=e.search(i);for(let a=1;a<n.length;a++){const s=n[a],l=t(s),c=e.substr(o+1).search(l)+o+1;r.description=e.substring(o,c).replace(i,"").trim(),r=s,i=l,o=c}r.description=e.substring(o).replace(i,"").trim()}renderMd(e,t=!1){const n=t?{renderer:this.headingEnhanceRenderer}:void 0;return xl(e.toString(),n)}extractHeadings(e){this.renderMd(e,!0),this.attachHeadingsDescriptions(e);const t=this.headings;return this.headings=[],t}renderMdWithComponents(e){const t=this.options&&this.options.allowedMdComponents;if(!t||0===Object.keys(t).length)return[this.renderMd(e)];const n=Object.keys(t).join("|"),r=new RegExp(Tl.replace(/{component}/g,n),"mig"),i=[],o=[];let a=r.exec(e),s=0;for(;a;){i.push(e.substring(s,a.index)),s=r.lastIndex;const n=t[a[1]||a[2]||a[5]],l=a[3]||a[6],c=a[4];n&&o.push({component:n.component,propsSelector:n.propsSelector,props:Cl(jl(jl({},Il(l)),n.props),{children:c})}),a=r.exec(e)}i.push(e.substring(s));const l=[];for(let e=0;e<i.length;e++){const t=i[e];t&&l.push(this.renderMd(t)),o[e]&&l.push(o[e])}return l}}function Il(e){if(!e)return{};const t=/([\w-]+)\s*=\s*(?:{([^}]+?)}|"([^"]+?)")/gim,n={};let r;for(;null!==(r=t.exec(e));)if(r[3])n[r[1]]=r[3];else if(r[2]){let e;try{e=JSON.parse(r[2])}catch(e){}n[r[1]]=e}return n}class $l{constructor(e,t=new Si({})){this.parser=e,this.options=t,Object.assign(this,e.spec.info),this.description=e.spec.info.description||"",this.summary=e.spec.info.summary||"";const n=this.description.search(/^\s*##?\s+/m);n>-1&&(this.description=this.description.substring(0,n)),this.downloadLink=this.getDownloadLink(),this.downloadFileName=this.getDownloadFileName()}getDownloadLink(){if(this.options.downloadDefinitionUrl)return this.options.downloadDefinitionUrl;if(this.parser.specUrl)return this.parser.specUrl;if(Qr&&window.Blob&&window.URL&&window.URL.createObjectURL){const e=new Blob([JSON.stringify(this.parser.spec,null,2)],{type:"application/json"});return window.URL.createObjectURL(e)}}getDownloadFileName(){return this.parser.specUrl||this.options.downloadDefinitionUrl?this.options.downloadFileName:this.options.downloadFileName||"openapi.json"}}var Nl=Object.defineProperty,Ll=Object.defineProperties,Dl=Object.getOwnPropertyDescriptors,Ml=Object.getOwnPropertySymbols,Fl=Object.prototype.hasOwnProperty,zl=Object.prototype.propertyIsEnumerable,Ul=(e,t,n)=>t in e?Nl(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;class Bl{constructor(e,t){const n=t.spec.components&&t.spec.components.securitySchemes||{};this.schemes=Object.keys(e||{}).map((r=>{const{resolved:i}=t.deref(n[r]),o=e[r]||[];if(!i)return void console.warn(`Non existing security scheme referenced: ${r}. Skipping`);const a=i["x-displayName"]||r;return((e,t)=>Ll(e,Dl(t)))(((e,t)=>{for(var n in t||(t={}))Fl.call(t,n)&&Ul(e,n,t[n]);if(Ml)for(var n of Ml(t))zl.call(t,n)&&Ul(e,n,t[n]);return e})({},i),{id:r,sectionId:r,displayName:a,scopes:o})})).filter((e=>void 0!==e))}}var ql=Object.defineProperty,Vl=Object.defineProperties,Wl=Object.getOwnPropertyDescriptor,Hl=Object.getOwnPropertyDescriptors,Yl=Object.getOwnPropertySymbols,Ql=Object.prototype.hasOwnProperty,Gl=Object.prototype.propertyIsEnumerable,Xl=(e,t,n)=>t in e?ql(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Kl=(e,t)=>{for(var n in t||(t={}))Ql.call(t,n)&&Xl(e,n,t[n]);if(Yl)for(var n of Yl(t))Gl.call(t,n)&&Xl(e,n,t[n]);return e},Zl=(e,t)=>Vl(e,Hl(t)),Jl=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?Wl(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&ql(t,n,o),o};class ec{constructor(e,t,n,r,i){this.expanded=!1,this.operations=[],nn(this),this.name=t;const{resolved:o}=e.deref(n);for(const n of Object.keys(o)){const a=o[n],s=Object.keys(a).filter(Xa);for(const o of s){const s=a[o],l=new Ou(e,Zl(Kl({},s),{pathName:n,pointer:Na.compile([r,t,n,o]),httpVerb:o,pathParameters:a.parameters||[],pathServers:a.servers}),void 0,i,!0);this.operations.push(l)}}}toggle(){this.expanded=!this.expanded}}Jl([Ce],ec.prototype,"expanded",2),Jl([jt],ec.prototype,"toggle",1);var tc=Object.defineProperty,nc=Object.defineProperties,rc=Object.getOwnPropertyDescriptors,ic=Object.getOwnPropertySymbols,oc=Object.prototype.hasOwnProperty,ac=Object.prototype.propertyIsEnumerable,sc=(e,t,n)=>t in e?tc(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,lc=(e,t)=>{for(var n in t||(t={}))oc.call(t,n)&&sc(e,n,t[n]);if(ic)for(var n of ic(t))ac.call(t,n)&&sc(e,n,t[n]);return e},cc=(e,t)=>nc(e,rc(t)),uc=(e,t)=>{var n={};for(var r in e)oc.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&ic)for(var r of ic(e))t.indexOf(r)<0&&ac.call(e,r)&&(n[r]=e[r]);return n};function pc(e,t){return t&&e[e.length-1]!==t?[...e,t]:e}function dc(e,t){return t?e.concat(t):e}class fc{constructor(e,t,n=new Si({})){this.options=n,this.allowMergeRefs=!1,this.byRef=e=>{let t;if(this.spec){"#"!==e.charAt(0)&&(e="#"+e),e=decodeURIComponent(e);try{t=Na.get(this.spec,e)}catch(e){}return t||{}}},this.validate(e),this.spec=e,this.allowMergeRefs=e.openapi.startsWith("3.1");const r=Qr?window.location.href:"";"string"==typeof t&&(this.specUrl=r?new URL(t,r).href:t)}validate(e){if(void 0===e.openapi)throw new Error("Document must be valid OpenAPI 3.0.0 definition")}isRef(e){return!!e&&void 0!==e.$ref&&null!==e.$ref}deref(e,t=[],n=!1){const r=null==e?void 0:e["x-refsStack"];if(t=dc(t,r),this.isRef(e)){const r=ss(e.$ref);if(r&&this.options.ignoreNamedSchemas.has(r))return{resolved:{type:"object",title:r},refsStack:t};let i=this.byRef(e.$ref);if(!i)throw new Error(`Failed to resolve $ref "${e.$ref}"`);let o=t;if(t.includes(e.$ref)||t.length>999)i=Object.assign({},i,{"x-circular-ref":!0});else if(this.isRef(i)){const e=this.deref(i,t,n);o=e.refsStack,i=e.resolved}return o=pc(t,e.$ref),i=this.allowMergeRefs?this.mergeRefs(e,i,n):i,{resolved:i,refsStack:o}}return{resolved:e,refsStack:dc(t,r)}}mergeRefs(e,t,n){const r=e,{$ref:i}=r,o=uc(r,["$ref"]),a=Object.keys(o);if(0===a.length)return t;if(n&&a.some((e=>!["description","title","externalDocs","x-refsStack","x-parentRefs","readOnly","writeOnly"].includes(e)))){const e=o,{description:n,title:r,readOnly:i,writeOnly:a}=e;return{allOf:[{description:n,title:r,readOnly:i,writeOnly:a},t,uc(e,["description","title","readOnly","writeOnly"])]}}return lc(lc({},t),o)}mergeAllOf(e,t,n){var r;if(e["x-circular-ref"])return e;if(void 0===(e=this.hoistOneOfs(e,n)).allOf)return e;let i=cc(lc({},e),{"x-parentRefs":[],allOf:void 0,title:e.title||ss(t)});void 0!==i.properties&&"object"==typeof i.properties&&(i.properties=lc({},i.properties)),void 0!==i.items&&"object"==typeof i.items&&(i.items=lc({},i.items));const o=function(e,t){const n=new Set;return e.filter((e=>{const t=e.$ref;return!t||t&&!n.has(t)&&n.add(t)}))}(e.allOf.map((e=>{var t;const{resolved:r,refsStack:o}=this.deref(e,n,!0),a=e.$ref||void 0,s=this.mergeAllOf(r,a,o);if(!s["x-circular-ref"]||!s.allOf)return a&&(null==(t=i["x-parentRefs"])||t.push(...s["x-parentRefs"]||[],a)),{$ref:a,refsStack:pc(o,a),schema:s}})).filter((e=>void 0!==e)));for(const{schema:e,refsStack:n}of o){const o=e,{type:a,enum:s,properties:l,items:c,required:u,title:p,description:d,readOnly:f,writeOnly:h,oneOf:m,anyOf:g,"x-circular-ref":y}=o,v=uc(o,["type","enum","properties","items","required","title","description","readOnly","writeOnly","oneOf","anyOf","x-circular-ref"]);if(i.type!==a&&void 0!==i.type&&void 0!==a&&console.warn(`Incompatible types in allOf at "${t}": "${i.type}" and "${a}"`),void 0!==a&&(Array.isArray(a)&&Array.isArray(i.type)?i.type=[...a,...i.type]:i.type=a),void 0!==s&&(Array.isArray(s)&&Array.isArray(i.enum)?i.enum=Array.from(new Set([...s,...i.enum])):i.enum=s),void 0!==l&&"object"==typeof l){i.properties=i.properties||{};for(const e in l){const o=dc(n,null==(r=l[e])?void 0:r["x-refsStack"]);if(i.properties[e]){if(!y){const n=this.mergeAllOf({allOf:[i.properties[e],cc(lc({},l[e]),{"x-refsStack":o})],"x-refsStack":o},t+"/properties/"+e,o);i.properties[e]=n}}else i.properties[e]=cc(lc({},l[e]),{"x-refsStack":o})}}if(void 0!==c&&!y){const r="boolean"==typeof i.items?{}:Object.assign({},i.items),o="boolean"==typeof e.items?{}:Object.assign({},e.items);i.items=this.mergeAllOf({allOf:[r,o]},t+"/items",n)}void 0!==m&&(i.oneOf=m),void 0!==g&&(i.anyOf=g),void 0!==u&&(i.required=[...i.required||[],...u]),i=lc(cc(lc({},i),{title:i.title||p,description:i.description||d,readOnly:void 0!==i.readOnly?i.readOnly:f,writeOnly:void 0!==i.writeOnly?i.writeOnly:h,"x-circular-ref":i["x-circular-ref"]||y}),v)}return i}findDerived(e){const t={},n=this.spec.components&&this.spec.components.schemas||{};for(const r in n){const{resolved:i}=this.deref(n[r]);void 0!==i.allOf&&i.allOf.find((t=>void 0!==t.$ref&&e.indexOf(t.$ref)>-1))&&(t["#/components/schemas/"+r]=[i["x-discriminator-value"]||r])}return t}hoistOneOfs(e,t){if(void 0===e.allOf)return e;const n=e.allOf;for(let e=0;e<n.length;e++){const r=n[e];if(Array.isArray(r.oneOf)){const i=n.slice(0,e),o=n.slice(e+1);return{oneOf:r.oneOf.map((e=>({allOf:[...i,e,...o],"x-refsStack":t})))}}}return e}}var hc=Object.defineProperty,mc=Object.defineProperties,gc=Object.getOwnPropertyDescriptor,yc=Object.getOwnPropertyDescriptors,vc=Object.getOwnPropertySymbols,bc=Object.prototype.hasOwnProperty,xc=Object.prototype.propertyIsEnumerable,wc=(e,t,n)=>t in e?hc(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,kc=(e,t)=>{for(var n in t||(t={}))bc.call(t,n)&&wc(e,n,t[n]);if(vc)for(var n of vc(t))xc.call(t,n)&&wc(e,n,t[n]);return e},Oc=(e,t)=>mc(e,yc(t)),Sc=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?gc(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&hc(t,n,o),o};const Ec=class{constructor(e,t,n,r,i=!1,o=[]){this.options=r,this.refsStack=o,this.typePrefix="",this.isCircular=!1,this.activeOneOf=0,nn(this),this.pointer=t.$ref||n||"";const{resolved:a,refsStack:s}=e.deref(t,o,!0);this.refsStack=pc(s,this.pointer),this.rawSchema=a,this.schema=e.mergeAllOf(this.rawSchema,this.pointer,this.refsStack),this.init(e,i),r.showExtensions&&(this.extensions=ms(this.schema,r.showExtensions))}activateOneOf(e){this.activeOneOf=e}hasType(e){return this.type===e||ci(this.type)&&this.type.includes(e)}init(e,t){var n,r,i,o,a,s,l,c;const u=this.schema;if(this.isCircular=!!u["x-circular-ref"],this.title=u.title||as(this.pointer)&&Na.baseName(this.pointer)||"",this.description=u.description||"",this.type=u.type||function(e){if(void 0!==e.type&&!ci(e.type))return e.type;const t=Object.keys(Ka);for(const n of t){const t=Ka[n];if(void 0!==e[n])return t}return"any"}(u),this.format=u.format,this.enum=u.enum||[],this.example=u.example,this.examples=u.examples,this.deprecated=!!u.deprecated,this.pattern=u.pattern,this.externalDocs=u.externalDocs,this.constraints=cs(u),this.displayFormat=this.format,this.isPrimitive=Za(u,this.type),this.default=u.default,this.readOnly=!!u.readOnly,this.writeOnly=!!u.writeOnly,this.const=u.const||"",this.contentEncoding=u.contentEncoding,this.contentMediaType=u.contentMediaType,this.minItems=u.minItems,this.maxItems=u.maxItems,(u.nullable||u["x-nullable"])&&(ci(this.type)&&!this.type.some((e=>null===e||"null"===e))?this.type=[...this.type,"null"]:ci(this.type)||null===this.type&&"null"===this.type||(this.type=[this.type,"null"])),this.displayType=ci(this.type)?this.type.map((e=>null===e?"null":e)).join(" or "):this.type,!this.isCircular)if(u.if&&u.then||u.if&&u.else)this.initConditionalOperators(u,e);else if(t||void 0===jc(u)){if(t&&ci(u.oneOf)&&u.oneOf.find((e=>e.$ref===this.pointer))&&delete u.oneOf,void 0!==u.oneOf)return this.initOneOf(u.oneOf,e),this.oneOfType="One of",void(void 0!==u.anyOf&&console.warn(`oneOf and anyOf are not supported on the same level. Skipping anyOf at ${this.pointer}`));if(void 0!==u.anyOf)return this.initOneOf(u.anyOf,e),void(this.oneOfType="Any of");if(this.hasType("object"))this.fields=Ac(e,u,this.pointer,this.options,this.refsStack);else if(this.hasType("array")&&(ci(u.items)||ci(u.prefixItems)?this.fields=Ac(e,u,this.pointer,this.options,this.refsStack):u.items&&(this.items=new Ec(e,u.items,this.pointer+"/items",this.options,!1,this.refsStack)),this.displayType=u.prefixItems||ci(u.items)?"items":((null==(n=this.items)?void 0:n.displayType)||this.displayType).split(" or ").map((e=>e.replace(/^(string|object|number|integer|array|boolean)s?( ?.*)/,"$1s$2"))).join(" or "),this.displayFormat=(null==(r=this.items)?void 0:r.format)||"",this.typePrefix=(null==(i=this.items)?void 0:i.typePrefix)||""+di("arrayOf"),this.title=this.title||(null==(o=this.items)?void 0:o.title)||"",this.isPrimitive=void 0!==(null==(a=this.items)?void 0:a.isPrimitive)?null==(s=this.items)?void 0:s.isPrimitive:this.isPrimitive,void 0===this.example&&void 0!==(null==(l=this.items)?void 0:l.example)&&(this.example=[this.items.example]),(null==(c=this.items)?void 0:c.isPrimitive)&&(this.enum=this.items.enum),ci(this.type))){const e=this.type.filter((e=>"array"!==e));e.length&&(this.displayType+=` or ${e.join(" or ")}`)}this.enum.length&&this.options.sortEnumValuesAlphabetically&&this.enum.sort()}else this.initDiscriminator(u,e)}initOneOf(e,t){if(this.oneOf=e.map(((e,n)=>{const{resolved:r,refsStack:i}=t.deref(e,this.refsStack,!0),o=t.mergeAllOf(r,this.pointer+"/oneOf/"+n,i),a=as(e.$ref)&&!o.title?Na.baseName(e.$ref):`${o.title||""}${void 0!==o.const&&JSON.stringify(o.const)||""}`;return new Ec(t,Oc(kc({},o),{title:a,allOf:[Oc(kc({},this.schema),{oneOf:void 0,anyOf:void 0})],discriminator:r.allOf?void 0:o.discriminator}),e.$ref||this.pointer+"/oneOf/"+n,this.options,!1,i)})),this.options.simpleOneOfTypeLabel){const e=function(e){const t=new Set;return function e(n){for(const r of n.oneOf||[])r.oneOf?e(r):r.type&&t.add(r.type)}(e),Array.from(t.values())}(this);this.displayType=e.join(" or ")}else this.displayType=this.oneOf.map((e=>{let t=e.typePrefix+(e.title?`${e.title} (${e.displayType})`:e.displayType);return t.indexOf(" or ")>-1&&(t=`(${t})`),t})).join(" or ")}initDiscriminator(e,t){const n=jc(e);this.discriminatorProp=n.propertyName;const r=t.findDerived([...this.schema["x-parentRefs"]||[],this.pointer]);if(e.oneOf)for(const t of e.oneOf){if(void 0===t.$ref)continue;const e=Na.baseName(t.$ref);r[t.$ref]=e}const i=n.mapping||{};let o=n["x-explicitMappingOnly"]||!1;0===Object.keys(i).length&&(o=!1);const a={};for(const e in i){const t=i[e];ci(a[t])?a[t].push(e):a[t]=[e]}const s=kc(o?{}:kc({},r),a);let l=[];for(const e of Object.keys(s)){const t=s[e];if(ci(t))for(const n of t)l.push({$ref:e,name:n});else l.push({$ref:e,name:t})}const c=Object.keys(i);0!==c.length&&(l=l.sort(((e,t)=>{const n=c.indexOf(e.name),r=c.indexOf(t.name);return n<0&&r<0?e.name.localeCompare(t.name):n<0?1:r<0?-1:n-r}))),this.oneOf=l.map((({$ref:e,name:n})=>{const r=new Ec(t,{$ref:e},e,this.options,!0,this.refsStack.slice(0,-1));return r.title=n,r}))}initConditionalOperators(e,t){const n=e,{if:r,else:i={},then:o={}}=n,a=((e,t)=>{var n={};for(var r in e)bc.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&vc)for(var r of vc(e))t.indexOf(r)<0&&xc.call(e,r)&&(n[r]=e[r]);return n})(n,["if","else","then"]),s=[{allOf:[a,o,r],title:r&&r["x-displayName"]||(null==r?void 0:r.title)||"case 1"},{allOf:[a,i],title:i&&i["x-displayName"]||(null==i?void 0:i.title)||"case 2"}];this.oneOf=s.map(((e,n)=>new Ec(t,kc({},e),this.pointer+"/oneOf/"+n,this.options,!1,this.refsStack))),this.oneOfType="One of"}};let _c=Ec;function Ac(e,t,n,r,i){const o=t.properties||t.prefixItems||t.items||{},a=t.patternProperties||{},s=t.additionalProperties||t.unevaluatedProperties,l=t.prefixItems?t.items:t.additionalItems,c=t.default;let u=Object.keys(o||[]).map((a=>{let s=o[a];s||(console.warn(`Field "${a}" is invalid, skipping.\n Field must be an object but got ${typeof s} at "${n}"`),s={});const l=void 0!==t.required&&t.required.indexOf(a)>-1;return new Nc(e,{name:t.properties?a:`[${a}]`,required:l,schema:Oc(kc({},s),{default:void 0===s.default&&c?c[a]:s.default})},n+"/properties/"+a,r,i)}));return r.sortPropsAlphabetically&&(u=ps(u,"name")),r.requiredPropsFirst&&(u=us(u,r.sortPropsAlphabetically?void 0:t.required)),u.push(...Object.keys(a).map((t=>{let o=a[t];return o||(console.warn(`Field "${t}" is invalid, skipping.\n Field must be an object but got ${typeof o} at "${n}"`),o={}),new Nc(e,{name:t,required:!1,schema:o,kind:"patternProperties"},`${n}/patternProperties/${t}`,r,i)}))),"object"!=typeof s&&!0!==s||u.push(new Nc(e,{name:("object"==typeof s&&s["x-additionalPropertiesName"]||"property name").concat("*"),required:!1,schema:!0===s?{}:s,kind:"additionalProperties"},n+"/additionalProperties",r,i)),u.push(...function({parser:e,schema:t=!1,fieldsCount:n,$ref:r,options:i,refsStack:o}){return ui(t)?t?[new Nc(e,{name:`[${n}...]`,schema:{}},`${r}/additionalItems`,i,o)]:[]:ci(t)?[...t.map(((t,a)=>new Nc(e,{name:`[${n+a}]`,schema:t},`${r}/additionalItems`,i,o)))]:ii(t)?[new Nc(e,{name:`[${n}...]`,schema:t},`${r}/additionalItems`,i,o)]:[]}({parser:e,schema:l,fieldsCount:u.length,$ref:n,options:r,refsStack:i})),u}function jc(e){return e.discriminator||e["x-discriminator"]}Sc([Ce],_c.prototype,"activeOneOf",2),Sc([jt],_c.prototype,"activateOneOf",1);const Cc={};class Pc{constructor(e,t,n,r){this.mime=n;const{resolved:i}=e.deref(t);this.value=i.value,this.summary=i.summary,this.description=i.description,i.externalValue&&(this.externalValueUrl=new URL(i.externalValue,e.specUrl).href),"application/x-www-form-urlencoded"===n&&this.value&&"object"==typeof this.value&&(this.value=function(e,t={}){if(ci(e))throw new Error("Payload must have fields: "+e.toString());return Object.keys(e).map((n=>{const r=e[n],{style:i="form",explode:o=!0}=t[n]||{};switch(i){case"form":return ns(n,o,r);case"spaceDelimited":return es(r,n,"%20");case"pipeDelimited":return es(r,n,"|");case"deepObject":return ts(r,n);default:return console.warn("Incorrect or unsupported encoding style: "+i),""}})).join("&")}(this.value,r))}getExternalValue(e){return this.externalValueUrl?(this.externalValueUrl in Cc||(Cc[this.externalValueUrl]=fetch(this.externalValueUrl).then((t=>t.text().then((n=>{if(!t.ok)return Promise.reject(new Error(n));if(!Ja(e))return n;try{return JSON.parse(n)}catch(e){return n}}))))),Cc[this.externalValueUrl]):Promise.resolve(void 0)}}var Tc=Object.defineProperty,Rc=Object.getOwnPropertyDescriptor,Ic=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?Rc(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&Tc(t,n,o),o};const $c={path:{style:"simple",explode:!1},query:{style:"form",explode:!0},header:{style:"simple",explode:!1},cookie:{style:"form",explode:!0}};class Nc{constructor(e,t,n,r,i){var o,a,s,l,c;this.expanded=void 0,nn(this);const{resolved:u}=e.deref(t);this.kind=t.kind||"field",this.name=t.name||u.name,this.in=u.in,this.required=!!u.required;let p=u.schema,d="";if(!p&&u.in&&u.content&&(d=Object.keys(u.content)[0],p=u.content[d]&&u.content[d].schema),this.schema=new _c(e,p||{},n,r,!1,i),this.description=void 0===u.description?this.schema.description||"":u.description,this.example=u.example||this.schema.example,void 0!==u.examples||void 0!==this.schema.examples){const t=u.examples||this.schema.examples;this.examples=ci(t)?t:ei(t,((t,n)=>new Pc(e,t,n,u.encoding)))}d?this.serializationMime=d:u.style?this.style=u.style:this.in&&(this.style=null!=(a=null==(o=$c[this.in])?void 0:o.style)?a:"form"),void 0===u.explode&&this.in?this.explode=null==(l=null==(s=$c[this.in])?void 0:s.explode)||l:this.explode=!!u.explode,this.deprecated=void 0===u.deprecated?!!this.schema.deprecated:u.deprecated,r.showExtensions&&(this.extensions=ms(u,r.showExtensions)),this.const=(null==(c=this.schema)?void 0:c.const)||(null==u?void 0:u.const)||""}toggle(){this.expanded=!this.expanded}collapse(){this.expanded=!1}expand(){this.expanded=!0}}function Lc(e){return e<10?"0"+e:e}function Dc(e,t){return t>e.length?e.repeat(Math.trunc(t/e.length)+1).substring(0,t):e}function Mc(...e){const t=e=>e&&"object"==typeof e;return e.reduce(((e,n)=>(Object.keys(n||{}).forEach((r=>{const i=e[r],o=n[r];t(i)&&t(o)?e[r]=Mc(i,o):e[r]=o})),e)),Array.isArray(e[e.length-1])?[]:{})}function Fc(e){return{value:"object"===e?{}:"array"===e?[]:void 0}}function zc(e,t){t&&e.pop()}Ic([Ce],Nc.prototype,"expanded",2),Ic([jt],Nc.prototype,"toggle",1),Ic([jt],Nc.prototype,"collapse",1),Ic([jt],Nc.prototype,"expand",1);const Uc={multipleOf:"number",maximum:"number",exclusiveMaximum:"number",minimum:"number",exclusiveMinimum:"number",maxLength:"string",minLength:"string",pattern:"string",items:"array",maxItems:"array",minItems:"array",uniqueItems:"array",additionalItems:"array",maxProperties:"object",minProperties:"object",required:"object",additionalProperties:"object",properties:"object",patternProperties:"object",dependencies:"object"};function Bc(e){if(void 0!==e.type)return Array.isArray(e.type)?0===e.type.length?null:e.type[0]:e.type;const t=Object.keys(Uc);for(var n=0;n<t.length;n++){let r=t[n],i=Uc[r];if(void 0!==e[r])return i}return null}let qc={},Vc=[];function Wc(e){let t;return void 0!==e.const?t=e.const:void 0!==e.examples&&e.examples.length?t=e.examples[0]:void 0!==e.enum&&e.enum.length?t=e.enum[0]:void 0!==e.default&&(t=e.default),t}function Hc(e){const t=Wc(e);if(void 0!==t)return{value:t,readOnly:e.readOnly,writeOnly:e.writeOnly,type:null}}function Yc(e,t,n,r){if(r){if(Vc.includes(e))return Fc(Bc(e));Vc.push(e)}if(r&&r.depth>t.maxSampleDepth)return zc(Vc,r),Fc(Bc(e));if(e.$ref){if(!n)throw new Error("Your schema contains $ref. You must provide full specification in the third parameter.");let i=decodeURIComponent(e.$ref);i.startsWith("#")&&(i=i.substring(1));const o=Ia().get(n,i);let a;return!0!==qc[i]?(qc[i]=!0,a=Yc(o,t,n,r),qc[i]=!1):a=Fc(Bc(o)),zc(Vc,r),a}if(void 0!==e.example)return zc(Vc,r),{value:e.example,readOnly:e.readOnly,writeOnly:e.writeOnly,type:e.type};if(void 0!==e.allOf)return zc(Vc,r),Hc(e)||function(e,t,n,r,i){let o=Yc(e,n,r);const a=[];for(let e of t){const{type:t,readOnly:s,writeOnly:l,value:c}=Yc({type:o.type,...e},n,r,i);o.type&&t&&t!==o.type&&(console.warn("allOf: schemas with different types can't be merged"),o.type=t),o.type=o.type||t,o.readOnly=o.readOnly||s,o.writeOnly=o.writeOnly||l,null!=c&&a.push(c)}if("object"===o.type)return o.value=Mc(o.value||{},...a.filter((e=>"object"==typeof e))),o;{"array"===o.type&&(n.quiet||console.warn('OpenAPI Sampler: found allOf with "array" type. Result may be incorrect'));const e=a[a.length-1];return o.value=null!=e?e:o.value,o}}({...e,allOf:void 0},e.allOf,t,n,r);if(e.oneOf&&e.oneOf.length)return e.anyOf&&(t.quiet||console.warn("oneOf and anyOf are not supported on the same level. Skipping anyOf")),zc(Vc,r),a(e,Object.assign({readOnly:e.readOnly,writeOnly:e.writeOnly},e.oneOf[0]));if(e.anyOf&&e.anyOf.length)return zc(Vc,r),a(e,Object.assign({readOnly:e.readOnly,writeOnly:e.writeOnly},e.anyOf[0]));if(e.if&&e.then){zc(Vc,r);const{if:i,then:o,...a}=e;return Yc(Mc(a,i,o),t,n,r)}let i=Wc(e),o=null;if(void 0===i){i=null,o=e.type,Array.isArray(o)&&e.type.length>0&&(o=e.type[0]),o||(o=Bc(e));let a=Zc[o];a&&(i=a(e,t,n,r))}return zc(Vc,r),{value:i,readOnly:e.readOnly,writeOnly:e.writeOnly,type:o};function a(e,i){const o=Hc(e);if(void 0!==o)return o;const a=Yc({...e,oneOf:void 0,anyOf:void 0},t,n,r),s=Yc(i,t,n,r);if("object"==typeof a.value&&"object"==typeof s.value){const e=Mc(a.value,s.value);return{...s,value:e}}return s}}function Qc(e){let t=0;if("boolean"==typeof e.exclusiveMinimum||"boolean"==typeof e.exclusiveMaximum){if(e.maximum&&e.minimum)return t=e.exclusiveMinimum?Math.floor(e.minimum)+1:e.minimum,(e.exclusiveMaximum&&t>=e.maximum||!e.exclusiveMaximum&&t>e.maximum)&&(t=(e.maximum+e.minimum)/2),t;if(e.minimum)return e.exclusiveMinimum?Math.floor(e.minimum)+1:e.minimum;if(e.maximum)return e.exclusiveMaximum?e.maximum>0?0:Math.floor(e.maximum)-1:e.maximum>0?0:e.maximum}else{if(e.minimum)return e.minimum;e.exclusiveMinimum?(t=Math.floor(e.exclusiveMinimum)+1,t===e.exclusiveMaximum&&(t=(t+Math.floor(e.exclusiveMaximum)-1)/2)):e.exclusiveMaximum?t=Math.floor(e.exclusiveMaximum)-1:e.maximum&&(t=e.maximum)}return t}function Gc({min:e,max:t,omitTime:n,omitDate:r}){let i=function(e,t,n,r){var i=n?"":e.getUTCFullYear()+"-"+Lc(e.getUTCMonth()+1)+"-"+Lc(e.getUTCDate());return t||(i+="T"+Lc(e.getUTCHours())+":"+Lc(e.getUTCMinutes())+":"+Lc(e.getUTCSeconds())+"Z"),i}(new Date("2019-08-24T14:15:22.123Z"),n,r);return i.length<e&&console.warn(`Using minLength = ${e} is incorrect with format "date-time"`),t&&i.length>t&&console.warn(`Using maxLength = ${t} is incorrect with format "date-time"`),i}function Xc(e,t){let n=Dc("string",e);return t&&n.length>t&&(n=n.substring(0,t)),n}const Kc={email:function(){return"user@example.com"},"idn-email":function(){return"пошта@укр.нет"},password:function(e,t){let n="pa$$word";return e>n.length&&(n+="_",n+=Dc("qwerty!@#$%^123456",e-n.length).substring(0,e-n.length)),n},"date-time":function(e,t){return Gc({min:e,max:t,omitTime:!1,omitDate:!1})},date:function(e,t){return Gc({min:e,max:t,omitTime:!0,omitDate:!1})},time:function(e,t){return Gc({min:e,max:t,omitTime:!1,omitDate:!0}).slice(1)},ipv4:function(){return"192.168.0.1"},ipv6:function(){return"2001:0db8:85a3:0000:0000:8a2e:0370:7334"},hostname:function(){return"example.com"},"idn-hostname":function(){return"приклад.укр"},iri:function(){return"http://example.com/entity/1"},"iri-reference":function(){return"/entity/1"},uri:function(){return"http://example.com"},"uri-reference":function(){return"../dictionary"},"uri-template":function(){return"http://example.com/{endpoint}"},uuid:function(e,t,n){return r=function(e){var t=0;if(0==e.length)return t;for(var n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t&=t;return t}(n||"id"),i=function(e,t,n,r){return function(){var i=(e|=0)-((t|=0)<<27|t>>>5)|0;return e=t^((n|=0)<<17|n>>>15),t=n+(r|=0)|0,n=r+i|0,((r=e+i|0)>>>0)/4294967296}}(r,r,r,r),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(e=>{var t=16*i()%16|0;return("x"==e?t:3&t|8).toString(16)}));var r,i},default:Xc,"json-pointer":function(){return"/json/pointer"},"relative-json-pointer":function(){return"1/relative/json/pointer"},regex:function(){return"/regex/"}};var Zc={};const Jc={skipReadOnly:!1,maxSampleDepth:15};function eu(e,t,n){let r=Object.assign({},Jc,t);return qc={},Vc=[],Yc(e,r,n).value}function tu(e,t){Zc[e]=t}tu("array",(function(e,t={},n,r){const i=r&&r.depth||1;let o=Math.min(null!=e.maxItems?e.maxItems:1/0,e.minItems||1);const a=e.prefixItems||e.items||e.contains;Array.isArray(a)&&(o=Math.max(o,a.length));let s=[];if(!a)return s;for(let e=0;e<o;e++){let r=(l=e,Array.isArray(a)?a[l]||{}:a||{}),{value:o}=Yc(r,t,n,{depth:i+1});s.push(o)}var l;return s})),tu("boolean",(function(e){return!0})),tu("integer",Qc),tu("number",Qc),tu("object",(function(e,t={},n,r){let i={};const o=r&&r.depth||1;if(e&&"object"==typeof e.properties){let r=(Array.isArray(e.required)?e.required:[]).reduce(((e,t)=>(e[t]=!0,e)),{});Object.keys(e.properties).forEach((a=>{if(t.skipNonRequired&&!r.hasOwnProperty(a))return;const s=Yc(e.properties[a],t,n,{propertyName:a,depth:o+1});t.skipReadOnly&&s.readOnly||t.skipWriteOnly&&s.writeOnly||(i[a]=s.value)}))}if(e&&"object"==typeof e.additionalProperties){const r=e.additionalProperties["x-additionalPropertiesName"]||"property";i[`${String(r)}1`]=Yc(e.additionalProperties,t,n,{depth:o+1}).value,i[`${String(r)}2`]=Yc(e.additionalProperties,t,n,{depth:o+1}).value}return i})),tu("string",(function(e,t,n,r){let i=e.format||"default",o=Kc[i]||Xc,a=r&&r.propertyName;return o(0|e.minLength,e.maxLength,a)}));class nu{constructor(e,t,n,r,i){this.name=t,this.isRequestType=n,this.schema=r.schema&&new _c(e,r.schema,"",i),this.onlyRequiredInSamples=i.onlyRequiredInSamples,this.generatedPayloadSamplesMaxDepth=i.generatedPayloadSamplesMaxDepth,void 0!==r.examples?this.examples=ei(r.examples,(n=>new Pc(e,n,t,r.encoding))):void 0!==r.example?this.examples={default:new Pc(e,{value:e.deref(r.example).resolved},t,r.encoding)}:Ja(t)&&this.generateExample(e,r)}generateExample(e,t){const n={skipReadOnly:this.isRequestType,skipWriteOnly:!this.isRequestType,skipNonRequired:this.isRequestType&&this.onlyRequiredInSamples,maxSampleDepth:this.generatedPayloadSamplesMaxDepth};if(this.schema&&this.schema.oneOf){this.examples={};for(const r of this.schema.oneOf){const i=eu(r.rawSchema,n,e.spec);this.schema.discriminatorProp&&"object"==typeof i&&i&&(i[this.schema.discriminatorProp]=r.title),this.examples[r.title]=new Pc(e,{value:i},this.name,t.encoding)}}else this.schema&&(this.examples={default:new Pc(e,{value:eu(t.schema,n,e.spec)},this.name,t.encoding)})}}var ru=Object.defineProperty,iu=Object.getOwnPropertyDescriptor,ou=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?iu(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&ru(t,n,o),o};class au{constructor(e,t,n,r){this.isRequestType=n,this.activeMimeIdx=0,nn(this),r.unstable_ignoreMimeParameters&&(t=function(e){const t={};return Object.keys(e).forEach((n=>{const r=e[n],i=n.split(";")[0].trim();t[i]?t[i]=Wa(Wa({},t[i]),r):t[i]=r})),t}(t)),this.mediaTypes=Object.keys(t).map((i=>{const o=t[i];return new nu(e,i,n,o,r)}))}activate(e){this.activeMimeIdx=e}get active(){return this.mediaTypes[this.activeMimeIdx]}get hasSample(){return this.mediaTypes.filter((e=>!!e.examples)).length>0}}ou([Ce],au.prototype,"activeMimeIdx",2),ou([jt],au.prototype,"activate",1),ou([Ie],au.prototype,"active",1);class su{constructor({parser:e,infoOrRef:t,options:n,isEvent:r}){const i=!r,{resolved:o}=e.deref(t);this.description=o.description||"",this.required=o.required;const a=function(e){let t=e.content;const n=e["x-examples"],r=e["x-example"];if(n){t=Wa({},t);for(const e of Object.keys(n)){const r=n[e];t[e]=Ha(Wa({},t[e]),{examples:r})}}else if(r){t=Wa({},t);for(const e of Object.keys(r)){const n=r[e];t[e]=Ha(Wa({},t[e]),{example:n})}}return t}(o);void 0!==a&&(this.content=new au(e,a,i,n))}}var lu=Object.defineProperty,cu=Object.defineProperties,uu=Object.getOwnPropertyDescriptor,pu=Object.getOwnPropertyDescriptors,du=Object.getOwnPropertySymbols,fu=Object.prototype.hasOwnProperty,hu=Object.prototype.propertyIsEnumerable,mu=(e,t,n)=>t in e?lu(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,gu=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?uu(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&lu(t,n,o),o};class yu{constructor({parser:e,code:t,defaultAsError:n,infoOrRef:r,options:i,isEvent:o}){this.expanded=!1,this.headers=[],nn(this),this.expanded="all"===i.expandResponses||i.expandResponses[t];const{resolved:a}=e.deref(r);this.code=t,void 0!==a.content&&(this.content=new au(e,a.content,o,i)),void 0!==a["x-summary"]?(this.summary=a["x-summary"],this.description=a.description||""):(this.summary=a.description||"",this.description=""),this.type=Qa(t,n);const s=a.headers;void 0!==s&&(this.headers=Object.keys(s).map((t=>{const n=s[t];return new Nc(e,((e,t)=>cu(e,pu(t)))(((e,t)=>{for(var n in t||(t={}))fu.call(t,n)&&mu(e,n,t[n]);if(du)for(var n of du(t))hu.call(t,n)&&mu(e,n,t[n]);return e})({},n),{name:t}),"",i)}))),i.showExtensions&&(this.extensions=ms(a,i.showExtensions))}toggle(){this.expanded=!this.expanded}}gu([Ce],yu.prototype,"expanded",2),gu([jt],yu.prototype,"toggle",1);var vu=Object.defineProperty,bu=Object.getOwnPropertyDescriptor,xu=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?bu(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&vu(t,n,o),o};function wu(e){return"payload"===e.lang&&e.requestBodyContent}let ku=!1;class Ou{constructor(e,t,n,r,i=!1){var o;this.parser=e,this.operationSpec=t,this.options=r,this.type="operation",this.items=[],this.ready=!0,this.active=!1,this.expanded=!1,nn(this),this.pointer=t.pointer,this.description=t.description,this.parent=n,this.externalDocs=t.externalDocs,this.deprecated=!!t.deprecated,this.httpVerb=t.httpVerb,this.deprecated=!!t.deprecated,this.operationId=t.operationId,this.path=t.pathName,this.isCallback=i,this.isWebhook=t.isWebhook,this.isEvent=this.isCallback||this.isWebhook,this.name=(o=t).summary||o.operationId||o.description&&o.description.substring(0,50)||o.pathName||"<no summary>",this.sidebarLabel=r.sideNavStyle===fi.IdOnly?this.operationId||this.path:r.sideNavStyle===fi.PathOnly?this.path:this.name,this.isCallback?(this.security=(t.security||[]).map((t=>new Bl(t,e))),this.servers=ds("",t.servers||t.pathServers||[])):(this.operationHash=t.operationId&&"operation/"+t.operationId,this.id=void 0!==t.operationId?(n?n.id+"/":"")+this.operationHash:void 0!==n?n.id+this.pointer:this.pointer,this.security=(t.security||e.spec.security||[]).map((t=>new Bl(t,e))),this.servers=ds(e.specUrl,t.servers||t.pathServers||e.spec.servers||[])),r.showExtensions&&(this.extensions=ms(t,r.showExtensions))}activate(){this.active=!0}deactivate(){this.active=!1}toggle(){this.expanded=!this.expanded}expand(){this.parent&&this.parent.expand()}collapse(){}get requestBody(){return this.operationSpec.requestBody&&new su({parser:this.parser,infoOrRef:this.operationSpec.requestBody,options:this.options,isEvent:this.isEvent})}get codeSamples(){const{payloadSampleIdx:e,hideRequestPayloadSample:t}=this.options;let n=this.operationSpec["x-codeSamples"]||this.operationSpec["x-code-samples"]||[];this.operationSpec["x-code-samples"]&&!ku&&(ku=!0,console.warn('"x-code-samples" is deprecated. Use "x-codeSamples" instead'));const r=this.requestBody&&this.requestBody.content;if(r&&r.hasSample&&!t){const t=Math.min(n.length,e);n=[...n.slice(0,t),{lang:"payload",label:"Payload",source:"",requestBodyContent:r},...n.slice(t)]}return n}get parameters(){const e=function(e,t=[],n=[]){const r={};return n.forEach((t=>{({resolved:t}=e.deref(t)),r[t.name+"_"+t.in]=!0})),(t=t.filter((t=>(({resolved:t}=e.deref(t)),!r[t.name+"_"+t.in])))).concat(n)}(this.parser,this.operationSpec.pathParameters,this.operationSpec.parameters).map((e=>new Nc(this.parser,e,this.pointer,this.options)));return this.options.sortPropsAlphabetically?ps(e,"name"):this.options.requiredPropsFirst?us(e):e}get responses(){let e=!1;return Object.keys(this.operationSpec.responses||[]).filter((t=>{return"default"===t||("success"===Qa(t)&&(e=!0),"default"===(n=t)||ni(n)||Ya(n));var n})).map((t=>new yu({parser:this.parser,code:t,defaultAsError:e,infoOrRef:this.operationSpec.responses[t],options:this.options,isEvent:this.isEvent})))}get callbacks(){return Object.keys(this.operationSpec.callbacks||[]).map((e=>new ec(this.parser,e,this.operationSpec.callbacks[e],this.pointer,this.options)))}}xu([Ce],Ou.prototype,"ready",2),xu([Ce],Ou.prototype,"active",2),xu([Ce],Ou.prototype,"expanded",2),xu([jt],Ou.prototype,"activate",1),xu([jt],Ou.prototype,"deactivate",1),xu([jt],Ou.prototype,"toggle",1),xu([Cs],Ou.prototype,"requestBody",1),xu([Cs],Ou.prototype,"codeSamples",1),xu([Cs],Ou.prototype,"parameters",1),xu([Cs],Ou.prototype,"responses",1),xu([Cs],Ou.prototype,"callbacks",1);const Su=ha.div`
  width: calc(100% - ${e=>e.theme.rightPanel.width});
  padding: 0 ${e=>e.theme.spacing.sectionHorizontal}px;

  ${({$compact:e,theme:t})=>fa.lessThan("medium",!0)`
    width: 100%;
    padding: ${`${e?0:t.spacing.sectionVertical}px ${t.spacing.sectionHorizontal}px`};
  `};
`,Eu=ha.div.attrs((e=>({[vf]:e.id})))`
  padding: ${e=>e.theme.spacing.sectionVertical}px 0;

  &:last-child {
    min-height: calc(100vh + 1px);
  }

  & > &:last-child {
    min-height: initial;
  }

  ${fa.lessThan("medium",!0)`
    padding: 0;
  `}
  ${({$underlined:e})=>e?"\n    position: relative;\n\n    &:not(:last-of-type):after {\n      position: absolute;\n      bottom: 0;\n      width: 100%;\n      display: block;\n      content: '';\n      border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n    }\n  ":""}
`,_u=ha.div`
  width: ${e=>e.theme.rightPanel.width};
  color: ${({theme:e})=>e.rightPanel.textColor};
  background-color: ${e=>e.theme.rightPanel.backgroundColor};
  padding: 0 ${e=>e.theme.spacing.sectionHorizontal}px;

  ${fa.lessThan("medium",!0)`
    width: 100%;
    padding: ${e=>`${e.theme.spacing.sectionVertical}px ${e.theme.spacing.sectionHorizontal}px`};
  `};
`,Au=ha(_u)`
  background-color: ${e=>e.theme.rightPanel.backgroundColor};
`,ju=ha.div`
  display: flex;
  width: 100%;
  padding: 0;

  ${fa.lessThan("medium",!0)`
    flex-direction: column;
  `};
`,Cu={1:"1.85714em",2:"1.57143em",3:"1.27em"},Pu=e=>ca`
  font-family: ${({theme:e})=>e.typography.headings.fontFamily};
  font-weight: ${({theme:e})=>e.typography.headings.fontWeight};
  font-size: ${Cu[e]};
  line-height: ${({theme:e})=>e.typography.headings.lineHeight};
`,Tu=ha.h1`
  ${Pu(1)};
  color: ${({theme:e})=>e.colors.text.primary};

  ${ma("H1")};
`,Ru=ha.h2`
  ${Pu(2)};
  color: ${({theme:e})=>e.colors.text.primary};
  margin: 0 0 20px;

  ${ma("H2")};
`,Iu=(ha.h2`
  ${Pu(3)};
  color: ${({theme:e})=>e.colors.text.primary};

  ${ma("H3")};
`,ha.h3`
  color: ${({theme:e})=>e.rightPanel.textColor};

  ${ma("RightPanelHeader")};
`),$u=ha.h5`
  border-bottom: 1px solid rgba(38, 50, 56, 0.3);
  margin: 1em 0 1em 0;
  color: rgba(38, 50, 56, 0.5);
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.929em;
  line-height: 20px;

  ${ma("UnderlinedHeader")};
`,Nu=(0,n.createContext)(void 0),{Provider:Lu,Consumer:Du}=Nu;function Mu(e){const{spec:t,specUrl:i,options:o,onLoaded:a,children:s}=e,[l,c]=n.useState(null),[u,p]=n.useState(null);if(u)throw u;n.useEffect((()=>{!function(){return e=this,null,n=function*(){if(t||i){c(null);try{const e=yield function(e){return Ca(this,null,(function*(){const t=new Aa.Config({}),n={config:t,base:Qr?window.location.href:process.cwd()};Qr&&(t.resolve.http.customFetch=r.g.fetch),"object"==typeof e&&null!==e?n.doc={source:{absoluteRef:""},parsed:e}:n.ref=e;const{bundle:{parsed:i}}=yield(0,_a.bundle)(n);return void 0!==i.swagger?(o=i,console.warn("[ReDoc Compatibility mode]: Converting OpenAPI 2.0 to OpenAPI 3.0"),new Promise(((e,t)=>(0,ja.convertObj)(o,{patch:!0,warnOnly:!0,text:"{}",anchors:!0},((n,r)=>{if(n)return t(n);e(r&&r.openapi)}))))):i;var o}))}(t||i);c(e)}catch(e){throw a&&a(e),p(e),e}}},new Promise(((t,r)=>{var i=e=>{try{a(n.next(e))}catch(e){r(e)}},o=e=>{try{a(n.throw(e))}catch(e){r(e)}},a=e=>e.done?t(e.value):Promise.resolve(e.value).then(i,o);a((n=n.apply(e,null)).next())}));var e,n}()}),[t,i]);const d=n.useMemo((()=>{if(!l)return null;try{return new uy(l,i,o)}catch(e){throw a&&a(e),e}}),[l,i,o]);return n.useEffect((()=>{d&&a&&a()}),[d,a]),s({loading:!d,store:d})}const Fu=e=>ca`
  ${e} {
    cursor: pointer;
    margin-left: -20px;
    padding: 0;
    line-height: 1;
    width: 20px;
    display: inline-block;
    outline: 0;
  }
  ${e}:before {
    content: '';
    width: 15px;
    height: 15px;
    background-size: contain;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==');
    opacity: 0.5;
    visibility: hidden;
    display: inline-block;
    vertical-align: middle;
  }

  h1:hover > ${e}::before, h2:hover > ${e}::before, ${e}:hover::before {
    visibility: visible;
  }
`,zu=ha((function(e){const t=n.useContext(Nu),r=n.useCallback((n=>{t&&function(e,t,n){t.defaultPrevented||0!==t.button||(e=>!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey))(t)||(t.preventDefault(),e.replace(encodeURI(n)))}(t.menu.history,n,e.to)}),[t,e.to]);return t?n.createElement("a",{className:e.className,href:t.menu.history.linkForId(e.to),onClick:r,"aria-label":e.to},e.children):null}))`
  ${Fu("&")};
`;function Uu(e){return n.createElement(zu,{to:e.to})}const Bu={left:"90deg",right:"-90deg",up:"-180deg",down:"0"},qu=ha((e=>n.createElement("svg",{className:e.className,style:e.style,version:"1.1",viewBox:"0 0 24 24",x:"0",xmlns:"http://www.w3.org/2000/svg",y:"0","aria-hidden":"true"},n.createElement("polygon",{points:"17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "}))))`
  height: ${e=>e.size||"18px"};
  width: ${e=>e.size||"18px"};
  min-width: ${e=>e.size||"18px"};
  vertical-align: middle;
  float: ${e=>e.float||""};
  transition: transform 0.2s ease-out;
  transform: rotateZ(${e=>Bu[e.direction||"down"]});

  polygon {
    fill: ${({color:e,theme:t})=>e&&t.colors.responses[e]&&t.colors.responses[e].color||e};
  }
`,Vu=ha.span`
  display: inline-block;
  padding: 2px 8px;
  margin: 0;
  background-color: ${e=>e.theme.colors[e.type].main};
  color: ${e=>e.theme.colors[e.type].contrastText};
  font-size: ${e=>e.theme.typography.code.fontSize};
  vertical-align: middle;
  line-height: 1.6;
  border-radius: 4px;
  font-weight: ${({theme:e})=>e.typography.fontWeightBold};
  font-size: 12px;
  + span[type] {
    margin-left: 4px;
  }
`,Wu=ca`
  text-decoration: line-through;
  color: #707070;
`,Hu=ha.caption`
  text-align: right;
  font-size: 0.9em;
  font-weight: normal;
  color: ${e=>e.theme.colors.text.secondary};
`,Yu=ha.td`
  border-left: 1px solid ${e=>e.theme.schema.linesColor};
  box-sizing: border-box;
  position: relative;
  padding: 10px 10px 10px 0;

  ${fa.lessThan("small")`
    display: block;
    overflow: hidden;
  `}

  tr:first-of-type > &,
  tr.last > & {
    border-left-width: 0;
    background-position: top left;
    background-repeat: no-repeat;
    background-size: 1px 100%;
  }

  tr:first-of-type > & {
    background-image: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 22px,
      ${e=>e.theme.schema.linesColor} 22px,
      ${e=>e.theme.schema.linesColor} 100%
    );
  }

  tr.last > & {
    background-image: linear-gradient(
      to bottom,
      ${e=>e.theme.schema.linesColor} 0%,
      ${e=>e.theme.schema.linesColor} 22px,
      transparent 22px,
      transparent 100%
    );
  }

  tr.last + tr > & {
    border-left-color: transparent;
  }

  tr.last:first-child > & {
    background: none;
    border-left-color: transparent;
  }
`,Qu=ha(Yu)`
  padding: 0;
`,Gu=ha(Yu)`
  vertical-align: top;
  line-height: 20px;
  white-space: nowrap;
  font-size: 13px;
  font-family: ${e=>e.theme.typography.code.fontFamily};

  &.deprecated {
    ${Wu};
  }

  ${({kind:e})=>"patternProperties"===e&&ca`
      > span.property-name {
        display: inline-table;
        white-space: break-spaces;
        margin-right: 20px;

        ::before,
        ::after {
          content: '/';
          filter: opacity(0.2);
        }
      }
    `}

  ${({kind:e=""})=>["field","additionalProperties","patternProperties"].includes(e)?"":"font-style: italic"};

  ${ma("PropertyNameCell")};
`,Xu=ha.td`
  border-bottom: 1px solid #9fb4be;
  padding: 10px 0;
  width: ${e=>e.theme.schema.defaultDetailsWidth};
  box-sizing: border-box;

  tr.expanded & {
    border-bottom: none;
  }

  ${fa.lessThan("small")`
    padding: 0 20px;
    border-bottom: none;
    border-left: 1px solid ${e=>e.theme.schema.linesColor};

    tr.last > & {
      border-left: none;
    }
  `}

  ${ma("PropertyDetailsCell")};
`,Ku=ha.span`
  color: ${e=>e.theme.schema.linesColor};
  font-family: ${e=>e.theme.typography.code.fontFamily};
  margin-right: 10px;

  &::before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 10px;
    height: 1px;
    background: ${e=>e.theme.schema.linesColor};
  }

  &::after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 1px;
    background: ${e=>e.theme.schema.linesColor};
    height: 7px;
  }
`,Zu=ha.div`
  padding: ${({theme:e})=>e.schema.nestingSpacing};
`,Ju=ha.table`
  border-collapse: separate;
  border-radius: 3px;
  font-size: ${e=>e.theme.typography.fontSize};

  border-spacing: 0;
  width: 100%;

  > tr {
    vertical-align: middle;
  }

  ${fa.lessThan("small")`
    display: block;
    > tr, > tbody > tr {
      display: block;
    }
  `}

  ${fa.lessThan("small",!1," and (-ms-high-contrast:none)")`
    td {
      float: left;
      width: 100%;
    }
  `}

  &
    ${Zu},
    &
    ${Zu}
    ${Zu}
    ${Zu},
    &
    ${Zu}
    ${Zu}
    ${Zu}
    ${Zu}
    ${Zu} {
    margin: ${({theme:e})=>e.schema.nestingSpacing};
    margin-right: 0;
    background: ${({theme:e})=>e.schema.nestedBackground};
  }

  &
    ${Zu}
    ${Zu},
    &
    ${Zu}
    ${Zu}
    ${Zu}
    ${Zu},
    &
    ${Zu}
    ${Zu}
    ${Zu}
    ${Zu}
    ${Zu}
    ${Zu} {
    background: #ffffff;
  }
`,ep=ha.div`
  margin: 0 0 3px 0;
  display: inline-block;
`,tp=ha.span`
  font-size: 0.9em;
  margin-right: 10px;
  color: ${e=>e.theme.colors.primary.main};
  font-family: ${e=>e.theme.typography.headings.fontFamily};
}
`,np=ha.button`
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 5px;
  font-size: 0.8em;
  cursor: pointer;
  border: 1px solid ${e=>e.theme.colors.primary.main};
  padding: 2px 10px;
  line-height: 1.5em;
  outline: none;
  &:focus {
    box-shadow: 0 0 0 1px ${e=>e.theme.colors.primary.main};
  }

  ${({$deprecated:e})=>e&&Wu||""};

  ${e=>e.$active?`\n      color: white;\n      background-color: ${e.theme.colors.primary.main};\n      &:focus {\n        box-shadow: none;\n        background-color: ${Nr(.15,e.theme.colors.primary.main)};\n      }\n      `:`\n        color: ${e.theme.colors.primary.main};\n        background-color: white;\n      `}
`,rp=ha.div`
  font-size: 0.9em;
  font-family: ${e=>e.theme.typography.code.fontFamily};
  &::after {
    content: ' [';
  }
`,ip=ha.div`
  font-size: 0.9em;
  font-family: ${e=>e.theme.typography.code.fontFamily};
  &::after {
    content: ']';
  }
`;function op(e){return function(t){return!!t.type&&t.type.tabsRole===e}}var ap=op("Tab"),sp=op("TabList"),lp=op("TabPanel");function cp(){return cp=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},cp.apply(this,arguments)}function up(e,t){return n.Children.map(e,(function(e){return null===e?null:function(e){return ap(e)||sp(e)||lp(e)}(e)?t(e):e.props&&e.props.children&&"object"==typeof e.props.children?(0,n.cloneElement)(e,cp({},e.props,{children:up(e.props.children,t)})):e}))}function pp(e,t){return n.Children.forEach(e,(function(e){null!==e&&(ap(e)||lp(e)?t(e):e.props&&e.props.children&&"object"==typeof e.props.children&&(sp(e)&&t(e),pp(e.props.children,t)))}))}function dp(e){var t,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=dp(e[t]))&&(r&&(r+=" "),r+=n);else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function fp(){for(var e,t,n=0,r="";n<arguments.length;)(e=arguments[n++])&&(t=dp(e))&&(r&&(r+=" "),r+=t);return r}var hp=0;function mp(){return"react-tabs-"+hp++}function gp(e){var t=0;return pp(e,(function(e){ap(e)&&t++})),t}var yp,vp=["children","className","disabledTabClassName","domRef","focus","forceRenderTabPanel","onSelect","selectedIndex","selectedTabClassName","selectedTabPanelClassName","environment","disableUpDownKeys"];function bp(){return bp=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},bp.apply(this,arguments)}function xp(e){return e&&"getAttribute"in e}function wp(e){return xp(e)&&e.getAttribute("data-rttab")}function kp(e){return xp(e)&&"true"===e.getAttribute("aria-disabled")}var Op=function(e){var t=(0,n.useRef)([]),r=(0,n.useRef)([]),i=(0,n.useRef)([]),o=(0,n.useRef)();function a(t,n){t<0||t>=c()||(0,e.onSelect)(t,e.selectedIndex,n)}function s(e){for(var t=c(),n=e+1;n<t;n++)if(!kp(u(n)))return n;for(var r=0;r<e;r++)if(!kp(u(r)))return r;return e}function l(e){for(var t=e;t--;)if(!kp(u(t)))return t;for(t=c();t-- >e;)if(!kp(u(t)))return t;return e}function c(){return gp(e.children)}function u(e){return t.current["tabs-"+e]}function p(e){var t=e.target;do{if(d(t)){if(kp(t))return;return void a([].slice.call(t.parentNode.children).filter(wp).indexOf(t),e)}}while(null!=(t=t.parentNode))}function d(e){if(!wp(e))return!1;var t=e.parentElement;do{if(t===o.current)return!0;if(t.getAttribute("data-rttabs"))break;t=t.parentElement}while(t);return!1}e.children;var f=e.className,h=(e.disabledTabClassName,e.domRef),m=(e.focus,e.forceRenderTabPanel,e.onSelect,e.selectedIndex,e.selectedTabClassName,e.selectedTabPanelClassName,e.environment,e.disableUpDownKeys,function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,vp));return n.createElement("div",bp({},m,{className:fp(f),onClick:p,onKeyDown:function(t){var n=e.direction,r=e.disableUpDownKeys;if(d(t.target)){var i=e.selectedIndex,o=!1,f=!1;"Space"!==t.code&&32!==t.keyCode&&"Enter"!==t.code&&13!==t.keyCode||(o=!0,f=!1,p(t)),"ArrowLeft"!==t.code&&37!==t.keyCode&&(r||38!==t.keyCode&&"ArrowUp"!==t.code)?"ArrowRight"!==t.code&&39!==t.keyCode&&(r||40!==t.keyCode&&"ArrowDown"!==t.code)?35===t.keyCode||"End"===t.code?(i=function(){for(var e=c();e--;)if(!kp(u(e)))return e;return null}(),o=!0,f=!0):36!==t.keyCode&&"Home"!==t.code||(i=function(){for(var e=c(),t=0;t<e;t++)if(!kp(u(t)))return t;return null}(),o=!0,f=!0):(i="rtl"===n?l(i):s(i),o=!0,f=!0):(i="rtl"===n?s(i):l(i),o=!0,f=!0),o&&t.preventDefault(),f&&a(i,t)}},ref:function(e){o.current=e,h&&h(e)},"data-rttabs":!0}),function(){var o=0,a=e.children,s=e.disabledTabClassName,l=e.focus,p=e.forceRenderTabPanel,d=e.selectedIndex,f=e.selectedTabClassName,h=e.selectedTabPanelClassName,m=e.environment;r.current=r.current||[],i.current=i.current||[];for(var g=r.current.length-c();g++<0;)r.current.push(mp()),i.current.push(mp());return up(a,(function(e){var a=e;if(sp(e)){var c=0,g=!1;null==yp&&function(e){var t=e||("undefined"!=typeof window?window:void 0);try{yp=!(void 0===t||!t.document||!t.document.activeElement)}catch(e){yp=!1}}(m);var y=m||("undefined"!=typeof window?window:void 0);yp&&y&&(g=n.Children.toArray(e.props.children).filter(ap).some((function(e,t){return y.document.activeElement===u(t)}))),a=(0,n.cloneElement)(e,{children:up(e.props.children,(function(e){var o="tabs-"+c,a=d===c,u={tabRef:function(e){t.current[o]=e},id:r.current[c],panelId:i.current[c],selected:a,focus:a&&(l||g)};return f&&(u.selectedClassName=f),s&&(u.disabledClassName=s),c++,(0,n.cloneElement)(e,u)}))})}else if(lp(e)){var v={id:i.current[o],tabId:r.current[o],selected:d===o};p&&(v.forceRender=p),h&&(v.selectedClassName=h),o++,a=(0,n.cloneElement)(e,v)}return a}))}())};Op.defaultProps={className:"react-tabs",focus:!1},Op.propTypes={};var Sp=Op;function Ep(){return Ep=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Ep.apply(this,arguments)}var _p=function(e){var t=e.children,r=e.defaultFocus,i=e.defaultIndex,o=e.focusTabOnClick,a=e.onSelect,s=(0,n.useState)(r),l=s[0],c=s[1],u=(0,n.useState)(function(e){return null===e.selectedIndex?1:0}(e)),p=u[0],d=(0,n.useState)(1===p?i||0:null),f=d[0],h=d[1];if((0,n.useEffect)((function(){c(!1)}),[]),1===p){var m=gp(t);(0,n.useEffect)((function(){if(null!=f){var e=Math.max(0,m-1);h(Math.min(f,e))}}),[m])}var g=Ep({},e);return g.focus=l,g.onSelect=function(e,t,n){"function"==typeof a&&!1===a(e,t,n)||(o&&c(!0),1===p&&h(e))},null!=f&&(g.selectedIndex=f),delete g.defaultFocus,delete g.defaultIndex,delete g.focusTabOnClick,n.createElement(Sp,g,t)};_p.propTypes={},_p.defaultProps={defaultFocus:!1,focusTabOnClick:!0,forceRenderTabPanel:!1,selectedIndex:null,defaultIndex:null,environment:null,disableUpDownKeys:!1},_p.tabsRole="Tabs";var Ap=_p,jp=["children","className"];function Cp(){return Cp=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Cp.apply(this,arguments)}var Pp=function(e){var t=e.children,r=e.className,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,jp);return n.createElement("ul",Cp({},i,{className:fp(r),role:"tablist"}),t)};Pp.tabsRole="TabList",Pp.propTypes={},Pp.defaultProps={className:"react-tabs__tab-list"};var Tp=Pp,Rp=["children","className","disabled","disabledClassName","focus","id","panelId","selected","selectedClassName","tabIndex","tabRef"];function Ip(){return Ip=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Ip.apply(this,arguments)}var $p="react-tabs__tab",Np={className:$p,disabledClassName:$p+"--disabled",focus:!1,id:null,panelId:null,selected:!1,selectedClassName:$p+"--selected"},Lp=function(e){var t,r=(0,n.useRef)(),i=e.children,o=e.className,a=e.disabled,s=e.disabledClassName,l=e.focus,c=e.id,u=e.panelId,p=e.selected,d=e.selectedClassName,f=e.tabIndex,h=e.tabRef,m=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,Rp);return(0,n.useEffect)((function(){p&&l&&r.current.focus()}),[p,l]),n.createElement("li",Ip({},m,{className:fp(o,(t={},t[d]=p,t[s]=a,t)),ref:function(e){r.current=e,h&&h(e)},role:"tab",id:c,"aria-selected":p?"true":"false","aria-disabled":a?"true":"false","aria-controls":u,tabIndex:f||(p?"0":null),"data-rttab":!0}),i)};Lp.propTypes={},Lp.tabsRole="Tab",Lp.defaultProps=Np;var Dp=Lp,Mp=["children","className","forceRender","id","selected","selectedClassName","tabId"];function Fp(){return Fp=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Fp.apply(this,arguments)}var zp="react-tabs__tab-panel",Up={className:zp,forceRender:!1,selectedClassName:zp+"--selected"},Bp=function(e){var t,r=e.children,i=e.className,o=e.forceRender,a=e.id,s=e.selected,l=e.selectedClassName,c=e.tabId,u=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,Mp);return n.createElement("div",Fp({},u,{className:fp(i,(t={},t[l]=s,t)),role:"tabpanel",id:a,"aria-labelledby":c}),o||s?r:null)};Bp.tabsRole="TabPanel",Bp.propTypes={},Bp.defaultProps=Up;var qp=Bp;const Vp=ha(Ap)`
  > ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin: 0 -5px;

    > li {
      padding: 5px 10px;
      display: inline-block;

      background-color: ${({theme:e})=>e.codeBlock.backgroundColor};
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      cursor: pointer;
      text-align: center;
      outline: none;
      color: ${({theme:e})=>Nr(e.colors.tonalOffset,e.rightPanel.textColor)};
      margin: 0
        ${({theme:e})=>`${e.spacing.unit}px ${e.spacing.unit}px ${e.spacing.unit}px`};
      border: 1px solid ${({theme:e})=>Nr(.05,e.codeBlock.backgroundColor)};
      border-radius: 5px;
      min-width: 60px;
      font-size: 0.9em;
      font-weight: bold;

      &.react-tabs__tab--selected {
        color: ${e=>e.theme.colors.text.primary};
        background: ${({theme:e})=>e.rightPanel.textColor};
        &:focus {
          outline: auto;
        }
      }

      &:only-child {
        flex: none;
        min-width: 100px;
      }

      &.tab-success {
        color: ${e=>e.theme.colors.responses.success.tabTextColor};
      }

      &.tab-redirect {
        color: ${e=>e.theme.colors.responses.redirect.tabTextColor};
      }

      &.tab-info {
        color: ${e=>e.theme.colors.responses.info.tabTextColor};
      }

      &.tab-error {
        color: ${e=>e.theme.colors.responses.error.tabTextColor};
      }
    }
  }
  > .react-tabs__tab-panel {
    background: ${({theme:e})=>e.codeBlock.backgroundColor};
    & > div,
    & > pre {
      padding: ${e=>4*e.theme.spacing.unit}px;
      margin: 0;
    }

    & > div > pre {
      padding: 0;
    }
  }
`,Wp=(ha(Vp)`
  > ul {
    display: block;
    > li {
      padding: 2px 5px;
      min-width: auto;
      margin: 0 15px 0 0;
      font-size: 13px;
      font-weight: normal;
      border-bottom: 1px dashed;
      color: ${({theme:e})=>Nr(e.colors.tonalOffset,e.rightPanel.textColor)};
      border-radius: 0;
      background: none;

      &:last-child {
        margin-right: 0;
      }

      &.react-tabs__tab--selected {
        color: ${({theme:e})=>e.rightPanel.textColor};
        background: none;
      }
    }
  }
  > .react-tabs__tab-panel {
    & > div,
    & > pre {
      padding: ${e=>2*e.theme.spacing.unit}px 0;
    }
  }
`,ha.div`
  /**
  * Based on prism-dark.css
  */

  code[class*='language-'],
  pre[class*='language-'] {
    /* color: white;
    background: none; */
    text-shadow: 0 -0.1em 0.2em black;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  @media print {
    code[class*='language-'],
    pre[class*='language-'] {
      text-shadow: none;
    }
  }

  /* Code blocks */
  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: hsl(30, 20%, 50%);
  }

  .token.punctuation {
    opacity: 0.7;
  }

  .namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.number,
  .token.constant,
  .token.symbol {
    color: #4a8bb3;
  }

  .token.boolean {
    color: #e64441;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #a0fbaa;
    & + a,
    & + a:visited {
      color: #4ed2ba;
      text-decoration: underline;
    }
  }

  .token.property.string {
    color: white;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .token.variable {
    color: hsl(40, 90%, 60%);
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: hsl(350, 40%, 70%);
  }

  .token.regex,
  .token.important {
    color: #e90;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.deleted {
    color: red;
  }

  ${ma("Prism")};
`),Hp=ha.div`
  opacity: 0.7;
  transition: opacity 0.3s ease;
  text-align: right;
  &:focus-within {
    opacity: 1;
  }
  > button {
    background-color: transparent;
    border: 0;
    color: inherit;
    padding: 2px 10px;
    font-family: ${({theme:e})=>e.typography.fontFamily};
    font-size: ${({theme:e})=>e.typography.fontSize};
    line-height: ${({theme:e})=>e.typography.lineHeight};
    cursor: pointer;
    outline: 0;

    :hover,
    :focus {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`,Yp=ha.div`
  &:hover ${Hp} {
    opacity: 1;
  }
`,Qp=ha(Wp).attrs({as:"pre"})`
  font-family: ${e=>e.theme.typography.code.fontFamily};
  font-size: ${e=>e.theme.typography.code.fontSize};
  overflow-x: auto;
  margin: 0;

  white-space: ${({theme:e})=>e.typography.code.wrap?"pre-wrap":"pre"};
`;function Gp(e){return getComputedStyle(e)}function Xp(e,t){for(var n in t){var r=t[n];"number"==typeof r&&(r+="px"),e.style[n]=r}return e}function Kp(e){var t=document.createElement("div");return t.className=e,t}var Zp="undefined"!=typeof Element&&(Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector);function Jp(e,t){if(!Zp)throw new Error("No element matching method supported");return Zp.call(e,t)}function ed(e){e.remove?e.remove():e.parentNode&&e.parentNode.removeChild(e)}function td(e,t){return Array.prototype.filter.call(e.children,(function(e){return Jp(e,t)}))}var nd={main:"ps",rtl:"ps__rtl",element:{thumb:function(e){return"ps__thumb-"+e},rail:function(e){return"ps__rail-"+e},consuming:"ps__child--consume"},state:{focus:"ps--focus",clicking:"ps--clicking",active:function(e){return"ps--active-"+e},scrolling:function(e){return"ps--scrolling-"+e}}},rd={x:null,y:null};function id(e,t){var n=e.element.classList,r=nd.state.scrolling(t);n.contains(r)?clearTimeout(rd[t]):n.add(r)}function od(e,t){rd[t]=setTimeout((function(){return e.isAlive&&e.element.classList.remove(nd.state.scrolling(t))}),e.settings.scrollingThreshold)}var ad=function(e){this.element=e,this.handlers={}},sd={isEmpty:{configurable:!0}};ad.prototype.bind=function(e,t){void 0===this.handlers[e]&&(this.handlers[e]=[]),this.handlers[e].push(t),this.element.addEventListener(e,t,!1)},ad.prototype.unbind=function(e,t){var n=this;this.handlers[e]=this.handlers[e].filter((function(r){return!(!t||r===t)||(n.element.removeEventListener(e,r,!1),!1)}))},ad.prototype.unbindAll=function(){for(var e in this.handlers)this.unbind(e)},sd.isEmpty.get=function(){var e=this;return Object.keys(this.handlers).every((function(t){return 0===e.handlers[t].length}))},Object.defineProperties(ad.prototype,sd);var ld=function(){this.eventElements=[]};function cd(e){if("function"==typeof window.CustomEvent)return new CustomEvent(e);var t=document.createEvent("CustomEvent");return t.initCustomEvent(e,!1,!1,void 0),t}function ud(e,t,n,r,i){var o;if(void 0===r&&(r=!0),void 0===i&&(i=!1),"top"===t)o=["contentHeight","containerHeight","scrollTop","y","up","down"];else{if("left"!==t)throw new Error("A proper axis should be provided");o=["contentWidth","containerWidth","scrollLeft","x","left","right"]}!function(e,t,n,r,i){var o=n[0],a=n[1],s=n[2],l=n[3],c=n[4],u=n[5];void 0===r&&(r=!0),void 0===i&&(i=!1);var p=e.element;e.reach[l]=null,p[s]<1&&(e.reach[l]="start"),p[s]>e[o]-e[a]-1&&(e.reach[l]="end"),t&&(p.dispatchEvent(cd("ps-scroll-"+l)),t<0?p.dispatchEvent(cd("ps-scroll-"+c)):t>0&&p.dispatchEvent(cd("ps-scroll-"+u)),r&&function(e,t){id(e,t),od(e,t)}(e,l)),e.reach[l]&&(t||i)&&p.dispatchEvent(cd("ps-"+l+"-reach-"+e.reach[l]))}(e,n,o,r,i)}function pd(e){return parseInt(e,10)||0}ld.prototype.eventElement=function(e){var t=this.eventElements.filter((function(t){return t.element===e}))[0];return t||(t=new ad(e),this.eventElements.push(t)),t},ld.prototype.bind=function(e,t,n){this.eventElement(e).bind(t,n)},ld.prototype.unbind=function(e,t,n){var r=this.eventElement(e);r.unbind(t,n),r.isEmpty&&this.eventElements.splice(this.eventElements.indexOf(r),1)},ld.prototype.unbindAll=function(){this.eventElements.forEach((function(e){return e.unbindAll()})),this.eventElements=[]},ld.prototype.once=function(e,t,n){var r=this.eventElement(e),i=function(e){r.unbind(t,i),n(e)};r.bind(t,i)};var dd={isWebKit:"undefined"!=typeof document&&"WebkitAppearance"in document.documentElement.style,supportsTouch:"undefined"!=typeof window&&("ontouchstart"in window||"maxTouchPoints"in window.navigator&&window.navigator.maxTouchPoints>0||window.DocumentTouch&&document instanceof window.DocumentTouch),supportsIePointer:"undefined"!=typeof navigator&&navigator.msMaxTouchPoints,isChrome:"undefined"!=typeof navigator&&/Chrome/i.test(navigator&&navigator.userAgent)};function fd(e){var t=e.element,n=Math.floor(t.scrollTop),r=t.getBoundingClientRect();e.containerWidth=Math.round(r.width),e.containerHeight=Math.round(r.height),e.contentWidth=t.scrollWidth,e.contentHeight=t.scrollHeight,t.contains(e.scrollbarXRail)||(td(t,nd.element.rail("x")).forEach((function(e){return ed(e)})),t.appendChild(e.scrollbarXRail)),t.contains(e.scrollbarYRail)||(td(t,nd.element.rail("y")).forEach((function(e){return ed(e)})),t.appendChild(e.scrollbarYRail)),!e.settings.suppressScrollX&&e.containerWidth+e.settings.scrollXMarginOffset<e.contentWidth?(e.scrollbarXActive=!0,e.railXWidth=e.containerWidth-e.railXMarginWidth,e.railXRatio=e.containerWidth/e.railXWidth,e.scrollbarXWidth=hd(e,pd(e.railXWidth*e.containerWidth/e.contentWidth)),e.scrollbarXLeft=pd((e.negativeScrollAdjustment+t.scrollLeft)*(e.railXWidth-e.scrollbarXWidth)/(e.contentWidth-e.containerWidth))):e.scrollbarXActive=!1,!e.settings.suppressScrollY&&e.containerHeight+e.settings.scrollYMarginOffset<e.contentHeight?(e.scrollbarYActive=!0,e.railYHeight=e.containerHeight-e.railYMarginHeight,e.railYRatio=e.containerHeight/e.railYHeight,e.scrollbarYHeight=hd(e,pd(e.railYHeight*e.containerHeight/e.contentHeight)),e.scrollbarYTop=pd(n*(e.railYHeight-e.scrollbarYHeight)/(e.contentHeight-e.containerHeight))):e.scrollbarYActive=!1,e.scrollbarXLeft>=e.railXWidth-e.scrollbarXWidth&&(e.scrollbarXLeft=e.railXWidth-e.scrollbarXWidth),e.scrollbarYTop>=e.railYHeight-e.scrollbarYHeight&&(e.scrollbarYTop=e.railYHeight-e.scrollbarYHeight),function(e,t){var n={width:t.railXWidth},r=Math.floor(e.scrollTop);t.isRtl?n.left=t.negativeScrollAdjustment+e.scrollLeft+t.containerWidth-t.contentWidth:n.left=e.scrollLeft,t.isScrollbarXUsingBottom?n.bottom=t.scrollbarXBottom-r:n.top=t.scrollbarXTop+r,Xp(t.scrollbarXRail,n);var i={top:r,height:t.railYHeight};t.isScrollbarYUsingRight?t.isRtl?i.right=t.contentWidth-(t.negativeScrollAdjustment+e.scrollLeft)-t.scrollbarYRight-t.scrollbarYOuterWidth-9:i.right=t.scrollbarYRight-e.scrollLeft:t.isRtl?i.left=t.negativeScrollAdjustment+e.scrollLeft+2*t.containerWidth-t.contentWidth-t.scrollbarYLeft-t.scrollbarYOuterWidth:i.left=t.scrollbarYLeft+e.scrollLeft,Xp(t.scrollbarYRail,i),Xp(t.scrollbarX,{left:t.scrollbarXLeft,width:t.scrollbarXWidth-t.railBorderXWidth}),Xp(t.scrollbarY,{top:t.scrollbarYTop,height:t.scrollbarYHeight-t.railBorderYWidth})}(t,e),e.scrollbarXActive?t.classList.add(nd.state.active("x")):(t.classList.remove(nd.state.active("x")),e.scrollbarXWidth=0,e.scrollbarXLeft=0,t.scrollLeft=!0===e.isRtl?e.contentWidth:0),e.scrollbarYActive?t.classList.add(nd.state.active("y")):(t.classList.remove(nd.state.active("y")),e.scrollbarYHeight=0,e.scrollbarYTop=0,t.scrollTop=0)}function hd(e,t){return e.settings.minScrollbarLength&&(t=Math.max(t,e.settings.minScrollbarLength)),e.settings.maxScrollbarLength&&(t=Math.min(t,e.settings.maxScrollbarLength)),t}function md(e,t){var n=t[0],r=t[1],i=t[2],o=t[3],a=t[4],s=t[5],l=t[6],c=t[7],u=t[8],p=e.element,d=null,f=null,h=null;function m(t){t.touches&&t.touches[0]&&(t[i]=t.touches[0].pageY),p[l]=d+h*(t[i]-f),id(e,c),fd(e),t.stopPropagation(),t.type.startsWith("touch")&&t.changedTouches.length>1&&t.preventDefault()}function g(){od(e,c),e[u].classList.remove(nd.state.clicking),e.event.unbind(e.ownerDocument,"mousemove",m)}function y(t,a){d=p[l],a&&t.touches&&(t[i]=t.touches[0].pageY),f=t[i],h=(e[r]-e[n])/(e[o]-e[s]),a?e.event.bind(e.ownerDocument,"touchmove",m):(e.event.bind(e.ownerDocument,"mousemove",m),e.event.once(e.ownerDocument,"mouseup",g),t.preventDefault()),e[u].classList.add(nd.state.clicking),t.stopPropagation()}e.event.bind(e[a],"mousedown",(function(e){y(e)})),e.event.bind(e[a],"touchstart",(function(e){y(e,!0)}))}var gd={"click-rail":function(e){e.element,e.event.bind(e.scrollbarY,"mousedown",(function(e){return e.stopPropagation()})),e.event.bind(e.scrollbarYRail,"mousedown",(function(t){var n=t.pageY-window.pageYOffset-e.scrollbarYRail.getBoundingClientRect().top>e.scrollbarYTop?1:-1;e.element.scrollTop+=n*e.containerHeight,fd(e),t.stopPropagation()})),e.event.bind(e.scrollbarX,"mousedown",(function(e){return e.stopPropagation()})),e.event.bind(e.scrollbarXRail,"mousedown",(function(t){var n=t.pageX-window.pageXOffset-e.scrollbarXRail.getBoundingClientRect().left>e.scrollbarXLeft?1:-1;e.element.scrollLeft+=n*e.containerWidth,fd(e),t.stopPropagation()}))},"drag-thumb":function(e){md(e,["containerWidth","contentWidth","pageX","railXWidth","scrollbarX","scrollbarXWidth","scrollLeft","x","scrollbarXRail"]),md(e,["containerHeight","contentHeight","pageY","railYHeight","scrollbarY","scrollbarYHeight","scrollTop","y","scrollbarYRail"])},keyboard:function(e){var t=e.element;e.event.bind(e.ownerDocument,"keydown",(function(n){if(!(n.isDefaultPrevented&&n.isDefaultPrevented()||n.defaultPrevented)&&(Jp(t,":hover")||Jp(e.scrollbarX,":focus")||Jp(e.scrollbarY,":focus"))){var r,i=document.activeElement?document.activeElement:e.ownerDocument.activeElement;if(i){if("IFRAME"===i.tagName)i=i.contentDocument.activeElement;else for(;i.shadowRoot;)i=i.shadowRoot.activeElement;if(Jp(r=i,"input,[contenteditable]")||Jp(r,"select,[contenteditable]")||Jp(r,"textarea,[contenteditable]")||Jp(r,"button,[contenteditable]"))return}var o=0,a=0;switch(n.which){case 37:o=n.metaKey?-e.contentWidth:n.altKey?-e.containerWidth:-30;break;case 38:a=n.metaKey?e.contentHeight:n.altKey?e.containerHeight:30;break;case 39:o=n.metaKey?e.contentWidth:n.altKey?e.containerWidth:30;break;case 40:a=n.metaKey?-e.contentHeight:n.altKey?-e.containerHeight:-30;break;case 32:a=n.shiftKey?e.containerHeight:-e.containerHeight;break;case 33:a=e.containerHeight;break;case 34:a=-e.containerHeight;break;case 36:a=e.contentHeight;break;case 35:a=-e.contentHeight;break;default:return}e.settings.suppressScrollX&&0!==o||e.settings.suppressScrollY&&0!==a||(t.scrollTop-=a,t.scrollLeft+=o,fd(e),function(n,r){var i=Math.floor(t.scrollTop);if(0===n){if(!e.scrollbarYActive)return!1;if(0===i&&r>0||i>=e.contentHeight-e.containerHeight&&r<0)return!e.settings.wheelPropagation}var o=t.scrollLeft;if(0===r){if(!e.scrollbarXActive)return!1;if(0===o&&n<0||o>=e.contentWidth-e.containerWidth&&n>0)return!e.settings.wheelPropagation}return!0}(o,a)&&n.preventDefault())}}))},wheel:function(e){var t=e.element;function n(n){var r=function(e){var t=e.deltaX,n=-1*e.deltaY;return void 0!==t&&void 0!==n||(t=-1*e.wheelDeltaX/6,n=e.wheelDeltaY/6),e.deltaMode&&1===e.deltaMode&&(t*=10,n*=10),t!=t&&n!=n&&(t=0,n=e.wheelDelta),e.shiftKey?[-n,-t]:[t,n]}(n),i=r[0],o=r[1];if(!function(e,n,r){if(!dd.isWebKit&&t.querySelector("select:focus"))return!0;if(!t.contains(e))return!1;for(var i=e;i&&i!==t;){if(i.classList.contains(nd.element.consuming))return!0;var o=Gp(i);if(r&&o.overflowY.match(/(scroll|auto)/)){var a=i.scrollHeight-i.clientHeight;if(a>0&&(i.scrollTop>0&&r<0||i.scrollTop<a&&r>0))return!0}if(n&&o.overflowX.match(/(scroll|auto)/)){var s=i.scrollWidth-i.clientWidth;if(s>0&&(i.scrollLeft>0&&n<0||i.scrollLeft<s&&n>0))return!0}i=i.parentNode}return!1}(n.target,i,o)){var a=!1;e.settings.useBothWheelAxes?e.scrollbarYActive&&!e.scrollbarXActive?(o?t.scrollTop-=o*e.settings.wheelSpeed:t.scrollTop+=i*e.settings.wheelSpeed,a=!0):e.scrollbarXActive&&!e.scrollbarYActive&&(i?t.scrollLeft+=i*e.settings.wheelSpeed:t.scrollLeft-=o*e.settings.wheelSpeed,a=!0):(t.scrollTop-=o*e.settings.wheelSpeed,t.scrollLeft+=i*e.settings.wheelSpeed),fd(e),a=a||function(n,r){var i=Math.floor(t.scrollTop),o=0===t.scrollTop,a=i+t.offsetHeight===t.scrollHeight,s=0===t.scrollLeft,l=t.scrollLeft+t.offsetWidth===t.scrollWidth;return!(Math.abs(r)>Math.abs(n)?o||a:s||l)||!e.settings.wheelPropagation}(i,o),a&&!n.ctrlKey&&(n.stopPropagation(),n.preventDefault())}}void 0!==window.onwheel?e.event.bind(t,"wheel",n):void 0!==window.onmousewheel&&e.event.bind(t,"mousewheel",n)},touch:function(e){if(dd.supportsTouch||dd.supportsIePointer){var t=e.element,n={},r=0,i={},o=null;dd.supportsTouch?(e.event.bind(t,"touchstart",c),e.event.bind(t,"touchmove",u),e.event.bind(t,"touchend",p)):dd.supportsIePointer&&(window.PointerEvent?(e.event.bind(t,"pointerdown",c),e.event.bind(t,"pointermove",u),e.event.bind(t,"pointerup",p)):window.MSPointerEvent&&(e.event.bind(t,"MSPointerDown",c),e.event.bind(t,"MSPointerMove",u),e.event.bind(t,"MSPointerUp",p)))}function a(n,r){t.scrollTop-=r,t.scrollLeft-=n,fd(e)}function s(e){return e.targetTouches?e.targetTouches[0]:e}function l(e){return!(e.pointerType&&"pen"===e.pointerType&&0===e.buttons||(!e.targetTouches||1!==e.targetTouches.length)&&(!e.pointerType||"mouse"===e.pointerType||e.pointerType===e.MSPOINTER_TYPE_MOUSE))}function c(e){if(l(e)){var t=s(e);n.pageX=t.pageX,n.pageY=t.pageY,r=(new Date).getTime(),null!==o&&clearInterval(o)}}function u(o){if(l(o)){var c=s(o),u={pageX:c.pageX,pageY:c.pageY},p=u.pageX-n.pageX,d=u.pageY-n.pageY;if(function(e,n,r){if(!t.contains(e))return!1;for(var i=e;i&&i!==t;){if(i.classList.contains(nd.element.consuming))return!0;var o=Gp(i);if(r&&o.overflowY.match(/(scroll|auto)/)){var a=i.scrollHeight-i.clientHeight;if(a>0&&(i.scrollTop>0&&r<0||i.scrollTop<a&&r>0))return!0}if(n&&o.overflowX.match(/(scroll|auto)/)){var s=i.scrollWidth-i.clientWidth;if(s>0&&(i.scrollLeft>0&&n<0||i.scrollLeft<s&&n>0))return!0}i=i.parentNode}return!1}(o.target,p,d))return;a(p,d),n=u;var f=(new Date).getTime(),h=f-r;h>0&&(i.x=p/h,i.y=d/h,r=f),function(n,r){var i=Math.floor(t.scrollTop),o=t.scrollLeft,a=Math.abs(n),s=Math.abs(r);if(s>a){if(r<0&&i===e.contentHeight-e.containerHeight||r>0&&0===i)return 0===window.scrollY&&r>0&&dd.isChrome}else if(a>s&&(n<0&&o===e.contentWidth-e.containerWidth||n>0&&0===o))return!0;return!0}(p,d)&&o.preventDefault()}}function p(){e.settings.swipeEasing&&(clearInterval(o),o=setInterval((function(){e.isInitialized?clearInterval(o):i.x||i.y?Math.abs(i.x)<.01&&Math.abs(i.y)<.01?clearInterval(o):e.element?(a(30*i.x,30*i.y),i.x*=.8,i.y*=.8):clearInterval(o):clearInterval(o)}),10))}}},yd=function(e,t){var n=this;if(void 0===t&&(t={}),"string"==typeof e&&(e=document.querySelector(e)),!e||!e.nodeName)throw new Error("no element is specified to initialize PerfectScrollbar");for(var r in this.element=e,e.classList.add(nd.main),this.settings={handlers:["click-rail","drag-thumb","keyboard","wheel","touch"],maxScrollbarLength:null,minScrollbarLength:null,scrollingThreshold:1e3,scrollXMarginOffset:0,scrollYMarginOffset:0,suppressScrollX:!1,suppressScrollY:!1,swipeEasing:!0,useBothWheelAxes:!1,wheelPropagation:!0,wheelSpeed:1},t)this.settings[r]=t[r];this.containerWidth=null,this.containerHeight=null,this.contentWidth=null,this.contentHeight=null;var i,o,a=function(){return e.classList.add(nd.state.focus)},s=function(){return e.classList.remove(nd.state.focus)};this.isRtl="rtl"===Gp(e).direction,!0===this.isRtl&&e.classList.add(nd.rtl),this.isNegativeScroll=(o=e.scrollLeft,e.scrollLeft=-1,i=e.scrollLeft<0,e.scrollLeft=o,i),this.negativeScrollAdjustment=this.isNegativeScroll?e.scrollWidth-e.clientWidth:0,this.event=new ld,this.ownerDocument=e.ownerDocument||document,this.scrollbarXRail=Kp(nd.element.rail("x")),e.appendChild(this.scrollbarXRail),this.scrollbarX=Kp(nd.element.thumb("x")),this.scrollbarXRail.appendChild(this.scrollbarX),this.scrollbarX.setAttribute("tabindex",0),this.event.bind(this.scrollbarX,"focus",a),this.event.bind(this.scrollbarX,"blur",s),this.scrollbarXActive=null,this.scrollbarXWidth=null,this.scrollbarXLeft=null;var l=Gp(this.scrollbarXRail);this.scrollbarXBottom=parseInt(l.bottom,10),isNaN(this.scrollbarXBottom)?(this.isScrollbarXUsingBottom=!1,this.scrollbarXTop=pd(l.top)):this.isScrollbarXUsingBottom=!0,this.railBorderXWidth=pd(l.borderLeftWidth)+pd(l.borderRightWidth),Xp(this.scrollbarXRail,{display:"block"}),this.railXMarginWidth=pd(l.marginLeft)+pd(l.marginRight),Xp(this.scrollbarXRail,{display:""}),this.railXWidth=null,this.railXRatio=null,this.scrollbarYRail=Kp(nd.element.rail("y")),e.appendChild(this.scrollbarYRail),this.scrollbarY=Kp(nd.element.thumb("y")),this.scrollbarYRail.appendChild(this.scrollbarY),this.scrollbarY.setAttribute("tabindex",0),this.event.bind(this.scrollbarY,"focus",a),this.event.bind(this.scrollbarY,"blur",s),this.scrollbarYActive=null,this.scrollbarYHeight=null,this.scrollbarYTop=null;var c=Gp(this.scrollbarYRail);this.scrollbarYRight=parseInt(c.right,10),isNaN(this.scrollbarYRight)?(this.isScrollbarYUsingRight=!1,this.scrollbarYLeft=pd(c.left)):this.isScrollbarYUsingRight=!0,this.scrollbarYOuterWidth=this.isRtl?function(e){var t=Gp(e);return pd(t.width)+pd(t.paddingLeft)+pd(t.paddingRight)+pd(t.borderLeftWidth)+pd(t.borderRightWidth)}(this.scrollbarY):null,this.railBorderYWidth=pd(c.borderTopWidth)+pd(c.borderBottomWidth),Xp(this.scrollbarYRail,{display:"block"}),this.railYMarginHeight=pd(c.marginTop)+pd(c.marginBottom),Xp(this.scrollbarYRail,{display:""}),this.railYHeight=null,this.railYRatio=null,this.reach={x:e.scrollLeft<=0?"start":e.scrollLeft>=this.contentWidth-this.containerWidth?"end":null,y:e.scrollTop<=0?"start":e.scrollTop>=this.contentHeight-this.containerHeight?"end":null},this.isAlive=!0,this.settings.handlers.forEach((function(e){return gd[e](n)})),this.lastScrollTop=Math.floor(e.scrollTop),this.lastScrollLeft=e.scrollLeft,this.event.bind(this.element,"scroll",(function(e){return n.onScroll(e)})),fd(this)};yd.prototype.update=function(){this.isAlive&&(this.negativeScrollAdjustment=this.isNegativeScroll?this.element.scrollWidth-this.element.clientWidth:0,Xp(this.scrollbarXRail,{display:"block"}),Xp(this.scrollbarYRail,{display:"block"}),this.railXMarginWidth=pd(Gp(this.scrollbarXRail).marginLeft)+pd(Gp(this.scrollbarXRail).marginRight),this.railYMarginHeight=pd(Gp(this.scrollbarYRail).marginTop)+pd(Gp(this.scrollbarYRail).marginBottom),Xp(this.scrollbarXRail,{display:"none"}),Xp(this.scrollbarYRail,{display:"none"}),fd(this),ud(this,"top",0,!1,!0),ud(this,"left",0,!1,!0),Xp(this.scrollbarXRail,{display:""}),Xp(this.scrollbarYRail,{display:""}))},yd.prototype.onScroll=function(e){this.isAlive&&(fd(this),ud(this,"top",this.element.scrollTop-this.lastScrollTop),ud(this,"left",this.element.scrollLeft-this.lastScrollLeft),this.lastScrollTop=Math.floor(this.element.scrollTop),this.lastScrollLeft=this.element.scrollLeft)},yd.prototype.destroy=function(){this.isAlive&&(this.event.unbindAll(),ed(this.scrollbarX),ed(this.scrollbarY),ed(this.scrollbarXRail),ed(this.scrollbarYRail),this.removePsClasses(),this.element=null,this.scrollbarX=null,this.scrollbarY=null,this.scrollbarXRail=null,this.scrollbarYRail=null,this.isAlive=!1)},yd.prototype.removePsClasses=function(){this.element.className=this.element.className.split(" ").filter((function(e){return!e.match(/^ps([-_].+|)$/)})).join(" ")};var vd=yd,bd=Object.defineProperty,xd=Object.getOwnPropertySymbols,wd=Object.prototype.hasOwnProperty,kd=Object.prototype.propertyIsEnumerable,Od=(e,t,n)=>t in e?bd(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;const Sd=vd||t;let Ed="";Qr&&(Ed=r(6232),Ed="function"==typeof Ed.toString&&Ed.toString()||"",Ed="[object Object]"===Ed?"":Ed);const _d=ua`${Ed}`,Ad=ha.div`
  position: relative;
`;class jd extends n.Component{constructor(){super(...arguments),this.handleRef=e=>{this._container=e}}componentDidMount(){const e=this._container.parentElement&&this._container.parentElement.scrollTop||0;this.inst=new Sd(this._container,this.props.options||{}),this._container.scrollTo&&this._container.scrollTo(0,e)}componentDidUpdate(){this.inst.update()}componentWillUnmount(){this.inst.destroy()}render(){const{children:e,className:t,updateFn:r}=this.props;return r&&r(this.componentDidUpdate.bind(this)),n.createElement(n.Fragment,null,Ed&&n.createElement(_d,null),n.createElement(Ad,{className:`scrollbar-container ${t}`,ref:this.handleRef},e))}}function Cd(e){return n.createElement(Oa.Consumer,null,(t=>t.nativeScrollbars?n.createElement("div",{style:{overflow:"auto",overscrollBehavior:"contain",msOverflowStyle:"-ms-autohiding-scrollbar"}},e.children):n.createElement(jd,((e,t)=>{for(var n in t||(t={}))wd.call(t,n)&&Od(e,n,t[n]);if(xd)for(var n of xd(t))kd.call(t,n)&&Od(e,n,t[n]);return e})({},e),e.children)))}const Pd=ha((({className:e,style:t})=>n.createElement("svg",{className:e,style:t,xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},n.createElement("polyline",{points:"6 9 12 15 18 9"}))))`
  position: absolute;
  pointer-events: none;
  z-index: 1;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 8px;
  margin: auto;
  text-align: center;
  polyline {
    color: ${e=>"dark"===e.variant&&"white"};
  }
`,Td=n.memo((e=>{const{options:t,onChange:r,placeholder:i,value:o="",variant:a,className:s}=e;return n.createElement("div",{className:s},n.createElement(Pd,{variant:a}),n.createElement("select",{onChange:e=>{const{selectedIndex:n}=e.target;r(t[i?n-1:n])},value:o,className:"dropdown-select"},i&&n.createElement("option",{disabled:!0,hidden:!0,value:i},i),t.map((({idx:e,value:t,title:r},i)=>n.createElement("option",{key:e||t+i,value:t},r||t)))),n.createElement("label",null,o))})),Rd=sa(Td)`
  label {
    box-sizing: border-box;
    min-width: 100px;
    outline: none;
    display: inline-block;
    font-family: ${e=>e.theme.typography.headings.fontFamily};
    color: ${({theme:e})=>e.colors.text.primary};
    vertical-align: bottom;
    width: ${({fullWidth:e})=>e?"100%":"auto"};
    text-transform: none;
    padding: 0 22px 0 4px;

    font-size: 0.929em;
    line-height: 1.5em;
    font-family: inherit;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .dropdown-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    border: none;
    appearance: none;
    cursor: pointer;

    color: ${({theme:e})=>e.colors.text.primary};
    line-height: inherit;
    font-family: inherit;
  }
  box-sizing: border-box;
  min-width: 100px;
  outline: none;
  display: inline-block;
  border-radius: 2px;
  border: 1px solid rgba(38, 50, 56, 0.5);
  vertical-align: bottom;
  padding: 2px 0px 2px 6px;
  position: relative;
  width: auto;
  background: white;
  color: #263238;
  font-family: ${e=>e.theme.typography.headings.fontFamily};
  font-size: 0.929em;
  line-height: 1.5em;
  cursor: pointer;
  transition: border 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;

  &:hover,
  &:focus-within {
    border: 1px solid ${e=>e.theme.colors.primary.main};
    color: ${e=>e.theme.colors.primary.main};
    box-shadow: 0px 0px 0px 1px ${e=>e.theme.colors.primary.main};
  }
`,Id=sa(Rd)`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.969em;

  font-size: 1em;
  border: none;
  padding: 0 1.2em 0 0;
  background: transparent;

  &:hover,
  &:focus-within {
    border: none;
    box-shadow: none;
    label {
      color: ${e=>e.theme.colors.primary.main};
      text-shadow: 0px 0px 0px ${e=>e.theme.colors.primary.main};
    }
  }
`,$d=sa.span`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.929em;
  color: black;
`;var Nd=Object.defineProperty,Ld=Object.defineProperties,Dd=Object.getOwnPropertyDescriptors,Md=Object.getOwnPropertySymbols,Fd=Object.prototype.hasOwnProperty,zd=Object.prototype.propertyIsEnumerable,Ud=(e,t,n)=>t in e?Nd(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Bd=(e,t)=>{for(var n in t||(t={}))Fd.call(t,n)&&Ud(e,n,t[n]);if(Md)for(var n of Md(t))zd.call(t,n)&&Ud(e,n,t[n]);return e},qd=(e,t)=>Ld(e,Dd(t));class Vd{constructor(e,t,n){this.operations=[];const{resolved:r}=e.deref(n||{});this.initWebhooks(e,r,t)}initWebhooks(e,t,n){for(const r of Object.keys(t)){const i=t[r],o=Object.keys(i).filter(Xa);for(const t of o){const r=i[t];if(i.$ref){const r=e.deref(i||{});this.initWebhooks(e,{[t]:r},n)}if(!r)continue;const o=new Ou(e,qd(Bd({},r),{httpVerb:t}),void 0,n,!1);this.operations.push(o)}}}}class Wd{constructor(e,t,n){const{resolved:r}=e.deref(n);this.id=t,this.sectionId=fs+t,this.type=r.type,this.displayName=r["x-displayName"]||t,this.description=r.description||"","apiKey"===r.type&&(this.apiKey={name:r.name,in:r.in}),"http"===r.type&&(this.http={scheme:r.scheme,bearerFormat:r.bearerFormat}),"openIdConnect"===r.type&&(this.openId={connectUrl:r.openIdConnectUrl}),"oauth2"===r.type&&r.flows&&(this.flows=r.flows)}}class Hd{constructor(e){const t=e.spec.components&&e.spec.components.securitySchemes||{};this.schemes=Object.keys(t).map((n=>new Wd(e,n,t[n])))}}var Yd=Object.defineProperty,Qd=Object.getOwnPropertySymbols,Gd=Object.prototype.hasOwnProperty,Xd=Object.prototype.propertyIsEnumerable,Kd=(e,t,n)=>t in e?Yd(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Zd=(e,t)=>{for(var n in t||(t={}))Gd.call(t,n)&&Kd(e,n,t[n]);if(Qd)for(var n of Qd(t))Xd.call(t,n)&&Kd(e,n,t[n]);return e};class Jd{constructor(e,t,n){var r,i,o;this.options=n,this.parser=new fc(e,t,n),this.info=new $l(this.parser,this.options),this.externalDocs=this.parser.spec.externalDocs,this.contentItems=hf.buildStructure(this.parser,this.options),this.securitySchemes=new Hd(this.parser);const a=Zd(Zd({},null==(i=null==(r=this.parser)?void 0:r.spec)?void 0:i["x-webhooks"]),null==(o=this.parser)?void 0:o.spec.webhooks);this.webhooks=new Vd(this.parser,n,a)}}var ef=Object.defineProperty,tf=Object.getOwnPropertyDescriptor,nf=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?tf(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&ef(t,n,o),o};class rf{constructor(e,t,n){this.items=[],this.active=!1,this.expanded=!1,nn(this),this.id=t.id||e+"/"+ai(t.name),this.type=e,this.name=t["x-displayName"]||t.name,this.level=t.level||1,this.sidebarLabel=this.name,this.description=t.description||"";const r=t.items;r&&r.length&&(this.description=Rl.getTextBeforeHading(this.description,r[0].name)),this.parent=n,this.externalDocs=t.externalDocs,"group"===this.type&&(this.expanded=!0)}activate(){this.active=!0}expand(){this.parent&&this.parent.expand(),this.expanded=!0}collapse(){"group"!==this.type&&(this.expanded=!1)}deactivate(){this.active=!1}}nf([Ce],rf.prototype,"active",2),nf([Ce],rf.prototype,"expanded",2),nf([jt],rf.prototype,"activate",1),nf([jt],rf.prototype,"expand",1),nf([jt],rf.prototype,"collapse",1),nf([jt],rf.prototype,"deactivate",1);var of=Object.defineProperty,af=Object.defineProperties,sf=Object.getOwnPropertyDescriptors,lf=Object.getOwnPropertySymbols,cf=Object.prototype.hasOwnProperty,uf=Object.prototype.propertyIsEnumerable,pf=(e,t,n)=>t in e?of(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,df=(e,t)=>{for(var n in t||(t={}))cf.call(t,n)&&pf(e,n,t[n]);if(lf)for(var n of lf(t))uf.call(t,n)&&pf(e,n,t[n]);return e},ff=(e,t)=>af(e,sf(t));class hf{static buildStructure(e,t){const n=e.spec,r=[],i=hf.getTagsWithOperations(e,n);return r.push(...hf.addMarkdownItems(n.info.description||"",void 0,1,t)),n["x-tagGroups"]&&n["x-tagGroups"].length>0?r.push(...hf.getTagGroupsItems(e,void 0,n["x-tagGroups"],i,t)):r.push(...hf.getTagsItems(e,i,void 0,void 0,t)),r}static addMarkdownItems(e,t,n,r){const i=new Rl(r,null==t?void 0:t.id).extractHeadings(e||"");i.length&&t&&t.description&&(t.description=Rl.getTextBeforeHading(t.description,i[0].name));const o=(e,t,n=1)=>t.map((t=>{const r=new rf("section",t,e);return r.depth=n,t.items&&(r.items=o(r,t.items,n+1)),r}));return o(t,i,n)}static getTagGroupsItems(e,t,n,r,i){const o=[];for(const a of n){const n=new rf("group",a,t);n.depth=0,n.items=hf.getTagsItems(e,r,n,a,i),o.push(n)}return o}static getTagsItems(e,t,n,r,i){let o;o=void 0===r?Object.keys(t):r.tags;const a=o.map((e=>t[e]?(t[e].used=!0,t[e]):(console.warn(`Non-existing tag "${e}" is added to the group "${r.name}"`),null))),s=[];for(const t of a){if(!t)continue;const r=new rf("tag",t,n);if(r.depth=1,""===t.name){const n=[...hf.addMarkdownItems(t.description||"",r,r.depth+1,i),...this.getOperationsItems(e,void 0,t,r.depth+1,i)];s.push(...n);continue}const o=this.getTagRelatedSchema({parser:e,tag:t,parent:r});r.items=[...o,...hf.addMarkdownItems(t.description||"",r,r.depth+1,i),...this.getOperationsItems(e,r,t,r.depth+1,i)],s.push(r)}return i.sortTagsAlphabetically&&s.sort(Ps("name")),s}static getOperationsItems(e,t,n,r,i){if(0===n.operations.length)return[];const o=[];for(const a of n.operations){const n=new Ou(e,a,t,i);n.depth=r,o.push(n)}return i.sortOperationsAlphabetically&&o.sort(Ps("name")),o}static getTagsWithOperations(e,t){const n={},r=t["x-webhooks"]||t.webhooks;for(const e of t.tags||[])n[e.name]=ff(df({},e),{operations:[]});function i(e,t,r){for(const o of Object.keys(t)){const a=t[o],s=Object.keys(a).filter(Xa);for(const t of s){const s=a[t];if(a.$ref){const{resolved:t}=e.deref(a);i(e,{[o]:t},r);continue}let l=null==s?void 0:s.tags;l&&l.length||(l=[""]);for(const e of l){let i=n[e];void 0===i&&(i={name:e,operations:[]},n[e]=i),i["x-traitTag"]||i.operations.push(ff(df({},s),{pathName:o,pointer:Na.compile(["paths",o,t]),httpVerb:t,pathParameters:a.parameters||[],pathServers:a.servers,isWebhook:!!r}))}}}}return r&&i(e,r,!0),t.paths&&i(e,t.paths),n}static getTagRelatedSchema({parser:e,tag:t,parent:n}){var r;return Object.entries((null==(r=e.spec.components)?void 0:r.schemas)||{}).map((([e,r])=>{const i=r["x-tags"];if(!(null==i?void 0:i.includes(t.name)))return null;const o=new rf("schema",{name:e,"x-displayName":`${r.title||e}`,description:`<SchemaDefinition showWriteOnly={true} schemaRef="#/components/schemas/${e}" />`},n);return o.depth=n.depth+1,o})).filter(Boolean)}}var mf=Object.defineProperty,gf=Object.getOwnPropertyDescriptor,yf=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?gf(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&mf(t,n,o),o};const vf="data-section-id";class bf{constructor(e,t,n){this.scroll=t,this.history=n,this.activeItemIdx=-1,this.sideBarOpened=!1,this.updateOnScroll=e=>{const t=e?1:-1;let n=this.activeItemIdx;for(;(-1!==n||e)&&!(n>=this.flatItems.length-1&&e);){if(e){const e=this.getElementAtOrFirstChild(n+1);if(this.scroll.isElementBellow(e))break}else{const e=this.getElementAt(n);if(this.scroll.isElementAbove(e))break}n+=t}this.activate(this.flatItems[n],!0,!0)},this.updateOnHistory=(e=this.history.currentId)=>{if(!e)return;let t;t=this.flatItems.find((t=>t.id===e)),t?this.activateAndScroll(t,!1):(e.startsWith(fs)&&(t=this.flatItems.find((e=>fs.startsWith(e.id))),this.activateAndScroll(t,!1)),this.scroll.scrollIntoViewBySelector(`[${vf}="${li(e)}"]`))},this.getItemById=e=>this.flatItems.find((t=>t.id===e)),nn(this),this.items=e.contentItems,this.flatItems=function(e,t){const n=[],r=e=>{for(const i of e)n.push(i),i[t]&&r(i[t])};return r(e),n}(this.items||[],"items"),this.flatItems.forEach(((e,t)=>e.absoluteIdx=t)),this.subscribe()}static updateOnHistory(e=Ns.currentId,t){e&&t.scrollIntoViewBySelector(`[${vf}="${li(e)}"]`)}subscribe(){this._unsubscribe=this.scroll.subscribe(this.updateOnScroll),this._hashUnsubscribe=this.history.subscribe(this.updateOnHistory)}toggleSidebar(){this.sideBarOpened=!this.sideBarOpened}closeSidebar(){this.sideBarOpened=!1}getElementAt(e){const t=this.flatItems[e];return t&&Gr(`[${vf}="${li(t.id)}"]`)||null}getElementAtOrFirstChild(e){let t=this.flatItems[e];return t&&"group"===t.type&&(t=t.items[0]),t&&Gr(`[${vf}="${li(t.id)}"]`)||null}get activeItem(){return this.flatItems[this.activeItemIdx]||void 0}activate(e,t=!0,n=!1){if((this.activeItem&&this.activeItem.id)!==(e&&e.id)&&(!e||"group"!==e.type)){if(this.deactivate(this.activeItem),!e)return this.activeItemIdx=-1,void this.history.replace("",n);e.depth<=0||(this.activeItemIdx=e.absoluteIdx,t&&this.history.replace(encodeURI(e.id),n),e.activate(),e.expand())}}deactivate(e){if(void 0!==e)for(e.deactivate();void 0!==e;)e.collapse(),e=e.parent}activateAndScroll(e,t,n){const r=e&&this.getItemById(e.id)||e;this.activate(r,t,n),this.scrollToActive(),r&&r.items.length||this.closeSidebar()}scrollToActive(){this.scroll.scrollIntoView(this.getElementAt(this.activeItemIdx))}dispose(){this._unsubscribe(),this._hashUnsubscribe()}}yf([Ce],bf.prototype,"activeItemIdx",2),yf([Ce],bf.prototype,"sideBarOpened",2),yf([jt],bf.prototype,"toggleSidebar",1),yf([jt],bf.prototype,"closeSidebar",1),yf([jt],bf.prototype,"activate",1),yf([jt.bound],bf.prototype,"activateAndScroll",1);var xf=Object.defineProperty,wf=Object.getOwnPropertyDescriptor;const kf="scroll";class Of{constructor(e){this.options=e,this._prevOffsetY=0,this._scrollParent=Qr?window:void 0,this._emiter=new Ta,this.bind()}bind(){this._prevOffsetY=this.scrollY(),this._scrollParent&&this._scrollParent.addEventListener("scroll",this.handleScroll)}dispose(){this._scrollParent&&this._scrollParent.removeEventListener("scroll",this.handleScroll),this._emiter.removeAllListeners(kf)}scrollY(){return"undefined"!=typeof HTMLElement&&this._scrollParent instanceof HTMLElement?this._scrollParent.scrollTop:void 0!==this._scrollParent?this._scrollParent.pageYOffset:0}isElementBellow(e){if(null!==e)return e.getBoundingClientRect().top>this.options.scrollYOffset()}isElementAbove(e){if(null===e)return;const t=e.getBoundingClientRect().top;return(t>0?Math.floor(t):Math.ceil(t))<=this.options.scrollYOffset()}subscribe(e){const t=this._emiter.addListener(kf,e);return()=>t.removeListener(kf,e)}scrollIntoView(e){null!==e&&(e.scrollIntoView(),this._scrollParent&&this._scrollParent.scrollBy&&this._scrollParent.scrollBy(0,1-this.options.scrollYOffset()))}scrollIntoViewBySelector(e){const t=Gr(e);this.scrollIntoView(t)}handleScroll(){const e=this.scrollY()-this._prevOffsetY>0;this._prevOffsetY=this.scrollY(),this._emiter.emit(kf,e)}}((e,t,n,r)=>{for(var i,o=wf(t,n),a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(t,n,o)||o);o&&xf(t,n,o)})([Pa.bind,(100,(e,t,n)=>{n.value=function(e,t){let n,r,i,o=null,a=0;const s=()=>{a=(new Date).getTime(),o=null,i=e.apply(n,r),o||(n=r=null)};return function(){const t=(new Date).getTime(),l=100-(t-a);return n=this,r=arguments,l<=0||l>100?(o&&(clearTimeout(o),o=null),a=t,i=e.apply(n,r),o||(n=r=null)):o||(o=setTimeout(s,l)),i}}(n.value)})],Of.prototype,"handleScroll");class Sf{constructor(){this.searchWorker=function(){let e;if(Qr)try{e=r(6595)}catch(t){e=r(4798).default}else e=r(4798).default;return new e}()}indexItems(e){const t=e=>{e.forEach((e=>{"group"!==e.type&&this.add(e.name,(e.description||"").concat(" ",e.path||""),e.id),t(e.items)}))};t(e),this.searchWorker.done()}add(e,t,n){this.searchWorker.add(e,t,n)}dispose(){this.searchWorker.terminate(),this.searchWorker.dispose()}search(e){return this.searchWorker.search(e)}toJS(){return e=this,null,t=function*(){return this.searchWorker.toJS()},new Promise(((n,r)=>{var i=e=>{try{a(t.next(e))}catch(e){r(e)}},o=e=>{try{a(t.throw(e))}catch(e){r(e)}},a=e=>e.done?n(e.value):Promise.resolve(e.value).then(i,o);a((t=t.apply(e,null)).next())}));var e,t}load(e){this.searchWorker.load(e)}fromExternalJS(e,t){e&&t&&this.searchWorker.fromExternalJS(e,t)}}var Ef=Object.defineProperty,_f=Object.getOwnPropertySymbols,Af=Object.prototype.hasOwnProperty,jf=Object.prototype.propertyIsEnumerable,Cf=(e,t,n)=>t in e?Ef(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Pf=(e,t)=>{for(var n in t||(t={}))Af.call(t,n)&&Cf(e,n,t[n]);if(_f)for(var n of _f(t))jf.call(t,n)&&Cf(e,n,t[n]);return e};function Tf(e){const{Label:t=$d,Dropdown:r=Id}=e;return 1===e.options.length?n.createElement(t,null,e.options[0].value):n.createElement(r,Pf({},e))}var Rf=r(7856);const If=ca`
  a {
    text-decoration: ${e=>e.theme.typography.links.textDecoration};
    color: ${e=>e.theme.typography.links.color};

    &:visited {
      color: ${e=>e.theme.typography.links.visited};
    }

    &:hover {
      color: ${e=>e.theme.typography.links.hover};
      text-decoration: ${e=>e.theme.typography.links.hoverTextDecoration};
    }
  }
`,$f=ha(Wp)`
  font-family: ${e=>e.theme.typography.fontFamily};
  font-weight: ${e=>e.theme.typography.fontWeightRegular};
  line-height: ${e=>e.theme.typography.lineHeight};

  p {
    &:last-child {
      margin-bottom: 0;
    }
  }

  ${({$compact:e})=>e&&"\n    p:first-child {\n      margin-top: 0;\n    }\n    p:last-child {\n      margin-bottom: 0;\n    }\n  "}

  ${({$inline:e})=>e&&" p {\n    display: inline-block;\n  }"}

  h1 {
    ${Pu(1)};
    color: ${e=>e.theme.colors.primary.main};
    margin-top: 0;
  }

  h2 {
    ${Pu(2)};
    color: ${e=>e.theme.colors.text.primary};
  }

  code {
    color: ${({theme:e})=>e.typography.code.color};
    background-color: ${({theme:e})=>e.typography.code.backgroundColor};

    font-family: ${e=>e.theme.typography.code.fontFamily};
    border-radius: 2px;
    border: 1px solid rgba(38, 50, 56, 0.1);
    padding: 0 ${({theme:e})=>e.spacing.unit}px;
    font-size: ${e=>e.theme.typography.code.fontSize};
    font-weight: ${({theme:e})=>e.typography.code.fontWeight};

    word-break: break-word;
  }

  pre {
    font-family: ${e=>e.theme.typography.code.fontFamily};
    white-space: ${({theme:e})=>e.typography.code.wrap?"pre-wrap":"pre"};
    background-color: ${({theme:e})=>e.codeBlock.backgroundColor};
    color: white;
    padding: ${e=>4*e.theme.spacing.unit}px;
    overflow-x: auto;
    line-height: normal;
    border-radius: 0;
    border: 1px solid rgba(38, 50, 56, 0.1);

    code {
      background-color: transparent;
      color: white;
      padding: 0;

      &:before,
      &:after {
        content: none;
      }
    }
  }

  blockquote {
    margin: 0;
    margin-bottom: 1em;
    padding: 0 15px;
    color: #777;
    border-left: 4px solid #ddd;
  }

  img {
    max-width: 100%;
    box-sizing: content-box;
  }

  ul,
  ol {
    padding-left: 2em;
    margin: 0;
    margin-bottom: 1em;

    ul,
    ol {
      margin-bottom: 0;
      margin-top: 0;
    }
  }

  table {
    display: block;
    width: 100%;
    overflow: auto;
    word-break: normal;
    word-break: keep-all;
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }

  table tr {
    background-color: #fff;
    border-top: 1px solid #ccc;

    &:nth-child(2n) {
      background-color: ${({theme:e})=>e.schema.nestedBackground};
    }
  }

  table th,
  table td {
    padding: 6px 13px;
    border: 1px solid #ddd;
  }

  table th {
    text-align: left;
    font-weight: bold;
  }

  ${Fu(".share-link")};

  ${If}

  ${ma("Markdown")};
`;var Nf=Object.defineProperty,Lf=Object.defineProperties,Df=Object.getOwnPropertyDescriptors,Mf=Object.getOwnPropertySymbols,Ff=Object.prototype.hasOwnProperty,zf=Object.prototype.propertyIsEnumerable,Uf=(e,t,n)=>t in e?Nf(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Bf=(e,t)=>{for(var n in t||(t={}))Ff.call(t,n)&&Uf(e,n,t[n]);if(Mf)for(var n of Mf(t))zf.call(t,n)&&Uf(e,n,t[n]);return e};const qf=sa((e=>n.createElement($f,Bf({},e))))`
  display: inline;
`;function Vf(e){var t=e,{inline:r,compact:i}=t,o=((e,t)=>{var n={};for(var r in e)Ff.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&Mf)for(var r of Mf(e))t.indexOf(r)<0&&zf.call(e,r)&&(n[r]=e[r]);return n})(t,["inline","compact"]);const a=r?qf:$f;return n.createElement(Ea,null,(e=>{return n.createElement(a,((e,t)=>Lf(e,Df(t)))(Bf({className:"redoc-markdown "+(o.className||""),dangerouslySetInnerHTML:{__html:(t=e.untrustedSpec,s=o.html,t?Rf.sanitize(s):s)},"data-role":o["data-role"]},o),{$inline:r,$compact:i}));var t,s}))}class Wf extends n.Component{render(){const{source:e,inline:t,compact:r,className:i,"data-role":o}=this.props,a=new Rl;return n.createElement(Vf,{html:a.renderMd(e),inline:t,compact:r,className:i,"data-role":o})}}const Hf=ha.div`
  position: relative;
`,Yf=ha.div`
  position: absolute;
  min-width: 80px;
  max-width: 500px;
  background: #fff;
  bottom: 100%;
  left: 50%;
  margin-bottom: 10px;
  transform: translateX(-50%);

  border-radius: 4px;
  padding: 0.3em 0.6em;
  text-align: center;
  box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);
`,Qf=ha.div`
  background: #fff;
  color: #000;
  display: inline;
  font-size: 0.85em;
  white-space: nowrap;
`,Gf=ha.div`
  position: absolute;
  width: 0;
  height: 0;
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  border-left: solid transparent 5px;
  border-right: solid transparent 5px;
  border-top: solid #fff 5px;
`,Xf=ha.div`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: -20px;
`;class Kf extends n.Component{render(){const{open:e,title:t,children:r}=this.props;return n.createElement(Hf,null,r,e&&n.createElement(Yf,null,n.createElement(Qf,null,t),n.createElement(Gf,null),n.createElement(Xf,null)))}}const Zf="undefined"!=typeof document&&document.queryCommandSupported&&document.queryCommandSupported("copy");class Jf{static isSupported(){return Zf}static selectElement(e){let t,n;document.body.createTextRange?(t=document.body.createTextRange(),t.moveToElementText(e),t.select()):document.createRange&&window.getSelection&&(n=window.getSelection(),t=document.createRange(),t.selectNodeContents(e),n.removeAllRanges(),n.addRange(t))}static deselect(){if(document.selection)document.selection.empty();else if(window.getSelection){const e=window.getSelection();e&&e.removeAllRanges()}}static copySelected(){let e;try{e=document.execCommand("copy")}catch(t){e=!1}return e}static copyElement(e){Jf.selectElement(e);const t=Jf.copySelected();return t&&Jf.deselect(),t}static copyCustom(e){const t=document.createElement("textarea");t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="2em",t.style.height="2em",t.style.padding="0",t.style.border="none",t.style.outline="none",t.style.boxShadow="none",t.style.background="transparent",t.value=e,document.body.appendChild(t),t.select();const n=Jf.copySelected();return document.body.removeChild(t),n}}const eh=e=>{const[t,r]=n.useState(!1),i=()=>{const t="string"==typeof e.data?e.data:JSON.stringify(e.data,null,2);Jf.copyCustom(t),o()},o=()=>{r(!0),setTimeout((()=>{r(!1)}),1500)};return e.children({renderCopyButton:()=>n.createElement("button",{onClick:i},n.createElement(Kf,{title:Jf.isSupported()?"Copied":"Not supported in your browser",open:t},"Copy"))})};let th=1;function nh(e,t){th=1;let n="";return n+='<div class="redoc-json">',n+="<code>",n+=sh(e,t),n+="</code>",n+="</div>",n}function rh(e){return void 0!==e?e.toString().replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}function ih(e){return JSON.stringify(e).slice(1,-1)}function oh(e,t){return'<span class="'+t+'">'+rh(e)+"</span>"}function ah(e){return'<span class="token punctuation">'+e+"</span>"}function sh(e,t){const n=typeof e;let r="";return null==e?r+=oh("null","token keyword"):e&&e.constructor===Array?(th++,r+=function(e,t){const n=th>t?"collapsed":"";let r=`<button class="collapser" aria-label="${th>t+1?"expand":"collapse"}"></button>${ah("[")}<span class="ellipsis"></span><ul class="array collapsible">`,i=!1;const o=e.length;for(let a=0;a<o;a++)i=!0,r+='<li><div class="hoverable '+n+'">',r+=sh(e[a],t),a<o-1&&(r+=","),r+="</div></li>";return r+=`</ul>${ah("]")}`,i||(r=ah("[ ]")),r}(e,t),th--):e&&e.constructor===Date?r+=oh('"'+e.toISOString()+'"',"token string"):"object"===n?(th++,r+=function(e,t){const n=th>t?"collapsed":"",r=Object.keys(e),i=r.length;let o=`<button class="collapser" aria-label="${th>t+1?"expand":"collapse"}"></button>${ah("{")}<span class="ellipsis"></span><ul class="obj collapsible">`,a=!1;for(let s=0;s<i;s++){const l=r[s];a=!0,o+='<li><div class="hoverable '+n+'">',o+='<span class="property token string">"'+rh(l)+'"</span>: ',o+=sh(e[l],t),s<i-1&&(o+=ah(",")),o+="</div></li>"}return o+=`</ul>${ah("}")}`,a||(o=ah("{ }")),o}(e,t),th--):"number"===n?r+=oh(e,"token number"):"string"===n?/^(http|https):\/\/[^\s]+$/.test(e)?r+=oh('"',"token string")+'<a href="'+encodeURI(e)+'">'+rh(ih(e))+"</a>"+oh('"',"token string"):r+=oh('"'+ih(e)+'"',"token string"):"boolean"===n&&(r+=oh(e,"token boolean")),r}const lh=ca`
  .redoc-json code > .collapser {
    display: none;
    pointer-events: none;
  }

  font-family: ${e=>e.theme.typography.code.fontFamily};
  font-size: ${e=>e.theme.typography.code.fontSize};

  white-space: ${({theme:e})=>e.typography.code.wrap?"pre-wrap":"pre"};
  contain: content;
  overflow-x: auto;

  .callback-function {
    color: gray;
  }

  .collapser:after {
    content: '-';
    cursor: pointer;
  }

  .collapsed > .collapser:after {
    content: '+';
    cursor: pointer;
  }

  .ellipsis:after {
    content: ' … ';
  }

  .collapsible {
    margin-left: 2em;
  }

  .hoverable {
    padding-top: 1px;
    padding-bottom: 1px;
    padding-left: 2px;
    padding-right: 2px;
    border-radius: 2px;
  }

  .hovered {
    background-color: rgba(235, 238, 249, 1);
  }

  .collapser {
    background-color: transparent;
    border: 0;
    color: #fff;
    font-family: ${e=>e.theme.typography.code.fontFamily};
    font-size: ${e=>e.theme.typography.code.fontSize};
    padding-right: 6px;
    padding-left: 6px;
    padding-top: 0;
    padding-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    position: absolute;
    top: 4px;
    left: -1.5em;
    cursor: default;
    user-select: none;
    -webkit-user-select: none;
    padding: 2px;
    &:focus {
      outline-color: #fff;
      outline-style: dotted;
      outline-width: 1px;
    }
  }

  ul {
    list-style-type: none;
    padding: 0px;
    margin: 0px 0px 0px 26px;
  }

  li {
    position: relative;
    display: block;
  }

  .hoverable {
    display: inline-block;
  }

  .selected {
    outline-style: solid;
    outline-width: 1px;
    outline-style: dotted;
  }

  .collapsed > .collapsible {
    display: none;
  }

  .ellipsis {
    display: none;
  }

  .collapsed > .ellipsis {
    display: inherit;
  }
`,ch=ha.div`
  &:hover > ${Hp} {
    opacity: 1;
  }
`,uh=ha((e=>{const[t,r]=n.useState(),i=({renderCopyButton:t})=>{const i=e.data&&Object.values(e.data).some((e=>"object"==typeof e&&null!==e));return n.createElement(ch,null,n.createElement(Hp,null,t(),i&&n.createElement(n.Fragment,null,n.createElement("button",{onClick:o}," Expand all "),n.createElement("button",{onClick:a}," Collapse all "))),n.createElement(Oa.Consumer,null,(t=>n.createElement(Wp,{className:e.className,ref:e=>r(e),dangerouslySetInnerHTML:{__html:nh(e.data,t.jsonSampleExpandLevel)}}))))},o=()=>{const e=null==t?void 0:t.getElementsByClassName("collapsible");for(const t of Array.prototype.slice.call(e)){const e=t.parentNode;e.classList.remove("collapsed"),e.querySelector(".collapser").setAttribute("aria-label","collapse")}},a=()=>{const e=null==t?void 0:t.getElementsByClassName("collapsible"),n=Array.prototype.slice.call(e,1);for(const e of n){const t=e.parentNode;t.classList.add("collapsed"),t.querySelector(".collapser").setAttribute("aria-label","expand")}},s=e=>{let t;"collapser"===e.className&&(t=e.parentElement.getElementsByClassName("collapsible")[0],t.parentElement.classList.contains("collapsed")?(t.parentElement.classList.remove("collapsed"),e.setAttribute("aria-label","collapse")):(t.parentElement.classList.add("collapsed"),e.setAttribute("aria-label","expand")))},l=n.useCallback((e=>{s(e.target)}),[]),c=n.useCallback((e=>{"Enter"===e.key&&s(e.target)}),[]);return n.useEffect((()=>(null==t||t.addEventListener("click",l),null==t||t.addEventListener("focus",c),()=>{null==t||t.removeEventListener("click",l),null==t||t.removeEventListener("focus",c)})),[l,c,t]),n.createElement(eh,{data:e.data},i)}))`
  ${lh};
`,ph=e=>{const{source:t,lang:r}=e;return n.createElement(Qp,{dangerouslySetInnerHTML:{__html:vs(t,r)}})},dh=e=>{const{source:t,lang:r}=e;return n.createElement(eh,{data:t},(({renderCopyButton:e})=>n.createElement(Yp,null,n.createElement(Hp,null,e()),n.createElement(ph,{lang:r,source:t}))))};function fh({value:e,mimeType:t}){return Ja(t)?n.createElement(uh,{data:e}):("object"==typeof e&&(e=JSON.stringify(e,null,2)),n.createElement(dh,{lang:(r=t,-1!==r.search(/xml/i)?"xml":-1!==r.search(/csv/i)?"csv":-1!==r.search(/plain/i)?"tex":"clike"),source:e}));var r}var hh=(e,t,n)=>new Promise(((r,i)=>{var o=e=>{try{s(n.next(e))}catch(e){i(e)}},a=e=>{try{s(n.throw(e))}catch(e){i(e)}},s=e=>e.done?r(e.value):Promise.resolve(e.value).then(o,a);s((n=n.apply(e,t)).next())}));function mh({example:e,mimeType:t}){return void 0===e.value&&e.externalValueUrl?n.createElement(gh,{example:e,mimeType:t}):n.createElement(fh,{value:e.value,mimeType:t})}function gh({example:e,mimeType:t}){const r=function(e,t){const[,r]=(0,n.useState)(!0),i=(0,n.useRef)(void 0),o=(0,n.useRef)(void 0);return o.current!==e&&(i.current=void 0),o.current=e,(0,n.useEffect)((()=>{(()=>{hh(this,null,(function*(){r(!0);try{i.current=yield e.getExternalValue(t)}catch(e){i.current=e}r(!1)}))})()}),[e,t]),i.current}(e,t);return void 0===r?n.createElement("span",null,"Loading..."):r instanceof Error?n.createElement(Qp,null,"Error loading external example: ",n.createElement("br",null),n.createElement("a",{className:"token string",href:e.externalValueUrl,target:"_blank",rel:"noopener noreferrer"},e.externalValueUrl)):n.createElement(fh,{value:r,mimeType:t})}const yh=ha.div`
  padding: 0.9em;
  background-color: ${({theme:e})=>Wr(.6,e.rightPanel.backgroundColor)};
  margin: 0 0 10px 0;
  display: block;
  font-family: ${({theme:e})=>e.typography.headings.fontFamily};
  font-size: 0.929em;
  line-height: 1.5em;
`,vh=ha.span`
  font-family: ${({theme:e})=>e.typography.headings.fontFamily};
  font-size: 12px;
  position: absolute;
  z-index: 1;
  top: -11px;
  left: 12px;
  font-weight: ${({theme:e})=>e.typography.fontWeightBold};
  color: ${({theme:e})=>Wr(.3,e.rightPanel.textColor)};
`,bh=ha.div`
  position: relative;
`,xh=ha(Rd)`
  label {
    color: ${({theme:e})=>e.rightPanel.textColor};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 1em;
    text-transform: none;
    border: none;
  }
  margin: 0 0 10px 0;
  display: block;
  background-color: ${({theme:e})=>Wr(.6,e.rightPanel.backgroundColor)};
  border: none;
  padding: 0.9em 1.6em 0.9em 0.9em;
  box-shadow: none;
  &:hover,
  &:focus-within {
    border: none;
    box-shadow: none;
    background-color: ${({theme:e})=>Wr(.3,e.rightPanel.backgroundColor)};
  }
`,wh=ha.div`
  font-family: ${e=>e.theme.typography.code.fontFamily};
  font-size: 12px;
  color: #ee807f;
`;class kh extends n.Component{constructor(){super(...arguments),this.state={activeIdx:0},this.switchMedia=({idx:e})=>{void 0!==e&&this.setState({activeIdx:e})}}render(){const{activeIdx:e}=this.state,t=this.props.mediaType.examples||{},r=this.props.mediaType.name,i=n.createElement(wh,null,"No sample"),o=Object.keys(t);if(0===o.length)return i;if(o.length>1){const i=o.map(((e,n)=>({value:t[e].summary||e,idx:n}))),a=t[o[e]],s=a.description;return n.createElement(Oh,null,n.createElement(bh,null,n.createElement(vh,null,"Example"),this.props.renderDropdown({value:i[e].value,options:i,onChange:this.switchMedia,ariaLabel:"Example"})),n.createElement("div",null,s&&n.createElement(Wf,{source:s}),n.createElement(mh,{example:a,mimeType:r})))}{const e=t[o[0]];return n.createElement(Oh,null,e.description&&n.createElement(Wf,{source:e.description}),n.createElement(mh,{example:e,mimeType:r}))}}}const Oh=ha.div`
  margin-top: 15px;
`;if(!n.useState)throw new Error("mobx-react-lite requires React with Hooks support");if(!nn)throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");function Sh(e){e()}var Eh=function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,i,o=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)a.push(r.value)}catch(e){i={error:e}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return a},_h=[];function Ah(e){return Mt(Vn(e,t));var t}var jh="undefined"==typeof FinalizationRegistry?void 0:FinalizationRegistry;function Ch(e){return{reaction:e,mounted:!1,changedBeforeMount:!1,cleanAt:Date.now()+Ph}}var Ph=1e4,Th=jh?function(e){var t=new Map,n=1,r=new e((function(e){var n=t.get(e);n&&(n.reaction.dispose(),t.delete(e))}));return{addReactionToTrack:function(e,i,o){var a=n++;return r.register(o,a,e),e.current=Ch(i),e.current.finalizationRegistryCleanupToken=a,t.set(a,e.current),e.current},recordReactionAsCommitted:function(e){r.unregister(e),e.current&&e.current.finalizationRegistryCleanupToken&&t.delete(e.current.finalizationRegistryCleanupToken)},forceCleanupTimerToRunNowForTests:function(){},resetCleanupScheduleForTests:function(){}}}(jh):function(){var e,t=new Set;function n(){void 0===e&&(e=setTimeout(r,1e4))}function r(){e=void 0;var r=Date.now();t.forEach((function(e){var n=e.current;n&&r>=n.cleanAt&&(n.reaction.dispose(),e.current=null,t.delete(e))})),t.size>0&&n()}return{addReactionToTrack:function(e,r,i){var o;return e.current=Ch(r),o=e,t.add(o),n(),e.current},recordReactionAsCommitted:function(e){t.delete(e)},forceCleanupTimerToRunNowForTests:function(){e&&(clearTimeout(e),r())},resetCleanupScheduleForTests:function(){var n,r;if(t.size>0){try{for(var i=function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}(t),o=i.next();!o.done;o=i.next()){var a=o.value,s=a.current;s&&(s.reaction.dispose(),a.current=null)}}catch(e){n={error:e}}finally{try{o&&!o.done&&(r=i.return)&&r.call(i)}finally{if(n)throw n.error}}t.clear()}e&&(clearTimeout(e),e=void 0)}}}(),Rh=Th.addReactionToTrack,Ih=Th.recordReactionAsCommitted,$h=(Th.resetCleanupScheduleForTests,Th.forceCleanupTimerToRunNowForTests,!1);function Nh(){return $h}var Lh=function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,i,o=n.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)a.push(r.value)}catch(e){i={error:e}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return a};function Dh(e){return"observer"+e}var Mh=function(){};function Fh(e,t){if(void 0===t&&(t="observed"),Nh())return e();var r,i=Lh(n.useState(new Mh),1)[0],o=(r=Eh((0,n.useState)(0),2)[1],(0,n.useCallback)((function(){r((function(e){return e+1}))}),_h)),a=n.useRef(null);if(!a.current)var s=new mt(Dh(t),(function(){l.mounted?o():l.changedBeforeMount=!0})),l=Rh(a,s,i);var c,u,p=a.current.reaction;if(n.useDebugValue(p,Ah),n.useEffect((function(){return Ih(a),a.current?(a.current.mounted=!0,a.current.changedBeforeMount&&(a.current.changedBeforeMount=!1,o())):(a.current={reaction:new mt(Dh(t),(function(){o()})),mounted:!0,changedBeforeMount:!1,cleanAt:1/0},o()),function(){a.current.reaction.dispose(),a.current=null}}),[]),p.track((function(){try{c=e()}catch(e){u=e}})),u)throw u;return c}var zh=function(){return zh=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},zh.apply(this,arguments)};var Uh={$$typeof:!0,render:!0,compare:!0,type:!0};function Bh(e){var t=e.children,n=e.render,r=t||n;return"function"!=typeof r?null:Fh(r)}Bh.displayName="Observer",function(e){e||(e=Sh),Dt({reactionScheduler:e})}(o.unstable_batchedUpdates);var qh=0,Vh={};function Wh(e){return Vh[e]||(Vh[e]=function(e){if("function"==typeof Symbol)return Symbol(e);var t="__$mobx-react "+e+" ("+qh+")";return qh++,t}(e)),Vh[e]}function Hh(e,t){if(Yh(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var i=0;i<n.length;i++)if(!Object.hasOwnProperty.call(t,n[i])||!Yh(e[n[i]],t[n[i]]))return!1;return!0}function Yh(e,t){return e===t?0!==e||1/e==1/t:e!=e&&t!=t}function Qh(e,t,n){Object.hasOwnProperty.call(e,t)?e[t]=n:Object.defineProperty(e,t,{enumerable:!1,configurable:!0,writable:!0,value:n})}var Gh=Wh("patchMixins"),Xh=Wh("patchedDefinition");function Kh(e,t){for(var n=this,r=arguments.length,i=new Array(r>2?r-2:0),o=2;o<r;o++)i[o-2]=arguments[o];t.locks++;try{var a;return null!=e&&(a=e.apply(this,i)),a}finally{t.locks--,0===t.locks&&t.methods.forEach((function(e){e.apply(n,i)}))}}function Zh(e,t){return function(){for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];Kh.call.apply(Kh,[this,e,t].concat(r))}}function Jh(e,t,n){var r=function(e,t){var n=e[Gh]=e[Gh]||{},r=n[t]=n[t]||{};return r.locks=r.locks||0,r.methods=r.methods||[],r}(e,t);r.methods.indexOf(n)<0&&r.methods.push(n);var i=Object.getOwnPropertyDescriptor(e,t);if(!i||!i[Xh]){var o=e[t],a=em(e,t,i?i.enumerable:void 0,r,o);Object.defineProperty(e,t,a)}}function em(e,t,n,r,i){var o,a=Zh(i,r);return(o={})[Xh]=!0,o.get=function(){return a},o.set=function(i){if(this===e)a=Zh(i,r);else{var o=em(this,t,n,r,i);Object.defineProperty(this,t,o)}},o.configurable=!0,o.enumerable=n,o}var tm=W||"$mobx",nm=Wh("isMobXReactObserver"),rm=Wh("isUnmounted"),im=Wh("skipRender"),om=Wh("isForcingUpdate");function am(e){var t=e.prototype;if(e[nm]){var r=sm(t);console.warn("The provided component class ("+r+") \n                has already been declared as an observer component.")}else e[nm]=!0;if(t.componentWillReact)throw new Error("The componentWillReact life-cycle event is no longer supported");if(e.__proto__!==n.PureComponent)if(t.shouldComponentUpdate){if(t.shouldComponentUpdate!==cm)throw new Error("It is not allowed to use shouldComponentUpdate in observer based components.")}else t.shouldComponentUpdate=cm;um(t,"props"),um(t,"state");var i=t.render;return t.render=function(){return lm.call(this,i)},Jh(t,"componentWillUnmount",(function(){var e;if(!0!==Nh()&&(null==(e=this.render[tm])||e.dispose(),this[rm]=!0,!this.render[tm])){var t=sm(this);console.warn("The reactive render of an observer class component ("+t+") \n                was overriden after MobX attached. This may result in a memory leak if the \n                overriden reactive render was not properly disposed.")}})),e}function sm(e){return e.displayName||e.name||e.constructor&&(e.constructor.displayName||e.constructor.name)||"<component>"}function lm(e){var t=this;if(!0===Nh())return e.call(this);Qh(this,im,!1),Qh(this,om,!1);var r=sm(this),i=e.bind(this),o=!1,a=new mt(r+".render()",(function(){if(!o&&(o=!0,!0!==t[rm])){var e=!0;try{Qh(t,om,!0),t[im]||n.Component.prototype.forceUpdate.call(t),e=!1}finally{Qh(t,om,!1),e&&a.dispose()}}}));function s(){o=!1;var e=void 0,t=void 0;if(a.track((function(){try{t=function(e,t){var n=ze(e);try{return t()}finally{Ue(n)}}(!1,i)}catch(t){e=t}})),e)throw e;return t}return a.reactComponent=this,s[tm]=a,this.render=s,s.call(this)}function cm(e,t){return Nh()&&console.warn("[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side."),this.state!==t||!Hh(this.props,e)}function um(e,t){var n=Wh("reactProp_"+t+"_valueHolder"),r=Wh("reactProp_"+t+"_atomHolder");function i(){return this[r]||Qh(this,r,Q("reactive "+t)),this[r]}Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get:function(){var e=!1;return nt&&rt&&(e=nt(!0)),i.call(this).reportObserved(),nt&&rt&&rt(e),this[n]},set:function(e){this[om]||Hh(this[n],e)?Qh(this,n,e):(Qh(this,n,e),Qh(this,im,!0),i.call(this).reportChanged(),Qh(this,im,!1))}})}var pm="function"==typeof Symbol&&Symbol.for,dm=pm?Symbol.for("react.forward_ref"):"function"==typeof n.forwardRef&&(0,n.forwardRef)((function(e){return null})).$$typeof,fm=pm?Symbol.for("react.memo"):"function"==typeof n.memo&&(0,n.memo)((function(e){return null})).$$typeof;function hm(e){if(!0===e.isMobxInjector&&console.warn("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"),fm&&e.$$typeof===fm)throw new Error("Mobx observer: You are trying to use 'observer' on a function component wrapped in either another observer or 'React.memo'. The observer already applies 'React.memo' for you.");if(dm&&e.$$typeof===dm){var t=e.render;if("function"!=typeof t)throw new Error("render property of ForwardRef was not a function");return(0,n.forwardRef)((function(){var e=arguments;return(0,n.createElement)(Bh,null,(function(){return t.apply(void 0,e)}))}))}return"function"!=typeof e||e.prototype&&e.prototype.render||e.isReactClass||Object.prototype.isPrototypeOf.call(n.Component,e)?am(e):function(e,t){if(Nh())return e;var r,i,o,a=zh({forwardRef:!1},t),s=e.displayName||e.name,l=function(t,n){return Fh((function(){return e(t,n)}),s)};return l.displayName=s,r=a.forwardRef?(0,n.memo)((0,n.forwardRef)(l)):(0,n.memo)(l),i=e,o=r,Object.keys(i).forEach((function(e){Uh[e]||Object.defineProperty(o,e,Object.getOwnPropertyDescriptor(i,e))})),r.displayName=s,r}(e)}if(!n.Component)throw new Error("mobx-react requires React to be available");if(!Ce)throw new Error("mobx-react requires mobx to be available");const mm=ha(Gu)`
  button {
    background-color: transparent;
    border: 0;
    outline: 0;
    font-size: 13px;
    font-family: ${e=>e.theme.typography.code.fontFamily};
    cursor: pointer;
    padding: 0;
    color: ${e=>e.theme.colors.text.primary};
    &:focus {
      font-weight: ${({theme:e})=>e.typography.fontWeightBold};
    }
    ${({kind:e})=>"patternProperties"===e&&ca`
        display: inline-flex;
        margin-right: 20px;

        > span.property-name {
          white-space: break-spaces;
          text-align: left;

          ::before,
          ::after {
            content: '/';
            filter: opacity(0.2);
          }
        }

        > svg {
          align-self: center;
        }
      `}
  }
  ${qu} {
    height: ${({theme:e})=>e.schema.arrow.size};
    width: ${({theme:e})=>e.schema.arrow.size};
    polygon {
      fill: ${({theme:e})=>e.schema.arrow.color};
    }
  }
`,gm=ha.span`
  vertical-align: middle;
  font-size: ${({theme:e})=>e.typography.code.fontSize};
  line-height: 20px;
`,ym=ha(gm)`
  color: ${e=>Wr(.1,e.theme.schema.typeNameColor)};
`,vm=ha(gm)`
  color: ${e=>e.theme.schema.typeNameColor};
`,bm=ha(gm)`
  color: ${e=>e.theme.schema.typeTitleColor};
  word-break: break-word;
`,xm=vm,wm=ha(gm).attrs({as:"div"})`
  color: ${e=>e.theme.schema.requireLabelColor};
  font-size: ${e=>e.theme.schema.labelsTextSize};
  font-weight: normal;
  margin-left: 20px;
  line-height: 1;
`,km=ha(wm)`
  color: ${e=>e.theme.colors.primary.light};
`,Om=ha(gm)`
  color: ${({theme:e})=>e.colors.warning.main};
  font-size: 13px;
`,Sm=ha(gm)`
  color: #0e7c86;
  &::before,
  &::after {
    font-weight: bold;
  }
`,Em=ha(gm)`
  border-radius: 2px;
  word-break: break-word;
  ${({theme:e})=>`\n    background-color: ${Wr(.95,e.colors.text.primary)};\n    color: ${Wr(.1,e.colors.text.primary)};\n\n    padding: 0 ${e.spacing.unit}px;\n    border: 1px solid ${Wr(.9,e.colors.text.primary)};\n    font-family: ${e.typography.code.fontFamily};\n}`};
  & + & {
    margin-left: 0;
  }
  ${ma("ExampleValue")};
`,_m=ha(Em)``,Am=ha(gm)`
  border-radius: 2px;
  ${({theme:e})=>`\n    background-color: ${Wr(.95,e.colors.primary.light)};\n    color: ${Wr(.1,e.colors.primary.main)};\n\n    margin: 0 ${e.spacing.unit}px;\n    padding: 0 ${e.spacing.unit}px;\n    border: 1px solid ${Wr(.9,e.colors.primary.main)};\n}`};
  & + & {
    margin-left: 0;
  }
  ${ma("ConstraintItem")};
`,jm=ha.button`
  background-color: transparent;
  border: 0;
  color: ${({theme:e})=>e.colors.text.secondary};
  margin-left: ${({theme:e})=>e.spacing.unit}px;
  border-radius: 2px;
  cursor: pointer;
  outline-color: ${({theme:e})=>e.colors.text.secondary};
  font-size: 12px;
`;Object.defineProperty,Object.getOwnPropertyDescriptor;const Cm=ha.div`
  ${If};
  ${({$compact:e})=>e?"":"margin: 1em 0"}
`;let Pm=class extends n.Component{render(){const{externalDocs:e}=this.props;return e&&e.url?n.createElement(Cm,{$compact:this.props.compact},n.createElement("a",{href:e.url},e.description||e.url)):null}};Pm=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Pm);class Tm extends n.PureComponent{constructor(){super(...arguments),this.state={collapsed:!0}}toggle(){this.setState({collapsed:!this.state.collapsed})}render(){const{values:e,isArrayType:t}=this.props,{collapsed:r}=this.state,{enumSkipQuotes:i,maxDisplayedEnumValues:o}=this.context;if(!e.length)return null;const a=this.state.collapsed&&o?e.slice(0,o):e,s=!!o&&e.length>o,l=o?r?`… ${e.length-o} more`:"Hide":"";return n.createElement("div",null,n.createElement(gm,null,t?di("enumArray"):""," ",1===e.length?di("enumSingleValue"):di("enum"),":")," ",a.map(((e,t)=>{const r=i?String(e):JSON.stringify(e);return n.createElement(n.Fragment,{key:t},n.createElement(Em,null,r)," ")})),s?n.createElement(Rm,{onClick:()=>{this.toggle()}},l):null)}}Tm.contextType=Oa;const Rm=ha.span`
  color: ${e=>e.theme.colors.primary.main};
  vertical-align: middle;
  font-size: 13px;
  line-height: 20px;
  padding: 0 5px;
  cursor: pointer;
`,Im=ha($f)`
  margin: 2px 0;
`;class $m extends n.PureComponent{render(){const e=this.props.extensions;return n.createElement(Oa.Consumer,null,(t=>n.createElement(n.Fragment,null,t.showExtensions&&Object.keys(e).map((t=>n.createElement(Im,{key:t},n.createElement(gm,null," ",t.substring(2),": ")," ",n.createElement(_m,null,"string"==typeof e[t]?e[t]:JSON.stringify(e[t]))))))))}}function Nm({field:e}){return e.examples?n.createElement(n.Fragment,null,n.createElement(gm,null," ",di("examples"),": "),ci(e.examples)?e.examples.map(((t,r)=>{const i=is(e,t),o=e.in?String(i):JSON.stringify(i);return n.createElement(n.Fragment,{key:r},n.createElement(Em,null,o)," ")})):n.createElement(Lm,null,Object.values(e.examples).map(((t,r)=>n.createElement("li",{key:r+t.value},n.createElement(Em,null,is(e,t.value))," -"," ",t.summary||t.description))))):null}const Lm=ha.ul`
  margin-top: 1em;
  list-style-position: outside;
`;class Dm extends n.PureComponent{render(){return 0===this.props.constraints.length?null:n.createElement("span",null," ",this.props.constraints.map((e=>n.createElement(Am,{key:e}," ",e," "))))}}const Mm=n.memo((function({value:e,label:t,raw:r}){if(void 0===e)return null;const i=r?String(e):JSON.stringify(e);return n.createElement("div",null,n.createElement(gm,null," ",t," ")," ",n.createElement(Em,null,i))})),Fm=45;function zm(e){const t=e.schema.pattern,{hideSchemaPattern:r}=n.useContext(Oa),[i,o]=n.useState(!1),a=n.useCallback((()=>o(!i)),[i]);return!t||r?null:n.createElement(n.Fragment,null,n.createElement(Sm,null,i||t.length<Fm?t:`${t.substr(0,Fm)}...`),t.length>Fm&&n.createElement(jm,{onClick:a},i?"Hide pattern":"Show pattern"))}function Um({schema:e}){var t;const{hideSchemaPattern:r}=n.useContext(Oa);return e&&((null==e?void 0:e.pattern)&&!r||e.items||e.displayFormat||(null==(t=e.constraints)?void 0:t.length))?"string"===e.type&&e.pattern?n.createElement(Bm,null,"[",n.createElement(zm,{schema:e}),"]"):n.createElement(Bm,null,"[ items",e.displayFormat&&n.createElement(xm,null," <",e.displayFormat," >"),n.createElement(Dm,{constraints:e.constraints}),n.createElement(zm,{schema:e}),e.items&&n.createElement(Um,{schema:e.items})," ]"):null}const Bm=ha(ym)`
  margin: 0 5px;
  vertical-align: text-top;
`;var qm=Object.defineProperty,Vm=Object.getOwnPropertySymbols,Wm=Object.prototype.hasOwnProperty,Hm=Object.prototype.propertyIsEnumerable,Ym=(e,t,n)=>t in e?qm(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Qm=(e,t)=>{for(var n in t||(t={}))Wm.call(t,n)&&Ym(e,n,t[n]);if(Vm)for(var n of Vm(t))Hm.call(t,n)&&Ym(e,n,t[n]);return e};const Gm=hm((e=>{const{enumSkipQuotes:t,hideSchemaTitles:r}=n.useContext(Oa),{showExamples:i,field:o,renderDiscriminatorSwitch:a}=e,{schema:s,description:l,deprecated:c,extensions:u,in:p,const:d}=o,f="array"===s.type,h=t||"header"===p,m=n.useMemo((()=>!i||void 0===o.example&&void 0===o.examples?null:void 0!==o.examples?n.createElement(Nm,{field:o}):n.createElement(Mm,{label:di("example")+":",value:is(o,o.example),raw:Boolean(o.in)})),[o,i]),g=ii(s.default)&&o.in?is(o,s.default).replace(`${o.name}=`,""):s.default;return n.createElement("div",null,n.createElement("div",null,n.createElement(ym,null,s.typePrefix),n.createElement(vm,null,s.displayType),s.displayFormat&&n.createElement(xm,null," ","<",s.displayFormat,">"," "),s.contentEncoding&&n.createElement(xm,null," ","<",s.contentEncoding,">"," "),s.contentMediaType&&n.createElement(xm,null," ","<",s.contentMediaType,">"," "),s.title&&!r&&n.createElement(bm,null," (",s.title,") "),n.createElement(Dm,{constraints:s.constraints}),n.createElement(zm,{schema:s}),s.isCircular&&n.createElement(Om,null," ",di("recursive")," "),f&&s.items&&n.createElement(Um,{schema:s.items})),c&&n.createElement("div",null,n.createElement(Vu,{type:"warning"}," ",di("deprecated")," ")),n.createElement(Mm,{raw:h,label:di("default")+":",value:g}),!a&&n.createElement(Tm,{isArrayType:f,values:s.enum})," ",m,n.createElement($m,{extensions:Qm(Qm({},u),s.extensions)}),n.createElement("div",null,n.createElement(Wf,{compact:!0,source:l})),s.externalDocs&&n.createElement(Pm,{externalDocs:s.externalDocs,compact:!0}),a&&a(e)||null,d&&n.createElement(Mm,{label:di("const")+":",value:d})||null)})),Xm=n.memo(Gm);var Km=Object.defineProperty,Zm=(Object.getOwnPropertyDescriptor,Object.getOwnPropertySymbols),Jm=Object.prototype.hasOwnProperty,eg=Object.prototype.propertyIsEnumerable,tg=(e,t,n)=>t in e?Km(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;let ng=class extends n.Component{constructor(){super(...arguments),this.toggle=()=>{void 0===this.props.field.expanded&&this.props.expandByDefault?this.props.field.collapse():this.props.field.toggle()},this.handleKeyPress=e=>{"Enter"===e.key&&(e.preventDefault(),this.toggle())}}render(){const{className:e="",field:t,isLast:r,expandByDefault:i}=this.props,{name:o,deprecated:a,required:s,kind:l}=t,c=!t.schema.isPrimitive&&!t.schema.isCircular,u=void 0===t.expanded?i:t.expanded,p=n.createElement(n.Fragment,null,"additionalProperties"===l&&n.createElement(km,null,"additional property"),"patternProperties"===l&&n.createElement(km,null,"pattern property"),s&&n.createElement(wm,null,"required")),d=c?n.createElement(mm,{className:a?"deprecated":"",kind:l,title:o},n.createElement(Ku,null),n.createElement("button",{onClick:this.toggle,onKeyPress:this.handleKeyPress,"aria-label":`expand ${o}`},n.createElement("span",{className:"property-name"},o),n.createElement(qu,{direction:u?"down":"right"})),p):n.createElement(Gu,{className:a?"deprecated":void 0,kind:l,title:o},n.createElement(Ku,null),n.createElement("span",{className:"property-name"},o),p);return n.createElement(n.Fragment,null,n.createElement("tr",{className:r?"last "+e:e},d,n.createElement(Xu,null,n.createElement(Xm,((e,t)=>{for(var n in t||(t={}))Jm.call(t,n)&&tg(e,n,t[n]);if(Zm)for(var n of Zm(t))eg.call(t,n)&&tg(e,n,t[n]);return e})({},this.props)))),u&&c&&n.createElement("tr",{key:t.name+"inner"},n.createElement(Qu,{colSpan:2},n.createElement(Zu,null,n.createElement(Dg,{schema:t.schema,skipReadOnly:this.props.skipReadOnly,skipWriteOnly:this.props.skipWriteOnly,showTitle:this.props.showTitle,level:this.props.level})))))}};ng=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],ng);Object.defineProperty,Object.getOwnPropertyDescriptor;let rg=class extends n.Component{constructor(){super(...arguments),this.changeActiveChild=e=>{void 0!==e.idx&&this.props.parent.activateOneOf(e.idx)}}sortOptions(e,t){if(0===t.length)return;const n={};t.forEach(((e,t)=>{n[e]=t})),e.sort(((e,t)=>n[e.value]>n[t.value]?1:-1))}render(){const{parent:e,enumValues:t}=this.props;if(void 0===e.oneOf)return null;const r=e.oneOf.map(((e,t)=>({value:e.title,idx:t}))),i=r[e.activeOneOf].value;return this.sortOptions(r,t),n.createElement(Rd,{value:i,options:r,onChange:this.changeActiveChild,ariaLabel:"Example"})}};rg=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],rg);const ig=hm((({schema:{fields:e=[],title:t},showTitle:r,discriminator:i,skipReadOnly:o,skipWriteOnly:a,level:s})=>{const{expandSingleSchemaField:l,showObjectSchemaExamples:c,schemaExpansionLevel:u}=n.useContext(Oa),p=n.useMemo((()=>o||a?e.filter((e=>!(o&&e.schema.readOnly||a&&e.schema.writeOnly))):e),[o,a,e]),d=l&&1===p.length||u>=s;return n.createElement(Ju,null,r&&n.createElement(Hu,null,t),n.createElement("tbody",null,Jr(p,((e,t)=>n.createElement(ng,{key:e.name,isLast:t,field:e,expandByDefault:d,renderDiscriminatorSwitch:(null==i?void 0:i.fieldName)===e.name?()=>n.createElement(rg,{parent:i.parentSchema,enumValues:e.schema.enum}):void 0,className:e.expanded?"expanded":void 0,showExamples:c,skipReadOnly:o,skipWriteOnly:a,showTitle:r,level:s})))))}));var og=Object.defineProperty,ag=Object.defineProperties,sg=Object.getOwnPropertyDescriptors,lg=Object.getOwnPropertySymbols,cg=Object.prototype.hasOwnProperty,ug=Object.prototype.propertyIsEnumerable,pg=(e,t,n)=>t in e?og(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,dg=(e,t)=>{for(var n in t||(t={}))cg.call(t,n)&&pg(e,n,t[n]);if(lg)for(var n of lg(t))ug.call(t,n)&&pg(e,n,t[n]);return e},fg=(e,t)=>ag(e,sg(t));const hg=ha.div`
  padding-left: ${({theme:e})=>2*e.spacing.unit}px;
`;class mg extends n.PureComponent{render(){const e=this.props.schema,t=e.items,r=void 0===e.minItems&&void 0===e.maxItems?"":`(${cs(e)})`;return e.fields?n.createElement(ig,fg(dg({},this.props),{level:this.props.level})):!e.displayType||t||r.length?n.createElement("div",null,n.createElement(rp,null," Array ",r),n.createElement(hg,null,n.createElement(Dg,fg(dg({},this.props),{schema:t}))),n.createElement(ip,null)):n.createElement("div",null,n.createElement(vm,null,e.displayType))}}var gg=Object.defineProperty,yg=Object.defineProperties,vg=Object.getOwnPropertyDescriptor,bg=Object.getOwnPropertyDescriptors,xg=Object.getOwnPropertySymbols,wg=Object.prototype.hasOwnProperty,kg=Object.prototype.propertyIsEnumerable,Og=(e,t,n)=>t in e?gg(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Sg=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?vg(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&gg(t,n,o),o};let Eg=class extends n.Component{constructor(){super(...arguments),this.activateOneOf=()=>{this.props.schema.activateOneOf(this.props.idx)}}render(){const{idx:e,schema:t,subSchema:r}=this.props;return n.createElement(np,{$deprecated:r.deprecated,$active:e===t.activeOneOf,onClick:this.activateOneOf},r.title||r.typePrefix+r.displayType)}};Eg=Sg([hm],Eg);let _g=class extends n.Component{render(){const{schema:{oneOf:e},schema:t}=this.props;if(void 0===e)return null;const r=e[t.activeOneOf];return n.createElement("div",null,n.createElement(tp,null," ",t.oneOfType," "),n.createElement(ep,null,e.map(((e,r)=>n.createElement(Eg,{key:e.pointer,schema:t,subSchema:e,idx:r})))),n.createElement("div",null,e[t.activeOneOf].deprecated&&n.createElement(Vu,{type:"warning"},"Deprecated")),n.createElement(Dm,{constraints:r.constraints}),n.createElement(Dg,((e,t)=>yg(e,bg(t)))(((e,t)=>{for(var n in t||(t={}))wg.call(t,n)&&Og(e,n,t[n]);if(xg)for(var n of xg(t))kg.call(t,n)&&Og(e,n,t[n]);return e})({},this.props),{schema:r})))}};_g=Sg([hm],_g);const Ag=hm((({schema:e})=>n.createElement("div",null,n.createElement(vm,null,e.displayType),e.title&&n.createElement(bm,null," ",e.title," "),n.createElement(Om,null," ",di("recursive")," "))));var jg=Object.defineProperty,Cg=Object.defineProperties,Pg=(Object.getOwnPropertyDescriptor,Object.getOwnPropertyDescriptors),Tg=Object.getOwnPropertySymbols,Rg=Object.prototype.hasOwnProperty,Ig=Object.prototype.propertyIsEnumerable,$g=(e,t,n)=>t in e?jg(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Ng=(e,t)=>{for(var n in t||(t={}))Rg.call(t,n)&&$g(e,n,t[n]);if(Tg)for(var n of Tg(t))Ig.call(t,n)&&$g(e,n,t[n]);return e},Lg=(e,t)=>Cg(e,Pg(t));let Dg=class extends n.Component{render(){var e;const t=this.props,{schema:r}=t,i=((e,t)=>{var n={};for(var r in e)Rg.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&Tg)for(var r of Tg(e))t.indexOf(r)<0&&Ig.call(e,r)&&(n[r]=e[r]);return n})(t,["schema"]),o=(i.level||0)+1;if(!r)return n.createElement("em",null," Schema not provided ");const{type:a,oneOf:s,discriminatorProp:l,isCircular:c}=r;if(c)return n.createElement(Ag,{schema:r});if(void 0!==l){if(!s||!s.length)return console.warn(`Looks like you are using discriminator wrong: you don't have any definition inherited from the ${r.title}`),null;const e=s[r.activeOneOf];return e.isCircular?n.createElement(Ag,{schema:e}):n.createElement(ig,Lg(Ng({},i),{level:o,schema:e,discriminator:{fieldName:l,parentSchema:r}}))}if(void 0!==s)return n.createElement(_g,Ng({schema:r},i));const u=ci(a)?a:[a];if(u.includes("object")){if(null==(e=r.fields)?void 0:e.length)return n.createElement(ig,Lg(Ng({},this.props),{level:o}))}else if(u.includes("array"))return n.createElement(mg,Lg(Ng({},this.props),{level:o}));const p={schema:r,name:"",required:!1,description:r.description,externalDocs:r.externalDocs,deprecated:!1,toggle:()=>null,expanded:!1};return n.createElement("div",null,n.createElement(Xm,{field:p}))}};Dg=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Dg);var Mg=Object.defineProperty,Fg=Object.defineProperties,zg=Object.getOwnPropertyDescriptors,Ug=Object.getOwnPropertySymbols,Bg=Object.prototype.hasOwnProperty,qg=Object.prototype.propertyIsEnumerable,Vg=(e,t,n)=>t in e?Mg(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;class Wg extends n.PureComponent{constructor(){super(...arguments),this.renderDropdown=e=>{return n.createElement(Tf,(t=((e,t)=>{for(var n in t||(t={}))Bg.call(t,n)&&Vg(e,n,t[n]);if(Ug)for(var n of Ug(t))qg.call(t,n)&&Vg(e,n,t[n]);return e})({Label:$d,Dropdown:xh},e),Fg(t,zg({variant:"dark"}))));var t}}static getMediaType(e,t){if(!e)return{};const n={schema:{$ref:e}};return t&&(n.examples={example:{$ref:t}}),n}get mediaModel(){const{parser:e,schemaRef:t,exampleRef:n,options:r}=this.props;return this._mediaModel||(this._mediaModel=new nu(e,"json",!1,Wg.getMediaType(t,n),r)),this._mediaModel}render(){const{showReadOnly:e=!0,showWriteOnly:t=!1,showExample:r=!0}=this.props;return n.createElement(Eu,null,n.createElement(ju,null,n.createElement(Su,null,n.createElement(Dg,{skipWriteOnly:!t,skipReadOnly:!e,schema:this.mediaModel.schema})),r&&n.createElement(Au,null,n.createElement(Hg,null,n.createElement(kh,{renderDropdown:this.renderDropdown,mediaType:this.mediaModel})))))}}const Hg=ha.div`
  background: ${({theme:e})=>e.codeBlock.backgroundColor};
  & > div,
  & > pre {
    padding: ${e=>4*e.theme.spacing.unit}px;
    margin: 0;
  }

  & > div > pre {
    padding: 0;
  }
`,Yg=(sa.div`
  background-color: #e4e7eb;
`,sa.ul`
  display: inline;
  list-style: none;
  padding: 0;

  li {
    display: inherit;

    &:after {
      content: ',';
    }
    &:last-child:after {
      content: none;
    }
  }
`,sa.code`
  font-size: ${e=>e.theme.typography.code.fontSize};
  font-family: ${e=>e.theme.typography.code.fontFamily};
  margin: 0 3px;
  padding: 0.2em;
  display: inline-block;
  line-height: 1;

  &:after {
    content: ',';
    font-weight: normal;
  }

  &:last-child:after {
    content: none;
  }
`),Qg=sa.span`
  &:after {
    content: ' and ';
    font-weight: normal;
  }

  &:last-child:after {
    content: none;
  }

  ${If};
`,Gg=sa.span`
  ${e=>!e.$expanded&&"white-space: nowrap;"}
  &:after {
    content: ' or ';
    ${e=>e.$expanded&&"content: ' or \\a';"}
    white-space: pre;
  }

  &:last-child:after,
  &:only-child:after {
    content: none;
  }

  ${If};
`,Xg=sa.div`
  flex: 1 1 auto;
  cursor: pointer;
`,Kg=sa.div`
  width: ${e=>e.theme.schema.defaultDetailsWidth};
  text-overflow: ellipsis;
  border-radius: 4px;
  overflow: hidden;
  ${e=>e.$expanded&&`background: ${e.theme.colors.gray[100]};\n     padding: 8px 9.6px;\n     margin: 20px 0;\n     width: 100%;\n    `};
  ${fa.lessThan("small")`
    margin-top: 10px;
  `}
`,Zg=sa($u)`
  display: inline-block;
  margin: 0;
`,Jg=sa.div`
  width: 100%;
  display: flex;
  margin: 1em 0;
  flex-direction: ${e=>e.$expanded?"column":"row"};
  ${fa.lessThan("small")`
    flex-direction: column;
  `}
`,ey=sa.div`
  margin: 0.5em 0;
`,ty=sa.div`
  border-bottom: 1px solid ${({theme:e})=>e.colors.border.dark};
  margin-bottom: 1.5em;
  padding-bottom: 0.7em;

  h5 {
    line-height: 1em;
    margin: 0 0 0.6em;
    font-size: ${({theme:e})=>e.typography.fontSize};
  }

  .redoc-markdown p:first-child {
    display: inline;
  }
`;function ny({children:e,height:t}){const r=n.createRef(),[i,o]=n.useState(!1),[a,s]=n.useState(!1);return n.useEffect((()=>{r.current&&r.current.clientHeight+20<r.current.scrollHeight&&s(!0)}),[r]),n.createElement(n.Fragment,null,n.createElement(ry,{ref:r,className:i?"":"container",style:{height:i?"auto":t}},e),n.createElement(iy,{$dimmed:!i},a&&n.createElement(oy,{onClick:()=>{o(!i)}},i?"See less":"See more")))}const ry=sa.div`
  overflow-y: hidden;
`,iy=sa.div`
  text-align: center;
  line-height: 1.5em;
  ${({$dimmed:e})=>e&&"background-image: linear-gradient(to bottom, transparent,rgb(255 255 255));\n     position: relative;\n     top: -0.5em;\n     padding-top: 0.5em;\n     background-position-y: -1em;\n    "}
`,oy=sa.a`
  cursor: pointer;
`,ay=n.memo((function(e){const{type:t,flow:r,RequiredScopes:i}=e,o=Object.keys((null==r?void 0:r.scopes)||{});return n.createElement(n.Fragment,null,n.createElement(ey,null,n.createElement("b",null,"Flow type: "),n.createElement("code",null,t," ")),("implicit"===t||"authorizationCode"===t)&&n.createElement(ey,null,n.createElement("strong",null," Authorization URL: "),n.createElement("code",null,n.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:r.authorizationUrl},r.authorizationUrl))),("password"===t||"clientCredentials"===t||"authorizationCode"===t)&&n.createElement(ey,null,n.createElement("b",null," Token URL: "),n.createElement("code",null,r.tokenUrl)),r.refreshUrl&&n.createElement(ey,null,n.createElement("strong",null," Refresh URL: "),n.createElement("code",null,r.refreshUrl)),!!o.length&&n.createElement(n.Fragment,null,i||null,n.createElement(ey,null,n.createElement("b",null," Scopes: ")),n.createElement(ny,{height:"4em"},n.createElement("ul",null,o.map((e=>n.createElement("li",{key:e},n.createElement("code",null,e)," -"," ",n.createElement(Wf,{className:"redoc-markdown",inline:!0,source:r.scopes[e]||""}))))))))}));function sy(e){const{RequiredScopes:t,scheme:r}=e;return n.createElement($f,null,r.apiKey?n.createElement(n.Fragment,null,n.createElement(ey,null,n.createElement("b",null,(i=r.apiKey.in||"").charAt(0).toUpperCase()+i.slice(1)," parameter name: "),n.createElement("code",null,r.apiKey.name)),t):r.http?n.createElement(n.Fragment,null,n.createElement(ey,null,n.createElement("b",null,"HTTP Authorization Scheme: "),n.createElement("code",null,r.http.scheme)),n.createElement(ey,null,"bearer"===r.http.scheme&&r.http.bearerFormat&&n.createElement(n.Fragment,null,n.createElement("b",null,"Bearer format: "),n.createElement("code",null,r.http.bearerFormat))),t):r.openId?n.createElement(n.Fragment,null,n.createElement(ey,null,n.createElement("b",null,"URL: "),n.createElement("code",null,n.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:r.openId.connectUrl},r.openId.connectUrl))),t):r.flows?Object.keys(r.flows).map((e=>n.createElement(ay,{key:e,type:e,RequiredScopes:t,flow:r.flows[e]}))):null);var i}const ly={oauth2:"OAuth2",apiKey:"API Key",http:"HTTP",openIdConnect:"OpenID Connect"};class cy extends n.PureComponent{render(){return this.props.securitySchemes.schemes.map((e=>n.createElement(Eu,{id:e.sectionId,key:e.id},n.createElement(ju,null,n.createElement(Su,null,n.createElement(Ru,null,n.createElement(Uu,{to:e.sectionId}),e.displayName),n.createElement(Wf,{source:e.description||""}),n.createElement(ty,null,n.createElement(ey,null,n.createElement("b",null,"Security Scheme Type: "),n.createElement("span",null,ly[e.type]||e.type)),n.createElement(sy,{scheme:e})))))))}}class uy{constructor(e,t,n={},r=!0){var i,o,a,s;this.marker=new Ds,this.disposer=null,this.rawOptions=n,this.options=new Si(n,py),this.scroll=new Of(this.options),bf.updateOnHistory(Ns.currentId,this.scroll),this.spec=new Jd(e,t,this.options),this.menu=new bf(this.spec,this.scroll,Ns),this.options.disableSearch||(this.search=new Sf,r&&this.search.indexItems(this.menu.items),this.disposer=(i=this.menu,o="activeItemIdx",x(a=e=>{this.updateMarkOnMenu(e.newValue)})?function(e,t,n,r){return Wn(e,t).observe_(n,r)}(i,o,a,s):function(e,t,n){return Wn(e).observe_(t,n)}(i,o,a)))}static fromJS(e){const t=new uy(e.spec.data,e.spec.url,e.options,!1);return t.menu.activeItemIdx=e.menu.activeItemIdx||0,t.menu.activate(t.menu.flatItems[t.menu.activeItemIdx]),t.options.disableSearch||t.search.load(e.searchIndex),t}onDidMount(){this.menu.updateOnHistory(),this.updateMarkOnMenu(this.menu.activeItemIdx)}dispose(){this.scroll.dispose(),this.menu.dispose(),this.search&&this.search.dispose(),null!=this.disposer&&this.disposer()}toJS(){return e=this,t=null,n=function*(){return{menu:{activeItemIdx:this.menu.activeItemIdx},spec:{url:this.spec.parser.specUrl,data:this.spec.parser.spec},searchIndex:this.search?yield this.search.toJS():void 0,options:this.rawOptions}},new Promise(((r,i)=>{var o=e=>{try{s(n.next(e))}catch(e){i(e)}},a=e=>{try{s(n.throw(e))}catch(e){i(e)}},s=e=>e.done?r(e.value):Promise.resolve(e.value).then(o,a);s((n=n.apply(e,t)).next())}));var e,t,n}updateMarkOnMenu(e){const t=Math.max(0,e),n=Math.min(this.menu.flatItems.length,t+5),r=[];for(let e=t;e<n;e++){const t=this.menu.getElementAt(e);t&&r.push(t)}if(-1===e&&Qr){const e=document.querySelector('[data-role="redoc-description"]'),t=document.querySelector('[data-role="redoc-summary"]');e&&r.push(e),t&&r.push(t)}this.marker.addOnly(r),this.marker.mark()}}const py={allowedMdComponents:{SecurityDefinitions:{component:cy,propsSelector:e=>({securitySchemes:e.spec.securitySchemes})},"security-definitions":{component:cy,propsSelector:e=>({securitySchemes:e.spec.securitySchemes})},SchemaDefinition:{component:Wg,propsSelector:e=>({parser:e.spec.parser,options:e.options})}}},dy=ha(Tu)`
  margin-top: 0;
  margin-bottom: 0.5em;

  ${ma("ApiHeader")};
`,fy=ha.a`
  border: 1px solid ${e=>e.theme.colors.primary.main};
  color: ${e=>e.theme.colors.primary.main};
  font-weight: normal;
  margin-left: 0.5em;
  padding: 4px 8px 4px;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;

  ${ma("DownloadButton")};
`,hy=ha.span`
  &::before {
    content: '|';
    display: inline-block;
    opacity: 0.5;
    width: ${15}px;
    text-align: center;
  }

  &:last-child::after {
    display: none;
  }
`,my=ha.div`
  overflow: hidden;
`,gy=ha.div`
  display: flex;
  flex-wrap: wrap;
  // hide separator on new lines: idea from https://stackoverflow.com/a/31732902/1749888
  margin-left: -${15}px;
`;Object.defineProperty,Object.getOwnPropertyDescriptor;let yy=class extends n.Component{constructor(){super(...arguments),this.handleDownloadClick=e=>{e.target.href||(e.target.href=this.props.store.spec.info.downloadLink)}}render(){const{store:e}=this.props,{info:t,externalDocs:r}=e.spec,i=e.options.hideDownloadButton,o=t.downloadFileName,a=t.downloadLink,s=t.license&&n.createElement(hy,null,"License:"," ",t.license.identifier?t.license.identifier:n.createElement("a",{href:t.license.url},t.license.name))||null,l=t.contact&&t.contact.url&&n.createElement(hy,null,"URL: ",n.createElement("a",{href:t.contact.url},t.contact.url))||null,c=t.contact&&t.contact.email&&n.createElement(hy,null,t.contact.name||"E-mail",":"," ",n.createElement("a",{href:"mailto:"+t.contact.email},t.contact.email))||null,u=t.termsOfService&&n.createElement(hy,null,n.createElement("a",{href:t.termsOfService},"Terms of Service"))||null,p=t.version&&n.createElement("span",null,"(",t.version,")")||null;return n.createElement(Eu,null,n.createElement(ju,null,n.createElement(Su,{className:"api-info"},n.createElement(dy,null,t.title," ",p),!i&&n.createElement("p",null,di("downloadSpecification"),":",n.createElement(fy,{download:o||!0,target:"_blank",href:a,onClick:this.handleDownloadClick},di("download"))),n.createElement($f,null,(t.license||t.contact||t.termsOfService)&&n.createElement(my,null,n.createElement(gy,null,c," ",l," ",s," ",u))||null),n.createElement(Wf,{source:e.spec.info.summary,"data-role":"redoc-summary"}),n.createElement(Wf,{source:e.spec.info.description,"data-role":"redoc-description"}),r&&n.createElement(Pm,{externalDocs:r}))))}};yy=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],yy);const vy=ha.img`
  max-height: ${e=>e.theme.logo.maxHeight};
  max-width: ${e=>e.theme.logo.maxWidth};
  padding: ${e=>e.theme.logo.gutter};
  width: 100%;
  display: block;
`,by=ha.div`
  text-align: center;
`,xy=ha.a`
  display: inline-block;
`;Object.defineProperty,Object.getOwnPropertyDescriptor;let wy=class extends n.Component{render(){const{info:e}=this.props,t=e["x-logo"];if(!t||!t.url)return null;const r=t.href||e.contact&&e.contact.url,i=t.altText?t.altText:"logo",o=n.createElement(vy,{src:t.url,alt:i});return n.createElement(by,{style:{backgroundColor:t.backgroundColor}},r?(a=r,e=>n.createElement(xy,{href:a},e))(o):o);var a}};wy=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],wy);var ky=Object.defineProperty,Oy=Object.getOwnPropertySymbols,Sy=Object.prototype.hasOwnProperty,Ey=Object.prototype.propertyIsEnumerable,_y=(e,t,n)=>t in e?ky(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Ay=(e,t)=>{for(var n in t||(t={}))Sy.call(t,n)&&_y(e,n,t[n]);if(Oy)for(var n of Oy(t))Ey.call(t,n)&&_y(e,n,t[n]);return e};class jy extends n.Component{render(){return n.createElement(Ea,null,(e=>n.createElement(Du,null,(t=>this.renderWithOptionsAndStore(e,t)))))}renderWithOptionsAndStore(e,t){const{source:r,htmlWrap:i=(e=>e)}=this.props;if(!t)throw new Error("When using components in markdown, store prop must be provided");const o=new Rl(e,this.props.parentId).renderMdWithComponents(r);return o.length?o.map(((e,r)=>{if("string"==typeof e)return n.cloneElement(i(n.createElement(Vf,{html:e,inline:!1,compact:!1})),{key:r});const o=e.component;return n.createElement(o,Ay({key:r},Ay(Ay({},e.props),e.propsSelector(t))))})):null}}var Cy=r(4184),Py=r.n(Cy);const Ty=ha.span.attrs((e=>({className:`operation-type ${e.type}`})))`
  width: 9ex;
  display: inline-block;
  height: ${e=>e.theme.typography.code.fontSize};
  line-height: ${e=>e.theme.typography.code.fontSize};
  background-color: #333;
  border-radius: 3px;
  background-repeat: no-repeat;
  background-position: 6px 4px;
  font-size: 7px;
  font-family: Verdana, sans-serif; // web-safe
  color: white;
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  margin-right: 6px;
  margin-top: 2px;

  &.get {
    background-color: ${({theme:e})=>e.colors.http.get};
  }

  &.post {
    background-color: ${({theme:e})=>e.colors.http.post};
  }

  &.put {
    background-color: ${({theme:e})=>e.colors.http.put};
  }

  &.options {
    background-color: ${({theme:e})=>e.colors.http.options};
  }

  &.patch {
    background-color: ${({theme:e})=>e.colors.http.patch};
  }

  &.delete {
    background-color: ${({theme:e})=>e.colors.http.delete};
  }

  &.basic {
    background-color: ${({theme:e})=>e.colors.http.basic};
  }

  &.link {
    background-color: ${({theme:e})=>e.colors.http.link};
  }

  &.head {
    background-color: ${({theme:e})=>e.colors.http.head};
  }

  &.hook {
    background-color: ${({theme:e})=>e.colors.primary.main};
  }

  &.schema {
    background-color: ${({theme:e})=>e.colors.http.basic};
  }
`;function Ry(e,{theme:t},n){return e>1?t.sidebar.level1Items[n]:1===e?t.sidebar.groupItems[n]:""}const Iy=ha.ul`
  margin: 0;
  padding: 0;

  &:first-child {
    padding-bottom: 32px;
  }

  & & {
    font-size: 0.929em;
  }

  ${e=>e.$expanded?"":"display: none;"};
`,$y=ha.li`
  list-style: none inside none;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  ${e=>0===e.depth?"margin-top: 15px":""};
`,Ny={0:ca`
    opacity: 0.7;
    text-transform: ${({theme:e})=>e.sidebar.groupItems.textTransform};
    font-size: 0.8em;
    padding-bottom: 0;
    cursor: default;
  `,1:ca`
    font-size: 0.929em;
    text-transform: ${({theme:e})=>e.sidebar.level1Items.textTransform};
  `},Ly=ha.label.attrs((e=>({className:Py()("-depth"+e.$depth,{active:e.$active})})))`
  cursor: pointer;
  color: ${e=>e.$active?Ry(e.$depth,e,"activeTextColor"):e.theme.sidebar.textColor};
  margin: 0;
  padding: 12.5px ${e=>4*e.theme.spacing.unit}px;
  ${({$depth:e,$type:t,theme:n})=>"section"===t&&e>1&&"padding-left: "+8*n.spacing.unit+"px;"||""}
  display: flex;
  justify-content: space-between;
  font-family: ${e=>e.theme.typography.headings.fontFamily};
  ${e=>Ny[e.$depth]};
  background-color: ${e=>e.$active?Ry(e.$depth,e,"activeBackgroundColor"):e.theme.sidebar.backgroundColor};

  ${e=>e.$deprecated&&Wu||""};

  &:hover {
    color: ${e=>Ry(e.$depth,e,"activeTextColor")};
    background-color: ${e=>Ry(e.$depth,e,"activeBackgroundColor")};
  }

  ${qu} {
    height: ${({theme:e})=>e.sidebar.arrow.size};
    width: ${({theme:e})=>e.sidebar.arrow.size};
    polygon {
      fill: ${({theme:e})=>e.sidebar.arrow.color};
    }
  }
`,Dy=ha.span`
  display: inline-block;
  vertical-align: middle;
  width: ${e=>e.width?e.width:"auto"};
  overflow: hidden;
  text-overflow: ellipsis;
`,My=ha.div`
  ${({theme:e})=>ca`
    font-size: 0.8em;
    margin-top: ${2*e.spacing.unit}px;
    text-align: center;
    position: fixed;
    width: ${e.sidebar.width};
    bottom: 0;
    background: ${e.sidebar.backgroundColor};

    a,
    a:visited,
    a:hover {
      color: ${e.sidebar.textColor} !important;
      padding: ${e.spacing.unit}px 0;
      border-top: 1px solid ${Nr(.1,e.sidebar.backgroundColor)};
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `};
  img {
    width: 15px;
    margin-right: 5px;
  }

  ${fa.lessThan("small")`
    width: 100%;
  `};
`,Fy=ha.button`
  border: 0;
  width: 100%;
  text-align: left;
  & > * {
    vertical-align: middle;
  }

  ${qu} {
    polygon {
      fill: ${({theme:e})=>Nr(e.colors.tonalOffset,e.colors.gray[100])};
    }
  }
`,zy=ha.span`
  text-decoration: ${e=>e.$deprecated?"line-through":"none"};
  margin-right: 8px;
`,Uy=ha(Ty)`
  margin: 0 5px 0 0;
`,By=ha((e=>{const{name:t,opened:r,className:i,onClick:o,httpVerb:a,deprecated:s}=e;return n.createElement(Fy,{className:i,onClick:o||void 0},n.createElement(Uy,{type:a},hs(a)),n.createElement(qu,{size:"1.5em",direction:r?"down":"right",float:"left"}),n.createElement(zy,{$deprecated:s},t),s?n.createElement(Vu,{type:"warning"}," ",di("deprecated")," "):null)}))`
  padding: 10px;
  border-radius: 2px;
  margin-bottom: 4px;
  line-height: 1.5em;
  background-color: ${({theme:e})=>e.colors.gray[100]};
  cursor: pointer;
  outline-color: ${({theme:e})=>Nr(e.colors.tonalOffset,e.colors.gray[100])};
`,qy=ha.div`
  padding: 10px 25px;
  background-color: ${({theme:e})=>e.colors.gray[50]};
  margin-bottom: 5px;
  margin-top: 5px;
`;class Vy extends n.PureComponent{constructor(){super(...arguments),this.selectElement=()=>{Jf.selectElement(this.child)}}render(){const{children:e}=this.props;return n.createElement("div",{ref:e=>this.child=e,onClick:this.selectElement,onFocus:this.selectElement,tabIndex:0,role:"button"},e)}}const Wy=ha.div`
  cursor: pointer;
  position: relative;
  margin-bottom: 5px;
`,Hy=ha.span`
  font-family: ${e=>e.theme.typography.code.fontFamily};
  margin-left: 10px;
  flex: 1;
  overflow-x: hidden;
  text-overflow: ellipsis;
`,Yy=ha.button`
  outline: 0;
  color: inherit;
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding: 10px 30px 10px ${e=>e.$inverted?"10px":"20px"};
  border-radius: ${e=>e.$inverted?"0":"4px 4px 0 0"};
  background-color: ${e=>e.$inverted?"transparent":e.theme.codeBlock.backgroundColor};
  display: flex;
  white-space: nowrap;
  align-items: center;
  border: ${e=>e.$inverted?"0":"1px solid transparent"};
  border-bottom: ${e=>e.$inverted?"1px solid #ccc":"0"};
  transition: border-color 0.25s ease;

  ${e=>e.$expanded&&!e.$inverted&&`border-color: ${e.theme.colors.border.dark};`||""}

  .${Hy} {
    color: ${e=>e.$inverted?e.theme.colors.text.primary:"#ffffff"};
  }
  &:focus {
    box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.45), 0 2px 0 rgba(128, 128, 128, 0.25);
  }
`,Qy=ha.span.attrs((e=>({className:`http-verb ${e.type}`})))`
  font-size: ${e=>e.$compact?"0.8em":"0.929em"};
  line-height: ${e=>e.$compact?"18px":"20px"};
  background-color: ${e=>e.theme.colors.http[e.type]||"#999999"};
  color: #ffffff;
  padding: ${e=>e.$compact?"2px 8px":"3px 10px"};
  text-transform: uppercase;
  font-family: ${e=>e.theme.typography.headings.fontFamily};
  margin: 0;
`,Gy=ha.div`
  position: absolute;
  width: 100%;
  z-index: 100;
  background: ${e=>e.theme.rightPanel.servers.overlay.backgroundColor};
  color: ${e=>e.theme.rightPanel.servers.overlay.textColor};
  box-sizing: border-box;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.33);
  overflow: hidden;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: all 0.25s ease;
  visibility: hidden;
  ${e=>e.$expanded?"visibility: visible;":"transform: translateY(-50%) scaleY(0);"}
`,Xy=ha.div`
  padding: 10px;
`,Ky=ha.div`
  padding: 5px;
  border: 1px solid #ccc;
  background: ${e=>e.theme.rightPanel.servers.url.backgroundColor};
  word-break: break-all;
  color: ${e=>e.theme.colors.primary.main};
  > span {
    color: ${e=>e.theme.colors.text.primary};
  }
`;class Zy extends n.Component{constructor(e){super(e),this.toggle=()=>{this.setState({expanded:!this.state.expanded})},this.state={expanded:!1}}render(){const{operation:e,inverted:t,hideHostname:r}=this.props,{expanded:i}=this.state;return n.createElement(Oa.Consumer,null,(o=>n.createElement(Wy,null,n.createElement(Yy,{onClick:this.toggle,$expanded:i,$inverted:t},n.createElement(Qy,{type:e.httpVerb,$compact:this.props.compact},e.httpVerb),n.createElement(Hy,null,e.path),n.createElement(qu,{float:"right",color:t?"black":"white",size:"20px",direction:i?"up":"down",style:{marginRight:"-25px"}})),n.createElement(Gy,{$expanded:i,"aria-hidden":!i},e.servers.map((t=>{const i=o.expandDefaultServerVariables?function(e,t={}){return e.replace(/(?:{)([\w-.]+)(?:})/g,((e,n)=>t[n]&&t[n].default||e))}(t.url,t.variables):t.url,a=function(e){try{return si(e).pathname}catch(t){return e}}(i);return n.createElement(Xy,{key:i},n.createElement(Wf,{source:t.description||"",compact:!0}),n.createElement(Vy,null,n.createElement(Ky,null,n.createElement("span",null,r||o.hideHostname?"/"===a?"":a:i),e.path)))}))))))}}class Jy extends n.PureComponent{render(){const{place:e,parameters:t}=this.props;return t&&t.length?n.createElement("div",{key:e},n.createElement($u,null,e," Parameters"),n.createElement(Ju,null,n.createElement("tbody",null,Jr(t,((e,t)=>n.createElement(ng,{key:e.name,isLast:t,field:e,showExamples:!0})))))):null}}Object.defineProperty,Object.getOwnPropertyDescriptor;let ev=class extends n.Component{constructor(){super(...arguments),this.switchMedia=({idx:e})=>{this.props.content&&void 0!==e&&this.props.content.activate(e)}}render(){const{content:e}=this.props;if(!e||!e.mediaTypes||!e.mediaTypes.length)return null;const t=e.activeMimeIdx,r=e.mediaTypes.map(((e,t)=>({value:e.name,idx:t}))),i=({children:e})=>this.props.withLabel?n.createElement(bh,null,n.createElement(vh,null,"Content type"),e):e;return n.createElement(n.Fragment,null,n.createElement(i,null,this.props.renderDropdown({value:r[t].value,options:r,onChange:this.switchMedia,ariaLabel:"Content type"})),this.props.children(e.active))}};ev=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],ev);var tv=Object.defineProperty,nv=Object.getOwnPropertySymbols,rv=Object.prototype.hasOwnProperty,iv=Object.prototype.propertyIsEnumerable,ov=(e,t,n)=>t in e?tv(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,av=(e,t)=>{for(var n in t||(t={}))rv.call(t,n)&&ov(e,n,t[n]);if(nv)for(var n of nv(t))iv.call(t,n)&&ov(e,n,t[n]);return e},sv=(e,t)=>{var n={};for(var r in e)rv.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&nv)for(var r of nv(e))t.indexOf(r)<0&&iv.call(e,r)&&(n[r]=e[r]);return n};const lv=["path","query","cookie","header"];class cv extends n.PureComponent{orderParams(e){const t={};return e.forEach((e=>{var n,r,i;i=e,(n=t)[r=e.in]||(n[r]=[]),n[r].push(i)})),t}render(){const{body:e,parameters:t=[]}=this.props;if(void 0===e&&void 0===t)return null;const r=this.orderParams(t),i=t.length>0?lv:[],o=e&&e.content,a=e&&e.description,s=e&&e.required;return n.createElement(n.Fragment,null,i.map((e=>n.createElement(Jy,{key:e,place:e,parameters:r[e]}))),o&&n.createElement(pv,{content:o,description:a,bodyRequired:s}))}}function uv(e){var t=e,{bodyRequired:r}=t,i=sv(t,["bodyRequired"]);const o="boolean"==typeof r&&!!r,a="boolean"==typeof r&&!r;return n.createElement($u,{key:"header"},"Request Body schema: ",n.createElement(Tf,av({},i)),o&&n.createElement(fv,null,"required"),a&&n.createElement(hv,null,"optional"))}function pv(e){const{content:t,description:r,bodyRequired:i}=e,{isRequestType:o}=t;return n.createElement(ev,{content:t,renderDropdown:e=>n.createElement(uv,av({bodyRequired:i},e))},(({schema:e})=>n.createElement(n.Fragment,null,void 0!==r&&n.createElement(Wf,{source:r}),"object"===(null==e?void 0:e.type)&&n.createElement(Dm,{constraints:(null==e?void 0:e.constraints)||[]}),n.createElement(Dg,{skipReadOnly:o,skipWriteOnly:!o,key:"schema",schema:e}))))}const dv="\n  text-transform: lowercase;\n  margin-left: 0;\n  line-height: 1.5em;\n",fv=ha(wm)`
  ${dv}
`,hv=ha("div")`
  ${dv}
  color: ${({theme:e})=>e.colors.text.secondary};
  font-size: ${e=>e.theme.schema.labelsTextSize};
`,mv=ha(n.memo((function({title:e,type:t,empty:r,code:i,opened:o,className:a,onClick:s}){return n.createElement("button",{className:a,onClick:!r&&s||void 0,"aria-expanded":o,disabled:r},!r&&n.createElement(qu,{size:"1.5em",color:t,direction:o?"down":"right",float:"left"}),n.createElement(vv,null,i," "),n.createElement(Wf,{compact:!0,inline:!0,source:e}))})))`
  display: block;
  border: 0;
  width: 100%;
  text-align: left;
  padding: 10px;
  border-radius: 2px;
  margin-bottom: 4px;
  line-height: 1.5em;
  cursor: pointer;

  color: ${e=>e.theme.colors.responses[e.type].color};
  background-color: ${e=>e.theme.colors.responses[e.type].backgroundColor};
  &:focus {
    outline: auto ${e=>e.theme.colors.responses[e.type].color};
  }
  ${e=>e.empty?'\ncursor: default;\n&::before {\n  content: "—";\n  font-weight: bold;\n  width: 1.5em;\n  text-align: center;\n  display: inline-block;\n  vertical-align: top;\n}\n&:focus {\n  outline: 0;\n}\n':""};
`,gv=ha.div`
  padding: 10px;
`,yv=ha($u).attrs({as:"caption"})`
  text-align: left;
  margin-top: 1em;
  caption-side: top;
`,vv=ha.strong`
  vertical-align: top;
`;class bv extends n.PureComponent{render(){const{headers:e}=this.props;return void 0===e||0===e.length?null:n.createElement(Ju,null,n.createElement(yv,null," Response Headers "),n.createElement("tbody",null,Jr(e,((e,t)=>n.createElement(ng,{isLast:t,key:e.name,field:e,showExamples:!0})))))}}var xv=Object.defineProperty,wv=Object.getOwnPropertySymbols,kv=Object.prototype.hasOwnProperty,Ov=Object.prototype.propertyIsEnumerable,Sv=(e,t,n)=>t in e?xv(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;class Ev extends n.PureComponent{constructor(){super(...arguments),this.renderDropdown=e=>n.createElement($u,{key:"header"},"Response Schema: ",n.createElement(Tf,((e,t)=>{for(var n in t||(t={}))kv.call(t,n)&&Sv(e,n,t[n]);if(wv)for(var n of wv(t))Ov.call(t,n)&&Sv(e,n,t[n]);return e})({},e)))}render(){const{description:e,extensions:t,headers:r,content:i}=this.props.response;return n.createElement(n.Fragment,null,e&&n.createElement(Wf,{source:e}),n.createElement($m,{extensions:t}),n.createElement(bv,{headers:r}),n.createElement(ev,{content:i,renderDropdown:this.renderDropdown},(({schema:e})=>n.createElement(n.Fragment,null,"object"===(null==e?void 0:e.type)&&n.createElement(Dm,{constraints:(null==e?void 0:e.constraints)||[]}),n.createElement(Dg,{skipWriteOnly:!0,key:"schema",schema:e})))))}}const _v=hm((({response:e})=>{const{extensions:t,headers:r,type:i,summary:o,description:a,code:s,expanded:l,content:c}=e,u=n.useMemo((()=>void 0===c?[]:c.mediaTypes.filter((e=>void 0!==e.schema))),[c]),p=n.useMemo((()=>!(t&&0!==Object.keys(t).length||0!==r.length||0!==u.length||a)),[t,r,u,a]);return n.createElement("div",null,n.createElement(mv,{onClick:()=>e.toggle(),type:i,empty:p,title:o||"",code:s,opened:l}),l&&!p&&n.createElement(gv,null,n.createElement(Ev,{response:e})))})),Av=ha.h3`
  font-size: 1.3em;
  padding: 0.2em 0;
  margin: 3em 0 1.1em;
  color: ${({theme:e})=>e.colors.text.primary};
  font-weight: normal;
`;class jv extends n.PureComponent{render(){const{responses:e,isCallback:t}=this.props;return e&&0!==e.length?n.createElement("div",null,n.createElement(Av,null,di(t?"callbackResponses":"responses")),e.map((e=>n.createElement(_v,{key:e.code,response:e})))):null}}function Cv(e){const{security:t,showSecuritySchemeType:r,expanded:i}=e,o=t.schemes.length>1;return 0===t.schemes.length?n.createElement(Gg,{$expanded:i},"None"):n.createElement(Gg,{$expanded:i},o&&"(",t.schemes.map((e=>n.createElement(Qg,{key:e.id},r&&`${ly[e.type]||e.type}: `,n.createElement("i",null,e.displayName),i&&e.scopes.length?[" (",e.scopes.map((e=>n.createElement(Yg,{key:e},e))),") "]:null))),o&&") ")}const Pv=({scopes:e})=>e.length?n.createElement("div",null,n.createElement("b",null,"Required scopes: "),e.map(((e,t)=>n.createElement(n.Fragment,{key:t},n.createElement("code",null,e)," ")))):null;function Tv(e){const t=(0,n.useContext)(Nu),r=null==t?void 0:t.options.showSecuritySchemeType,[i,o]=(0,n.useState)(!1),{securities:a}=e;if(!(null==a?void 0:a.length)||(null==t?void 0:t.options.hideSecuritySection))return null;const s=null==t?void 0:t.spec.securitySchemes.schemes.filter((({id:e})=>a.find((t=>t.schemes.find((t=>t.id===e))))));return n.createElement(n.Fragment,null,n.createElement(Jg,{$expanded:i},n.createElement(Xg,{onClick:()=>o(!i)},n.createElement(Zg,null,"Authorizations:"),n.createElement(qu,{size:"1.3em",direction:i?"down":"right"})),n.createElement(Kg,{$expanded:i},a.map(((e,t)=>n.createElement(Cv,{key:t,expanded:i,showSecuritySchemeType:r,security:e}))))),i&&(null==s?void 0:s.length)&&s.map(((e,t)=>n.createElement(ty,{key:t},n.createElement("h5",null,n.createElement(Rv,null)," ",ly[e.type]||e.type,": ",e.id),n.createElement(Wf,{source:e.description||""}),n.createElement(sy,{key:e.id,scheme:e,RequiredScopes:n.createElement(Pv,{scopes:Iv(e.id,a)})})))))}const Rv=()=>n.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"11",height:"11"},n.createElement("path",{fill:"currentColor",d:"M18 10V6A6 6 0 0 0 6 6v4H3v14h18V10h-3zM8 6c0-2.206 1.794-4 4-4s4 1.794 4 4v4H8V6zm11 16H5V12h14v10z"}));function Iv(e,t){const n=[];let r=t.length;for(;r--;){const i=t[r];let o=i.schemes.length;for(;o--;){const t=i.schemes[o];t.id===e&&Array.isArray(t.scopes)&&n.push(...t.scopes)}}return Array.from(new Set(n))}Object.defineProperty,Object.getOwnPropertyDescriptor;let $v=class extends n.Component{render(){const{operation:e}=this.props,{description:t,externalDocs:r}=e,i=!(!t&&!r);return n.createElement(qy,null,i&&n.createElement(Nv,null,void 0!==t&&n.createElement(Wf,{source:t}),r&&n.createElement(Pm,{externalDocs:r})),n.createElement(Zy,{operation:this.props.operation,inverted:!0,compact:!0}),n.createElement($m,{extensions:e.extensions}),n.createElement(Tv,{securities:e.security}),n.createElement(cv,{parameters:e.parameters,body:e.requestBody}),n.createElement(jv,{responses:e.responses,isCallback:e.isCallback}))}};$v=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],$v);const Nv=ha.div`
  margin-bottom: ${({theme:e})=>3*e.spacing.unit}px;
`;Object.defineProperty,Object.getOwnPropertyDescriptor;let Lv=class extends n.Component{constructor(){super(...arguments),this.toggle=()=>{this.props.callbackOperation.toggle()}}render(){const{name:e,expanded:t,httpVerb:r,deprecated:i}=this.props.callbackOperation;return n.createElement(n.Fragment,null,n.createElement(By,{onClick:this.toggle,name:e,opened:t,httpVerb:r,deprecated:i}),t&&n.createElement($v,{operation:this.props.callbackOperation}))}};Lv=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Lv);class Dv extends n.PureComponent{render(){const{callbacks:e}=this.props;return e&&0!==e.length?n.createElement("div",null,n.createElement(Mv,null," Callbacks "),e.map((e=>e.operations.map(((t,r)=>n.createElement(Lv,{key:`${e.name}_${r}`,callbackOperation:t})))))):null}}const Mv=ha.h3`
  font-size: 1.3em;
  padding: 0.2em 0;
  margin: 3em 0 1.1em;
  color: ${({theme:e})=>e.colors.text.primary};
  font-weight: normal;
`;Object.defineProperty,Object.getOwnPropertyDescriptor;let Fv=class extends n.Component{constructor(e){super(e),this.switchItem=({idx:e})=>{this.props.items&&void 0!==e&&this.setState({activeItemIdx:e})},this.state={activeItemIdx:0}}render(){const{items:e}=this.props;if(!e||!e.length)return null;const t=({children:e})=>this.props.label?n.createElement(bh,null,n.createElement(vh,null,this.props.label),e):e;return n.createElement(n.Fragment,null,n.createElement(t,null,this.props.renderDropdown({value:this.props.options[this.state.activeItemIdx].value,options:this.props.options,onChange:this.switchItem,ariaLabel:this.props.label||"Callback"})),this.props.children(e[this.state.activeItemIdx]))}};Fv=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Fv);var zv=Object.defineProperty,Uv=Object.defineProperties,Bv=(Object.getOwnPropertyDescriptor,Object.getOwnPropertyDescriptors),qv=Object.getOwnPropertySymbols,Vv=Object.prototype.hasOwnProperty,Wv=Object.prototype.propertyIsEnumerable,Hv=(e,t,n)=>t in e?zv(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;let Yv=class extends n.Component{constructor(){super(...arguments),this.renderDropdown=e=>{return n.createElement(Tf,(t=((e,t)=>{for(var n in t||(t={}))Vv.call(t,n)&&Hv(e,n,t[n]);if(qv)for(var n of qv(t))Wv.call(t,n)&&Hv(e,n,t[n]);return e})({Label:yh,Dropdown:xh},e),Uv(t,Bv({variant:"dark"}))));var t}}render(){const e=this.props.content;return void 0===e?null:n.createElement(ev,{content:e,renderDropdown:this.renderDropdown,withLabel:!0},(e=>n.createElement(kh,{key:"samples",mediaType:e,renderDropdown:this.renderDropdown})))}};Yv=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Yv);class Qv extends n.Component{render(){const e=this.props.callback.codeSamples.find((e=>wu(e)));return e?n.createElement(Gv,null,n.createElement(Yv,{content:e.requestBodyContent})):null}}const Gv=ha.div`
  margin-top: 15px;
`;var Xv=Object.defineProperty,Kv=Object.defineProperties,Zv=(Object.getOwnPropertyDescriptor,Object.getOwnPropertyDescriptors),Jv=Object.getOwnPropertySymbols,eb=Object.prototype.hasOwnProperty,tb=Object.prototype.propertyIsEnumerable,nb=(e,t,n)=>t in e?Xv(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;let rb=class extends n.Component{constructor(){super(...arguments),this.renderDropdown=e=>{return n.createElement(Tf,(t=((e,t)=>{for(var n in t||(t={}))eb.call(t,n)&&nb(e,n,t[n]);if(Jv)for(var n of Jv(t))tb.call(t,n)&&nb(e,n,t[n]);return e})({Label:yh,Dropdown:xh},e),Kv(t,Zv({variant:"dark"}))));var t}}render(){const{callbacks:e}=this.props;if(!e||0===e.length)return null;const t=e.map((e=>e.operations.map((e=>e)))).reduce(((e,t)=>e.concat(t)),[]);if(!t.some((e=>e.codeSamples.length>0)))return null;const r=t.map(((e,t)=>({value:`${e.httpVerb.toUpperCase()}: ${e.name}`,idx:t})));return n.createElement("div",null,n.createElement(Iu,null," Callback payload samples "),n.createElement(ib,null,n.createElement(Fv,{items:t,renderDropdown:this.renderDropdown,label:"Callback",options:r},(e=>n.createElement(Qv,{key:"callbackPayloadSample",callback:e,renderDropdown:this.renderDropdown})))))}};rb.contextType=Oa,rb=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],rb);const ib=ha.div`
  background: ${({theme:e})=>e.codeBlock.backgroundColor};
  padding: ${e=>4*e.theme.spacing.unit}px;
`;Object.defineProperty,Object.getOwnPropertyDescriptor;let ob=class extends n.Component{render(){const{operation:e}=this.props,t=e.codeSamples,r=t.length>0,i=1===t.length&&this.context.hideSingleRequestSampleTab;return r&&n.createElement("div",null,n.createElement(Iu,null," ",di("requestSamples")," "),n.createElement(Vp,{defaultIndex:0},n.createElement(Tp,{hidden:i},t.map((e=>n.createElement(Dp,{key:e.lang+"_"+(e.label||"")},void 0!==e.label?e.label:e.lang)))),t.map((e=>n.createElement(qp,{key:e.lang+"_"+(e.label||"")},wu(e)?n.createElement("div",null,n.createElement(Yv,{content:e.requestBodyContent})):n.createElement(dh,{lang:e.lang,source:e.source}))))))||null}};ob.contextType=Oa,ob=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],ob);Object.defineProperty,Object.getOwnPropertyDescriptor;let ab=class extends n.Component{render(){const{operation:e}=this.props,t=e.responses.filter((e=>e.content&&e.content.hasSample));return t.length>0&&n.createElement("div",null,n.createElement(Iu,null," ",di("responseSamples")," "),n.createElement(Vp,{defaultIndex:0},n.createElement(Tp,null,t.map((e=>n.createElement(Dp,{className:"tab-"+e.type,key:e.code},e.code)))),t.map((e=>n.createElement(qp,{key:e.code},n.createElement("div",null,n.createElement(Yv,{content:e.content})))))))||null}};ab=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],ab);var sb=Object.defineProperty,lb=Object.defineProperties,cb=Object.getOwnPropertyDescriptors,ub=Object.getOwnPropertySymbols,pb=Object.prototype.hasOwnProperty,db=Object.prototype.propertyIsEnumerable,fb=(e,t,n)=>t in e?sb(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;const hb=ha.div`
  margin-bottom: ${({theme:e})=>6*e.spacing.unit}px;
`,mb=hm((({operation:e})=>{const{name:t,description:r,deprecated:i,externalDocs:o,isWebhook:a,httpVerb:s}=e,l=!(!r&&!o),{showWebhookVerb:c}=n.useContext(Oa);return n.createElement(Oa.Consumer,null,(u=>n.createElement(ju,((e,t)=>lb(e,cb(t)))(((e,t)=>{for(var n in t||(t={}))pb.call(t,n)&&fb(e,n,t[n]);if(ub)for(var n of ub(t))db.call(t,n)&&fb(e,n,t[n]);return e})({},{[vf]:e.operationHash}),{id:e.operationHash}),n.createElement(Su,null,n.createElement(Ru,null,n.createElement(Uu,{to:e.id}),t," ",i&&n.createElement(Vu,{type:"warning"}," Deprecated "),a&&n.createElement(Vu,{type:"primary"}," ","Webhook ",c&&s&&"| "+s.toUpperCase())),u.pathInMiddlePanel&&!a&&n.createElement(Zy,{operation:e,inverted:!0}),l&&n.createElement(hb,null,void 0!==r&&n.createElement(Wf,{source:r}),o&&n.createElement(Pm,{externalDocs:o})),n.createElement($m,{extensions:e.extensions}),n.createElement(Tv,{securities:e.security}),n.createElement(cv,{parameters:e.parameters,body:e.requestBody}),n.createElement(jv,{responses:e.responses}),n.createElement(Dv,{callbacks:e.callbacks})),n.createElement(Au,null,!u.pathInMiddlePanel&&!a&&n.createElement(Zy,{operation:e}),n.createElement(ob,{operation:e}),n.createElement(ab,{operation:e}),n.createElement(rb,{callbacks:e.callbacks})))))}));var gb=Object.defineProperty,yb=Object.getOwnPropertyDescriptor,vb=Object.getOwnPropertySymbols,bb=Object.prototype.hasOwnProperty,xb=Object.prototype.propertyIsEnumerable,wb=(e,t,n)=>t in e?gb(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,kb=(e,t,n,r)=>{for(var i,o=r>1?void 0:r?yb(t,n):t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=(r?i(t,n,o):i(o))||o);return r&&o&&gb(t,n,o),o};let Ob=class extends n.Component{render(){const e=this.props.items;return 0===e.length?null:e.map((e=>n.createElement(Sb,{key:e.id,item:e})))}};Ob=kb([hm],Ob);let Sb=class extends n.Component{render(){const e=this.props.item;let t;const{type:r}=e;switch(r){case"group":t=null;break;case"tag":case"section":default:t=n.createElement(_b,((e,t)=>{for(var n in t||(t={}))bb.call(t,n)&&wb(e,n,t[n]);if(vb)for(var n of vb(t))xb.call(t,n)&&wb(e,n,t[n]);return e})({},this.props));break;case"operation":t=n.createElement(Ab,{item:e})}return n.createElement(n.Fragment,null,t&&n.createElement(Eu,{id:e.id,$underlined:"operation"===e.type},t),e.items&&n.createElement(Ob,{items:e.items}))}};Sb=kb([hm],Sb);const Eb=e=>n.createElement(Su,{$compact:!0},e);let _b=class extends n.Component{render(){const{name:e,description:t,externalDocs:r,level:i}=this.props.item,o=2===i?Ru:Tu;return n.createElement(n.Fragment,null,n.createElement(ju,null,n.createElement(Su,{$compact:!1},n.createElement(o,null,n.createElement(Uu,{to:this.props.item.id}),e))),n.createElement(jy,{parentId:this.props.item.id,source:t||"",htmlWrap:Eb}),r&&n.createElement(ju,null,n.createElement(Su,null,n.createElement(Pm,{externalDocs:r}))))}};_b=kb([hm],_b);let Ab=class extends n.Component{render(){return n.createElement(mb,{operation:this.props.item})}};Ab=kb([hm],Ab);var jb=Object.defineProperty,Cb=Object.defineProperties,Pb=(Object.getOwnPropertyDescriptor,Object.getOwnPropertyDescriptors),Tb=Object.getOwnPropertySymbols,Rb=Object.prototype.hasOwnProperty,Ib=Object.prototype.propertyIsEnumerable,$b=(e,t,n)=>t in e?jb(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;let Nb=class extends n.Component{constructor(){super(...arguments),this.ref=n.createRef(),this.activate=e=>{this.props.onActivate(this.props.item),e.stopPropagation()}}componentDidMount(){this.scrollIntoViewIfActive()}componentDidUpdate(){this.scrollIntoViewIfActive()}scrollIntoViewIfActive(){this.props.item.active&&this.ref.current&&Xr(this.ref.current)}render(){const{item:e,withoutChildren:t}=this.props;return n.createElement($y,{tabIndex:0,onClick:this.activate,depth:e.depth,"data-item-id":e.id,role:"menuitem"},"operation"===e.type?n.createElement(Lb,((e,t)=>Cb(e,Pb(t)))(((e,t)=>{for(var n in t||(t={}))Rb.call(t,n)&&$b(e,n,t[n]);if(Tb)for(var n of Tb(t))Ib.call(t,n)&&$b(e,n,t[n]);return e})({},this.props),{item:e})):n.createElement(Ly,{$depth:e.depth,$active:e.active,$type:e.type,ref:this.ref},"schema"===e.type&&n.createElement(Ty,{type:"schema"},"schema"),n.createElement(Dy,{width:"calc(100% - 38px)",title:e.sidebarLabel},e.sidebarLabel,this.props.children),e.depth>0&&e.items.length>0&&n.createElement(qu,{float:"right",direction:e.expanded?"down":"right"})||null),!t&&e.items&&e.items.length>0&&n.createElement(Bb,{expanded:e.expanded,items:e.items,onActivate:this.props.onActivate}))}};Nb=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Nb);const Lb=hm((e=>{const{item:t}=e,r=n.createRef(),{showWebhookVerb:i}=n.useContext(Oa);return n.useEffect((()=>{e.item.active&&r.current&&Xr(r.current)}),[e.item.active,r]),n.createElement(Ly,{$depth:t.depth,$active:t.active,$deprecated:t.deprecated,ref:r},t.isWebhook?n.createElement(Ty,{type:"hook"},i?t.httpVerb:di("webhook")):n.createElement(Ty,{type:t.httpVerb},hs(t.httpVerb)),n.createElement(Dy,{tabIndex:0,width:"calc(100% - 38px)"},t.sidebarLabel,e.children))}));var Db=Object.defineProperty,Mb=(Object.getOwnPropertyDescriptor,Object.getOwnPropertySymbols),Fb=Object.prototype.hasOwnProperty,zb=Object.prototype.propertyIsEnumerable,Ub=(e,t,n)=>t in e?Db(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;let Bb=class extends n.Component{render(){const{items:e,root:t,className:r}=this.props,i=null==this.props.expanded||this.props.expanded;return n.createElement(Iy,((e,t)=>{for(var n in t||(t={}))Fb.call(t,n)&&Ub(e,n,t[n]);if(Mb)for(var n of Mb(t))zb.call(t,n)&&Ub(e,n,t[n]);return e})({className:r,style:this.props.style,$expanded:i},t?{role:"menu"}:{}),e.map(((e,t)=>n.createElement(Nb,{key:t,item:e,onActivate:this.props.onActivate}))))}};function qb(){const[e,t]=(0,n.useState)(!1);return(0,n.useEffect)((()=>{t(!0)}),[]),e?n.createElement("img",{alt:"redocly logo",onError:()=>t(!1),src:"https://cdn.redoc.ly/redoc/logo-mini.svg"}):null}Bb=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Bb);Object.defineProperty,Object.getOwnPropertyDescriptor;let Vb=class extends n.Component{constructor(){super(...arguments),this.activate=e=>{if(e&&e.active&&this.context.menuToggle)return e.expanded?e.collapse():e.expand();this.props.menu.activateAndScroll(e,!0),setTimeout((()=>{this._updateScroll&&this._updateScroll()}))},this.saveScrollUpdate=e=>{this._updateScroll=e}}render(){const e=this.props.menu;return n.createElement(Cd,{updateFn:this.saveScrollUpdate,className:this.props.className,options:{wheelPropagation:!1}},n.createElement(Bb,{items:e.items,onActivate:this.activate,root:!0}),n.createElement(My,null,n.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://redocly.com/redoc/"},n.createElement(qb,null),"API docs by Redocly")))}};Vb.contextType=Oa,Vb=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Vb);const Wb=({open:e})=>{const t=e?8:-4;return n.createElement(Yb,null,n.createElement(Hb,{size:15,style:{transform:`translate(2px, ${t}px) rotate(180deg)`,transition:"transform 0.2s ease"}}),n.createElement(Hb,{size:15,style:{transform:`translate(2px, ${0-t}px)`,transition:"transform 0.2s ease"}}))},Hb=({size:e=10,className:t="",style:r})=>n.createElement("svg",{className:t,style:r||{},viewBox:"0 0 926.23699 573.74994",version:"1.1",x:"0px",y:"0px",width:e,height:e},n.createElement("g",{transform:"translate(904.92214,-879.1482)"},n.createElement("path",{d:"\n          m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,\n          -55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,\n          0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,\n          -174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,\n          -174.68583 0.6895,0 26.281,25.03215 56.8701,\n          55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864\n          -231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,\n          -104.0616 -231.873,-231.248 z\n        ",fill:"currentColor"}))),Yb=ha.div`
  user-select: none;
  width: 20px;
  height: 20px;
  align-self: center;
  display: flex;
  flex-direction: column;
  color: ${e=>e.theme.colors.primary.main};
`;Object.defineProperty,Object.getOwnPropertyDescriptor;let Qb;Qr&&(Qb=r(5114));const Gb=Qb&&Qb(),Xb=ha.div`
  width: ${e=>e.theme.sidebar.width};
  background-color: ${e=>e.theme.sidebar.backgroundColor};
  overflow: hidden;
  display: flex;
  flex-direction: column;

  backface-visibility: hidden;
  /* contain: strict; TODO: breaks layout since Chrome 80*/

  height: 100vh;
  position: sticky;
  position: -webkit-sticky;
  top: 0;

  ${fa.lessThan("small")`
    position: fixed;
    z-index: 20;
    width: 100%;
    background: ${({theme:e})=>e.sidebar.backgroundColor};
    display: ${e=>e.$open?"flex":"none"};
  `};

  @media print {
    display: none;
  }
`,Kb=ha.div`
  outline: none;
  user-select: none;
  background-color: ${({theme:e})=>e.fab.backgroundColor};
  color: ${e=>e.theme.colors.primary.main};
  display: none;
  cursor: pointer;
  position: fixed;
  right: 20px;
  z-index: 100;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  ${fa.lessThan("small")`
    display: flex;
  `};

  bottom: 44px;

  width: 60px;
  height: 60px;
  padding: 0 20px;
  svg {
    color: ${({theme:e})=>e.fab.color};
  }

  @media print {
    display: none;
  }
`;let Zb=class extends n.Component{constructor(){super(...arguments),this.state={offsetTop:"0px"},this.toggleNavMenu=()=>{this.props.menu.toggleSidebar()}}componentDidMount(){Gb&&Gb.add(this.stickyElement),this.setState({offsetTop:this.getScrollYOffset(this.context)})}componentWillUnmount(){Gb&&Gb.remove(this.stickyElement)}getScrollYOffset(e){let t;return t=void 0!==this.props.scrollYOffset?Si.normalizeScrollYOffset(this.props.scrollYOffset)():e.scrollYOffset(),t+"px"}render(){const e=this.props.menu.sideBarOpened,t=this.state.offsetTop;return n.createElement(n.Fragment,null,n.createElement(Xb,{$open:e,className:this.props.className,style:{top:t,height:`calc(100vh - ${t})`},ref:e=>{this.stickyElement=e}},this.props.children),!this.context.hideFab&&n.createElement(Kb,{onClick:this.toggleNavMenu},n.createElement(Wb,{open:e})))}};Zb.contextType=Oa,Zb=((e,t,n,r)=>{for(var i,o=t,a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(o)||o);return o})([hm],Zb);const Jb=ha.div`
  ${({theme:e})=>`\n  font-family: ${e.typography.fontFamily};\n  font-size: ${e.typography.fontSize};\n  font-weight: ${e.typography.fontWeightRegular};\n  line-height: ${e.typography.lineHeight};\n  color: ${e.colors.text.primary};\n  display: flex;\n  position: relative;\n  text-align: left;\n\n  -webkit-font-smoothing: ${e.typography.smoothing};\n  font-smoothing: ${e.typography.smoothing};\n  ${e.typography.optimizeSpeed?"text-rendering: optimizeSpeed !important":""};\n\n  tap-highlight-color: rgba(0, 0, 0, 0);\n  text-size-adjust: 100%;\n\n  * {\n    box-sizing: border-box;\n    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  }\n`};
`,ex=ha.div`
  z-index: 1;
  position: relative;
  overflow: hidden;
  width: calc(100% - ${e=>e.theme.sidebar.width});
  ${fa.lessThan("small",!0)`
    width: 100%;
  `};

  contain: layout;
`,tx=ha.div`
  background: ${({theme:e})=>e.rightPanel.backgroundColor};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: ${({theme:e})=>{if(e.rightPanel.width.endsWith("%")){const t=parseInt(e.rightPanel.width,10);return`calc((100% - ${e.sidebar.width}) * ${t/100})`}return e.rightPanel.width}};
  ${fa.lessThan("medium",!0)`
    display: none;
  `};
`,nx=ha.div`
  padding: 5px 0;
`,rx=ha.input.attrs((()=>({className:"search-input"})))`
  width: calc(100% - ${e=>8*e.theme.spacing.unit}px);
  box-sizing: border-box;
  margin: 0 ${e=>4*e.theme.spacing.unit}px;
  padding: 5px ${e=>2*e.theme.spacing.unit}px 5px
    ${e=>4*e.theme.spacing.unit}px;
  border: 0;
  border-bottom: 1px solid
    ${({theme:e})=>(Mr(e.sidebar.backgroundColor)>.5?Nr:zr)(.1,e.sidebar.backgroundColor)};
  font-family: ${({theme:e})=>e.typography.fontFamily};
  font-weight: bold;
  font-size: 13px;
  color: ${e=>e.theme.sidebar.textColor};
  background-color: transparent;
  outline: none;
`,ix=ha((e=>n.createElement("svg",{className:e.className,version:"1.1",viewBox:"0 0 1000 1000",x:"0px",xmlns:"http://www.w3.org/2000/svg",y:"0px"},n.createElement("path",{d:"M968.2,849.4L667.3,549c83.9-136.5,66.7-317.4-51.7-435.6C477.1-25,252.5-25,113.9,113.4c-138.5,138.3-138.5,362.6,0,501C219.2,730.1,413.2,743,547.6,666.5l301.9,301.4c43.6,43.6,76.9,14.9,104.2-12.4C981,928.3,1011.8,893,968.2,849.4z M524.5,522c-88.9,88.7-233,88.7-321.8,0c-88.9-88.7-88.9-232.6,0-321.3c88.9-88.7,233-88.7,321.8,0C613.4,289.4,613.4,433.3,524.5,522z"})))).attrs({className:"search-icon"})`
  position: absolute;
  left: ${e=>4*e.theme.spacing.unit}px;
  height: 1.8em;
  width: 0.9em;

  path {
    fill: ${e=>e.theme.sidebar.textColor};
  }
`,ox=ha.div`
  padding: ${e=>e.theme.spacing.unit}px 0;
  background-color: ${({theme:e})=>Nr(.05,e.sidebar.backgroundColor)}};
  color: ${e=>e.theme.sidebar.textColor};
  min-height: 150px;
  max-height: 250px;
  border-top: ${({theme:e})=>Nr(.1,e.sidebar.backgroundColor)}};
  border-bottom: ${({theme:e})=>Nr(.1,e.sidebar.backgroundColor)}};
  margin-top: 10px;
  line-height: 1.4;
  font-size: 0.9em;
  
  li {
    background-color: inherit;
  }

  ${Ly} {
    padding-top: 6px;
    padding-bottom: 6px;

    &:hover,
    &.active {
      background-color: ${({theme:e})=>Nr(.1,e.sidebar.backgroundColor)};
    }

    > svg {
      display: none;
    }
  }
`,ax=ha.i`
  position: absolute;
  display: inline-block;
  width: ${e=>2*e.theme.spacing.unit}px;
  text-align: center;
  right: ${e=>4*e.theme.spacing.unit}px;
  line-height: 2em;
  vertical-align: middle;
  margin-right: 2px;
  cursor: pointer;
  font-style: normal;
  color: '#666';
`;var sx=Object.defineProperty,lx=Object.getOwnPropertyDescriptor;class cx extends n.PureComponent{constructor(e){super(e),this.activeItemRef=null,this.clear=()=>{this.setState({results:[],noResults:!1,term:"",activeItemIdx:-1}),this.props.marker.unmark()},this.handleKeyDown=e=>{if(27===e.keyCode&&this.clear(),40===e.keyCode&&(this.setState({activeItemIdx:Math.min(this.state.activeItemIdx+1,this.state.results.length-1)}),e.preventDefault()),38===e.keyCode&&(this.setState({activeItemIdx:Math.max(0,this.state.activeItemIdx-1)}),e.preventDefault()),13===e.keyCode){const e=this.state.results[this.state.activeItemIdx];if(e){const t=this.props.getItemById(e.meta);t&&this.props.onActivate(t)}}},this.search=e=>{const{minCharacterLengthToInitSearch:t}=this.context,n=e.target.value;n.length<t?this.clearResults(n):this.setState({term:n},(()=>this.searchCallback(this.state.term)))},this.state={results:[],noResults:!1,term:"",activeItemIdx:-1}}clearResults(e){this.setState({results:[],noResults:!1,term:e}),this.props.marker.unmark()}setResults(e,t){this.setState({results:e,noResults:0===e.length}),this.props.marker.mark(t)}searchCallback(e){this.props.search.search(e).then((t=>{this.setResults(t,e)}))}render(){const{activeItemIdx:e}=this.state,t=this.state.results.filter((e=>this.props.getItemById(e.meta))).map((e=>({item:this.props.getItemById(e.meta),score:e.score}))).sort(((e,t)=>t.score-e.score));return n.createElement(nx,{role:"search"},this.state.term&&n.createElement(ax,{onClick:this.clear},"×"),n.createElement(ix,null),n.createElement(rx,{value:this.state.term,onKeyDown:this.handleKeyDown,placeholder:"Search...","aria-label":"Search",type:"text",onChange:this.search}),t.length>0&&n.createElement(Cd,{options:{wheelPropagation:!1}},n.createElement(ox,{"data-role":"search:results"},t.map(((t,r)=>n.createElement(Nb,{item:Object.create(t.item,{active:{value:r===e}}),onActivate:this.props.onActivate,withoutChildren:!0,key:t.item.id,"data-role":"search:result"}))))),this.state.term&&this.state.noResults?n.createElement(ox,{"data-role":"search:results"},di("noResultsFound")):null)}}cx.contextType=Oa,((e,t,n,r)=>{for(var i,o=lx(t,n),a=e.length-1;a>=0;a--)(i=e[a])&&(o=i(t,n,o)||o);o&&sx(t,n,o)})([Pa.bind,(0,Pa.debounce)(400)],cx.prototype,"searchCallback");class ux extends n.Component{componentDidMount(){this.props.store.onDidMount()}componentWillUnmount(){this.props.store.dispose()}render(){const{store:{spec:e,menu:t,options:r,search:i,marker:o}}=this.props,a=this.props.store;return n.createElement(da,{theme:r.theme},n.createElement(Lu,{value:a},n.createElement(Sa,{value:r},n.createElement(Jb,{className:"redoc-wrap"},n.createElement(Zb,{menu:t,className:"menu-content"},n.createElement(wy,{info:e.info}),!r.disableSearch&&n.createElement(cx,{search:i,marker:o,getItemById:t.getItemById,onActivate:t.activateAndScroll})||null,n.createElement(Vb,{menu:t})),n.createElement(ex,{className:"api-content"},n.createElement(yy,{store:a}),n.createElement(Ob,{items:t.items})),n.createElement(tx,null)))))}}ux.propTypes={store:ka.instanceOf(uy).isRequired};var px=Object.defineProperty,dx=Object.getOwnPropertySymbols,fx=Object.prototype.hasOwnProperty,hx=Object.prototype.propertyIsEnumerable,mx=(e,t,n)=>t in e?px(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,gx=(e,t)=>{for(var n in t||(t={}))fx.call(t,n)&&mx(e,n,t[n]);if(dx)for(var n of dx(t))hx.call(t,n)&&mx(e,n,t[n]);return e};const yx=function(e){const{spec:t,specUrl:i,options:o={},onLoaded:a}=e,s=ki(o.hideLoading,!1),l=new Si(o);if(void 0!==l.nonce)try{r.nc=l.nonce}catch(e){}return n.createElement(ya,null,n.createElement(Mu,{spec:t?gx({},t):void 0,specUrl:i,options:o,onLoaded:a},(({loading:e,store:t})=>e?s?null:n.createElement(wa,{color:l.theme.colors.primary.main}):n.createElement(ux,{store:t}))))};var vx=Object.defineProperty,bx=Object.getOwnPropertySymbols,xx=Object.prototype.hasOwnProperty,wx=Object.prototype.propertyIsEnumerable,kx=(e,t,n)=>t in e?vx(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Ox=(e,t)=>{for(var n in t||(t={}))xx.call(t,n)&&kx(e,n,t[n]);if(bx)for(var n of bx(t))wx.call(t,n)&&kx(e,n,t[n]);return e};Dt({useProxies:"ifavailable"});const Sx="2.1.3",Ex="b2d8e0f";function _x(e){const t=function(e){const t={},n=e.attributes;for(let e=0;e<n.length;e++){const r=n[e];t[r.name]=r.value}return t}(e),n={};for(const e in t){const r=e.replace(/-(.)/g,((e,t)=>t.toUpperCase())),i=t[e];n[r]="theme"===e?JSON.parse(i):i}return n}function Ax(e,t={},r=Gr("redoc"),i){if(null===r)throw new Error('"element" argument is not provided and <redoc> tag is not found on the page');let a,s;"string"==typeof e?a=e:"object"==typeof e&&(s=e),(0,o.render)(n.createElement(yx,{spec:s,onLoaded:i,specUrl:a,options:Ox(Ox({},t),_x(r))},["Loading..."]),r)}function jx(e=Gr("redoc")){e&&(0,o.unmountComponentAtNode)(e)}function Cx(e,t=Gr("redoc"),r){const i=uy.fromJS(e);setTimeout((()=>{(0,o.hydrate)(n.createElement(ux,{store:i}),t,r)}),0)}!function(){const e=Gr("redoc");if(!e)return;const t=e.getAttribute("spec-url");t&&Ax(t,{},e)}()}(),i}()}));
//# sourceMappingURL=redoc.standalone.js.map