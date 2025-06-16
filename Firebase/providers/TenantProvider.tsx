"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { db } from "@/firebase/client";
import { onSnapshot, doc } from "firebase/firestore";

interface Tenant {
  productName: string;
  [key: string]: any;
}

interface TenantContextType {
  tenant: Tenant;
  id: string;
  path: string;
  isPro: boolean;
}

const Context = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  path: string;
  id: string;
  tenant: Tenant;
}

export default function TenantProvider({
  children,
  path,
  id,
  tenant,
}: TenantProviderProps) {
  const [_tenant, setTenant] = useState<Tenant>(tenant);

  useEffect(() => {
    const workplaceRef = doc(db, path, id);
    const unsubscribeWorkplace = onSnapshot(workplaceRef, (doc) => {
      if (doc.exists()) {
        setTenant(doc.data() as Tenant);
      }
    });

    return () => {
      unsubscribeWorkplace();
    };
  }, [id]);

  // Helper bool to show or hide upgraded content
  const isPro = _tenant?.productName?.includes("Pro");

  return (
    <Context.Provider value={{ tenant: _tenant, id, path, isPro }}>
      {children}
    </Context.Provider>
  );
}

export const useTenant = (): TenantContextType => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
