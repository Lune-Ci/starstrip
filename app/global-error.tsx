"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#f3fbff] text-[#1a3a52] font-sans">
        <div className="container max-w-md px-4 py-8 text-center">
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
          <h1 className="mb-4 text-2xl font-bold">Something went wrong!</h1>
          <p className="mb-8 text-[#4a6b84]">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => reset()} className="w-full bg-[#5ba3d0] hover:bg-[#4a92c0]">
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full border-[#5ba3d0] text-[#5ba3d0]"
            >
              Back to Home
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 overflow-auto rounded bg-slate-950 p-4 text-left text-xs text-white">
              <p className="font-mono text-red-400">{error.message}</p>
              {error.digest && <p className="mt-2 text-slate-500">Digest: {error.digest}</p>}
            </div>
          )}
        </div>
      </body>
    </html>
  )
}
