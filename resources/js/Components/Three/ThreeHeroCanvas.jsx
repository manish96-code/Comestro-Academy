import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Zap, Cpu, Flame } from 'lucide-react';

export default function ThreeHeroCanvas() {
    const containerRef = useRef(null);
    const [aiMode, setAiMode] = useState('chromatic'); // 'chromatic' | 'neural' | 'quantum'
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [isInteracting, setIsInteracting] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId;
        let isVisible = true;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x060713, 0.04);

        const width = container.clientWidth;
        const height = container.clientHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 8.4);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });

        const isMobile = window.innerWidth < 768;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // --- 1. Multi-Color Point Lights for Iridescent Lighting ---
        const ambientLight = new THREE.AmbientLight(0x0b1329, 2);
        scene.add(ambientLight);

        // Cyan Light
        const cyanLight = new THREE.PointLight(0x00f2fe, 4.5, 20);
        cyanLight.position.set(4, 4, 3);
        scene.add(cyanLight);

        // Fuchsia Light
        const fuchsiaLight = new THREE.PointLight(0xff0080, 4.5, 20);
        fuchsiaLight.position.set(-4, -3, 3);
        scene.add(fuchsiaLight);

        // Violet Light
        const violetLight = new THREE.PointLight(0x7928ca, 4, 18);
        violetLight.position.set(0, 5, -3);
        scene.add(violetLight);

        // Emerald Accent Light
        const emeraldLight = new THREE.PointLight(0x10b981, 3.5, 18);
        emeraldLight.position.set(-3, 4, 2);
        scene.add(emeraldLight);

        // Solar Amber Accent Light
        const amberLight = new THREE.PointLight(0xf59e0b, 3, 16);
        amberLight.position.set(3, -4, -2);
        scene.add(amberLight);

        // Master Group
        const masterGroup = new THREE.Group();
        scene.add(masterGroup);

        // --- 2. Morphing AI Geodesic Sphere (Outer Multi-Color Wireframe) ---
        const icosaGeo = new THREE.IcosahedronGeometry(2.2, 2);
        const countVertices = icosaGeo.attributes.position.count;
        const icosaColors = new Float32Array(countVertices * 3);

        const colorPalette = [
            new THREE.Color(0x00f2fe), // Cyan
            new THREE.Color(0x7928ca), // Violet
            new THREE.Color(0xff0080), // Fuchsia
            new THREE.Color(0x10b981), // Emerald
            new THREE.Color(0xf59e0b), // Amber
        ];

        for (let i = 0; i < countVertices; i++) {
            const col = colorPalette[i % colorPalette.length];
            icosaColors[i * 3] = col.r;
            icosaColors[i * 3 + 1] = col.g;
            icosaColors[i * 3 + 2] = col.b;
        }
        icosaGeo.setAttribute('color', new THREE.BufferAttribute(icosaColors, 3));

        const icosaMat = new THREE.MeshStandardMaterial({
            vertexColors: true,
            wireframe: true,
            transparent: true,
            opacity: 0.55,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.3,
        });
        const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat);
        masterGroup.add(icosaMesh);

        // --- 3. Generative Crystalline Core (Multi-Faceted Dodecahedron) ---
        const coreGeo = new THREE.DodecahedronGeometry(1.15, 0);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x1e1b4b,
            roughness: 0.05,
            metalness: 0.95,
            emissive: 0x7928ca,
            emissiveIntensity: 0.8,
            wireframe: false,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        masterGroup.add(coreMesh);

        // Inner glowing star octahedron
        const starGeo = new THREE.OctahedronGeometry(1.35, 1);
        const starMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe,
            wireframe: true,
            transparent: true,
            opacity: 0.4,
        });
        const starMesh = new THREE.Mesh(starGeo, starMat);
        masterGroup.add(starMesh);

        // --- 4. Multi-Color Gyroscopic Orbital Rings ---
        // Ring 1: Neon Cyan
        const ring1 = new THREE.Mesh(
            new THREE.RingGeometry(2.7, 2.74, 64),
            new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
        );
        ring1.rotation.x = Math.PI / 3;
        masterGroup.add(ring1);

        // Ring 2: Hot Fuchsia
        const ring2 = new THREE.Mesh(
            new THREE.RingGeometry(3.1, 3.14, 64),
            new THREE.MeshBasicMaterial({ color: 0xff0080, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
        );
        ring2.rotation.y = Math.PI / 4;
        ring2.rotation.x = -Math.PI / 5;
        masterGroup.add(ring2);

        // Ring 3: Electric Emerald
        const ring3 = new THREE.Mesh(
            new THREE.RingGeometry(3.5, 3.53, 64),
            new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
        );
        ring3.rotation.z = Math.PI / 4;
        masterGroup.add(ring3);

        // Ring 4: Solar Gold
        const ring4 = new THREE.Mesh(
            new THREE.RingGeometry(3.9, 3.92, 64),
            new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
        );
        ring4.rotation.x = Math.PI / 6;
        ring4.rotation.z = -Math.PI / 3;
        masterGroup.add(ring4);

        // --- 5. Floating Iridescent AI Tech Capsules ---
        const techCapsules = [
            { name: 'Neural AI', color: 0xff0080, radius: 2.8, angle: 0, speed: 0.8 },
            { name: 'Java 21', color: 0xf59e0b, radius: 3.2, angle: 1.05, speed: -0.65 },
            { name: 'React 19', color: 0x00f2fe, radius: 2.9, angle: 2.1, speed: 0.75 },
            { name: 'Spring Boot', color: 0x10b981, radius: 3.4, angle: 3.15, speed: -0.55 },
            { name: 'Python Systems', color: 0x38bdf8, radius: 3.1, angle: 4.2, speed: 0.7 },
            { name: 'Cloud & K8s', color: 0x7928ca, radius: 3.6, angle: 5.25, speed: -0.6 },
        ];

        const capsuleMeshes = [];
        const capsuleGroup = new THREE.Group();
        masterGroup.add(capsuleGroup);

        techCapsules.forEach((tech) => {
            const capGeo = new THREE.SphereGeometry(0.18, 16, 16);
            const capMat = new THREE.MeshStandardMaterial({
                color: tech.color,
                emissive: tech.color,
                emissiveIntensity: 0.9,
                roughness: 0.1,
                metalness: 0.8,
            });
            const mesh = new THREE.Mesh(capGeo, capMat);

            // Glowing dual orbit rings for each capsule
            const halo = new THREE.Mesh(
                new THREE.RingGeometry(0.26, 0.31, 24),
                new THREE.MeshBasicMaterial({ color: tech.color, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
            );
            mesh.add(halo);

            mesh.userData = { ...tech };
            capsuleGroup.add(mesh);
            capsuleMeshes.push(mesh);
        });

        // --- 6. 1,500 Multi-Color Chromatic Stardust Vortex ---
        const particleCount = isMobile ? 800 : 1500;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const originalPositions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 2.3 + Math.random() * 3.8;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;

            // Vibrant multi-color particle assignment
            const pColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = pColor.r;
            colors[i * 3 + 1] = pColor.g;
            colors[i * 3 + 2] = pColor.b;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create glowing chromatic point texture
        const canvasPoint = document.createElement('canvas');
        canvasPoint.width = 32;
        canvasPoint.height = 32;
        const ctxPoint = canvasPoint.getContext('2d');
        const grad = ctxPoint.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(0, 242, 254, 0.9)');
        grad.addColorStop(0.7, 'rgba(255, 0, 128, 0.4)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctxPoint.fillStyle = grad;
        ctxPoint.fillRect(0, 0, 32, 32);

        const pointTexture = new THREE.CanvasTexture(canvasPoint);

        const particleMaterial = new THREE.PointsMaterial({
            size: isMobile ? 0.12 : 0.16,
            map: pointTexture,
            transparent: true,
            opacity: 0.85,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particleSystem = new THREE.Points(particleGeo, particleMaterial);
        masterGroup.add(particleSystem);

        // --- 7. Physics, Parallax & Touch Drag ---
        let targetRotationX = 0;
        let targetRotationY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;
        let mouseX = 0;
        let mouseY = 0;

        let isDragging = false;
        let previousPointerPosition = { x: 0, y: 0 };
        let pointerDragVelocity = { x: 0, y: 0 };

        let pulseWave = { active: false, radius: 0, maxRadius: 6.0, speed: 0.1 };

        const handlePointerMove = (e) => {
            const rect = container.getBoundingClientRect();
            const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

            mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);

            if (isDragging) {
                const deltaX = clientX - previousPointerPosition.x;
                const deltaY = clientY - previousPointerPosition.y;

                pointerDragVelocity = { x: deltaX * 0.005, y: deltaY * 0.005 };
                targetRotationY += pointerDragVelocity.x;
                targetRotationX += pointerDragVelocity.y;

                previousPointerPosition = { x: clientX, y: clientY };
            } else {
                targetRotationY = mouseX * 0.4;
                targetRotationX = -mouseY * 0.4;
            }
        };

        const handlePointerDown = (e) => {
            isDragging = true;
            setIsInteracting(true);
            const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
            previousPointerPosition = { x: clientX, y: clientY };
            pointerDragVelocity = { x: 0, y: 0 };
        };

        const handlePointerUp = () => {
            isDragging = false;
            setIsInteracting(false);
        };

        const handleClick = () => {
            // Trigger 3D multi-color energy pulse shockwave
            pulseWave.active = true;
            pulseWave.radius = 0.5;
        };

        const dom = renderer.domElement;
        dom.addEventListener('mousemove', handlePointerMove);
        dom.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('mouseup', handlePointerUp);
        dom.addEventListener('click', handleClick);

        dom.addEventListener('touchstart', handlePointerDown, { passive: true });
        dom.addEventListener('touchmove', handlePointerMove, { passive: true });
        window.addEventListener('touchend', handlePointerUp, { passive: true });

        const handleResize = () => {
            if (!container) return;
            const newW = container.clientWidth;
            const newH = container.clientHeight;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
        };
        window.addEventListener('resize', handleResize);

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 }
        );
        observer.observe(container);

        // --- 8. Animation Loop ---
        let clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!isVisible) return;

            const elapsed = clock.getElapsedTime() * speedMultiplier;

            currentRotationX += (targetRotationX - currentRotationX) * 0.07;
            currentRotationY += (targetRotationY - currentRotationY) * 0.07;

            if (!isDragging) {
                targetRotationY += pointerDragVelocity.x;
                targetRotationX += pointerDragVelocity.y;
                pointerDragVelocity.x *= 0.93;
                pointerDragVelocity.y *= 0.93;
            }

            masterGroup.rotation.y = currentRotationY + elapsed * 0.14;
            masterGroup.rotation.x = currentRotationX + Math.sin(elapsed * 0.4) * 0.09;

            // Core breathing pulse & morphing rotation
            coreMesh.rotation.y = -elapsed * 0.5;
            coreMesh.rotation.z = elapsed * 0.35;
            const scalePulse = 1 + Math.sin(elapsed * 3) * 0.1;
            coreMesh.scale.set(scalePulse, scalePulse, scalePulse);

            starMesh.rotation.y = elapsed * 0.4;
            starMesh.rotation.x = -elapsed * 0.2;

            // Gyroscopic Rings
            ring1.rotation.z = elapsed * 0.3;
            ring2.rotation.x = -elapsed * 0.35;
            ring3.rotation.y = elapsed * 0.25;
            ring4.rotation.z = -elapsed * 0.2;

            // Orbiting Tech Capsules
            capsuleMeshes.forEach((mesh) => {
                const data = mesh.userData;
                const angle = data.angle + elapsed * data.speed * 0.4;
                mesh.position.x = Math.cos(angle) * data.radius;
                mesh.position.z = Math.sin(angle) * data.radius;
                mesh.position.y = Math.sin(angle * 2.5 + elapsed) * 0.7;
                mesh.rotation.y = elapsed * 2;
            });

            // Chromatic Particle Wave Dynamics
            const posAttr = particleGeo.attributes.position;
            const posArray = posAttr.array;

            if (pulseWave.active) {
                pulseWave.radius += pulseWave.speed;
                if (pulseWave.radius > pulseWave.maxRadius) {
                    pulseWave.active = false;
                }
            }

            for (let i = 0; i < particleCount; i++) {
                const ix = i * 3;
                const iy = i * 3 + 1;
                const iz = i * 3 + 2;

                const ox = originalPositions[ix];
                const oy = originalPositions[iy];
                const oz = originalPositions[iz];

                const wave = Math.sin(elapsed * 1.8 + ox * 0.9 + oy * 0.9) * 0.18;
                posArray[ix] = ox + (ox / 3.5) * wave;
                posArray[iy] = oy + (oy / 3.5) * wave;
                posArray[iz] = oz + (oz / 3.5) * wave;

                if (pulseWave.active) {
                    const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
                    const diff = Math.abs(dist - pulseWave.radius);
                    if (diff < 0.7) {
                        const push = (1 - diff / 0.7) * 0.5;
                        posArray[ix] += (ox / dist) * push;
                        posArray[iy] += (oy / dist) * push;
                        posArray[iz] += (oz / dist) * push;
                    }
                }
            }
            posAttr.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            dom.removeEventListener('mousemove', handlePointerMove);
            dom.removeEventListener('mousedown', handlePointerDown);
            window.removeEventListener('mouseup', handlePointerUp);
            dom.removeEventListener('click', handleClick);
            dom.removeEventListener('touchstart', handlePointerDown);
            dom.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('touchend', handlePointerUp);

            icosaGeo.dispose();
            icosaMat.dispose();
            coreGeo.dispose();
            coreMat.dispose();
            starGeo.dispose();
            starMat.dispose();
            ring1.geometry.dispose();
            ring1.material.dispose();
            ring2.geometry.dispose();
            ring2.material.dispose();
            ring3.geometry.dispose();
            ring3.material.dispose();
            ring4.geometry.dispose();
            ring4.material.dispose();
            particleGeo.dispose();
            particleMaterial.dispose();
            pointTexture.dispose();

            capsuleMeshes.forEach((m) => {
                m.geometry.dispose();
                m.material.dispose();
            });

            renderer.dispose();
            if (dom && dom.parentNode) {
                dom.parentNode.removeChild(dom);
            }
        };
    }, [speedMultiplier]);

    return (
        <div className="relative w-full h-[440px] sm:h-[500px] lg:h-[580px] flex items-center justify-center select-none">
            {/* Multi-Color Ambient Radial Glow */}
            <div className="pointer-events-none absolute -inset-6 bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-fuchsia-600/20 blur-3xl rounded-full opacity-80" />

            {/* Three.js Canvas Container */}
            <div
                ref={containerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
                style={{ touchAction: 'pan-y' }}
                title="Interactive AI-Generated 3D Quantum Core. Drag to rotate, click to pulse."
            />

            {/* Futuristic Multi-Color AI Overlay Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-slate-950/80 px-4 py-1.5 backdrop-blur-2xl shadow-2xl font-mono text-[11px] text-slate-200">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>AI SYNAPSE 3D</span>
                </span>
                <span className="text-slate-600">|</span>
                <button
                    type="button"
                    onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
                    className="flex items-center gap-1 hover:text-white transition px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-fuchsia-300"
                    title="Toggle Particle Speed"
                >
                    <Zap className="h-3 w-3 text-fuchsia-400" />
                    <span>{speedMultiplier === 1 ? '1x' : speedMultiplier === 2 ? '2x' : '0.5x'}</span>
                </button>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="text-emerald-400 hidden sm:flex items-center gap-1 font-semibold">
                    <Sparkles className="h-3 w-3" />
                    <span>Multi-Color WebGL</span>
                </span>
            </div>

            {/* Top Multi-Color Corner Badges */}
            <div className="pointer-events-none absolute top-4 right-4 z-10 hidden sm:flex flex-col gap-1.5 font-mono text-[10px]">
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-cyan-300 backdrop-blur-md flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>AI Model: Active</span>
                </div>
                <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/40 px-2.5 py-1 text-fuchsia-300 backdrop-blur-md flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                    <span>Chromatic Mesh 60 FPS</span>
                </div>
            </div>
        </div>
    );
}
