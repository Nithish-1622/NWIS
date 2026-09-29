'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { TelemetryPoint, RiskAssessment, Well } from '@/types/nwis';
import { ACTIVE_WELL, OFFSET_WELLS } from '@/data/wells';
import { Layers, Eye, Compass, Maximize2, ShieldAlert } from 'lucide-react';

interface DigitalTwin3DProps {
  telemetry: TelemetryPoint;
  riskAssessment: RiskAssessment;
}

// ── Realistic PDC Drill Bit & BHA Assembly ──
function DrillStringAssembly({
  position,
  isCritical,
  rotationRpm,
}: {
  position: [number, number, number];
  isCritical: boolean;
  rotationRpm: number;
}) {
  const bitRef = useRef<THREE.Group>(null);
  const mwdLedRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (bitRef.current) {
      bitRef.current.rotation.y += delta * (rotationRpm > 0 ? (rotationRpm / 60) * Math.PI * 2 : 2.5);
    }
    if (mwdLedRef.current) {
      mwdLedRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 8) * 1.0;
    }
  });

  return (
    <group position={position}>
      {/* Upper Heavy-Weight Drill Pipe (HWDP) */}
      <mesh position={[0, 18, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 24, 16]} />
        <meshStandardMaterial color="#4a4c56" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Tool Joints along drill pipe */}
      {[6, 12, 18, 24].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.8, 16]} />
          <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* MWD / LWD Telemetry Sub (Sensor Collar) */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 5, 16]} />
        <meshStandardMaterial color="#2d1f8a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* MWD Pulsing Telemetry Sensor Ring */}
      <mesh position={[0, 4.5, 0]}>
        <torusGeometry args={[0.58, 0.08, 16, 32]} />
        <meshStandardMaterial
          color={isCritical ? '#ef4444' : '#8968bf'}
          emissive={isCritical ? '#ef4444' : '#8968bf'}
          emissiveIntensity={2.5}
        />
      </mesh>
      <pointLight
        ref={mwdLedRef}
        position={[0, 4.5, 0]}
        color={isCritical ? '#ef4444' : '#8968bf'}
        distance={6}
        intensity={2}
      />

      {/* Rotary Steerable / Mud Motor Housing */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.58, 0.52, 2.2, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Stabilizer Ribs (3 Blade Spirals) */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(angle) * 0.45, 1.6, Math.sin(angle) * 0.45]}
          rotation={[0, angle, 0.2]}
        >
          <boxGeometry args={[0.2, 1.8, 0.35]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* Rotating PDC Drill Bit Body & Cutters */}
      <group ref={bitRef} position={[0, 0, 0]}>
        {/* Bit Matrix Body */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.5, 0.75, 1.2, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.75} roughness={0.3} />
        </mesh>

        {/* Bit Crown Cone */}
        <mesh position={[0, -1.4, 0]}>
          <coneGeometry args={[0.75, 0.8, 16]} />
          <meshStandardMaterial color="#78350f" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* PDC Diamond Cutters (Black Diamond Compacts) */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const theta = (i * Math.PI) / 3;
          return (
            <mesh
              key={i}
              position={[Math.cos(theta) * 0.65, -1.3, Math.sin(theta) * 0.65]}
              rotation={[0.4, theta, 0]}
            >
              <cylinderGeometry args={[0.1, 0.1, 0.18, 12]} />
              <meshStandardMaterial color="#111827" metalness={0.95} roughness={0.1} />
            </mesh>
          );
        })}

        {/* Active Rock Cutting Particle Glow / Friction Ring */}
        <mesh position={[0, -1.8, 0]}>
          <ringGeometry args={[0.2, 1.1, 24]} />
          <meshBasicMaterial
            color={isCritical ? '#f87171' : '#fbbf24'}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

