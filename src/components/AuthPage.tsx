"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { login, register } from "@/services/api";
import {
  LogIn,
  UserPlus,
  ShieldAlert,
  Sparkles,
  Building2,
} from "lucide-react";

export default function AuthPage() {
  const { setAuthSession } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [role, setRole] = useState<"GUEST" | "HOST">("GUEST");

  // Inbound Stateful Credential Nodes
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || isSubmitLoading) return;

    setIsSubmitLoading(true);
    setErrorMessage("");
    try {
      if (isLoginMode) {
        // Execute live production auth handshake via our API gateway core
        const response = await login({
          username,
          password,
        });
        setAuthSession(response.token, role);
      } else {
        // Execute fresh account provisioning with calibrated Spring Security role flags
        await register({
          username,
          password,
          role: role === "HOST" ? "ROLE_HOST" : "ROLE_GUEST",
        });
        alert(
          "Account records successfully deployed onto live nodes! Channeling back to authorization terminals. 🔑",
        );
        setIsLoginMode(true);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "System authentication tunnel exception caught.",
      );
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0e0e10] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Cyberpunk Ambient Glow Matrices */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-pulse" />

      {/* PREMIUM GLASMORPHISM CONTAINER */}
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-[#18181b]/40 p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Terminal Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto shadow-inner">
            <Building2 className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-black tracking-tighter text-white uppercase">
            STAYS<span className="text-purple-500 font-medium">BOOKING</span>
          </h1>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {isLoginMode
              ? "Secure Authentication Access Gate"
              : "Scaffolding Extended Account Identity"}
          </p>
        </div>

        {/* Dynamic Dual-Role Switch Toggles */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-950/60 p-1 rounded-xl border border-zinc-900 mb-6">
          {(["GUEST", "HOST"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              disabled={isSubmitLoading}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                role === r
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/10"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {r === "GUEST" ? "Guest Traveler" : "Property Host"}
            </button>
          ))}
        </div>

        {/* Input Ingestion Form Grid */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
              Access Identifier
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitLoading}
              placeholder="Username string payload"
              className="w-full bg-zinc-950/40 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 font-medium disabled:opacity-40 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
              Security Credentials Cipher
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitLoading}
              placeholder="••••••••••••••"
              className="w-full bg-zinc-950/40 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 font-medium disabled:opacity-40 transition-colors"
            />
          </div>

          {/* Conditional Error Feedback Trap */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold animate-in fade-in slide-in-from-top-1 duration-150">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <p className="truncate">Fault Trapped: {errorMessage}</p>
            </div>
          )}

          {/* Execution Button */}
          <button
            type="submit"
            disabled={!username.trim() || !password.trim() || isSubmitLoading}
            className="w-full h-11 bg-purple-600 hover:bg-purple-500 active:scale-[0.99] text-white rounded-xl font-black uppercase text-xs tracking-wider transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none cursor-pointer mt-6 shadow-lg shadow-purple-600/10"
          >
            {isSubmitLoading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : isLoginMode ? (
              <>
                <LogIn className="h-3.5 w-3.5" />
                <span>Log In</span>
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>

        {/* View Mode Mode Interop Toggle */}
        <div className="mt-6 border-t border-zinc-900/60 pt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMessage("");
            }}
            disabled={isSubmitLoading}
            className="text-[11px] font-bold text-zinc-500 hover:text-purple-400 transition-colors duration-150 cursor-pointer flex items-center gap-1.5 mx-auto"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {isLoginMode
                ? "First deployment wave? Instantiate fresh profile credentials"
                : "Return back to existing credential tracks"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
