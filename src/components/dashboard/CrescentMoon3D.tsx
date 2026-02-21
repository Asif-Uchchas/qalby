'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function CrescentShape() {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
        }
        if (glowRef.current) {
            glowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <group ref={meshRef}>
                {/* Main crescent body */}
                <mesh position={[0, 0, 0]}>
                    <torusGeometry args={[1.2, 0.35, 32, 64, Math.PI * 1.3]} />
                    <MeshDistortMaterial
                        color="#C9974A"
                        emissive="#C9974A"
                        emissiveIntensity={0.4}
                        roughness={0.3}
                        metalness={0.8}
                        distort={0.05}
                        speed={2}
                    />
                </mesh>

                {/* Inner glow sphere */}
                <mesh position={[0, 0, 0]} scale={0.5}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        color="#C9974A"
                        emissive="#F4A830"
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.1}
                    />
                </mesh>

                {/* Star accent */}
                <mesh position={[0.8, 0.8, 0.2]} scale={0.15}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color="#F4A830"
                        emissive="#F4A830"
                        emissiveIntensity={0.8}
                    />
                </mesh>

                {/* Point light for golden glow */}
                <pointLight
                    ref={glowRef}
                    color="#C9974A"
                    intensity={1.5}
                    distance={8}
                    decay={2}
                />
            </group>
        </Float>
    );
}

function Stars() {
    const starsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (starsRef.current) {
            starsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            starsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
        }
    });

    const starPositions = new Float32Array(300);
    const starSizes = new Float32Array(100);
    for (let i = 0; i < 300; i++) {
        starPositions[i] = (Math.random() - 0.5) * 20;
    }
    for (let i = 0; i < 100; i++) {
        starSizes[i] = Math.random() * 2 + 0.5;
    }

    return (
        <points ref={starsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[starPositions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[starSizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#C9974A"
                size={0.03}
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

export default function CrescentMoon3D() {
    return (
        <div
            style={{
                width: '100%',
                height: '280px',
                position: 'relative',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.2} color="#F0EAD6" />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={0.5}
                    color="#F4A830"
                />
                <CrescentShape />
                <Stars />
            </Canvas>

            {/* Radial glow overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(circle at 50% 50%, rgba(201,151,74,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
