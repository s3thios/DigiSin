
'use client'; // Required for hooks like useSearchParams

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
  LayoutDashboard, Users, Building, Bell, FileText, Settings, LogOut, MessageSquareQuote, CalendarCheck, Ticket, UserCog, Briefcase,
  Home, Calendar, FileUp, Car, PawPrint, Package, Scale, Clock, Wallet, Camera // Added Scale, Clock, Wallet, Camera
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation'; // Hook to get query params

// TODO: Fetch sindico user data dynamically, including managed condos
const sindicoUser = {
    name: "Síndico Exemplo",
    role: "Síndico",
    avatarSrc: "https://picsum.photos/100/100?grayscale&random=10",
    avatarFallback: "SI",
};

export default function SindicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  // Get condoId from URL to add to sidebar links if present
  const currentCondoId = searchParams.get('condoId');
  const condoQueryParam = currentCondoId ? `?condoId=${currentCondoId}` : '';

  return (
    <div className="flex min-h-screen">
       <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
              <AvatarImage src={sindicoUser.avatarSrc} alt={`Foto de ${sindicoUser.name}`} data-ai-hint="sindico user avatar" className="transition-transform duration-300 group-hover:scale-110"/>
              <AvatarFallback>{sindicoUser.avatarFallback}</AvatarFallback>
          </Avatar>
           <div className="flex flex-col truncate">
              <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">{sindicoUser.name}</span>
              <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">{sindicoUser.role}</span>
           </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="flex-1 overflow-y-auto p-2">
          {/* Dashboard link always available, might or might not have condoId */}
           <SidebarMenu>
             <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
               <Link href={`/sindico/dashboard${condoQueryParam}`} legacyBehavior passHref>
                 <SidebarMenuButton tooltip="Painel do Condomínio">
                   <LayoutDashboard />
                   <span>Painel</span>
                 </SidebarMenuButton>
               </Link>
             </SidebarMenuItem>
           </SidebarMenu>

          {/* Condominium Management (General, no condoId needed) */}
           <SidebarGroup className="mt-4">
                <SidebarGroupLabel>Administração Geral</SidebarGroupLabel>
                <SidebarMenu>
                   <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                      <Link href="/sindico/condominiums" legacyBehavior passHref>
                         <SidebarMenuButton tooltip="Gerenciar Condomínios">
                              <Building />
                              <span>Condomínios</span>
                         </SidebarMenuButton>
                      </Link>
                   </SidebarMenuItem>
                </SidebarMenu>
           </SidebarGroup>


          {/* Links specific to the selected Condominium (only show if condoId is present) */}
          {currentCondoId && (
            <>
              <SidebarGroup className="mt-4">
                  <SidebarGroupLabel>Gestão do Condomínio</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                      <Link href={`/sindico/residents${condoQueryParam}`} legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Moradores">
                          <Users />
                          <span>Moradores</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                        <Link href={`/sindico/council${condoQueryParam}`} legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Conselho">
                                <UserCog />
                                <span>Conselho</span>
                          </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                      <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                        <Link href={`/sindico/employees${condoQueryParam}`} legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Funcionários">
                                <Briefcase />
                                <span>Funcionários</span>
                          </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                     <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                       <Link href={`/sindico/time-tracking${condoQueryParam}`} legacyBehavior passHref>
                         <SidebarMenuButton tooltip="Ponto Eletrônico">
                               <Clock />
                               <span>Ponto</span>
                         </SidebarMenuButton>
                       </Link>
                     </SidebarMenuItem>
                      <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                        <Link href={`/sindico/payroll${condoQueryParam}`} legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Folha de Pagamento">
                                <Wallet />
                                <span>Pagamentos</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                      <Link href={`/sindico/announcements${condoQueryParam}`} legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Avisos">
                          <Bell />
                          <span>Avisos</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                     <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                       <Link href={`/sindico/legal${condoQueryParam}`} legacyBehavior passHref>
                         <SidebarMenuButton tooltip="Assuntos Legais">
                               <Scale />
                               <span>Legal</span>
                         </SidebarMenuButton>
                       </Link>
                     </SidebarMenuItem>
                     {/* Keep regulations link separate or remove if fully merged into /legal */}
                    <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                      <Link href={`/sindico/regulations${condoQueryParam}`} legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Regulamento (Upload)">
                          <FileText />
                          <span>Regulamento</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                      <Link href={`/sindico/complaints${condoQueryParam}`} legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Ocorrências">
                          <MessageSquareQuote />
                          <span>Ocorrências</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                      <Link href={`/sindico/tickets${condoQueryParam}`} legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Tickets">
                          <Ticket />
                          <span>Tickets</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                      <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                      <Link href={`/sindico/reservations${condoQueryParam}`} legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Reservas">
                          <CalendarCheck />
                          <span>Reservas</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                     <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                       <Link href={`/sindico/deliveries${condoQueryParam}`} legacyBehavior passHref>
                         <SidebarMenuButton tooltip="Entregas">
                           <Package />
                           <span>Entregas</span>
                         </SidebarMenuButton>
                       </Link>
                     </SidebarMenuItem>
                      <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                        <Link href={`/sindico/cameras${condoQueryParam}`} legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Câmeras">
                                <Camera />
                                <span>Câmeras</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                  </SidebarMenu>
              </SidebarGroup>

              {/* Section mirroring resident view - Links removed as Sindico has direct management access */}
              {/*
               <SidebarGroup className="mt-4">
                  <SidebarGroupLabel>Visão do Morador</SidebarGroupLabel>
                  <SidebarMenu>
                     <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
                        <Link href={`/resident/dashboard${condoQueryParam}`} legacyBehavior passHref>
                           <SidebarMenuButton tooltip="Painel (Morador)">
                              <Home />
                              <span>Painel Morador</span>
                           </SidebarMenuButton>
                        </Link>
                     </SidebarMenuItem>
                  </SidebarMenu>
               </SidebarGroup>
              */}
             </>
          )}


        </SidebarContent>
         <Separator />
        <SidebarFooter className="p-2">
           <SidebarMenu>
            <SidebarMenuItem className="transition-colors duration-200 hover:bg-sidebar-accent rounded-md">
              <Link href="/login" passHref>
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
