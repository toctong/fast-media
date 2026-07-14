import{E as e,T as t,Y as n,_ as r,k as i,u as a}from"./runtime-core.esm-bundler-ThsGeIpg.js";import{f as o}from"./app-k-jrRZQQ.js";var s=.45,c=`
attribute vec2 a;
varying vec2 v;
void main(){
  v = a * 0.5 + 0.5;
  gl_Position = vec4(a, 0.0, 1.0);
}`,l=`
precision highp float;
varying vec2 v;
uniform sampler2D uPrev;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform vec2 uTexel;
uniform float uForce;
uniform float uTime;

void main(){
  vec2 uv = v;
  // soft advection along residual field
  vec4 prev = texture2D(uPrev, uv - uVel * 0.018);
  float decay = 0.975;
  vec3 col = prev.rgb * decay;

  float d = distance(uv, uMouse);
  float splat = exp(-d * d * 48.0) * uForce;
  vec3 dye = vec3(0.22, 0.42, 0.58) * 0.4 + vec3(0.12, 0.55, 0.48) * 0.3;
  dye += 0.06 * vec3(sin(uTime), cos(uTime * 0.8), sin(uTime * 1.3));
  col += dye * splat * 0.75;

  // curl-ish swirl around pointer
  vec2 dir = uv - uMouse;
  float swirl = splat * 0.35;
  col += vec3(0.2, 0.55, 0.9) * swirl * (0.5 + 0.5 * sin(atan(dir.y, dir.x) * 3.0 + uTime));

  // subtle noise bloom
  float n = fract(sin(dot(uv * 80.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += n * 0.008;

  gl_FragColor = vec4(col, 1.0);
}`,u=`
precision highp float;
varying vec2 v;
uniform sampler2D uSim;
uniform vec2 uMouse;
uniform float uTime;

void main(){
  vec2 uv = v;
  // slight lens warp toward pointer
  vec2 d = uv - uMouse;
  float dist = length(d);
  uv -= d * exp(-dist * 6.0) * 0.04;

  vec3 c = texture2D(uSim, uv).rgb;
  // chromatic aberration
  float ab = 0.0018 + exp(-dist * 5.0) * 0.004;
  float r = texture2D(uSim, uv + vec2(ab, 0.0)).r;
  float g = c.g;
  float b = texture2D(uSim, uv - vec2(ab, 0.0)).b;
  c = vec3(r, g, b);

  // vignette
  float vig = smoothstep(1.15, 0.25, dist * 1.15);
  c *= 0.35 + vig * 0.9;

  // film grain
  float n = fract(sin(dot(v * vec2(210.0, 170.0) + uTime, vec2(12.9898,78.233))) * 43758.5453);
  c += (n - 0.5) * 0.035;

  gl_FragColor = vec4(c, 0.88);
}`,d=o(r({__name:`FluidWebGL`,setup(r){let o=n(null),d=null,f=0,p=!0,m=0,h=0,g=1,_={x:.5,y:.5,px:.5,py:.5,vx:0,vy:0,down:!1},v=null,y=null,b=null,x=null,S=null,C=null,w=null,T=!1;function E(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)||console.warn(e.getShaderInfoLog(r)),r}function D(e,t,n){let r=e.createProgram();return e.attachShader(r,E(e,e.VERTEX_SHADER,t)),e.attachShader(r,E(e,e.FRAGMENT_SHADER,n)),e.linkProgram(r),r}function O(e,t,n){let r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,n,0,e.RGBA,e.UNSIGNED_BYTE,null);let i=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0),{tex:r,fbo:i}}function k(){let e=o.value;if(!e||!d)return;g=Math.min(window.devicePixelRatio||1,2),m=window.innerWidth,h=window.innerHeight,e.width=Math.floor(m*g),e.height=Math.floor(h*g),e.style.width=`${m}px`,e.style.height=`${h}px`,d.viewport(0,0,e.width,e.height);let t=Math.max(64,Math.floor(m*s)),n=Math.max(64,Math.floor(h*s)),r=O(d,t,n),i=O(d,t,n);v=r.tex,b=r.fbo,y=i.tex,x=i.fbo}function A(e){let t=e.clientX/Math.max(1,window.innerWidth),n=1-e.clientY/Math.max(1,window.innerHeight);_.vx=t-_.x,_.vy=n-_.y,_.px=_.x,_.py=_.y,_.x=t,_.y=n}function j(){_.down=!0}function M(){_.down=!1}function N(e){if(!p||!d||!S||!C||!w)return;let t=d,n=e*.001,r=Math.min(.9,Math.hypot(_.vx,_.vy)*28+(_.down?.28:.06)),i=Math.max(64,Math.floor(m*s)),a=Math.max(64,Math.floor(h*s)),o=T?y:v,c=T?b:x;t.bindFramebuffer(t.FRAMEBUFFER,c),t.viewport(0,0,i,a),t.useProgram(S),t.bindBuffer(t.ARRAY_BUFFER,w);let l=t.getAttribLocation(S,`a`);t.enableVertexAttribArray(l),t.vertexAttribPointer(l,2,t.FLOAT,!1,0,0),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,o),t.uniform1i(t.getUniformLocation(S,`uPrev`),0),t.uniform2f(t.getUniformLocation(S,`uMouse`),_.x,_.y),t.uniform2f(t.getUniformLocation(S,`uVel`),_.vx,_.vy),t.uniform2f(t.getUniformLocation(S,`uTexel`),1/i,1/a),t.uniform1f(t.getUniformLocation(S,`uForce`),r),t.uniform1f(t.getUniformLocation(S,`uTime`),n),t.drawArrays(t.TRIANGLES,0,6),T=!T,_.vx*=.86,_.vy*=.86,t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,Math.floor(m*g),Math.floor(h*g)),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.useProgram(C),t.bindBuffer(t.ARRAY_BUFFER,w);let u=t.getAttribLocation(C,`a`);t.enableVertexAttribArray(u),t.vertexAttribPointer(u,2,t.FLOAT,!1,0,0),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,T?v:y),t.uniform1i(t.getUniformLocation(C,`uSim`),0),t.uniform2f(t.getUniformLocation(C,`uMouse`),_.x,_.y),t.uniform1f(t.getUniformLocation(C,`uTime`),n),t.drawArrays(t.TRIANGLES,0,6),f=requestAnimationFrame(N)}return e(()=>{let e=o.value;e&&(d=e.getContext(`webgl`,{alpha:!0,premultipliedAlpha:!1,antialias:!1}),d&&(S=D(d,c,l),C=D(d,c,u),w=d.createBuffer(),d.bindBuffer(d.ARRAY_BUFFER,w),d.bufferData(d.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),d.STATIC_DRAW),k(),window.addEventListener(`resize`,k),window.addEventListener(`pointermove`,A,{passive:!0}),window.addEventListener(`pointerdown`,j),window.addEventListener(`pointerup`,M),f=requestAnimationFrame(N)))}),t(()=>{p=!1,cancelAnimationFrame(f),window.removeEventListener(`resize`,k),window.removeEventListener(`pointermove`,A),window.removeEventListener(`pointerdown`,j),window.removeEventListener(`pointerup`,M)}),(e,t)=>(i(),a(`canvas`,{ref_key:`el`,ref:o,class:`fluid-webgl`,"aria-hidden":`true`},null,512))}}),[[`__scopeId`,`data-v-c9f7526a`]]);export{d as default};