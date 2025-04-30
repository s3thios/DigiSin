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
import { LayoutDashboard, Users, Building, Bell, FileText, Settings, LogOut, MessageSquareQuote, Utensils, MapPin, DollarSign, CalendarCheck } from 'lucide-react'; // Added more icons
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

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
              <AvatarImage src="https://picsum.photos/100/100?grayscale" alt="Foto do Admin" data-ai-hint="admin user avatar" />
              <AvatarFallback>AD</AvatarFallback>
          </Avatar>
           <div className="flex flex-col truncate">
              <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">Admin/Síndico</span>
              <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">Gestor</span>
           </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="flex-1 overflow-y-auto p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/admin/dashboard" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Painel Geral">
                  <LayoutDashboard />
                  <span>Painel Geral</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/admin/condominiums" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Condomínios">
                  <Building />
                  <span>Condomínios</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/admin/residents" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Moradores">
                  <Users />
                  <span>Moradores</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/admin/announcements" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Avisos">
                  <Bell />
                  <span>Avisos</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/admin/regulations" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Regulamento">
                  <FileText />
                  <span>Regulamento</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/admin/complaints" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Reclamações">
                  <MessageSquareQuote />
                  <span>Reclamações</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
              <SidebarMenuItem>
              <Link href="/admin/reservations" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Reservas">
                  <CalendarCheck />
                  <span>Reservas</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>

           <SidebarGroup className="mt-4">
              <SidebarGroupLabel>Configurações</SidebarGroupLabel>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <Link href="/admin/settings/fees" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Taxas">
                              <DollarSign />
                              <span>Taxas</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
                   {/* Add other settings links here */}
                   <SidebarMenuItem>
                       <Link href="/admin/settings/users" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Usuários Admin">
                              <Users />
                              <span>Usuários Admin</span>
                          </SidebarMenuButton>
                      </Link>
                   </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup>

        </SidebarContent>
         <Separator />
        <SidebarFooter className="p-2">
           <SidebarMenu>
             <SidebarMenuItem>
               <Link href="/admin/settings" legacyBehavior passHref>
                  <SidebarMenuButton tooltip="Configurações Gerais">
                    <Settings />
                     <span>Configurações</span>
                  </SidebarMenuButton>
               </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {/* Add logout functionality here */}
              <SidebarMenuButton tooltip="Sair">
                <LogOut />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1 p-4 md:p-6 bg-background">
        <div className="flex items-center justify-between mb-6">
           <SidebarTrigger className="md:hidden" /> {/* Only show trigger on mobile */}
           {/* Maybe add breadcrumbs or page title here */}
        </div>
        {children}
      </SidebarInset>
    </div>
  );
}
