import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const CONFIG = {
  speedMultiplier: 1.15,
  neon: "#00ff55",
  minCount: 1200,
  baseCount: 2000,
  maxCount: 3600,
  worldHeight: 110,
  worldWidthBase: 170,
  depthRange: 80,
  trailAlpha: 0.14,
  pixelRatioCap: 1.5,
  flickerStrength: 0.2,
};

function createDigitTexture(digit) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 128, 128);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 92px monospace";

  ctx.shadowColor = "rgba(0,255,100,0.95)";
  ctx.shadowBlur = 26;
  ctx.fillStyle = "rgba(0,255,100,0.35)";
  ctx.fillText(digit, 64, 64);

  ctx.shadowBlur = 12;
  ctx.fillStyle = "rgba(130,255,180,0.65)";
  ctx.fillText(digit, 64, 64);

  ctx.shadowBlur = 4;
  ctx.fillStyle = "rgba(230,255,230,1)";
  ctx.fillText(digit, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return texture;
}

function createColumns(width, spacing = 2.1) {
  const cols = [];
  for (let x = -width * 0.5; x <= width * 0.5; x += spacing) {
    cols.push(x + (Math.random() - 0.5) * 0.7);
  }
  return cols;
}

function getParticleCount() {
  const area = window.innerWidth * window.innerHeight;
  const scaled = Math.round((area / (1920 * 1080)) * CONFIG.baseCount);
  return Math.max(CONFIG.minCount, Math.min(CONFIG.maxCount, scaled));
}

function fillParticles(positions, speeds, sizes, alphas, phases, columns, worldWidth) {
  for (let i = 0; i < speeds.length; i++) {
    const i3 = i * 3;
    positions[i3] = columns[(Math.random() * columns.length) | 0] ?? (Math.random() - 0.5) * worldWidth;
    positions[i3 + 1] = (Math.random() - 0.5) * CONFIG.worldHeight;
    positions[i3 + 2] = (Math.random() - 0.5) * CONFIG.depthRange;

    speeds[i] = 8 + Math.random() * 24;
    sizes[i] = 10 + Math.random() * 12;
    alphas[i] = 0.35 + Math.random() * 0.65;
    phases[i] = Math.random() * Math.PI * 2;
  }
}

function MatrixRainBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CONFIG.pixelRatioCap));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.z = 120;

    const fadeScene = new THREE.Scene();
    const fadeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fadeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: CONFIG.trailAlpha,
      depthTest: false,
      depthWrite: false,
    });
    const fadeQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fadeMaterial);
    fadeScene.add(fadeQuad);

    let worldWidth = CONFIG.worldWidthBase * (window.innerWidth / Math.max(window.innerHeight, 1));
    let columns = createColumns(worldWidth);

    const count = getParticleCount();
    const half = Math.floor(count / 2);

    const pos0 = new Float32Array(half * 3);
    const speed0 = new Float32Array(half);
    const size0 = new Float32Array(half);
    const alpha0 = new Float32Array(half);
    const phase0 = new Float32Array(half);

    const pos1 = new Float32Array((count - half) * 3);
    const speed1 = new Float32Array(count - half);
    const size1 = new Float32Array(count - half);
    const alpha1 = new Float32Array(count - half);
    const phase1 = new Float32Array(count - half);

    fillParticles(pos0, speed0, size0, alpha0, phase0, columns, worldWidth);
    fillParticles(pos1, speed1, size1, alpha1, phase1, columns, worldWidth);

    const geo0 = new THREE.BufferGeometry();
    geo0.setAttribute("position", new THREE.BufferAttribute(pos0, 3));
    geo0.setAttribute("aSize", new THREE.BufferAttribute(size0, 1));
    geo0.setAttribute("aAlpha", new THREE.BufferAttribute(alpha0, 1));
    geo0.setAttribute("aPhase", new THREE.BufferAttribute(phase0, 1));

    const geo1 = new THREE.BufferGeometry();
    geo1.setAttribute("position", new THREE.BufferAttribute(pos1, 3));
    geo1.setAttribute("aSize", new THREE.BufferAttribute(size1, 1));
    geo1.setAttribute("aAlpha", new THREE.BufferAttribute(alpha1, 1));
    geo1.setAttribute("aPhase", new THREE.BufferAttribute(phase1, 1));

    const baseUniforms = {
      uColor: { value: new THREE.Color(CONFIG.neon) },
      uTime: { value: 0 },
      uFlicker: { value: CONFIG.flickerStrength },
      uMap: { value: null },
    };

    const vertexShader = `
      attribute float aSize;
      attribute float aAlpha;
      attribute float aPhase;

      varying float vAlpha;
      varying float vPhase;

      void main() {
        vAlpha = aAlpha;
        vPhase = aPhase;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (125.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D uMap;
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uFlicker;

      varying float vAlpha;
      varying float vPhase;

      void main() {
        vec2 uv = gl_PointCoord;
        vec4 tex = texture2D(uMap, uv);

        float flicker = 1.0 + sin(uTime * 8.0 + vPhase) * uFlicker;
        float alpha = tex.a * vAlpha * flicker;

        if (alpha < 0.01) {
          discard;
        }

        vec3 color = mix(uColor * 0.75, vec3(0.92, 1.0, 0.92), tex.r);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const tex0 = createDigitTexture("0");
    const tex1 = createDigitTexture("1");

    const mat0 = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { ...baseUniforms, uMap: { value: tex0 } },
      vertexShader,
      fragmentShader,
    });

    const mat1 = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { ...baseUniforms, uMap: { value: tex1 } },
      vertexShader,
      fragmentShader,
    });

    const points0 = new THREE.Points(geo0, mat0);
    const points1 = new THREE.Points(geo1, mat1);

    scene.add(points0);
    scene.add(points1);

    const clock = new THREE.Clock();
    let rafId = 0;

    const updateGroup = (positions, speeds) => {
      const halfHeight = CONFIG.worldHeight * 0.5;
      for (let i = 0; i < speeds.length; i++) {
        const i3 = i * 3;
        positions[i3 + 1] -= speeds[i] * clock.getDelta() * CONFIG.speedMultiplier;

        if (positions[i3 + 1] < -halfHeight - 12) {
          positions[i3] = columns[(Math.random() * columns.length) | 0] ?? (Math.random() - 0.5) * worldWidth;
          positions[i3 + 1] = halfHeight + Math.random() * 22;
          positions[i3 + 2] = (Math.random() - 0.5) * CONFIG.depthRange;
          speeds[i] = 8 + Math.random() * 24;
        }
      }
    };

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.033);
      mat0.uniforms.uTime.value += dt;
      mat1.uniforms.uTime.value += dt;

      const halfHeight = CONFIG.worldHeight * 0.5;

      for (let i = 0; i < speed0.length; i++) {
        const i3 = i * 3;
        pos0[i3 + 1] -= speed0[i] * dt * CONFIG.speedMultiplier;
        if (pos0[i3 + 1] < -halfHeight - 12) {
          pos0[i3] = columns[(Math.random() * columns.length) | 0] ?? (Math.random() - 0.5) * worldWidth;
          pos0[i3 + 1] = halfHeight + Math.random() * 22;
          pos0[i3 + 2] = (Math.random() - 0.5) * CONFIG.depthRange;
          speed0[i] = 8 + Math.random() * 24;
        }
      }

      for (let i = 0; i < speed1.length; i++) {
        const i3 = i * 3;
        pos1[i3 + 1] -= speed1[i] * dt * CONFIG.speedMultiplier;
        if (pos1[i3 + 1] < -halfHeight - 12) {
          pos1[i3] = columns[(Math.random() * columns.length) | 0] ?? (Math.random() - 0.5) * worldWidth;
          pos1[i3 + 1] = halfHeight + Math.random() * 22;
          pos1[i3 + 2] = (Math.random() - 0.5) * CONFIG.depthRange;
          speed1[i] = 8 + Math.random() * 24;
        }
      }

      geo0.attributes.position.needsUpdate = true;
      geo1.attributes.position.needsUpdate = true;

      renderer.render(fadeScene, fadeCamera);
      renderer.render(scene, camera);
    };

    const onResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CONFIG.pixelRatioCap));
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      worldWidth = CONFIG.worldWidthBase * camera.aspect;
      columns = createColumns(worldWidth);
    };

    window.addEventListener("resize", onResize, { passive: true });

    renderer.setClearColor(0x000000, 1);
    renderer.clear(true, true, true);
    onResize();
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);

      geo0.dispose();
      geo1.dispose();
      mat0.dispose();
      mat1.dispose();
      tex0?.dispose();
      tex1?.dispose();
      fadeMaterial.dispose();
      fadeQuad.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full pointer-events-none" aria-hidden="true" />;
}

export default MatrixRainBackground;
