import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BadgeCheck, Clock, XCircle } from "lucide-react";

interface OrdersTableProps {
  isMobile: boolean;
  hierarchyFilters?: any;
}

export function OrdersTable({ isMobile, hierarchyFilters }: OrdersTableProps) {
  const orders = [
    { id: "ORD-001", customer: "Super Store A", amount: 12500, status: "completed", date: "2024-03-10" },
    { id: "ORD-002", customer: "Local Mart", amount: 3400, status: "pending", date: "2024-03-11" },
    { id: "ORD-003", customer: "City Grocery", amount: 8900, status: "cancelled", date: "2024-03-11" },
    { id: "ORD-004", customer: "Mega Shop", amount: 45000, status: "completed", date: "2024-03-12" },
    { id: "ORD-005", customer: "Corner Store", amount: 1200, status: "completed", date: "2024-03-12" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <BadgeCheck className="w-4 h-4 text-emerald-500" />;
      case "pending": return <Clock className="w-4 h-4 text-amber-500" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className={isMobile ? "p-4" : "p-6"}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <span className="text-sm text-slate-500">{orders.length} orders found</span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">${order.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 capitalize">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}