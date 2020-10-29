var olm_exports = {};
var onInitSuccess;
var onInitFail;

var Module = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Module) {
  Module = Module || {};


var a;a||(a=typeof Module !== 'undefined' ? Module : {});var aa,ba;a.ready=new Promise(function(b,c){aa=b;ba=c});var g;if("undefined"!==typeof window)g=function(b){window.crypto.getRandomValues(b)};else if(module.exports){var ca=require("crypto");g=function(b){var c=ca.randomBytes(b.length);b.set(c)};process=global.process}else throw Error("Cannot find global to attach library to");
if("undefined"!==typeof OLM_OPTIONS)for(var da in OLM_OPTIONS)OLM_OPTIONS.hasOwnProperty(da)&&(a[da]=OLM_OPTIONS[da]);a.onRuntimeInitialized=function(){h=a._olm_error();olm_exports.PRIVATE_KEY_LENGTH=a._olm_pk_private_key_length();onInitSuccess&&onInitSuccess()};a.onAbort=function(b){onInitFail&&onInitFail(b)};var ea={},l;for(l in a)a.hasOwnProperty(l)&&(ea[l]=a[l]);var fa=!1,m=!1,ia=!1,ja=!1;fa="object"===typeof window;m="function"===typeof importScripts;
ia="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;ja=!fa&&!ia&&!m;var n="",ka,la,ma,na;
if(ia)n=m?require("path").dirname(n)+"/":__dirname+"/",ka=function(b,c){ma||(ma=require("fs"));na||(na=require("path"));b=na.normalize(b);return ma.readFileSync(b,c?null:"utf8")},la=function(b){b=ka(b,!0);b.buffer||(b=new Uint8Array(b));b.buffer||q("Assertion failed: undefined");return b},1<process.argv.length&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("uncaughtException",function(b){throw b;}),process.on("unhandledRejection",q),a.inspect=function(){return"[Emscripten Module object]"};
else if(ja)"undefined"!=typeof read&&(ka=function(b){return read(b)}),la=function(b){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(b));b=read(b,"binary");"object"===typeof b||q("Assertion failed: undefined");return b},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(fa||m)m?n=self.location.href:document.currentScript&&(n=document.currentScript.src),_scriptDir&&
(n=_scriptDir),0!==n.indexOf("blob:")?n=n.substr(0,n.lastIndexOf("/")+1):n="",ka=function(b){var c=new XMLHttpRequest;c.open("GET",b,!1);c.send(null);return c.responseText},m&&(la=function(b){var c=new XMLHttpRequest;c.open("GET",b,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)});a.print||console.log.bind(console);var oa=a.printErr||console.warn.bind(console);for(l in ea)ea.hasOwnProperty(l)&&(a[l]=ea[l]);ea=null;var pa;a.wasmBinary&&(pa=a.wasmBinary);var noExitRuntime;
a.noExitRuntime&&(noExitRuntime=a.noExitRuntime);"object"!==typeof WebAssembly&&q("no native wasm support detected");
function r(b){var c="i8";"*"===c.charAt(c.length-1)&&(c="i32");switch(c){case "i1":t[b>>0]=0;break;case "i8":t[b>>0]=0;break;case "i16":qa[b>>1]=0;break;case "i32":u[b>>2]=0;break;case "i64":ra=[0,(w=0,1<=+Math.abs(w)?0<w?(Math.min(+Math.floor(w/4294967296),4294967295)|0)>>>0:~~+Math.ceil((w-+(~~w>>>0))/4294967296)>>>0:0)];u[b>>2]=ra[0];u[b+4>>2]=ra[1];break;case "float":sa[b>>2]=0;break;case "double":ta[b>>3]=0;break;default:q("invalid type for setValue: "+c)}}
function ua(b,c){c=c||"i8";"*"===c.charAt(c.length-1)&&(c="i32");switch(c){case "i1":return t[b>>0];case "i8":return t[b>>0];case "i16":return qa[b>>1];case "i32":return u[b>>2];case "i64":return u[b>>2];case "float":return sa[b>>2];case "double":return ta[b>>3];default:q("invalid type for getValue: "+c)}return null}var x,va,wa=!1,xa="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function y(b,c){if(b){var d=z,e=b+c;for(c=b;d[c]&&!(c>=e);)++c;if(16<c-b&&d.subarray&&xa)b=xa.decode(d.subarray(b,c));else{for(e="";b<c;){var f=d[b++];if(f&128){var k=d[b++]&63;if(192==(f&224))e+=String.fromCharCode((f&31)<<6|k);else{var p=d[b++]&63;f=224==(f&240)?(f&15)<<12|k<<6|p:(f&7)<<18|k<<12|p<<6|d[b++]&63;65536>f?e+=String.fromCharCode(f):(f-=65536,e+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else e+=String.fromCharCode(f)}b=e}}else b="";return b}
function A(b,c,d,e){if(!(0<e))return 0;var f=d;e=d+e-1;for(var k=0;k<b.length;++k){var p=b.charCodeAt(k);if(55296<=p&&57343>=p){var v=b.charCodeAt(++k);p=65536+((p&1023)<<10)|v&1023}if(127>=p){if(d>=e)break;c[d++]=p}else{if(2047>=p){if(d+1>=e)break;c[d++]=192|p>>6}else{if(65535>=p){if(d+2>=e)break;c[d++]=224|p>>12}else{if(d+3>=e)break;c[d++]=240|p>>18;c[d++]=128|p>>12&63}c[d++]=128|p>>6&63}c[d++]=128|p&63}}c[d]=0;return d-f}
function B(b){for(var c=0,d=0;d<b.length;++d){var e=b.charCodeAt(d);55296<=e&&57343>=e&&(e=65536+((e&1023)<<10)|b.charCodeAt(++d)&1023);127>=e?++c:c=2047>=e?c+2:65535>=e?c+3:c+4}return c}function ya(b,c){for(var d=0;d<b.length;++d)t[c++>>0]=b.charCodeAt(d)}var za,t,z,qa,u,sa,ta;
function Aa(b){za=b;a.HEAP8=t=new Int8Array(b);a.HEAP16=qa=new Int16Array(b);a.HEAP32=u=new Int32Array(b);a.HEAPU8=z=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=sa=new Float32Array(b);a.HEAPF64=ta=new Float64Array(b)}var Ba=a.INITIAL_MEMORY||262144;a.wasmMemory?x=a.wasmMemory:x=new WebAssembly.Memory({initial:Ba/65536,maximum:32768});x&&(za=x.buffer);Ba=za.byteLength;Aa(za);var Ca=[],Da=[],Ea=[],Ga=[];function Ha(){var b=a.preRun.shift();Ca.unshift(b)}
var C=0,Ia=null,Ja=null;a.preloadedImages={};a.preloadedAudios={};function q(b){if(a.onAbort)a.onAbort(b);oa(b);wa=!0;b=new WebAssembly.RuntimeError("abort("+b+"). Build with -s ASSERTIONS=1 for more info.");ba(b);throw b;}function Ka(b){var c=D;return String.prototype.startsWith?c.startsWith(b):0===c.indexOf(b)}function La(){return Ka("data:application/octet-stream;base64,")}var D="olm.wasm";if(!La()){var Ma=D;D=a.locateFile?a.locateFile(Ma,n):n+Ma}
function Na(){try{if(pa)return new Uint8Array(pa);if(la)return la(D);throw"both async and sync fetching of the wasm failed";}catch(b){q(b)}}function Oa(){return pa||!fa&&!m||"function"!==typeof fetch||Ka("file://")?Promise.resolve().then(Na):fetch(D,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+D+"'";return b.arrayBuffer()}).catch(function(){return Na()})}var w,ra;
function Pa(b){for(;0<b.length;){var c=b.shift();if("function"==typeof c)c(a);else{var d=c.Kb;"number"===typeof d?void 0===c.Jb?va.get(d)():va.get(d)(c.Jb):d(void 0===c.Jb?null:c.Jb)}}}function E(b){var c=Array(B(b)+1);b=A(b,c,0,c.length);c.length=b;return c}Da.push({Kb:function(){Qa()}});
var Ra={b:function(b,c,d){z.copyWithin(b,c,c+d)},c:function(b){b>>>=0;var c=z.length;if(2147483648<b)return!1;for(var d=1;4>=d;d*=2){var e=c*(1+.2/d);e=Math.min(e,b+100663296);e=Math.max(16777216,b,e);0<e%65536&&(e+=65536-e%65536);a:{try{x.grow(Math.min(2147483648,e)-za.byteLength+65535>>>16);Aa(x.buffer);var f=1;break a}catch(k){}f=void 0}if(f)return!0}return!1},a:x};
(function(){function b(f){a.asm=f.exports;va=a.asm.d;C--;a.monitorRunDependencies&&a.monitorRunDependencies(C);0==C&&(null!==Ia&&(clearInterval(Ia),Ia=null),Ja&&(f=Ja,Ja=null,f()))}function c(f){b(f.instance)}function d(f){return Oa().then(function(k){return WebAssembly.instantiate(k,e)}).then(f,function(k){oa("failed to asynchronously prepare wasm: "+k);q(k)})}var e={a:Ra};C++;a.monitorRunDependencies&&a.monitorRunDependencies(C);if(a.instantiateWasm)try{return a.instantiateWasm(e,b)}catch(f){return oa("Module.instantiateWasm callback failed with error: "+
f),!1}(function(){if(pa||"function"!==typeof WebAssembly.instantiateStreaming||La()||Ka("file://")||"function"!==typeof fetch)return d(c);fetch(D,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,e).then(c,function(k){oa("wasm streaming compile failed: "+k);oa("falling back to ArrayBuffer instantiation");return d(c)})})})();return{}})();var Qa=a.___wasm_call_ctors=function(){return(Qa=a.___wasm_call_ctors=a.asm.e).apply(null,arguments)};
a._olm_get_library_version=function(){return(a._olm_get_library_version=a.asm.f).apply(null,arguments)};a._olm_error=function(){return(a._olm_error=a.asm.g).apply(null,arguments)};a._olm_account_last_error=function(){return(a._olm_account_last_error=a.asm.h).apply(null,arguments)};a._olm_session_last_error=function(){return(a._olm_session_last_error=a.asm.i).apply(null,arguments)};a._olm_utility_last_error=function(){return(a._olm_utility_last_error=a.asm.j).apply(null,arguments)};
a._olm_account_size=function(){return(a._olm_account_size=a.asm.k).apply(null,arguments)};a._olm_session_size=function(){return(a._olm_session_size=a.asm.l).apply(null,arguments)};a._olm_utility_size=function(){return(a._olm_utility_size=a.asm.m).apply(null,arguments)};a._olm_account=function(){return(a._olm_account=a.asm.n).apply(null,arguments)};a._olm_session=function(){return(a._olm_session=a.asm.o).apply(null,arguments)};a._olm_utility=function(){return(a._olm_utility=a.asm.p).apply(null,arguments)};
a._olm_clear_account=function(){return(a._olm_clear_account=a.asm.q).apply(null,arguments)};a._olm_clear_session=function(){return(a._olm_clear_session=a.asm.r).apply(null,arguments)};a._olm_clear_utility=function(){return(a._olm_clear_utility=a.asm.s).apply(null,arguments)};a._olm_pickle_account_length=function(){return(a._olm_pickle_account_length=a.asm.t).apply(null,arguments)};a._olm_pickle_session_length=function(){return(a._olm_pickle_session_length=a.asm.u).apply(null,arguments)};
a._olm_pickle_account=function(){return(a._olm_pickle_account=a.asm.v).apply(null,arguments)};a._olm_pickle_session=function(){return(a._olm_pickle_session=a.asm.w).apply(null,arguments)};a._olm_unpickle_account=function(){return(a._olm_unpickle_account=a.asm.x).apply(null,arguments)};a._olm_unpickle_session=function(){return(a._olm_unpickle_session=a.asm.y).apply(null,arguments)};a._olm_create_account_random_length=function(){return(a._olm_create_account_random_length=a.asm.z).apply(null,arguments)};
a._olm_create_account=function(){return(a._olm_create_account=a.asm.A).apply(null,arguments)};a._olm_account_identity_keys_length=function(){return(a._olm_account_identity_keys_length=a.asm.B).apply(null,arguments)};a._olm_account_identity_keys=function(){return(a._olm_account_identity_keys=a.asm.C).apply(null,arguments)};a._olm_account_signature_length=function(){return(a._olm_account_signature_length=a.asm.D).apply(null,arguments)};
a._olm_account_sign=function(){return(a._olm_account_sign=a.asm.E).apply(null,arguments)};a._olm_account_one_time_keys_length=function(){return(a._olm_account_one_time_keys_length=a.asm.F).apply(null,arguments)};a._olm_account_one_time_keys=function(){return(a._olm_account_one_time_keys=a.asm.G).apply(null,arguments)};a._olm_account_mark_keys_as_published=function(){return(a._olm_account_mark_keys_as_published=a.asm.H).apply(null,arguments)};
a._olm_account_max_number_of_one_time_keys=function(){return(a._olm_account_max_number_of_one_time_keys=a.asm.I).apply(null,arguments)};a._olm_account_generate_one_time_keys_random_length=function(){return(a._olm_account_generate_one_time_keys_random_length=a.asm.J).apply(null,arguments)};a._olm_account_generate_one_time_keys=function(){return(a._olm_account_generate_one_time_keys=a.asm.K).apply(null,arguments)};
a._olm_create_outbound_session_random_length=function(){return(a._olm_create_outbound_session_random_length=a.asm.L).apply(null,arguments)};a._olm_create_outbound_session=function(){return(a._olm_create_outbound_session=a.asm.M).apply(null,arguments)};a._olm_create_inbound_session=function(){return(a._olm_create_inbound_session=a.asm.N).apply(null,arguments)};a._olm_create_inbound_session_from=function(){return(a._olm_create_inbound_session_from=a.asm.O).apply(null,arguments)};
a._olm_session_id_length=function(){return(a._olm_session_id_length=a.asm.P).apply(null,arguments)};a._olm_session_id=function(){return(a._olm_session_id=a.asm.Q).apply(null,arguments)};a._olm_session_has_received_message=function(){return(a._olm_session_has_received_message=a.asm.R).apply(null,arguments)};a._olm_session_describe=function(){return(a._olm_session_describe=a.asm.S).apply(null,arguments)};
a._olm_matches_inbound_session=function(){return(a._olm_matches_inbound_session=a.asm.T).apply(null,arguments)};a._olm_matches_inbound_session_from=function(){return(a._olm_matches_inbound_session_from=a.asm.U).apply(null,arguments)};a._olm_remove_one_time_keys=function(){return(a._olm_remove_one_time_keys=a.asm.V).apply(null,arguments)};a._olm_encrypt_message_type=function(){return(a._olm_encrypt_message_type=a.asm.W).apply(null,arguments)};
a._olm_encrypt_random_length=function(){return(a._olm_encrypt_random_length=a.asm.X).apply(null,arguments)};a._olm_encrypt_message_length=function(){return(a._olm_encrypt_message_length=a.asm.Y).apply(null,arguments)};a._olm_encrypt=function(){return(a._olm_encrypt=a.asm.Z).apply(null,arguments)};a._olm_decrypt_max_plaintext_length=function(){return(a._olm_decrypt_max_plaintext_length=a.asm._).apply(null,arguments)};a._olm_decrypt=function(){return(a._olm_decrypt=a.asm.$).apply(null,arguments)};
a._olm_sha256_length=function(){return(a._olm_sha256_length=a.asm.aa).apply(null,arguments)};a._olm_sha256=function(){return(a._olm_sha256=a.asm.ba).apply(null,arguments)};a._olm_ed25519_verify=function(){return(a._olm_ed25519_verify=a.asm.ca).apply(null,arguments)};a._olm_pk_encryption_last_error=function(){return(a._olm_pk_encryption_last_error=a.asm.da).apply(null,arguments)};a._olm_pk_encryption_size=function(){return(a._olm_pk_encryption_size=a.asm.ea).apply(null,arguments)};
a._olm_pk_encryption=function(){return(a._olm_pk_encryption=a.asm.fa).apply(null,arguments)};a._olm_clear_pk_encryption=function(){return(a._olm_clear_pk_encryption=a.asm.ga).apply(null,arguments)};a._olm_pk_encryption_set_recipient_key=function(){return(a._olm_pk_encryption_set_recipient_key=a.asm.ha).apply(null,arguments)};a._olm_pk_key_length=function(){return(a._olm_pk_key_length=a.asm.ia).apply(null,arguments)};
a._olm_pk_ciphertext_length=function(){return(a._olm_pk_ciphertext_length=a.asm.ja).apply(null,arguments)};a._olm_pk_mac_length=function(){return(a._olm_pk_mac_length=a.asm.ka).apply(null,arguments)};a._olm_pk_encrypt_random_length=function(){return(a._olm_pk_encrypt_random_length=a.asm.la).apply(null,arguments)};a._olm_pk_encrypt=function(){return(a._olm_pk_encrypt=a.asm.ma).apply(null,arguments)};
a._olm_pk_decryption_last_error=function(){return(a._olm_pk_decryption_last_error=a.asm.na).apply(null,arguments)};a._olm_pk_decryption_size=function(){return(a._olm_pk_decryption_size=a.asm.oa).apply(null,arguments)};a._olm_pk_decryption=function(){return(a._olm_pk_decryption=a.asm.pa).apply(null,arguments)};a._olm_clear_pk_decryption=function(){return(a._olm_clear_pk_decryption=a.asm.qa).apply(null,arguments)};
a._olm_pk_private_key_length=function(){return(a._olm_pk_private_key_length=a.asm.ra).apply(null,arguments)};a._olm_pk_generate_key_random_length=function(){return(a._olm_pk_generate_key_random_length=a.asm.sa).apply(null,arguments)};a._olm_pk_key_from_private=function(){return(a._olm_pk_key_from_private=a.asm.ta).apply(null,arguments)};a._olm_pk_generate_key=function(){return(a._olm_pk_generate_key=a.asm.ua).apply(null,arguments)};
a._olm_pickle_pk_decryption_length=function(){return(a._olm_pickle_pk_decryption_length=a.asm.va).apply(null,arguments)};a._olm_pickle_pk_decryption=function(){return(a._olm_pickle_pk_decryption=a.asm.wa).apply(null,arguments)};a._olm_unpickle_pk_decryption=function(){return(a._olm_unpickle_pk_decryption=a.asm.xa).apply(null,arguments)};a._olm_pk_max_plaintext_length=function(){return(a._olm_pk_max_plaintext_length=a.asm.ya).apply(null,arguments)};
a._olm_pk_decrypt=function(){return(a._olm_pk_decrypt=a.asm.za).apply(null,arguments)};a._olm_pk_get_private_key=function(){return(a._olm_pk_get_private_key=a.asm.Aa).apply(null,arguments)};a._olm_pk_signing_size=function(){return(a._olm_pk_signing_size=a.asm.Ba).apply(null,arguments)};a._olm_pk_signing=function(){return(a._olm_pk_signing=a.asm.Ca).apply(null,arguments)};a._olm_pk_signing_last_error=function(){return(a._olm_pk_signing_last_error=a.asm.Da).apply(null,arguments)};
a._olm_clear_pk_signing=function(){return(a._olm_clear_pk_signing=a.asm.Ea).apply(null,arguments)};a._olm_pk_signing_seed_length=function(){return(a._olm_pk_signing_seed_length=a.asm.Fa).apply(null,arguments)};a._olm_pk_signing_public_key_length=function(){return(a._olm_pk_signing_public_key_length=a.asm.Ga).apply(null,arguments)};a._olm_pk_signing_key_from_seed=function(){return(a._olm_pk_signing_key_from_seed=a.asm.Ha).apply(null,arguments)};
a._olm_pk_signature_length=function(){return(a._olm_pk_signature_length=a.asm.Ia).apply(null,arguments)};a._olm_pk_sign=function(){return(a._olm_pk_sign=a.asm.Ja).apply(null,arguments)};a._olm_inbound_group_session_size=function(){return(a._olm_inbound_group_session_size=a.asm.Ka).apply(null,arguments)};a._olm_inbound_group_session=function(){return(a._olm_inbound_group_session=a.asm.La).apply(null,arguments)};
a._olm_clear_inbound_group_session=function(){return(a._olm_clear_inbound_group_session=a.asm.Ma).apply(null,arguments)};a._olm_inbound_group_session_last_error=function(){return(a._olm_inbound_group_session_last_error=a.asm.Na).apply(null,arguments)};a._olm_init_inbound_group_session=function(){return(a._olm_init_inbound_group_session=a.asm.Oa).apply(null,arguments)};a._olm_import_inbound_group_session=function(){return(a._olm_import_inbound_group_session=a.asm.Pa).apply(null,arguments)};
a._olm_pickle_inbound_group_session_length=function(){return(a._olm_pickle_inbound_group_session_length=a.asm.Qa).apply(null,arguments)};a._olm_pickle_inbound_group_session=function(){return(a._olm_pickle_inbound_group_session=a.asm.Ra).apply(null,arguments)};a._olm_unpickle_inbound_group_session=function(){return(a._olm_unpickle_inbound_group_session=a.asm.Sa).apply(null,arguments)};
a._olm_group_decrypt_max_plaintext_length=function(){return(a._olm_group_decrypt_max_plaintext_length=a.asm.Ta).apply(null,arguments)};a._olm_group_decrypt=function(){return(a._olm_group_decrypt=a.asm.Ua).apply(null,arguments)};a._olm_inbound_group_session_id_length=function(){return(a._olm_inbound_group_session_id_length=a.asm.Va).apply(null,arguments)};a._olm_inbound_group_session_id=function(){return(a._olm_inbound_group_session_id=a.asm.Wa).apply(null,arguments)};
a._olm_inbound_group_session_first_known_index=function(){return(a._olm_inbound_group_session_first_known_index=a.asm.Xa).apply(null,arguments)};a._olm_inbound_group_session_is_verified=function(){return(a._olm_inbound_group_session_is_verified=a.asm.Ya).apply(null,arguments)};a._olm_export_inbound_group_session_length=function(){return(a._olm_export_inbound_group_session_length=a.asm.Za).apply(null,arguments)};
a._olm_export_inbound_group_session=function(){return(a._olm_export_inbound_group_session=a.asm._a).apply(null,arguments)};a._olm_outbound_group_session_size=function(){return(a._olm_outbound_group_session_size=a.asm.$a).apply(null,arguments)};a._olm_outbound_group_session=function(){return(a._olm_outbound_group_session=a.asm.ab).apply(null,arguments)};a._olm_clear_outbound_group_session=function(){return(a._olm_clear_outbound_group_session=a.asm.bb).apply(null,arguments)};
a._olm_outbound_group_session_last_error=function(){return(a._olm_outbound_group_session_last_error=a.asm.cb).apply(null,arguments)};a._olm_pickle_outbound_group_session_length=function(){return(a._olm_pickle_outbound_group_session_length=a.asm.db).apply(null,arguments)};a._olm_pickle_outbound_group_session=function(){return(a._olm_pickle_outbound_group_session=a.asm.eb).apply(null,arguments)};
a._olm_unpickle_outbound_group_session=function(){return(a._olm_unpickle_outbound_group_session=a.asm.fb).apply(null,arguments)};a._olm_init_outbound_group_session_random_length=function(){return(a._olm_init_outbound_group_session_random_length=a.asm.gb).apply(null,arguments)};a._olm_init_outbound_group_session=function(){return(a._olm_init_outbound_group_session=a.asm.hb).apply(null,arguments)};
a._olm_group_encrypt_message_length=function(){return(a._olm_group_encrypt_message_length=a.asm.ib).apply(null,arguments)};a._olm_group_encrypt=function(){return(a._olm_group_encrypt=a.asm.jb).apply(null,arguments)};a._olm_outbound_group_session_id_length=function(){return(a._olm_outbound_group_session_id_length=a.asm.kb).apply(null,arguments)};a._olm_outbound_group_session_id=function(){return(a._olm_outbound_group_session_id=a.asm.lb).apply(null,arguments)};
a._olm_outbound_group_session_message_index=function(){return(a._olm_outbound_group_session_message_index=a.asm.mb).apply(null,arguments)};a._olm_outbound_group_session_key_length=function(){return(a._olm_outbound_group_session_key_length=a.asm.nb).apply(null,arguments)};a._olm_outbound_group_session_key=function(){return(a._olm_outbound_group_session_key=a.asm.ob).apply(null,arguments)};a._olm_sas_last_error=function(){return(a._olm_sas_last_error=a.asm.pb).apply(null,arguments)};
a._olm_sas_size=function(){return(a._olm_sas_size=a.asm.qb).apply(null,arguments)};a._olm_sas=function(){return(a._olm_sas=a.asm.rb).apply(null,arguments)};a._olm_clear_sas=function(){return(a._olm_clear_sas=a.asm.sb).apply(null,arguments)};a._olm_create_sas_random_length=function(){return(a._olm_create_sas_random_length=a.asm.tb).apply(null,arguments)};a._olm_create_sas=function(){return(a._olm_create_sas=a.asm.ub).apply(null,arguments)};
a._olm_sas_pubkey_length=function(){return(a._olm_sas_pubkey_length=a.asm.vb).apply(null,arguments)};a._olm_sas_get_pubkey=function(){return(a._olm_sas_get_pubkey=a.asm.wb).apply(null,arguments)};a._olm_sas_set_their_key=function(){return(a._olm_sas_set_their_key=a.asm.xb).apply(null,arguments)};a._olm_sas_generate_bytes=function(){return(a._olm_sas_generate_bytes=a.asm.yb).apply(null,arguments)};a._olm_sas_mac_length=function(){return(a._olm_sas_mac_length=a.asm.zb).apply(null,arguments)};
a._olm_sas_calculate_mac=function(){return(a._olm_sas_calculate_mac=a.asm.Ab).apply(null,arguments)};a._olm_sas_calculate_mac_long_kdf=function(){return(a._olm_sas_calculate_mac_long_kdf=a.asm.Bb).apply(null,arguments)};a._malloc=function(){return(a._malloc=a.asm.Cb).apply(null,arguments)};a._free=function(){return(a._free=a.asm.Db).apply(null,arguments)};
var Sa=a.stackSave=function(){return(Sa=a.stackSave=a.asm.Eb).apply(null,arguments)},Ta=a.stackRestore=function(){return(Ta=a.stackRestore=a.asm.Fb).apply(null,arguments)},Ua=a.stackAlloc=function(){return(Ua=a.stackAlloc=a.asm.Gb).apply(null,arguments)};a.ALLOC_STACK=1;var Va;Ja=function Wa(){Va||Xa();Va||(Ja=Wa)};
function Xa(){function b(){if(!Va&&(Va=!0,a.calledRun=!0,!wa)){Pa(Da);Pa(Ea);aa(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var c=a.postRun.shift();Ga.unshift(c)}Pa(Ga)}}if(!(0<C)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)Ha();Pa(Ca);0<C||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}
a.run=Xa;if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();noExitRuntime=!0;Xa();function F(){var b=a._olm_outbound_group_session_size();this.Ib=H(b);this.Hb=a._olm_outbound_group_session(this.Ib)}function I(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_outbound_group_session_last_error(arguments[0])),Error("OLM."+c);return c}}F.prototype.free=function(){a._olm_clear_outbound_group_session(this.Hb);J(this.Hb)};
F.prototype.pickle=K(function(b){b=E(b);var c=I(a._olm_pickle_outbound_group_session_length)(this.Hb),d=L(b),e=L(c+1);try{I(a._olm_pickle_outbound_group_session)(this.Hb,d,b.length,e,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(e,c)});F.prototype.unpickle=K(function(b,c){b=E(b);var d=L(b);c=E(c);var e=L(c);try{I(a._olm_unpickle_outbound_group_session)(this.Hb,d,b.length,e,c.length)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}});
F.prototype.create=K(function(){var b=I(a._olm_init_outbound_group_session_random_length)(this.Hb),c=N(b,g);I(a._olm_init_outbound_group_session)(this.Hb,c,b)});F.prototype.encrypt=function(b){try{var c=B(b);var d=I(a._olm_group_encrypt_message_length)(this.Hb,c);var e=H(c+1);A(b,z,e,c+1);var f=H(d+1);I(a._olm_group_encrypt)(this.Hb,e,c,f,d);r(f+d);return y(f,d)}finally{void 0!==e&&(M(e,c+1),J(e)),void 0!==f&&J(f)}};
F.prototype.session_id=K(function(){var b=I(a._olm_outbound_group_session_id_length)(this.Hb),c=L(b+1);I(a._olm_outbound_group_session_id)(this.Hb,c,b);return y(c,b)});F.prototype.session_key=K(function(){var b=I(a._olm_outbound_group_session_key_length)(this.Hb),c=L(b+1);I(a._olm_outbound_group_session_key)(this.Hb,c,b);var d=y(c,b);M(c,b);return d});F.prototype.message_index=function(){return I(a._olm_outbound_group_session_message_index)(this.Hb)};olm_exports.OutboundGroupSession=F;
function O(){var b=a._olm_inbound_group_session_size();this.Ib=H(b);this.Hb=a._olm_inbound_group_session(this.Ib)}function P(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_inbound_group_session_last_error(arguments[0])),Error("OLM."+c);return c}}O.prototype.free=function(){a._olm_clear_inbound_group_session(this.Hb);J(this.Hb)};
O.prototype.pickle=K(function(b){b=E(b);var c=P(a._olm_pickle_inbound_group_session_length)(this.Hb),d=L(b),e=L(c+1);try{P(a._olm_pickle_inbound_group_session)(this.Hb,d,b.length,e,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(e,c)});O.prototype.unpickle=K(function(b,c){b=E(b);var d=L(b);c=E(c);var e=L(c);try{P(a._olm_unpickle_inbound_group_session)(this.Hb,d,b.length,e,c.length)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}});
O.prototype.create=K(function(b){b=E(b);var c=L(b);try{P(a._olm_init_inbound_group_session)(this.Hb,c,b.length)}finally{for(M(c,b.length),c=0;c<b.length;c++)b[c]=0}});O.prototype.import_session=K(function(b){b=E(b);var c=L(b);try{P(a._olm_import_inbound_group_session)(this.Hb,c,b.length)}finally{for(M(c,b.length),c=0;c<b.length;c++)b[c]=0}});
O.prototype.decrypt=K(function(b){try{var c=H(b.length);ya(b,c);var d=P(a._olm_group_decrypt_max_plaintext_length)(this.Hb,c,b.length);ya(b,c);var e=H(d+1);var f=L(4);var k=P(a._olm_group_decrypt)(this.Hb,c,b.length,e,d,f);r(e+k);return{plaintext:y(e,k),message_index:ua(f,"i32")}}finally{void 0!==c&&J(c),void 0!==e&&(M(e,k),J(e))}});O.prototype.session_id=K(function(){var b=P(a._olm_inbound_group_session_id_length)(this.Hb),c=L(b+1);P(a._olm_inbound_group_session_id)(this.Hb,c,b);return y(c,b)});
O.prototype.first_known_index=K(function(){return P(a._olm_inbound_group_session_first_known_index)(this.Hb)});O.prototype.export_session=K(function(b){var c=P(a._olm_export_inbound_group_session_length)(this.Hb),d=L(c+1);I(a._olm_export_inbound_group_session)(this.Hb,d,c,b);b=y(d,c);M(d,c);return b});olm_exports.InboundGroupSession=O;function Ya(){var b=a._olm_pk_encryption_size();this.Ib=H(b);this.Hb=a._olm_pk_encryption(this.Ib)}
function Q(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_pk_encryption_last_error(arguments[0])),Error("OLM."+c);return c}}Ya.prototype.free=function(){a._olm_clear_pk_encryption(this.Hb);J(this.Hb)};Ya.prototype.set_recipient_key=K(function(b){b=E(b);var c=L(b);Q(a._olm_pk_encryption_set_recipient_key)(this.Hb,c,b.length)});
Ya.prototype.encrypt=K(function(b){try{var c=B(b);var d=H(c+1);A(b,z,d,c+1);var e=Q(a._olm_pk_encrypt_random_length)();var f=N(e,g);var k=Q(a._olm_pk_ciphertext_length)(this.Hb,c);var p=H(k+1);var v=Q(a._olm_pk_mac_length)(this.Hb),ha=L(v+1);r(ha+v);var T=Q(a._olm_pk_key_length)(),G=L(T+1);r(G+T);Q(a._olm_pk_encrypt)(this.Hb,d,c,p,k,ha,v,G,T,f,e);r(p+k);return{ciphertext:y(p,k),mac:y(ha,v),ephemeral:y(G,T)}}finally{void 0!==f&&M(f,e),void 0!==d&&(M(d,c+1),J(d)),void 0!==p&&J(p)}});
function R(){var b=a._olm_pk_decryption_size();this.Ib=H(b);this.Hb=a._olm_pk_decryption(this.Ib)}function S(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_pk_decryption_last_error(arguments[0])),Error("OLM."+c);return c}}R.prototype.free=function(){a._olm_clear_pk_decryption(this.Hb);J(this.Hb)};
R.prototype.init_with_private_key=K(function(b){var c=L(b.length);a.HEAPU8.set(b,c);var d=S(a._olm_pk_key_length)(),e=L(d+1);try{S(a._olm_pk_key_from_private)(this.Hb,e,d,c,b.length)}finally{M(c,b.length)}return y(e,d)});R.prototype.generate_key=K(function(){var b=S(a._olm_pk_private_key_length)(),c=N(b,g),d=S(a._olm_pk_key_length)(),e=L(d+1);try{S(a._olm_pk_key_from_private)(this.Hb,e,d,c,b)}finally{M(c,b)}return y(e,d)});
R.prototype.get_private_key=K(function(){var b=Q(a._olm_pk_private_key_length)(),c=L(b);S(a._olm_pk_get_private_key)(this.Hb,c,b);var d=new Uint8Array(new Uint8Array(a.HEAPU8.buffer,c,b));M(c,b);return d});R.prototype.pickle=K(function(b){b=E(b);var c=S(a._olm_pickle_pk_decryption_length)(this.Hb),d=L(b),e=L(c+1);try{S(a._olm_pickle_pk_decryption)(this.Hb,d,b.length,e,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(e,c)});
R.prototype.unpickle=K(function(b,c){b=E(b);var d=L(b),e=E(c),f=L(e);c=S(a._olm_pk_key_length)();var k=L(c+1);try{S(a._olm_unpickle_pk_decryption)(this.Hb,d,b.length,f,e.length,k,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(k,c)});
R.prototype.decrypt=K(function(b,c,d){try{var e=B(d);var f=H(e+1);A(d,z,f,e+1);var k=E(b),p=L(k),v=E(c),ha=L(v);var T=S(a._olm_pk_max_plaintext_length)(this.Hb,e);var G=H(T+1);var Fa=S(a._olm_pk_decrypt)(this.Hb,p,k.length,ha,v.length,f,e,G,T);r(G+Fa);return y(G,Fa)}finally{void 0!==G&&(M(G,Fa+1),J(G)),void 0!==f&&J(f)}});function Za(){var b=a._olm_pk_signing_size();this.Ib=H(b);this.Hb=a._olm_pk_signing(this.Ib)}
function $a(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_pk_signing_last_error(arguments[0])),Error("OLM."+c);return c}}Za.prototype.free=function(){a._olm_clear_pk_signing(this.Hb);J(this.Hb)};Za.prototype.init_with_seed=K(function(b){var c=L(b.length);a.HEAPU8.set(b,c);var d=$a(a._olm_pk_signing_public_key_length)(),e=L(d+1);try{$a(a._olm_pk_signing_key_from_seed)(this.Hb,e,d,c,b.length)}finally{M(c,b.length)}return y(e,d)});
Za.prototype.generate_seed=K(function(){var b=$a(a._olm_pk_signing_seed_length)(),c=N(b,g),d=new Uint8Array(new Uint8Array(a.HEAPU8.buffer,c,b));M(c,b);return d});Za.prototype.sign=K(function(b){try{var c=B(b);var d=H(c+1);A(b,z,d,c+1);var e=$a(a._olm_pk_signature_length)(),f=L(e+1);$a(a._olm_pk_sign)(this.Hb,d,c,f,e);return y(f,e)}finally{void 0!==d&&(M(d,c+1),J(d))}});
function U(){var b=a._olm_sas_size(),c=a._olm_create_sas_random_length(),d=N(c,g);this.Ib=H(b);this.Hb=a._olm_sas(this.Ib);a._olm_create_sas(this.Hb,d,c);M(d,c)}function V(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_sas_last_error(arguments[0])),Error("OLM."+c);return c}}U.prototype.free=function(){a._olm_clear_sas(this.Hb);J(this.Hb)};
U.prototype.get_pubkey=K(function(){var b=V(a._olm_sas_pubkey_length)(this.Hb),c=L(b+1);V(a._olm_sas_get_pubkey)(this.Hb,c,b);return y(c,b)});U.prototype.set_their_key=K(function(b){b=E(b);var c=L(b);V(a._olm_sas_set_their_key)(this.Hb,c,b.length)});U.prototype.generate_bytes=K(function(b,c){b=E(b);var d=L(b),e=L(c);V(a._olm_sas_generate_bytes)(this.Hb,d,b.length,e,c);return new Uint8Array(new Uint8Array(a.HEAPU8.buffer,e,c))});
U.prototype.calculate_mac=K(function(b,c){b=E(b);var d=L(b);c=E(c);var e=L(c),f=V(a._olm_sas_mac_length)(this.Hb),k=L(f+1);V(a._olm_sas_calculate_mac)(this.Hb,d,b.length,e,c.length,k,f);return y(k,f)});U.prototype.calculate_mac_long_kdf=K(function(b,c){b=E(b);var d=L(b);c=E(c);var e=L(c),f=V(a._olm_sas_mac_length)(this.Hb),k=L(f+1);V(a._olm_sas_calculate_mac_long_kdf)(this.Hb,d,b.length,e,c.length,k,f);return y(k,f)});var H=a._malloc,J=a._free,h;
function N(b,c){var d=Ua(b);c(new Uint8Array(a.HEAPU8.buffer,d,b));return d}function L(b){return"number"==typeof b?N(b,function(c){c.fill(0)}):N(b.length,function(c){c.set(b)})}function K(b){return function(){var c=Sa();try{return b.apply(this,arguments)}finally{Ta(c)}}}function M(b,c){for(;0<c--;)a.HEAP8[b++]=0}function W(){var b=a._olm_account_size();this.Ib=H(b);this.Hb=a._olm_account(this.Ib)}
function X(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_account_last_error(arguments[0])),Error("OLM."+c);return c}}W.prototype.free=function(){a._olm_clear_account(this.Hb);J(this.Hb)};W.prototype.create=K(function(){var b=X(a._olm_create_account_random_length)(this.Hb),c=N(b,g);X(a._olm_create_account)(this.Hb,c,b)});
W.prototype.identity_keys=K(function(){var b=X(a._olm_account_identity_keys_length)(this.Hb),c=L(b+1);X(a._olm_account_identity_keys)(this.Hb,c,b);return y(c,b)});W.prototype.sign=K(function(b){var c=X(a._olm_account_signature_length)(this.Hb);b=E(b);var d=L(b),e=L(c+1);try{X(a._olm_account_sign)(this.Hb,d,b.length,e,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(e,c)});
W.prototype.one_time_keys=K(function(){var b=X(a._olm_account_one_time_keys_length)(this.Hb),c=L(b+1);X(a._olm_account_one_time_keys)(this.Hb,c,b);return y(c,b)});W.prototype.mark_keys_as_published=K(function(){X(a._olm_account_mark_keys_as_published)(this.Hb)});W.prototype.max_number_of_one_time_keys=K(function(){return X(a._olm_account_max_number_of_one_time_keys)(this.Hb)});
W.prototype.generate_one_time_keys=K(function(b){var c=X(a._olm_account_generate_one_time_keys_random_length)(this.Hb,b),d=N(c,g);X(a._olm_account_generate_one_time_keys)(this.Hb,b,d,c)});W.prototype.remove_one_time_keys=K(function(b){X(a._olm_remove_one_time_keys)(this.Hb,b.Hb)});
W.prototype.pickle=K(function(b){b=E(b);var c=X(a._olm_pickle_account_length)(this.Hb),d=L(b),e=L(c+1);try{X(a._olm_pickle_account)(this.Hb,d,b.length,e,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(e,c)});W.prototype.unpickle=K(function(b,c){b=E(b);var d=L(b);c=E(c);var e=L(c);try{X(a._olm_unpickle_account)(this.Hb,d,b.length,e,c.length)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}});function Y(){var b=a._olm_session_size();this.Ib=H(b);this.Hb=a._olm_session(this.Ib)}
function Z(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_session_last_error(arguments[0])),Error("OLM."+c);return c}}Y.prototype.free=function(){a._olm_clear_session(this.Hb);J(this.Hb)};Y.prototype.pickle=K(function(b){b=E(b);var c=Z(a._olm_pickle_session_length)(this.Hb),d=L(b),e=L(c+1);try{Z(a._olm_pickle_session)(this.Hb,d,b.length,e,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(e,c)});
Y.prototype.unpickle=K(function(b,c){b=E(b);var d=L(b);c=E(c);var e=L(c);try{Z(a._olm_unpickle_session)(this.Hb,d,b.length,e,c.length)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}});Y.prototype.create_outbound=K(function(b,c,d){var e=Z(a._olm_create_outbound_session_random_length)(this.Hb),f=N(e,g);c=E(c);d=E(d);var k=L(c),p=L(d);try{Z(a._olm_create_outbound_session)(this.Hb,b.Hb,k,c.length,p,d.length,f,e)}finally{M(f,e)}});
Y.prototype.create_inbound=K(function(b,c){c=E(c);var d=L(c);try{Z(a._olm_create_inbound_session)(this.Hb,b.Hb,d,c.length)}finally{for(M(d,c.length),b=0;b<c.length;b++)c[b]=0}});Y.prototype.create_inbound_from=K(function(b,c,d){c=E(c);var e=L(c);d=E(d);var f=L(d);try{Z(a._olm_create_inbound_session_from)(this.Hb,b.Hb,e,c.length,f,d.length)}finally{for(M(f,d.length),b=0;b<d.length;b++)d[b]=0}});
Y.prototype.session_id=K(function(){var b=Z(a._olm_session_id_length)(this.Hb),c=L(b+1);Z(a._olm_session_id)(this.Hb,c,b);return y(c,b)});Y.prototype.has_received_message=function(){return Z(a._olm_session_has_received_message)(this.Hb)?!0:!1};Y.prototype.matches_inbound=K(function(b){b=E(b);var c=L(b);return Z(a._olm_matches_inbound_session)(this.Hb,c,b.length)?!0:!1});
Y.prototype.matches_inbound_from=K(function(b,c){b=E(b);var d=L(b);c=E(c);var e=L(c);return Z(a._olm_matches_inbound_session_from)(this.Hb,d,b.length,e,c.length)?!0:!1});
Y.prototype.encrypt=K(function(b){try{var c=Z(a._olm_encrypt_random_length)(this.Hb);var d=Z(a._olm_encrypt_message_type)(this.Hb);var e=B(b);var f=Z(a._olm_encrypt_message_length)(this.Hb,e);var k=N(c,g);var p=H(e+1);A(b,z,p,e+1);var v=H(f+1);Z(a._olm_encrypt)(this.Hb,p,e,k,c,v,f);r(v+f);return{type:d,body:y(v,f)}}finally{void 0!==k&&M(k,c),void 0!==p&&(M(p,e+1),J(p)),void 0!==v&&J(v)}});
Y.prototype.decrypt=K(function(b,c){try{var d=H(c.length);ya(c,d);var e=Z(a._olm_decrypt_max_plaintext_length)(this.Hb,b,d,c.length);ya(c,d);var f=H(e+1);var k=Z(a._olm_decrypt)(this.Hb,b,d,c.length,f,e);r(f+k);return y(f,k)}finally{void 0!==d&&J(d),void 0!==f&&(M(f,e),J(f))}});Y.prototype.describe=K(function(){try{var b=H(256);Z(a._olm_session_describe)(this.Hb,b,256);return y(b)}finally{void 0!==b&&J(b)}});function ab(){var b=a._olm_utility_size();this.Ib=H(b);this.Hb=a._olm_utility(this.Ib)}
function bb(b){return function(){var c=b.apply(this,arguments);if(c===h)throw c=y(a._olm_utility_last_error(arguments[0])),Error("OLM."+c);return c}}ab.prototype.free=function(){a._olm_clear_utility(this.Hb);J(this.Hb)};ab.prototype.sha256=K(function(b){var c=bb(a._olm_sha256_length)(this.Hb);b=E(b);var d=L(b),e=L(c+1);try{bb(a._olm_sha256)(this.Hb,d,b.length,e,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(e,c)});
ab.prototype.sha256_bytes=K(function(b){var c=bb(a._olm_sha256_length)(this.Hb),d=L(b),e=L(c+1);try{bb(a._olm_sha256)(this.Hb,d,b.length,e,c)}finally{for(M(d,b.length),d=0;d<b.length;d++)b[d]=0}return y(e,c)});ab.prototype.ed25519_verify=K(function(b,c,d){b=E(b);var e=L(b);c=E(c);var f=L(c);d=E(d);var k=L(d);try{bb(a._olm_ed25519_verify)(this.Hb,e,b.length,f,c.length,k,d.length)}finally{for(M(f,c.length),b=0;b<c.length;b++)c[b]=0}});olm_exports.Account=W;olm_exports.Session=Y;
olm_exports.Utility=ab;olm_exports.PkEncryption=Ya;olm_exports.PkDecryption=R;olm_exports.PkSigning=Za;olm_exports.SAS=U;olm_exports.get_library_version=K(function(){var b=L(3);a._olm_get_library_version(b,b+1,b+2);return[ua(b,"i8"),ua(b+1,"i8"),ua(b+2,"i8")]});


  return Module.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
      module.exports = Module;
    else if (typeof define === 'function' && define['amd'])
      define([], function() { return Module; });
    else if (typeof exports === 'object')
      exports["Module"] = Module;
    var olmInitPromise;

olm_exports['init'] = function(opts) {
    if (olmInitPromise) return olmInitPromise;

    if (opts) OLM_OPTIONS = opts;

    olmInitPromise = new Promise(function(resolve, reject) {
        onInitSuccess = function() {
            resolve();
        };
        onInitFail = function(err) {
            reject(err);
        };
        Module();
    });
    return olmInitPromise;
};

if (typeof(window) !== 'undefined') {
    // We've been imported directly into a browser. Define the global 'Olm' object.
    // (we do this even if module.exports was defined, because it's useful to have
    // Olm in the global scope for browserified and webpacked apps.)
    window["Olm"] = olm_exports;
}

if (typeof module === 'object') {
    // Emscripten sets the module exports to be its module
    // with wrapped c functions. Clobber it with our higher
    // level wrapper class.
    module.exports = olm_exports;
}
