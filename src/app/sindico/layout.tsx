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
import { LayoutDashboard, Users, Building, Bell, FileText, Settings, LogOut, MessageSquareQuote, CalendarCheck, Ticket } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// TODO: Fetch sindico user data dynamically, including managed condos
const sindicoUser = {
    name: "Síndico Exemplo",
    role: "Síndico",
    avatarSrc: "https://picsum.photos/100/100?grayscale&random=10",
    avatarFallback: "SI",
    // managedCondos: ["Plaza das Flores IV"], // Example
};

export default function SindicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
       <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
              <AvatarImage src={sindicoUser.avatarSrc} alt={`Foto de ${sindicoUser.name}`} data-ai-hint="sindico user avatar" />
              <AvatarFallback>{sindicoUser.avatarFallback}</AvatarFallback>
          </Avatar>
           <div className="flex flex-col truncate">
              <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">{sindicoUser.name}</span>
              <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">{sindicoUser.role}</span>
           </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="flex-1 overflow-y-auto p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/sindico/dashboard" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Painel do Condomínio">
                  <LayoutDashboard />
                  <span>Painel</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {/* TODO: Conditionally show links based on sindico permissions */}
             <SidebarMenuItem>
              <Link href="/sindico/residents" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Moradores">
                  <Users />
                  <span>Moradores</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/sindico/announcements" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Avisos">
                  <Bell />
                  <span>Avisos</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/sindico/regulations" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Regulamento">
                  <FileText />
                  <span>Regulamento</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/sindico/complaints" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Ocorrências">
                  <MessageSquareQuote />
                  <span>Ocorrências</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/sindico/tickets" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Tickets">
                  <Ticket />
                  <span>Tickets</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
              <SidebarMenuItem>
              <Link href="/sindico/reservations" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Reservas">
                  <CalendarCheck />
                  <span>Reservas</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>

           {/* Maybe remove or restrict settings for Sindico */}
           {/* <SidebarGroup className="mt-4">
              <SidebarGroupLabel>Configurações</SidebarGroupLabel>
              <SidebarMenu>
                   <SidebarMenuItem>
                       <Link href="/sindico/settings/fees" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Taxas">
                              <DollarSign />
                              <span>Taxas</span>
                          </SidebarMenuButton>
                      </Link>
                   </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup> */}

        </SidebarContent>
         <Separator />
        <SidebarFooter className="p-2">
           <SidebarMenu>
             {/* <SidebarMenuItem>
               <Link href="/sindico/settings" legacyBehavior passHref>
                  <SidebarMenuButton tooltip="Configurações">
                    <Settings />
                     <span>Configurações</span>
                  </SidebarMenuButton>
               </Link>
            </SidebarMenuItem> */}
            <SidebarMenuItem>
              {/* TODO: Add logout functionality here */}
              <Link href="/login" passHref> {/* Redirect to login on logout */}
                  <SidebarMenuButton tooltip="Sair">
                    <LogOut />
                    <span>Sair</span>
                  </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1 p-4 md:p-6 bg-background">
        <div className="flex items-center justify-between mb-6">
           <SidebarTrigger className="md:hidden" /> {/* Only show trigger on mobile */}
           {/* TODO: Add condo switcher or breadcrumbs */}
        </div>
        {children}
      </SidebarInset>
    </div>
  );
}
