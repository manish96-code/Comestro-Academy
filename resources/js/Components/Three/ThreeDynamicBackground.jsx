import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeDynamicBackground:
 * An elegant, neat, high-performance 3D ambient background for Comestro Academy.
 * Features:
 * - Fluid undulating cybernetic wave grid (Horizon Matrix)
 * - Soft glowing atmospheric quantum particles with procedural radial gradients
 * - Responsive cursor parallax with smooth inertia damping
 * - Scroll-reactive camera depth shift
 * - Seamless theme adaptation (Midnight Dark & Crisp Modern Light)
 * - 60+ FPS lightweight optimization with zero layout interference
 */
export default function ThreeDynamicBackground({ theme = 'light' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId;
        let isVisible = true;
        const isDark = theme === 'dark';

        // --- 1. Scene & Depth Fog ---
        const scene = new THREE.Scene();
        // Fog matches the exact page background color to create infinite seamless falloff
        const fogColor = isDark ? 0x090d16 : 0xffffff;
        scene.fog = new THREE.FogExp2(fogColor, 0.032);

        // --- 2. Camera Setup ---
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
        camera.position.set(0, 3.8, 14);
        camera.lookAt(0, -0.8, 0);

        // --- 3. High Performance Renderer ---
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
        });
        const isMobile = window.innerWidth < 768;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // --- 4. Procedural Glowing Particle Sprites ---
        const createParticleSprite = (stop0, stop1, stop2) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            grad.addColorStop(0, stop0);
            grad.addColorStop(0.35, stop1);
            grad.addColorStop(1, stop2);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 64);
            const tex = new THREE.CanvasTexture(canvas);
            tex.needsUpdate = true;
            return tex;
        };

        // Dark mode: vibrant cyan & electric indigo glow
        // Light mode: clean royal blue & soft slate glow
        const waveSprite = isDark
            ? createParticleSprite('rgba(56, 189, 248, 1.0)', 'rgba(14, 165, 233, 0.45)', 'rgba(9, 13, 22, 0)')
            : createParticleSprite('rgba(37, 99, 235, 0.95)', 'rgba(59, 130, 246, 0.35)', 'rgba(255, 255, 255, 0)');

        const ambientSprite = isDark
            ? createParticleSprite('rgba(168, 85, 247, 1.0)', 'rgba(99, 102, 241, 0.4)', 'rgba(9, 13, 22, 0)')
            : createParticleSprite('rgba(99, 102, 241, 0.85)', 'rgba(129, 140, 248, 0.3)', 'rgba(255, 255, 255, 0)');

        // --- 5. Layer 1: Undulating Cybernetic Horizon Wave ---
        const cols = isMobile ? 32 : 46;
        const rows = isMobile ? 26 : 38;
        const waveCount = cols * rows;
        const wavePositions = new Float32Array(waveCount * 3);
        const waveOffsets = new Float32Array(waveCount);

        const spacingX = 0.85;
        const spacingZ = 0.65;
        const offsetX = (cols * spacingX) / 2;
        const offsetZ = (rows * spacingZ) / 2;

        let widx = 0;
        for (let ix = 0; ix < cols; ix++) {
            for (let iz = 0; iz < rows; iz++) {
                const x = ix * spacingX - offsetX;
                const z = iz * spacingZ - offsetZ;
                const y = 0;

                wavePositions[widx * 3] = x;
                wavePositions[widx * 3 + 1] = y;
                wavePositions[widx * 3 + 2] = z;

                // Subtle individual variation
                waveOffsets[widx] = Math.sin(ix * 0.4) * 0.3 + Math.cos(iz * 0.4) * 0.3;
                widx++;
            }
        }

        const waveGeometry = new THREE.BufferGeometry();
        waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));

        const waveMaterial = new THREE.PointsMaterial({
            size: isMobile ? 0.35 : 0.42,
            map: waveSprite,
            transparent: true,
            opacity: isDark ? 0.55 : 0.38,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false,
        });

        const waveMesh = new THREE.Points(waveGeometry, waveMaterial);
        waveMesh.position.set(0, -3.2, -4);
        scene.add(waveMesh);

        // --- 6. Layer 2: Floating Ambient Quantum Starfield ---
        const ambientCount = isMobile ? 120 : 260;
        const ambientPositions = new Float32Array(ambientCount * 3);
        const ambientVelocity = new Float32Array(ambientCount * 3);

        for (let i = 0; i < ambientCount; i++) {
            ambientPositions[i * 3] = (Math.random() - 0.5) * 44;
            ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 28 + 2;
            ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 26 - 2;

            ambientVelocity[i * 3] = (Math.random() - 0.5) * 0.006;
            ambientVelocity[i * 3 + 1] = Math.random() * 0.008 + 0.003; // Gentle upward drift
            ambientVelocity[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
        }

        const ambientGeometry = new THREE.BufferGeometry();
        ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));

        const ambientMaterial = new THREE.PointsMaterial({
            size: isMobile ? 0.28 : 0.36,
            map: ambientSprite,
            transparent: true,
            opacity: isDark ? 0.45 : 0.28,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false,
        });

        const ambientMesh = new THREE.Points(ambientGeometry, ambientMaterial);
        scene.add(ambientMesh);

        // --- 7. Cursor Parallax & Scroll Reaction ---
        let targetCamX = 0;
        let targetCamY = 3.8;
        let targetRotX = -0.15;
        let scrollY = 0;

        const handleMouseMove = (e) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = -(e.clientY / window.innerHeight) * 2 + 1;
            targetCamX = nx * 1.8;
            targetCamY = 3.8 + ny * 1.2;
            targetRotX = -0.15 + ny * 0.06;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const handleScroll = () => {
            scrollY = window.scrollY || window.pageYOffset || 0;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const handleResize = () => {
            if (!container) return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // --- 8. Visibility Observer ---
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 }
        );
        observer.observe(container);

        // --- 9. Butter-Smooth Animation Loop ---
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!isVisible) return;

            const elapsed = clock.getElapsedTime();

            // 1. Wave Surface Undulation
            const posAttr = waveGeometry.attributes.position;
            const posArr = posAttr.array;

            let pi = 0;
            for (let ix = 0; ix < cols; ix++) {
                for (let iz = 0; iz < rows; iz++) {
                    const iy = pi * 3 + 1;
                    const x = posArr[pi * 3];
                    const z = posArr[pi * 3 + 2];

                    // Multi-harmonic sine/cosine ripple wave
                    posArr[iy] =
                        Math.sin(x * 0.28 + elapsed * 0.9) * 0.6 +
                        Math.cos(z * 0.32 + elapsed * 0.7) * 0.45 +
                        Math.sin((x + z) * 0.22 + elapsed * 1.1) * 0.25 +
                        waveOffsets[pi];

                    pi++;
                }
            }
            posAttr.needsUpdate = true;

            // 2. Ambient Particles Drift
            const ambAttr = ambientGeometry.attributes.position;
            const ambArr = ambAttr.array;

            for (let i = 0; i < ambientCount; i++) {
                ambArr[i * 3] += ambientVelocity[i * 3];
                ambArr[i * 3 + 1] += ambientVelocity[i * 3 + 1];
                ambArr[i * 3 + 2] += ambientVelocity[i * 3 + 2];

                // Wrap-around loop for continuous floating atmosphere
                if (ambArr[i * 3 + 1] > 18) {
                    ambArr[i * 3 + 1] = -12;
                    ambArr[i * 3] = (Math.random() - 0.5) * 44;
                }
            }
            ambAttr.needsUpdate = true;

            // 3. Smooth Camera Interpolation (Parallax + Scroll)
            const scrollOffset = Math.min(scrollY * 0.0025, 4.0);
            camera.position.x += (targetCamX - camera.position.x) * 0.04;
            camera.position.y += (targetCamY - scrollOffset * 0.6 - camera.position.y) * 0.04;
            camera.rotation.x += (targetRotX - scrollOffset * 0.05 - camera.rotation.x) * 0.04;

            // Subtle rotation of wave mesh to enhance spatial depth
            waveMesh.rotation.y = Math.sin(elapsed * 0.08) * 0.04;

            renderer.render(scene, camera);
        };

        animate();

        // --- 10. Clean Disposal on Unmount or Theme Change ---
        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);

            waveGeometry.dispose();
            waveMaterial.dispose();
            waveSprite.dispose();

            ambientGeometry.dispose();
            ambientMaterial.dispose();
            ambientSprite.dispose();

            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, [theme]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
        />
    );
}
