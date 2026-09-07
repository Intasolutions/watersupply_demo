"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Package, 
  Settings, 
  Droplet,
  Menu,
  X,
  Map
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Deliveries", href: "/deliveries", icon: Truck },
    { name: "Routes", href: "/routes", icon: Map },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Staff", href: "/staff", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile / Tablet Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-black/5 flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-text">AquaFlow</h1>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-text">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & toggled Mobile) */}
      <div className={`w-64 h-screen bg-white fixed left-0 top-0 flex flex-col p-4 z-50 border-r border-black/5 shadow-sm transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8 px-2 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold premium-gradient-text tracking-tight">AquaFlow</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-text-muted hover:text-text">
            <X className="w-6 h-6" />
          </button>
        </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-text-muted hover:bg-surface-hover hover:text-text"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-text-muted"}`} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-surface rounded-xl border border-black/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-medium text-text">Admin User</p>
            <p className="text-xs text-text-muted">admin@aquaflow.com</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
