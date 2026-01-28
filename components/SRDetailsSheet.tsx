
import React, { useState } from "react";
import { X, MapPin, Clock, Briefcase, TrendingUp, Calendar, CheckCircle2, ChevronDown, ChevronUp, Zap, Target, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface SRDetailsSheetProps {
  srName: string;
  lastActive: string;
  onClose: () => void;
}

export function SRDetailsSheet({ srName, lastActive, onClose }: SRDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "timeline" | "analytics">("stats");

  const analytics = {
    routeAccuracy: "92%",
    totalDistance: "14.5 km",
    plannedDistance: "12.8 km",
    variance: "+1.7 km",
    estFinishTime: "05:30 PM",
    productivityRate: "84%",
    predictedRemainingOutlets: 13
  };

  const visits = [
    { time: "09:00 AM", store: "Mayer Dua Store", duration: "12m", distance: "Start", status: "success" },
    { time: "09:25 AM", store: "Bhai Bhai General", duration: "45m", distance: "0.8km", status: "success", highlight: "Long Dwell Time" },
    { time: "10:30 AM", store: "Super Fresh Mart", duration: "15m", distance: "3.2km", status: "outlier", highlight: "Outlier Route" },
    { time: "11:15 AM", store: "Daily Needs", duration: "20m", distance: "1.1km", status: "success" },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-slate-900">{srName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-wider">
                Accuracy: {analytics.routeAccuracy}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider">
                Live
            </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-50">
        {(["stats", "timeline", "analytics"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-bold capitalize transition-all border-b-2 ${
              activeTab === tab 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "stats" && (
           <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-3">
                <MetricCard icon={<Target className="w-4 h-4 text-emerald-500" />} label="Achievement" value="78%" sub="On track" />
                <MetricCard icon={<Clock className="w-4 h-4 text-amber-500" />} label="E.O.D Est." value={analytics.estFinishTime} sub="Predicted" />
                <MetricCard icon={<Navigation className="w-4 h-4 text-blue-500" />} label="Distance" value={analytics.totalDistance} sub={`Var: ${analytics.variance}`} />
                <MetricCard icon={<Zap className="w-4 h-4 text-purple-500" />} label="Productivity" value={analytics.productivityRate} sub="Excellent" />
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Visit Progress</h4>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>32 Visited</span>
                    <span>45 Planned</span>
                </div>
              </div>
           </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
            {visits.map((visit, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== visits.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-slate-100" />
                )}
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 shrink-0 ${
                  visit.status === 'outlier' ? 'bg-red-500' : 'bg-emerald-500'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-800">{visit.store}</span>
                    <span className="text-[10px] font-medium text-slate-400">{visit.time}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {visit.duration}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> {visit.distance}
                    </span>
                  </div>
                  {visit.highlight && (
                    <div className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded inline-block ${
                      visit.status === 'outlier' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {visit.highlight}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="text-sm font-bold text-blue-900 mb-2">Efficiency Analysis</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                The SR is following the optimized route with 92% accuracy. 
                Detected 1 outlier event at 10:30 AM due to a 3.2km detour.
              </p>
            </div>
            
            <div className="space-y-2">
                <AccuracyBar label="Route Compliance" value={92} color="bg-blue-500" />
                <AccuracyBar label="Dwell Time Hygiene" value={85} color="bg-emerald-500" />
                <AccuracyBar label="Call Success Rate" value={96} color="bg-purple-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub }: any) {
    return (
        <Card className="border-slate-100 shadow-sm overflow-hidden">
            <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1.5">
                    {icon}
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
                </div>
                <div className="text-lg font-black text-slate-900 leading-none mb-1">{value}</div>
                <div className="text-[9px] text-slate-400 font-medium">{sub}</div>
            </CardContent>
        </Card>
    );
}

function AccuracyBar({ label, value, color }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-700">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
