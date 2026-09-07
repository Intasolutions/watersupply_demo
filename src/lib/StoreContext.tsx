"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Client = {
  id: string;
  name: string;
  address: string;
  phone: string;
  tier: string;
  points: number;
  optIn: boolean;
  history: string;
};

export type Inventory = {
  id: string;
  name: string;
  full: number;
  empty: number;
  damaged: number;
  price: number;
};

export type Assignment = {
  id: string;
  vehicle: string;
  driver: string;
  route: string;
  status: "pending" | "active" | "completed";
  progress: number;
  stock: string;
};

export type Staff = {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: string;
  assignment: string;
};

export type Route = {
  id: string;
  name: string;
  area: string;
  assignedVehicle: string;
};

interface StoreContextType {
  clients: Client[];
  inventory: Inventory[];
  assignments: Assignment[];
  staff: Staff[];
  routes: Route[];
  addClient: (c: Client) => void;
  addInventoryItem: (i: Inventory) => void;
  updateInventory: (id: string, fullDelta: number, emptyDelta: number, damagedDelta: number) => void;
  addAssignment: (a: Assignment) => void;
  completeAssignment: (id: string) => void;
  completeDelivery: (clientId: string, fullDelivered: number, pointsEarned: number, paymentMethod: string) => void;
  addStaff: (s: Staff) => void;
  addRoute: (r: Route) => void;
}

const defaultClients: Client[] = [
  { id: "1", name: "Hotel Sunshine", address: "MG Road, Pune", phone: "+91 98765 43210", tier: "Wholesale", points: 450, optIn: true, history: "Last: 10x 20L (Sept 28)" },
  { id: "2", name: "Tech Park Office", address: "Hinjewadi Phase 1", phone: "+91 87654 32109", tier: "Standard", points: 120, optIn: true, history: "Last: 5x 20L (Sept 25)" },
  { id: "3", name: "Sharma Residence", address: "Kothrud", phone: "+91 76543 21098", tier: "Standard", points: 0, optIn: false, history: "New Client" },
];

const defaultInventory: Inventory[] = [
  { id: "i1", name: "20 Liter Mineral Water", full: 1240, empty: 850, damaged: 12, price: 80 },
  { id: "i2", name: "5 Liter Mineral Water", full: 450, empty: 210, damaged: 0, price: 40 },
];

const defaultAssignments: Assignment[] = [
  { id: "a1", vehicle: "MH 12 AB 1234", driver: "Rahul D.", route: "Hinjewadi - Wakad", status: "active", progress: 75, stock: "50x 20L" },
  { id: "a2", vehicle: "MH 12 CD 5678", driver: "Vikram S.", route: "Kothrud - Bavdhan", status: "completed", progress: 100, stock: "40x 20L" },
];

const defaultStaff: Staff[] = [
  { id: "s1", name: "Rahul D.", phone: "+91 98765 11111", role: "Driver", status: "On Route", assignment: "MH 12 AB 1234" },
  { id: "s2", name: "Vikram S.", phone: "+91 98765 22222", role: "Driver", status: "Available", assignment: "N/A" },
  { id: "s3", name: "Suresh K.", phone: "+91 98765 33333", role: "Helper", status: "On Route", assignment: "MH 12 AB 1234" },
  { id: "s4", name: "Amit P.", phone: "+91 98765 44444", role: "Warehouse Manager", status: "On Duty", assignment: "Main Warehouse" },
  { id: "s5", name: "Ramesh T.", phone: "+91 98765 55555", role: "Helper", status: "On Leave", assignment: "N/A" },
];

const defaultRoutes: Route[] = [
  { id: "r1", name: "Hinjewadi - Wakad", area: "West Pune", assignedVehicle: "MH 12 AB 1234" },
  { id: "r2", name: "Kothrud - Bavdhan", area: "Central Pune", assignedVehicle: "MH 12 CD 5678" },
  { id: "r3", name: "Baner - Balewadi", area: "North-West Pune", assignedVehicle: "Unassigned" },
  { id: "r4", name: "Viman Nagar", area: "East Pune", assignedVehicle: "Unassigned" },
];

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(defaultClients);
  const [inventory, setInventory] = useState<Inventory[]>(defaultInventory);
  const [assignments, setAssignments] = useState<Assignment[]>(defaultAssignments);
  const [staff, setStaff] = useState<Staff[]>(defaultStaff);
  const [routes, setRoutes] = useState<Route[]>(defaultRoutes);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedClients = localStorage.getItem("aqua_clients");
    const savedInventory = localStorage.getItem("aqua_inventory");
    const savedAssignments = localStorage.getItem("aqua_assignments");
    const savedStaff = localStorage.getItem("aqua_staff");
    const savedRoutes = localStorage.getItem("aqua_routes");

    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
    if (savedStaff) setStaff(JSON.parse(savedStaff));
    if (savedRoutes) setRoutes(JSON.parse(savedRoutes));
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("aqua_clients", JSON.stringify(clients));
    localStorage.setItem("aqua_inventory", JSON.stringify(inventory));
    localStorage.setItem("aqua_assignments", JSON.stringify(assignments));
    localStorage.setItem("aqua_staff", JSON.stringify(staff));
    localStorage.setItem("aqua_routes", JSON.stringify(routes));
  }, [clients, inventory, assignments, staff, routes, isLoaded]);

  const addClient = (c: Client) => setClients([...clients, c]);
  
  const addInventoryItem = (i: Inventory) => setInventory([...inventory, i]);

  const updateInventory = (id: string, fullDelta: number, emptyDelta: number, damagedDelta: number) => {
    setInventory(prev => prev.map(inv => 
      inv.id === id ? { ...inv, full: inv.full + fullDelta, empty: inv.empty + emptyDelta, damaged: inv.damaged + damagedDelta } : inv
    ));
  };

  const addAssignment = (a: Assignment) => setAssignments([...assignments, a]);

  const completeAssignment = (id: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, status: "completed", progress: 100 } : a
    ));
  };

  const completeDelivery = (clientId: string, fullDelivered: number, pointsEarned: number, paymentMethod: string) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, points: c.points + pointsEarned, history: `Last: ${fullDelivered}x 20L (Today via ${paymentMethod})` } : c
    ));
    updateInventory("i1", -fullDelivered, fullDelivered, 0); // Mock deduction
  };

  const addStaff = (s: Staff) => setStaff([...staff, s]);
  
  const addRoute = (r: Route) => setRoutes([...routes, r]);

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <StoreContext.Provider value={{ 
      clients, inventory, assignments, staff, routes, 
      addClient, addInventoryItem, updateInventory, 
      addAssignment, completeAssignment, completeDelivery, 
      addStaff, addRoute 
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
