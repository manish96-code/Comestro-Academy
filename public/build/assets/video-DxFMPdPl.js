import{c as e,s as t}from"./app-DjCx4p38.js";import{t as n}from"./createLucideIcon-B_clSpb0.js";var r=e(t(),1),i={data:``},a=e=>{if(typeof window==`object`){let t=(e?e.querySelector(`#_goober`):window._goober)||Object.assign(document.createElement(`style`),{innerHTML:` `,id:`_goober`});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,s=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,l=(e,t)=>{let n=``,r=``,i=``;for(let a in e){let o=e[a];a[0]==`@`?a[1]==`i`?n=a+` `+o+`;`:r+=a[1]==`f`?l(o,a):a+`{`+l(o,a[1]==`k`?``:t)+`}`:typeof o==`object`?r+=l(o,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+` `+t:t)):a):o!=null&&(a=a[1]==`-`?a:a.replace(/[A-Z]/g,`-$&`).toLowerCase(),i+=l.p?l.p(a,o):a+`:`+o+`;`)}return n+(t&&i?t+`{`+i+`}`:i)+r},u={},d=e=>{if(typeof e==`object`){let t=``;for(let n in e)t+=n+d(e[n]);return t}return e},f=(e,t,n,r,i)=>{let a=d(e),f=u[a]||(u[a]=(e=>{let t=0,n=11;for(;t<e.length;)n=101*n+e.charCodeAt(t++)>>>0;return`go`+n})(a));if(!u[f]){let t=a===e?(e=>{let t,n,r=[{}];for(;t=o.exec(e.replace(s,``));)t[4]?r.shift():t[3]?(n=t[3].replace(c,` `).trim(),r.unshift(r[0][n]=r[0][n]||{})):r[0][t[1]]=t[2].replace(c,` `).trim();return r[0]})(e):e;u[f]=l(i?{[`@keyframes `+f]:t}:t,n?``:`.`+f)}let p=n&&u.g;return n&&(u.g=u[f]),((e,t,n,r)=>{r?t.data=t.data.replace(r,e):t.data.indexOf(e)===-1&&(t.data=n?e+t.data:t.data+e)})(u[f],t,r,p),f},p=(e,t,n)=>e.reduce((e,r,i)=>{let a=t[i];if(a&&a.call){let e=a(n),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?`.`+t:e&&typeof e==`object`?e.props?``:l(e,``):!1===e?``:e}return e+r+(a??``)},``);function m(e){let t=this||{},n=e.call?e(t.p):e;return f(n.unshift?n.raw?p(n,[].slice.call(arguments,1),t.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(t.p):n),{}):n,a(t.target),t.g,t.o,t.k)}var h,g,_;m.bind({g:1});var v=m.bind({k:1});function y(e,t,n,r){l.p=t,h=e,g=n,_=r}function b(e,t){let n=this||{};return function(){let r=arguments;function i(a,o){let s=Object.assign({},a),c=s.className||i.className;n.p=Object.assign({theme:g&&g()},s),n.o=/go\d/.test(c),s.className=m.apply(n,r)+(c?` `+c:``),t&&(s.ref=o);let l=e;return e[0]&&(l=s.as||e,delete s.as),_&&l[0]&&_(s),h(l,s)}return t?t(i):i}}var ee=e=>typeof e==`function`,x=(e,t)=>ee(e)?e(t):e,S=(()=>{let e=0;return()=>(++e).toString()})(),C=(()=>{let e;return()=>{if(e===void 0&&typeof window<`u`){let t=matchMedia(`(prefers-reduced-motion: reduce)`);e=!t||t.matches}return e}})(),te=20,w=`default`,T=(e,t)=>{let{toastLimit:n}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,n)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return T(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||i===void 0?{...e,dismissed:!0,visible:!1}:e)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},E=[],D={toasts:[],pausedAt:void 0,settings:{toastLimit:te}},O={},k=(e,t=w)=>{O[t]=T(O[t]||D,e),E.forEach(([e,n])=>{e===t&&n(O[t])})},A=e=>Object.keys(O).forEach(t=>k(e,t)),ne=e=>Object.keys(O).find(t=>O[t].toasts.some(t=>t.id===e)),j=(e=w)=>t=>{k(t,e)},re={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},ie=(e={},t=w)=>{let[n,i]=(0,r.useState)(O[t]||D),a=(0,r.useRef)(O[t]);(0,r.useEffect)(()=>(a.current!==O[t]&&i(O[t]),E.push([t,i]),()=>{let e=E.findIndex(([e])=>e===t);e>-1&&E.splice(e,1)}),[t]);let o=n.toasts.map(t=>({...e,...e[t.type],...t,removeDelay:t.removeDelay||e[t.type]?.removeDelay||e?.removeDelay,duration:t.duration||e[t.type]?.duration||e?.duration||re[t.type],style:{...e.style,...e[t.type]?.style,...t.style}}));return{...n,toasts:o}},M=(e,t=`blank`,n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:`status`,"aria-live":`polite`},message:e,pauseDuration:0,...n,id:n?.id||S()}),N=e=>(t,n)=>{let r=M(t,e,n);return j(r.toasterId||ne(r.id))({type:2,toast:r}),r.id},P=(e,t)=>N(`blank`)(e,t);P.error=N(`error`),P.success=N(`success`),P.loading=N(`loading`),P.custom=N(`custom`),P.dismiss=(e,t)=>{let n={type:3,toastId:e};t?j(t)(n):A(n)},P.dismissAll=e=>P.dismiss(void 0,e),P.remove=(e,t)=>{let n={type:4,toastId:e};t?j(t)(n):A(n)},P.removeAll=e=>P.remove(void 0,e),P.promise=(e,t,n)=>{let r=P.loading(t.loading,{...n,...n?.loading});return typeof e==`function`&&(e=e()),e.then(e=>{let i=t.success?x(t.success,e):void 0;return i?P.success(i,{id:r,...n,...n?.success}):P.dismiss(r),e}).catch(e=>{let i=t.error?x(t.error,e):void 0;i?P.error(i,{id:r,...n,...n?.error}):P.dismiss(r)}),e};var F=1e3,I=(e,t=`default`)=>{let{toasts:n,pausedAt:i}=ie(e,t),a=(0,r.useRef)(new Map).current,o=(0,r.useCallback)((e,t=F)=>{if(a.has(e))return;let n=setTimeout(()=>{a.delete(e),s({type:4,toastId:e})},t);a.set(e,n)},[]);(0,r.useEffect)(()=>{if(i)return;let e=Date.now(),r=n.map(n=>{if(n.duration===1/0)return;let r=(n.duration||0)+n.pauseDuration-(e-n.createdAt);if(r<0){n.visible&&P.dismiss(n.id);return}return setTimeout(()=>P.dismiss(n.id,t),r)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[n,i,t]);let s=(0,r.useCallback)(j(t),[t]),c=(0,r.useCallback)(()=>{s({type:5,time:Date.now()})},[s]),l=(0,r.useCallback)((e,t)=>{s({type:1,toast:{id:e,height:t}})},[s]),u=(0,r.useCallback)(()=>{i&&s({type:6,time:Date.now()})},[i,s]),d=(0,r.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:i=8,defaultPosition:a}=t||{},o=n.filter(t=>(t.position||a)===(e.position||a)&&t.height),s=o.findIndex(t=>t.id===e.id),c=o.filter((e,t)=>t<s&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[c+1]:[0,c]).reduce((e,t)=>e+(t.height||0)+i,0)},[n]);return(0,r.useEffect)(()=>{n.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=a.get(e.id);t&&(clearTimeout(t),a.delete(e.id))}})},[n,o]),{toasts:n,handlers:{updateHeight:l,startPause:c,endPause:u,calculateOffset:d}}},L=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,R=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,z=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,B=b(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#ff4b4b`};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${R} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||`#fff`};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${z} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,V=v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,H=b(`div`)`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||`#e0e0e0`};
  border-right-color: ${e=>e.primary||`#616161`};
  animation: ${V} 1s linear infinite;
`,U=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,W=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,G=b(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#61d345`};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${W} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||`#fff`};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,K=b(`div`)`
  position: absolute;
`,q=b(`div`)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ae=v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,J=b(`div`)`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ae} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,oe=({toast:e})=>{let{icon:t,type:n,iconTheme:i}=e;return t===void 0?n===`blank`?null:r.createElement(q,null,r.createElement(H,{...i}),n!==`loading`&&r.createElement(K,null,n===`error`?r.createElement(B,{...i}):r.createElement(G,{...i}))):typeof t==`string`?r.createElement(J,null,t):t},se=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ce=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,le=`0%{opacity:0;} 100%{opacity:1;}`,ue=`0%{opacity:1;} 100%{opacity:0;}`,de=b(`div`)`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,fe=b(`div`)`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,pe=(e,t)=>{let n=e.includes(`top`)?1:-1,[r,i]=C()?[le,ue]:[se(n),ce(n)];return{animation:t?`${v(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},me=r.memo(({toast:e,position:t,style:n,children:i})=>{let a=e.height?pe(e.position||t||`top-center`,e.visible):{opacity:0},o=r.createElement(oe,{toast:e}),s=r.createElement(fe,{...e.ariaProps},x(e.message,e));return r.createElement(de,{className:e.className,style:{...a,...n,...e.style}},typeof i==`function`?i({icon:o,message:s}):r.createElement(r.Fragment,null,o,s))});y(r.createElement);var he=({id:e,className:t,style:n,onHeightUpdate:i,children:a})=>{let o=r.useCallback(t=>{if(t){let n=()=>{let n=t.getBoundingClientRect().height;i(e,n)};n(),new MutationObserver(n).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return r.createElement(`div`,{ref:o,className:t,style:n},a)},ge=(e,t)=>{let n=e.includes(`top`),r=n?{top:0}:{bottom:0},i=e.includes(`center`)?{justifyContent:`center`}:e.includes(`right`)?{justifyContent:`flex-end`}:{};return{left:0,right:0,display:`flex`,position:`absolute`,transition:C()?void 0:`all 230ms cubic-bezier(.21,1.02,.73,1)`,transform:`translateY(${t*(n?1:-1)}px)`,...r,...i}},_e=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Y=16,ve=({reverseOrder:e,position:t=`top-center`,toastOptions:n,gutter:i,children:a,toasterId:o,containerStyle:s,containerClassName:c})=>{let{toasts:l,handlers:u}=I(n,o);return r.createElement(`div`,{"data-rht-toaster":o||``,style:{position:`fixed`,zIndex:9999,top:Y,left:Y,right:Y,bottom:Y,pointerEvents:`none`,...s},className:c,onMouseEnter:u.startPause,onMouseLeave:u.endPause},l.map(n=>{let o=n.position||t,s=ge(o,u.calculateOffset(n,{reverseOrder:e,gutter:i,defaultPosition:t}));return r.createElement(he,{id:n.id,key:n.id,onHeightUpdate:u.updateHeight,className:n.visible?_e:``,style:s},n.type===`custom`?x(n.message,n):a?a(n):r.createElement(me,{toast:n,position:o}))}))},X={name:`layout-dashboard`,size:24,node:[[`rect`,{width:`7`,height:`9`,x:`3`,y:`3`,rx:`1`,key:`10lvy0`}],[`rect`,{width:`7`,height:`5`,x:`14`,y:`3`,rx:`1`,key:`16une8`}],[`rect`,{width:`7`,height:`9`,x:`14`,y:`12`,rx:`1`,key:`1hutg5`}],[`rect`,{width:`7`,height:`5`,x:`3`,y:`16`,rx:`1`,key:`ldoo1y`}]]};X.node;var Z=n(X),Q={name:`log-out`,size:24,node:[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]};Q.node;var ye=n(Q),$={name:`video`,size:24,node:[[`path`,{d:`m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5`,key:`ftymec`}],[`rect`,{x:`2`,y:`6`,width:`14`,height:`12`,rx:`2`,key:`158x01`}]]};$.node;var be=n($);export{P as a,ve as i,ye as n,Z as r,be as t};