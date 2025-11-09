"use client"

import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { ChevronLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.back()}>
      <ChevronLeft/>
      Quay lại
    </Button>
  )
}