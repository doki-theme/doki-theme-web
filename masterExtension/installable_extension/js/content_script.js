!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=5)}({5:function(e,n,t){"use strict";chrome.runtime.onMessage.addListener((e,n,t)=>{const{colors:r}=e;if(r){const e=`\n      ::-moz-selection { background: ${r.selectionBackground}; color: ${r.selectionForeground}; }\n      ::selection { background: ${r.selectionBackground}; color: ${r.selectionForeground}; }\n\n      *::-webkit-scrollbar {\n        width: 0.5em;\n      }\n\n      *::-webkit-scrollbar-track {\n        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.00);\n      }\n\n      *::-webkit-scrollbar-thumb {\n        background-color: ${r.accentColor};\n     } \n        `,n=document.createElement("style");n.type="text/css",n.innerText=e,document.head.appendChild(n)}})}});