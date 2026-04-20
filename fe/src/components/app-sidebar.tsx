"use client"

import * as React from "react"

import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { logout } from "@/features/validation/auth.slice"
import {
  ArrowDownLeftIcon,
  AudioLinesIcon,
  BookOpenIcon,
  BotIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  MapIcon,
  MessageSquareIcon,
  SettingsIcon,
  TerminalIcon,
  TerminalSquareIcon,
  WarehouseIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: <BotIcon />,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <SettingsIcon />,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Google",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Airbnb",
      url: "#",
      icon: <WarehouseIcon />,
    },
    {
      name: "Microsoft",
      url: "#",
      icon: <MapIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showLogoutHint, setShowLogoutHint] = React.useState(true)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/auth/login", { replace: true })
  }

  const sidebarUser = {
    name: user?.name || "User",
    email: user?.email || "-",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <div className="relative">
          <div className="mb-4 grid gap-2 rounded-none border border-muted/60 bg-muted/40 p-3 group-data-[collapsible=icon]:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-between border border-input/70 bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center text-base font-semibold">
                  +
                </span>
                Invite member
              </span>
              <ArrowDownLeftIcon className="size-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-between border border-input/70 bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <MessageSquareIcon className="size-4" />
                Feedback
              </span>
              <ArrowDownLeftIcon className="size-4 text-muted-foreground" />
            </button>
          </div>
          {showLogoutHint ? (
            <div className="mb-2 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-900 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p>If want to logout, click here.</p>
                <button
                  type="button"
                  onClick={() => setShowLogoutHint(false)}
                  className="cursor-pointer text-emerald-700 hover:text-emerald-900"
                  aria-label="Close logout hint"
                >
                  ×
                </button>
              </div>
              <div className="mt-1 flex items-center gap-1 text-emerald-700">
                <ArrowDownLeftIcon className="size-3" />
                <span>user menu (bottom-left)</span>
              </div>
            </div>
          ) : null}
          <NavUser user={sidebarUser} onLogout={handleLogout} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
