/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
// 🚀 Ingest official cloud production handshakes from our central network layer
import {
  uploadStay,
  getStaysByHost,
  getReservationsByStay,
  deleteStay,
  StayListItem,
  ReservationItem,
} from "@/services/api";
import StayDetailModal from "@/components/StayDetailModal";
import {
  Building2,
  PlusCircle,
  CalendarDays,
  Image as ImageIcon,
  X,
  Trash2,
  Users,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function HostDashboard() {
  const { userType } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Central Production Data Storage Matrices (100% Mock-Free)
  const [myStays, setMyStays] = useState<StayListItem[]>([]);
  const [currentStayId, setCurrentStayId] = useState<number | null>(null);
  const [stayBookings, setStayBookings] = useState<ReservationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<
    { id: string; url: string; file: File }[]
  >([]);

  // Base Signal Feedback Traps
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Modal Control Managed Targets
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTargetStay, setModalTargetStay] = useState<StayListItem | null>(
    null,
  );

  // 🧭 LIFECYCLE NODE 1: Fetch all remote properties bound to current host account
  const loadHostStays = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await getStaysByHost();
      setMyStays(data);
      if (data.length > 0 && currentStayId === null) {
        // Automatically focus on index 0 to boot up the telemetry metrics safely
        setCurrentStayId(data[0].id);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to establish synchronization with cloud storage.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger the live cloud data telemetry immediately when the panel mounts
  useEffect(() => {
    loadHostStays();
  }, []);

  // 🧭 LIFECYCLE NODE 2: Reactive Watcher - Refresh reservation lists on selection switch
  useEffect(() => {
    if (currentStayId !== null) {
      getReservationsByStay(currentStayId)
        .then((data) => setStayBookings(data))
        .catch((e: unknown) =>
          console.error("Schedule telemetry data pipeline broken:", e),
        );
    } else {
      setStayBookings([]);
    }
  }, [currentStayId]);

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file: file,
      }));
      setPreviewImages((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemovePreview = (id: string) => {
    setPreviewImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleRowDoubleClick = (stay: StayListItem) => {
    setModalTargetStay(stay);
    setIsModalOpen(true);
  };
  // 🧭 LIVE TRANSMISSION INTERCEPTOR: Pack fields and binary blobs into multipart streams
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // 🚀 LIFECYCLE LOCK HOTFIX: Lock the form DOM reference synchronously before any await pause
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const description = formData.get("description") as string;
    const guestNumber = Number(formData.get("guest_number"));

    // Validation Guard Checks
    if (
      !name.trim() ||
      !address.trim() ||
      !guestNumber ||
      previewImages.length === 0
    ) {
      setErrorMessage(
        "Missing parameters. Multi-image array slices and names are mandatory.",
      );
      return;
    }

    setIsLoading(true);
    try {
      // Execute live multipart cloud ingestion payload package matching api.ts contract
      await uploadStay({
        name,
        address,
        description: description || "",
        guest_number: guestNumber,
        images: previewImages.map((img) => img.file),
      });

      setSuccessMessage(
        `Success! Asset [${name}] has been successfully initialized.`,
      );
      previewImages.forEach((img) => URL.revokeObjectURL(img.url)); // garbage collection
      setPreviewImages([]);

      // 🚀 HOTFIXED: Safely reset the form container using our persistent locked reference
      formElement.reset();

      // Force pipeline reload to refresh active shelves instantly without errors
      await loadHostStays();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Handshake dropped: asset creation failure.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 🧭 ASSET ENTITY DESTRUCTION ACTION: Purge live records with event bubbling protection
  const handleDeleteStay = async (stayId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // CRITICAL ISOLATION: stop bubble event from shifting stay card row focus
    if (
      !confirm(
        "CRITICAL WARNING: Completely purge and delete this stay record from cloud containers?",
      )
    )
      return;

    setIsLoading(true);
    try {
      await deleteStay(stayId);
      if (currentStayId === stayId) {
        setCurrentStayId(null);
      }
      await loadHostStays();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Purge fault encountered.";
      alert(`Operation failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (userType !== "HOST") {
    return (
      <div className="p-8 text-center text-rose-500 text-xs font-bold bg-rose-500/5 border border-rose-500/20 rounded-xl max-w-md mx-auto my-12">
        Access Denied: Invalid Host Account Token.
      </div>
    );
  }
  return (
    <div className="flex-1 w-full flex flex-col lg:grid lg:grid-cols-12 gap-6 overflow-hidden text-[#efeff1]">
      {/* LEFT ASPECT PANEL: PROPERTIES DATA SEED FORM ENTRY */}
      <section className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#18181b]/60 p-5 flex flex-col min-h-0">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-900 mb-4 shrink-0">
          <PlusCircle className="h-4 w-4 text-purple-400" />
          <h2 className="text-xs font-black uppercase tracking-widest">
            Publish Property
          </h2>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="flex-1 flex flex-col justify-between space-y-4 min-h-0 overflow-y-auto pr-1"
        >
          <input
            name="name"
            type="text"
            required
            placeholder="Property Name"
            className="h-9 w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 text-xs focus:outline-none focus:border-purple-500 font-medium"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="guest_number"
              type="number"
              required
              min="1"
              placeholder="Max Capacity"
              className="h-9 w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 text-xs focus:outline-none focus:border-purple-500 font-mono font-bold"
            />
            <input
              name="address"
              type="text"
              required
              placeholder="Physical Address"
              className="h-9 w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 text-xs focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>
          <textarea
            name="description"
            rows={2}
            placeholder="Property specifications guidelines..."
            className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-500 resize-none text-zinc-300 leading-relaxed"
          />

          <div className="grid grid-cols-4 gap-2 bg-zinc-950 p-2 border border-zinc-900 rounded-xl min-h-[76px]">
            {previewImages.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800"
              >
                <img
                  src={img.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePreview(img.id)}
                  className="absolute top-1 right-1 p-0.5 bg-black/80 hover:bg-rose-600 rounded text-white cursor-pointer"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            <label className="border border-dashed border-zinc-800 hover:border-purple-500/50 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer bg-zinc-900/40 hover:bg-purple-500/5">
              <ImageIcon className="h-3.5 w-3.5 text-zinc-600" />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleSelectImages}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2 shrink-0 pt-2 border-t border-zinc-900">
            {errorMessage && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />{" "}
                <span>Fault Ingestion: {errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />{" "}
                <span>Sync Signal: {successMessage}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-200" />
              ) : (
                <span>Publish To Production</span>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* RIGHT ASPECT PANEL: LIVE INVENTORY CELLS AND INTERACTIVE TIME GRID */}
      <section className="lg:col-span-7 flex flex-col min-h-0 gap-4">
        <div className="flex-1 rounded-2xl border border-zinc-800 bg-[#18181b]/60 p-4 flex flex-col min-h-0 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900 mb-2 shrink-0">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Active Inventory Ledger
            </h2>
            {isLoading && (
              <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[160px] pr-1">
            {myStays.length === 0 ? (
              <div className="text-center text-zinc-600 text-[10px] py-4 uppercase font-bold tracking-wide">
                Empty Ingestion Shelf
              </div>
            ) : (
              myStays.map((stay) => (
                <div
                  key={stay.id}
                  onClick={() => setCurrentStayId(stay.id)}
                  onDoubleClick={() => handleRowDoubleClick(stay)} // 🚀 Wires native dual-gesture double-click trigger
                  className={`group border p-2.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${
                    currentStayId === stay.id
                      ? "bg-purple-500/10 border-purple-400/40"
                      : "bg-zinc-950/40 border-zinc-900 hover:bg-zinc-950/80"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    {/* 🚀 Dynamic 1st frame imagery binding safely reading index 0 from real array JSON */}
                    {stay.images && stay.images.length > 0 ? (
                      <img
                        src={stay.images[0]}
                        alt="Cover"
                        className="h-10 w-10 object-cover rounded-lg border border-zinc-800 shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 shrink-0">
                        <Building2 className="h-4 w-4" />
                      </div>
                    )}
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-zinc-200 truncate">
                        {stay.name}
                      </h4>
                      <p className="text-[9px] text-zinc-500 truncate mt-0.5">
                        {stay.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* 🚀 Perfectly locked to backend camelCase contract parameter */}
                    <span className="text-[9px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-400">
                      Limit: {stay.guestNumber}P
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteStay(stay.id, e)}
                      disabled={isLoading}
                      className="p-1 rounded bg-zinc-900 text-zinc-500 hover:text-rose-400 border border-zinc-800 cursor-pointer flex items-center justify-center"
                    >
                      {isLoading && currentStayId === stay.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* LOWER CARD: Selected Property Dynamic Timelines Schedule Grid */}
        <div className="flex-1 rounded-2xl border border-zinc-800 bg-[#18181b]/60 p-4 flex flex-col min-h-0 shadow-lg">
          <div className="pb-2 border-b border-zinc-900 mb-2 shrink-0">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Target Node Reservation Schedule
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[160px] pr-1">
            {stayBookings.length === 0 ? (
              <div className="text-center text-zinc-600 text-[10px] py-4 uppercase font-bold tracking-wide">
                No Active Leases Logged
              </div>
            ) : (
              stayBookings.map((res) => (
                <div
                  key={res.id}
                  className="border border-zinc-900 bg-zinc-950/40 p-2 rounded-xl flex items-center justify-between gap-3 text-[10px]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-zinc-500 font-bold">
                        NODE: [{res.id}]
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-zinc-400 mt-0.5">
                      <Clock className="h-3 w-3 text-zinc-600" />
                      <span>
                        {res.checkInDate} ➔ {res.checkOutDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-[9px] text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    REF: {res.id}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 🚀 DECOUPLED DYNAMIC DETAIL OVERLAY MODAL HUB CONTAINER */}
      <StayDetailModal
        stay={modalTargetStay}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
