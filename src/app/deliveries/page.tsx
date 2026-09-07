"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useStore } from "@/lib/StoreContext";
import { Truck, MapPin, Calendar, UserPlus, X, AlertTriangle, CheckCircle2, Phone } from "lucide-react";

export default function DeliveriesPage() {
  const { assignments, routes, staff, addAssignment, completeAssignment } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState<string | null>(null);
  const [reconOpen, setReconOpen] = useState<string | null>(null);

  // Assign modal state
  const [assignDriver, setAssignDriver] = useState("");
  const [assignRoute, setAssignRoute] = useState("");
  const [assignStock, setAssignStock] = useState(50);

  const handleSaveAssignment = () => {
    if (assignDriver && assignRoute) {
      addAssignment({
        id: `a${Date.now()}`,
        vehicle: routes.find(r => r.name === assignRoute)?.assignedVehicle || "MH 12 TEMP",
        driver: assignDriver,
        route: assignRoute,
        status: "pending",
        progress: 0,
        stock: `${assignStock}x 20L`
      });
      setModalOpen(false);
      setAssignDriver("");
      setAssignRoute("");
      setAssignStock(50);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 transition-all relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text mb-1">Deliveries & Assignments</h1>
            <p className="text-text-muted">Manage daily routes and allocate stock to vehicles.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm w-full md:w-auto flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5" /> Assign Route
          </button>
        </header>

        {/* Date Selector */}
        <div className="flex items-center gap-4 mb-6">
          <button className="p-2 border border-gray-200 rounded-lg text-text hover:bg-white bg-white shadow-sm">
            <Calendar className="w-5 h-5 text-text-muted" />
          </button>
          <h2 className="text-lg font-bold text-text">Today: Oct 2, 2026</h2>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignments.map(a => (
            <AssignmentCard 
              key={a.id} 
              {...a} 
              onTrack={() => setTrackOpen(a.vehicle)}
              onRecon={() => setReconOpen(a.vehicle)}
            />
          ))}
          <AssignmentCard 
            vehicle="MH 12 GH 3456" 
            driver="Unassigned" 
            route="Baner - Balewadi"
            stock="0 allocated"
            status="pending"
            progress={0}
            onAssign={() => setModalOpen(true)}
          />
        </div>

        {/* Assign Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">Assign Vehicle</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-text"/></button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Select Driver</label>
                  <select value={assignDriver} onChange={e => setAssignDriver(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="" disabled>Choose Driver</option>
                    {staff.filter(s => s.role === "Driver").map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Select Route</label>
                  <select value={assignRoute} onChange={e => setAssignRoute(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="" disabled>Choose Route</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Allocate 20L Stock</label>
                  <input type="number" value={assignStock} onChange={e => setAssignStock(parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-text hover:bg-gray-200">Cancel</button>
                <button onClick={handleSaveAssignment} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-primary/40">
                  Save Assignment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Track Modal */}
        {trackOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row h-[80vh] max-h-[600px]">
              
              <div className="flex-1 relative bg-gray-50 p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-black/5">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/5 shadow-sm text-center max-w-md mx-auto w-full">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-2">GPS Active</h3>
                  <p className="text-text-muted mb-8 text-sm">Vehicle is securely transmitting location data.</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-text-muted uppercase mb-1">Exact Coordinates</p>
                      <p className="font-mono text-sm font-bold text-text">18.5905° N, 73.7381° E</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-text-muted uppercase mb-1">Current Speed</p>
                      <p className="font-mono text-sm font-bold text-text">42 km/h</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-text-muted uppercase mb-1">Last Sync</p>
                      <p className="font-mono text-sm font-bold text-text">Just now</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-text-muted uppercase mb-1">Device Battery</p>
                      <p className="font-mono text-sm font-bold text-emerald-600">86%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 bg-white p-6 md:p-8 flex flex-col border-l border-black/5 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-text">Vehicle: {trackOpen}</h2>
                    <p className="text-sm font-medium text-text-muted">Driver: Rahul D.</p>
                  </div>
                  <button onClick={() => setTrackOpen(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-text"/></button>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Current Status</p>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                      <Truck className="w-6 h-6 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-bold text-blue-900">En Route to Hinjewadi Phase 1</p>
                        <p className="text-sm text-blue-700 font-medium">ETA: 12 Minutes</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Route Progress</p>
                    <div className="space-y-4 border-l-2 border-gray-100 ml-3 pl-6 relative">
                      <div className="relative">
                        <div className="absolute -left-[33px] w-4 h-4 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-100"></div>
                        <p className="font-bold text-text text-sm">Hotel Sunshine</p>
                        <p className="text-xs text-text-muted font-medium">Delivered at 10:15 AM</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[33px] w-4 h-4 bg-primary rounded-full border-2 border-white ring-2 ring-primary/20"></div>
                        <p className="font-bold text-primary text-sm">Tech Park Office</p>
                        <p className="text-xs text-text-muted font-medium">Next Stop</p>
                      </div>
                      <div className="relative opacity-40">
                        <div className="absolute -left-[33px] w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                        <p className="font-bold text-text text-sm">Sharma Residence</p>
                        <p className="text-xs text-text-muted font-medium">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-gray-100 font-bold rounded-xl text-text hover:bg-gray-200 flex items-center justify-center gap-2 mt-4">
                  <Phone className="w-4 h-4" /> Call Driver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reconciliation Modal */}
        {reconOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-text">End of Day Recon</h2>
                  <p className="text-sm font-medium text-text-muted">Vehicle: {reconOpen}</p>
                </div>
                <button onClick={() => setReconOpen(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-text"/></button>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 border border-black/5 mb-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <span className="font-bold text-text">Stock Dispatched (Morning)</span>
                  <span className="font-black text-text">40x 20L</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-700 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Full Delivered</span>
                    <span className="font-bold text-text">38</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-700 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Empty Collected</span>
                    <span className="font-bold text-text">42</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                    <span className="text-amber-600 font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Full Returned (Unsold)</span>
                    <span className="font-bold text-text">2</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-8">
                <span className="font-bold text-emerald-800">Total Cash Collected</span>
                <span className="text-2xl font-black text-emerald-700">₹3,040</span>
              </div>

              <button onClick={() => {
                const assignmentObj = assignments.find(a => a.vehicle === reconOpen);
                if (assignmentObj) {
                  completeAssignment(assignmentObj.id);
                }
                setReconOpen(null);
              }} className="w-full py-4 bg-emerald-600 text-white font-bold text-lg rounded-2xl hover:bg-emerald-700 shadow-sm shadow-emerald-600/40">
                Confirm & Close Route
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function AssignmentCard({ vehicle, driver, route, stock, status, progress, onAssign, onTrack, onRecon }: any) {
  const isCompleted = status === "completed";
  const isPending = status === "pending";

  return (
    <div className={`bg-white p-6 rounded-2xl border shadow-sm ${isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-black/5'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPending ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'}`}>
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-text">{vehicle}</h3>
            <p className={`text-xs font-semibold uppercase tracking-wider ${isCompleted ? 'text-emerald-600' : isPending ? 'text-gray-400' : 'text-blue-600'}`}>
              {status}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Driver</span>
          <span className="font-medium text-text">{driver}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
          <span className="text-text-muted flex items-center gap-1"><MapPin className="w-4 h-4"/> Route</span>
          <span className="font-medium text-text">{route}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Allocated Stock</span>
          <span className="font-medium text-text">{stock}</span>
        </div>
      </div>

      {!isPending && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-text-muted">Route Progress</span>
            <span className={isCompleted ? 'text-emerald-600' : 'text-primary'}>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-primary'}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {isPending ? (
        <button onClick={onAssign} className="w-full py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors">
          Assign Vehicle
        </button>
      ) : isCompleted ? (
        <button onClick={onRecon} className="w-full py-2 bg-emerald-100 text-emerald-700 font-bold rounded-lg hover:bg-emerald-200 transition-colors">
          View Reconciliation
        </button>
      ) : (
        <button onClick={onTrack} className="w-full py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors">
          Track Live
        </button>
      )}
    </div>
  );
}
