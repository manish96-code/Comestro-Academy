import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeDynamicBackground:
 * A simple, ultra-satisfying, minimalist 3D interactive background.
 * Features:
 * - Fluid interactive cybernetic mesh (calm, hypnotic wave terrain)
 * - Satisfying cursor interaction: moving the pointer creates silky smooth
 *   elastic ripples and a dynamic glowing cursor light aura that follows your movement
 * - Minimalist, clean, distraction-free aesthetic (zero clutter)
 * - 60+ FPS lightweight optimization with smooth spring physics
 * - Seamless Midnight Dark & Crisp Light mode support
 */

export default function ThreeDynamicBackground({ theme = 'dark' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId;
        let isVisible = true;
        const isDark = theme === 'dark';

        const texturesToDispose = [];
        const materialsToDispose = [];
        const geometriesToDispose = [];

        // --- 1. Scene & Depth Fog ---
        const scene = new THREE.Scene();
        const fogColor = isDark ? 0x090d16 : 0xffffff;
        // Gentle distance fog for infinite horizon falloff
        scene.fog = new THREE.FogExp2(fogColor, isDark ? 0.016 : 0.018);

        // --- 2. Camera Setup ---
        let width = window.innerWidth;
        let height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        camera.position.set(0, 4.2, 13);
        camera.lookAt(0, -0.6, 0);

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

        // --- 4. High-Quality Procedural Dot Sprite ---
        const createDotTexture = (stop0, stop1, stop2) => {
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
            texturesToDispose.push(tex);
            return tex;
        };

        // --- 5. Soft Glow Cursor Aura Texture ---
        const createCursorAuraTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            if (isDark) {
                grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
                grad.addColorStop(0.4, 'rgba(99, 102, 241, 0.20)');
                grad.addColorStop(1, 'rgba(9, 13, 22, 0)');
            } else {
                grad.addColorStop(0, 'rgba(37, 99, 235, 0.30)');
                grad.addColorStop(0.45, 'rgba(99, 102, 241, 0.12)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            }
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 128, 128);
            const tex = new THREE.CanvasTexture(canvas);
            tex.needsUpdate = true;
            texturesToDispose.push(tex);
            return tex;
        };

        // --- 6. Layer 1: Satisfying Interactive Liquid Mesh ---
        // Dark: vibrant glowing cyan on dark navy; Light: rich deep royal & indigo on white
        const dotTexture = isDark
            ? createDotTexture('rgba(56, 189, 248, 0.95)', 'rgba(14, 165, 233, 0.40)', 'rgba(9, 13, 22, 0)')
            : createDotTexture('rgba(30, 58, 138, 0.95)', 'rgba(37, 99, 235, 0.50)', 'rgba(255, 255, 255, 0)');

        const cols = isMobile ? 36 : 56;
        const rows = isMobile ? 28 : 42;
        const totalPoints = cols * rows;

        const positions = new Float32Array(totalPoints * 3);
        const originalY = new Float32Array(totalPoints);
        const velocities = new Float32Array(totalPoints);

        const spacingX = 0.82;
        const spacingZ = 0.68;
        const offsetX = (cols * spacingX) / 2;
        const offsetZ = (rows * spacingZ) / 2;

        let idx = 0;
        for (let ix = 0; ix < cols; ix++) {
            for (let iz = 0; iz < rows; iz++) {
                const x = ix * spacingX - offsetX;
                const z = iz * spacingZ - offsetZ;
                positions[idx * 3] = x;
                positions[idx * 3 + 1] = 0;
                positions[idx * 3 + 2] = z;
                originalY[idx] = 0;
                velocities[idx] = 0;
                idx++;
            }
        }

        const waveGeometry = new THREE.BufferGeometry();
        waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometriesToDispose.push(waveGeometry);

        const waveMaterial = new THREE.PointsMaterial({
            size: isMobile ? 0.30 : 0.38,
            map: dotTexture,
            transparent: true,
            opacity: isDark ? 0.45 : 0.52,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false,
        });
        materialsToDispose.push(waveMaterial);

        const waveMesh = new THREE.Points(waveGeometry, waveMaterial);
        waveMesh.position.set(0, -3.0, -3.5);
        scene.add(waveMesh);

        // --- 7. Layer 2: Satisfying Glowing Cursor Spotlight Aura ---
        const cursorAuraMat = new THREE.SpriteMaterial({
            map: createCursorAuraTexture(),
            transparent: true,
            opacity: isDark ? 0.75 : 0.60,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false,
        });
        materialsToDispose.push(cursorAuraMat);

        const cursorAura = new THREE.Sprite(cursorAuraMat);
        cursorAura.scale.set(7.5, 7.5, 1);
        cursorAura.position.set(0, -2.8, -3.5);
        scene.add(cursorAura);

        // --- 8. Layer 3: Faint Atmospheric Floating Specks ---
        const dustCount = isMobile ? 35 : 70;
        const dustPositions = new Float32Array(dustCount * 3);
        const dustVelocities = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount; i++) {
            dustPositions[i * 3] = (Math.random() - 0.5) * 36;
            dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 20 + 2;
            dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 2;

            dustVelocities[i * 3] = (Math.random() - 0.5) * 0.003;
            dustVelocities[i * 3 + 1] = Math.random() * 0.004 + 0.0015;
            dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
        }

        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
        geometriesToDispose.push(dustGeometry);

        const dustMaterial = new THREE.PointsMaterial({
            size: isMobile ? 0.18 : 0.24,
            map: dotTexture,
            transparent: true,
            opacity: isDark ? 0.28 : 0.18,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false,
        });
        materialsToDispose.push(dustMaterial);

        const dustMesh = new THREE.Points(dustGeometry, dustMaterial);
        scene.add(dustMesh);

        // --- 9. Cursor Pointer & Physics State ---
        let mouseX = 0;
        let mouseY = 0;
        let targetCamX = 0;
        let targetCamY = 4.2;
        let targetRotX = -0.15;
        let scrollY = 0;

        // Smoothly interpolated cursor coordinates on the 3D plane
        let smoothCursorPlaneX = 0;
        let smoothCursorPlaneZ = -3.5;
        let cursorActive = false;

        const handleMouseMove = (e) => {
            cursorActive = true;
            const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
            const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;

            mouseX = ndcX;
            mouseY = ndcY;

            // Subtle parallax
            targetCamX = ndcX * 1.5;
            targetCamY = 4.2 + ndcY * 0.9;
            targetRotX = -0.15 + ndcY * 0.04;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const handleScroll = () => {
            scrollY = window.scrollY || window.pageYOffset || 0;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const handleResize = () => {
            if (!container) return;
            width = window.innerWidth;
            height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // --- 10. Intersection Observer ---
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 }
        );
        observer.observe(container);

        // --- 11. Butter-Smooth Animation Loop ---
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!isVisible) return;

            const elapsed = clock.getElapsedTime();

            // Map mouse to wave plane coordinates with fluid spring lag
            const targetPlaneX = mouseX * 18.0;
            const targetPlaneZ = -mouseY * 12.0 - 3.5;

            smoothCursorPlaneX += (targetPlaneX - smoothCursorPlaneX) * 0.08;
            smoothCursorPlaneZ += (targetPlaneZ - smoothCursorPlaneZ) * 0.08;

            // Move the soft glowing spotlight aura with the cursor
            cursorAura.position.x = smoothCursorPlaneX;
            cursorAura.position.z = smoothCursorPlaneZ;
            cursorAura.position.y = -2.8 + Math.sin(elapsed * 1.5) * 0.1;

            // Subtle breathing pulse on cursor aura
            const auraScale = 7.0 + Math.sin(elapsed * 2.0) * 0.6;
            cursorAura.scale.set(auraScale, auraScale, 1);

            // 1. Fluid Wave & Satisfying Ripple Physics on the Matrix Grid
            const posAttr = waveGeometry.attributes.position;
            const posArr = posAttr.array;

            let pi = 0;
            for (let ix = 0; ix < cols; ix++) {
                for (let iz = 0; iz < rows; iz++) {
                    const iy = pi * 3 + 1;
                    const x = posArr[pi * 3];
                    const z = posArr[pi * 3 + 2];

                    // Gentle, relaxing oceanic ambient wave
                    let baseWave =
                        Math.sin(x * 0.25 + elapsed * 0.85) * 0.55 +
                        Math.cos(z * 0.30 + elapsed * 0.65) * 0.40 +
                        Math.sin((x + z) * 0.18 + elapsed * 1.0) * 0.22;

                    // Satisfying Interactive Cursor Elastic Wave
                    if (cursorActive) {
                        const dx = x - smoothCursorPlaneX;
                        const dz = z - smoothCursorPlaneZ;
                        const dist = Math.sqrt(dx * dx + dz * dz);

                        if (dist < 8.5) {
                            // Smooth Gaussian elevation + surrounding harmonic ripple
                            const ripple =
                                Math.exp(-dist * 0.38) *
                                Math.sin(dist * 1.5 - elapsed * 4.2) *
                                0.65;

                            // Gentle magnetic lift under the pointer
                            const lift = Math.exp(-dist * 0.45) * 0.50;

                            baseWave += ripple + lift;
                        }
                    }

                    posArr[iy] = baseWave;
                    pi++;
                }
            }
            posAttr.needsUpdate = true;

            // 2. Slow Ambient Specks Drift
            const dustAttr = dustGeometry.attributes.position;
            const dustArr = dustAttr.array;

            for (let i = 0; i < dustCount; i++) {
                dustArr[i * 3] += dustVelocities[i * 3];
                dustArr[i * 3 + 1] += dustVelocities[i * 3 + 1];
                dustArr[i * 3 + 2] += dustVelocities[i * 3 + 2];

                if (dustArr[i * 3 + 1] > 16) {
                    dustArr[i * 3 + 1] = -10;
                    dustArr[i * 3] = (Math.random() - 0.5) * 36;
                }
            }
            dustAttr.needsUpdate = true;

            // 3. Smooth Camera Interpolation (Parallax + Scroll)
            const scrollOffset = Math.min(scrollY * 0.0025, 4.0);
            camera.position.x += (targetCamX - camera.position.x) * 0.04;
            camera.position.y += (targetCamY - scrollOffset * 0.6 - camera.position.y) * 0.04;
            camera.rotation.x += (targetRotX - scrollOffset * 0.05 - camera.rotation.x) * 0.04;

            // Gentle spatial rotation
            waveMesh.rotation.y = Math.sin(elapsed * 0.06) * 0.025;

            renderer.render(scene, camera);
        };

        animate();

        // --- 12. Clean Disposal on Unmount or Theme Change ---
        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);

            texturesToDispose.forEach((t) => t.dispose());
            materialsToDispose.forEach((m) => m.dispose());
            geometriesToDispose.forEach((g) => g.dispose());

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
