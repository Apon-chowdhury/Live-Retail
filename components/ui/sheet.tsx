import React from "react";
import { X } from "lucide-react";

const SheetContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

export const Sheet = ({ children, open, onOpenChange }: any) => {
  return (
    <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

export const SheetTrigger = ({ asChild, children }: any) => {
  const context = React.useContext(SheetContext);
  // Removed unused Comp declaration that referenced non-existent React.Slot

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
        onClick: (e: any) => {
            (children as React.ReactElement<any>).props.onClick?.(e);
            context?.setOpen(true);
        }
    });
  }
  
  return <button onClick={() => context?.setOpen(true)}>{children}</button>;
};

export const SheetContent = ({ children, side = "right", className = "" }: any) => {
  const context = React.useContext(SheetContext);
  if (!context?.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => context.setOpen(false)} />
      <div className={`fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out duration-300 transform ${side === 'right' ? 'right-0 h-full border-l slide-in-from-right' : 'bottom-0 w-full border-t slide-in-from-bottom'} ${className}`}>
        <button
          onClick={() => context.setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetHeader = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props} />
);

export const SheetTitle = ({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={`text-lg font-semibold text-slate-950 ${className}`} {...props} />
);

export const SheetDescription = ({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-slate-500 ${className}`} {...props} />
);