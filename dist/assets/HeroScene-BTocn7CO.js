import{r as s,j as e,P as k}from"./vendor-BU67IMLD.js";import{V as T,u as z,A as N,M as C,C as F}from"./three-DJg-FZZg.js";import{u as B,a as W}from"./useWebGL-B3jpeuRo.js";import{u as _,A as D,m as V}from"./motion-C0Gfg38I.js";const E=`
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute float aScale;
  attribute float aTint;
  attribute vec3 aDrift;

  varying float vTint;
  varying float vGlow;

  void main() {
    vec3 pos = position;

    // gentle continuous drift
    pos += aDrift * sin(uTime * 0.32 + aScale * 24.0);

    // subtle cursor reaction: nodes near the pointer ease away + brighten
    float d = distance(pos.xy, uPointer);
    float influence = smoothstep(2.2, 0.0, d);
    vec2 dir = normalize(pos.xy - uPointer + vec2(0.0001));
    pos.xy += dir * influence * 0.42;
    vGlow = influence;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = uSize * aScale * uPixelRatio * (12.0 / -mv.z);
    vTint = aTint;
  }
`,I=`
  varying float vTint;
  varying float vGlow;

  void main() {
    // soft round sprite
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.06, dist);

    vec3 blue = vec3(0.31, 0.55, 1.0);
    vec3 cyan = vec3(0.22, 0.88, 0.88);
    vec3 violet = vec3(0.55, 0.36, 0.97);

    vec3 color = mix(blue, cyan, vTint);
    color = mix(color, violet, step(0.9, vTint));
    color += vGlow * 0.35;

    gl_FragColor = vec4(color, alpha * (0.55 + vGlow * 0.45));
  }
`;function H({count:a,active:h}){const d=s.useRef(null),f=s.useRef(null),{positions:b,scales:y,tints:M,drifts:p,linePositions:w}=s.useMemo(()=>{const t=new Float32Array(a*3),n=new Float32Array(a),u=new Float32Array(a),i=new Float32Array(a*3);for(let r=0;r<a;r++){const o=Math.random(),j=Math.random(),x=o*Math.PI*2,m=Math.acos(2*j-1),g=Math.cbrt(Math.random())*4.6;t[r*3]=g*Math.sin(m)*Math.cos(x)*1.35,t[r*3+1]=g*Math.sin(m)*Math.sin(x)*.72,t[r*3+2]=g*Math.cos(m)*.85,n[r]=.55+Math.random()*1.15,u[r]=Math.random(),i[r*3]=(Math.random()-.5)*.045,i[r*3+1]=(Math.random()-.5)*.045,i[r*3+2]=(Math.random()-.5)*.03}const S=a>400?1100:450,L=1.35,P=[],G=a*6;let R=0;for(;P.length/6<S&&R<G;){R++;const r=Math.floor(Math.random()*a),o=Math.floor(Math.random()*a);if(r===o)continue;const j=t[r*3]-t[o*3],x=t[r*3+1]-t[o*3+1],m=t[r*3+2]-t[o*3+2];Math.sqrt(j*j+x*x+m*m)>L||P.push(t[r*3],t[r*3+1],t[r*3+2],t[o*3],t[o*3+1],t[o*3+2])}return{positions:t,scales:n,tints:u,drifts:i,linePositions:new Float32Array(P)}},[a]),c=s.useMemo(()=>({uTime:{value:0},uPointer:{value:new T(999,999)},uPixelRatio:{value:1},uSize:{value:26}}),[]),l=s.useRef({x:0,y:0}),v=s.useRef(new T(999,999)),A=s.useRef(1);return z((t,n)=>{if(!d.current)return;const u=t.clock.elapsedTime;if(c.uTime.value=u,c.uPixelRatio.value=t.gl.getPixelRatio(),h){l.current.x=t.pointer.x*3.4,l.current.y=t.pointer.y*1.9,v.current.set(l.current.x,l.current.y),c.uPointer.value.lerp(v.current,Math.min(1,n*3));const i=d.current;i.rotation.y+=(t.pointer.x*.32-i.rotation.y)*Math.min(1,n*1.6),i.rotation.x+=(-t.pointer.y*.18-i.rotation.x)*Math.min(1,n*1.6),i.position.y=Math.sin(u*.4)*.12,f.current&&(f.current.rotation.y+=n*.12,f.current.rotation.x+=n*.05),A.current=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);const S=Math.min(1,window.scrollY/A.current);t.camera.position.z=C.lerp(t.camera.position.z,7+S*2.4,Math.min(1,n*2)),t.camera.position.x=Math.sin(u*.12)*.25,t.camera.position.y=Math.cos(u*.09)*.18,t.camera.lookAt(0,0,0)}}),e.jsxs("group",{ref:d,children:[e.jsxs("points",{frustumCulled:!1,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",args:[b,3]}),e.jsx("bufferAttribute",{attach:"attributes-aScale",args:[y,1]}),e.jsx("bufferAttribute",{attach:"attributes-aTint",args:[M,1]}),e.jsx("bufferAttribute",{attach:"attributes-aDrift",args:[p,3]})]}),e.jsx("shaderMaterial",{uniforms:c,vertexShader:E,fragmentShader:I,transparent:!0,depthWrite:!1,blending:N})]}),e.jsxs("lineSegments",{frustumCulled:!1,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[w,3]})}),e.jsx("lineBasicMaterial",{color:"#4f8cff",transparent:!0,opacity:.16,depthWrite:!1,blending:N})]}),e.jsxs("group",{ref:f,position:[0,0,0],children:[e.jsxs("mesh",{children:[e.jsx("icosahedronGeometry",{args:[1.45,0]}),e.jsx("meshBasicMaterial",{color:"#38e1e1",wireframe:!0,transparent:!0,opacity:.14,depthWrite:!1})]}),e.jsxs("mesh",{rotation:[.6,.4,0],children:[e.jsx("octahedronGeometry",{args:[2.5,0]}),e.jsx("meshBasicMaterial",{color:"#8b5cf6",wireframe:!0,transparent:!0,opacity:.07,depthWrite:!1})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.42,24,24]}),e.jsx("meshBasicMaterial",{color:"#4f8cff",transparent:!0,opacity:.35})]})]})]})}function q(){return e.jsxs("div",{className:"absolute inset-0 overflow-hidden","aria-hidden":"true",children:[e.jsx("div",{className:"absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.22),transparent_65%)] blur-2xl"}),e.jsx("div",{className:"absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,225,225,0.16),transparent_65%)] blur-2xl"}),e.jsxs("svg",{className:"absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-60",viewBox:"0 0 400 400",fill:"none",children:[e.jsxs("g",{stroke:"rgba(79,140,255,0.35)",strokeWidth:"1",children:[e.jsx("path",{d:"M90 210 L150 130 L230 160 L300 110"}),e.jsx("path",{d:"M150 130 L170 250 L260 280 L300 190"}),e.jsx("path",{d:"M230 160 L260 280"}),e.jsx("path",{d:"M90 210 L170 250"}),e.jsx("path",{d:"M300 110 L300 190"})]}),e.jsxs("g",{fill:"#4f8cff",children:[e.jsx("circle",{cx:"90",cy:"210",r:"5"}),e.jsx("circle",{cx:"150",cy:"130",r:"7"}),e.jsx("circle",{cx:"230",cy:"160",r:"5"}),e.jsx("circle",{cx:"300",cy:"110",r:"6"}),e.jsx("circle",{cx:"170",cy:"250",r:"5"}),e.jsx("circle",{cx:"260",cy:"280",r:"6"}),e.jsx("circle",{cx:"300",cy:"190",r:"5"})]}),e.jsx("g",{fill:"#38e1e1",children:e.jsx("circle",{cx:"205",cy:"205",r:"9"})})]})]})}function O(){return e.jsx(V.div,{initial:{opacity:1},exit:{opacity:0},transition:{duration:.6},className:"absolute inset-0 grid place-items-center","aria-hidden":"true",children:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsxs("div",{className:"relative h-10 w-10",children:[e.jsx("div",{className:"absolute inset-0 rounded-full border border-line"}),e.jsx("div",{className:"absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent"})]}),e.jsxs("p",{className:"flex items-center gap-2 font-mono text-[0.68rem] tracking-widest text-faint uppercase",children:[e.jsx(k,{className:"h-3 w-3 animate-pulse text-accent-2"}),"Loading data layer"]})]})})}function Q(){const a=B(),h=_(),d=W(),[f,b]=s.useState(!1),[y,M]=s.useState(!0),p=s.useRef(null);if(s.useEffect(()=>{const c=p.current;if(!c)return;const l=new IntersectionObserver(([v])=>M(v.isIntersecting),{threshold:.01});return l.observe(c),()=>l.disconnect()},[]),!a)return e.jsx(q,{});const w=d==="mobile"?240:640;return e.jsxs("div",{ref:p,className:"absolute inset-0","aria-hidden":"true",children:[e.jsx(F,{dpr:[1,d==="mobile"?1.5:1.8],camera:{position:[0,0,7],fov:48},frameloop:y?h?"demand":"always":"never",gl:{antialias:!1,alpha:!0,powerPreference:"high-performance"},onCreated:()=>b(!0),style:{background:"transparent"},children:e.jsx(s.Suspense,{fallback:null,children:e.jsx(H,{count:w,active:!h})})}),e.jsx(D,{children:!f&&e.jsx(O,{},"loader")})]})}export{Q as default};
