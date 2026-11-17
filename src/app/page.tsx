"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AuthPage from "@/components/AuthPage";
import HostDashboard from "@/components/HostDashboard"; // 🚀 Connect our newly created cockpit canvas
import { LogOut, Building2, UserCheck, Sparkles } from "lucide-react";
import GuestDashboard from "@/components/GuestDashboard";

function GuestDashboardDummy() {
  return (
    <div className="flex-1 rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center p-8 text-center text-zinc-500 font-bold text-xs uppercase tracking-wide">
      <UserCheck className="h-8 w-8 text-emerald-500 mb-2 animate-bounce" />
      <p>Guest Travel Stream Dashboard Active (Standby)</p>
    </div>
  );
}

function MainDashboardConductor() {
  const { isAuthenticated, userType, clearAuthSession } = useAuth();

  // 🛡️ SECURITY GUARD: Re-route unauthenticated traffic straight to the AuthPage
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0e0e10] text-[#efeff1] font-sans antialiased">
      {/* Premium Dark Navigation Control Row */}
      <header className="flex h-16 w-full items-center justify-between border-b border-[#1f1f23] bg-[#18181b] px-6 shadow-md z-50 select-none shrink-0">
        <div className="flex items-center gap-2 font-black text-purple-500 text-sm tracking-tighter">
          <Building2 className="h-5 w-5 text-purple-500 animate-pulse" />
          <span>
            {" "}
            STAYS<span className="text-white font-medium">BOOKING</span>{" "}
          </span>
        </div>

        {/* Central Identity Matrix Capsule Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
            {userType === "HOST" ? (
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            ) : (
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${userType === "HOST" ? "text-purple-400" : "text-emerald-400"}`}
            >
              Terminal Secure Node: {userType} MODE
            </span>
          </div>

          {/* Revoke Credentials Action Controller */}
          <button
            type="button"
            onClick={clearAuthSession}
            className="h-8 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-rose-400 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-inner"
          >
            <LogOut className="h-3 w-3" />
            <span>Terminate Session</span>
          </button>
        </div>
      </header>

      {/* 🚀 CONDITIONAL WORKSPACE CANVASES MULTIPLEXING INTERACTION GRID */}
      <main className="flex-1 w-full overflow-hidden p-6 md:p-8 flex flex-col min-h-0 max-w-7xl mx-auto">
        {userType === "HOST" ? <HostDashboard /> : <GuestDashboard />}
      </main>
    </div>
  );
}

export default function HomeMasterDashboardEntry() {
  return (
    <AuthProvider>
      <MainDashboardConductor />
    </AuthProvider>
  );
}
