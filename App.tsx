
import React, { useState } from "react";
import { Bell, Plus, Minus, Menu, X, ChevronUp, ChevronLeft, ChevronRight, ChevronDown, MapPin, TrendingUp, Users, DollarSign, Monitor, Smartphone, Filter, Home, BarChart2, FileText, ShoppingCart, Eye, EyeOff, User, Loader2, Thermometer, Navigation2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Label } from "./components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { HierarchyFilter, nations, divisions, regions, territories, salesRepresentatives, salesPoints, routes } from "./components/HierarchyFilter";
import { OrdersTable } from "./components/OrdersTable";
import { Button } from "./components/ui/button";
import { SRSelectorDesktop } from "./components/SRSelectorDesktop";
import { SRDetailsSheet } from "./components/SRDetailsSheet";
import { OutletsOverview } from "./components/OutletsOverview";
import { MapView } from "./components/MapView";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [viewMode, setViewMode] = useState("sr-live");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [hierarchyFilters, setHierarchyFilters] = useState<any>({
    nation: [],
    division: [],
    region: [],
    territory: [],
    salesPoint: [],
    route: [],
    sr: []
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<"map" | "stats">("map");

  const tabs = [
    { id: "home", label: "Home" },
    { id: "comparison", label: "Comparison" },
    { id: "report", label: "Report" },
    { id: "live-brand", label: "Live Brand Dashboard" },
    { id: "order", label: "Order" },
  ];

  const handleLoadStats = (filters: any) => {
    setIsLoadingData(true);
    setHierarchyFilters(filters);
    const loadingToastId = toast.loading("Optimizing high-density routes...");
    
    setTimeout(() => {
      setIsLoadingData(false);
      toast.dismiss(loadingToastId);
      toast.success(`Loaded 70-point route analysis.`, { icon: "🗺️" });
      setActiveTab("home");
      setMobileViewMode("map");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" richColors />
      
      {/* Device Switcher */}
      <div className="fixed top-4 right-4 z-[60] bg-white/95 backdrop-blur rounded-full shadow-2xl border border-slate-200 p-1 flex gap-1">
        <button onClick={() => setDeviceView("desktop")} className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${deviceView === "desktop" ? "bg-slate-900 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
          <Monitor className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase">Desktop</span>
        </button>
        <button onClick={() => setDeviceView("mobile")} className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${deviceView === "mobile" ? "bg-slate-900 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
          <Smartphone className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase">Mobile</span>
        </button>
      </div>

      {deviceView === "desktop" ? (
        <DesktopView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          tabs={tabs}
          hierarchyFilters={hierarchyFilters}
          handleLoadStats={handleLoadStats}
          isLoadingData={isLoadingData}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
        />
      ) : (
        <MobileViewFrame
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          tabs={tabs}
          hierarchyFilters={hierarchyFilters}
          handleLoadStats={handleLoadStats}
          isLoadingData={isLoadingData}
          mobileViewMode={mobileViewMode}
          setMobileViewMode={setMobileViewMode}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
        />
      )}
    </div>
  );
}

function DesktopView({ activeTab, setActiveTab, viewMode, setViewMode, tabs, hierarchyFilters, handleLoadStats, isLoadingData, showHeatmap, setShowHeatmap }: any) {
  const [showHierarchyFilter, setShowHierarchyFilter] = useState(false);
  const [showSRDetails, setShowSRDetails] = useState(false);
  const [selectedSRName, setSelectedSRName] = useState("");
  const [selectedSRLastActive, setSelectedSRLastActive] = useState("");
  const [selectedSRId, setSelectedSRId] = useState("");

  const handleSelectSR = (srId: string, srName: string, lastActive?: string) => {
    setSelectedSRName(srName);
    setSelectedSRId(srId);
    if (lastActive) setSelectedSRLastActive(lastActive);
    setShowSRDetails(true);
  };

  return (
    <TooltipProvider>
      <nav className="bg-slate-900 shadow-xl border-b border-slate-800 relative z-50">
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic">AK</div>
            <div className="h-4 w-[1px] bg-slate-700 mx-2" />
            <div className="flex items-center gap-1">
              {tabs.map((tab: any) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 transition-all duration-300 relative text-[11px] font-black uppercase tracking-wider ${activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-white"}`}>
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full shadow-[0_-4px_10px_rgba(59,130,246,0.5)]" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Connected Live</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-black text-xs hover:border-blue-500 cursor-pointer transition-colors">JS</div>
          </div>
        </div>
      </nav>

      <div className="relative h-[calc(100vh-56px)] bg-slate-50">
        {isLoadingData && <LoadingOverlay />}
        
        {activeTab === "order" ? (
          <OrdersTable isMobile={false} hierarchyFilters={hierarchyFilters} />
        ) : (
          <div className="p-4 h-full">
            <div className="grid grid-cols-[340px_1fr] gap-4 h-full">
              {/* Sidebar Controls */}
              <div className="flex flex-col gap-4 overflow-hidden">
                <Dialog open={showHierarchyFilter} onOpenChange={setShowHierarchyFilter}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest h-14 shadow-xl shadow-slate-900/10 rounded-2xl">
                        <Filter className="w-4 h-4 mr-3" />
                        Hierarchy Context
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white rounded-3xl overflow-hidden border-none shadow-2xl">
                      <HierarchyFilter onLoadStats={handleLoadStats} onClose={() => setShowHierarchyFilter(false)} />
                    </DialogContent>
                </Dialog>

                <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
                    {showSRDetails ? (
                        <SRDetailsSheet srName={selectedSRName} lastActive={selectedSRLastActive} onClose={() => setShowSRDetails(false)} />
                    ) : (
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Market Intelligence</span>
                            </div>
                            <FinancialSummaryCard />
                            <OutletsOverview />
                            <PerformanceMetricsCard />
                        </div>
                    )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex flex-col gap-4">
                <Card className="border-slate-200 shadow-2xl overflow-hidden h-full flex flex-col relative rounded-[2rem]">
                  <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 px-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <SRSelectorDesktop onSelectSR={handleSelectSR} />
                        <div className="h-6 w-[1px] bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <Button 
                                variant={showHeatmap ? "default" : "outline"} 
                                size="sm" 
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className="h-9 font-black uppercase tracking-tight rounded-full px-5 text-[10px]"
                            >
                                <Thermometer className="w-3.5 h-3.5 mr-2" />
                                Heatmap {showHeatmap ? "Enabled" : "Disabled"}
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Market View</span>
                       <div className="bg-slate-100 p-1 rounded-full flex gap-1">
                          <button className="px-4 py-1.5 bg-white shadow-sm rounded-full text-[10px] font-black uppercase tracking-tight text-slate-900">Intelligence</button>
                          <button className="px-4 py-1.5 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-tight hover:text-slate-600 transition-colors">Raw Feed</button>
                       </div>
                    </div>
                  </div>

                  <div className="relative flex-1">
                    <MapView onSelectSR={handleSelectSR} selectedSRId={selectedSRId} showHeatmap={showHeatmap} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function FinancialSummaryCard() {
    return (
        <Card className="border-none shadow-none bg-blue-50/40 p-1 rounded-2xl overflow-hidden">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-blue-100/50">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Target Performance
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mb-1">Assigned</div>
                        <div className="text-xl font-black text-slate-900">2.36B</div>
                    </div>
                    <div>
                        <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-tight mb-1">Realized</div>
                        <div className="text-xl font-black text-emerald-600">2.28B</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function PerformanceMetricsCard() {
    return (
        <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Route Efficiency</h4>
            <div className="space-y-3">
                <EfficiencyMetric label="Visit Accuracy" value={92} color="bg-blue-500" />
                <EfficiencyMetric label="Strike Rate" value={78} color="bg-emerald-500" />
                <EfficiencyMetric label="Productivity" value={65} color="bg-purple-500" />
            </div>
        </div>
    );
}

function EfficiencyMetric({ label, value, color }: any) {
    return (
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
                <span className="text-xs font-black text-slate-900">{value}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

// Fix: Use Navigation2 icon in LoadingOverlay which is now correctly imported from lucide-react at the top of the file
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-xl z-[100] flex items-center justify-center animate-in fade-in duration-500">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-blue-50 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Navigation2 className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
        </div>
        <p className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] ml-1">Optimizing Routes...</p>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Recalculating 70 Outlet Nodes</p>
      </div>
    </div>
  );
}

function MobileViewFrame({ activeTab, setActiveTab, tabs, hierarchyFilters, handleLoadStats, isLoadingData, mobileViewMode, setMobileViewMode, showHeatmap, setShowHeatmap }: any) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-100">
      {/* Device Shell */}
      <div className="relative w-[375px] h-[812px] bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[12px] border-slate-900 overflow-hidden ring-8 ring-slate-800/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>
        
        <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
            {isLoadingData && <LoadingOverlay />}
            
            {/* Mobile Header */}
            <div className="bg-slate-900 p-6 pt-12 text-white">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Live Monitor</div>
                        <div className="text-lg font-black tracking-tight">Route Intelligence</div>
                    </div>
                    <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                        <Bell className="w-5 h-5" />
                    </div>
                </div>
                
                {/* Horizontal Tab Scroll */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                    {tabs.map((tab: any) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-800 text-slate-400"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'home' && (
                    <div className="h-full flex flex-col">
                        <div className="flex border-b border-slate-100 bg-white">
                            <button onClick={() => setMobileViewMode('map')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${mobileViewMode === 'map' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Visual Map</button>
                            <button onClick={() => setMobileViewMode('stats')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${mobileViewMode === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Analytics</button>
                        </div>
                        <div className="flex-1 relative">
                            {mobileViewMode === 'map' ? (
                                <MapView showHeatmap={showHeatmap} />
                            ) : (
                                <div className="p-6 space-y-6 overflow-y-auto h-full pb-20">
                                    <FinancialSummaryCard />
                                    <OutletsOverview />
                                    <PerformanceMetricsCard />
                                    <div className="h-20" /> {/* Spacer */}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === 'order' && (
                    <div className="h-full overflow-y-auto">
                        <OrdersTable isMobile={true} />
                    </div>
                )}
            </div>

            {/* Mobile Bottom Bar */}
            <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-around px-4 pb-4">
                <BottomNavIcon icon={<Home />} active={activeTab === 'home'} label="Home" />
                <BottomNavIcon icon={<BarChart2 />} active={activeTab === 'comparison'} label="Stats" />
                <div className="w-14 h-14 bg-slate-900 rounded-3xl flex items-center justify-center -translate-y-8 shadow-2xl shadow-slate-900/40 ring-4 ring-white">
                    <Filter className="w-6 h-6 text-white" />
                </div>
                <BottomNavIcon icon={<ShoppingCart />} active={activeTab === 'order'} label="Sales" />
                <BottomNavIcon icon={<User />} active={false} label="Me" />
            </div>
        </div>
      </div>
    </div>
  );
}

function BottomNavIcon({ icon, active, label }: any) {
    return (
        <div className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-600' : 'text-slate-400'}`}>
            {React.cloneElement(icon, { className: "w-5 h-5" })}
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        </div>
    );
}
