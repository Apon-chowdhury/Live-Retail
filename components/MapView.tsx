import React, { useMemo, useState } from "react";
import { AlertCircle, Layers, Home, ChevronDown, ChevronUp, Thermometer, Clock, ShieldAlert } from "lucide-react";
import { Card } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface MapViewProps {
  onSelectSR?: (id: string, name: string, lastActive: string) => void;
  selectedSRId?: string;
  showHeatmap?: boolean;
}

interface OutletPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  index: number;
  status: 'completed' | 'current' | 'outlier' | 'pending' | 'skipped';
  timeSpent: string;
  distance: string;
  alert?: string;
  variance?: string;
  isIdleZone?: boolean;
}

// Hub placed near the starting cluster (Zigatola area)
const DB_HOUSE = { x: 28, y: 75, name: "Zigatola Hub" };

// Logic to generate the specific route shape from the image
const generateRouteData = () => {
  const outlets: OutletPoint[] = [];
  const plannedPoints: { x: number; y: number }[] = [DB_HOUSE];
  const actualJourney: { x: number; y: number }[] = [DB_HOUSE];
  const idleZones: { x: number; y: number; duration: number; type: 'out-of-bound' | 'long-dwell' }[] = [];

  // Defining the specific node paths based on the image's "Zigatola" cluster
  const imageNodes = [
    // Top Left Cluster (Nodes 1-10)
    { x: 15, y: 18, idx: 1 }, { x: 18, y: 14, idx: 2 }, { x: 22, y: 14, idx: 3 }, 
    { x: 26, y: 17, idx: 4 }, { x: 30, y: 19, idx: 5 }, { x: 33, y: 17, idx: 6 },
    { x: 37, y: 19, idx: 7 }, { x: 41, y: 17, idx: 8 }, { x: 44, y: 14, idx: 9 }, { x: 45, y: 16, idx: 10 },
    
    // Left Triangle / Far Left (Nodes 11-14)
    { x: 16, y: 22, idx: 11 }, { x: 17, y: 26, idx: 12 }, { x: 5, y: 28, idx: 13 }, { x: 5, y: 32, idx: 14 },
    
    // Vertical Drop (Nodes 15-20)
    { x: 18, y: 30, idx: 15 }, { x: 19, y: 34, idx: 16 }, { x: 21, y: 30, idx: 17 }, 
    { x: 23, y: 32, idx: 18 }, { x: 23, y: 35, idx: 19 }, { x: 26, y: 38, idx: 20 },
    
    // Zigatola Center (Nodes 21-46)
    { x: 28, y: 44, idx: 24 }, { x: 32, y: 45, idx: 25 }, { x: 35, y: 42, idx: 26 },
    { x: 32, y: 52, idx: 30 }, { x: 35, y: 55, idx: 35 }, { x: 38, y: 52, idx: 40 },
    { x: 42, y: 58, idx: 46 }, { x: 35, y: 70, idx: 59 }
  ];

  imageNodes.forEach((node, i) => {
    let status: OutletPoint['status'] = "completed";
    // Simulate some status variance
    if (node.idx === 59) status = "current";
    if (node.idx % 12 === 0) status = "skipped";
    if (node.idx > 12 && node.idx < 15) status = "outlier";

    const point = {
      id: `O-${node.idx}`,
      name: `Zigatola Outlet ${node.idx}`,
      x: node.x,
      y: node.y,
      index: node.idx,
      status,
      timeSpent: status === "completed" ? `${Math.floor(Math.random() * 30 + 10)}m` : "0m",
      distance: `${(Math.random() * 0.8 + 0.1).toFixed(1)}km`,
      alert: status === "outlier" ? "Far Left Detour" : undefined,
      variance: status === "outlier" ? "+2.1km" : undefined
    };

    outlets.push(point);
    plannedPoints.push({ x: node.x, y: node.y });

    // ACTUAL: Follows outlets but with jitter
    if (status !== "skipped") {
      actualJourney.push({ 
        x: node.x + (Math.random() - 0.5) * 1.5, 
        y: node.y + (Math.random() - 0.5) * 1.5 
      });
    }
  });

  // Adding the "Grey Nodes" Eastward Detour (Idle Zone outside boundary)
  // These represent the deviation towards Dhanmondi visible in the image
  const detourPoints = [
    { x: 45, y: 65 }, { x: 48, y: 68 }, { x: 52, y: 64 }, { x: 58, y: 60 }, { x: 62, y: 62 }
  ];

  detourPoints.forEach((p, idx) => {
    // These only appear in Actual, not planned (pure deviation)
    actualJourney.push(p);
    idleZones.push({
      x: p.x,
      y: p.y,
      duration: 35 + idx * 5,
      type: 'out-of-bound'
    });
  });

  return { outlets, plannedPoints, actualJourney, idleZones };
};

