"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useStore } from "@/lib/StoreContext";
import { Users, Search, Filter, Phone, Award, X } from "lucide-react";

export default function ClientsPage() {
  const { clients, addClient } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  // New client state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newTier, setNewTier] = useState("Standard");
  const [newOptIn, setNewOptIn] = useState(true);

  const handleSaveClient = () => {
    if (newName && newPhone) {
      addClient({
        id: `c${Date.now()}`,
        name: newName,
        phone: newPhone,
        address: "Address Pending",
        tier: newTier,
        points: 0,
        optIn: newOptIn,
        history: "New Client"
      });
      setModalOpen(false);
      setNewName("");
      setNewPhone("");
      setNewTier("Standard");
      setNewOptIn(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 transition-all relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text mb-1">Client Management</h1>
            <p className="text-text-muted">Manage your clients, pricing, and loyalty points.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm w-full md:w-auto flex items-center justify-center gap-2">
            <Users className="w-5 h-5" /> Add Client
          </button>
        </header>

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-black/5 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search clients by name or phone..." 
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
                  <th className="p-4 font-medium">Client Details</th>
                  <th className="p-4 font-medium">Route / Area</th>
                  <th className="p-4 font-medium">Pricing Tier</th>
                  <th className="p-4 font-medium">Loyalty Points</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <ClientRow key={c.id} {...c} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Client Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">New Client</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-text"/></button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Business/Client Name</label>
                  <input type="text" placeholder="e.g. Fresh Bites Cafe" value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Phone Number</label>
                  <input type="text" placeholder="+91 XXXXX XXXXX" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Pricing Tier</label>
                  <select value={newTier} onChange={e => setNewTier(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Standard">Standard (₹80/20L)</option>
                    <option value="Wholesale">Wholesale (₹65/20L)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" checked={newOptIn} onChange={e => setNewOptIn(e.target.checked)} className="w-5 h-5 rounded text-primary focus:ring-primary/20" />
                  <span className="font-medium text-text">Opt-in to Loyalty Program</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-text hover:bg-gray-200">Cancel</button>
                <button onClick={handleSaveClient} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-primary/40">
                  Save Client
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ClientRow({ name, phone, address, tier, points, optIn }: any) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-bold text-text">{name}</span>
          <span className="text-xs text-text-muted flex items-center gap-1 mt-1 font-medium">
            <Phone className="w-3 h-3" /> {phone}
          </span>
        </div>
      </td>
      <td className="p-4 font-semibold text-text">{address}</td>
      <td className="p-4 text-sm font-bold text-text">
        <span className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">{tier}</span>
      </td>
      <td className="p-4">
        {optIn ? (
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-black text-amber-600">{points} pts</span>
          </div>
        ) : (
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase">Opted Out</span>
        )}
      </td>
      <td className="p-4 text-right space-x-3">
        <button className="text-primary hover:underline text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20">Edit</button>
      </td>
    </tr>
  );
}
