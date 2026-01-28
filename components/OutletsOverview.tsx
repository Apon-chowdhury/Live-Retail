import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function OutletsOverview() {
  return (
    <Card className="border-slate-200 shadow-md">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-purple-600 text-sm">
          <div className="w-1 h-4 bg-purple-500 rounded-full" />
          Outlets Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pt-0 pb-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-slate-600 mb-0.5 text-xs">Total Outlets</div>
            <div className="text-slate-900 text-sm">3.67M</div>
          </div>
          <div>
            <div className="text-slate-600 mb-0.5 text-xs">Billed Outlets</div>
            <div className="text-slate-900 text-sm">969.41K</div>
          </div>
          <div>
            <div className="text-slate-600 mb-0.5 text-xs">Visited Outlets</div>
            <div className="text-slate-900 text-sm">1.1M</div>
          </div>
          <div>
            <div className="text-slate-600 mb-0.5 text-xs">Reach</div>
            <div className="text-slate-900 text-sm">30.07%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}