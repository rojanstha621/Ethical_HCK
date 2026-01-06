import React, { useRef, useEffect } from "react";

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
  );
};

export default MatrixBackground;
