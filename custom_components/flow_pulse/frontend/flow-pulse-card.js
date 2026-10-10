function t(t,e,i,o){var s,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(e,i,r):s(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new n(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,_=m?m.emptyScript:"",g=f.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);s?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=o;const n=s.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,i,o=!1,s){if(void 0!==t){const n=this.constructor;if(!1===o&&(s=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??b)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==s||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[y("elementProperties")]=new Map,$[y("finalized")]=new Map,g?.({ReactiveElement:$}),(f.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,k=x.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+z,O=`<${C}>`,P=document,M=()=>P.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,U="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,j=/>/g,D=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,I=/"/g,q=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),F=new WeakMap,G=P.createTreeWalker(P,129);function V(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,o=[];let s,n=2===e?"<svg>":3===e?"<math>":"",r=H;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===H?"!--"===c[1]?r=R:void 0!==c[1]?r=j:void 0!==c[2]?(q.test(c[2])&&(s=RegExp("</"+c[2],"g")),r=D):void 0!==c[3]&&(r=D):r===D?">"===c[0]?(r=s??H,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?D:'"'===c[3]?I:L):r===I||r===L?r=D:r===R||r===j?r=H:(r=D,s=void 0);const d=r===D&&t[e+1].startsWith("/>")?" ":"";n+=r===H?i+O:l>=0?(o.push(a),i.slice(0,l)+E+i.slice(l)+z+d):i+z+(-2===l?e:d)}return[V(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class X{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[c,l]=Y(t,e);if(this.el=X.createElement(c,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=G.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(E)){const e=l[n++],i=o.getAttribute(t).split(z),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(z)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(q.test(o.tagName)){const t=o.textContent.split(z),e=t.length-1;if(e>0){o.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],M()),G.nextNode(),a.push({type:2,index:++s});o.append(t[e],M())}}}else if(8===o.nodeType)if(o.data===C)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(z,t+1));)a.push({type:7,index:s}),t+=z.length-1}s++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,o){if(e===B)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=T(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=J(t,s._$AS(t,e.values),s,o)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??P).importNode(e,!0);G.currentNode=o;let s=G.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new st(s,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(s=G.nextNode(),n++)}return G.currentNode=P,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),T(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new Z(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new X(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new Q(this.O(M()),this.O(M()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,o){const s=this.strings;let n=!1;if(void 0===s)t=J(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=J(this,o[i+r],e,r),a===B&&(a=this._$AH[r]),n||=!T(a)||a!==this._$AH[r],a===K?t=K:t!==K&&(t+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class ot extends tt{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??K)===B)return;const i=this._$AH,o=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==K&&(i===K||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(X,Q),(x.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;let at=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new Q(e.insertBefore(M(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const lt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},ht=(t=lt,e,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function dt(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return dt({...t,state:!0,attribute:!1})}const ut=1,ft=6,mt=t=>(...e)=>({_$litDirective$:t,values:e});class _t{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const gt=mt(class extends _t{constructor(t){if(super(t),t.type!==ut||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const o=!!e[t];o===this.st.has(t)||this.nt?.has(t)||(o?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return B}}),yt=[{key:"1h",minutes:60},{key:"8h",minutes:480},{key:"1d",minutes:1440},{key:"1w",minutes:10080}],vt=t=>void 0===t?[]:Array.isArray(t)?t:[t],bt=t=>t.startsWith("automation.");function wt(t,e){const i=t.states[e];return String(t.entities[e]?.name||i?.attributes.friendly_name||e.split(".")[1]?.replace(/_/g," ")||e)}const $t=t=>(e,i)=>wt(t,e).localeCompare(wt(t,i),void 0,{sensitivity:"base",numeric:!0});function xt(t,e,i){if((t=>!t||"unavailable"===t.state||"unknown"===t.state)(t))return"broken";if((t=>Number(t?.attributes.current??0)>0)(t))return"running";if("off"===t.state)return i?"snoozed":"off";if(function(t){return!(!t||!t.error&&"error"!==t.script_execution)}(e)){const i=t.attributes.last_triggered;if(!i||Date.parse(e.timestamp.start)>=Date.parse(i)-2e3)return"failed"}return"on"}const At=mt(class extends _t{constructor(t){if(super(t),t.type!==ft)throw new Error("actionHandler must be used on an element")}update(t,[e]){const i=t.element;return i.__fpcOptions=e??{},function(t){if(t.__fpcBound)return;let e,i;t.__fpcBound=!0;let o=!1,s=0,n=0;const r=e=>t.dispatchEvent(new CustomEvent("fpc-action",{detail:{action:e},bubbles:!1,composed:!1})),a=()=>{e&&window.clearTimeout(e),e=void 0};t.addEventListener("pointerdown",i=>{t.__fpcOptions?.disabled||0!==i.button||(o=!1,s=i.clientX,n=i.clientY,t.__fpcOptions?.hasHold&&(e=window.setTimeout(()=>{o=!0,e=void 0,navigator.vibrate&&navigator.vibrate(30),r("hold")},500)))}),t.addEventListener("pointermove",t=>{e&&(Math.abs(t.clientX-s)>10||Math.abs(t.clientY-n)>10)&&a()}),t.addEventListener("pointercancel",a),t.addEventListener("pointerleave",a),t.addEventListener("contextmenu",e=>{t.__fpcOptions?.hasHold&&e.preventDefault()}),t.addEventListener("pointerup",s=>{if(t.__fpcOptions?.disabled||0!==s.button)return;const n=!!e;a(),o?o=!1:!n&&t.__fpcOptions?.hasHold||(t.__fpcOptions?.hasDoubleTap?i?(window.clearTimeout(i),i=void 0,r("double_tap")):i=window.setTimeout(()=>{i=void 0,r("tap")},250):r("tap"))}),t.addEventListener("keydown",e=>{t.__fpcOptions?.disabled||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),r("tap"))})}(i),B}render(t){return B}}),kt={title:"Automations",just_now:"just now",never_ran:"Never ran",running:"Running",failed:"Failed · {when}",failed_now:"Failed",broken:"Needs a look",snoozed_today:"Snoozed until {time}",snoozed_tomorrow:"Snoozed until tomorrow {time}",snoozed_week:"Snoozed until {day} {time}",snoozed_date:"Snoozed until {date}",chip_off:"{n} off",chip_attention:"{n} need a look",chip_attention_one:"1 needs a look",other:"Other",empty:"No automations here yet.",empty_hint:"Pick some in the card editor, or give them the card's label.",empty_filter:"Nothing here right now.",more:"More actions for {name}",toggle:"{name}: on or off",menu_run:"Run now",menu_run_check:"Run if conditions pass",menu_stop:"Stop and turn off",menu_snooze:"Snooze",menu_resume:"Resume now",menu_edit:"Edit automation",menu_traces:"Traces",snooze_1h:"1 h",snooze_8h:"8 h",snooze_1d:"1 day",snooze_1w:"1 week",confirm_off:"Turn off {name}?",confirm_run:"Run {name}?",confirm_stop:"Stop {name} and turn it off?",confirm_snooze:"Snooze {name}?",started:"{name} started",snoozed_toast:"{name} snoozed",error:"Couldn't do that: {error}",ed_title:"Title",ed_label:"Show automations with these labels",ed_entities:"Show these automations first",ed_exclude:"Never show",ed_group_by:"Group by",ed_group_none:"Nothing",ed_group_label:"Label",ed_group_area:"Area",ed_group_category:"Category",ed_confirm:"Ask before turning off or running",ed_hint:"The automations you pick come first, then every automation with one of the labels. With neither, the card shows all your automations.",ed_section_more:"More"},St={en:kt,el:{title:"Αυτοματισμοί",just_now:"μόλις τώρα",never_ran:"Δεν έχει τρέξει",running:"Τρέχει",failed:"Απέτυχε · {when}",failed_now:"Απέτυχε",broken:"Θέλει έλεγχο",snoozed_today:"Σε αναβολή έως τις {time}",snoozed_tomorrow:"Σε αναβολή έως αύριο {time}",snoozed_week:"Σε αναβολή έως {day} {time}",snoozed_date:"Σε αναβολή έως {date}",chip_off:"{n} ανενεργοί",chip_attention:"{n} θέλουν έλεγχο",chip_attention_one:"1 θέλει έλεγχο",other:"Άλλοι",empty:"Δεν υπάρχουν ακόμη αυτοματισμοί εδώ.",empty_hint:"Διάλεξε κάποιους στον επεξεργαστή της κάρτας ή δώσ' τους την ετικέτα της κάρτας.",empty_filter:"Τίποτα εδώ αυτή τη στιγμή.",more:"Περισσότερες ενέργειες για {name}",toggle:"{name}: ενεργός ή ανενεργός",menu_run:"Εκτέλεση τώρα",menu_run_check:"Εκτέλεση αν ισχύουν οι συνθήκες",menu_stop:"Διακοπή και απενεργοποίηση",menu_snooze:"Αναβολή",menu_resume:"Συνέχιση τώρα",menu_edit:"Επεξεργασία αυτοματισμού",menu_traces:"Ίχνη εκτέλεσης",snooze_1h:"1 ώρα",snooze_8h:"8 ώρες",snooze_1d:"1 μέρα",snooze_1w:"1 εβδ.",confirm_off:"Απενεργοποίηση του «{name}»;",confirm_run:"Εκτέλεση του «{name}»;",confirm_stop:"Διακοπή και απενεργοποίηση του «{name}»;",confirm_snooze:"Αναβολή του «{name}»;",started:"Ξεκίνησε: {name}",snoozed_toast:"Σε αναβολή: {name}",error:"Δεν έγινε: {error}",ed_title:"Τίτλος",ed_label:"Δείξε αυτοματισμούς με αυτές τις ετικέτες",ed_entities:"Δείξε πρώτα αυτούς τους αυτοματισμούς",ed_exclude:"Να μην εμφανίζονται ποτέ",ed_group_by:"Ομαδοποίηση κατά",ed_group_none:"Καμία",ed_group_label:"Ετικέτα",ed_group_area:"Χώρο",ed_group_category:"Κατηγορία",ed_confirm:"Ερώτηση πριν την απενεργοποίηση ή την εκτέλεση",ed_hint:"Πρώτα εμφανίζονται οι αυτοματισμοί που διαλέγεις, μετά όσοι έχουν μία από τις ετικέτες. Χωρίς κανένα από τα δύο, η κάρτα δείχνει όλους τους αυτοματισμούς σου.",ed_section_more:"Περισσότερα"}};function Et(t,e,i={}){const o=function(t){return(t?.locale?.language||t?.language||"en").split("-")[0]}(t),s=St[o]??kt,n=1===i.n&&(s[`${e}_one`]??kt[`${e}_one`])?`${e}_one`:e;let r=s[n]??kt[n]??e;for(const[t,e]of Object.entries(i))r=r.replace(`{${t}}`,String(e));return r}const zt=t=>t?.locale?.language||t?.language||"en",Ct=t=>"12"===t?.locale?.time_format||"24"!==t?.locale?.time_format&&void 0;function Ot(t,e,i=new Date){const o=new Date(e);if(Number.isNaN(o.getTime()))return"";const s=zt(t),n=o.toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit",hour12:Ct(t)}),r=function(t,e){const i=t=>new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime(),o=Math.round((i(t)-i(e))/864e5);return o<=0?"today":1===o?"tomorrow":o<7?"week":"date"}(o,i);return"today"===r?Et(t,"snoozed_today",{time:n}):"tomorrow"===r?Et(t,"snoozed_tomorrow",{time:n}):"week"===r?Et(t,"snoozed_week",{day:o.toLocaleDateString(s,{weekday:"short"}),time:n}):Et(t,"snoozed_date",{date:o.toLocaleDateString(s,{day:"numeric",month:"short"})})}function Pt(t,e){!function(t,e,i){t.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}(t,"hass-notification",{message:e})}function Mt(t){return String(t&&"object"==typeof t&&"message"in t?t.message:t)}const Tt=r`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then a plain literal. Without the Pulse theme the card follows HA's theme. */
    --fpc-accent: var(--pulse-accent, var(--primary-color));
    --fpc-on-accent: var(--pulse-on-accent, var(--text-primary-color, #fff));
    --fpc-warn: var(--pulse-warn, var(--orange-color, #ff9800));
    --fpc-bad: var(--pulse-bad, var(--red-color, #f44336));
    --fpc-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 6%, transparent));
    --fpc-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    --fpc-neutral-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --fpc-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --fpc-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --fpc-chip-height: var(--pulse-chip-height, 30px);
    --fpc-row-height: var(--pulse-row-height, 56px);
    --fpc-gap: var(--pulse-gap, 12px);
    --fpc-pad: var(--pulse-pad, 12px);
    --fpc-motion-fast: var(--pulse-motion-fast, 120ms);
    --fpc-motion-normal: var(--pulse-motion-normal, 200ms);
    --fpc-motion-slow: var(--pulse-motion-slow, 250ms);
    --fpc-ease: var(--pulse-ease, ease);
    /* Switches read Home Assistant's own switch variables (set by the Pulse theme), so ours and the native
       ha-switch are one family: on in the accent; off a thumb on a faint track (HA draws the track at 38%). */
    --fpc-switch-on: var(--switch-checked-color, var(--fpc-accent));
    --fpc-switch-off-thumb: var(--switch-unchecked-button-color, var(--secondary-text-color));
    --fpc-switch-off-track: color-mix(in srgb, var(--switch-unchecked-track-color, var(--secondary-text-color)) 38%, transparent);
    /* Fills inside the menu: a share of the text colour, because the menu sits on HA's dialog surface,
       where a frosted-white fill (Pulse Glass light) would vanish. */
    --fpc-menu-fill: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    --fpc-menu-fill-hover: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    display: block;
    height: 100%;
  }

  ha-card {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: calc(var(--fpc-gap) - 4px);
    padding: var(--fpc-pad);
    overflow: hidden;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible {
    outline: 2px solid var(--fpc-accent);
    outline-offset: 2px;
  }

  /* ---- Header: title and the quiet counts ---- */
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: var(--fpc-chip-height);
    padding: 0 2px;
  }
  .title {
    flex: 1;
    min-width: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chips {
    display: flex;
    gap: 6px;
    flex: none;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--fpc-chip-height);
    padding: 0 12px 0 10px;
    border-radius: calc(var(--fpc-chip-height) / 2);
    background: var(--fpc-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color var(--fpc-motion-normal) var(--fpc-ease), color var(--fpc-motion-normal) var(--fpc-ease),
      transform var(--fpc-motion-fast) var(--fpc-ease);
    --mdc-icon-size: 16px;
  }
  .chip:hover {
    background: var(--fpc-neutral-bg-hover);
  }
  .chip:active {
    transform: scale(0.96);
  }
  .chip.selected,
  .chip.selected:hover {
    background: var(--fpc-neutral-strong);
    color: var(--primary-text-color);
  }
  .chip.attention ha-icon {
    color: var(--fpc-bad);
  }

  /* ---- Sections ---- */
  .section-title {
    margin: 6px 4px 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: var(--secondary-text-color);
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* ---- Rows ---- */
  .row {
    --c: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: var(--fpc-row-height);
    border-radius: var(--fpc-control-radius);
    transition: background-color var(--fpc-motion-normal) var(--fpc-ease);
  }
  .row:hover {
    background: var(--fpc-neutral-bg);
  }
  .main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    padding: 0 4px 0 8px;
    border-radius: var(--fpc-control-radius);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    outline: none;
  }
  .main:focus-visible {
    box-shadow: inset 0 0 0 2px var(--fpc-accent);
  }
  .disc {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--fpc-neutral-bg);
    color: var(--c);
    transition: color var(--fpc-motion-slow) var(--fpc-ease), opacity var(--fpc-motion-slow) var(--fpc-ease);
    --mdc-icon-size: 20px;
  }
  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .name {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: opacity var(--fpc-motion-slow) var(--fpc-ease);
  }
  .secondary {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* Colour by status: only the icon, and the words when something is wrong. */
  .row.on,
  .row.running {
    --c: var(--fpc-accent);
  }
  .row.failed {
    --c: var(--fpc-bad);
  }
  .row.failed .secondary {
    color: var(--fpc-bad);
  }
  .row.broken {
    --c: var(--fpc-warn);
  }
  .row.broken .secondary {
    color: var(--fpc-warn);
  }
  /* Off (and snoozed): the whole row steps back. */
  .row.off .disc,
  .row.snoozed .disc,
  .row.off .name,
  .row.snoozed .name {
    opacity: 0.55;
  }
  /* Running: the icon breathes while the run lasts (meaningful motion only). */
  .row.running .disc ha-icon {
    animation: fpc-breathe 1100ms var(--fpc-ease) infinite alternate;
  }
  @keyframes fpc-breathe {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.35;
    }
  }

  /* ---- Switch ---- */
  .switch {
    flex: none;
    width: 52px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 22px;
  }
  .switch[disabled] {
    cursor: default;
    opacity: 0.4;
  }
  .track {
    position: relative;
    width: 40px;
    height: 24px;
    border-radius: 12px;
    background: var(--fpc-switch-off-track);
    transition: background-color var(--fpc-motion-normal) var(--fpc-ease);
  }
  .thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--fpc-switch-off-thumb);
    transition: transform var(--fpc-motion-normal) var(--fpc-ease), background-color var(--fpc-motion-normal) var(--fpc-ease);
  }
  .switch.on .track {
    background: var(--fpc-switch-on);
  }
  .switch.on .thumb {
    transform: translateX(16px);
    background: var(--fpc-on-accent);
  }
  .switch.pending .thumb {
    animation: fpc-breathe 700ms var(--fpc-ease) infinite alternate;
  }

  /* ---- The ⋯ button ---- */
  .more {
    flex: none;
    width: 40px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--fpc-control-radius);
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  .more:hover,
  .more[aria-expanded="true"] {
    background: var(--fpc-neutral-bg-hover);
    color: var(--primary-text-color);
  }

  /* ---- Menu (a popover in the top layer, so no card can clip it) ---- */
  .menu {
    position: fixed;
    inset: auto;
    margin: 0;
    box-sizing: border-box;
    min-width: 220px;
    max-width: min(300px, calc(100vw - 16px));
    padding: 6px;
    border: 1px solid var(--divider-color);
    border-radius: var(--fpc-control-radius);
    /* HA's own surface for things that float (dialogs): frosted in Pulse Glass, solid elsewhere. */
    background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
    -webkit-backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
    backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
  }
  .menu:not(:popover-open):not(.open) {
    display: none;
  }
  .menu-head {
    padding: 6px 10px 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: calc(var(--fpc-control-radius) - 4px);
    font-size: 14px;
    text-align: start;
    --mdc-icon-size: 20px;
  }
  .item ha-icon {
    color: var(--secondary-text-color);
  }
  .item:hover,
  .item:focus-visible {
    outline: none;
    background: var(--fpc-menu-fill);
  }
  .sep {
    height: 1px;
    margin: 4px 6px;
    background: var(--divider-color);
  }
  .snooze {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px 10px 8px;
  }
  .snooze-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    --mdc-icon-size: 20px;
  }
  .snooze-label ha-icon {
    color: var(--secondary-text-color);
  }
  .presets {
    display: flex;
    gap: 6px;
    padding-inline-start: 32px;
    flex-wrap: wrap;
  }
  .presets .chip {
    padding: 0 12px;
    background: var(--fpc-menu-fill);
  }
  .presets .chip:hover {
    background: var(--fpc-menu-fill-hover);
  }

  /* ---- Empty and warnings ---- */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px 8px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 13px;
    --mdc-icon-size: 28px;
  }
  .empty ha-icon {
    opacity: 0.6;
    margin-bottom: 4px;
  }
  .empty .hint {
    font-size: 12px;
    opacity: 0.85;
  }

  @media (prefers-reduced-motion: reduce) {
    .row,
    .disc,
    .name,
    .chip,
    .track,
    .thumb {
      transition: none;
    }
    .row.running .disc ha-icon,
    .switch.pending .thumb {
      animation: none;
      opacity: 0.6;
    }
  }
`;function Nt(t,e){const i=()=>{customElements.get(t)||customElements.define(t,e)};return document.querySelector("home-assistant")&&!customElements.get("home-assistant")?customElements.whenDefined("home-assistant").then(i):(i(),Promise.resolve())}const Ut={entity:{multiple:!0,filter:[{domain:"automation"}]}};function Ht(t){const e={};for(const[i,o]of Object.entries(t))null!=o&&""!==o&&(Array.isArray(o)&&!o.length||"group_by"===i&&"none"===o||(e[i]=o));return e}class Rt extends at{constructor(){super(...arguments),this._ready=!1,this._t=t=>Et(this.hass,t),this._label=t=>{const e=`ed_${t.name}`,i=this._t(e);return i===e?t.name:i}}connectedCallback(){super.connectedCallback(),async function(){if(!customElements.get("ha-form")||!customElements.get("ha-selector"))try{const t=await(window.loadCardHelpers?.()),e=await(t?.createCardElement({type:"entities",entities:[]}));await(e?.constructor?.getConfigElement?.())}catch{}}().then(()=>this._ready=!0)}setConfig(t){this._config=t}_schema(){const t=this._t;return[{name:"title",selector:{text:{}}},{name:"label",selector:{label:{multiple:!0}}},{name:"entities",selector:Ut},{type:"expandable",name:"",title:t("ed_section_more"),icon:"mdi:tune-variant",flatten:!0,schema:[{name:"group_by",selector:{select:{mode:"dropdown",options:["none","label","area","category"].map(e=>({value:e,label:t(`ed_group_${e}`)}))}}},{name:"confirm",selector:Ut},{name:"exclude",selector:Ut}]}]}_changed(t){t.stopPropagation();const e={...t.detail.value},i=vt(e.label);e.label=1===i.length?i[0]:i;const o={...Ht(e),type:this._config.type};this._config=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config||!this._ready)return K;const t={group_by:"none",...this._config,label:vt(this._config.label)};return W`
      <p class="hint">${this._t("ed_hint")}</p>
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${this._schema()}
        .computeLabel=${this._label}
        @value-changed=${this._changed}
      ></ha-form>
    `}}Rt.styles=r`
    :host {
      display: block;
    }
    .hint {
      margin: 0 0 12px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
  `,t([dt({attribute:!1})],Rt.prototype,"hass",void 0),t([pt()],Rt.prototype,"_config",void 0),t([pt()],Rt.prototype,"_ready",void 0);const jt="0.1.0";class Dt extends at{constructor(){super(...arguments),this._snoozes={},this._snoozeOk=!1,this._traces=new Map,this._labelNames={},this._categoryOf={},this._categoryNames={},this._filter="all",this._ids=[],this._deps=[],this._watched=new Set,this._pending=new Map,this._traceKey="",this._labelsLoaded=!1,this._categoryKey="",this._t=(t,e)=>Et(this.hass,t,e),this._menuToggled=t=>{"closed"===t.newState&&(this._menu=void 0)}}static getConfigElement(){return document.createElement("flow-pulse-card-editor")}static getStubConfig(t){const e=function(t,e=4){return t?Object.values(t.states).filter(e=>bt(e.entity_id)&&!t.entities?.[e.entity_id]?.hidden).sort((t,e)=>Date.parse(String(e.attributes.last_triggered??0))-Date.parse(String(t.attributes.last_triggered??0))).slice(0,e).map(t=>t.entity_id):[]}(t);return e.length?{entities:e}:{}}setConfig(t){if(!t)throw new Error("Invalid configuration");for(const e of["entities","exclude","confirm"]){const i=t[e];if(void 0!==i&&(!Array.isArray(i)||i.some(t=>"string"!=typeof t)))throw new Error(`\`${e}\` must be a list of automation entity ids`)}if(void 0!==t.label&&vt(t.label).some(t=>"string"!=typeof t))throw new Error("`label` must be a label id or a list of them");if(void 0!==t.group_by&&!["none","label","area","category"].includes(t.group_by))throw new Error("`group_by` must be none, label, area or category");this._config={...t},this._deps=[],this._filter="all"}getCardSize(){return 1+Math.max(1,this._ids.length)}getGridOptions(){return{columns:6,min_columns:4,rows:"auto"}}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>this.requestUpdate(),6e4),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._ticker&&window.clearInterval(this._ticker),this._traceTimer&&window.clearTimeout(this._traceTimer);for(const t of this._pending.values())window.clearTimeout(t.timer);this._pending.clear(),this._unsubscribe()}shouldUpdate(t){if(!this._config)return!1;if(!t.has("hass")||t.size>1)return!0;const e=t.get("hass"),i=this.hass;if(!e||!i)return!0;if(e.entities!==i.entities||e.areas!==i.areas||e.language!==i.language||e.locale!==i.locale)return!0;for(const t of this._watched)if(e.states[t]!==i.states[t])return!0;return!1}willUpdate(){const t=this.hass,e=this._config;if(!t||!e)return;const i=[t.entities,e];var o;i.some((t,e)=>t!==this._deps[e])&&(this._deps=i,this._ids=function(t,e){const i=new Set(e.exclude??[]),o=(e.entities??[]).filter(t=>bt(t)&&!i.has(t)),s=vt(e.label),n=new Set(o),r=Object.keys(t.states).filter(t=>bt(t)&&!i.has(t)&&!n.has(t));let a;return a=s.length?r.filter(e=>(t.entities[e]?.labels??[]).some(t=>s.includes(t))):o.length?[]:r.filter(e=>!t.entities[e]?.hidden),[...new Set([...o,...a.sort($t(t))])]}(t,e),this._watched=(o=this._ids,new Set(o)));for(const[e,i]of this._pending)"on"===t.states[e]?.state===i.on&&(window.clearTimeout(i.timer),this._pending.delete(e))}updated(){this.hass&&this._config&&(this._subscribe(),this._scheduleTraces(),this._loadGroupSources())}get _admin(){return!0===this.hass?.user?.is_admin}_subscribe(){!this._unsub&&this.hass?.connection&&this.isConnected&&(this._unsub=this.hass.connection.subscribeMessage(t=>{this._snoozes=t.snoozes??{},this._snoozeOk=!0},{type:"flow_pulse/subscribe"}).catch(()=>{this._snoozeOk=!1}))}_unsubscribe(){const t=this._unsub;this._unsub=void 0,t?.then(t=>t?.()).catch(()=>{})}_scheduleTraces(){if(!this._admin)return;const t=(e=this.hass,this._ids.map(t=>{const i=e.states[t];return`${i?.attributes.last_triggered??""}|${i?.attributes.current??0}`}).join(";"));var e;if(t===this._traceKey)return;const i=""===this._traceKey;this._traceKey=t,this._traceTimer&&window.clearTimeout(this._traceTimer),this._traceTimer=window.setTimeout(()=>this._loadTraces(),i?0:1500)}async _loadTraces(){try{const t=await this.hass.callWS({type:"trace/list",domain:"automation"});this._traces=function(t){const e=new Map;for(const i of t){const t=e.get(i.item_id);(!t||Date.parse(i.timestamp.start)>Date.parse(t.timestamp.start))&&e.set(i.item_id,i)}return e}(t??[])}catch{}}async _loadGroupSources(){const t=this._config.group_by;if("label"===t&&!this._labelsLoaded){this._labelsLoaded=!0;try{const t=await this.hass.callWS({type:"config/label_registry/list"});this._labelNames=Object.fromEntries(t.map(t=>[t.label_id,t.name]))}catch{}}if("category"===t){const t=this._ids.join(",");if(t===this._categoryKey)return;this._categoryKey=t;try{const[t,e]=await Promise.all([this.hass.callWS({type:"config/category_registry/list",scope:"automation"}),this.hass.callWS({type:"config/entity_registry/get_entries",entity_ids:this._ids})]);this._categoryNames=Object.fromEntries(t.map(t=>[t.category_id,t.name])),this._categoryOf=Object.fromEntries(Object.entries(e).map(([t,e])=>[t,e?.categories?.automation??void 0]))}catch{}}}_rows(){const t=function(t,e,i,o,s){const n=new Set(e.confirm??[]);return i.map(e=>{const i=t.states[e],r=i?.attributes.id?String(i.attributes.id):void 0,a="off"===i?.state?s[e]:void 0,c=xt(i,r?o.get(r):void 0,a);return{entity_id:e,name:wt(t,e),status:c,on:"on"===i?.state,last:i?.attributes.last_triggered?String(i.attributes.last_triggered):void 0,snoozedUntil:a,id:r,confirm:n.has(e)}})}(this.hass,this._config,this._ids,this._traces,this._snoozes);return t.map(t=>{const e=this._pending.get(t.entity_id);return e?{...t,on:e.on}:t})}render(){const t=this.hass,e=this._config;if(!t||!e)return K;const i=this._rows(),o=function(t){let e=0,i=0;for(const o of t)"off"!==o.status&&"snoozed"!==o.status||e++,"failed"!==o.status&&"broken"!==o.status||i++;return{off:e,attention:i}}(i),s="all"!==this._filter&&0===o[this._filter]?"all":this._filter,n=function(t,e){return"off"===e?t.filter(t=>"off"===t.status||"snoozed"===t.status):"attention"===e?t.filter(t=>"failed"===t.status||"broken"===t.status):t}(i,s),r=function(t,e,i,o,s){if("none"===o||!i.length)return[{key:"",title:"",rows:i}];const n=new Set(vt(e.label)),r=e=>{const i=t.entities[e.entity_id];if("area"===o){const e=i?.area_id;return e?{key:e,title:t.areas?.[e]?.name??e}:void 0}if("category"===o){const t=s.categoryOf?.[e.entity_id];return t?{key:t,title:s.categoryNames?.[t]??t}:void 0}const r=s.labelNames??{},a=(i?.labels??[]).filter(t=>!n.has(t)).map(t=>({key:t,title:r[t]??t})).sort((t,e)=>t.title.localeCompare(e.title));return a[0]},a=new Map,c={key:"__other",title:s.other,rows:[]};for(const t of i){const e=r(t);e?(a.has(e.key)||a.set(e.key,{key:e.key,title:e.title,rows:[]}),a.get(e.key).rows.push(t)):c.rows.push(t)}const l=[...a.values()].sort((t,e)=>t.title.localeCompare(e.title,void 0,{numeric:!0}));return c.rows.length&&l.push(c),1===l.length?[{key:"",title:"",rows:l[0].rows}]:l}(t,e,n,e.group_by??"none",{labelNames:this._labelNames,categoryOf:this._categoryOf,categoryNames:this._categoryNames,other:this._t("other")});return W`<ha-card>
      ${this._renderHeader(o,s)}
      ${i.length?n.length?r.map(t=>this._renderGroup(t)):W`<div class="empty"><span>${this._t("empty_filter")}</span></div>`:W`<div class="empty">
            <ha-icon icon="mdi:robot-outline"></ha-icon>
            <span>${this._t("empty")}</span>
            <span class="hint">${this._t("empty_hint")}</span>
          </div>`}
      ${this._renderMenu(i)}
    </ha-card>`}_renderHeader(t,e){const i=this._config.title??this._t("title");if(!i&&!t.off&&!t.attention)return K;const o=(t,i,o,s)=>i?W`<button
            class=${gt({chip:!0,selected:e===t,attention:"attention"===t})}
            aria-pressed=${e===t?"true":"false"}
            @click=${()=>this._filter=e===t?"all":t}
          >
            <ha-icon .icon=${o}></ha-icon>${s}
          </button>`:K;return W`<div class="header">
      <span class="title">${i}</span>
      <div class="chips">
        ${o("attention",t.attention,"mdi:alert-circle-outline",this._t("chip_attention",{n:t.attention}))}
        ${o("off",t.off,"mdi:robot-off-outline",this._t("chip_off",{n:t.off}))}
      </div>
    </div>`}_renderGroup(t){return W`${t.title?W`<div class="section-title">${t.title}</div>`:K}
      <div class="list">${t.rows.map(t=>this._renderRow(t))}</div>`}_icon(t){const e=this.hass.states[t.entity_id]?.attributes.icon;switch(t.status){case"broken":return"mdi:alert-outline";case"failed":return"mdi:alert-circle-outline";case"snoozed":return"mdi:alarm-snooze";case"off":return e?String(e):"mdi:robot-off-outline";default:return e?String(e):"mdi:robot"}}_secondary(t){const e=this.hass,i=t.last?function(t,e,i=Date.now()){const o=Date.parse(e);if(Number.isNaN(o))return"";const s=Math.round((o-i)/1e3);if(Math.abs(s)<45)return Et(t,"just_now");const n=new Intl.RelativeTimeFormat(zt(t),{numeric:"auto"}),r=[["year",31536e3],["month",2592e3],["week",604800],["day",86400],["hour",3600],["minute",60]];for(const[t,e]of r)if(Math.abs(s)>=e)return n.format(Math.round(s/e),t);return n.format(Math.round(s/60),"minute")}(e,t.last):"";switch(t.status){case"broken":return this._t("broken");case"running":return this._t("running");case"failed":return i?this._t("failed",{when:i}):this._t("failed_now");case"snoozed":return Ot(e,t.snoozedUntil);default:return i||this._t("never_ran")}}_renderRow(t){const e=this._secondary(t),i=this._pending.has(t.entity_id);return W`<div class=${gt({row:!0,[t.status]:!0})} data-eid=${t.entity_id}>
      <div
        class="main"
        role="button"
        tabindex="0"
        aria-label=${`${t.name}, ${e}`}
        ${At({hasHold:!0})}
        @fpc-action=${e=>"hold"===e.detail.action?this._openMenu(t.entity_id):this._moreInfo(t.entity_id)}
      >
        <div class="disc"><ha-icon .icon=${this._icon(t)}></ha-icon></div>
        <div class="text">
          <span class="name">${t.name}</span>
          <span class="secondary">${e}</span>
        </div>
      </div>
      <button
        class=${gt({switch:!0,on:t.on,pending:i})}
        role="switch"
        aria-checked=${t.on?"true":"false"}
        aria-label=${this._t("toggle",{name:t.name})}
        ?disabled=${"broken"===t.status}
        @click=${()=>this._toggle(t)}
      >
        <span class="track"><span class="thumb"></span></span>
      </button>
      <button
        class="more"
        aria-label=${this._t("more",{name:t.name})}
        aria-haspopup="menu"
        aria-expanded=${this._menu===t.entity_id?"true":"false"}
        @click=${()=>this._openMenu(t.entity_id)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    </div>`}_renderMenu(t){const e=this._menu?t.find(t=>t.entity_id===this._menu):void 0,i=e?function(t,e){const i=[];return"broken"!==t.status&&i.push("run","run_check"),"running"===t.status&&i.push("stop"),"snoozed"===t.status?i.push("resume"):e.snooze&&t.on&&"broken"!==t.status&&i.push("snooze"),e.admin&&t.id&&i.push("edit","traces"),i}(e,{admin:this._admin,snooze:this._snoozeOk}):[],o=(t,i)=>W`<button class="item" role="menuitem" @click=${()=>this._menuAction(e,t)}>
        <ha-icon .icon=${i}></ha-icon><span>${this._t(`menu_${t}`)}</span>
      </button>`,s=t=>i.includes(t);return W`<div class="menu" popover="auto" role="menu" @toggle=${this._menuToggled}>
      ${e?W`<div class="menu-head">${e.name}</div>
            ${s("run")?o("run","mdi:play"):K}
            ${s("run_check")?o("run_check","mdi:play-circle-outline"):K}
            ${s("stop")?o("stop","mdi:stop-circle-outline"):K}
            ${s("resume")?o("resume","mdi:alarm-off"):K}
            ${s("snooze")?W`<div class="snooze">
                  <span class="snooze-label"><ha-icon icon="mdi:alarm-snooze"></ha-icon>${this._t("menu_snooze")}</span>
                  <div class="presets">
                    ${yt.map(t=>W`<button class="chip" @click=${()=>this._snooze(e,t.minutes)}>${this._t(`snooze_${t.key}`)}</button>`)}
                  </div>
                </div>`:K}
            ${s("edit")?W`<div class="sep"></div>${o("edit","mdi:pencil-outline")}`:K}
            ${s("traces")?o("traces","mdi:timeline-text-outline"):K}`:K}
    </div>`}async _openMenu(t){if(this._menu===t)return void this._closeMenu();this._menu=t,await this.updateComplete;const e=this.renderRoot.querySelector(".menu"),i=this.renderRoot.querySelector(`.row[data-eid="${CSS.escape(t)}"] .more`);if(!e||!i)return;try{e.matches(":popover-open")||e.showPopover()}catch{e.classList.add("open")}const o=i.getBoundingClientRect(),s=e.getBoundingClientRect(),n=Math.min(Math.max(8,o.right-s.width),window.innerWidth-s.width-8);let r=o.bottom+4;r+s.height>window.innerHeight-8&&(r=Math.max(8,o.top-s.height-4)),e.style.left=`${n}px`,e.style.top=`${r}px`,e.querySelector("button")?.focus()}_closeMenu(){const t=this.renderRoot.querySelector(".menu");try{t?.matches(":popover-open")&&t.hidePopover()}catch{}t?.classList.remove("open"),this._menu=void 0}_menuAction(t,e){this._closeMenu();const i=t.id?encodeURIComponent(t.id):"";switch(e){case"run":return this._perform(t,"automation","trigger",{skip_condition:!0},"confirm_run","started");case"run_check":return this._perform(t,"automation","trigger",{skip_condition:!1},"confirm_run");case"stop":return this._perform(t,"automation","turn_off",{stop_actions:!0},"confirm_stop");case"resume":return this._perform(t,"flow_pulse","resume",{});case"edit":return this._navigate(`/config/automation/edit/${i}`);case"traces":return this._navigate(`/config/automation/trace/${i}`);default:return}}_toggle(t){if("broken"===t.status)return;const e=!t.on,i=!e&&t.confirm;if(this._perform(t,"automation",e?"turn_on":"turn_off",{},e?void 0:"confirm_off"),i)return;const o=this._pending.get(t.entity_id);o&&window.clearTimeout(o.timer);const s=window.setTimeout(()=>{this._pending.delete(t.entity_id),this.requestUpdate()},8e3);this._pending.set(t.entity_id,{on:e,timer:s}),this.requestUpdate()}_snooze(t,e){this._closeMenu(),this._perform(t,"flow_pulse","snooze",{duration:{minutes:e}},"confirm_snooze","snoozed_toast")}async _perform(t,e,i,o,s,n){const r={entity_id:t.entity_id};if(t.confirm&&s)this._fire(t.entity_id,{action:"perform-action",perform_action:`${e}.${i}`,data:o,target:r,confirmation:{text:this._t(s,{name:t.name})}});else try{await this.hass.callService(e,i,o,r),n&&Pt(this,this._t(n,{name:t.name}))}catch(e){this._pending.delete(t.entity_id),this.requestUpdate(),Pt(this,this._t("error",{error:Mt(e)}))}}_moreInfo(t){this._fire(t,{action:"more-info"})}_navigate(t){this._fire("",{action:"navigate",navigation_path:t})}_fire(t,e){this.dispatchEvent(new CustomEvent("hass-action",{bubbles:!0,composed:!0,detail:{config:{entity:t,tap_action:e},action:"tap"}}))}}Dt.styles=Tt,t([dt({attribute:!1})],Dt.prototype,"hass",void 0),t([pt()],Dt.prototype,"_config",void 0),t([pt()],Dt.prototype,"_snoozes",void 0),t([pt()],Dt.prototype,"_snoozeOk",void 0),t([pt()],Dt.prototype,"_traces",void 0),t([pt()],Dt.prototype,"_labelNames",void 0),t([pt()],Dt.prototype,"_categoryOf",void 0),t([pt()],Dt.prototype,"_categoryNames",void 0),t([pt()],Dt.prototype,"_filter",void 0),t([pt()],Dt.prototype,"_menu",void 0),customElements.get("flow-pulse-card")||Promise.all([Nt("flow-pulse-card",Dt),Nt("flow-pulse-card-editor",Rt)]).then(()=>{window.customCards=window.customCards||[],window.customCards.some(t=>"flow-pulse-card"===t.type)||window.customCards.push({type:"flow-pulse-card",name:"Flow Pulse Card",description:"Your automations at a glance: turn them on or off, run them, snooze them, and see which ones failed.",preview:!0}),console.info(`%c FLOW-PULSE-CARD %c v${jt} `,"color:#fff;background:#03a9f4;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px","color:#03a9f4;background:#fff0;font-weight:700;padding:2px 4px")});export{Dt as FlowPulseCard,jt as VERSION};
