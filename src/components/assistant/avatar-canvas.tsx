"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type AvatarMood = "intro" | "docking" | "idle" | "thinking" | "speaking" | "listening";
export type AvatarVariant = "intro" | "orb";

interface AvatarCanvasProps {
  mood: AvatarMood;
  variant?: AvatarVariant;
  hovered?: boolean;
  transitionKey?: number;
  className?: string;
}

interface PaletteColors {
  isDark: boolean;
  shell: string;
  shellTrim: string;
  visor: string;
  accent: string;
  sky: string;
  violet: string;
  ok: string;
}

function readThemePalette(): PaletteColors {
  if (typeof document === "undefined") {
    return {
      isDark: true,
      shell: "#242422",
      shellTrim: "#3a3936",
      visor: "#0b0d12",
      accent: "#e9a15b",
      sky: "#8db6dc",
      violet: "#b4a4e2",
      ok: "#8fbf88",
    };
  }

  const root = document.documentElement;
  const isDark = root.dataset.theme !== "light";
  const styles = getComputedStyle(root);
  const pick = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;

  return {
    isDark,
    shell: isDark ? "#232321" : "#f4f1ea",
    shellTrim: isDark ? "#3c3a35" : "#d4cfc4",
    visor: "#0c0e14",
    accent: pick("--accent", isDark ? "#e9a15b" : "#9a4f14"),
    sky: pick("--sky", isDark ? "#8db6dc" : "#245f8f"),
    violet: pick("--violet", isDark ? "#b4a4e2" : "#5b45a8"),
    ok: pick("--ok", isDark ? "#8fbf88" : "#3a7134"),
  };
}

function disposeSceneResources(scene: THREE.Scene) {
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
      obj.geometry.dispose();
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of materials) {
        mat.dispose();
      }
    }
  });
}

/**
 * Lifelike Three.js 3D Avatar:
 * - Organic chest breathing, torso lean, head curiosity, and spring-lagged antenna sway
 * - Expressive blinking & mood-reactive optics (`intro`, `idle`, `listening`, `thinking`, `speaking`, `docking`)
 * - 3D ambient particle halo & reactive orbital rings
 */