export function MapView({ onSelectSR, selectedSRId, showHeatmap = false }: MapViewProps) {
  const [activeLayer, setActiveLayer] = useState<"planned" | "actual" | "compare">("compare");
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const { outlets, plannedPoints, actualJourney, idleZones } = useMemo(() => generateRouteData(), []);

  const plannedPathStr = useMemo(() => plannedPoints.map(p => `${p.x},${p.y}`).join(" "), [plannedPoints]);
  const actualPathStr = useMemo(() => actualJourney.map(p => `${p.x},${p.y}`).join(" "), [actualJourney]);

  const getMarkerStyle = (status: string) => {
    switch (status) {
      case "completed": return "bg-rose-500 border-rose-100 ring-2 ring-rose-500/20"; // Matching image red nodes
      case "current": return "bg-blue-600 border-blue-100 ring-4 ring-blue-500/30 animate-pulse";
      case "outlier": return "bg-amber-500 border-amber-100 shadow-lg"; // Yellow nodes in image
      case "skipped": return "bg-slate-300 border-slate-200 opacity-40 grayscale";
      default: return "bg-white border-slate-200 opacity-40";
    }
  };

  const parseDuration = (timeStr: string): number => {
    const minsMatch = timeStr.match(/(\d+)m/);
    return minsMatch ? parseInt(minsMatch[1]) : 0;
  };

  return (
    <div className="relative h-full bg-[#e3e9f0] overflow-hidden select-none font-sans">
      {/* View Mode Toggle */}
      <div className="absolute top-4 left-4 z-40">
        <div className="bg-white/95 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl border border-slate-200/50 flex gap-1">
          <ModeTab active={activeLayer === 'planned'} onClick={() => setActiveLayer('planned')} label="Optimized" />
          <ModeTab active={activeLayer === 'actual'} onClick={() => setActiveLayer('actual')} label="Actual Feed" />
          <ModeTab active={activeLayer === 'compare'} onClick={() => setActiveLayer('compare')} label="Market Compliance" />
        </div>
      </div>

      {/* Map Layers */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 pointer-events-none">
          <defs>
            <linearGradient id="plannedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <radialGradient id="heatGradient">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="hubHeatGradient">
              <stop offset="0%" stopColor="#991b1b" stopOpacity="1" />
              <stop offset="50%" stopColor="#dc2626" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="idleHeatGradient">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#64748b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Heatmap Visualization */}
          {(showHeatmap || activeLayer === 'actual') && (
            <>
              {/* Hub Activity Heat */}
              <circle cx={`${DB_HOUSE.x}`} cy={`${DB_HOUSE.y}`} r="10" fill="url(#hubHeatGradient)" className="animate-pulse" />
              
              {/* Idle Detour Heat (Grey markers from image) */}
              {idleZones.map((zone, idx) => (
                <circle 
                  key={`idle-${idx}`} 
                  cx={`${zone.x}`} 
                  cy={`${zone.y}`} 
                  r="6" 
                  fill="url(#idleHeatGradient)" 
                  className="opacity-60"
                />
              ))}

              {/* Outlet Heat Density */}
              {outlets.filter(o => o.status === 'completed').map((o, i) => {
                const duration = parseDuration(o.timeSpent);
                const radius = Math.max(1.5, duration * 0.2); 
                return (
                  <circle 
                    key={`heat-${i}`} 
                    cx={`${o.x}`} 
                    cy={`${o.y}`} 
                    r={radius} 
                    fill="url(#heatGradient)"
                    className="animate-pulse opacity-70"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                );
              })}
            </>
          )}

          {/* System Optimized Path */}
          {(activeLayer === "planned" || activeLayer === "compare") && (
            <polyline
              points={plannedPathStr}
              fill="none"
              stroke="url(#plannedGradient)"
              strokeWidth={activeLayer === 'compare' ? "0.08" : "0.25"}
              strokeDasharray="0.8 0.4"
              className="transition-all duration-700 opacity-40"
            />
          )}

          {/* SR Actual Journey Path */}
          {(activeLayer === "actual" || activeLayer === "compare") && (
            <polyline
              points={actualPathStr}
              fill="none"
              stroke="#10b981"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              className="transition-all duration-700 drop-shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
            />
          )}
        </svg>

        {/* DB Hub Marker */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 z-30" style={{ left: `${DB_HOUSE.x}%`, top: `${DB_HOUSE.y}%` }}>
             <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center border-4 border-white shadow-2xl relative">
                    <Home className="w-6 h-6 text-white" />
                    {(showHeatmap || activeLayer === 'actual') && (
                      <div className="absolute -inset-2 rounded-full bg-red-600/20 animate-ping pointer-events-none" />
                    )}
                </div>
                <div className="mt-1 bg-slate-950 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">HUB ORIGIN</div>
             </div>
        </div>

        {/* Detour/Idle Markers (Grey nodes mirroring the image) */}
        {(activeLayer === 'actual' || activeLayer === 'compare') && idleZones.map((zone, idx) => (
          <div key={`idle-node-${idx}`} className="absolute -translate-x-1/2 -translate-y-1/2 z-30" style={{ left: `${zone.x}%`, top: `${zone.y}%` }}>
             <div className="w-4 h-4 bg-slate-500 rounded-full border-2 border-white shadow-lg" />
          </div>
        ))}

        {/* Outlet Clusters (Red/Yellow nodes mirroring the image) */}
        {outlets.map((o) => {
          const isKeyPoint = o.index === 1 || o.index === 59 || o.index === 13 || o.index === 14;
          const isVisible = activeLayer === 'compare' || 
                           (activeLayer === 'planned' && o.status !== 'skipped') ||
                           (activeLayer === 'actual' && o.status !== 'pending' && o.status !== 'skipped');

          if (!isVisible) return null;

          return (
            <div
              key={o.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20`}
              style={{ left: `${o.x}%`, top: `${o.y}%` }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`cursor-pointer rounded-full border-2 shadow-2xl flex items-center justify-center transition-all hover:scale-150 ${getMarkerStyle(o.status)} ${isKeyPoint ? 'w-8 h-8 z-30' : 'w-5 h-5'}`}>
                    <span className={`text-[9px] font-black ${o.status === 'outlier' ? 'text-slate-900' : 'text-white'}`}>{o.index}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-0 border-none bg-transparent">
                  <Card className="p-4 w-52 border-slate-200 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node #{o.index}</span>
                       <Badge status={o.status} />
                    </div>
                    <div className="text-sm font-black text-slate-900 mb-3">{o.name}</div>
                    <div className="grid grid-cols-2 gap-2">
                       <Metric label="Dwell" value={o.timeSpent} />
                       <Metric label="Hub Dist" value={o.distance} />
                    </div>
                  </Card>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>

      {/* Analytics Insight Card */}
      <div className={`absolute bottom-6 left-6 right-6 md:left-auto md:w-80 bg-white/95 backdrop-blur-3xl border border-slate-200/50 rounded-[2.5rem] shadow-2xl z-40 transition-all duration-300 ${isLegendCollapsed ? 'p-4 rounded-[2rem]' : 'p-6'}`}>
        <div className="flex justify-between items-center mb-2">
           <div className={`transition-all duration-300 ${isLegendCollapsed ? 'opacity-0 w-0 h-0 overflow-hidden' : 'opacity-100'}`}>
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Route Analytics</div>
             <h3 className="text-lg font-black text-slate-900 tracking-tight">Market Execution</h3>
           </div>
           <button 
              onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
              className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-transform active:scale-95 shadow-xl"
           >
             {isLegendCollapsed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
           </button>
        </div>

        <div className={`transition-all duration-300 origin-top ${isLegendCollapsed ? 'scale-y-0 opacity-0 h-0 overflow-hidden' : 'scale-y-100 opacity-100 mt-4'}`}>
            <div className="space-y-4">
               <LegendItem icon={<div className="w-4 h-[2px] border-t-2 border-dashed border-blue-400 opacity-50" />} label="Optimized Plan" value="Clean" />
               <LegendItem icon={<div className="w-4 h-4 bg-rose-500 rounded-full border border-white shadow-sm" />} label="Actual Nodes" value="Verified" color="text-rose-600" />
               <LegendItem icon={<div className="w-4 h-4 bg-amber-500 rounded-full border border-white shadow-sm" />} label="Detour Nodes" value="Outlier" color="text-amber-600" />
               <LegendItem icon={<div className="w-4 h-4 bg-slate-500 rounded-full border border-white shadow-sm" />} label="Idle Outside" value="Inactive" color="text-slate-600" />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inefficiency Gap</span>
                 <span className="text-sm font-black text-rose-600">+112.5m Idle</span>
               </div>
               <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                 <div className="h-full bg-gradient-to-r from-amber-400 to-rose-600 w-[54%] rounded-full shadow-lg" />
               </div>
               <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase text-center">54% deviation from optimized model</div>
            </div>
        </div>
      </div>
    </div>
  );
}

function ModeTab({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? `bg-slate-950 text-white shadow-xl scale-105` : `text-slate-400 hover:text-slate-600`}`}
    >
      {label}
    </button>
  );
}

function LegendItem({ icon, label, value, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
      </div>
      <span className={`text-[10px] font-black ${color || 'text-slate-900'}`}>{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
      <div className="text-[8px] font-black text-slate-400 uppercase tracking-tight mb-0.5">{label}</div>
      <div className="text-xs font-black text-slate-900">{value}</div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const colors: any = {
    completed: "bg-rose-100 text-rose-700",
    current: "bg-blue-100 text-blue-700",
    outlier: "bg-amber-100 text-amber-700",
    skipped: "bg-slate-100 text-slate-600 opacity-60",
    pending: "bg-slate-50 text-slate-400"
  };
  return (
    <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}