// ── Realistic Multi-Well Trajectory Pipe with Curvature Heatmap ──
function TrajectoryTube({
  points,
  color,
  radius = 0.35,
  label,
  depthLabel,
  isOffset = false,
}: {
  points: { x: number; y: number; z: number }[];
  color: string;
  radius?: number;
  label?: string;
  depthLabel?: string;
  isOffset?: boolean;
}) {
  const curve = useMemo(() => {
    const vPoints = points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    return new THREE.CatmullRomCurve3(vPoints);
  }, [points]);

  const endPoint = points[points.length - 1];

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 80, radius, 16, false]} />
        <meshStandardMaterial
          color={color}
          metalness={isOffset ? 0.4 : 0.8}
          roughness={isOffset ? 0.5 : 0.2}
          transparent={isOffset}
          opacity={isOffset ? 0.75 : 1.0}
        />
      </mesh>

      {/* Wellhead Surface Riser Pipe */}
      <mesh position={[points[0].x, points[0].y + 3, points[0].z]}>
        <cylinderGeometry args={[radius * 1.4, radius * 1.4, 6, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>

      {label && (
        <Html position={[endPoint.x, endPoint.y, endPoint.z]}>
          <div className="bg-[#0a0812]/95 text-[#f0edf8] border border-[#8968bf]/[0.4] text-[10px] font-mono px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg backdrop-blur-sm pointer-events-none flex items-center space-x-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: color }}
            />
            <span className="font-bold">{label}</span>
            {depthLabel && <span className="text-[#8a8299]">({depthLabel})</span>}
          </div>
        </Html>
      )}
    </group>
  );
}

