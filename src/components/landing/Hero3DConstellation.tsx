import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DConstellationProps {
  onNodeClick?: () => void;
  className?: string;
}

export const Hero3DConstellation: React.FC<Hero3DConstellationProps> = ({ onNodeClick, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x051F20, 0.025);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x051F20, 0); // transparent so CSS background shows
    container.appendChild(renderer.domElement);

    // Color tokens
    const COLOR_MOSS = new THREE.Color(0x235347);
    const COLOR_SAGE = new THREE.Color(0x8EB69B);
    const COLOR_MINT = new THREE.Color(0xDAF1DE);
    const COLOR_GLOW_MINT = new THREE.Color(0x5FD3A0);
    const COLOR_CORAL = new THREE.Color(0xF0506E);

    // 2. Node definitions (Constellation)
    const nodeCount = 36;
    const nodes: {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      mesh: THREE.Mesh;
      baseColor: THREE.Color;
      isSuspicious: boolean;
      role: 'agent' | 'owner' | 'counterparty';
    }[] = [];

    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);

    for (let i = 0; i < nodeCount; i++) {
      // Cluster some together for circular loop
      const isSuspiciousLoop = i >= 30 && i <= 32;
      let pos: THREE.Vector3;

      if (isSuspiciousLoop) {
        // Tight triangle on the right
        const angle = ((i - 30) / 3) * Math.PI * 2;
        pos = new THREE.Vector3(
          6 + Math.cos(angle) * 2.2,
          -1 + Math.sin(angle) * 2.2,
          (Math.random() - 0.5) * 2
        );
      } else {
        // Organic constellation distribution
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 11;
        const sinPhi = Math.sin(phi);
        pos = new THREE.Vector3(
          r * sinPhi * Math.cos(theta),
          r * sinPhi * Math.sin(theta) * 0.7,
          r * Math.cos(phi) * 0.8
        );
      }

      const role = i % 4 === 0 ? 'owner' : i % 3 === 0 ? 'counterparty' : 'agent';
      const baseColor = isSuspiciousLoop ? COLOR_CORAL : role === 'agent' ? COLOR_GLOW_MINT : role === 'owner' ? COLOR_MOSS : COLOR_SAGE;

      const mat = new THREE.MeshBasicMaterial({
        color: baseColor,
        wireframe: false
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.copy(pos);

      // Add small outer halo
      const haloGeo = new THREE.SphereGeometry(0.55, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.25,
        wireframe: true
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(halo);

      nodeGroup.add(mesh);

      nodes.push({
        position: pos,
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.005, (Math.random() - 0.5) * 0.005, (Math.random() - 0.5) * 0.005),
        mesh,
        baseColor,
        isSuspicious: isSuspiciousLoop,
        role
      });
    }

    // 3. Edges & Connections
    const edgeLines: {
      line: THREE.Line;
      nodeA: number;
      nodeB: number;
      isSuspicious: boolean;
      pulseProgress: number;
      pulseMesh?: THREE.Mesh;
    }[] = [];

    const lineMatNormal = new THREE.LineBasicMaterial({
      color: COLOR_MOSS,
      transparent: true,
      opacity: 0.35
    });

    const lineMatSuspicious = new THREE.LineBasicMaterial({
      color: COLOR_CORAL,
      transparent: true,
      opacity: 0.85
    });

    // Connect close neighbors
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        const isLoopLink = nodes[i].isSuspicious && nodes[j].isSuspicious;

        if (isLoopLink || dist < 4.8) {
          const points = [nodes[i].position, nodes[j].position];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, isLoopLink ? lineMatSuspicious : lineMatNormal);
          scene.add(line);

          // Add animated light pulse mesh that travels along this link
          let pulseMesh: THREE.Mesh | undefined;
          if (isLoopLink || Math.random() < 0.4) {
            const pGeo = new THREE.SphereGeometry(0.12, 8, 8);
            const pMat = new THREE.MeshBasicMaterial({
              color: isLoopLink ? COLOR_CORAL : COLOR_GLOW_MINT
            });
            pulseMesh = new THREE.Mesh(pGeo, pMat);
            scene.add(pulseMesh);
          }

          edgeLines.push({
            line,
            nodeA: i,
            nodeB: j,
            isSuspicious: isLoopLink,
            pulseProgress: Math.random(),
            pulseMesh
          });
        }
      }
    }

    // 4. Glow Mint Scan Ring
    const ringGeo = new THREE.RingGeometry(0.2, 0.45, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLOR_GLOW_MINT,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const scanRing = new THREE.Mesh(ringGeo, ringMat);
    scanRing.position.set(6, -1, 0);
    scene.add(scanRing);

    // 5. Parallax Mouse Listener
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Camera parallax
      if (!prefersReducedMotion) {
        camera.position.x += (mouseX * 4 - camera.position.x) * 0.03;
        camera.position.y += (mouseY * 3 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        // Constellation gentle rotation
        nodeGroup.rotation.y = elapsedTime * 0.04;
        nodeGroup.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;
      }

      // Animated light pulses on edges
      edgeLines.forEach(edge => {
        if (!edge.pulseMesh) return;
        const posA = nodes[edge.nodeA].mesh.position;
        const posB = nodes[edge.nodeB].mesh.position;
        
        edge.pulseProgress = (edge.pulseProgress + (edge.isSuspicious ? 0.012 : 0.007)) % 1;
        edge.pulseMesh.position.lerpVectors(posA, posB, edge.pulseProgress);
      });

      // Scan ring sweep animation
      const ringScale = (Math.sin(elapsedTime * 1.5) + 1) * 3 + 1;
      scanRing.scale.set(ringScale, ringScale, 1);
      ringMat.opacity = Math.max(0.1, 0.8 - (ringScale / 8));

      // Suspicious loop color pulse
      const coralPulse = 0.5 + Math.sin(elapsedTime * 4) * 0.5;
      nodes.filter(n => n.isSuspicious).forEach(n => {
        (n.mesh.material as THREE.MeshBasicMaterial).color.setRGB(
          0.94,
          0.31 + coralPulse * 0.2,
          0.43
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden ${className}`}
      onClick={onNodeClick}
    />
  );
};