export function AvatarCanvas({
  mood,
  variant = "intro",
  hovered = false,
  transitionKey = 0,
  className = "",
}: AvatarCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<AvatarMood>(mood);
  const variantRef = useRef<AvatarVariant>(variant);
  const hoveredRef = useRef<boolean>(hovered);
  const spinVelocityRef = useRef<number>(0);
  const scalePulseRef = useRef<number>(0);

  useEffect(() => {
    const prevMood = moodRef.current;
    moodRef.current = mood;
    if (mood === "intro" && prevMood !== "intro") {
      spinVelocityRef.current = Math.PI * 0.5;
    } else if (mood === "docking" && prevMood !== "docking") {
      spinVelocityRef.current = Math.PI * 0.75;
    } else if (mood === "speaking" && prevMood !== "speaking") {
      scalePulseRef.current = 0.06;
    } else if (mood === "listening" && prevMood === "idle") {
      scalePulseRef.current = 0.06;
    }
  }, [mood]);

  useEffect(() => {
    variantRef.current = variant;
  }, [variant]);

  useEffect(() => {
    hoveredRef.current = hovered;
    if (hovered) {
      scalePulseRef.current = Math.max(scalePulseRef.current, 0.065);
    }
  }, [hovered]);

  useEffect(() => {
    if (transitionKey > 0) {
      spinVelocityRef.current = Math.PI * 0.85;
      scalePulseRef.current = 0.18;
    }
  }, [transitionKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = readThemePalette();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      const fallback = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      fallback.setAttribute("viewBox", "0 0 64 64");
      fallback.setAttribute("class", "pointer-events-none h-2/3 w-2/3 text-accent m-auto");
      fallback.innerHTML =
        '<circle cx="32" cy="30" r="18" stroke="currentColor" stroke-width="2.5" fill="none"/><rect x="20" y="23" width="24" height="12" rx="6" fill="currentColor" opacity="0.2"/><circle cx="26" cy="29" r="2.5" fill="currentColor"/><circle cx="38" cy="29" r="2.5" fill="currentColor"/>';
      container.classList.add("grid", "place-items-center");
      container.appendChild(fallback);
      return () => {
        fallback.remove();
        container.classList.remove("grid", "place-items-center");
      };
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.22, variantRef.current === "orb" ? 3.55 : 4.15);
    camera.lookAt(0, 0.12, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, palette.isDark ? 1.2 : 1.48);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.25);
    keyLight.position.set(2.8, 3.6, 4.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(palette.sky, 1.9);
    rimLight.position.set(-3.2, 1.4, -2.5);
    scene.add(rimLight);

    const accentFill = new THREE.PointLight(palette.accent, 2.5, 8);
    accentFill.position.set(1.8, -0.4, 2.4);
    scene.add(accentFill);

    // Materials
    const shellMat = new THREE.MeshStandardMaterial({
      color: palette.shell,
      roughness: 0.3,
      metalness: 0.45,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: palette.shellTrim,
      roughness: 0.25,
      metalness: 0.7,
    });
    const visorMat = new THREE.MeshStandardMaterial({
      color: palette.visor,
      roughness: 0.09,
      metalness: 0.88,
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: palette.sky,
      emissive: palette.sky,
      emissiveIntensity: 2.0,
      roughness: 0.2,
    });
    const accentGlowMat = new THREE.MeshStandardMaterial({
      color: palette.accent,
      emissive: palette.accent,
      emissiveIntensity: 1.8,
      roughness: 0.25,
    });
    const violetGlowMat = new THREE.MeshStandardMaterial({
      color: palette.violet,
      emissive: palette.violet,
      emissiveIntensity: 1.45,
      roughness: 0.25,
    });
    const okGlowMat = new THREE.MeshStandardMaterial({
      color: palette.ok,
      emissive: palette.ok,
      emissiveIntensity: 1.6,
      roughness: 0.25,
    });

    const avatarRoot = new THREE.Group();
    scene.add(avatarRoot);

    if (moodRef.current === "intro" && !reducedMotion) {
      spinVelocityRef.current = Math.PI * 0.65;
      avatarRoot.scale.setScalar(0.65);
    }

    // Torso / Bust (breathes & leans gently)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.78, 0);
    avatarRoot.add(torsoGroup);

    const torsoGeo = new THREE.CylinderGeometry(0.42, 0.58, 0.72, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, shellMat);
    torsoGroup.add(torsoMesh);

    const collarGeo = new THREE.TorusGeometry(0.41, 0.055, 16, 40);
    const collarMesh = new THREE.Mesh(collarGeo, trimMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 0.34;
    torsoGroup.add(collarMesh);

    const coreFrameGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 6);
    const coreFrame = new THREE.Mesh(coreFrameGeo, trimMat);
    coreFrame.rotation.x = Math.PI / 2;
    coreFrame.position.set(0, 0.05, 0.48);
    torsoGroup.add(coreFrame);

    const coreGlowGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 6);
    const coreGlow = new THREE.Mesh(coreGlowGeo, accentGlowMat);
    coreGlow.rotation.x = Math.PI / 2;
    coreGlow.position.set(0, 0.05, 0.495);
    torsoGroup.add(coreGlow);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.24, 0);
    avatarRoot.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.68, 40, 32);
    const headMesh = new THREE.Mesh(headGeo, shellMat);
    headMesh.scale.set(1.06, 0.94, 0.98);
    headGroup.add(headMesh);

    const visorRimGeo = new THREE.TorusGeometry(0.51, 0.042, 16, 48);
    const visorRim = new THREE.Mesh(visorRimGeo, trimMat);
    visorRim.position.set(0, 0.01, 0.32);
    visorRim.scale.set(1.06, 0.72, 0.85);
    headGroup.add(visorRim);

    const visorGeo = new THREE.SphereGeometry(0.57, 36, 28, 0, Math.PI * 2, 0.28 * Math.PI, 0.44 * Math.PI);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.scale.set(1.02, 0.88, 0.92);
    visorMesh.position.set(0, 0.01, 0.16);
    headGroup.add(visorMesh);

    // Subtle glowing cheek accents inside visor edges
    const cheekGeo = new THREE.SphereGeometry(0.032, 12, 12);
    const leftCheek = new THREE.Mesh(cheekGeo, accentGlowMat);
    leftCheek.scale.set(1.4, 0.55, 0.6);
    leftCheek.position.set(-0.34, -0.05, 0.54);
    headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, accentGlowMat);
    rightCheek.scale.set(1.4, 0.55, 0.6);
    rightCheek.position.set(0.34, -0.05, 0.54);
    headGroup.add(rightCheek);

    const eyeGeo = new THREE.CapsuleGeometry(0.062, 0.08, 10, 18);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 0.08, 0.62);
    leftEye.rotation.z = 0.08;
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.2, 0.08, 0.62);
    rightEye.rotation.z = -0.08;
    headGroup.add(rightEye);

    // Voice Equalizer
    const eqGroup = new THREE.Group();
    eqGroup.position.set(0, -0.14, 0.635);
    headGroup.add(eqGroup);

    const eqBars: THREE.Mesh[] = [];
    const barGeo = new THREE.BoxGeometry(0.036, 0.06, 0.025);
    for (let i = 0; i < 5; i += 1) {
      const bar = new THREE.Mesh(barGeo, accentGlowMat);
      bar.position.x = (i - 2) * 0.068;
      eqGroup.add(bar);
      eqBars.push(bar);
    }

    // Ear Pods
    const earGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 24);
    const leftEar = new THREE.Mesh(earGeo, trimMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.71, 0.02, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, trimMat);
    rightEar.rotation.z = Math.PI / 2;
    rightEar.position.set(0.71, 0.02, 0);
    headGroup.add(rightEar);

    const earRingGeo = new THREE.TorusGeometry(0.11, 0.02, 12, 24);
    const leftEarRing = new THREE.Mesh(earRingGeo, violetGlowMat);
    leftEarRing.rotation.y = Math.PI / 2;
    leftEarRing.position.set(-0.77, 0.02, 0);
    headGroup.add(leftEarRing);

    const rightEarRing = new THREE.Mesh(earRingGeo, violetGlowMat);
    rightEarRing.rotation.y = Math.PI / 2;
    rightEarRing.position.set(0.77, 0.02, 0);
    headGroup.add(rightEarRing);

    // Spring-lagged Antenna Pivot
    const antennaPivot = new THREE.Group();
    antennaPivot.position.set(0, 0.6, -0.02);
    headGroup.add(antennaPivot);

    const stemGeo = new THREE.CylinderGeometry(0.022, 0.032, 0.28, 12);
    const antennaStem = new THREE.Mesh(stemGeo, trimMat);
    antennaStem.position.set(0, 0.12, 0);
    antennaPivot.add(antennaStem);

    const tipGeo = new THREE.SphereGeometry(0.068, 18, 18);
    const antennaTip = new THREE.Mesh(tipGeo, okGlowMat);
    antennaTip.position.set(0, 0.28, 0);
    antennaPivot.add(antennaTip);

    // Waving Arm
    const armPivot = new THREE.Group();
    armPivot.position.set(0.68, -0.62, 0.1);
    avatarRoot.add(armPivot);

    const forearmGeo = new THREE.CapsuleGeometry(0.08, 0.28, 10, 16);
    const forearm = new THREE.Mesh(forearmGeo, shellMat);
    forearm.position.set(0.14, 0.2, 0.04);
    forearm.rotation.z = -0.45;
    armPivot.add(forearm);

    const palmGeo = new THREE.SphereGeometry(0.115, 20, 20);
    const palm = new THREE.Mesh(palmGeo, trimMat);
    palm.scale.set(1.0, 1.15, 0.75);
    palm.position.set(0.26, 0.42, 0.08);
    armPivot.add(palm);

    const palmCoreGeo = new THREE.SphereGeometry(0.05, 14, 14);
    const palmCore = new THREE.Mesh(palmCoreGeo, accentGlowMat);
    palmCore.position.set(0.26, 0.42, 0.14);
    armPivot.add(palmCore);

    // Orbital Rings & Microservice Nodes
    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0, 0.1, -0.1);
    avatarRoot.add(orbitGroup);

    const ring1Geo = new THREE.TorusGeometry(1.12, 0.012, 10, 72);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: palette.accent,
      transparent: true,
      opacity: 0.36,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.set(1.22, 0.35, 0);
    orbitGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.28, 0.01, 10, 72);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: palette.sky,
      transparent: true,
      opacity: 0.28,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.set(1.38, -0.45, 0.2);
    orbitGroup.add(ring2);

    const nodeGeo = new THREE.SphereGeometry(0.05, 14, 14);
    const nodeAccent = new THREE.Mesh(nodeGeo, accentGlowMat);
    const nodeSky = new THREE.Mesh(nodeGeo, eyeMat);
    const nodeViolet = new THREE.Mesh(nodeGeo, violetGlowMat);
    orbitGroup.add(nodeAccent, nodeSky, nodeViolet);

    // 3D Ambient Particle Aura
    const particleCount = 28;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 1.38 + (i % 3) * 0.14;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.72;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: palette.accent,
      size: 0.036,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    avatarRoot.add(particles);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / Math.max(window.innerWidth * 0.35, 180);
      const ny = -(e.clientY - cy) / Math.max(window.innerHeight * 0.35, 180);
      pointer.targetX = THREE.MathUtils.clamp(nx, -1.1, 1.1);
      pointer.targetY = THREE.MathUtils.clamp(ny, -0.9, 0.9);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const syncTheme = () => {
      const next = readThemePalette();
      ambient.intensity = next.isDark ? 1.2 : 1.48;
      shellMat.color.set(next.shell);
      trimMat.color.set(next.shellTrim);
      eyeMat.color.set(next.sky);
      eyeMat.emissive.set(next.sky);
      accentGlowMat.color.set(next.accent);
      accentGlowMat.emissive.set(next.accent);
      violetGlowMat.color.set(next.violet);
      violetGlowMat.emissive.set(next.violet);
      okGlowMat.color.set(next.ok);
      okGlowMat.emissive.set(next.ok);
      ring1Mat.color.set(next.accent);
      ring2Mat.color.set(next.sky);
      particleMat.color.set(next.accent);
      rimLight.color.set(next.sky);
      accentFill.color.set(next.accent);
    };

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const updateSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 0 || height <= 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    const handleContextLost = (event: Event) => {
      event.preventDefault();
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);

    let rafId = 0;
    const clock = new THREE.Clock();
    let nextBlinkAt = 1.9;
    let bodySpinAngle = 0;
    let armVisibilityBlend = variantRef.current === "intro" ? 1 : 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const activeMood = moodRef.current;
      const activeVariant = variantRef.current;
      const isHovered = hoveredRef.current;
      const motionScale = reducedMotion ? 0.12 : 1;

      const smoothLerp = 1 - Math.exp(-5.5 * dt);
      const targetZ = activeVariant === "orb" ? 3.8 : 4.15;
      const targetY = activeVariant === "orb" ? 0.2 : 0.18;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, smoothLerp);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, smoothLerp);
      camera.lookAt(0, 0.1, 0);

      if (!reducedMotion && Math.abs(spinVelocityRef.current) > 0.01) {
        const step = spinVelocityRef.current * Math.min(1, dt * 4.4);
        bodySpinAngle += step;
        spinVelocityRef.current -= step;
      } else {
        spinVelocityRef.current = 0;
        bodySpinAngle = THREE.MathUtils.lerp(bodySpinAngle, 0, 0.08);
      }

      scalePulseRef.current = THREE.MathUtils.lerp(scalePulseRef.current, 0, 0.08);
      const hoverScale = isHovered ? 0.055 : 0;
      const targetScale = 1 + scalePulseRef.current + hoverScale;
      const nextScale = THREE.MathUtils.lerp(avatarRoot.scale.x, targetScale, 0.1);
      avatarRoot.scale.setScalar(nextScale);

      // Organic breathing & floating
      const breath = Math.sin(t * 2.1);
      const floatAmp = activeMood === "intro" ? 0.065 : 0.045;
      avatarRoot.position.y = Math.sin(t * 1.65) * floatAmp * motionScale;
      avatarRoot.rotation.y = bodySpinAngle + Math.sin(t * 0.7) * 0.055 * motionScale;

      torsoGroup.scale.y = 1 + breath * 0.028 * motionScale;
      torsoGroup.scale.x = 1 - breath * 0.014 * motionScale;

      pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.targetX, 0.09);
      pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.targetY, 0.09);

      // Subtle torso lean following cursor
      torsoGroup.rotation.y = THREE.MathUtils.lerp(torsoGroup.rotation.y, pointer.x * 0.12, 0.08);
      torsoGroup.rotation.x = THREE.MathUtils.lerp(torsoGroup.rotation.x, -pointer.y * 0.06, 0.08);

      // Expressive head pose per mood + subtle curious head tilt
      let targetYaw = pointer.x * 0.38;
      let targetPitch = -pointer.y * 0.22;
      let targetRoll = Math.sin(t * 0.55) * 0.03 * motionScale;

      if (activeMood === "intro") {
        targetYaw += Math.sin(t * 1.45) * 0.14 * motionScale;
        targetPitch += Math.sin(t * 2.8) * 0.05 * motionScale;
      } else if (activeMood === "docking") {
        targetYaw = 0.35;
        targetPitch = 0.2;
        targetRoll = -0.14;
      } else if (activeMood === "thinking") {
        targetYaw = 0.22 + Math.sin(t * 2.1) * 0.16 * motionScale;
        targetPitch = -0.14 + Math.cos(t * 1.7) * 0.05 * motionScale;
        targetRoll = 0.12;
      } else if (activeMood === "speaking") {
        targetPitch += Math.sin(t * 6.5) * 0.055 * motionScale;
        targetRoll = Math.sin(t * 2.4) * 0.055 * motionScale;
      } else if (activeMood === "listening") {
        targetPitch += 0.08;
        targetRoll = -0.07;
      }

      const prevHeadYaw = headGroup.rotation.y;
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetYaw, 0.11);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetPitch, 0.11);
      headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetRoll, 0.09);

      // Spring-lagged antenna sway reacting to head turn
      const yawDelta = headGroup.rotation.y - prevHeadYaw;
      antennaPivot.rotation.z = THREE.MathUtils.lerp(
        antennaPivot.rotation.z,
        -headGroup.rotation.z * 0.9 - yawDelta * 3.5 + Math.sin(t * 2.6) * 0.05 * motionScale,
        0.14,
      );
      antennaPivot.rotation.x = THREE.MathUtils.lerp(
        antennaPivot.rotation.x,
        -headGroup.rotation.x * 0.6 + Math.cos(t * 2.2) * 0.04 * motionScale,
        0.14,
      );

      // Natural blinking + mood-expressive eyes
      let eyeScaleY = activeMood === "thinking" ? 0.72 : 1;
      const eyeScaleX = isHovered ? 1.12 : 1;
      if (!reducedMotion && t >= nextBlinkAt) {
        const blinkProgress = (t - nextBlinkAt) / 0.13;
        if (blinkProgress < 1) {
          eyeScaleY = Math.max(0.1, Math.abs(Math.cos(blinkProgress * Math.PI)));
        } else {
          nextBlinkAt = t + (Math.random() < 0.25 ? 0.28 : 2.3 + Math.random() * 2.4);
        }
      }
      leftEye.scale.set(eyeScaleX, eyeScaleY, 1);
      rightEye.scale.set(eyeScaleX, eyeScaleY, 1);

      if (activeMood === "thinking") {
        eyeMat.emissiveIntensity = 1.55 + Math.sin(t * 7.5) * 0.65;
        okGlowMat.emissiveIntensity = 2.4 + Math.sin(t * 8.5) * 0.85;
        rimLight.color.set(paletteColor(activeMood));
      } else {
        eyeMat.emissiveIntensity = isHovered ? 2.45 : 2.0;
        okGlowMat.emissiveIntensity = 1.55 + Math.sin(t * 2.6) * 0.3;
        rimLight.color.set(readCurrentSky());
      }
      accentGlowMat.emissiveIntensity =
        activeMood === "speaking" ? 2.1 + Math.sin(t * 9.0) * 0.45 : 1.7 + Math.sin(t * 3.0) * 0.3;

      const isSpeaking = activeMood === "intro" || activeMood === "speaking";
      eqBars.forEach((bar, idx) => {
        if (isSpeaking && !reducedMotion) {
          bar.scale.y = 0.45 + 1.05 * Math.abs(Math.sin(t * 11.5 + idx * 0.95));
        } else if (activeMood === "thinking" && !reducedMotion) {
          bar.scale.y = 0.35 + 0.55 * Math.max(0, Math.sin(t * 5.8 - idx * 0.7));
        } else {
          bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, 0.28, 0.15);
        }
      });

      const targetArmBlend = activeVariant === "intro" && activeMood === "intro" ? 1 : 0;
      armVisibilityBlend = THREE.MathUtils.lerp(armVisibilityBlend, targetArmBlend, 1 - Math.exp(-6.5 * dt));
      armPivot.visible = armVisibilityBlend > 0.03;
      armPivot.scale.setScalar(armVisibilityBlend);
      if (armPivot.visible && !reducedMotion) {
        armPivot.rotation.z = Math.sin(t * 5.8) * 0.34 + 0.18;
        armPivot.rotation.x = Math.cos(t * 2.9) * 0.08;
      }

      const orbitSpeed = activeMood === "thinking" ? 2.1 : activeMood === "docking" ? 2.4 : isHovered ? 1.35 : 0.85;
      if (!reducedMotion) {
        ring1.rotation.z += 0.005 * orbitSpeed;
        ring2.rotation.z -= 0.0035 * orbitSpeed;
        orbitGroup.rotation.x = pointer.y * 0.15;
        orbitGroup.rotation.y = pointer.x * 0.18;
        particles.rotation.y += 0.0022 * orbitSpeed;
        particles.rotation.x = Math.sin(t * 0.4) * 0.1;
      }
      particleMat.opacity = activeVariant === "intro" ? 0.55 : 0.3;

      const angle1 = t * 1.2 * orbitSpeed * (reducedMotion ? 0.1 : 1);
      nodeAccent.position.set(Math.cos(angle1) * 1.12, Math.sin(angle1) * 0.36, Math.sin(angle1) * 0.95);

      const angle2 = -t * 0.95 * orbitSpeed * (reducedMotion ? 0.1 : 1) + 2.1;
      nodeSky.position.set(Math.cos(angle2) * 1.26, Math.sin(angle2) * -0.4, Math.sin(angle2) * 1.05);

      const angle3 = t * 0.78 * orbitSpeed * (reducedMotion ? 0.1 : 1) + 4.2;
      nodeViolet.position.set(Math.cos(angle3) * 1.18, Math.cos(angle3) * 0.42, Math.sin(angle3) * 0.92);

      renderer.render(scene, camera);
    };

    const readCurrentSky = () => readThemePalette().sky;
    const paletteColor = (m: AvatarMood) => (m === "thinking" ? readThemePalette().violet : readThemePalette().sky);

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      disposeSceneResources(scene);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`pointer-events-none relative select-none ${className}`} aria-hidden />;
}
