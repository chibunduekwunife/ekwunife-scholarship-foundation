"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navLinks } from "@/app/(landing)/components/landing-nav-links";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AppLogo from "@/components/widgets/logo";

export default function NavSidebar() {
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-end justify-start border-b-2 h-23 pb-2">
          <AppLogo href={"/"} width={200} height={200}/>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link) => {
                if (link.name === "Scholarships") {
                  return (
                    <Collapsible key={link.id} defaultOpen className="group/collapsible>">
                      <SidebarMenuItem key={link.id}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton asChild>
                            <Link href="#">
                              <link.icon />
                              <span>{link.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem onClick={toggleSidebar}>
                              <Link href="/scholarships/ssce" className="flex items-center gap-1.5">
                                {/* <Scroll size={15} /> */}
                                <span className="text-gray-500 text-xs">Secondary School Scholars (SSCE)</span>
                              </Link>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem onClick={toggleSidebar}>
                              <Link href="/scholarships/bgus" className="flex items-center gap-1.5">
                                {/* <Scroll size={15} /> */}
                                <span className="text-gray-500 text-xs">Best Graduating University Students</span>
                              </Link>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={link.id}>
                      <SidebarMenuButton onClick={toggleSidebar} asChild>
                        <Link href={link.href}>
                          <link.icon />
                          <span>{link.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
