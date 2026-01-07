import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';

const HeroAnimation3D = () => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const textMeshesRef = useRef([]);
    const rotationRef = useRef(0);
    const isAnimatingRef = useRef(false);

    // Text reads correctly when placed on orbit
    const orbitText = "  5 2 0 2  -  r a e Y   e h t   f o   y t i n u m m o C ";

    // Configuration - centered orbit around title
    const config = useMemo(() => ({
        orbitRadiusX: 80,      // Horizontal radius (wider)
        orbitRadiusY: 0,       // Vertical radius (flatter ellipse)
        orbitOffsetY: 90,        // Center vertically with title
        orbitTilt: 0,          // Tilt angle in degrees (like Paramount)
        rotationSpeed: 0.01,    // Very slow cinematic rotation
        textColor: '#ffffff',
        glowColor: '#FF0000',
    }), []);

    // Create text sprite for each character
    const createTextSprite = useCallback((char) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = 64;
        canvas.height = 64;

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.font = `bold 40px 'Inter', 'Segoe UI', Arial, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Glow effect
        context.shadowColor = config.glowColor;
        context.shadowBlur = 12;
        context.fillStyle = config.glowColor;
        context.globalAlpha = 0.3;
        context.fillText(char, canvas.width / 2, canvas.height / 2);

        context.globalAlpha = 1;
        context.shadowBlur = 6;
        context.fillStyle = config.textColor;
        context.fillText(char, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(24, 24, 1);

        return sprite;
    }, [config]);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera - orthographic-like perspective for centered view
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
        camera.position.set(0, 0, 400);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create text sprites
        const chars = orbitText.split('');
        const meshes = [];

        chars.forEach((char) => {
            const sprite = createTextSprite(char);
            scene.add(sprite);
            meshes.push(sprite);
        });

        textMeshesRef.current = meshes;
        isAnimatingRef.current = true;

        // Animation function
        let lastTime = performance.now();
        const tiltRad = (config.orbitTilt * Math.PI) / 180;

        const animate = () => {
            if (!isAnimatingRef.current) return;

            const currentTime = performance.now();
            const delta = currentTime - lastTime;
            lastTime = currentTime;

            // Update rotation - extremely slow cinematic speed
            // Full rotation takes about 2-3 minutes
            rotationRef.current += 0.0003 * delta;

            const total = meshes.length;
            const radiusX = config.orbitRadiusX;
            const radiusY = config.orbitRadiusY;

            for (let i = 0; i < total; i++) {
                const sprite = meshes[i];

                // Very tight spacing: all characters in ~60 degree arc
                const angleStep = 0.08; // Small fixed step = tight letters
                const angle = rotationRef.current + (i * angleStep);

                // Elliptical orbit
                const x = Math.cos(angle) * radiusX;
                const baseZ = Math.sin(angle) * radiusX * 0.5; // Depth

                // Apply tilt to create Paramount-style angle
                const y = Math.sin(angle) * radiusY + baseZ * Math.sin(tiltRad);
                const z = baseZ * Math.cos(tiltRad);

                sprite.position.set(x, y + config.orbitOffsetY, z);

                // TUNNEL EFFECT: Only show characters in the FRONT arc (positive Z)
                // Characters with negative Z (behind center) are hidden
                const isFront = z > -5; // Small threshold for smooth transition

                if (isFront) {
                    // Perspective effects for visible characters
                    const maxZ = radiusX * 0.5;
                    const normalizedZ = (z + maxZ) / (maxZ * 2); // 0 = edge, 1 = front center

                    // Scale: larger when more in front
                    const baseScale = 24;
                    const scale = baseScale * (0.6 + normalizedZ * 0.6);
                    sprite.scale.set(scale, scale, 1);

                    // Smooth fade at edges (appearing from right, disappearing to left)
                    const edgeFade = Math.min(1, (z + 10) / 20); // Fade in/out at edges
                    sprite.material.opacity = 0.3 + edgeFade * 0.7;
                    sprite.material.color.setHex(0xffffff);
                } else {
                    // Hide characters that are behind (in the tunnel)
                    sprite.material.opacity = 0;
                }
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        // Start animation
        requestAnimationFrame(animate);

        // Handle resize
        const handleResize = () => {
            if (!container) return;
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            isAnimatingRef.current = false;
            window.removeEventListener('resize', handleResize);

            if (container && renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            renderer.dispose();
            meshes.forEach(mesh => {
                mesh.material.map?.dispose();
                mesh.material.dispose();
            });
        };
    }, [config, createTextSprite, orbitText]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 5 }}
        />
    );
};

export default HeroAnimation3D;
