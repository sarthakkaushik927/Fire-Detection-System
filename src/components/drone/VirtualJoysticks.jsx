import React from 'react'
import StickBtn from './StickBtn'

const VirtualJoysticks = ({ manualMoveDrone, manualZoom, manualRotate, status }) => {
  return (
    <div className="absolute bottom-6 left-6 right-6 flex justify-between pointer-events-none z-10">
        <div className="w-28 h-28 md:w-32 md:h-32 bg-slate-900/60 backdrop-blur rounded-full border border-white/10 pointer-events-auto grid grid-cols-3 grid-rows-3 p-2 shadow-2xl">
            <div/> <StickBtn onClick={() => manualZoom('in')}>+</StickBtn> <div/>
            <StickBtn onClick={() => manualRotate(-5)}>←</StickBtn> <div className="bg-white/20 rounded-full w-1 h-1 m-auto"/> <StickBtn onClick={() => manualRotate(5)}>→</StickBtn>
            <div/> <StickBtn onClick={() => manualZoom('out')}>-</StickBtn> <div/>
        </div>

        <div className={`w-28 h-28 md:w-32 md:h-32 bg-slate-900/60 backdrop-blur rounded-full border border-white/10 pointer-events-auto grid grid-cols-3 grid-rows-3 p-2 shadow-2xl transition-opacity duration-300 ${status === 'AUTOPILOT' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <div/> <StickBtn onClick={() => manualMoveDrone(0)}>↑</StickBtn> <div/>
            <StickBtn onClick={() => manualMoveDrone(270)}>←</StickBtn> <div className="bg-red-500/50 rounded-full w-1 h-1 m-auto animate-pulse"/> <StickBtn onClick={() => manualMoveDrone(90)}>→</StickBtn>
            <div/> <StickBtn onClick={() => manualMoveDrone(180)}>↓</StickBtn> <div/>
        </div>
    </div>
  )
}

export default VirtualJoysticks