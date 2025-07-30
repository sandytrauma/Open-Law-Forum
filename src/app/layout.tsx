import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Law-sections",
  description: "For general information to public",
  
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      
        <div className="w-full h-full flex flex-col min-h-screen">
          <Header /> 
                    
          <main className="flex-1">{children}</main>      
              
          <Footer />
        </div>
        
      </body>
    </html>

    
  );
}
