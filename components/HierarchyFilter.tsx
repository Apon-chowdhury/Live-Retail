import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";

// Mock Data
export const nations = [
  { id: "n1", label: "Bangladesh" },
  { id: "n2", label: "India" },
  { id: "n3", label: "Nepal" }
];

export const divisions = [
  { id: "d1", label: "Dhaka" },
  { id: "d2", label: "Chittagong" },
  { id: "d3", label: "Rajshahi" },
  { id: "d4", label: "Sylhet" }
];

export const regions = [
  { id: "r1", label: "North" },
  { id: "r2", label: "South" },
  { id: "r3", label: "East" },
  { id: "r4", label: "West" }
];

export const territories = [
  { id: "t1", label: "Gulshan" },
  { id: "t2", label: "Banani" },
  { id: "t3", label: "Dhanmondi" },
  { id: "t4", label: "Mirpur" }
];

export const salesRepresentatives = [
  { id: "sr1", label: "Rahim Ahmed" },
  { id: "sr2", label: "Karim Khan" },
  { id: "sr3", label: "John Doe" },
  { id: "sr4", label: "Jane Smith" }
];

export const salesPoints = [
  { id: "sp1", label: "Dhaka Main" },
  { id: "sp2", label: "Ctg Center" }
];

export const routes = [
  { id: "rt1", label: "Route A" },
  { id: "rt2", label: "Route B" },
  { id: "rt3", label: "Route C" }
];

// Mapping to define relationships: SR -> { SalesPoint, Route }
const srMappings: Record<string, { sp: string; route: string }> = {
  sr1: { sp: "sp1", route: "rt1" }, // Rahim -> Dhaka Main, Route A
  sr2: { sp: "sp1", route: "rt2" }, // Karim -> Dhaka Main, Route B
  sr3: { sp: "sp2", route: "rt3" }, // John -> Ctg Center, Route C
  sr4: { sp: "sp2", route: "rt1" }, // Jane -> Ctg Center, Route A
};

interface HierarchyFilterProps {
  onLoadStats: (filters: any) => void;
  onClose: () => void;
  isMobile?: boolean;
}

export function HierarchyFilter({ onLoadStats, onClose, isMobile }: HierarchyFilterProps) {
  const [filters, setFilters] = useState<any>({
    nation: [],
    division: [],
    region: [],
    territory: [],
    salesPoint: [],
    route: [],
    sr: []
  });

  const toggleFilter = (category: string, id: string) => {
    setFilters((prev: any) => {
      const current = prev[category] || [];
      let updated;
      
      if (current.includes(id)) {
        updated = current.filter((item: string) => item !== id);
      } else {
        updated = [...current, id];
      }
      
      let newFilters = { ...prev, [category]: updated };

      // Auto-select logic: If an SR is selected, automatically select their SalesPoint and Route
      if (category === 'sr' && !current.includes(id)) {
         const mapping = srMappings[id];
         if (mapping) {
            // Add Sales Point if not already selected
            const currentSP = newFilters.salesPoint || [];
            if (!currentSP.includes(mapping.sp)) {
                newFilters.salesPoint = [...currentSP, mapping.sp];
            }
            
            // Add Route if not already selected (Enforcing 1 route per SR per day logic)
            const currentRoute = newFilters.route || [];
            if (!currentRoute.includes(mapping.route)) {
                newFilters.route = [...currentRoute, mapping.route];
            }
         }
      }

      return newFilters;
    });
  };

  const handleApply = () => {
    onLoadStats(filters);
    onClose();
  };

  const FilterSection = ({ title, items, category }: any) => (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item: any) => {
          const isSelected = filters[category].includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleFilter(category, item.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`bg-slate-50 ${isMobile ? 'p-4' : 'p-0'}`}>
      <div className="space-y-4">
        <FilterSection title="Nation" items={nations} category="nation" />
        <FilterSection title="Division" items={divisions} category="division" />
        <FilterSection title="Region" items={regions} category="region" />
        <FilterSection title="Territory" items={territories} category="territory" />
        <FilterSection title="Sales Representative" items={salesRepresentatives} category="sr" />
        <FilterSection title="Sales Point" items={salesPoints} category="salesPoint" />
        <FilterSection title="Route" items={routes} category="route" />
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-slate-50 pb-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply}>Load Stats</Button>
      </div>
    </div>
  );
}