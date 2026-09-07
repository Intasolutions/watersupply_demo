"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useStore } from "@/lib/StoreContext";
import { Users, Search, Filter, Phone, Plus, X, UserCheck, ShieldAlert } from "lucide-react";

export default function StaffPage() {
  const { staff, addStaff } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  // New staff state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("Driver");

  const handleSaveStaff = () => {
    if (newName && newPhone && newRole) {
      addStaff({
        id: `s${Date.now()}`,
        name: newName,
        phone: newPhone,
        role: newRole,
        status: "Available",
        assignment: "N/A"
      });
      setModalOpen(false);
      setNewName("");
      setNewPhone("");
      setNewRole("Driver");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 transition-all relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text mb-1">Staff Management</h1>
            <p className="text-text-muted">Manage your drivers, helpers, and warehouse team.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm w-full md:w-auto flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add Staff
          </button>
        </header>

        {/* Global Staff Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-text-muted font-medium">Total Drivers</h3>
              <p className="text-3xl font-bold text-text">8</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
              <UserCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-text-muted font-medium">Total Helpers</h3>
              <p className="text-3xl font-bold text-text">12</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h3 className="text-text-muted font-medium">On Leave Today</h3>
              <p className="text-3xl font-bold text-text">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-black/5 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search staff..." 
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
                  <th className="p-4 font-medium">Employee Name</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Current Assignment</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <StaffRow key={s.id} {...s} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Staff Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">Add Staff Member</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-text"/></button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Full Name</label>
                  <input type="text" placeholder="e.g. Ramesh Kumar" value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Phone Number</label>
                  <input type="text" placeholder="+91 XXXXX XXXXX" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Role</label>
                  <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-text font-medium outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Driver">Driver</option>
                    <option value="Helper">Helper</option>
                    <option value="Warehouse Staff">Warehouse Staff</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-text hover:bg-gray-200">Cancel</button>
                <button onClick={handleSaveStaff} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-primary/40">
                  Save Staff
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StaffRow({ name, phone, role, status, assignment }: any) {
  const getStatusStyle = (s: string) => {
    if (s === "On Route") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "Available" || s === "On Duty") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-gray-100 text-gray-500 border-gray-200";
  };

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
      <td className="p-4 font-semibold text-text">{role}</td>
      <td className="p-4 text-sm font-bold text-text">
        <span className={`px-2 py-1 rounded-lg border ${getStatusStyle(status)}`}>{status}</span>
      </td>
      <td className="p-4 font-medium text-text-muted">{assignment}</td>
      <td className="p-4 text-right space-x-3">
        <button className="text-primary hover:underline text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20">Edit</button>
      </td>
    </tr>
  );
}
