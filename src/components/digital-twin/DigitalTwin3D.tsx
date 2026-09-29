'use client';

import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TelemetryPoint, RiskAssessment, Well } from '@/types/nwis';
import { ACTIVE_WELL, OFFSET_WELLS } from '@/data/wells';
import { Box as BoxIcon, Eye, RotateCcw, Layers, AlertTriangle } from 'lucide-react';

interface DigitalTwin3DProps {
  telemetry: TelemetryPoint;
  riskAssessment: RiskAssessment;
}

// 3D Active Drill Bit Mesh
function ActiveBitMesh({ position, isCritical }: { position: [number, number, number]; isCritical: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group position={position}>
      {/* Bit Body */}
      <mesh ref={meshRef}>
        <coneGeometry args={[1.2, 3, 16]} />
        <meshStandardMaterial color={isCritical ? '#ef4444' : '#06b6d4'} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Bit Glow Aura */}
      <mesh>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial
          color={isCritical ? '#ef4444' : '#06b6d4'}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// 3D Well Trajectory Tube
function WellTrajectoryTube({
  points,
  color,
  lineWidth = 0.8,
  label,
}: {
  points: { x: number; y: number; z: number }[];
  color: string;
  lineWidth?: number;
  label?: string;
}) {
  const curve = React.useMemo(() => {
    const vectorPoints = points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    return new THREE.CatmullRomCurve3(vectorPoints);
  }, [points]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 64, lineWidth, 8, false]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>
      {label && (
        <Html position={[points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].z]}>
          <div className="bg-slate-950/90 text-cyan-300 border border-slate-700 text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap shadow-md">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Subsurface Formation Stratigraphy Planes
function FormationPlanes({ showFormations }: { showFormations: boolean }) {
  if (!showFormations) return null;

  return (
    <group>
      {/* Barail Coal-Shale Plane */}
      <mesh position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#a855f7" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Kopili Shale Hazard Layer Plane (Red Tinted) */}
      <mesh position={[0, -45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Sylhet Limestone Plane */}
      <mesh position={[0, -75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Subsurface Fault Plane
function SubsurfaceFaultPlane() {
  return (
    <mesh position={[20, -40, -10]} rotation={[0.4, 0.2, -0.5]}>
      <planeGeometry args={[140, 100]} />
      <meshBasicMaterial color="#f43f5e" transparent opacity={0.12} wireframe side={THREE.DoubleSide} />
    </mesh>
  );
}

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({ telemetry, riskAssessment }) => {
  const [showFormations, setShowFormations] = useState<boolean>(true);
  const [showRiskRibbon, setShowRiskRibbon] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'ISO' | 'TOP' | 'FRONT'>('ISO');

  // Convert depth to 3D Y coordinate (-20 to -65)
  const bitY = -20 - ((telemetry.depth - 3145) / 80) * 45;
  const isCritical = riskAssessment.level === 'CRITICAL' || riskAssessment.level === 'CAUTION';

  // Trajectory 3D paths mapping
  const activePath = [
    { x: 0, y: 30, z: 0 },
    { x: 2, y: 0, z: 2 },
    { x: 8, y: -20, z: 6 },
    { x: 15, y: -45, z: 12 },
    { x: 22, y: -75, z: 18 },
  ];

  const offset1Path = [
    { x: -35, y: 30, z: 40 },
    { x: -32, y: 0, z: 41 },
    { x: -25, y: -45, z: 45 },
    { x: -18, y: -75, z: 50 },
  ];

  const offset2Path = [
    { x: 20, y: 30, z: -55 },
    { x: 18, y: 0, z: -52 },
    { x: 12, y: -45, z: -48 },
    { x: 8, y: -75, z: -45 },
  ];

  return (
    <div className="space-y-3 text-slate-100">
      {/* 3D Scene Controls Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BoxIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              3D SUBSURFACE DIGITAL TWIN & WELL TRAJECTORIES
            </h2>
            <p className="text-xs text-slate-400">
              Active Bit Depth: <strong className="text-cyan-300">{telemetry.depth} m</strong> • Kopili Shale Hazard Interval
            </p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setShowFormations(!showFormations)}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 border transition ${
              showFormations ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Formations</span>
          </button>

          <button
            onClick={() => setShowRiskRibbon(!showRiskRibbon)}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 border transition ${
              showRiskRibbon ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Risk Zone</span>
          </button>

          <span className="text-slate-600">|</span>

          <span className="text-slate-400">CAM:</span>
          {(['ISO', 'TOP', 'FRONT'] as const).map((cam) => (
            <button
              key={cam}
              onClick={() => setCameraPreset(cam)}
              className={`px-2 py-1 rounded font-bold transition ${
                cameraPreset === cam ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="h-[480px] bg-slate-950/95 border border-slate-800 rounded-xl relative overflow-hidden shadow-2xl">
        <Canvas camera={{ position: cameraPreset === 'TOP' ? [0, 120, 1] : cameraPreset === 'FRONT' ? [0, 0, 120] : [70, 50, 70], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[50, 50, 50]} intensity={1.2} />
          <directionalLight position={[-30, 80, -30]} intensity={0.8} />

          {/* Active Well Trajectory */}
          <WellTrajectoryTube points={activePath} color="#06b6d4" lineWidth={1.2} label="ACTIVE OIL-ASSAM-042" />

          {/* Offset Well Trajectories */}
          <WellTrajectoryTube points={offset1Path} color="#f59e0b" lineWidth={0.8} label="OIL-041 (OFFSET NW)" />
          <WellTrajectoryTube points={offset2Path} color="#a855f7" lineWidth={0.8} label="OIL-039 (OFFSET W)" />

          {/* Active Bit Mesh at Current Depth */}
          <ActiveBitMesh position={[15, bitY, 12]} isCritical={isCritical} />

          {/* Formations & Faults */}
          <FormationPlanes showFormations={showFormations} />
          <SubsurfaceFaultPlane />

          {/* Risk Ahead Red Ribbon Box */}
          {showRiskRibbon && isCritical && (
            <mesh position={[15, -45, 12]}>
              <boxGeometry args={[25, 12, 25]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.25} wireframe />
            </mesh>
          )}

          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>

        {/* 3D Legend & Depth Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg text-[11px] font-mono text-slate-300 space-y-1 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span>Active Bit: {telemetry.depth} m MD</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span>Kopili Shale (3,180m–3,550m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 opacity-60 bg-purple-500 inline-block" />
            <span>Barail Coal-Shale</span>
          </div>
        </div>
      </div>
    </div>
  );
};
