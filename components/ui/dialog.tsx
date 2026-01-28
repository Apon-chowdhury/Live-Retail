import React from "react";
import { X } from "lucide-react";

const DialogContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

export const Dialog = ({ children, open, onOpenChange }: any) => {
  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ asChild, children }: any) => {
  const context = React.useContext(DialogContext);
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

export const DialogContent = ({ children, className = "" }: any) => {
  const context = React.useContext(DialogContext);
  if (!context?.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => context.setOpen(false)} />
      <div className={`relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg ${className}`}>
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

export const DialogHeader = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);

export const DialogTitle = ({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
);

export const DialogDescription = ({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-slate-500 ${className}`} {...props} />
);