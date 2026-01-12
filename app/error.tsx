"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/main-layout"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Page error:", error)
  }, [error])

  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 rounded-full bg-red-100 p-4 inline-flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-600"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-[#1a3a52]">Something went wrong!</h2>
        <p className="mb-8 max-w-md text-[#4a6b84]">
          We encountered an error while loading this page. This might be due to a temporary connection issue.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()} className="bg-[#5ba3d0] hover:bg-[#4a92c0]">
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="border-[#5ba3d0] text-[#5ba3d0]"
          >
            Back to Home
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 max-w-2xl overflow-auto rounded bg-slate-950 p-4 text-left text-xs text-white">
            <p className="font-mono text-red-400">{error.message}</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
