"use client";

import { createContext, useCallback, useContext, useState } from "react";

type HinnastamineContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const HinnastamineContext = createContext<HinnastamineContextValue | null>(null);

export function HinnastamineProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <HinnastamineContext.Provider value={{ isOpen, open, close }}>
      {children}
    </HinnastamineContext.Provider>
  );
}

export function useHinnastamine() {
  const ctx = useContext(HinnastamineContext);
  if (!ctx) throw new Error("useHinnastamine must be used within HinnastamineProvider");
  return ctx;
}
