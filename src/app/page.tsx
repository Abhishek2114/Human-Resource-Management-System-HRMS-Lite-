
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, Calendar, BarChart3, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-20 py-10 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" />
          Enterprise-Ready Lite Solution
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-primary leading-[1.1]">
          Modern Workforce <br />
          <span className="text-muted-foreground">Management Simplified.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The all-in-one HRMS Lite portal for single-admin operations. Manage personnel, track attendance, and gain insights with zero complexity.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105 transition-all group">
            <Link href="/admin">
              Enter Admin Portal
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold border-primary/10 hover:bg-primary/5">
            Documentation
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-primary">Employee Directory</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Centralized database for all staff records. Add, search, and manage personnel with a clean, intuitive interface.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-primary">Smart Attendance</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Automated date generation and conflict prevention. Mark attendance in seconds with real-time sync to Firestore.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-primary">Live Insights</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Instant metrics on department distribution and staffing levels. Stay informed with our real-time overview dashboard.
          </p>
        </div>
      </section>
    </div>
  );
}
