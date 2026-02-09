
import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'HRMS Lite | Modern Workforce Management',
  description: 'Streamlined HR management for modern teams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/10 selection:text-primary">
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen">
            <header className="glass-header">
              <div className="container flex h-20 items-center justify-between px-6 mx-auto max-w-7xl">
                <div className="flex items-center gap-10">
                  <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                      H
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-primary">HRMS <span className="text-muted-foreground font-medium">Lite</span></span>
                  </Link>
                  <nav className="hidden md:flex items-center gap-2">
                    <Link href="/admin" className="nav-link">
                      Dashboard
                    </Link>
                    <Link href="/employees" className="nav-link">
                      Employees
                    </Link>
                    <Link href="/attendance" className="nav-link">
                      Attendance
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-foreground">Admin Portal</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Live Session</p>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                    <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
                    <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>
            <main className="flex-1 py-12">
              <div className="container px-6 mx-auto max-w-7xl">
                {children}
              </div>
            </main>
            <footer className="py-6 border-t bg-white/30 backdrop-blur-sm">
              <div className="container px-6 mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} HRMS Lite. All rights reserved.</p>
                <div className="flex gap-6">
                  <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Support</Link>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
