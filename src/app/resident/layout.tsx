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
import { Home, Calendar, Bell, FileText, Settings, User, LogOut, Building, FileWarning, Utensils, Car, Bike, PawPrint, FileUp, FileImage, MessageSquareQuote, MapPin, Briefcase, Package, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
       <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
              <AvatarImage src="https://picsum.photos/100/100" alt="Foto do Usuário" data-ai-hint="user avatar" />
              <AvatarFallback>US</AvatarFallback>
          </Avatar>
           <div className="flex flex-col truncate">
              <span className="font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">Usuário Exemplo</span>
              <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">Residente</span>
           </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="flex-1 overflow-y-auto p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/resident/dashboard" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Painel">
                  <Home />
                  <span>Painel</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/resident/reservations" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Reservas">
                  <Calendar />
                  <span>Reservas</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/resident/announcements" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Avisos">
                  <Bell />
                  <span>Avisos</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/resident/regulations" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Regulamento">
                  <FileText />
                  <span>Regulamento</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/resident/complaints" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Reclamações">
                  <MessageSquareQuote />
                  <span>Reclamações</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>

           <SidebarGroup className="mt-4">
              <SidebarGroupLabel>Gestão Pessoal</SidebarGroupLabel>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <Link href="/resident/profile" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Perfil">
                              <User />
                              <span>Perfil</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <Link href="/resident/visitors" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Visitantes">
                              <User /> {/* Change icon if better one exists */}
                              <span>Visitantes</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <Link href="/resident/vehicles" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Veículos">
                              <Car />
                              <span>Veículos</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <Link href="/resident/pets" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Pets">
                              <PawPrint />
                              <span>Pets</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/resident/documents" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Documentos">
                              <FileUp />
                              <span>Documentos</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
              <SidebarGroupLabel>Comunidade</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/resident/neighbors" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Vizinhos">
                              <Building />
                              <span>Vizinhos</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <Link href="/resident/marketplace" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Anunciar">
                              <Briefcase />
                              <span>Anunciar</span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <Link href="/resident/contact" legacyBehavior passHref>
                          <SidebarMenuButton tooltip="Contatos Úteis">
                              <Phone />
                              <span>Contatos Úteis</span>
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
              <SidebarMenuButton tooltip="Configurações">
                <Settings />
                 <span>Configurações</span>
              </SidebarMenuButton>
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
