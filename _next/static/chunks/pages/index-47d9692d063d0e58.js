(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{9886:function(e,t,o){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return o(8776)}])},3120:function(e){"use strict";e.exports={i18n:{defaultLocale:"en",locales:["en","ja","pt-BR"],reloadOnPrerender:!0}}},8776:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return _}});var n=o(5893),r=o(7294),a=o(1163),i=o(3997),c=[],u=c.forEach,s=c.slice,l=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/,f=function(e,t,o){var n=o||{};n.path=n.path||"/";var r=encodeURIComponent(t),a="".concat(e,"=").concat(r);if(n.maxAge>0){var i=n.maxAge-0;if(Number.isNaN(i))throw Error("maxAge should be a Number");a+="; Max-Age=".concat(Math.floor(i))}if(n.domain){if(!l.test(n.domain))throw TypeError("option domain is invalid");a+="; Domain=".concat(n.domain)}if(n.path){if(!l.test(n.path))throw TypeError("option path is invalid");a+="; Path=".concat(n.path)}if(n.expires){if("function"!=typeof n.expires.toUTCString)throw TypeError("option expires is invalid");a+="; Expires=".concat(n.expires.toUTCString())}if(n.httpOnly&&(a+="; HttpOnly"),n.secure&&(a+="; Secure"),n.sameSite)switch("string"==typeof n.sameSite?n.sameSite.toLowerCase():n.sameSite){case!0:case"strict":a+="; SameSite=Strict";break;case"lax":a+="; SameSite=Lax";break;case"none":a+="; SameSite=None";break;default:throw TypeError("option sameSite is invalid")}return a},g={create:function(e,t,o,n){var r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{path:"/",sameSite:"strict"};o&&(r.expires=new Date,r.expires.setTime(r.expires.getTime()+6e4*o)),n&&(r.domain=n),document.cookie=f(e,encodeURIComponent(t),r)},read:function(e){for(var t="".concat(e,"="),o=document.cookie.split(";"),n=0;n<o.length;n++){for(var r=o[n];" "===r.charAt(0);)r=r.substring(1,r.length);if(0===r.indexOf(t))return r.substring(t.length,r.length)}return null},remove:function(e){this.create(e,"",-1)}},p={name:"cookie",lookup:function(e){var t;if(e.lookupCookie&&"undefined"!=typeof document){var o=g.read(e.lookupCookie);o&&(t=o)}return t},cacheUserLanguage:function(e,t){t.lookupCookie&&"undefined"!=typeof document&&g.create(t.lookupCookie,e,t.cookieMinutes,t.cookieDomain,t.cookieOptions)}},d={name:"querystring",lookup:function(e){var t;if("undefined"!=typeof window){var o=window.location.search;!window.location.search&&window.location.hash&&window.location.hash.indexOf("?")>-1&&(o=window.location.hash.substring(window.location.hash.indexOf("?")));for(var n=o.substring(1).split("&"),r=0;r<n.length;r++){var a=n[r].indexOf("=");a>0&&n[r].substring(0,a)===e.lookupQuerystring&&(t=n[r].substring(a+1))}}return t}},h=null,m=function(){if(null!==h)return h;try{h="undefined"!==window&&null!==window.localStorage;var e="i18next.translate.boo";window.localStorage.setItem(e,"foo"),window.localStorage.removeItem(e)}catch(e){h=!1}return h},v={name:"localStorage",lookup:function(e){var t;if(e.lookupLocalStorage&&m()){var o=window.localStorage.getItem(e.lookupLocalStorage);o&&(t=o)}return t},cacheUserLanguage:function(e,t){t.lookupLocalStorage&&m()&&window.localStorage.setItem(t.lookupLocalStorage,e)}},w=null,k=function(){if(null!==w)return w;try{w="undefined"!==window&&null!==window.sessionStorage;var e="i18next.translate.boo";window.sessionStorage.setItem(e,"foo"),window.sessionStorage.removeItem(e)}catch(e){w=!1}return w},y={name:"sessionStorage",lookup:function(e){var t;if(e.lookupSessionStorage&&k()){var o=window.sessionStorage.getItem(e.lookupSessionStorage);o&&(t=o)}return t},cacheUserLanguage:function(e,t){t.lookupSessionStorage&&k()&&window.sessionStorage.setItem(t.lookupSessionStorage,e)}},b={name:"navigator",lookup:function(e){var t=[];if("undefined"!=typeof navigator){if(navigator.languages)for(var o=0;o<navigator.languages.length;o++)t.push(navigator.languages[o]);navigator.userLanguage&&t.push(navigator.userLanguage),navigator.language&&t.push(navigator.language)}return t.length>0?t:void 0}},S={name:"htmlTag",lookup:function(e){var t,o=e.htmlTag||("undefined"!=typeof document?document.documentElement:null);return o&&"function"==typeof o.getAttribute&&(t=o.getAttribute("lang")),t}},x={name:"path",lookup:function(e){var t;if("undefined"!=typeof window){var o=window.location.pathname.match(/\/([a-zA-Z-]*)/g);if(o instanceof Array){if("number"==typeof e.lookupFromPathIndex){if("string"!=typeof o[e.lookupFromPathIndex])return;t=o[e.lookupFromPathIndex].replace("/","")}else t=o[0].replace("/","")}}return t}},O={name:"subdomain",lookup:function(e){var t="number"==typeof e.lookupFromSubdomainIndex?e.lookupFromSubdomainIndex+1:1,o="undefined"!=typeof window&&window.location&&window.location.hostname&&window.location.hostname.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);if(o)return o[t]}},L=function(){var e;function t(e){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};!function(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}(this,t),this.type="languageDetector",this.detectors={},this.init(e,o)}return e=[{key:"init",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};this.services=e||{languageUtils:{}},this.options=function(e){return u.call(s.call(arguments,1),function(t){if(t)for(var o in t)void 0===e[o]&&(e[o]=t[o])}),e}(t,this.options||{},{order:["querystring","cookie","localStorage","sessionStorage","navigator","htmlTag"],lookupQuerystring:"lng",lookupCookie:"i18next",lookupLocalStorage:"i18nextLng",lookupSessionStorage:"i18nextLng",caches:["localStorage"],excludeCacheFor:["cimode"],convertDetectedLanguage:function(e){return e}}),"string"==typeof this.options.convertDetectedLanguage&&this.options.convertDetectedLanguage.indexOf("15897")>-1&&(this.options.convertDetectedLanguage=function(e){return e.replace("-","_")}),this.options.lookupFromUrlIndex&&(this.options.lookupFromPathIndex=this.options.lookupFromUrlIndex),this.i18nOptions=o,this.addDetector(p),this.addDetector(d),this.addDetector(v),this.addDetector(y),this.addDetector(b),this.addDetector(S),this.addDetector(x),this.addDetector(O)}},{key:"addDetector",value:function(e){this.detectors[e.name]=e}},{key:"detect",value:function(e){var t=this;e||(e=this.options.order);var o=[];return(e.forEach(function(e){if(t.detectors[e]){var n=t.detectors[e].lookup(t.options);n&&"string"==typeof n&&(n=[n]),n&&(o=o.concat(n))}}),o=o.map(function(e){return t.options.convertDetectedLanguage(e)}),this.services.languageUtils.getBestMatchFromCodes)?o:o.length>0?o[0]:null}},{key:"cacheUserLanguage",value:function(e,t){var o=this;t||(t=this.options.caches),t&&(this.options.excludeCacheFor&&this.options.excludeCacheFor.indexOf(e)>-1||t.forEach(function(t){o.detectors[t]&&o.detectors[t].cacheUserLanguage(e,o.options)}))}}],function(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(0,i.Z)(n.key),n)}}(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t}();L.type="languageDetector";var C=["supportedLngs","fallbackLng","order"];function D(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,n)}return o}var j=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},E=function(e){if("string"==typeof e&&e.indexOf("-")>-1){var t=["hans","hant","latn","cyrl","cans","mong","arab"],o=e.split("-");return 2===o.length?(o[0]=o[0].toLowerCase(),o[1]=o[1].toUpperCase(),t.indexOf(o[1].toLowerCase())>-1&&(o[1]=j(o[1].toLowerCase()))):3===o.length&&(o[0]=o[0].toLowerCase(),2===o[1].length&&(o[1]=o[1].toUpperCase()),"sgn"!==o[0]&&2===o[2].length&&(o[2]=o[2].toUpperCase()),t.indexOf(o[1].toLowerCase())>-1&&(o[1]=j(o[1].toLowerCase())),t.indexOf(o[2].toLowerCase())>-1&&(o[2]=j(o[2].toLowerCase()))),o.join("-")}return e},P=function(e){var t=e.supportedLngs,o=e.fallbackLng;return function(e){if(!e)return null;var n,r=function(e){return!t||!t.length||t.indexOf(e)>-1};return e.forEach(function(e){if(!n){var o=E(e);(!t||r(o))&&(n=o)}}),!n&&t&&e.forEach(function(e){if(!n){var o=!e||0>e.indexOf("-")?e:E(e.split("-")[0]);if(r(o)){n=o;return}n=t.find(function(e){if(0===e.indexOf(o))return e})}}),n||(n=o),n}},I=o(3120),U=o.n(I),F=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.supportedLngs,o=e.fallbackLng,n=e.order,r=function(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)o=a[n],!(t.indexOf(o)>=0)&&Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}(e,C),a=P({supportedLngs:t,fallbackLng:o}),i=new L({languageUtils:{getBestMatchFromCodes:a}},function(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?D(Object(o),!0).forEach(function(t){var n;n=o[t],t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):D(Object(o)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))})}return e}({order:void 0===n?["querystring","cookie","localStorage","sessionStorage","navigator","htmlTag"]:n},r));return{detect:function(e){return a(i.detect(e))},cache:function(e,t){return i.cacheUserLanguage(e,t)}}}({supportedLngs:U().i18n.locales,fallbackLng:U().i18n.defaultLocale});let T=e=>{let t=(0,a.useRouter)();return e=e||t.asPath,(0,r.useEffect)(()=>{let o=F.detect(),n="/fullstack-profile/";if(e.startsWith(n+o)&&"/404"===t.route){t.replace(n+o+t.route);return}F.cache(o),t.replace(n+o)}),(0,n.jsx)(n.Fragment,{})};var _=()=>(T(),(0,n.jsx)(n.Fragment,{}))}},function(e){e.O(0,[888,774,179],function(){return e(e.s=9886)}),_N_E=e.O()}]);