"use client";

import { useState } from "react";
import { useStore } from "@/lib/StoreContext";
import { 
  MapPin, Phone, Package, CheckCircle2, IndianRupee, Minus, Plus, QrCode, AlertTriangle, Navigation, Route
} from "lucide-react";

export default function DriverApp() {
  const { clients, completeDelivery } = useStore();
  const [activeClient, setActiveClient] = useState<string | null>(null);
  
  const [step, setStep] = useState(1); // 1: Delivery Details, 2: Payment
  const [fullDelivered, setFullDelivered] = useState(0);
  const [emptyCollected, setEmptyCollected] = useState(0);
  const [damagedCollected, setDamagedCollected] = useState(0);

  const pricePerBottle = 80;
  const totalAmount = fullDelivered * pricePerBottle;

  const handleStartDelivery = (id: string) => {
    setActiveClient(id);
    setStep(1);
    setFullDelivered(0);
    setEmptyCollected(0);
    setDamagedCollected(0);
  };

  const handlePayment = (method: string) => {
    if (activeClient) {
      completeDelivery(activeClient, fullDelivered, fullDelivered * 5, method); // 5 points per bottle
    }
    setActiveClient(null);
  };

  const clientDetails = clients.find(c => c.id === activeClient);

  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8 relative">
      <header className="flex justify-between items-center mb-6 pt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Driver Interface</h1>
          <p className="text-sm text-text-muted font-medium">MH 12 AB 1234 • Hinjewadi Route</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm border border-black/5 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <span>Stock: 45/50</span>
        </div>
      </header>

      {/* TABLET SPLIT SCREEN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Route List */}
        <div className={`flex-1 ${activeClient ? 'hidden md:block' : 'block'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MapPin className="text-primary w-5 h-5" /> Today's Stops
            </h2>
            <button className="text-sm font-bold text-primary bg-primary/10 px-3 md:px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/20 transition-colors active:scale-95">
              <Route className="w-4 h-4" /> <span className="hidden sm:inline">Optimize Route</span><span className="sm:hidden">Optimize</span>
            </button>
          </div>

          {/* Daily Work Summary Box */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-5 text-white mb-6 shadow-[0_8px_20px_rgba(37,99,235,0.2)]">
            <h3 className="font-bold text-sm text-blue-100 uppercase tracking-wider mb-4">Daily Work Summary</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-3xl font-black">{clients.filter(c => c.history.includes("Today")).length}</p>
                <p className="text-sm text-blue-200 font-medium">Completed Stops</p>
              </div>
              <div className="w-px bg-white/20"></div>
              <div className="flex-1">
                <p className="text-3xl font-black">
                  {clients.filter(c => c.history.includes("Today")).reduce((acc, c) => {
                    const match = c.history.match(/Last: (\d+)x/);
                    return acc + (match ? parseInt(match[1]) : 0);
                  }, 0)}
                </p>
                <p className="text-sm text-blue-200 font-medium">Bottles Delivered</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {clients.map(c => {
              const isCompleted = c.history.includes("Today");
              return (
                <div key={c.id} className={`bg-white p-5 rounded-3xl border shadow-sm transition-all ${isCompleted ? 'border-emerald-200 bg-emerald-50/30 opacity-60' : activeClient === c.id ? 'border-primary shadow-md shadow-primary/10' : 'border-black/5 hover:border-primary/30'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className={`font-bold text-lg ${isCompleted ? 'text-emerald-700' : 'text-text'}`}>{c.name}</h3>
                      <p className="text-xs text-text-muted font-medium flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {c.address}
                      </p>
                    </div>
                    {isCompleted && <CheckCircle2 className="w-7 h-7 text-emerald-500" />}
                  </div>
                  {!isCompleted && (
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 hover:bg-gray-100 text-text transition-colors">
                        <Phone className="w-4 h-4" /> <span className="hidden sm:inline">Call</span>
                      </button>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.address)}`} target="_blank" rel="noreferrer" className="flex-[1.5] py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 hover:bg-blue-100 text-blue-700 transition-colors">
                        <Navigation className="w-4 h-4" /> Navigate
                      </a>
                      <button 
                        onClick={() => handleStartDelivery(c.id)}
                        className={`flex-[1.5] py-2 rounded-xl text-sm font-bold transition-colors ${activeClient === c.id ? 'bg-primary text-white shadow-sm' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                      >
                        {activeClient === c.id ? 'Selected' : 'Deliver'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Delivery Details */}
        {activeClient && clientDetails && (
          <div className="flex-1 md:max-w-md lg:max-w-lg md:sticky top-8 self-start">
            
            {step === 1 && (
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-black/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{clientDetails.name}</h2>
                  <button onClick={() => setActiveClient(null)} className="md:hidden text-text-muted">Close</button>
                </div>

                {/* Client History */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl mb-6">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Previous Delivery</p>
                  <p className="text-sm font-medium text-slate-700">{clientDetails.history}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg text-blue-600">Full Given</p>
                      <p className="text-xs text-text-muted font-medium">Bottles delivered</p>
                    </div>
                    <Counter value={fullDelivered} setValue={setFullDelivered} />
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg text-emerald-600">Empty Taken</p>
                      <p className="text-xs text-text-muted font-medium">Bottles retrieved</p>
                    </div>
                    <Counter value={emptyCollected} setValue={setEmptyCollected} />
                  </div>

                  <div className="h-px bg-gray-100 w-full" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg text-red-500">Damaged/Missing</p>
                      <p className="text-xs text-text-muted font-medium">Report broken cans</p>
                    </div>
                    <Counter value={damagedCollected} setValue={setDamagedCollected} />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <span className="text-text-muted font-medium">Total Amount</span>
                    <span className="text-4xl font-black text-text">₹{totalAmount}</span>
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    disabled={fullDelivered === 0}
                    className="w-full py-4 bg-primary text-white text-lg font-bold rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 hover:bg-blue-700"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-black/5 text-center animate-in fade-in slide-in-from-right-8 duration-300">
                <h2 className="text-5xl font-black mb-3 text-text">₹{totalAmount}</h2>
                <p className="text-text-muted font-medium">{clientDetails.name}</p>
                <div className="mt-6 mb-8 inline-block bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  + {fullDelivered * 5} Loyalty Points Earned!
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <button onClick={() => handlePayment("Cash")} className="bg-gray-50 p-6 rounded-3xl flex flex-col items-center gap-4 border border-black/5 active:scale-95 hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                      <IndianRupee className="w-7 h-7 text-emerald-600" />
                    </div>
                    <span className="font-bold text-text">Cash</span>
                  </button>
                  
                  <button onClick={() => handlePayment("Razorpay QR")} className="bg-gray-50 p-6 rounded-3xl flex flex-col items-center gap-4 border border-black/5 active:scale-95 hover:border-blue-500/50 hover:bg-blue-50/30 transition-all">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <QrCode className="w-7 h-7 text-blue-600" />
                    </div>
                    <span className="font-bold text-text">Razorpay QR</span>
                  </button>
                </div>

                <button onClick={() => setStep(1)} className="text-text-muted font-medium hover:text-text transition-colors py-2 px-6">
                  Back
                </button>
              </div>
            )}

          </div>
        )}
        
        {/* Placeholder if nothing selected on Tablet */}
        {!activeClient && (
          <div className="hidden md:flex flex-1 items-center justify-center bg-white/50 rounded-3xl border border-black/5 border-dashed">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-text-muted">Select a route stop to begin delivery.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Counter({ value, setValue }: { value: number, setValue: (v: number) => void }) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
      <button 
        onClick={() => setValue(Math.max(0, value - 1))}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all text-text"
      >
        <Minus className="w-5 h-5" />
      </button>
      <span className="w-6 text-center font-black text-xl text-text">{value}</span>
      <button 
        onClick={() => setValue(value + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20 text-white hover:bg-blue-700 active:scale-95 transition-all"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
