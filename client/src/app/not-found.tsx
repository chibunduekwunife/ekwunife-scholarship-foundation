"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Component() {
  const router = useRouter()

  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl transition-transform hover:scale-105 text-secondary">404</h1>
          <p className="text-gray-500">Looks like you&apos;ve ventured into the unknown digital realm.</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="inline-flex h-10 items-center rounded-md bg-secondary px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}