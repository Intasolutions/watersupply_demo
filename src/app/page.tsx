import { Sidebar } from "@/components/ui/Sidebar";
import { 
  TrendingUp, 
  Package, 
  Truck, 
  IndianRupee 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 transition-all">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-1">Overview</h1>
            <p className="text-text-muted">Welcome back. Here's what's happening today.</p>
          </div>
          <button className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]">
            + New Assignment
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Today's Revenue" 
            value="₹12,450" 
            trend="+14%" 
            icon={<IndianRupee className="w-6 h-6 text-emerald-500" />} 
          />
          <StatCard 
            title="Active Vehicles" 
            value="4 / 5" 
            trend="1 route pending" 
            icon={<Truck className="w-6 h-6 text-blue-500" />} 
          />
          <StatCard 
            title="Total Deliveries" 
            value="142" 
            trend="+5%" 
            icon={<Package className="w-6 h-6 text-purple-500" />} 
          />
          <StatCard 
            title="Full Stock (20L)" 
            value="450" 
            trend="-120 today" 
            icon={<TrendingUp className="w-6 h-6 text-amber-500" />} 
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Routes */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text">Active Routes</h2>
              <button className="text-sm text-primary font-medium hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              <RouteRow vehicle="MH 12 AB 1234" driver="Rahul D." progress={75} deliveries="34/45" />
              <RouteRow vehicle="MH 12 CD 5678" driver="Vikram S." progress={40} deliveries="18/45" />
              <RouteRow vehicle="MH 12 EF 9012" driver="Amit P." progress={90} deliveries="40/45" />
            </div>
          </div>

          {/* Quick Actions / Recent Activity */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text mb-6">Recent Activity</h2>
            <div className="space-y-6">
              <ActivityRow text="Rahul delivered 5x 20L to Client A" time="10 mins ago" />
              <ActivityRow text="Payment received: ₹450 (Razorpay)" time="12 mins ago" />
              <ActivityRow text="Vikram reported 2 damaged bottles" time="1 hour ago" />
              <ActivityRow text="Inventory restocked: +500 (20L)" time="3 hours ago" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponents for the dashboard
function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 rounded-2xl hover:bg-surface-hover transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-surface rounded-xl border border-black/5 shadow-sm">
          {icon}
        </div>
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-success' : 'text-text-muted'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-text">{value}</p>
    </div>
  );
}

function RouteRow({ vehicle, driver, progress, deliveries }: { vehicle: string, driver: string, progress: number, deliveries: string }) {
  return (
    <div className="p-4 bg-surface rounded-xl border border-black/5 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Truck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-text">{vehicle}</p>
          <p className="text-xs text-text-muted font-medium">Driver: {driver}</p>
        </div>
      </div>
      
      <div className="flex-1 max-w-xs mx-8">
        <div className="flex justify-between text-xs mb-1 font-medium">
          <span className="text-text-muted">Progress</span>
          <span className="text-text">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-text">{deliveries}</p>
        <p className="text-xs text-text-muted font-medium">Deliveries</p>
      </div>
    </div>
  );
}

function ActivityRow({ text, time }: { text: string, time: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-2 h-2 mt-2 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)] shrink-0"></div>
      <div>
        <p className="text-sm text-text font-medium leading-snug">{text}</p>
        <p className="text-xs text-text-muted mt-1">{time}</p>
      </div>
    </div>
  );
}
