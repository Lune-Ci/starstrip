"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressStepsProps {
  currentStep: number
  steps: string[]
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full py-4 md:py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-2 md:px-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-sm md:text-base",
                  index < currentStep
                    ? "bg-[#5ba3d0] text-white"
                    : index === currentStep
                      ? "bg-[#5ba3d0] text-white ring-2 md:ring-4 ring-[#5ba3d0]/30"
                      : "bg-white/60 text-[#4a6b84] border-2 border-[#bddaea]",
                )}
              >
                {index < currentStep ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-1 md:mt-2 text-xs md:text-sm font-medium text-center",
                  index <= currentStep ? "text-[#1a3a52]" : "text-[#4a6b84]",
                )}
              >
                {step}
              </span>
            </div>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-1 md:mx-2 transition-all",
                  index < currentStep ? "bg-[#5ba3d0]" : "bg-[#bddaea]",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
