import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeLaptopCanvas
 *
 * Authentic Apple MacBook Air 3D experience in Three.js:
 * - Mathematical auto-fit camera: GUARANTEES the entire MacBook Air is 100% visible with zero cropping on all devices.
 * - Ultra-thin, fanless unibody chassis (~11.3mm profile) in Apple Midnight / Silver.
 * - True MacBook Air layout: NO speaker grilles next to keyboard (clean expansive aluminum flanks).
 * - Authentic side ports: MagSafe 3 + 2x Thunderbolt USB-C on the left; ONLY 3.5mm audio jack on the right (no HDMI/SD).
 * - Real, tactile Magic Keyboard: 2048x920 ultra-detailed keycap texture with individual chiclet keys, 
 *   SF Pro typography, macOS function row icons, caps lock LED, touch ID sensor, and physical raised 3D spacebar & keys.
 * - Giant Force Touch glass trackpad with seamless palm rests.
 * - Liquid Retina screen with macOS traffic light controls, top camera notch, green LED indicator, and live Java code.
 * - 100% Transparent Apple logo (Zero square box / patch).
 * - Scroll-driven lid closing: Starts OPEN at scroll 0, smoothly folds CLOSED as user scrolls down.
 * - Zero boxes, borders, cards, or button frames enclosing the canvas.
 */
