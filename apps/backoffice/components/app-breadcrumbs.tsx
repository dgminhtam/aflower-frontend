"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

function capitalize(s: string) {
  if (!s) return ""
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatSegment(segment: string, index: number, allSegments: string[]) {
  const decodedSegment = decodeURIComponent(segment)
  const friendlyNames: { [key: string]: string } = {
    categories: "Danh mục",
    create: "Tạo mới",
  }

  if (friendlyNames[decodedSegment]) {
    return friendlyNames[decodedSegment]
  }

  if (index > 0) {
    return "Cập nhật"
  }
  return capitalize(decodedSegment)
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/">Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1

          // ✨ THAY ĐỔI Ở ĐÂY: Truyền thêm index và segments
          const title = formatSegment(segment, index, segments)

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className={!isLast ? "hidden md:block" : ""}>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}