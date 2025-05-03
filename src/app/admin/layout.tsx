
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Building, Bell, FileText, Settings, LogOut, MessageSquareQuote, Ticket, CalendarCheck, Package, DollarSign // Added DollarSign
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// TODO: Fetch user role and name dynamically
const user = {
    name: "Admin Geral",
    role: "Admin", // or "Síndico" based on auth
    avatarSrc: "https://picsum.photos/100/100?grayscale",
    avatarFallback: "AD",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
       <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarSrc} alt={`Foto de ${user.name}`} data-ai-hint="admin user avatar" className="transition-transform duration-300 group-hover:scale-110"/>
              <AvatarFallback>{user.avatarFallback}</AvatarFallback>
          </Avatar>
           <div className="flex flex-col truncate">
              <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">{user.name}</span>
              <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">{user.role}</span>
           </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="flex-1 overflow-y-auto p-2">
          <SidebarMenu>
            <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/admin/dashboard" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Visão Geral">
                  <LayoutDashboard />
                  <span>Visão Geral</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/admin/condominiums" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Condomínios">
                  <Building />
                  <span>Condomínios</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/admin/residents" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Moradores">
                  <Users />
                  <span>Moradores</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/admin/announcements" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Avisos">
                  <Bell />
                  <span>Avisos</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/admin/regulations" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Regulamento">
                  <FileText />
                  <span>Regulamento</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/admin/complaints" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Ocorrências">
                  <MessageSquareQuote />
                  <span>Ocorrências</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/admin/tickets" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Tickets">
                  <Ticket />
                  <span>Tickets</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
              <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/admin/reservations" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Reservas">
                  <CalendarCheck />
                  <span>Reservas</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
               <Link href="/admin/deliveries" legacyBehavior passHref>
                 <SidebarMenuButton tooltip="Entregas">
                   <Package />
                   <span>Entregas</span>
                 </SidebarMenuButton>
               </Link>
             </SidebarMenuItem>
          </SidebarMenu>

           <SidebarGroup className="mt-4">
              <SidebarGroupLabel>Configurações</SidebarGroupLabel>
              <SidebarMenu>
                  <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                      <Link href="/admin/settings/fees" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Taxas">
                              <DollarSign />
                              <span>Taxas</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
                   {/* Removed Admin Users Link */}
              </SidebarMenu>
          </SidebarGroup>

        </SidebarContent>
         <Separator />
        <SidebarFooter className="p-2">
           <SidebarMenu>
             <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
               <Link href="/admin/settings" legacyBehavior passHref>
                  <SidebarMenuButton tooltip="Configurações Gerais">
                    <Settings />
                     <span>Configurações</span>
                  </SidebarMenuButton>
               </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
               <Link href="/login/resident" passHref> {/* Default logout to resident login */}
                <SidebarMenuButton tooltip="Sair">
                  <LogOut />
                  <span>Sair</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1 p-4 md:p-6 bg-background w-full">
        <div className="flex items-center justify-between mb-6 md:hidden">
           <SidebarTrigger />
        </div>
         <div className="max-w-7xl mx-auto w-full">
           {children}
         </div>
      </SidebarInset>
    </div>
  );
}
