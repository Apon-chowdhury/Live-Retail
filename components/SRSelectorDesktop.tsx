import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SRSelectorDesktopProps {
  onSelectSR: (id: string, name: string, lastActive: string) => void;
}

export function SRSelectorDesktop({ onSelectSR }: SRSelectorDesktopProps) {
  return (
    <div className="w-[300px]">
      <Select onValueChange={(val: string) => onSelectSR(val, "Selected SR", "Just now")}>
        <SelectTrigger>
          <SelectValue placeholder="Search or select SR..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sr1">John Doe - Active 10m ago</SelectItem>
          <SelectItem value="sr2">Jane Smith - Active 25m ago</SelectItem>
          <SelectItem value="sr3">Mike Johnson - Online</SelectItem>
          <SelectItem value="sr4">Sarah Williams - Active 1h ago</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}