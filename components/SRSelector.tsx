import React from "react";
import { User, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";

interface SRSelectorProps {
  onSelectSR: (id: string, name: string, lastActive: string) => void;
  viewMode: string;
  onViewModeChange: (mode: string) => void;
}

export function SRSelector({ onSelectSR, viewMode, onViewModeChange }: SRSelectorProps) {
  const activeSRs = [
    { id: "sr1", name: "John Doe", active: "10m ago" },
    { id: "sr2", name: "Jane Smith", active: "25m ago" },
    { id: "sr3", name: "Mike Johnson", active: "Now" },
  ];

  return (
    <Card className="bg-white/95 backdrop-blur shadow-lg border-slate-200">
      <div className="p-3">
        <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Nearby Sales Reps</div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {activeSRs.map((sr) => (
            <button
              key={sr.id}
              onClick={() => onSelectSR(sr.id, sr.name, sr.active)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-full pl-1 pr-3 py-1 transition-all min-w-fit"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-900">{sr.name}</div>
                <div className="text-[10px] text-slate-500">{sr.active}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}