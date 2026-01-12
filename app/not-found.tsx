"use client";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/main-layout";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 rounded-full bg-[#f3fbff] p-6 shadow-sm inline-flex">
          <FileQuestion className="h-12 w-12 text-[#5ba3d0]" />
        </div>
        <h2 className="mb-4 text-3xl font-bold text-[#1a3a52]">
          Page Not Found
        </h2>
        <p className="mb-8 max-w-md text-[#4a6b84]">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or doesn&apos;t exist.
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[#5ba3d0] hover:bg-[#4a92c0]"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
