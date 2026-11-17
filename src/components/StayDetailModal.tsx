"use client";

import React from "react";
import { Building2, X, Users, MapPin, Layers, UserCheck } from "lucide-react";
import { StayListItem } from "@/services/api";

interface StayDetailModalProps {
  stay: StayListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StayDetailModal({
  stay,
  isOpen,
  onClose,
}: StayDetailModalProps) {
  // 🛡️ Guard Boundary: If overlay toggle state is locked, prevent browser rendering threads
  if (!isOpen || !stay) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      {/* MASTER CORE GLASS BOX CONTAINER */}
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#18181b] p-6 relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 text-[#efeff1]">
        {/* Absolute Window Dismissal Switch Trigger */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Dynamic Header Section */}
        <div className="flex items-start gap-3.5 border-b border-zinc-900 pb-4">
          <div className="h-10 w-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="pr-8">
            <h3 className="text-sm font-black uppercase tracking-tight text-white leading-tight">
              {stay.name}
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-zinc-700" /> {stay.address}
            </p>
          </div>
        </div>

        {/* Real Dynamic Structural Multi-Image Array Grid Carousel */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="h-3 w-3 text-purple-400" /> Multi-Image Ledger
            Slices ({stay.images?.length || 0} Frames)
          </label>

          <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3 border border-zinc-900 rounded-xl">
            {stay.images && stay.images.length > 0 ? (
              stay.images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shadow-inner group"
                >
                  <img
                    src={imgUrl}
                    alt={`Stay Frame ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-1.5 right-1.5 font-mono text-[8px] font-black bg-black/80 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                    FRAME_0{index + 1}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-6 text-center text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                No production images attached to this asset node
              </div>
            )}
          </div>
        </div>

        {/* Extended Description Specification Field Block */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
            Spatial Architectural Specifications & Amenities Guidelines
          </label>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-300 font-medium leading-relaxed max-h-[120px] overflow-y-auto whitespace-pre-wrap">
            {stay.description ||
              "No specific design guidelines declared for this infrastructure node."}
          </div>
        </div>

        {/* Secondary Informational Meta Capsule footer */}
        <div className="flex items-center justify-between border-t border-zinc-900 pt-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" /> Limits:{" "}
              <span className="text-zinc-400">
                {stay.guestNumber} travelers
              </span>
            </div>
            {stay.host?.username && (
              <div className="flex items-center gap-1 border-l border-zinc-800 pl-4 text-purple-400 font-black animate-in fade-in duration-300">
                <UserCheck className="h-3 w-3 text-purple-500" /> Host:{" "}
                <span className="text-zinc-300 lowercase">
                  {stay.host.username}
                </span>
              </div>
            )}
          </div>
          <span>NODE REF: #{stay.id}</span>
        </div>
      </div>
    </div>
  );
}
