/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
// 🚀 1:1 Ingest full-stack traveler action models from our central network layer
import {
  searchStays,
  bookStay,
  getReservations,
  cancelReservation,
  StayListItem,
  ReservationItem,
} from "@/services/api";
import StayDetailModal from "@/components/StayDetailModal";
import {
  Search,
  Users,
  Calendar,
  Building2,
  MapPin,
  Loader2,
  AlertCircle,
  BookmarkCheck,
  Clock,
  Trash2,
  CheckCircle2,
} from "lucide-react";

export default function GuestDashboard() {
  const { userType } = useAuth();

  // Core Data Streams & UI Pipeline States
  const [stays, setStays] = useState<StayListItem[]>([]);
  const [myBookings, setMyBookings] = useState<ReservationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Inbound Search Form Attribute State Nodes
  const [guestNumber, setGuestNumber] = useState<string>("2");
  const [checkinDate, setCheckinDate] = useState<string>("");
  const [checkoutDate, setCheckoutDate] = useState<string>("");

  // Reusable Overlay Control States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTargetStay, setModalTargetStay] = useState<StayListItem | null>(
    null,
  );

  // 🧭 FUNCTION A: Ingest and synchronize traveler's personal historical reservation log sheets
  const loadTravelerBookings = async () => {
    try {
      const logs = await getReservations();
      setMyBookings(logs);
    } catch (err: unknown) {
      console.error("Failed to establish logs pipeline synchronization:", err);
    }
  };

  // Automated log loading pulse execution when the traveler console mounts
  useEffect(() => {
    loadTravelerBookings();
  }, []);

  // 🧭 FUNCTION B: Multi-Conditional Cloud Search Pipeline with optimization filters
  const executeTravelSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!checkinDate || !checkoutDate) {
      setErrorMessage(
        "Timeline Breach: Check-in and check-out parameters are mandatory.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const results = await searchStays({
        guest_number: guestNumber,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
      });

      // Maintain our high-fps image formatting injection to guarantee smooth repaints
      const optimizedResults = results.map((stay) => ({
        ...stay,
        images: stay.images
          ? stay.images.map((imgUrl) =>
              imgUrl.includes("://unsplash.com") && !imgUrl.includes("w=")
                ? `${imgUrl}?auto=format&fit=crop&w=600&q=75`
                : imgUrl,
            )
          : [],
      }));
      setStays(optimizedResults);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Search failure: network handshake disrupted.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  // 🧭 FUNCTION C: ASYNC RESERVATION COMMITTAL (一键异步锁仓订房交易节点)
  const handleBookStay = async (stayId: number) => {
    // Structural Parameter Guard Check
    if (!checkinDate || !checkoutDate) {
      setErrorMessage(
        "Transaction Blocked: Select active check-in/out parameters on the search row first.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      // Execute live cloud reservation committal matching api.ts payload specification
      await bookStay({
        listingId: stayId,
        checkInDate: checkinDate,
        checkOutDate: checkoutDate,
      });

      setSuccessMessage(
        `Reservation locked successfully! Travel sequence attached to Stay Matrix #${stayId}. 🎉`,
      );

      // Reactive Trigger: Force instantaneous background refresh to sync the traveler's logs
      await loadTravelerBookings();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Transaction Fault: Cloud server rejected lease lockout request.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 🧭 FUNCTION D: TRANSACTION REVOCATION DISPATCH (带状态防二次点击的远程退订销毁算子)
  const handleCancelReservation = async (reservationId: number) => {
    if (
      !confirm(
        "CRITICAL WARNING: Are you sure you want to completely break and cancel this active travel contract?",
      )
    )
      return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      // Execute live server entity destruction pipeline
      await cancelReservation(reservationId);
      setSuccessMessage(
        `Transaction successfully revoked! Reservation record #${reservationId} dropped.`,
      );

      // Cascade update across the workspace logs grid
      await loadTravelerBookings();
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Revocation failure: unable to cancel reservation.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowDoubleClick = (stay: StayListItem) => {
    setModalTargetStay(stay);
    setIsModalOpen(true);
  };

  if (userType !== "GUEST") {
    return (
      <div className="p-8 text-center text-emerald-500 text-xs font-bold bg-emerald-500/5 border border-emerald-500/20 rounded-xl max-w-md mx-auto my-12">
        Access Denied: Invalid Guest Explorer Token Account.
      </div>
    );
  }
  return (
    <div className="flex-1 w-full flex flex-col gap-6 overflow-hidden text-[#efeff1]">
      {/* 🧭 MULTI-ATTRIBUTE TRAVEL SEARCH INGESTION CONSOLE ROW */}
      <section className="w-full rounded-2xl border border-zinc-800 bg-[#18181b]/60 p-4 shadow-lg shrink-0">
        <form
          onSubmit={executeTravelSearch}
          className="flex flex-col md:flex-row items-end md:items-center gap-4 text-xs"
        >
          <div className="w-full md:flex-1 space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="h-3 w-3 text-emerald-400" /> Travelers Capacity
            </label>
            <input
              type="number"
              min="1"
              required
              value={guestNumber}
              onChange={(e) => setGuestNumber(e.target.value)}
              className="h-9 w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 text-zinc-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="w-full md:flex-1 space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3 text-emerald-400" /> Check-In
              Timeline
            </label>
            <input
              type="date"
              required
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
              className="h-9 w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 text-zinc-100 font-medium focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
            />
          </div>

          <div className="w-full md:flex-1 space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3 text-emerald-400" /> Check-Out
              Timeline
            </label>
            <input
              type="date"
              required
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              className="h-9 w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 text-zinc-100 font-medium focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto h-9 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            <span>Query Assets</span>
          </button>
        </form>

        {/* Dynamic Action Signal Feedback Banners */}
        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-semibold animate-in fade-in slide-in-from-top-1 duration-150">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />{" "}
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold animate-in fade-in slide-in-from-top-1 duration-150">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />{" "}
            <span>{successMessage}</span>
          </div>
        )}
      </section>

      {/* 🚀 UPPER CELL: RESPONSIVE CARDS NET EXPLORER CATALOG SYSTEM */}
      <section className="flex-1 min-h-0 overflow-y-auto pr-1 border-b border-zinc-900 pb-4 max-h-[360px]">
        {stays.length === 0 ? (
          <div className="h-40 border border-dashed border-zinc-800 bg-[#18181b]/20 rounded-2xl flex flex-col items-center justify-center text-center text-zinc-600 text-[10px] uppercase font-black tracking-widest gap-1.5 select-none">
            <Building2 className="h-6 w-6 text-zinc-800" />
            <span>
              Ledger Matrix Idle // Query Parameters Pending Ingestion
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {stays.map((stay) => (
              <div
                key={stay.id}
                onDoubleClick={() => handleRowDoubleClick(stay)}
                className="group border border-zinc-900 bg-[#18181b]/40 rounded-2xl overflow-hidden hover:border-zinc-800/80 transition-all flex flex-col shadow-md hover:shadow-xl relative"
              >
                <div className="aspect-video w-full bg-zinc-950 border-b border-zinc-900/60 overflow-hidden relative shadow-inner">
                  {stay.images && stay.images.length > 0 ? (
                    <img
                      src={stay.images[0]}
                      alt={stay.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 text-[9px] font-black uppercase tracking-widest gap-1 bg-zinc-900">
                      <Building2 className="h-5 w-5 text-zinc-800" /> No Media
                      Slices
                    </div>
                  )}
                  <span className="absolute top-3 right-3 font-mono text-[9px] font-black uppercase bg-black/80 border border-zinc-800 px-2 py-0.5 rounded-md text-emerald-400">
                    Limit: {stay.guestNumber}P
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <h3 className="font-bold text-zinc-200 uppercase tracking-tight truncate group-hover:text-white transition-colors">
                      {stay.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-medium font-mono flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 text-zinc-700 shrink-0" />{" "}
                      {stay.address}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 shrink-0">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                      REF ID: #{stay.id}
                    </span>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleBookStay(stay.id)}
                      className="h-7 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <BookmarkCheck className="h-3 w-3" />
                      <span>Book Room</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* 🚀 LOWER CELL: HISTORICAL TRAVEL RESERVATIONS LEDGER LOG KANBAN */}
      <section className="h-[220px] rounded-2xl border border-zinc-800 bg-[#18181b]/60 p-4 flex flex-col min-h-0 shadow-xl shrink-0">
        <div className="pb-2 border-b border-zinc-900 mb-2 shrink-0 flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-emerald-400" /> My Historical
            Travel Logistics Logs
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {myBookings.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-[10px] py-6 uppercase font-bold tracking-widest">
              No historical travel itineraries logged under current identity
              token.
            </div>
          ) : (
            myBookings.map((res) => (
              <div
                key={res.id}
                className="border border-zinc-900 bg-zinc-950/40 p-3 rounded-xl flex items-center justify-between gap-4 text-[10px]"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-zinc-400 font-bold max-w-[120px] truncate">
                      STAY ID: [{res.id}]
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-zinc-400">
                    <Calendar className="h-3 w-3 text-zinc-600" />
                    <span>
                      {res.checkInDate} ➔ {res.checkOutDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[9px] text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                    ORDER: #{res.id}
                  </span>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleCancelReservation(res.id)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/20 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 🚀 CROSS-WORKFLOW OVERLAY REUSABILITY CONTAINER */}
      <StayDetailModal
        stay={modalTargetStay}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
