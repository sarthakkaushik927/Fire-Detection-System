import React, { useRef, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Sparkles, Float, Sphere, Ring, Stars, Grid, Cloud } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// --- 1. LIQUID GLASS BUTTON ---
const LiquidButton = ({ children, onClick, variant = "primary", className }) => {
  const isPrimary = variant === "primary"

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 50, 0, 0.4)" }}
      whileTap={{ scale: 0.95, filter: "brightness(0.8)" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        relative group overflow-hidden px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm
        backdrop-blur-xl border border-white/10 transition-all duration-300
        ${className}
      `}
      style={{
        background: isPrimary 
          ? "linear-gradient(135deg, rgba(220, 38, 38, 0.4), rgba(234, 88, 12, 0.4))"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
        boxShadow: isPrimary
          ? "inset 0 0 20px rgba(255, 50, 0, 0.3), 0 10px 20px rgba(0,0,0,0.5)"
          : "inset 0 0 20px rgba(255, 255, 255, 0.05), 0 10px 20px rgba(0,0,0,0.5)",
        textShadow: "0 2px 5px rgba(0,0,0,0.5)"
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-50" />
      <span className="relative z-10 flex items-center justify-center gap-3 text-white">
        {children}
      </span>
    </motion.button>
  )
}

// --- 2. INTERACTIVE CURSOR ---
function TacticalCursor() {
  const lightRef = useRef()
  const ringRef = useRef()
  
  useFrame(({ pointer }) => {
    if (lightRef.current && ringRef.current) {
        const targetX = pointer.x * 25
        const targetZ = -pointer.y * 15 - 5
        lightRef.current.position.x += (targetX - lightRef.current.position.x) * 0.1
        lightRef.current.position.z += (targetZ - lightRef.current.position.z) * 0.1
        ringRef.current.position.x = lightRef.current.position.x
        ringRef.current.position.z = lightRef.current.position.z
        ringRef.current.rotation.z -= 0.05
    }
  })

  return (
    <>
      <spotLight 
        ref={lightRef} position={[0, 20, 0]} angle={0.4} penumbra={0.2} intensity={50} distance={80} color="#ff4400" castShadow target-position={[0, 0, 0]}
      />
      <group ref={ringRef} position={[0, -2.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
         <Ring args={[1.5, 1.6, 64]}>
            <meshBasicMaterial color="red" transparent opacity={0.8} toneMapped={false} />
         </Ring>
         <Ring args={[0.5, 0.6, 32]}>
            <meshBasicMaterial color="orange" transparent opacity={0.9} toneMapped={false} />
         </Ring>
      </group>
    </>
  )
}

function CameraRig() {
    useFrame((state) => {
        // Adds subtle parallax on mouse move
        state.camera.position.x += (state.pointer.x * 2 - state.camera.position.x) * 0.02
        state.camera.position.y += (state.pointer.y * 1 + 3 - state.camera.position.y) * 0.02
        state.camera.lookAt(0, 0, 0)
    })
    return null
}

function ScannerDrone({ position, color = "#ff3300", delay = 0 }) {
  const droneRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delay
    droneRef.current.position.y = position[1] + Math.sin(t * 2) * 0.2
    droneRef.current.rotation.y += 0.02
  })
  return (
    <group ref={droneRef} position={position}>
      <Sphere args={[0.3, 16, 16]}>
        <meshBasicMaterial color={color} toneMapped={false} />
        <pointLight color={color} intensity={3} distance={10} decay={2} />
      </Sphere>
      <Ring args={[0.4, 0.45, 32]} rotation={[Math.PI / 2, 0, 0]}>
         <meshBasicMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.3} toneMapped={false} />
      </Ring>
      <Ring args={[0.6, 0.62, 32]} rotation={[Math.PI / 2, Math.PI/4, 0]}>
         <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.6} toneMapped={false} />
      </Ring>
    </group>
  )
}

function DenseTerrain() {
    return (
        <group position={[0, -3, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[200, 200, 60, 60]} />
                <meshStandardMaterial color="#0a0202" roughness={0.6} metalness={0.2} emissive="#220000" emissiveIntensity={0.2} />
            </mesh>
            <Grid position={[0, 0.1, 0]} args={[100, 100]} cellSize={2} cellThickness={1} cellColor="#551111" sectionSize={10} sectionThickness={1.5} sectionColor="#ff0000" fadeDistance={60} fadeStrength={1} infiniteGrid />
        </group>
    )
}

// 🟢 ROTATING WORLD COMPONENT
function RotatingWorld() {
    const groupRef = useRef()
    
    // Auto-rotate the terrain and objects slowly
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05 // Adjust speed here
        }
    })

    return (
        <group ref={groupRef}>
            <DenseTerrain />
            <Sparkles count={800} scale={[50, 20, 50]} size={6} speed={0.4} color="#ff8800" position={[0, 5, 0]} opacity={0.8} />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <ScannerDrone position={[6, 2, -2]} color="orange" />
                <ScannerDrone position={[-6, 1, 2]} color="red" />
                <ScannerDrone position={[0, 4, -5]} color="#ffcc00" />
                <mesh position={[-8, 6, -10]} rotation={[1,1,1]}>
                    <icosahedronGeometry args={[0.5]} />
                    <meshBasicMaterial color="red" wireframe />
                </mesh>
                <mesh position={[8, 3, -8]} rotation={[1,0,1]}>
                    <octahedronGeometry args={[0.8]} />
                    <meshBasicMaterial color="orange" wireframe />
                </mesh>
            </Float>
        </group>
    )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 18]} fov={50} />
      
      {/* 🟢 CONTROLS */}
      <CameraRig />      {/* Mouse Parallax */}
      <TacticalCursor /> {/* Spotlight that follows mouse */}
      
      {/* 🟢 ATMOSPHERE */}
      <color attach="background" args={['#030000']} />
      <fogExp2 attach="fog" args={['#050101', 0.025]} />
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
      <Cloud opacity={0.1} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 5, -10]} color="#ff4400" />
      <Cloud opacity={0.1} speed={0.4} width={10} depth={1.5} segments={20} position={[-10, 5, -15]} color="#440000" />
      
      {/* 🟢 LIGHTING */}
      <ambientLight intensity={0.5} color="#2222ff" />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffaa00" />
      <pointLight position={[-20, 5, -10]} intensity={5} color="#ff0000" />

      {/* 🟢 ROTATING CONTENT */}
      <RotatingWorld />
    </>
  )
}

// --- 3. MAIN UI ---

const Hero = ({ navigate, textEnter, textLeave }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 z-0">
        <Canvas className="w-full h-full" shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_150%)] pointer-events-none" />
      </div>

      <div className="relative z-10 text-center max-w-6xl px-6 pointer-events-none flex flex-col items-center">
        
        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-500/20 text-red-500 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-12 pointer-events-auto backdrop-blur-sm translate-y-5"
        >
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>
          Orbital Status: Online
        </motion.div>

        {/* Big Text */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          onMouseEnter={textEnter} onMouseLeave={textLeave}
          className="text-6xl md:text-9xl font-black text-white uppercase tracking-tight leading-[0.85] mb-8 pointer-events-auto drop-shadow-2xl"
        >
          PREDICT.<br/>
          DETECT.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">NEUTRALIZE.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium tracking-wide pointer-events-auto"
        >
          NASA Satellite Monitoring and Autonomous Drone Interception Protocol.
        </motion.p>

        {/* LIQUID BUTTONS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 pointer-events-auto w-full md:w-auto"
        >
          <LiquidButton variant="primary" onClick={() => navigate('/auth')} className="w-full md:w-64">
            Initialize Command
          </LiquidButton>
          <LiquidButton variant="secondary" onClick={() => navigate('/registry')} className="w-full md:w-64">
            Report Incident
          </LiquidButton>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero