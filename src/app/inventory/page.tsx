"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useStore } from "@/lib/StoreContext";
import { Package, Plus, Search, Filter, X } from "lucide-react";

export default function InventoryPage() {
  const { inventory, updateInventory, addInventoryItem } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Edit stock states
  const [addFull, setAddFull] = useState(0);
  const [addEmpty, setAddEmpty] = useState(0);
  const [addDamaged, setAddDamaged] = useState(0);

  // Add new item states
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState(0);

  const handleEditStock = () => {
    if (editingId) {
      updateInventory(editingId, addFull, addEmpty, addDamaged);
      setEditingId(null);
      setAddFull(0);
      setAddEmpty(0);
      setAddDamaged(0);
    }
  };

  const openEditModal = (id: string) => {
    setEditingId(id);
    setAddFull(0);
    setAddEmpty(0);
    setAddDamaged(0);
  };

  const handleAddStockItem = () => {
    if (newItemName) {
      addInventoryItem({
        id: `i${Date.now()}`,
        name: newItemName,
        full: 0,
        empty: 0,
        damaged: 0,
        price: newItemPrice
      });
      setAddModalOpen(false);
      setNewItemName("");
      setNewItemPrice(0);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 transition-all relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text mb-1">Inventory Management</h1>
            <p className="text-text-muted">Track full, empty, and damaged stock.</p>
          </div>
          <button onClick={() => setAddModalOpen(true)} className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm w-full md:w-auto flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add Stock Item
          </button>
        </header>

        {/* Global Inventory Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <h3 className="text-text-muted font-medium mb-1">Total Full Bottles (20L)</h3>
            <p className="text-4xl font-bold text-blue-600">{inventory[0]?.full || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <h3 className="text-text-muted font-medium mb-1">Total Empty Returned (20L)</h3>
            <p className="text-4xl font-bold text-emerald-600">{inventory[0]?.empty || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <h3 className="text-text-muted font-medium mb-1">Damaged / Missing</h3>
            <p className="text-4xl font-bold text-red-500">{inventory[0]?.damaged || 0}</p>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-black/5 flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-xl font-bold text-text">Stock Categories</h2>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search item..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button className="p-2 border border-gray-200 rounded-lg text-text hover:bg-gray-50">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-text-muted text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Item Name</th>
                  <th className="p-4 font-medium">Full Stock</th>
                  <th className="p-4 font-medium">Empty Stock</th>
                  <th className="p-4 font-medium">Damaged</th>
                  <th className="p-4 font-medium">Price/Unit</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-text">{item.name}</span>
                    </td>
                    <td className="p-4 font-bold text-blue-600">{item.full}</td>
                    <td className="p-4 font-bold text-emerald-600">{item.empty}</td>
                    <td className="p-4 font-bold text-red-500">{item.damaged}</td>
                    <td className="p-4 font-medium text-text">₹{item.price}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditModal(item.id)} className="text-primary hover:underline text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20">Edit Stock</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">Adjust Stock</h2>
                <button onClick={() => setEditingId(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-text"/></button>
              </div>
              <p className="text-text-muted font-medium mb-6">Update the exact quantity arriving at the warehouse.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Add Full Bottles</label>
                  <input type="number" value={addFull} onChange={(e) => setAddFull(parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Receive Empty Bottles</label>
                  <input type="number" value={addEmpty} onChange={(e) => setAddEmpty(parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Report Damaged</label>
                  <input type="number" value={addDamaged} onChange={(e) => setAddDamaged(parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditingId(null)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-text hover:bg-gray-200">Cancel</button>
                <button onClick={handleEditStock} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-primary/40">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text">Add Stock Item</h2>
                <button onClick={() => setAddModalOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-text"/></button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Item Name</label>
                  <input type="text" placeholder="e.g. 10 Liter Mineral Water" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Price per Unit (₹)</label>
                  <input type="number" value={newItemPrice} onChange={(e) => setNewItemPrice(parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setAddModalOpen(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-text hover:bg-gray-200">Cancel</button>
                <button onClick={handleAddStockItem} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-primary/40">
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
