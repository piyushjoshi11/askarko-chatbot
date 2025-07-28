"use client"

import { useState, useRef } from "react"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"

interface MagicVesselProps {
  className?: string
}

export function MagicVessel({ className }: MagicVesselProps) {
  const [rubCount, setRubCount] = useState(0)
  const [isRubbing, setIsRubbing] = useState(false)
  const [showGenie, setShowGenie] = useState(false)
  const [logoAnim, setLogoAnim] = useState(false)
  const rubTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleRub = () => {
    if (showGenie) return

    setIsRubbing(true)
    setRubCount((prev) => {
      const newCount = prev + 1
      if (newCount === 3) {
        setTimeout(() => {
          setShowGenie(true)
          setTimeout(() => {
            setLogoAnim(true)
          }, 300)
        }, 300)
      }
      return newCount
    })

    if (rubTimeoutRef.current) clearTimeout(rubTimeoutRef.current)
    rubTimeoutRef.current = setTimeout(() => setIsRubbing(false), 200)
    setTimeout(() => {
      if (!showGenie) setRubCount(0)
    }, 3000)
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center transition-all duration-700",
        className
      )}
      style={{
        minHeight: 420,
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      {/* Vessel Image - only show if genie not out */}
      {!showGenie && (
        <div className="relative w-56 h-56 flex items-end justify-center transition-all duration-700">
          <img
            src="/images/vessel.png"
            alt="Magic Vessel"
            className={cn(
              "absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 object-contain transition-all duration-300",
              isRubbing && "animate-pulse scale-105"
            )}
            style={{ zIndex: 1 }}
          />
          {/* Rub indicator */}
          {rubCount > 0 && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm whitespace-nowrap">
                Rub {rubCount}/3 ✨
              </div>
            </div>
          )}
          {/* Instructions */}
          {rubCount === 0 && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-sm text-gray-500 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300">
                Rub the vessel 3 times ✨
              </div>
            </div>
          )}
          {/* Clickable overlay */}
          <button
            className="absolute inset-0 w-full h-full cursor-pointer bg-transparent"
            aria-label="Rub the vessel"
            onClick={handleRub}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleRub()
              }
            }}
            tabIndex={0}
            style={{ zIndex: 2 }}
          />
        </div>
      )}

      {/* Genie Logo - replaces vessel, with animation */}
      {showGenie && (
        <div
          className={cn(
            "flex flex-col items-center justify-center w-96 h-96",
            logoAnim ? "animate-genie-rise" : "opacity-0 translate-y-12"
          )}
        >
          <img
            src="/images/askarko-logo.png"
            alt="Genie"
            className="w-50 h-50 object-contain drop-shadow-2xl"
          />
        
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes genie-rise {
          0% {
            opacity: 0;
            transform: translateY(48px) scale(0.7);
          }
          60% {
            opacity: 1;
            transform: translateY(-16px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-genie-rise {
          animation: genie-rise 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
      `}</style>
    </div>
  )
}
