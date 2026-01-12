import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f3fbff]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#5ba3d0]" />
        <p className="text-[#4a6b84] font-medium animate-pulse">Loading Starstrip...</p>
      </div>
    </div>
  )
}
