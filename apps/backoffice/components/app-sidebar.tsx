"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Quản lý tài nguyên",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Danh mục",
          url: "/categories",
        },
        {
          title: "Sản phẩm",
          url: "/products",
        }
      ],
    },
    {
      title: "Tài liệu",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Media",
          url: "/media",
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Shipping",
          url: "#",
        },
        {
          title: "Payment",
          url: "#",
        },
        {
          title: "Email",
          url: "#",
        }
      ],
    },
  ]
}
type SimpleUser = {
  imageUrl: string;
  fullName: string | null;
  username: string | null;
} | null

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SimpleUser
  isAuthenticated: boolean
}

export function AppSidebar({ user, isAuthenticated, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {isAuthenticated && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
