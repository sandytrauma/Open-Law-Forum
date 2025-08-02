import { AppSidebar } from "@/components/App-Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-screen">
        <SidebarTrigger />
        
            {children}
       
      </div>
    </SidebarProvider>
  )
}