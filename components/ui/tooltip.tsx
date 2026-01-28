import React, { useState } from "react";

export const TooltipProvider = ({ children }: any) => <>{children}</>;

export const Tooltip = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  return React.Children.map(children, (child) => {
     if (React.isValidElement(child)) {
         return React.cloneElement(child as React.ReactElement<any>, { open, setOpen });
     }
     return child;
  });
};

export const TooltipTrigger = ({ asChild, children, open, setOpen }: any) => {
    const handleMouseEnter = () => setOpen(true);
    const handleMouseLeave = () => setOpen(false);
    
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave
        });
    }
  return <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{children}</div>;
};

export const TooltipContent = ({ children, className = "", open }: any) => {
  if (!open) return null;
  return (
    <div className={`absolute z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}>
      {children}
    </div>
  );
};