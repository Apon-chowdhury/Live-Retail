import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SelectContext = React.createContext<{ 
  value: string; 
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export const Select = ({ children, defaultValue, onValueChange }: any) => {
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = "" }: any) => {
  const context = React.useContext(SelectContext);
  return (
    <button
      onClick={() => context?.setOpen(!context.open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

export const SelectValue = ({ placeholder }: any) => {
  const context = React.useContext(SelectContext);
  return <span className="block truncate">{context?.value || placeholder}</span>;
};

export const SelectContent = ({ children, className = "" }: any) => {
  const context = React.useContext(SelectContext);
  if (!context?.open) return null;

  return (
    <div className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-80 ${className} top-full mt-1 w-full`}>
      <div className="p-1">{children}</div>
    </div>
  );
};

export const SelectItem = ({ value, children, className = "" }: any) => {
  const context = React.useContext(SelectContext);
  return (
    <div
      onClick={() => context?.onValueChange(value)}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    >
      {context?.value === value && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-slate-900" />
        </span>
      )}
      {children}
    </div>
  );
};