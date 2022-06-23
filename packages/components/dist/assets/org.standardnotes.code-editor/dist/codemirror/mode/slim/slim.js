!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror"),require("../htmlmixed/htmlmixed"),require("../ruby/ruby")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../htmlmixed/htmlmixed","../ruby/ruby"],t):t(CodeMirror)}((function(t){"use strict";t.defineMode("slim",(function(e){var n=t.getMode(e,{name:"htmlmixed"}),i=t.getMode(e,"ruby"),r={html:n,ruby:i},o={ruby:"ruby",javascript:"javascript",css:"text/css",sass:"text/x-sass",scss:"text/x-scss",less:"text/x-less",styl:"text/x-styl",coffee:"coffeescript",asciidoc:"text/x-asciidoc",markdown:"text/x-markdown",textile:"text/x-textile",creole:"text/x-creole",wiki:"text/x-wiki",mediawiki:"text/x-mediawiki",rdoc:"text/x-rdoc",builder:"text/x-builder",nokogiri:"text/x-nokogiri",erb:"application/x-erb"},u=function(t){var e=[];for(var n in t)e.push(n);return new RegExp("^("+e.join("|")+"):")}(o),a={commentLine:"comment",slimSwitch:"operator special",slimTag:"tag",slimId:"attribute def",slimClass:"attribute qualifier",slimAttribute:"attribute",slimSubmode:"keyword special",closeAttributeTag:null,slimDoctype:null,lineContinuation:null},c={"{":"}","[":"]","(":")"},l="_a-zA-ZÀ-ÖØ-öø-˿Ͱ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",s=l+"\\-0-9·̀-ͯ‿-⁀",k=new RegExp("^[:"+l+"](?::["+s+"]|["+s+"]*)"),d=new RegExp("^[:"+l+"][:\\."+s+"]*(?=\\s*=)"),m=new RegExp("^[:"+l+"][:\\."+s+"]*"),f=/^\.-?[_a-zA-Z]+[\w\-]*/,b=/^#[_a-zA-Z]+[\w\-]*/;function z(t,e){t.stack={parent:t.stack,style:"continuation",indented:e,tokenize:t.line},t.line=t.tokenize}function p(t){t.line==t.tokenize&&(t.line=t.stack.tokenize,t.stack=t.stack.parent)}function x(t,e){return function(n,i){return n.peek()==t&&1==i.rubyState.tokenize.length?(n.next(),i.tokenize=e,"closeAttributeTag"):y(n,i)}}function h(e){var n,r=function(t,i){if(1==i.rubyState.tokenize.length&&!i.rubyState.context.prev){if(t.backUp(1),t.eatSpace())return i.rubyState=n,i.tokenize=e,e(t,i);t.next()}return y(t,i)};return function(e,o){return n=o.rubyState,o.rubyState=t.startState(i),o.tokenize=r,y(e,o)}}function y(t,e){return i.token(t,e.rubyState)}function S(t,e){return t.match(/^#\{/)?(e.tokenize=x("}",e.tokenize),null):function(t,e,n,i,r){var o=t.current(),u=o.search(/[^\\]#\{/);return u>-1&&(e.tokenize=function(t,e,n){var i=function(i,r){return r.tokenize=e,i.pos<t?(i.pos=t,n):r.tokenize(i,r)};return function(t,n){return n.tokenize=i,e(t,n)}}(t.pos,e.tokenize,r),t.backUp(o.length-u-1)),r}(t,e,0,0,n.token(t,e.htmlState))}function v(t,e,n){return e.stack={parent:e.stack,style:"html",indented:t.column()+n,tokenize:e.line},e.line=e.tokenize=S,null}function w(t,e){return t.skipToEnd(),e.stack.style}function g(t,e){return t.eat(e.stack.endQuote)?(e.line=e.stack.line,e.tokenize=e.stack.tokenize,e.stack=e.stack.parent,null):t.match(m)?(e.tokenize=M,"slimAttribute"):(t.next(),null)}function M(t,e){return t.match(/^==?/)?(e.tokenize=C,null):g(t,e)}function C(t,e){var n=t.peek();return'"'==n||"'"==n?(e.tokenize=Z(n,"string",!0,!1,g),t.next(),e.tokenize(t,e)):"["==n?h(g)(t,e):t.match(/^(true|false|nil)\b/)?(e.tokenize=g,"keyword"):h(g)(t,e)}function E(e,n){if(e.match(/^#\{/))return n.tokenize=x("}",n.tokenize),null;var i=new t.StringStream(e.string.slice(n.stack.indented),e.tabSize);i.pos=e.pos-n.stack.indented,i.start=e.start-n.stack.indented,i.lastColumnPos=e.lastColumnPos-n.stack.indented,i.lastColumnValue=e.lastColumnValue-n.stack.indented;var r=n.subMode.token(i,n.subState);return e.pos=i.pos+n.stack.indented,r}function A(t,e){return e.stack.indented=t.column(),e.line=e.tokenize=E,e.tokenize(t,e)}function L(t,e){return t.skipToEnd(),"slimDoctype"}function $(n,i){var a,c,l;if("<"==n.peek())return(i.tokenize=(l=i.tokenize,function(t,e){var n=function(t,e){return t.match(/^\\$/)?"lineContinuation":S(t,e)}(t,e);return t.eol()&&(e.tokenize=l),n}))(n,i);if(n.match(/^[|']/))return v(n,i,1);if(n.match(/^\/(!|\[\w+])?/))return function(t,e){return e.stack={parent:e.stack,style:"comment",indented:e.indented+1,tokenize:e.line},e.line=w,w(t,e)}(n,i);if(n.match(/^(-|==?[<>]?)/))return i.tokenize=function(t,e){return function(n,i){if(p(i),n.match(/^\\$/))return z(i,t),"lineContinuation";var r=e(n,i);return n.eol()&&n.current().match(/(?:^|[^\\])(?:\\\\)*\\$/)&&n.backUp(1),r}}(n.column(),(a=n.column(),c=y,function(t,e){p(e);var n=c(t,e);return t.eol()&&t.current().match(/,$/)&&z(e,a),n})),"slimSwitch";if(n.match(/^doctype\b/))return i.tokenize=L,"keyword";var s=n.match(u);return s?function(n,i){var u=function(n){return r.hasOwnProperty(n)?r[n]:r[n]=function(n){var i=o[n],r=t.mimeModes[i];if(r)return t.getMode(e,r);var u=t.modes[i];return u?u(e,{name:i}):t.getMode(e,"null")}(n)}(n),a=t.startState(u);return i.subMode=u,i.subState=a,i.stack={parent:i.stack,style:"sub",indented:i.indented+1,tokenize:i.line},i.line=i.tokenize=A,"slimSubmode"}(s[1],i):U(n,i)}function T(t,e){return e.startOfLine?$(t,e):U(t,e)}function U(t,e){return t.eat("*")?(e.tokenize=h(j),null):t.match(k)?(e.tokenize=j,"slimTag"):O(t,e)}function j(t,e){return t.match(/^(<>?|><?)/)?(e.tokenize=O,null):O(t,e)}function O(t,e){return t.match(b)?(e.tokenize=O,"slimId"):t.match(f)?(e.tokenize=O,"slimClass"):R(t,e)}function R(t,e){return t.match(/^([\[\{\(])/)?function(t,e,n){return t.stack={parent:t.stack,style:"wrapper",indented:t.indented+1,tokenize:n,line:t.line,endQuote:e},t.line=t.tokenize=g,null}(e,c[RegExp.$1],R):t.match(d)?(e.tokenize=q,"slimAttribute"):"*"==t.peek()?(t.next(),e.tokenize=h(_),null):_(t,e)}function q(t,e){return t.match(/^==?/)?(e.tokenize=I,null):R(t,e)}function I(t,e){var n=t.peek();return'"'==n||"'"==n?(e.tokenize=Z(n,"string",!0,!1,R),t.next(),e.tokenize(t,e)):"["==n?h(R)(t,e):":"==n?h(P)(t,e):t.match(/^(true|false|nil)\b/)?(e.tokenize=R,"keyword"):h(R)(t,e)}function P(t,e){return t.backUp(1),t.match(/^[^\s],(?=:)/)?(e.tokenize=h(P),null):(t.next(),R(t,e))}function Z(t,e,n,i,r){return function(o,u){p(u);var a=0==o.current().length;if(o.match(/^\\$/,a))return a?(z(u,u.indented),"lineContinuation"):e;if(o.match(/^#\{/,a))return a?(u.tokenize=x("}",u.tokenize),null):e;for(var c,l=!1;null!=(c=o.next());){if(c==t&&(i||!l)){u.tokenize=r;break}if(n&&"#"==c&&!l&&o.eat("{")){o.backUp(2);break}l=!l&&"\\"==c}return o.eol()&&l&&o.backUp(1),e}}function _(t,e){return t.match(/^==?/)?(e.tokenize=y,"slimSwitch"):t.match(/^\/$/)?(e.tokenize=T,null):t.match(/^:/)?(e.tokenize=U,"slimSwitch"):(v(t,e,0),e.tokenize(t,e))}var D={startState:function(){return{htmlState:t.startState(n),rubyState:t.startState(i),stack:null,last:null,tokenize:T,line:T,indented:0}},copyState:function(e){return{htmlState:t.copyState(n,e.htmlState),rubyState:t.copyState(i,e.rubyState),subMode:e.subMode,subState:e.subMode&&t.copyState(e.subMode,e.subState),stack:e.stack,last:e.last,tokenize:e.tokenize,line:e.line}},token:function(t,e){if(t.sol())for(e.indented=t.indentation(),e.startOfLine=!0,e.tokenize=e.line;e.stack&&e.stack.indented>e.indented&&"slimSubmode"!=e.last;)e.line=e.tokenize=e.stack.tokenize,e.stack=e.stack.parent,e.subMode=null,e.subState=null;if(t.eatSpace())return null;var n=e.tokenize(t,e);return e.startOfLine=!1,n&&(e.last=n),a.hasOwnProperty(n)?a[n]:n},blankLine:function(t){if(t.subMode&&t.subMode.blankLine)return t.subMode.blankLine(t.subState)},innerMode:function(t){return t.subMode?{state:t.subState,mode:t.subMode}:{state:t,mode:D}}};return D}),"htmlmixed","ruby"),t.defineMIME("text/x-slim","slim"),t.defineMIME("application/x-slim","slim")}));