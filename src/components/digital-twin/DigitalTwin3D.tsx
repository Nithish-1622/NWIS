'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Stars, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TelemetryPoint, RiskAssessment } from '@/types/nwis';
import { Layers, ShieldAlert, Radio } from 'lucide-react';

interface DigitalTwin3DProps {
  telemetry: TelemetryPoint;
  riskAssessment: RiskAssessment;
}

// ── Realistic Subsurface & Surface Background Environment ──
function RealisticSubsurfaceBackground({ showFormations }: { showFormations: boolean }) {
  return (
    <group>
      {/* 1. Deep Space & Starfield Backdrop for Upper Atmosphere */}
      <Stars radius={160} depth={60} count={3500} factor={4} saturation={0} fade speed={1.2} />

      {/* 2. Surface Oilfield Ground Environment */}
      {/* Paved Drill Pad Foundation Surface */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#0f0c1b" roughness={0.88} metalness={0.15} />
      </mesh>

      {/* Surface Terrain Coordinate Grid */}
      <gridHelper args={[150, 30, '#8968bf', '#1e163b']} position={[0, 0.05, 0]} />

      {/* Oilfield Pad Perimeter Warning LEDs */}
      {[-65, 65].map((x) =>
        [-65, 0, 65].map((z, idx) => (
          <group key={`perim-${x}-${z}-${idx}`} position={[x, 0.5, z]}>
            <mesh>
              <cylinderGeometry args={[0.25, 0.25, 1, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
            </mesh>
          </group>
        ))
      )}

      {/* Surface Pipe Storage Racks (Tubular Casing Bundles) */}
      <group position={[-25, 0.6, -18]} rotation={[0, 0.2, 0]}>
        {/* Steel rack frame */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[16, 0.8, 4]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Stacked casing pipes */}
        {[-1.2, 0, 1.2].map((zOff, rIdx) =>
          [-6, -3, 0, 3, 6].map((xOff, pIdx) => (
            <mesh key={`pipe-${rIdx}-${pIdx}`} position={[xOff, 1.2, zOff]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.28, 0.28, 2.8, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}
      </group>

      {/* Surface Mud Logging Trailer / Control Cabin */}
      <group position={[28, 0, -22]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[14, 4, 6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Illuminated Control Cabin Window */}
        <mesh position={[0, 2.2, 3.05]}>
          <planeGeometry args={[5, 1.8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
        </mesh>
        <pointLight position={[0, 2.2, 4]} color="#38bdf8" intensity={0.8} distance={8} />
      </group>

      {/* Surface Mud Reserve Pit / Storage Tank */}
      <group position={[-28, 0, 25]} rotation={[0, 0.1, 0]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[12, 3, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[11, 7]} />
          <meshStandardMaterial color="#047857" metalness={0.3} roughness={0.2} opacity={0.85} transparent />
        </mesh>
      </group>

      {/* 3. Subsurface Earth Crust Seismic Slices (Back and Side Geological Wall Slabs) */}
      {showFormations && (
        <>
          {/* Back Seismic Slice Wall (Z = -75) */}
          <group position={[0, -40, -75]}>
            {/* Top Alluvium & Tipam Stratum */}
            <mesh position={[0, 32, 0]}>
              <planeGeometry args={[150, 16]} />
              <meshStandardMaterial color="#b45309" roughness={0.9} opacity={0.45} transparent />
            </mesh>
            {/* Barail Coal-Shale Stratum */}
            <mesh position={[0, 15, 0]}>
              <planeGeometry args={[150, 18]} />
              <meshStandardMaterial color="#6b21a8" roughness={0.85} opacity={0.4} transparent />
            </mesh>
            {/* Kopili Overpressured Hazard Stratum */}
            <mesh position={[0, -5, 0]}>
              <planeGeometry args={[150, 22]} />
              <meshStandardMaterial color="#dc2626" roughness={0.7} opacity={0.5} transparent />
            </mesh>
            {/* Sylhet Limestone Basement Stratum */}
            <mesh position={[0, -27, 0]}>
              <planeGeometry args={[150, 22]} />
              <meshStandardMaterial color="#047857" roughness={0.8} opacity={0.45} transparent />
            </mesh>
            {/* Seismic In-Line Grid Lines */}
            <gridHelper args={[150, 15, '#8968bf', '#2d1f54']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]} />
          </group>

          {/* Left Seismic Slice Wall (X = -75) */}
          <group position={[-75, -40, 0]} rotation={[0, Math.PI / 2, 0]}>
            {/* Top Alluvium & Tipam Stratum */}
            <mesh position={[0, 32, 0]}>
              <planeGeometry args={[150, 16]} />
              <meshStandardMaterial color="#b45309" roughness={0.9} opacity={0.45} transparent />
            </mesh>
            {/* Barail Coal-Shale Stratum */}
            <mesh position={[0, 15, 0]}>
              <planeGeometry args={[150, 18]} />
              <meshStandardMaterial color="#6b21a8" roughness={0.85} opacity={0.4} transparent />
            </mesh>
            {/* Kopili Overpressured Hazard Stratum */}
            <mesh position={[0, -5, 0]}>
              <planeGeometry args={[150, 22]} />
              <meshStandardMaterial color="#dc2626" roughness={0.7} opacity={0.5} transparent />
            </mesh>
            {/* Sylhet Limestone Basement Stratum */}
            <mesh position={[0, -27, 0]}>
              <planeGeometry args={[150, 22]} />
              <meshStandardMaterial color="#047857" roughness={0.8} opacity={0.45} transparent />
            </mesh>
            {/* Seismic Cross-Line Grid Lines */}
            <gridHelper args={[150, 15, '#8968bf', '#2d1f54']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]} />
          </group>

          {/* Deep Crust Floor Slab at Basement (-80) */}
          <mesh position={[0, -80, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[150, 150]} />
            <meshStandardMaterial color="#051b14" roughness={0.95} metalness={0.1} />
          </mesh>
          <gridHelper args={[150, 30, '#059669', '#022c22']} position={[0, -79.9, 0]} />
        </>
      )}

      {/* Subsurface Ambient Particulate Silt / Rock Dust */}
      <Sparkles
        count={70}
        scale={[120, 80, 120]}
        position={[0, -40, 0]}
        size={1.6}
        speed={0.4}
        color="#8968bf"
        opacity={0.35}
      />
    </group>
  );
}

// ── Realistic Steel Derrick & Substructure (Surface) ──
function SurfaceRigLattice() {
  return (
    <group position={[0, 0, 0]}>
      {/* Rig Foundation Substructure (Steel box beams) */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[8, 3, 8]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Drill Floor Deck */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[9, 0.2, 9]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Rotary Table / Kelly Bushing at center */}
      <mesh position={[0, 3.25, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.2, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tapered Derrick Mast 4 Corner Legs */}
      {[
        [-3.2, 3.2, -1.1, 1.1],
        [3.2, 3.2, 1.1, 1.1],
        [-3.2, -3.2, -1.1, -1.1],
        [3.2, -3.2, 1.1, -1.1],
      ].map(([x1, z1, x2, z2], idx) => {
        const start = new THREE.Vector3(x1, 3.2, z1);
        const end = new THREE.Vector3(x2, 20, z2);
        const dir = new THREE.Vector3().subVectors(end, start);
        const length = dir.length();
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        return (
          <mesh key={idx} position={mid}>
            <cylinderGeometry args={[0.16, 0.22, length, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Derrick Horizontal & Diagonal Cross Braces */}
      {[6, 10, 14, 18].map((yLevel, i) => (
        <group key={i} position={[0, yLevel, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[6.8 - i * 1.2, 0.15, 6.8 - i * 1.2]} />
            <meshStandardMaterial color="#64748b" wireframe />
          </mesh>
        </group>
      ))}

      {/* Crown Block on Derrick Top */}
      <mesh position={[0, 20.8, 0]}>
        <boxGeometry args={[2.8, 1.4, 2.8]} />
        <meshStandardMaterial color="#dc2626" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rig Crown Aviation Safety Strobe Beacon */}
      <pointLight position={[0, 22, 0]} color="#ef4444" intensity={2.5} distance={25} />
      <mesh position={[0, 21.8, 0]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
      </mesh>

      {/* Mud Flowline discharge conduit */}
      <mesh position={[4.8, 1.8, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.4, 0.4, 4.5, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ── Realistic PDC Drill Bit, BHA, Nozzle Mud Jets & Acoustic Pulses ──
function AdvancedDrillStringAssembly({
  position,
  isCritical,
  rotationRpm,
}: {
  position: [number, number, number];
  isCritical: boolean;
  rotationRpm: number;
}) {
  const bitRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const mudSprayRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Dynamic Bit Rotation
    if (bitRef.current) {
      const speed = rotationRpm > 0 ? (rotationRpm / 60) * Math.PI * 2 : 2.5;
      bitRef.current.rotation.y += delta * speed;
    }

    // MWD Telemetry Pulse Wave traveling upward along drill string
    if (pulseRingRef.current) {
      pulseRingRef.current.position.y = 4.5 + ((state.clock.elapsedTime * 4) % 18);
      const mat = pulseRingRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = 1.0 - (pulseRingRef.current.position.y - 4.5) / 18;
      }
    }

    // Micro-vibrations for high-realism drilling dynamics
    if (mudSprayRef.current) {
      mudSprayRef.current.rotation.y += delta * 12;
    }
  });

  return (
    <group position={position}>
      {/* Upper Heavy-Weight Drill Pipe (HWDP) */}
      <mesh position={[0, 18, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 26, 20]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Tool Joints along drill pipe */}
      {[5, 11, 17, 23, 29].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.9, 20]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* MWD / LWD Telemetry Sensor Collar */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 5.5, 20]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Acoustic MWD Telemetry Pulse Ring (Animated upward) */}
      <mesh ref={pulseRingRef} position={[0, 4.5, 0]}>
        <torusGeometry args={[0.62, 0.08, 16, 32]} />
        <meshStandardMaterial
          color={isCritical ? '#ef4444' : '#8968bf'}
          emissive={isCritical ? '#ef4444' : '#8968bf'}
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Downhole Work Spotlight focused at bit face */}
      <spotLight
        position={[0, 4, 0]}
        target-position={[0, -3, 0]}
        intensity={2.8}
        color={isCritical ? '#fca5a5' : '#e0e7ff'}
        distance={14}
        angle={0.6}
        penumbra={0.5}
      />

      {/* Positive Displacement Mud Motor / RSS Housing */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.6, 0.54, 2.4, 20]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Spiral Stabilizer Blades */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(angle) * 0.48, 1.6, Math.sin(angle) * 0.48]}
          rotation={[0, angle, 0.25]}
        >
          <boxGeometry args={[0.22, 2.0, 0.38]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* Rotating PDC Diamond Drill Bit */}
      <group ref={bitRef} position={[0, 0, 0]}>
        {/* Bit Shank & Gauge Pad Matrix */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.54, 0.82, 1.3, 20]} />
          <meshStandardMaterial color="#b45309" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Bit Crown Cone with hydraulic fluid channels */}
        <mesh position={[0, -1.45, 0]}>
          <coneGeometry args={[0.82, 0.9, 20]} />
          <meshStandardMaterial color="#78350f" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 6 PDC Spiral Cutter Blades with Carbide Diamond Studs */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const theta = (i * Math.PI) / 3;
          return (
            <group key={i} position={[0, -1.3, 0]} rotation={[0, theta, 0]}>
              {/* Blade Rib */}
              <mesh position={[0.55, 0, 0]} rotation={[0.2, 0, -0.15]}>
                <boxGeometry args={[0.3, 0.6, 0.2]} />
                <meshStandardMaterial color="#92400e" metalness={0.8} />
              </mesh>
              {/* Diamond Cutters */}
              <mesh position={[0.72, -0.15, 0]} rotation={[0.3, 0, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.18, 14]} />
                <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.05} />
              </mesh>
              <mesh position={[0.48, -0.3, 0]} rotation={[0.4, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.16, 14]} />
                <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.05} />
              </mesh>
            </group>
          );
        })}

        {/* Dynamic Mud Jet Spray / Rock Cutting Particle Ring */}
        <group ref={mudSprayRef} position={[0, -1.9, 0]}>
          <mesh>
            <ringGeometry args={[0.25, 1.3, 32]} />
            <meshBasicMaterial
              color={isCritical ? '#ef4444' : '#f59e0b'}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* Sparkles / Drilling Cuttings in Annulus */}
      <Sparkles
        count={25}
        scale={[4, 6, 4]}
        position={[0, 0, 0]}
        size={2.5}
        speed={1.5}
        color={isCritical ? '#f87171' : '#fbbf24'}
      />
    </group>
  );
}

// ── Multi-Well 3D Trajectory Tube with Depth Calibrations ──
function SubsurfaceWellTrajectory({
  points,
  color,
  radius = 0.4,
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
        <tubeGeometry args={[curve, 100, radius, 16, false]} />
        <meshStandardMaterial
          color={color}
          metalness={isOffset ? 0.5 : 0.85}
          roughness={isOffset ? 0.45 : 0.15}
          transparent={isOffset}
          opacity={isOffset ? 0.8 : 1.0}
        />
      </mesh>

      {/* Surface Riser Joint */}
      <mesh position={[points[0].x, points[0].y + 3, points[0].z]}>
        <cylinderGeometry args={[radius * 1.5, radius * 1.5, 6, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Bottom Hole Target Callout Badge via 3D Billboard & Text */}
      {label && (
        <Billboard position={[endPoint.x, endPoint.y - 2.5, endPoint.z]}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[18, 3.2]} />
            <meshBasicMaterial color="#0a0812" opacity={0.9} transparent />
          </mesh>
          <Text
            fontSize={1.2}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {`${label} ${depthLabel ? `(${depthLabel})` : ''}`}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

// ── Historical Incident 3D Pin (Stuck Pipe on Offset OIL-041) ──
function HistoricalIncident3DPin({
  position,
  label,
  depth,
}: {
  position: [number, number, number];
  label: string;
  depth: string;
}) {
  return (
    <group position={position}>
      {/* Pulsing incident orb */}
      <mesh>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={2.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Warning Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.08, 16, 32]} />
        <meshBasicMaterial color="#f87171" transparent opacity={0.6} />
      </mesh>

      {/* 3D Billboard text badge */}
      <Billboard position={[0, 3.5, 0]}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[22, 3.8]} />
          <meshBasicMaterial color="#2a0808" opacity={0.92} transparent />
        </mesh>
        <Text
          fontSize={1.15}
          color="#f87171"
          anchorX="center"
          anchorY="middle"
        >
          {`${label} (Stuck Pipe at ${depth})`}
        </Text>
      </Billboard>
    </group>
  );
}

// ── Realistic Stratigraphic Strata Volumes & Depth Ruler ──
function SubsurfaceStrataVolume({
  showFormations,
  showFaults,
}: {
  showFormations: boolean;
  showFaults: boolean;
}) {
  return (
    <group>
      {showFormations && (
        <>
          {/* Layer 1: Tipam Sandstone (0 to -16) */}
          <mesh position={[0, -8, 0]}>
            <boxGeometry args={[130, 16, 130]} />
            <meshStandardMaterial
              color="#ca8a04"
              transparent
              opacity={0.06}
              roughness={0.9}
            />
          </mesh>

          {/* Layer 2: Barail Coal-Shale Formation (-16 to -34) */}
          <mesh position={[0, -25, 0]}>
            <boxGeometry args={[130, 18, 130]} />
            <meshStandardMaterial
              color="#7c3aed"
              transparent
              opacity={0.08}
              roughness={0.8}
            />
          </mesh>

          {/* Layer 3: Kopili Overpressured Shale HAZARD INTERVAL (-34 to -56) */}
          <mesh position={[0, -45, 0]}>
            <boxGeometry args={[130, 22, 130]} />
            <meshStandardMaterial
              color="#ef4444"
              transparent
              opacity={0.13}
              roughness={0.6}
            />
          </mesh>

          {/* Layer 4: Sylhet Limestone Basement (-56 to -78) */}
          <mesh position={[0, -67, 0]}>
            <boxGeometry args={[130, 22, 130]} />
            <meshStandardMaterial
              color="#059669"
              transparent
              opacity={0.07}
              roughness={0.7}
            />
          </mesh>

          {/* Strata Horizon Boundary Planes */}
          {[-16, -34, -56, -78].map((depthY) => (
            <group key={depthY} position={[0, depthY, 0]}>
              <gridHelper args={[130, 13, '#8968bf', '#231942']} />
            </group>
          ))}
        </>
      )}

      {/* Subsurface 3D Depth Ruler Wall (Right-hand TVD Reference) */}
      <group position={[68, 0, 0]}>
        {[
          { y: 0, label: '0m (Surface)' },
          { y: -16, label: '1,850m (Tipam Base)' },
          { y: -34, label: '3,180m (Barail Base)' },
          { y: -45, label: '3,210m (Hazard Zone)' },
          { y: -56, label: '3,550m (Kopili Base)' },
          { y: -78, label: '4,200m (Basement)' },
        ].map((marker, idx) => (
          <group key={idx} position={[0, marker.y, 0]}>
            <mesh position={[-2, 0, 0]}>
              <boxGeometry args={[4, 0.15, 0.15]} />
              <meshBasicMaterial color="#8968bf" />
            </mesh>
            <Billboard position={[6, 0, 0]}>
              <Text
                fontSize={1.4}
                color="#8968bf"
                anchorX="left"
                anchorY="middle"
              >
                {marker.label}
              </Text>
            </Billboard>
          </group>
        ))}
      </group>

      {/* Geological Fault Plane (Seismic Shear Zone) */}
      {showFaults && (
        <mesh position={[18, -44, -12]} rotation={[0.35, 0.28, -0.42]}>
          <planeGeometry args={[140, 90]} />
          <meshBasicMaterial
            color="#f43f5e"
            transparent
            opacity={0.18}
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// ── Live Inter-Well Proximity Vector Line ──
function ProximityVectorLine({
  start,
  end,
  distanceMeters,
}: {
  start: [number, number, number];
  end: [number, number, number];
  distanceMeters: number;
}) {
  const linePoints = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end]
  );
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  return (
    <group>
      {/* Proximity Dash Line */}
      <mesh>
        <tubeGeometry
          args={[new THREE.CatmullRomCurve3(linePoints), 12, 0.12, 8, false]}
        />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>

      <Billboard position={midPoint}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[14, 2.5]} />
          <meshBasicMaterial color="#081b26" opacity={0.9} transparent />
        </mesh>
        <Text
          fontSize={1.05}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {`Separation: ${distanceMeters}m`}
        </Text>
      </Billboard>
    </group>
  );
}

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({ telemetry, riskAssessment }) => {
  const [showFormations, setShowFormations] = useState<boolean>(true);
  const [showHazardVolume, setShowHazardVolume] = useState<boolean>(true);
  const [showFaults, setShowFaults] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'ISO' | 'SECTION' | 'PLAN' | 'BIT'>('ISO');

  // Convert real depth (3,145m - 3,240m) to 3D Y coordinate (-22 to -52)
  const bitY = -22 - ((telemetry.depth - 3145) / 80) * 28;
  const isCritical = riskAssessment.level === 'CRITICAL' || riskAssessment.level === 'CAUTION';

  // Active well trajectory path
  const activePath = useMemo(
    () => [
      { x: 0, y: 0, z: 0 },
      { x: 1.8, y: -12, z: 2.0 },
      { x: 5.2, y: -25, z: 5.6 },
      { x: 10.0, y: -40, z: 10.2 },
      { x: 14.8, y: -58, z: 16.0 },
      { x: 19.2, y: -74, z: 21.5 },
    ],
    []
  );

  // Offset Wells paths
  const offset1Path = useMemo(
    () => [
      { x: -34, y: 0, z: 36 },
      { x: -30, y: -15, z: 37 },
      { x: -24, y: -38, z: 40 },
      { x: -18, y: -62, z: 43 },
    ],
    []
  );

  const offset2Path = useMemo(
    () => [
      { x: 26, y: 0, z: -46 },
      { x: 23, y: -18, z: -43 },
      { x: 18, y: -42, z: -39 },
      { x: 13, y: -68, z: -36 },
    ],
    []
  );

  const bitPosition: [number, number, number] = [
    activePath[3].x * 0.9,
    bitY,
    activePath[3].z * 0.9,
  ];

  const offset1ClosestPoint: [number, number, number] = [-24, bitY, 40];

  const cameraPosition = useMemo((): [number, number, number] => {
    switch (cameraPreset) {
      case 'PLAN':
        return [0, 115, 0.1];
      case 'SECTION':
        return [95, -32, 0];
      case 'BIT':
        return [bitPosition[0] + 14, bitY + 6, bitPosition[2] + 16];
      case 'ISO':
      default:
        return [70, 38, 80];
    }
  }, [cameraPreset, bitY, bitPosition]);

  return (
    <div className="space-y-3 text-[#f0edf8]">
      {/* Header & Controls Toolbar */}
      <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.18] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-semibold text-white tracking-tight">
              3D Subsurface Trajectory & Digital Twin
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#551ca5]/20 text-[#8968bf] border border-[#8968bf]/[0.3] font-semibold">
              Live Bit Engine
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
                ? 'bg-[#551ca5]/30 text-white border-[#8968bf]/[0.5] font-semibold'
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

          <button
            onClick={() => setShowFaults(!showFaults)}
            className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 border transition-all ${
              showFaults
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-semibold'
                : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>Fault Plane</span>
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
      <div className="h-[540px] bg-[#07050e] border border-[#8968bf]/[0.2] rounded-xl relative overflow-hidden shadow-2xl">
        <Canvas camera={{ position: cameraPosition, fov: 45 }}>
          {/* Subsurface Depth Atmosphere */}
          <fog attach="fog" args={['#07050e', 45, 230]} />

          {/* Lighting Rig */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[65, 95, 55]} intensity={1.5} castShadow />
          <directionalLight position={[-65, -45, -55]} intensity={0.6} color="#8968bf" />
          <pointLight position={[0, 22, 0]} intensity={1.2} distance={90} />

          {/* Realistic Surface Ground, Starfield & Subsurface Seismic Slice Walls */}
          <RealisticSubsurfaceBackground showFormations={showFormations} />

          {/* Surface Derrick Structure */}
          <SurfaceRigLattice />

          {/* Subsurface Strata Volumes & Depth Markers */}
          <SubsurfaceStrataVolume
            showFormations={showFormations}
            showFaults={showFaults}
          />

          {/* Active Well Trajectory (OIL-ASSAM-042) */}
          <SubsurfaceWellTrajectory
            points={activePath}
            color="#8968bf"
            radius={0.46}
            label="OIL-ASSAM-042 (ACTIVE)"
            depthLabel={`${telemetry.depth}m MD`}
          />

          {/* Offset Wells Trajectories */}
          <SubsurfaceWellTrajectory
            points={offset1Path}
            color="#f59e0b"
            radius={0.32}
            isOffset
            label="OIL-041 (OFFSET 420m)"
            depthLabel="3,840m TD"
          />
          <SubsurfaceWellTrajectory
            points={offset2Path}
            color="#a855f7"
            radius={0.32}
            isOffset
            label="OIL-039 (OFFSET 860m)"
            depthLabel="3,910m TD"
          />

          {/* Historical Stuck Pipe Incident Marker in 3D Space */}
          <HistoricalIncident3DPin
            position={[-24, -45, 40]}
            label="OIL-041 INCIDENT"
            depth="3,210m MD"
          />

          {/* Live Proximity Vector Line between Active Bit & Offset 1 */}
          <ProximityVectorLine
            start={bitPosition}
            end={offset1ClosestPoint}
            distanceMeters={418}
          />

          {/* Dynamic Rotating PDC Drill Bit & BHA Assembly */}
          <AdvancedDrillStringAssembly
            position={bitPosition}
            isCritical={isCritical}
            rotationRpm={telemetry.rpm}
          />

          {/* Hazard Zone Volumetric Bounding Matrix */}
          {showHazardVolume && (
            <mesh position={[10, -45, 10]}>
              <boxGeometry args={[46, 22, 46]} />
              <meshBasicMaterial
                color={isCritical ? '#ef4444' : '#f59e0b'}
                transparent
                opacity={0.1}
                wireframe
              />
            </mesh>
          )}

          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            maxDistance={190}
            minDistance={6}
          />
        </Canvas>

        {/* Stratigraphy Color Legend (Bottom-Left) */}
        <div className="absolute bottom-3.5 left-3.5 bg-[#0a0812]/92 border border-[#8968bf]/[0.2] p-3 rounded-xl text-[11px] font-mono text-[#cec9e1] space-y-1.5 backdrop-blur-md pointer-events-none shadow-xl">
          <div className="text-[10px] uppercase font-bold text-[#8a8299] tracking-wider pb-1 border-b border-[#8968bf]/[0.15]">
            Geological Strata (Upper Assam)
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
            <span className="font-bold text-red-400">Kopili Hazard Interval (3,180 – 3,550m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block opacity-80" />
            <span>Sylhet Limestone (3,550m+ Basement)</span>
          </div>
        </div>

        {/* Real-Time Bit Vector HUD Overlay (Top-Right) */}
        <div className="absolute top-3.5 right-3.5 bg-[#0a0812]/92 border border-[#8968bf]/[0.2] p-3 rounded-xl text-[11px] font-mono text-[#cec9e1] space-y-1 backdrop-blur-md pointer-events-none shadow-xl text-right">
          <div className="text-[10px] text-[#8a8299] uppercase font-bold tracking-wider">Bit Spatial Vector</div>
          <div className="text-sm font-bold text-[#8968bf]">{telemetry.depth} m MD / {telemetry.tvd} m TVD</div>
          <div className="text-[10px] text-[#8a8299]">Inclination: 24.2° • Azimuth: N48°E • DLS: 1.8°/30m</div>
          <div className="text-[10px] text-emerald-400 font-semibold">BHA: Rotary Steerable System (RSS)</div>
        </div>
      </div>
    </div>
  );
};
