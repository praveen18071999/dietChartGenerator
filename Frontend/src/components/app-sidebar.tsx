"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SearchCheck,
  Settings2,
  SquareTerminal,
} from "lucide-react"

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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Consistency",
      logo: GalleryVerticalEnd,
      plan: "Get Your Diet",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Progress",
          url: "#",
        },
        {
          title: "Blogs",
          url: "#",
        },
      ],
    },
    {
      title: "Generate Diet Plan",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "My Reports",
          url: "#",
        },
        {
          title: "Diet Plan",
          url: "/createDiet",
        },
        
      ],
    },
    {
      title: "History",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Medical History",
          url: "#",
        },
        {
          title: "Diet Plan History",
          url: "#",
        },
        {
          title: "Diet Order History",
          url: "/order-history",
        },
        {
          title: "Payment History",
          url: "#",
        },
      ],
    },
    {
      title: "Our Experts",
      url: "#",
      icon: SearchCheck,
      items: [
        {
          title: "Doctors",
          url: "#",
        },
        {
          title: "Trainers",
          url: "#",
        },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
