import React from "react";
import { Circle } from "lucide-react";

const RadioGroupContext = React.createContext<{ value: string; onValueChange: (value: string) => void } | null>(null);

export const RadioGroup = React.forwardRef<HTMLDivElement, { value: string; onValueChange: (value: string) => void } & React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", value, onValueChange, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div ref={ref} className={`grid gap-2 ${className}`} {...props} />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, { value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const checked = context?.value === value;

    return (
      <button
        ref={ref}
        role="radio"
        aria-checked={checked}
        onClick={() => context?.onValueChange(value)}
        className={`aspect-square h-4 w-4 rounded-full border border-slate-900 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-slate-900" : ""} ${className}`}
        {...props}
      >
        {checked && <div className="flex items-center justify-center w-full h-full"><div className="h-2 w-2 bg-white rounded-full" /></div>}
      </button>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";