// ── Realistic Stratigraphic Lithology Volume Blocks ──
function SubsurfaceLithologyVolume({ showFormations }: { showFormations: boolean }) {
  if (!showFormations) return null;

  return (
    <group>
      {/* Layer 1: Surface Alluvium & Tipam Sandstone (0 to -15 depth units) */}
      <mesh position={[0, -7.5, 0]}>
        <boxGeometry args={[120, 15, 120]} />
        <meshStandardMaterial
          color="#ca8a04"
          transparent
          opacity={0.06}
          roughness={0.8}
        />
      </mesh>

      {/* Layer 2: Barail Group Coal-Shale Interbeds (-15 to -32 depth units) */}
      <mesh position={[0, -23.5, 0]}>
        <boxGeometry args={[120, 17, 120]} />
        <meshStandardMaterial
          color="#7c3aed"
          transparent
          opacity={0.09}
          roughness={0.7}
        />
      </mesh>

      {/* Layer 3: Kopili Overpressured Shale HAZARD INTERVAL (-32 to -54 depth units) */}
      <mesh position={[0, -43, 0]}>
        <boxGeometry args={[120, 22, 120]} />
        <meshStandardMaterial
          color="#ef4444"
          transparent
          opacity={0.14}
          roughness={0.5}
        />
      </mesh>

      {/* Layer 4: Sylhet Nummulitic Limestone Basement (-54 to -75 depth units) */}
      <mesh position={[0, -64.5, 0]}>
        <boxGeometry args={[120, 21, 120]} />
        <meshStandardMaterial
          color="#059669"
          transparent
          opacity={0.08}
          roughness={0.6}
        />
      </mesh>

      {/* Structural Horizon Boundary Wireplanes */}
      {[-15, -32, -54, -75].map((depthY) => (
        <group key={depthY} position={[0, depthY, 0]}>
          <gridHelper args={[120, 12, '#8968bf', '#3b286d']} />
        </group>
      ))}

      {/* Subsurface Geological Fault Plane with Strike/Dip Vector */}
      <mesh position={[18, -42, -10]} rotation={[0.35, 0.25, -0.45]}>
        <planeGeometry args={[130, 85]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.16}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ── Surface Derrick / Drilling Rig Structure at (0, 0, 0) ──
function SurfaceRigDerrick() {
  return (
    <group position={[0, 0, 0]}>
      {/* Ground Topographic Plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[130, 130]} />
        <meshStandardMaterial color="#110d1e" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Grid Coordinates on Surface */}
      <gridHelper args={[130, 26, '#8968bf', '#1c1469']} position={[0, 0.05, 0]} />

      {/* Substructure Base */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[7, 3, 7]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Derrick Mast (Tapered Pyramidal Lattice) */}
      <mesh position={[0, 9, 0]}>
        <cylinderGeometry args={[1.2, 3.2, 14, 4]} />
        <meshStandardMaterial color="#4b5563" wireframe />
      </mesh>

      {/* Crown Block on Top */}
      <mesh position={[0, 16.5, 0]}>
        <boxGeometry args={[2, 1.2, 2]} />
        <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Rig Status Beacon */}
      <pointLight position={[0, 17.5, 0]} color="#fbbf24" intensity={2} distance={15} />
    </group>
  );
}

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({ telemetry, riskAssessment }) => {
  const [showFormations, setShowFormations] = useState<boolean>(true);
  const [showHazardVolume, setShowHazardVolume] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'ISO' | 'SECTION' | 'PLAN' | 'BIT'>('ISO');

  // Convert real depth (3,145m - 3,240m) to 3D Y coordinate (-20 to -52)
  const bitY = -22 - ((telemetry.depth - 3145) / 80) * 28;
  const isCritical = riskAssessment.level === 'CRITICAL' || riskAssessment.level === 'CAUTION';

  // Active well trajectory path
  const activePath = useMemo(
    () => [
      { x: 0, y: 0, z: 0 },
      { x: 1.5, y: -12, z: 1.8 },
      { x: 4.8, y: -25, z: 5.2 },
      { x: 9.5, y: -40, z: 9.8 },
      { x: 14.2, y: -58, z: 15.5 },
      { x: 18.5, y: -74, z: 21.0 },
    ],
    []
  );

  // Offset Wells paths
  const offset1Path = useMemo(
    () => [
      { x: -32, y: 0, z: 35 },
      { x: -28, y: -15, z: 36 },
      { x: -22, y: -38, z: 39 },
      { x: -16, y: -62, z: 42 },
    ],
    []
  );

  const offset2Path = useMemo(
    () => [
      { x: 25, y: 0, z: -45 },
      { x: 22, y: -18, z: -42 },
      { x: 17, y: -42, z: -38 },
      { x: 12, y: -68, z: -35 },
    ],
    []
  );

  const cameraPosition = useMemo((): [number, number, number] => {
    switch (cameraPreset) {
      case 'PLAN':
        return [0, 110, 0.1];
      case 'SECTION':
        return [90, -30, 0];
      case 'BIT':
        return [activePath[3].x + 15, bitY + 8, activePath[3].z + 18];
      case 'ISO':
      default:
        return [65, 35, 75];
    }
  }, [cameraPreset, bitY, activePath]);

  return (
    <div className="space-y-3 text-[#f0edf8]">
      {/* Header & Controls Strip */}
      <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Subsurface 3D Trajectory & Digital Twin
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1469]/80 text-[#8968bf] border border-[#8968bf]/[0.35] font-semibold">
              3D Lithology Engine
            </span>
          </div>
          <p className="text-xs text-[#8a8299] mt-0.5">
            Real-Time Bit Vector • Measured Depth: <strong className="text-[#8968bf]">{telemetry.depth} m</strong> • TVD: {telemetry.tvd} m ({telemetry.formation})
          </p>
        </div>

        {/* View Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setShowFormations(!showFormations)}
            className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 border transition-all ${
              showFormations
                ? 'bg-[#551ca5]/40 text-[#f0edf8] border-[#8968bf]/[0.55] font-semibold'
                : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#8968bf]" />
            <span>Strata</span>
          </button>

          <button
            onClick={() => setShowHazardVolume(!showHazardVolume)}
            className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 border transition-all ${
              showHazardVolume
                ? 'bg-red-500/20 text-red-300 border-red-500/50 font-semibold'
                : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Hazard Zone</span>
          </button>

          <div className="h-4 w-[1px] bg-[#8968bf]/[0.2] mx-1" />

          <span className="text-[10px] text-[#8a8299] uppercase font-semibold">Camera:</span>
          {(['ISO', 'SECTION', 'PLAN', 'BIT'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setCameraPreset(mode)}
              className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                cameraPreset === mode
                  ? 'bg-[#551ca5]/50 text-white border border-[#8968bf]/[0.6] shadow-sm'
                  : 'bg-[#0a0812] text-[#8a8299] border border-[#8968bf]/[0.18] hover:text-[#cec9e1]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="h-[520px] bg-[#07050e] border border-[#8968bf]/[0.22] rounded-xl relative overflow-hidden shadow-2xl">
        <Canvas camera={{ position: cameraPosition, fov: 45 }}>
          {/* Studio & Directional Subsurface Lighting */}
          <ambientLight intensity={0.75} />
          <directionalLight position={[60, 90, 50]} intensity={1.4} castShadow />
          <directionalLight position={[-60, -40, -50]} intensity={0.5} color="#8968bf" />
          <pointLight position={[0, 20, 0]} intensity={1.0} distance={80} />

          {/* Surface Derrick Structure */}
          <SurfaceRigDerrick />

          {/* Subsurface Lithology Strata Layers */}
          <SubsurfaceLithologyVolume showFormations={showFormations} />

          {/* Active Well Trajectory (OIL-ASSAM-042) */}
          <TrajectoryTube
            points={activePath}
            color="#8968bf"
            radius={0.45}
            label="OIL-ASSAM-042 (ACTIVE)"
            depthLabel={`${telemetry.depth}m`}
          />

          {/* Offset Wells Trajectories */}
          <TrajectoryTube
            points={offset1Path}
            color="#f59e0b"
            radius={0.3}
            isOffset
            label="OIL-041 (OFFSET 420m)"
            depthLabel="3,840m TD"
          />
          <TrajectoryTube
            points={offset2Path}
            color="#a855f7"
            radius={0.3}
            isOffset
            label="OIL-039 (OFFSET 860m)"
            depthLabel="3,910m TD"
          />

          {/* Active Drill Bit & BHA Assembly located dynamically at bitY */}
          <DrillStringAssembly
            position={[activePath[3].x * 0.9, bitY, activePath[3].z * 0.9]}
            isCritical={isCritical}
            rotationRpm={telemetry.rpm}
          />

          {/* Hazard Interval Volumetric Bounding Box */}
          {showHazardVolume && (
            <mesh position={[10, -43, 10]}>
              <boxGeometry args={[42, 22, 42]} />
              <meshBasicMaterial
                color={isCritical ? '#ef4444' : '#f59e0b'}
                transparent
                opacity={0.12}
                wireframe
              />
            </mesh>
          )}

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxDistance={180}
            minDistance={8}
          />
        </Canvas>

        {/* Stratigraphy Color Legend (Bottom-Left) */}
        <div className="absolute bottom-3.5 left-3.5 bg-[#0a0812]/90 border border-[#8968bf]/[0.25] p-3 rounded-xl text-[11px] font-mono text-[#cec9e1] space-y-1.5 backdrop-blur-md pointer-events-none shadow-xl">
          <div className="text-[10px] uppercase font-bold text-[#8a8299] tracking-wider pb-1 border-b border-[#8968bf]/[0.15]">
            Geological Strata (Dibrugarh)
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ca8a04] inline-block opacity-80" />
            <span>Tipam Sandstone (0 – 1,850m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#7c3aed] inline-block opacity-80" />
            <span>Barail Coal-Shale (1,850 – 3,180m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
            <span className="font-bold text-red-400">Kopili Shale [HAZARD] (3,180 – 3,550m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block opacity-80" />
            <span>Sylhet Limestone (3,550m+ Basement)</span>
          </div>
        </div>

        {/* Real-Time Bit Vector HUD Overlay (Top-Right) */}
        <div className="absolute top-3.5 right-3.5 bg-[#0a0812]/90 border border-[#8968bf]/[0.25] p-3 rounded-xl text-[11px] font-mono text-[#cec9e1] space-y-1 backdrop-blur-md pointer-events-none shadow-xl text-right">
          <div className="text-[10px] text-[#8a8299] uppercase font-bold tracking-wider">Bit Position & Vector</div>
          <div className="text-sm font-bold text-[#8968bf]">{telemetry.depth} m MD / {telemetry.tvd} m TVD</div>
          <div className="text-[10px] text-[#8a8299]">Inclination: 24.2° • Azimuth: N48°E</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Tool Face: Magnetic High-Side</div>
        </div>
      </div>
    </div>
  );
};



