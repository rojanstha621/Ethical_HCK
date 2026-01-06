import React, { useRef, useEffect } from "react";
import { AiFillBug } from "react-icons/ai";


// Customizable variables
const DEFAULTS = {
  digitColor: "#00ff99",
  glowColor: "#00ff99",
  backgroundColor: "#0a0f14",
  fontSize: 22,
  columns: 150, // number of columns for spacing
  minSpeed: 120,
  maxSpeed: 260,
  minDepth: 0.4,
  maxDepth: 1.0,
  glowStrength: 16,
  cameraMotion: 18,
  cameraSpeed: 0.08,
  mobileColumns: 16,
};

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createParticle(col, colWidth, height, opts) {
  const depth = randomBetween(opts.minDepth, opts.maxDepth);
  return {
    col,
    x: col * colWidth + colWidth / 2,
    y: randomBetween(-height, height),
    z: depth,
    speed: randomBetween(opts.minSpeed, opts.maxSpeed) * depth,
    char: Math.random() > 0.5 ? "1" : "0",
    fontSize: opts.fontSize * (0.7 + 0.6 * depth),
    alpha: 0.45 + 0.55 * depth,
    drift: randomBetween(-colWidth * 0.15, colWidth * 0.15) * depth,
  };
}

const MatrixBackground = ({
  digitColor = DEFAULTS.digitColor,
  glowColor = DEFAULTS.glowColor,
  backgroundColor = DEFAULTS.backgroundColor,
  fontSize = DEFAULTS.fontSize,
  columns = DEFAULTS.columns,
  minSpeed = DEFAULTS.minSpeed,
  maxSpeed = DEFAULTS.maxSpeed,
  minDepth = DEFAULTS.minDepth,
  maxDepth = DEFAULTS.maxDepth,
  glowStrength = DEFAULTS.glowStrength,
  cameraMotion = DEFAULTS.cameraMotion,
  cameraSpeed = DEFAULTS.cameraSpeed,
  mobileColumns = DEFAULTS.mobileColumns,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const sizeRef = useRef({ width: 0, height: 0, colWidth: 0, colCount: 0 });

  // Cyber Bug State
  const bugRef = useRef({
    active: false,
    x: 0,
    y: 0,
    z: 0,
    life: 0,
    timer: 3, // Initial safe delay before first bug
    nextDelay: 0
  });

  const bugDomRef = useRef(null);



  // Responsive resize
  useEffect(() => {
    function handleResize() {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 700;
      const colCount = isMobile ? mobileColumns : columns;
      const colWidth = width / colCount;
      sizeRef.current = { width, height, dpr, colWidth, colCount };
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
      }
      // One particle per column, but with random y and depth
      particlesRef.current = Array.from({ length: colCount }, (_, i) =>
        createParticle(i, colWidth, height, {
          fontSize,
          minSpeed,
          maxSpeed,
          minDepth,
          maxDepth,
        })
      );
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fontSize, minSpeed, maxSpeed, minDepth, maxDepth, columns, mobileColumns]);

  // Animation loop
  useEffect(() => {
    let lastTime = performance.now();

    function animate(now) {
      const { width, height, dpr, colWidth, colCount } = sizeRef.current;
      const ctx = canvasRef.current.getContext("2d");
      let dt = (now - lastTime) / 1000;
      dt = Math.max(0.008, Math.min(dt, 0.022));
      lastTime = now;

      // Camera subtle motion
      const camX = Math.sin(now * 0.001 * cameraSpeed * 2 * Math.PI) * cameraMotion;
      const camY = Math.cos(now * 0.001 * cameraSpeed * 2 * Math.PI) * cameraMotion * 0.5;

      // Clear background with a soft fade for trailing effect
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width * dpr, height * dpr);
      ctx.globalAlpha = 1;

      // Draw particles
      for (let p of particlesRef.current) {
        // Update position
        p.y += p.speed * dt;
        p.x += p.drift * dt * 0.2;

        // Parallax/camera
        const px = (p.x + camX * (1 - p.z)) * dpr;
        const py = (p.y + camY * (1 - p.z)) * dpr;

        // Loop particle to top if out of bounds
        if (p.y > height + 40) {
          p.y = randomBetween(-40, -10);
          p.z = randomBetween(minDepth, maxDepth);
          p.speed = randomBetween(minSpeed, maxSpeed) * p.z;
          p.char = Math.random() > 0.5 ? "1" : "0";
          p.fontSize = fontSize * (0.7 + 0.6 * p.z);
          p.alpha = 0.45 + 0.55 * p.z;
          p.drift = randomBetween(-colWidth * 0.15, colWidth * 0.15) * p.z;
        }

        // Draw digit with glow
        ctx.save();
        ctx.font = `bold ${p.fontSize * dpr}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowStrength * p.z * dpr;
        ctx.fillStyle = digitColor;
        ctx.fillText(p.char, px, py);
        ctx.restore();
      }

      // --- CYBER BUG ANIMATION (DOM SYNC) ---
      const bug = bugRef.current;
      const bugEl = bugDomRef.current;

      bug.timer -= dt;

      // Spawn logic
      if (!bug.active && bug.timer <= 0) {
        bug.active = true;
        bug.life = 0; // Tracks active time
        bug.x = randomBetween(0, width);
        bug.y = -50; // Start above screen
        bug.z = randomBetween(minDepth, maxDepth);
        bug.speed = randomBetween(minSpeed, maxSpeed) * 1.5; // Fall faster than rain
        bug.nextDelay = randomBetween(3, 8);
      }

      if (bug.active && bugEl) {
        bug.life += dt;

        // 1. Logic: Fall Down naturally
        bug.y += bug.speed * dt * bug.z;
        bug.x += randomBetween(-0.5, 0.5) * bug.z; // Slight organic drift

        // 2. Glitch Effect (First 0.4s)
        let offsetX = 0;
        let opacity = 1;
        let scaleJitter = 1;

        if (bug.life < 0.4) {
          // Rapid random placement or opacity flicker
          if (Math.random() > 0.5) opacity = 0.4;
          if (Math.random() > 0.7) offsetX = randomBetween(-10, 10);
          if (Math.random() > 0.7) scaleJitter = 1.2;
        }

        // 3. Project to Screen (Parallax)
        const px = (bug.x + camX * (1 - bug.z)); // DOM handles scaling, so no dpr here for position if using pixels? 
        // Wait, 'width' is window.innerWidth. termPx uses dpr for Canvas. 
        // DOM elements use CSS pixels. So do NOT multiply by dpr for CSS transform.
        const py = (bug.y + camY * (1 - bug.z));

        // 4. Update DOM
        const depthScale = (0.5 + 0.5 * bug.z) * scaleJitter;
        bugEl.style.transform = `translate3d(${px + offsetX}px, ${py}px, 0) scale(${depthScale})`;
        bugEl.style.opacity = opacity;

        // Despawn check
        if (bug.y > height + 50) {
          bug.active = false;
          bugEl.style.opacity = 0;
          bug.timer = bug.nextDelay;
        }
      } else if (bugEl) {
        bugEl.style.opacity = 0;
      }



      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [
    digitColor,
    glowColor,
    backgroundColor,
    fontSize,
    columns,
    minSpeed,
    maxSpeed,
    minDepth,
    maxDepth,
    glowStrength,
    cameraMotion,
    cameraSpeed,
    mobileColumns,
  ]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
          touchAction: "none",
          background: "transparent",
        }}
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Cyber Bug Overlay */}
      <div
        ref={bugDomRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 1, // Above canvas, below content
          opacity: 0, // Hidden by default
          color: "#ff0033",
          filter: "drop-shadow(0 0 8px #ff0033) drop-shadow(0 0 15px #f00)",
          willChange: "transform, opacity",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <AiFillBug size={32} />
      </div>
    </>
  );
};

export default MatrixBackground;

