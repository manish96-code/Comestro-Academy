import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeNeuralBackground({ className = '' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId;
        let isVisible = true;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x060811, 0.05);

        const width = container.clientWidth;
        const height = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
        camera.position.set(0, 5, 9);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: false, // false for super fast background performance
            alpha: true,
            powerPreference: 'low-power',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Undulating 3D Grid Wave
        const cols = 35;
        const rows = 35;
        const count = cols * rows;
        const positions = new Float32Array(count * 3);
        const originalY = new Float32Array(count);

        let idx = 0;
        const spacing = 0.55;
        const offsetX = (cols * spacing) / 2;
        const offsetZ = (rows * spacing) / 2;

        for (let ix = 0; ix < cols; ix++) {
            for (let iz = 0; iz < rows; iz++) {
                const x = ix * spacing - offsetX;
                const z = iz * spacing - offsetZ;
                const y = 0;

                positions[idx * 3] = x;
                positions[idx * 3 + 1] = y;
                positions[idx * 3 + 2] = z;
                originalY[idx] = y;
                idx++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create subtle glowing dot
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.9)');
        grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.4)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.PointsMaterial({
            size: 0.18,
            map: texture,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        points.position.y = -1.5;
        scene.add(points);

        // Interaction
        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Auto pause when out of view
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 }
        );
        observer.observe(container);

        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        let clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!isVisible) return;

            const elapsed = clock.getElapsedTime();
            const posAttr = geometry.attributes.position;
            const posArr = posAttr.array;

            let i = 0;
            for (let ix = 0; ix < cols; ix++) {
                for (let iz = 0; iz < rows; iz++) {
                    const iy = i * 3 + 1;
                    const x = posArr[i * 3];
                    const z = posArr[i * 3 + 2];

                    // Sine / cosine wave ripple
                    posArr[iy] =
                        Math.sin(elapsed * 1.4 + x * 0.45) * 0.45 +
                        Math.cos(elapsed * 1.2 + z * 0.45) * 0.45 +
                        Math.sin((x + z) * 0.3 + elapsed) * 0.2;

                    i++;
                }
            }
            posAttr.needsUpdate = true;

            // Subtle camera sway with mouse
            camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.04;
            camera.lookAt(0, -0.5, 0);

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);

            geometry.dispose();
            material.dispose();
            texture.dispose();
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
            style={{ zIndex: 0 }}
        />
    );
}
