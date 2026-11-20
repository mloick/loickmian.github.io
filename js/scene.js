// The 3D galaxy: stars, spiral arms, nebulae, worlds, the ship, UFOs, warp and teleport effects.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const TAU = Math.PI * 2;
const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;

export function createGalaxy(canvas, worlds, opts = {}) {
  const mobile = Math.min(innerWidth, innerHeight) < 700;
  const reduce = !!opts.reduce;
  const Q = mobile ? .5 : 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x02030a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02030a, 0.0016);
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 3000);
  camera.position.set(0, 60, 900);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth * (mobile ? .5 : .75), innerHeight * (mobile ? .5 : .75)), .95, .5, .32);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  scene.add(new THREE.AmbientLight(0x404a70, .55));
  const coreLight = new THREE.PointLight(0xffd8a0, 2.2, 0, 0); scene.add(coreLight);
  const keyLight = new THREE.DirectionalLight(0x9fc4ff, 1.1); keyLight.position.set(80, 120, 60); scene.add(keyLight);

  /* ---------- textures ---------- */
  function radialTex(stops, size = 128) {
    const c = document.createElement("canvas"); c.width = c.height = size;
    const g = c.getContext("2d"); const gr = g.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const dotTex = radialTex([[0, "rgba(255,255,255,1)"], [.25, "rgba(255,255,255,.85)"], [.6, "rgba(255,255,255,.15)"], [1, "rgba(255,255,255,0)"]], 64);
  const glowTex = radialTex([[0, "rgba(255,255,255,.9)"], [.2, "rgba(255,255,255,.35)"], [1, "rgba(255,255,255,0)"]], 128);

  /* ---------- background star sphere ---------- */
  {
    const n = Math.round(7000 * Q), pos = new Float32Array(n*3), col = new Float32Array(n*3), sz = new Float32Array(n);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const u = Math.random()*2 - 1, th = Math.random()*TAU, r = 900 + Math.random()*700, s = Math.sqrt(1 - u*u);
      pos.set([r*s*Math.cos(th), r*u, r*s*Math.sin(th)], i*3);
      c.setHSL(.55 + Math.random()*.2, .5, .75 + Math.random()*.25); col.set([c.r, c.g, c.b], i*3);
      sz[i] = Math.random() < .03 ? 5 + Math.random()*5 : 1 + Math.random()*2.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sz, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uTex: { value: dotTex }, uPR: { value: renderer.getPixelRatio() } },
      vertexShader: `attribute float size; varying vec3 vC; varying float vT; uniform float uTime; uniform float uPR;
        void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.); gl_Position = projectionMatrix * mv;
        float tw = .65 + .35*sin(uTime*1.7 + position.x*.05 + position.y*.03); vT = tw; gl_PointSize = size * uPR * tw; }`,
      fragmentShader: `uniform sampler2D uTex; varying vec3 vC; varying float vT;
        void main(){ vec4 t = texture2D(uTex, gl_PointCoord); gl_FragColor = vec4(vC * (0.7+vT*.6), t.a); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, fog: false
    });
    scene.add(new THREE.Points(geo, mat));
    scene.userData.bgStars = mat;
  }

  /* ---------- spiral galaxy ---------- */
  const galaxy = new THREE.Group(); scene.add(galaxy);
  {
    const n = Math.round(42000 * Q), arms = 4, R = 230, pos = new Float32Array(n*3), col = new Float32Array(n*3);
    const inner = new THREE.Color("#ffd29a"), mid = new THREE.Color("#8a6bff"), outer = new THREE.Color("#2fb5ff"), c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const r = Math.pow(Math.random(), 1.6) * R, arm = (i % arms) / arms * TAU, spin = r * .028;
      const spread = (Math.random() - .5) * (6 + r*.16), spreadY = (Math.random() - .5) * (14 * Math.exp(-r/60) + 2);
      const a = arm + spin + (Math.random()-.5)*.35;
      pos.set([Math.cos(a)*r + spread*Math.cos(a+1.57), spreadY, Math.sin(a)*r + spread*Math.sin(a+1.57)], i*3);
      const t = r / R; c.copy(inner).lerp(mid, Math.min(1, t*1.8)); if (t > .5) c.lerp(outer, (t-.5)*1.6);
      c.multiplyScalar(.55 + Math.random()*.6); col.set([c.r, c.g, c.b], i*3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: dotTex }, uPR: { value: renderer.getPixelRatio() } },
      vertexShader: `varying vec3 vC; varying float vF; uniform float uPR;
        void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.); gl_Position = projectionMatrix * mv;
        float d = -mv.z; gl_PointSize = clamp(320. / d, .8, 3.2) * uPR; vF = smoothstep(4., 30., d); }`,
      fragmentShader: `uniform sampler2D uTex; varying vec3 vC; varying float vF;
        void main(){ vec4 t = texture2D(uTex, gl_PointCoord); gl_FragColor = vec4(vC, t.a * .85 * vF); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true });
    galaxy.add(new THREE.Points(geo, mat));
    // core
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffcf8a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .95 }));
    core.scale.set(60, 60, 1); core.material.opacity = .7; galaxy.add(core);
    const core2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xfff3dd, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    core2.scale.set(16, 16, 1); galaxy.add(core2); scene.userData.cores = [core, core2];
  }
  /* nebulae */
  {
    const cols = ["#5b3cff", "#2a8cff", "#c04dff", "#1fd1c5", "#ff7a59"];
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: cols[i % cols.length], transparent: true, opacity: .06 + Math.random()*.06, blending: THREE.AdditiveBlending, depthWrite: false }));
      const a = Math.random()*TAU, r = 40 + Math.random()*220; s.position.set(Math.cos(a)*r, (Math.random()-.5)*40, Math.sin(a)*r);
      const k = 120 + Math.random()*220; s.scale.set(k, k*.7, 1); galaxy.add(s);
    }
  }

  /* ---------- worlds ---------- */
  const W = worlds.length;
  const worldObjs = [];
  const loader = new THREE.TextureLoader();

  function planetMaterial(color, kind) {
    return new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uRock: { value: kind === "rock" ? 1 : 0 } },
      vertexShader: `varying vec3 vN; varying vec3 vP; varying vec3 vW;
        void main(){ vN = normalize(normalMatrix*normal); vP = position; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `uniform vec3 uColor; uniform float uTime; uniform float uRock; varying vec3 vN; varying vec3 vP; varying vec3 vW;
        float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
        float n3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
          return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
        float fbm(vec3 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n3(p); p*=2.03; a*=.5; } return s; }
        void main(){
          vec3 p = normalize(vP);
          float bands = mix(sin(p.y*9. + fbm(p*3. + uTime*.03)*4.)*.5+.5, fbm(p*5.), uRock);
          vec3 base = mix(uColor*.25, uColor*.9, bands);
          base = mix(base, vec3(1.), smoothstep(.72,.95, fbm(p*7.+3.)) * .25 * (1.-uRock));
          vec3 L = normalize(-vW); float diff = clamp(dot(vN, normalize(vec3(.3,.6,.7))), 0., 1.)*.75 + .25;
          float rim = pow(1. - abs(dot(vN, vec3(0.,0.,1.))), 2.4);
          gl_FragColor = vec4(base*diff + uColor*rim*.75, 1.);
        }`
    });
  }
  function atmosphere(color, r) {
    const m = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) } },
      vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 uColor; varying vec3 vN; void main(){ float i = pow(.72 - dot(vN, vec3(0,0,1.)), 3.); gl_FragColor = vec4(uColor, 1.)*i*.9; }`,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false
    });
    return new THREE.Mesh(new THREE.SphereGeometry(r * 1.28, 40, 40), m);
  }
  function hologram(tex, color) {
    return new THREE.ShaderMaterial({
      uniforms: { uTex: { value: tex }, uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uOn: { value: .55 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform sampler2D uTex; uniform float uTime; uniform vec3 uColor; uniform float uOn; varying vec2 vUv;
        void main(){ vec2 uv = vUv; float g = step(.985, fract(uTime*.7 + uv.y*.1)) * .02; uv.x += g*sin(uv.y*80.);
          vec4 t = texture2D(uTex, uv); float scan = .7 + .3*sin(uv.y*220. - uTime*6.);
          float flick = .85 + .15*sin(uTime*23.)*sin(uTime*7.);
          vec3 c = mix(t.rgb, uColor, .25) * scan * flick * 1.5;
          gl_FragColor = vec4(c, t.a * uOn * (.85 + .15*scan)); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    });
  }

  worlds.forEach((w, i) => {
    const t = i / (W - 1);
    const r = lerp(205, 48, Math.pow(t, .85));
    const a = 1.2 + i * .62;
    const pos = new THREE.Vector3(Math.cos(a) * r, Math.sin(i * 1.7) * 6, Math.sin(a) * r);
    const g = new THREE.Group(); g.position.copy(pos); scene.add(g);
    const size = w.size;
    let body;
    if (w.kind === "rock") {
      const geo = new THREE.IcosahedronGeometry(size, 2); const p = geo.attributes.position;
      for (let k = 0; k < p.count; k++) { const v = new THREE.Vector3().fromBufferAttribute(p, k); v.multiplyScalar(.8 + Math.random()*.32); p.setXYZ(k, v.x, v.y, v.z); }
      geo.computeVertexNormals();
      body = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: new THREE.Color(w.color).lerp(new THREE.Color("#6b6460"), .45), roughness: .95, metalness: .05, flatShading: true, emissive: new THREE.Color(w.color), emissiveIntensity: .12 }));
      g.add(body);
      const shards = new THREE.Group();
      for (let k = 0; k < 7; k++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(size*(.12+Math.random()*.16), 0), body.material); const aa = Math.random()*TAU, rr = size*(1.7+Math.random()*.8); m.position.set(Math.cos(aa)*rr, (Math.random()-.5)*size*.6, Math.sin(aa)*rr); shards.add(m); }
      g.add(shards); g.userData.spin = shards;
    } else if (w.kind === "station") {
      body = new THREE.Mesh(new THREE.SphereGeometry(size*.55, 32, 32), planetMaterial(w.color, "planet")); g.add(body);
      const metal = new THREE.MeshStandardMaterial({ color: 0xb8c6dc, metalness: .85, roughness: .3, emissive: 0x0a2040 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(size*1.35, size*.12, 12, 64), metal); ring.rotation.x = Math.PI/2;
      const lights = new THREE.Mesh(new THREE.TorusGeometry(size*1.35, size*.03, 6, 96), new THREE.MeshBasicMaterial({ color: 0x7fd8ff })); lights.rotation.x = Math.PI/2; lights.position.y = size*.13;
      const spin = new THREE.Group(); spin.add(ring, lights);
      for (let k = 0; k < 4; k++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(size*.05, size*.05, size*2.7, 6), metal); s.rotation.z = Math.PI/2; s.rotation.y = k*Math.PI/4; spin.add(s); }
      g.add(spin); g.userData.spin = spin; spin.rotation.x = .35;
      g.add(atmosphere(w.color, size*.6));
    } else if (w.kind === "signal") {
      body = new THREE.Mesh(new THREE.SphereGeometry(size*.45, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffffff })); g.add(body);
      const rings = [];
      for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(new THREE.RingGeometry(size*.9, size, 64), new THREE.MeshBasicMaterial({ color: w.color, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); m.userData.phase = k/4; rings.push(m); g.add(m); }
      g.userData.rings = rings;
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: w.color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); glow.scale.set(size*7, size*7, 1); g.add(glow);
    } else {
      body = new THREE.Mesh(new THREE.SphereGeometry(size, 48, 48), planetMaterial(w.color, "planet")); g.add(body);
      g.add(atmosphere(w.color, size));
      if (w.kind === "ringed") {
        const rg = new THREE.RingGeometry(size*1.5, size*2.4, 96);
        const rm = new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color(w.color) } }, side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
          vertexShader: `varying vec2 vUv; varying float vR; void main(){ vUv=uv; vR=length(position.xy); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
          fragmentShader: `uniform vec3 uColor; varying float vR; void main(){ float b = .5+.5*sin(vR*9.); gl_FragColor = vec4(uColor*(.4+b*.6), .55*b+.15); }`,
          defines: {} });
        const ringM = new THREE.Mesh(rg, rm); ringM.rotation.x = -Math.PI/2.4; g.add(ringM);
      }
      if (w.kind === "flow") {
        // particles flowing along a looping workflow path around the planet
        const curve = new THREE.CatmullRomCurve3([...Array(8)].map((_, k) => { const aa = k/8*TAU; return new THREE.Vector3(Math.cos(aa)*size*2, Math.sin(aa*2)*size*.7, Math.sin(aa)*size*2); }), true);
        const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, size*.035, 6, true), new THREE.MeshBasicMaterial({ color: w.color, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false }));
        g.add(tube);
        const n = 26, pts = new THREE.BufferGeometry(); pts.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n*3), 3));
        const pm = new THREE.Points(pts, new THREE.PointsMaterial({ size: size*.45, map: dotTex, color: 0xbff0ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        g.add(pm); g.userData.flow = { curve, pts, n };
        for (let k = 0; k < 5; k++) { const node = new THREE.Mesh(new THREE.OctahedronGeometry(size*.18), new THREE.MeshBasicMaterial({ color: 0xffffff })); node.position.copy(curve.getPoint(k/5)); g.add(node); }
      }
    }
    body.userData.worldIndex = i;

    // logo hologram above the world
    const holo = new THREE.Group(); holo.position.y = size * 2.3 + 2; g.add(holo);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(size*1.1, size*2.3 + 2 - size, 32, 1, true), new THREE.MeshBasicMaterial({ color: w.color, transparent: true, opacity: .07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    cone.position.y = -(size*2.3 + 2 - size)/2; cone.rotation.x = Math.PI; holo.add(cone);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hologram(null, w.color));
    holo.add(plane); plane.visible = false;
    if (opts.logoCanvas) opts.logoCanvas(w).then(cv => {
      if (!cv) return;
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      plane.material.uniforms.uTex.value = tex; const h = Math.max(3.2, size * 1.5); plane.scale.set(h * cv.width / cv.height, h, 1); plane.visible = true;
    });

    worldObjs.push({ w, group: g, body, holo, plane, pos, size });
  });

  /* ---------- the path between worlds (tour trajectory) ---------- */
  {
    const curve = new THREE.CatmullRomCurve3(worldObjs.map(o => o.pos.clone()));
    const pts = curve.getPoints(600);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineDashedMaterial({ color: 0x6ef2ff, dashSize: 1.6, gapSize: 2.4, transparent: true, opacity: .28 });
    const line = new THREE.Line(geo, m); line.computeLineDistances(); scene.add(line);
  }

  /* ---------- the ship ---------- */
  const ship = new THREE.Group(); scene.add(ship);
  const shipBody = new THREE.Group(); ship.add(shipBody);
  {
    const hull = new THREE.MeshStandardMaterial({ color: 0xdfe6f2, metalness: .7, roughness: .25, emissive: 0x111827 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1b2236, metalness: .6, roughness: .4 });
    const nose = new THREE.Mesh(new THREE.ConeGeometry(.55, 2.6, 6), hull); nose.rotation.x = Math.PI/2; nose.position.z = 1.1;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.55, .7, 1.8, 6), hull); body.rotation.x = Math.PI/2; body.position.z = -.9;
    const wingG = new THREE.BufferGeometry(); wingG.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0,0,.6, 2.6,0,-1.6, 0,0,-1.8, 0,0,.6, -2.6,0,-1.6, 0,0,-1.8]), 3)); wingG.computeVertexNormals();
    const wings = new THREE.Mesh(wingG, new THREE.MeshStandardMaterial({ color: 0x2a3550, metalness: .7, roughness: .35, side: THREE.DoubleSide, emissive: 0x0b1a33 }));
    const fin = new THREE.Mesh(new THREE.BoxGeometry(.08, .9, 1.1), dark); fin.position.set(0, .5, -1.4);
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(.38, 16, 16), new THREE.MeshBasicMaterial({ color: 0x6ef2ff })); cockpit.scale.set(1, .7, 1.6); cockpit.position.set(0, .35, .4);
    const stripeL = new THREE.Mesh(new THREE.BoxGeometry(1.8, .05, .12), new THREE.MeshBasicMaterial({ color: 0xffc46b })); stripeL.position.set(1.2, .03, -1.2); stripeL.rotation.y = -.7;
    const stripeR = stripeL.clone(); stripeR.position.x = -1.2; stripeR.rotation.y = .7;
    const engine = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x6ef2ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); engine.scale.set(3.2, 3.2, 1); engine.position.z = -2.2;
    const engine2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); engine2.scale.set(1.2, 1.2, 1); engine2.position.z = -2;
    shipBody.add(nose, body, wings, fin, cockpit, stripeL, stripeR, engine, engine2);
    shipBody.userData.engine = engine;
    ship.scale.setScalar(.75);
  }
  // engine trail
  const TRAIL = 70, trailPos = new Float32Array(TRAIL*3), trailCol = new Float32Array(TRAIL*3);
  const trailGeo = new THREE.BufferGeometry(); trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3)); trailGeo.setAttribute("color", new THREE.BufferAttribute(trailCol, 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(trail);
  const trailHist = [];

  /* teleport beam + shockwave */
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x9ff4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 60, 32, 1, true), beamMat); scene.add(beam);
  const beamCore = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, 60, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(beamCore);
  const shock = new THREE.Mesh(new THREE.RingGeometry(.8, 1, 64), new THREE.MeshBasicMaterial({ color: 0x9ff4ff, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); shock.rotation.x = -Math.PI/2; scene.add(shock);
  const flashSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(flashSprite);

  /* ---------- UFOs ---------- */
  const ufos = [];
  for (let k = 0; k < (mobile ? 2 : 4); k++) {
    const u = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 16), new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: .9, roughness: .25, emissive: 0x111111 })); disc.scale.y = .22;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.9, 24, 12, 0, TAU, 0, Math.PI/2), new THREE.MeshBasicMaterial({ color: 0x8dffb0, transparent: true, opacity: .8 })); dome.position.y = .3;
    u.add(disc, dome);
    const lights = [];
    for (let j = 0; j < 10; j++) { const l = new THREE.Mesh(new THREE.SphereGeometry(.13, 6, 6), new THREE.MeshBasicMaterial({ color: j % 2 ? 0xffd36b : 0x7dfcff })); const a = j/10*TAU; l.position.set(Math.cos(a)*2.05, 0, Math.sin(a)*2.05); u.add(l); lights.push(l); }
    const tractor = new THREE.Mesh(new THREE.ConeGeometry(2.4, 9, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0x8dffb0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); tractor.position.y = -4.6; u.add(tractor);
    u.userData = { lights, tractor, seed: Math.random()*100, r: 70 + k*45, speed: .05 + Math.random()*.04, y: 18 + Math.random()*30 };
    scene.add(u); ufos.push(u);
  }
  /* comets */
  const comets = [];
  for (let k = 0; k < 3; k++) {
    const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xcfe9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); c.scale.set(5, 5, 1);
    const tg = new THREE.BufferGeometry(); tg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    const tl = new THREE.Line(tg, new THREE.LineBasicMaterial({ color: 0xcfe9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
    scene.add(c, tl); comets.push({ c, tl, t: -Math.random()*8, from: new THREE.Vector3(), dir: new THREE.Vector3() });
  }

  /* ---------- hyperspace streaks ---------- */
  const STREAKS = Math.round(1600 * Q);
  const sPos = new Float32Array(STREAKS*6), sCol = new Float32Array(STREAKS*6), sData = [];
  for (let i = 0; i < STREAKS; i++) {
    const a = Math.random()*TAU, r = 3 + Math.random()*60; sData.push({ x: Math.cos(a)*r, y: Math.sin(a)*r, z: -Math.random()*900, s: .6 + Math.random() });
    const c = new THREE.Color().setHSL(.52 + Math.random()*.25, .8, .7);
    sCol.set([c.r*.2, c.g*.2, c.b*.2, c.r, c.g, c.b], i*6);
  }
  const streakGeo = new THREE.BufferGeometry(); streakGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3)); streakGeo.setAttribute("color", new THREE.BufferAttribute(sCol, 3));
  const streakMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const streaks = new THREE.LineSegments(streakGeo, streakMat); streaks.frustumCulled = false; camera.add(streaks); scene.add(camera);
  let warpPower = 0, warpTarget = 0;

  /* ---------- skill-link lines ---------- */
  const linkGroup = new THREE.Group(); scene.add(linkGroup);
  let linkLine = null, linkProg = 0;
  function showLink(ids) {
    linkGroup.clear(); linkLine = null;
    if (!ids) return;
    const objs = ids.map(id => worldObjs.find(o => o.w.id === id)).filter(Boolean);
    // order by nearest neighbour so the line reads as a constellation
    const left = objs.slice(1), ordered = [objs[0]];
    while (left.length) { const p = ordered[ordered.length-1].pos; let bi = 0, bd = Infinity; left.forEach((o, i) => { const d = o.pos.distanceToSquared(p); if (d < bd) { bd = d; bi = i; } }); ordered.push(left.splice(bi, 1)[0]); }
    const pts = []; ordered.forEach(o => pts.push(o.pos.clone().add(new THREE.Vector3(0, o.size*.2, 0))));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", .2);
    const geo = new THREE.TubeGeometry(curve, 240, .32, 6, false);
    linkLine = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffc46b, transparent: true, opacity: .95, blending: THREE.AdditiveBlending, depthWrite: false }));
    linkLine.geometry.setDrawRange(0, 0); linkGroup.add(linkLine); linkProg = 0;
    ordered.forEach(o => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffd38a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); s.scale.setScalar(o.size*5); s.position.copy(o.pos); linkGroup.add(s); });
  }

  /* ---------- camera rig ---------- */
  const camPos = camera.position.clone(), camLook = new THREE.Vector3();
  const cam = { from: camPos.clone(), to: camPos.clone(), lookFrom: new THREE.Vector3(), lookTo: new THREE.Vector3(), t: 1, dur: 1, arc: 0 };
  const OVERVIEW = { pos: new THREE.Vector3(0, 175, 285), look: new THREE.Vector3(0, -10, 0) };
  let mode = "intro", focus = -1, mouse = { x: 0, y: 0 }, orbitA = 0;
  function frameFor(i) {
    const o = worldObjs[i]; const out = o.pos.clone().setY(0).normalize();
    const side = new THREE.Vector3(-out.z, 0, out.x);
    const dist = o.size * (mobile ? 7.5 : 6.2) + 9;
    const pos = o.pos.clone().add(out.multiplyScalar(dist*.55)).add(side.multiplyScalar(dist*.75)).add(new THREE.Vector3(0, dist*.42, 0));
    const look = o.pos.clone().add(new THREE.Vector3(0, o.size*.6, 0));
    if (!mobile) { const right = new THREE.Vector3().subVectors(pos, look).cross(new THREE.Vector3(0,1,0)).normalize(); look.add(right.multiplyScalar(-o.size*1.6)); }
    else look.y -= o.size*1.6;
    return { pos, look };
  }
  function moveCam(pos, look, dur, arc = 0) {
    cam.from.copy(camera.position); cam.lookFrom.copy(camLook); cam.to.copy(pos); cam.lookTo.copy(look); cam.t = 0; cam.dur = reduce ? .01 : dur; cam.arc = arc;
  }

  /* ship state */
  const shipState = { at: -1, tele: null, idleA: 0 };
  function shipAnchor(i, a) {
    const o = worldObjs[i]; const r = o.size * 2.6 + 2;
    return new THREE.Vector3(o.pos.x + Math.cos(a)*r, o.pos.y + o.size*.6 + Math.sin(a*2)*.6, o.pos.z + Math.sin(a)*r);
  }

  /* ---------- public API ---------- */
  const api = {
    worldObjs,
    intro(onDone) {
      if (reduce) { api.skipIntro(); onDone && onDone(); return; }
      mode = "warp"; warpTarget = 1.15;
      camera.position.set(0, 60, 900); camLook.set(0, 0, 0); cam.t = 1;
      setTimeout(() => { warpTarget = 0; moveCam(OVERVIEW.pos, OVERVIEW.look, 3.4, 60); mode = "overview"; }, 1700);
      setTimeout(() => { if (shipState.at < 0) { shipState.at = 0; ship.position.copy(shipAnchor(0, 0)); } }, 3000);
      setTimeout(() => onDone && onDone(), 4300);
    },
    skipIntro() { warpTarget = 0; warpPower = 0; camera.position.copy(OVERVIEW.pos); camLook.copy(OVERVIEW.look); cam.t = 1; cam.to.copy(OVERVIEW.pos); cam.lookTo.copy(OVERVIEW.look); mode = "overview"; if (shipState.at < 0) { shipState.at = 0; ship.position.copy(shipAnchor(0, 0)); } },
    overview() { focus = -1; mode = "overview"; moveCam(OVERVIEW.pos, OVERVIEW.look, 2.2, 10); },
    focus(i, onArrive) {
      const from = shipState.at;
      focus = i; mode = "focus";
      const f = frameFor(i);
      const far = from < 0 || worldObjs[from].pos.distanceTo(worldObjs[i].pos) > 25;
      if (from < 0) { shipState.at = i; ship.position.copy(shipAnchor(i, 0)); moveCam(f.pos, f.look, 2.2, 14); setTimeout(() => onArrive && onArrive(), reduce ? 0 : 1400); return; }
      if (from === i) { moveCam(f.pos, f.look, 1.2, 0); onArrive && onArrive(); return; }
      // teleport: beam out, warp, beam in
      shipState.tele = { t: 0, from: ship.position.clone(), to: i, phase: 0 };
      if (opts.onWarp) opts.onWarp();
      if (far) { warpTarget = .55; setTimeout(() => warpTarget = 0, reduce ? 0 : 900); }
      moveCam(f.pos, f.look, far ? 2.0 : 1.4, far ? 26 : 6);
      setTimeout(() => onArrive && onArrive(), reduce ? 0 : (far ? 1500 : 1000));
    },
    showLink,
    pick(clientX, clientY) {
      const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(clientX / innerWidth * 2 - 1, -(clientY / innerHeight) * 2 + 1), camera);
      const hits = ray.intersectObjects(worldObjs.map(o => o.body), false);
      return hits.length ? hits[0].object.userData.worldIndex : -1;
    },
    project(i) {
      const o = worldObjs[i]; const v = o.pos.clone().add(new THREE.Vector3(0, -o.size*1.35 - 1, 0)).project(camera);
      return { x: (v.x + 1)/2 * innerWidth, y: (1 - v.y)/2 * innerHeight, visible: v.z < 1 && v.z > -1, dist: camera.position.distanceTo(o.pos) };
    },
    setMouse(x, y) { mouse.x = x; mouse.y = y; },
    resize() {
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight, false); composer.setSize(innerWidth, innerHeight);
    },
    get mode() { return mode; }
  };

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  const tmpV = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  function tick() {
    const dt = Math.min(opts.maxDt || .05, clock.getDelta()), T = clock.elapsedTime;
    scene.userData.bgStars.uniforms.uTime.value = T;
    galaxy.rotation.y += dt * (reduce ? 0 : .012);
    { const d = camera.position.length(); const k = Math.min(1, Math.max(.12, (d - 40) / 260)); scene.userData.cores[0].material.opacity = .7 * k; scene.userData.cores[1].material.opacity = k; }

    // warp streaks
    warpPower += (warpTarget - warpPower) * Math.min(1, dt * 3.2);
    streakMat.opacity = Math.min(1, warpPower * 1.4);
    if (warpPower > .01) {
      const speed = 900 * warpPower, len = 4 + 140 * warpPower;
      for (let i = 0; i < STREAKS; i++) { const d = sData[i]; d.z += speed * dt * d.s; if (d.z > -2) d.z = -900; sPos.set([d.x, d.y, d.z - len*d.s, d.x, d.y, d.z], i*6); }
      streakGeo.attributes.position.needsUpdate = true;
    }
    camera.fov = 55 + warpPower * 32; camera.updateProjectionMatrix();
    bloom.strength = .95 + warpPower * 1.1;

    // camera
    if (cam.t < 1) {
      cam.t = Math.min(1, cam.t + dt / cam.dur); const k = ease(cam.t);
      camera.position.lerpVectors(cam.from, cam.to, k); camera.position.y += Math.sin(k * Math.PI) * cam.arc;
      camLook.lerpVectors(cam.lookFrom, cam.lookTo, k);
    } else if (mode === "overview" && !reduce) {
      orbitA += dt * .02;
      tmpV.set(OVERVIEW.pos.x + Math.sin(orbitA)*30 + mouse.x*24, OVERVIEW.pos.y + mouse.y*-14, OVERVIEW.pos.z + Math.cos(orbitA)*12 - 12);
      camera.position.lerp(tmpV, dt * .8);
    } else if (mode === "focus" && !reduce && focus >= 0) {
      const f = frameFor(focus); tmpV.copy(f.pos).add(new THREE.Vector3(mouse.x*2.2, -mouse.y*1.4, 0)); camera.position.lerp(tmpV, dt * 1.5);
    }
    camera.lookAt(camLook);

    // worlds
    worldObjs.forEach((o, i) => {
      o.body.rotation.y += dt * .18;
      if (o.body.material.uniforms) o.body.material.uniforms.uTime.value = T;
      if (o.group.userData.spin) o.group.userData.spin.rotation.y += dt * .35;
      if (o.group.userData.rings) o.group.userData.rings.forEach(r => { const p = (T*.45 + r.userData.phase) % 1; r.scale.setScalar(.3 + p*3.2); r.material.opacity = (1 - p) * .9; r.lookAt(camera.position); });
      if (o.group.userData.flow) { const f = o.group.userData.flow, arr = f.pts.attributes.position.array; for (let k = 0; k < f.n; k++) { f.curve.getPoint(((T*.08) + k/f.n) % 1, tmpV); arr.set([tmpV.x, tmpV.y, tmpV.z], k*3); } f.pts.attributes.position.needsUpdate = true; }
      o.plane.lookAt(camera.position);
      const on = (focus === i ? 1 : (mode === "focus" ? .25 : .6));
      o.plane.material.uniforms.uTime.value = T + i;
      o.plane.material.uniforms.uOn.value += (on - o.plane.material.uniforms.uOn.value) * Math.min(1, dt*4);
      o.holo.position.y = o.size*2.3 + 2 + Math.sin(T*1.3 + i)*.35;
    });

    // ship
    shipState.idleA += dt * .35;
    const tele = shipState.tele;
    if (tele) {
      tele.t += dt / (reduce ? .01 : 1.15);
      const k = Math.min(1, tele.t);
      if (k < .45) { // beam out
        const p = k / .45; beam.position.copy(tele.from); beamCore.position.copy(tele.from);
        beamMat.opacity = Math.sin(p * Math.PI) * .45; beamCore.material.opacity = Math.sin(p*Math.PI) * .9;
        shipBody.scale.set(1 - p*.9, 1 + p*3, 1 - p*.9); shipBody.position.y = p * 4;
        if (p > .9) { flashSprite.position.copy(tele.from); flashSprite.material.opacity = 1; flashSprite.scale.setScalar(14); }
      } else { // beam in at destination
        if (tele.phase === 0) { tele.phase = 1; shipState.at = tele.to; ship.position.copy(shipAnchor(tele.to, shipState.idleA)); shock.position.copy(ship.position); }
        const p = (k - .45) / .55; beam.position.copy(ship.position); beamCore.position.copy(ship.position);
        beamMat.opacity = Math.sin(p * Math.PI) * .45; beamCore.material.opacity = Math.sin(p*Math.PI)*.9;
        shipBody.scale.set(.1 + p*.9, 4 - p*3, .1 + p*.9); shipBody.position.y = (1-p) * 4;
        shock.material.opacity = (1 - p) * .9; shock.scale.setScalar(1 + p * 16);
        if (p < .15) { flashSprite.position.copy(ship.position); flashSprite.material.opacity = 1 - p*6; flashSprite.scale.setScalar(16); }
      }
      if (k >= 1) { shipState.tele = null; shipBody.scale.set(1,1,1); shipBody.position.y = 0; beamMat.opacity = 0; beamCore.material.opacity = 0; shock.material.opacity = 0; }
    } else if (shipState.at >= 0) {
      const target = shipAnchor(shipState.at, shipState.idleA);
      tmpV.copy(target).sub(ship.position);
      ship.position.lerp(target, Math.min(1, dt * 2));
      const ahead = shipAnchor(shipState.at, shipState.idleA + .15);
      ship.lookAt(ahead);
      shipBody.rotation.z = Math.sin(T*1.2) * .18;
    }
    flashSprite.material.opacity *= .9;
    shipBody.userData.engine.scale.setScalar(2.8 + Math.sin(T*30)*.4);
    // trail
    ship.updateMatrixWorld(); const tail = new THREE.Vector3(0, 0, -2.2).applyMatrix4(shipBody.matrixWorld);
    trailHist.unshift(tail.clone()); if (trailHist.length > TRAIL) trailHist.pop();
    for (let k = 0; k < TRAIL; k++) { const p = trailHist[Math.min(k, trailHist.length-1)] || tail; trailPos.set([p.x, p.y, p.z], k*3); const f = (1 - k/TRAIL) * (tele ? 0 : 1); trailCol.set([.43*f, .95*f, 1*f], k*3); }
    trailGeo.attributes.position.needsUpdate = true; trailGeo.attributes.color.needsUpdate = true;
    ship.visible = shipState.at >= 0;
    trail.visible = ship.visible;

    // UFOs
    ufos.forEach((u, k) => {
      const d = u.userData, a = T * d.speed + d.seed;
      u.position.set(Math.cos(a) * d.r, d.y + Math.sin(T*.6 + d.seed)*4, Math.sin(a*1.3) * d.r * .8);
      u.rotation.y += dt * 1.4; u.rotation.z = Math.sin(T + d.seed) * .12;
      d.lights.forEach((l, j) => l.material.color.setHex(((Math.floor(T*6) + j) % 3 === 0) ? 0xffffff : (j % 2 ? 0xffd36b : 0x7dfcff)));
      const beamOn = Math.sin(T*.35 + d.seed*3) > .82; d.tractor.material.opacity += ((beamOn ? .22 : 0) - d.tractor.material.opacity) * dt * 3;
    });
    // comets
    comets.forEach(c => {
      c.t += dt;
      if (c.t > 0 && c.t < 3.2) {
        if (!c.live) { c.live = true; c.from.set((Math.random()-.5)*600, 80 + Math.random()*120, -200 - Math.random()*300); c.dir.set((Math.random()-.5)*2, -.35, 1).normalize().multiplyScalar(160 + Math.random()*120); }
        const p = c.from.clone().addScaledVector(c.dir, c.t); c.c.position.copy(p);
        const tailP = p.clone().addScaledVector(c.dir, -.18);
        c.tl.geometry.attributes.position.array.set([p.x, p.y, p.z, tailP.x, tailP.y, tailP.z]); c.tl.geometry.attributes.position.needsUpdate = true;
        const o = Math.sin(c.t / 3.2 * Math.PI); c.c.material.opacity = o; c.tl.material.opacity = o * .8;
      } else if (c.t >= 3.2) { c.live = false; c.t = -4 - Math.random()*10; c.c.material.opacity = 0; c.tl.material.opacity = 0; }
    });
    // link line draw-in
    if (linkLine) { linkProg = Math.min(1, linkProg + dt / (reduce ? .01 : 1.4)); linkLine.geometry.setDrawRange(0, Math.floor(linkLine.geometry.index.count * linkProg / 6) * 6); }

    composer.render();
    if (opts.onFrame) opts.onFrame();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return api;
}
