"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useStore } from "@/lib/StoreContext";
import { Map, Search, Filter, Plus, X, MapPin } from "lucide-react";

export default function RoutesPage() {
  const { routes, addRoute } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  // New route state
  const [newRouteName, setNewRouteName] = useState("");
  const [newRouteArea, setNewRouteArea] = useState("");

  const handleSaveRoute = () => {
    if (newRouteName && newRouteArea) {
      addRoute({
        id: `r${Date.now()}`,
        name: newRouteName,
        area: newRouteArea,
        assignedVehicle: "Unassigned"
      });
      setModalOpen(false);
      setNewRouteName("");
      setNewRouteArea("");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 transition-all relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text mb-1">Delivery Routes</h1>
            <p className="text-text-muted">Manage active delivery areas and paths.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm w-full md:w-auto flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add Route
          </button>
        </header>

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-black/5 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search routes..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-text font-medium"
                />
              </div>
              <button className="p-2 border border-gray-200 rounded-lg text-text hover:bg-gray-50">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 text-text-muted text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Route Name</th>
                  <th className="p-4 font-medium">Area</th>
                  <th className="p-4 font-medium">Assigned Vehicle</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <RouteRow key={r.id} {...r} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Route Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">Add Delivery Route</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-text"/></button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Route Name</label>
                  <input type="text" placeholder="e.g. Hinjewadi Phase 3" value={newRouteName} onChange={e => setNewRouteName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Area / Zone</label>
                  <input type="text" placeholder="e.g. West Pune" value={newRouteArea} onChange={e => setNewRouteArea(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-text hover:bg-gray-200">Cancel</button>
                <button onClick={handleSaveRoute} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-primary/40">
                  Save Route
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function RouteRow({ name, area, assignedVehicle }: any) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Map className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-text">{name}</span>
        </div>
      </td>
      <td className="p-4 font-medium text-text flex items-center gap-2">
        <MapPin className="w-4 h-4 text-text-muted" /> {area}
      </td>
      <td className="p-4 text-sm font-bold text-text">
        <span className={`px-2 py-1 rounded-lg border ${assignedVehicle === "Unassigned" ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
          {assignedVehicle}
        </span>
      </td>
      <td className="p-4 text-right space-x-3">
        <button className="text-primary hover:underline text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20">Edit</button>
      </td>
    </tr>
  );
}