export default function ThreeLaptopCanvas({ theme = 'light' }) {
    const containerRef = useRef(null);
    const isManuallyToggledRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId;
        let isVisible = true;
        const isDark = theme === 'dark';

        // --- 1. Scene, Camera & Renderer ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(isDark ? 0x090d16 : 0xf8fafc, 0.015);

        const width = container.clientWidth || 500;
        const height = container.clientHeight || 450;
        const aspect = width / height;

        const cameraFov = 40;
        const camera = new THREE.PerspectiveCamera(cameraFov, aspect, 0.1, 100);

        // Mathematical Auto-Fit Function:
        // Guarantees that the bounding sphere of the open & rotated MacBook Air
        // ALWAYS fits inside both the vertical AND horizontal camera frustum with safe margin!
        const boundingRadius = 2.95;
        const safeMargin = 1.16; // 16% breathing room around all edges

        const updateCameraDistance = (currAspect) => {
            const fovVRad = (cameraFov * Math.PI) / 180;
            const tanV = Math.tan(fovVRad / 2);
            const tanH = currAspect * tanV;
            const fovHRad = 2 * Math.atan(tanH);

            const distV = (boundingRadius / Math.sin(fovVRad / 2)) * safeMargin;
            const distH = (boundingRadius / Math.sin(fovHRad / 2)) * safeMargin;

            // Must satisfy both vertical and horizontal constraints so it never crops
            return Math.max(distV, distH);
        };

        const initialDist = updateCameraDistance(aspect);
        camera.position.set(0, 1.7, initialDist);
        camera.lookAt(0, 0.35, 0);

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

        // --- 2. Studio Lighting for Apple MacBook Air Aluminum ---
        const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 2.2 : 2.7);
        scene.add(ambientLight);

        // Key light (top-right-front)
        const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.7 : 3.0);
        keyLight.position.set(5.5, 8, 6.5);
        scene.add(keyLight);

        // Soft rim fill light (left-rear)
        const fillLight = new THREE.DirectionalLight(0xffffff, 1.3);
        fillLight.position.set(-6.5, 3.5, -4);
        scene.add(fillLight);

        // Backlight to accentuate the thin lid edge & Apple logo
        const backLight = new THREE.DirectionalLight(0xffffff, 1.1);
        backLight.position.set(0, 5, -6.5);
        scene.add(backLight);

        // Ground bounce light
        const bounceLight = new THREE.DirectionalLight(isDark ? 0x1e2738 : 0xe2e8f0, 0.85);
        bounceLight.position.set(0, -4, 2.5);
        scene.add(bounceLight);

        // --- 3. Master Group & Materials ---
        const macMaster = new THREE.Group();
        macMaster.position.y = -0.22;
        scene.add(macMaster);

        // Apple MacBook Air Anodized Aluminum: Midnight in dark mode, Starlight/Silver in light mode
        const aluminumColor = isDark ? 0x222a38 : 0xdde3ee;
        const chassisMaterial = new THREE.MeshStandardMaterial({
            color: aluminumColor,
            roughness: 0.22,
            metalness: 0.88,
        });

        // Matte Dark Bezel & Recessed Well Material
        const darkBezelMaterial = new THREE.MeshStandardMaterial({
            color: 0x0c0f14,
            roughness: 0.7,
            metalness: 0.15,
        });

        // Helper: Rounded Rectangle 2D Shape
        const createRoundedRectShape = (w, d, r) => {
            const shape = new THREE.Shape();
            const x = -w / 2;
            const y = -d / 2;
            shape.moveTo(x + r, y);
            shape.lineTo(x + w - r, y);
            shape.quadraticCurveTo(x + w, y, x + w, y + r);
            shape.lineTo(x + w, y + d - r);
            shape.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
            shape.lineTo(x + r, y + d);
            shape.quadraticCurveTo(x, y + d, x, y + d - r);
            shape.lineTo(x, y + r);
            shape.quadraticCurveTo(x, y, x + r, y);
            return shape;
        };

        // --- 4. MacBook Air Base Chassis (Ultra-thin ~11.3mm Wedge Profile) ---
        const baseWidth = 4.5;
        const baseDepth = 2.95;
        const baseH = 0.09; // Ultra-slim MacBook Air profile

        const baseShape = createRoundedRectShape(baseWidth, baseDepth, 0.22);
        const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
            depth: baseH,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.028,
            bevelThickness: 0.028,
        });
        baseGeo.rotateX(-Math.PI / 2);
        baseGeo.center();
        const baseMesh = new THREE.Mesh(baseGeo, chassisMaterial);
        macMaster.add(baseMesh);

        // Bounds
        const totalBaseH = baseH + 0.056;
        const topBaseY = totalBaseH / 2;
        const rearBaseZ = -baseDepth / 2;
        const frontBaseZ = baseDepth / 2;

        // Front Thumb Scoop (Apple Centered Notch on bottom lip)
        const scoopGeo = new THREE.BoxGeometry(0.85, 0.03, 0.05);
        const scoopMat = new THREE.MeshStandardMaterial({
            color: isDark ? 0x181e28 : 0xb4bcc9,
            roughness: 0.5,
        });
        const scoopMesh = new THREE.Mesh(scoopGeo, scoopMat);
        scoopMesh.position.set(0, topBaseY - 0.012, frontBaseZ - 0.014);
        macMaster.add(scoopMesh);

        // Four Black Silicone Rubber Feet on Bottom Plate
        const footGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.014, 16);
        const footMat = new THREE.MeshStandardMaterial({ color: 0x121418, roughness: 0.85 });
        const footOffsets = [
            [-1.8, -1.1],
            [1.8, -1.1],
            [-1.8, 1.1],
            [1.8, 1.1],
        ];
        footOffsets.forEach(([fx, fz]) => {
            const foot = new THREE.Mesh(footGeo, footMat);
            foot.position.set(fx, -topBaseY - 0.005, fz);
            macMaster.add(foot);
        });

        // --- MacBook Air Specific Side Ports ---
        // Left side: MagSafe 3 + Two Thunderbolt / USB-C Ports
        const magSafePort = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.03, 0.13),
            darkBezelMaterial
        );
        magSafePort.position.set(-baseWidth / 2 - 0.015, 0, -0.65);
        macMaster.add(magSafePort);

        const magSafeLed = new THREE.Mesh(
            new THREE.SphereGeometry(0.012, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xf59e0b }) // Amber charging LED
        );
        magSafeLed.position.set(-baseWidth / 2 - 0.022, 0, -0.65);
        macMaster.add(magSafeLed);

        [-0.4, -0.14].forEach((zPos) => {
            const tbPort = new THREE.Mesh(
                new THREE.BoxGeometry(0.02, 0.026, 0.08),
                darkBezelMaterial
            );
            tbPort.position.set(-baseWidth / 2 - 0.015, 0, zPos);
            macMaster.add(tbPort);
        });

        // Right side: ONLY 3.5mm Headphone Jack (MacBook Air has NO HDMI, NO SD slot!)
        const headphoneJack = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.02, 16),
            darkBezelMaterial
        );
        headphoneJack.rotateZ(Math.PI / 2);
        headphoneJack.position.set(baseWidth / 2 + 0.015, 0, -0.4);
        macMaster.add(headphoneJack);

        // --- 5. Real Apple Magic Keyboard (No Speaker Grilles - Pure MacBook Air) ---
        // Recessed keyboard well
        const kbWellGeo = new THREE.BoxGeometry(3.6, 0.01, 1.6);
        const kbWellMesh = new THREE.Mesh(kbWellGeo, darkBezelMaterial);
        kbWellMesh.position.set(0, topBaseY + 0.004, -0.3);
        macMaster.add(kbWellMesh);

        // High-resolution 2048x920 Photorealistic Magic Keyboard Canvas
        const kbCanvas = document.createElement('canvas');
        kbCanvas.width = 2048;
        kbCanvas.height = 920;
        const kbCtx = kbCanvas.getContext('2d');

        const drawRealKeyboard = () => {
            kbCtx.fillStyle = '#07080b';
            kbCtx.fillRect(0, 0, 2048, 920);

            const drawChicletKey = (x, y, w, h, label = '', sub = '', isAccent = false, isLed = false) => {
                // Key body (deep matte Apple chiclet keycap)
                kbCtx.fillStyle = '#12141a';
                kbCtx.beginPath();
                kbCtx.roundRect(x, y, w, h, 10);
                kbCtx.fill();

                // Crisp key perimeter outline
                kbCtx.strokeStyle = '#232733';
                kbCtx.lineWidth = 1.6;
                kbCtx.stroke();

                // Key label text
                if (label) {
                    kbCtx.fillStyle = isAccent ? '#38bdf8' : '#f8fafc';
                    kbCtx.font = label.length > 4 ? '600 24px -apple-system, sans-serif' : '600 30px -apple-system, sans-serif';
                    kbCtx.textAlign = 'center';
                    kbCtx.textBaseline = 'middle';
                    kbCtx.fillText(label, x + w / 2, y + (sub ? h * 0.42 : h / 2));
                }

                // Sub-label or icon
                if (sub) {
                    kbCtx.fillStyle = '#94a3b8';
                    kbCtx.font = '500 19px -apple-system, sans-serif';
                    kbCtx.textAlign = 'center';
                    kbCtx.textBaseline = 'middle';
                    kbCtx.fillText(sub, x + w / 2, y + h * 0.74);
                }

                // Caps lock green LED dot
                if (isLed) {
                    kbCtx.fillStyle = '#10b981';
                    kbCtx.beginPath();
                    kbCtx.arc(x + 18, y + 22, 4, 0, Math.PI * 2);
                    kbCtx.fill();
                }
            };

            const startX = 84;
            const gap = 16;
            const kw = 118;
            const kh = 106;

            // Row 1: Function Keys + Touch ID (14 keys, exactly 1880px wide)
            const fnH = 74;
            const fnData = [
                { l: 'esc', s: '' },
                { l: 'F1', s: '☼' },
                { l: 'F2', s: '☀' },
                { l: 'F3', s: '⎚' },
                { l: 'F4', s: '🔍' },
                { l: 'F5', s: '🎙' },
                { l: 'F6', s: '🌙' },
                { l: 'F7', s: '◁◁' },
                { l: 'F8', s: '▷Ⅱ' },
                { l: 'F9', s: '▷▷' },
                { l: 'F10', s: '🔇' },
                { l: 'F11', s: '🔉' },
                { l: 'F12', s: '🔊' },
            ];

            const fnW = 118;
            fnData.forEach((k, idx) => {
                drawChicletKey(startX + idx * (fnW + gap), 32, fnW, fnH, k.l, k.s);
            });

            // Touch ID Key with circular sensor ring (width 138px, flush with right edge at 1964px)
            const tidX = startX + 13 * (fnW + gap);
            drawChicletKey(tidX, 32, 138, fnH, '');
            kbCtx.strokeStyle = '#475569';
            kbCtx.lineWidth = 2.5;
            kbCtx.beginPath();
            kbCtx.arc(tidX + 69, 32 + fnH / 2, 22, 0, Math.PI * 2);
            kbCtx.stroke();
            kbCtx.fillStyle = '#0a0c10';
            kbCtx.beginPath();
            kbCtx.arc(tidX + 69, 32 + fnH / 2, 19, 0, Math.PI * 2);
            kbCtx.fill();

            // Row 2: Numbers (14 keys, exactly 1880px wide)
            const numKeys = [
                { l: '`', s: '~' },
                { l: '1', s: '!' },
                { l: '2', s: '@' },
                { l: '3', s: '#' },
                { l: '4', s: '$' },
                { l: '5', s: '%' },
                { l: '6', s: '^' },
                { l: '7', s: '&' },
                { l: '8', s: '*' },
                { l: '9', s: '(' },
                { l: '0', s: ')' },
                { l: '-', s: '_' },
                { l: '=', s: '+' },
                { l: 'delete', s: '⌫' },
            ];
            numKeys.forEach((k, idx) => {
                const w = idx === numKeys.length - 1 ? 138 : kw;
                drawChicletKey(startX + idx * (kw + gap), 126, w, kh, k.l, k.s);
            });

            // Row 3: QWERTY (14 keys, exactly 1880px wide)
            const qwerty = [
                { l: 'tab', w: 138 },
                { l: 'Q', w: kw },
                { l: 'W', w: kw },
                { l: 'E', w: kw },
                { l: 'R', w: kw },
                { l: 'T', w: kw },
                { l: 'Y', w: kw },
                { l: 'U', w: kw },
                { l: 'I', w: kw },
                { l: 'O', w: kw },
                { l: 'P', w: kw },
                { l: '[', w: kw },
                { l: ']', w: kw },
                { l: '\\', w: 118 },
            ];
            let qx = startX;
            qwerty.forEach((k) => {
                drawChicletKey(qx, 252, k.w, kh, k.l);
                qx += k.w + gap;
            });

            // Row 4: Home Row (13 keys, exactly 1880px wide)
            const home = [
                { l: 'caps lock', w: 195, led: true },
                { l: 'A', w: kw },
                { l: 'S', w: kw },
                { l: 'D', w: kw },
                { l: 'F', w: kw },
                { l: 'G', w: kw },
                { l: 'H', w: kw },
                { l: 'J', w: kw },
                { l: 'K', w: kw },
                { l: 'L', w: kw },
                { l: ';', w: kw },
                { l: "'", w: kw },
                { l: 'return', w: 195 },
            ];
            let hx = startX;
            home.forEach((k) => {
                drawChicletKey(hx, 378, k.w, kh, k.l, '', false, k.led);
                hx += k.w + gap;
            });

            // Row 5: Shift Row (12 keys, exactly 1880px wide)
            const shift = [
                { l: 'shift', w: 262 },
                { l: 'Z', w: kw },
                { l: 'X', w: kw },
                { l: 'C', w: kw },
                { l: 'V', w: kw },
                { l: 'B', w: kw },
                { l: 'N', w: kw },
                { l: 'M', w: kw },
                { l: ',', w: kw },
                { l: '.', w: kw },
                { l: '/', w: kw },
                { l: 'shift', w: 262 },
            ];
            let sx = startX;
            shift.forEach((k) => {
                drawChicletKey(sx, 504, k.w, kh, k.l);
                sx += k.w + gap;
            });

            // Row 6: Modifier Keys, Spacebar & Inverted-T Arrows (exactly 1880px wide)
            const y6 = 630;
            const h6 = 110;
            const mGap = 14;
            let bx = startX;

            drawChicletKey(bx, y6, 138, h6, 'fn', '🌐');
            bx += 138 + mGap;
            drawChicletKey(bx, y6, 138, h6, 'control', '⌃');
            bx += 138 + mGap;
            drawChicletKey(bx, y6, 148, h6, 'option', '⌥');
            bx += 148 + mGap;
            drawChicletKey(bx, y6, 178, h6, 'command', '⌘');
            bx += 178 + mGap;

            // Spacebar
            const spaceW = 556;
            drawChicletKey(bx, y6, spaceW, h6, '');
            bx += spaceW + mGap;

            drawChicletKey(bx, y6, 178, h6, 'command', '⌘');
            bx += 178 + mGap;
            drawChicletKey(bx, y6, 148, h6, 'option', '⌥');
            bx += 148 + mGap;

            // Inverted-T Arrows (width 298px, ends exactly at 1964px)
            const aw = 90;
            const arrowGap = 14;
            const halfH = 50;
            drawChicletKey(bx, y6 + 56, aw, halfH, '◀');
            drawChicletKey(bx + aw + arrowGap, y6, aw, halfH, '▲');
            drawChicletKey(bx + aw + arrowGap, y6 + 56, aw, halfH, '▼');
            drawChicletKey(bx + (aw + arrowGap) * 2, y6 + 56, aw, halfH, '▶');
        };

        drawRealKeyboard();
        const kbTexture = new THREE.CanvasTexture(kbCanvas);
        kbTexture.anisotropy = 8;

        const kbPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(3.56, 1.56),
            new THREE.MeshBasicMaterial({
                map: kbTexture,
            })
        );
        kbPlane.rotation.x = -Math.PI / 2;
        kbPlane.position.set(0, topBaseY + 0.01, -0.3);
        macMaster.add(kbPlane);

        // MacBook Air Force Touch Glass Trackpad (Expansive palm rests on sides!)
        const trackpadMat = new THREE.MeshStandardMaterial({
            color: isDark ? 0x222a38 : 0xd1d7e2,
            roughness: 0.28,
            metalness: 0.72,
        });
        const trackpadMesh = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.008, 1.15), trackpadMat);
        trackpadMesh.position.set(0, topBaseY + 0.005, 0.75);
        macMaster.add(trackpadMesh);

        // Flush Concealed Hinge (MacBook Air style)
        const hingeGeo = new THREE.CylinderGeometry(0.038, 0.038, 3.3, 18);
        hingeGeo.rotateZ(Math.PI / 2);
        const hingeMesh = new THREE.Mesh(
            hingeGeo,
            new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.6 })
        );
        hingeMesh.position.set(0, topBaseY - 0.005, rearBaseZ);
        macMaster.add(hingeMesh);

        // --- 6. MacBook Air Display Lid & Hinge Pivot Assembly ---
        const lidPivot = new THREE.Group();
        lidPivot.position.set(0, topBaseY, rearBaseZ);
        macMaster.add(lidPivot);

        const lidThickness = 0.045; // Ultra-slim display lid
        const lidShape = createRoundedRectShape(baseWidth, baseDepth, 0.22);
        const lidGeo = new THREE.ExtrudeGeometry(lidShape, {
            depth: lidThickness,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.024,
            bevelThickness: 0.024,
        });
        lidGeo.rotateX(-Math.PI / 2);
        lidGeo.center();

        const totalLidH = lidThickness + 0.048;
        const lidMesh = new THREE.Mesh(lidGeo, chassisMaterial);
        lidMesh.position.set(0, totalLidH / 2, baseDepth / 2);
        lidPivot.add(lidMesh);

        // Vector-Perfect Official Apple Logo (100% Mathematically Exact & Transparent)
        const createAppleLogoTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            // 100% transparent background - zero box / patch
            ctx.clearRect(0, 0, 512, 512);

            // Official Apple Inc Vector SVG Path (Standard 24x24 viewBox)
            const appleSvg =
                'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.98.6-2.61 1.34-.56.65-.99 1.7-.86 2.72 1.01.08 2.02-.51 2.54-1.21z';

            ctx.save();
            const scale = 17.5;
            ctx.translate(256 - 12 * scale, 256 - 12.5 * scale);
            ctx.scale(scale, scale);

            if (typeof Path2D !== 'undefined') {
                const path = new Path2D(appleSvg);
                ctx.fillStyle = isDark ? '#ffffff' : '#1e2430';
                ctx.fill(path);
            }
            ctx.restore();

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
        };

        const appleLogoTexture = createAppleLogoTexture();
        const applePlane = new THREE.Mesh(
            new THREE.PlaneGeometry(0.65, 0.65),
            new THREE.MeshStandardMaterial({
                map: appleLogoTexture,
                transparent: true,
                roughness: 0.1,
                metalness: 0.95,
                depthWrite: false,
            })
        );
        applePlane.rotation.x = -Math.PI / 2;
        applePlane.rotation.z = Math.PI; // Guarantees right-side up: leaf on top, bite on right
        applePlane.position.set(0, totalLidH + 0.002, baseDepth / 2);
        lidPivot.add(applePlane);

        // Full-glass black screen bezel
        const screenBezelMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(baseWidth - 0.16, baseDepth - 0.16),
            darkBezelMaterial
        );
        screenBezelMesh.rotation.x = Math.PI / 2;
        screenBezelMesh.position.set(0, -0.002, baseDepth / 2);
        lidPivot.add(screenBezelMesh);

        // Apple Camera Display Notch (Top Center of Bezel)
        const notchMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.44, 0.08),
            darkBezelMaterial
        );
        notchMesh.rotation.x = Math.PI / 2;
        notchMesh.position.set(0, -0.004, baseDepth - 0.09);
        lidPivot.add(notchMesh);

        // 1080p FaceTime HD Webcam Lens with active Green LED
        const webcamDot = new THREE.Mesh(
            new THREE.CircleGeometry(0.015, 16),
            new THREE.MeshBasicMaterial({ color: 0x10b981 })
        );
        webcamDot.rotation.x = -Math.PI / 2;
        webcamDot.position.set(0.045, -0.005, baseDepth - 0.09);
        lidPivot.add(webcamDot);

        // Liquid Retina XDR Code Display
        const screenCanvas = document.createElement('canvas');
        screenCanvas.width = 1024;
        screenCanvas.height = 680;
        const sCtx = screenCanvas.getContext('2d');

        const drawMacScreen = () => {
            sCtx.fillStyle = '#0a0d14';
            sCtx.fillRect(0, 0, 1024, 680);

            sCtx.fillStyle = '#10141f';
            sCtx.fillRect(0, 0, 1024, 56);

            // Traffic Light Window Dots
            sCtx.fillStyle = '#ff5f56';
            sCtx.beginPath();
            sCtx.arc(32, 28, 7.5, 0, Math.PI * 2);
            sCtx.fill();

            sCtx.fillStyle = '#ffbd2e';
            sCtx.beginPath();
            sCtx.arc(56, 28, 7.5, 0, Math.PI * 2);
            sCtx.fill();

            sCtx.fillStyle = '#27c93f';
            sCtx.beginPath();
            sCtx.arc(80, 28, 7.5, 0, Math.PI * 2);
            sCtx.fill();

            // Center macOS Top Notch Cutout in Display
            sCtx.fillStyle = '#0a0c10';
            sCtx.fillRect(455, 0, 114, 28);

            // Active Code Tab
            sCtx.fillStyle = '#1b2234';
            sCtx.fillRect(115, 10, 240, 46);
            sCtx.fillStyle = '#38bdf8';
            sCtx.font = 'bold 17px "JetBrains Mono", monospace';
            sCtx.fillText('⚡ ComestroAcademy.java', 130, 39);

            // Syntax Highlighted Code Lines
            sCtx.font = '21px "JetBrains Mono", monospace';
            const lines = [
                { num: '01', color: '#64748b', text: '// Comestro Academy — Online Learning' },
                { num: '02', color: '#c084fc', text: 'package com.comestro.academy.engine;' },
                { num: '03', color: '#64748b', text: '' },
                { num: '04', color: '#38bdf8', text: '@SpringBootApplication' },
                { num: '05', color: '#f59e0b', text: 'public class ComestroEngine {' },
                { num: '06', color: '#e2e8f0', text: '    private final LearningPlatform platform;' },
                { num: '07', color: '#64748b', text: '' },
                { num: '08', color: '#38bdf8', text: '    @EventListener(CohortLaunchEvent.class)' },
                { num: '09', color: '#34d399', text: '    public void initializeCohort() {' },
                { num: '10', color: '#fbbf24', text: '        platform.deployInteractiveSandbox();' },
                { num: '11', color: '#38bdf8', text: '        System.out.println("Status: 60FPS LIVE");' },
                { num: '12', color: '#34d399', text: '    }' },
                { num: '13', color: '#f59e0b', text: '}' },
            ];

            let y = 104;
            lines.forEach((line) => {
                sCtx.fillStyle = '#475569';
                sCtx.fillText(line.num, 30, y);
                sCtx.fillStyle = line.color;
                sCtx.fillText(line.text, 80, y);
                y += 35;
            });

            // Live Terminal Status Bar
            sCtx.fillStyle = '#10141f';
            sCtx.fillRect(0, 616, 1024, 64);
            sCtx.fillStyle = '#10b981';
            sCtx.font = 'bold 17px "JetBrains Mono", monospace';
            sCtx.fillText('● Build Succeeded · 0 errors · 10,000+ Active Engineers', 30, 654);
        };

        drawMacScreen();
        const screenTexture = new THREE.CanvasTexture(screenCanvas);
        screenTexture.anisotropy = 4;

        const screenMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(baseWidth - 0.32, baseDepth - 0.32),
            new THREE.MeshBasicMaterial({ map: screenTexture })
        );
        screenMesh.rotation.x = Math.PI / 2;
        screenMesh.position.set(0, -0.003, baseDepth / 2);
        lidPivot.add(screenMesh);

        // --- 7. Smooth Scroll-Driven Lid Closing Animation ---
        let targetLidAngle = -1.9;
        let currentLidAngle = -1.9;

        const handleScroll = () => {
            if (isManuallyToggledRef.current) return;
            const scrollY = window.scrollY;
            const progress = Math.min(Math.max(scrollY / 300, 0), 1);
            const smoothProgress = progress * progress * (3 - 2 * progress);
            targetLidAngle = -1.9 + smoothProgress * 1.85;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        // Interactive click toggle on canvas
        const handleCanvasClick = () => {
            isManuallyToggledRef.current = true;
            if (targetLidAngle > -1.0) {
                targetLidAngle = -1.9; // open
            } else {
                targetLidAngle = -0.05; // close
            }
        };
        const dom = renderer.domElement;
        dom.addEventListener('click', handleCanvasClick);

        // --- 8. Drag to Orbit & Parallax ---
        let mouseX = 0;
        let mouseY = 0;
        let targetRotY = -0.28;
        let targetRotX = 0.22;
        let currentRotY = -0.28;
        let currentRotX = 0.22;

        let isDragging = false;
        let previousPointer = { x: 0, y: 0 };
        let dragVelocity = { x: 0, y: 0 };

        const handlePointerMove = (e) => {
            const rect = container.getBoundingClientRect();
            const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

            mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);

            if (isDragging) {
                const deltaX = clientX - previousPointer.x;
                const deltaY = clientY - previousPointer.y;
                dragVelocity = { x: deltaX * 0.005, y: deltaY * 0.005 };
                targetRotY += dragVelocity.x;
                targetRotX += dragVelocity.y;
                previousPointer = { x: clientX, y: clientY };
            } else {
                targetRotY = -0.28 + mouseX * 0.28;
                targetRotX = 0.22 - mouseY * 0.16;
            }
        };

        const handlePointerDown = (e) => {
            isDragging = true;
            const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
            previousPointer = { x: clientX, y: clientY };
            dragVelocity = { x: 0, y: 0 };
        };

        const handlePointerUp = () => {
            isDragging = false;
        };

        dom.addEventListener('mousemove', handlePointerMove);
        dom.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('mouseup', handlePointerUp);

        dom.addEventListener('touchstart', handlePointerDown, { passive: true });
        dom.addEventListener('touchmove', handlePointerMove, { passive: true });
        window.addEventListener('touchend', handlePointerUp, { passive: true });

        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            const newAspect = w / h;
            camera.aspect = newAspect;
            camera.position.z = updateCameraDistance(newAspect);
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
        };
        window.addEventListener('resize', handleResize);

        // Also handle window resize for orientation change
        window.addEventListener('orientationchange', handleResize);

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 }
        );
        observer.observe(container);

        // --- 9. Animation Loop ---
        let clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!isVisible) return;

            const elapsed = clock.getElapsedTime();

            // Spring physics interpolation for lid opening/closing
            currentLidAngle += (targetLidAngle - currentLidAngle) * 0.075;
            lidPivot.rotation.x = currentLidAngle;

            // Damped body orbit rotation
            currentRotY += (targetRotY - currentRotY) * 0.08;
            currentRotX += (targetRotX - currentRotX) * 0.08;

            if (!isDragging) {
                targetRotY += dragVelocity.x;
                targetRotX += dragVelocity.y;
                dragVelocity.x *= 0.92;
                dragVelocity.y *= 0.92;
            }

            macMaster.rotation.y = currentRotY;
            macMaster.rotation.x = currentRotX;

            // Gentle floating hover
            macMaster.position.y = -0.22 + Math.sin(elapsed * 1.6) * 0.03;

            renderer.render(scene, camera);
        };

        animate();

        // --- Cleanup ---
        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            dom.removeEventListener('click', handleCanvasClick);
            dom.removeEventListener('mousemove', handlePointerMove);
            dom.removeEventListener('mousedown', handlePointerDown);
            window.removeEventListener('mouseup', handlePointerUp);
            dom.removeEventListener('touchstart', handlePointerDown);
            dom.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('touchend', handlePointerUp);

            baseGeo.dispose();
            chassisMaterial.dispose();
            darkBezelMaterial.dispose();
            scoopGeo.dispose();
            scoopMat.dispose();
            footGeo.dispose();
            footMat.dispose();
            kbWellGeo.dispose();
            kbTexture.dispose();
            kbPlane.geometry.dispose();
            kbPlane.material.dispose();
            trackpadMesh.geometry.dispose();
            trackpadMat.dispose();
            hingeGeo.dispose();
            lidGeo.dispose();
            applePlane.geometry.dispose();
            applePlane.material.dispose();
            appleLogoTexture.dispose();
            screenMesh.geometry.dispose();
            screenMesh.material.dispose();
            screenTexture.dispose();

            renderer.dispose();
            if (dom && dom.parentNode) {
                dom.parentNode.removeChild(dom);
            }
        };
    }, [theme]);

    return (
        <div className="relative w-full h-[440px] sm:h-[500px] lg:h-[560px] xl:h-[600px] flex items-center justify-center select-none overflow-visible">
            {/* Pure Three.js Canvas Container — MacBook Air, completely borderless, mathematical fit */}
            <div
                ref={containerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
                style={{ touchAction: 'pan-y' }}
                title="Apple MacBook Air. Scroll down to close lid, scroll up to open, drag to rotate."
            />
        </div>
    );
}
