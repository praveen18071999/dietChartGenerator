"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export function ConditionalSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const starterPagePath = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup");
  
  if (!starterPagePath) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    );
  }
  
  // Don't render sidebar components on patch/ routes
  return <div className="min-h-screen">{children}</div>;
}