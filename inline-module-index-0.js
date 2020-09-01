const t=t=>("#"===t[0]&&(t=t.substr(1)),t.length<6?{r:parseInt(t[0]+t[0],16),g:parseInt(t[1]+t[1],16),b:parseInt(t[2]+t[2],16)}:{r:parseInt(t.substr(0,2),16),g:parseInt(t.substr(2,2),16),b:parseInt(t.substr(4,2),16)}),e=t=>{const{h:e,s:o,l:s}=(({h:t,s:e,v:o})=>{const s=(200-e)*o/100;return{h:t,s:s>0&&s<200?e*o/100/(s<=100?s:200-s)*100:0,l:s/2}})(t);return`hsl(${e}, ${o}%, ${s}%)`},o=({h:t,s:e,v:o})=>{t=t/360*6,e/=100,o/=100;const s=Math.floor(t),r=o*(1-e),n=o*(1-(t-s)*e),i=o*(1-(1-t+s)*e),l=s%6;return{r:Math.round(255*[o,n,r,r,i,o][l]),g:Math.round(255*[i,o,o,n,r,r][l]),b:Math.round(255*[r,r,i,o,o,n][l])}},s=t=>{const e=t.toString(16);return e.length<2?"0"+e:e},r=({r:t,g:e,b:o})=>"#"+s(t)+s(e)+s(o),n=({r:t,g:e,b:o})=>{const s=Math.max(t,e,o),r=s-Math.min(t,e,o),n=r?s===t?(e-o)/r:s===e?2+(o-t)/r:4+(t-e)/r:0;return{h:Math.round(60*(n<0?n+6:n)),s:Math.round(s?r/s*100:0),v:Math.round(s/255*100)}},i=(t,e)=>{if(t===e)return!0;for(const o in t)if(t[o]!==e[o])return!1;return!0},l=t=>{const e=document.createElement("template");return e.innerHTML=t,e},c=(t,e)=>{const o=t.shadowRoot||t.attachShadow({mode:"open"});return o.appendChild(e.content.cloneNode(!0)),o};const a=t=>t>1?1:t<0?0:t,h=l('\n<style>#interactive{position:absolute;left:0;top:0;width:100%;height:100%;touch-action:none;user-select:none;-webkit-user-select:none}[part=pointer]{position:absolute;z-index:1;box-sizing:border-box;width:24px;height:24px;transform:translate(-50%, -50%);border:2px solid #fff;border-radius:50%;box-shadow:0 2px 3px rgba(0,0,0,.2)}</style>\n<div id="interactive"><div part="pointer"></div></div>\n'),u=(t,e)=>{const o=e instanceof MouseEvent?e:e.touches[0];return{left:a((o.pageX-(t.left+window.pageXOffset))/t.width),top:a((o.pageY-(t.top+window.pageYOffset))/t.height)}};class d extends HTMLElement{constructor(){super(),this.pointer=c(this,h).querySelector("[part=pointer]").style,this.addEventListener("mousedown",this),this.addEventListener("touchstart",this)}set dragging(t){const e=t?document.addEventListener:document.removeEventListener;e("mousemove",this),e("touchmove",this),e("mouseup",this),e("touchend",this)}handleEvent(t){switch(t.type){case"mousedown":case"touchstart":if(t instanceof MouseEvent&&0!==t.button)return;this.onMove(t),this.dragging=!0;break;case"mousemove":case"touchmove":t.preventDefault(),this.onMove(t);break;case"mouseup":case"touchend":this.dragging=!1}}onMove(t){this.dispatchEvent(new CustomEvent("move",{bubbles:!0,detail:this.getMove(u(this.getBoundingClientRect(),t))}))}setStyles(t){for(const e in t)this.pointer.setProperty(e,t[e])}}const p=l("<style>:host{position:absolute;bottom:0;left:0;right:0;height:20px;border-radius:0 0 8px 8px;background:linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)}[part=pointer]{top:50%}</style>");customElements.define("color-hue",class extends d{constructor(){super(),c(this,p)}set hue(t){this.setStyles({left:t/360*100+"%","background-color":e({h:t,s:100,v:100})})}getMove(t){return{h:360*t.left}}});const f=l('<style>:host{display:block;position:absolute;top:0;left:0;right:0;bottom:20px;border-bottom:10px solid #000;border-radius:8px 8px 0 0}:host::after,:host::before{content:"";position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;border-radius:inherit}:host::before{background:linear-gradient(to right, #fff, rgba(255, 255, 255, 0))}:host::after{background:linear-gradient(to top, #000, rgba(0, 0, 0, 0));box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}</style>');customElements.define("color-saturation",class extends d{constructor(){super(),c(this,f)}set hsv(t){this.style.backgroundColor=e({h:t.h,s:100,v:100}),this.setStyles({top:100-t.v+"%",left:t.s+"%","background-color":e(t)})}getMove(t){return{s:100*t.left,v:Math.round(100-100*t.top)}}});const b=l('\n<style>:host{display:block;position:relative;width:200px;height:200px;user-select:none;-webkit-user-select:none;cursor:default}</style>\n<color-saturation part="saturation" exportparts="pointer: saturation-pointer"></color-saturation>\n<color-hue part="hue" exportparts="pointer: hue-pointer"></color-hue>\n'),g=Symbol("color"),v=Symbol("hsv"),m=Symbol("h"),y=Symbol("s");class w extends HTMLElement{constructor(){super();const t=c(this,b);t.addEventListener("move",this),this._ready=Promise.all([customElements.whenDefined("color-hue"),customElements.whenDefined("color-saturation")]),this[y]=t.children[1],this[m]=t.children[2]}static get observedAttributes(){return["color"]}get color(){return this[g]}set color(t){this[g]&&this.colorModel.equal(t,this[g])||this._setProps(t,this.colorModel.toHsv(t))}connectedCallback(){if(this.hasOwnProperty("color")){const t=this.color;delete this.color,this.color=t}else if(!this.color){const t=this.getAttribute("color");this.color=t?this.colorModel.fromAttr(t):this.colorModel.defaultColor}}attributeChangedCallback(t,e,o){const s=this.colorModel.fromAttr(o);this.color!==s&&(this.color=s)}handleEvent(t){const e=Object.assign({},this[v],t.detail);i(e,this[v])||this._setProps(this.colorModel.fromHsv(e),e)}async _setProps(t,e){this[v]=e,this[g]=t,this.dispatchEvent(new CustomEvent("color-changed",{detail:{value:t}})),await this._ready,this[y].hsv=e,this[m].hue=e.h}}const x={defaultColor:"#000",toHsv:e=>n(t(e)),fromHsv:t=>r(o(t)),equal:(e,o)=>e.toLowerCase()===o.toLowerCase()||i(t(e),t(o)),fromAttr:t=>t};customElements.define("color-picker-hex",class extends w{get colorModel(){return x}});const E=/^#?[0-9A-F]{3}$/i,M=/^#?[0-9A-F]{6}$/i,C=t=>M.test(t)||E.test(t),k=t=>t.replace(/([^0-9A-F]+)/gi,"");class L extends HTMLElement{constructor(){super();let t=this.querySelector("input");t||(t=document.createElement("input"),t.setAttribute("spellcheck","false"),t.setAttribute("maxlength","6"),this.appendChild(t)),t.addEventListener("input",this),t.addEventListener("blur",this),this._input=t}static get observedAttributes(){return["color"]}get color(){return this._color}set color(t){this._color=t,this._input.value=null==t||""==t?"":k(t)}connectedCallback(){if(this.hasOwnProperty("color")){const t=this.color;delete this.color,this.color=t}else null==this.color&&(this.color=this.getAttribute("color")||"")}handleEvent(t){const e=t.target,{value:o}=e;switch(t.type){case"input":const t=k(o);this._oldColor=this.color,C(t)&&(this.color=t,this.dispatchEvent(new CustomEvent("color-changed",{detail:{value:"#"+t}})));break;case"blur":C(o)||(this.color=this._oldColor)}}attributeChangedCallback(t,e,o){this.color!==o&&(this.color=o)}}customElements.define("hex-input",L);const S=()=>{const t=document.createElement("canvas");return t.width=64,t.height=64,t};let P,A,_;const I=t=>(A||(A=S(),_=(()=>{const t=S(),e=t.getContext("2d");return e.beginPath(),e.arc(32,32,28,0,2*Math.PI,!1),e.closePath(),e.shadowColor="rgba(0, 0, 0, 0.4)",e.shadowOffsetY=1,e.shadowBlur=6,e.fillStyle="#fff",e.fill(),t})()),function(t,e,o,s){var r,n=!1,i=0;function l(){r&&clearTimeout(r)}function c(){for(var c=arguments.length,a=new Array(c),h=0;h<c;h++)a[h]=arguments[h];var u=this,d=Date.now()-i;function p(){i=Date.now(),o.apply(u,a)}function f(){r=void 0}n||(s&&!r&&p(),l(),void 0===s&&d>t?p():!0!==e&&(r=setTimeout(s?f:p,void 0===s?t-d:t)))}return"boolean"!=typeof e&&(s=o,o=e,e=void 0),c.cancel=function(){l(),n=!0},c}(500,()=>{if(!(window.innerWidth<768&&P)){const e=A.getContext("2d");e.clearRect(0,0,64,64),e.drawImage(_,0,0),e.beginPath(),e.arc(32,32,22,0,2*Math.PI,!1),e.closePath(),e.fillStyle=t,e.fill();const o=document.createElement("link");o.rel="shortcut icon",o.href=A.toDataURL("image/x-icon"),P&&document.head.removeChild(P),document.head.appendChild(o),P=o}})),H=document.querySelector("color-picker-hex"),q=document.querySelector("hex-input"),D=H.color;q.color=D,I(D)();const O=e=>{document.body.style.backgroundColor=e;const o=(({r:t,g:e,b:o})=>(299*t+587*e+114*o)/1e3)(t(e))<128?"#fff":"#000";document.body.style.setProperty("--contrast",o),I(e)()};H.addEventListener("color-changed",t=>{const e=t.detail.value;q.color=e,O(e)}),q.addEventListener("color-changed",t=>{const e=t.detail.value;H.color=e,O(e)});