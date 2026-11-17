"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string;
  userType: "HOST" | "GUEST" | null;
  isAuthenticated: boolean;
  setAuthSession: (token: string, type: "HOST" | "GUEST") => void;
  clearAuthSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>("");
  const [userType, setUserType] = useState<"HOST" | "GUEST" | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedToken = localStorage.getItem("authToken") || "";
      const cachedType = localStorage.getItem("userType") as
        | "HOST"
        | "GUEST"
        | null;

      if (cachedToken && (cachedType === "HOST" || cachedType === "GUEST")) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(cachedToken);
        setUserType(cachedType);
      }
      setIsHydrated(true);
    }
  }, []);

  const setAuthSession = (newToken: string, type: "HOST" | "GUEST") => {
    setToken(newToken);
    setUserType(type);
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("userType", type);
    }
  };

  const clearAuthSession = () => {
    setToken("");
    setUserType(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
    }
  };

  if (!isHydrated) {
    return (
      <div className="h-screen w-screen bg-[#0e0e10] flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-zinc-700 animate-pulse">
        Stabilizing Security Core Infrastructure Matrix...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userType,
        isAuthenticated: !!token,
        setAuthSession,
        clearAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "Security Boundary Breach: useAuth must be consumed strictly inside a validated AuthProvider container layer.",
    );
  }
  return context;
}
