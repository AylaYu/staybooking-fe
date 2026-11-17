/**
 * StaysBooking 2026 Enterprise Full-Stack API Telemetry Core
 * 🚀 100% Strict Type-Safe Compliance | Zero Raw 'any' Overrides | SSR/RSC Safe
 * File Location: src/services/api.ts
 */

// 🚀 ANCHORED PRODUCTION DOMAIN ORIGIN
const DOMAIN = "https://staybooking-23249548358.us-west1.run.app";

// ============================================================================
// 1. DOMAIN CORE TYPE CONTRACTS (数据契约模型定义)
// ============================================================================
export interface AuthCredential {
  username?: string;
  password?: string;
  role?: "ROLE_HOST" | "ROLE_GUEST"; // Calibrated with standard Spring Security authority tokens mapping rules
}

export interface AuthResponse {
  token: string;
}

export interface HostEntity {
  id: number;
  username: string;
  role: "ROLE_HOST" | "ROLE_GUEST";
}

export interface GuestEntity {
  id: number;
  username: string;
  role: "ROLE_HOST" | "ROLE_GUEST";
}

export interface StayListItem {
  id: number;
  name: string;
  description: string;
  address: string;
  guestNumber: number; // 🚀 物理对齐后端真实驼峰命名
  images: string[]; // 🚀 物理对齐后端真实的多图字符串数组
  location?: {
    lat: number;
    lon: number;
  };
  host?: HostEntity; // 🚀 完美追溯并补齐后端真实的房东所属关联关系
}

export interface SearchStaysQuery {
  guest_number: string;
  checkin_date: Date | string;
  checkout_date: Date | string;
}

export interface UploadStayPayload {
  name: string;
  description: string;
  address: string;
  guest_number: number;
  images: File[];
}

export interface BookingPayload {
  listingId: number;
  checkInDate: string;
  checkOutDate: string;
}

export interface ReservationItem {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  guest: GuestEntity;
  listing: StayListItem;
}

// ============================================================================
// 2. TIMELINE UTILITIES & STORAGE INTERPRETERS
// ============================================================================
function getLocalAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("authToken") || "";
}

function formatNativeDate(date: Date | string): string {
  if (typeof date === "string") return date;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ============================================================================
// 3. CORE SERVICE EXECUTION ENGINE API NODES
// ============================================================================
export async function login(credential: AuthCredential): Promise<AuthResponse> {
  const response = await fetch(`${DOMAIN}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });

  if (!response.ok) {
    throw new Error(
      `Authentication Denied: Failed to log in with active status code ${response.status}`,
    );
  }

  const data: unknown = await response.json();
  return data as AuthResponse;
}

export async function register(credential: AuthCredential): Promise<void> {
  const response = await fetch(`${DOMAIN}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });

  if (!response.ok) {
    throw new Error(
      `Account Provision Exception: Failed to register with status code ${response.status}`,
    );
  }
}

export async function getReservations(): Promise<ReservationItem[]> {
  const authToken = getLocalAuthToken();
  const response = await fetch(`${DOMAIN}/bookings`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Telemetry Error: Failed to fetch user reservation lists on status ${response.status}`,
    );
  }

  const data: unknown = await response.json();
  return data as ReservationItem[];
}

export async function getStaysByHost(): Promise<StayListItem[]> {
  const authToken = getLocalAuthToken();
  const response = await fetch(`${DOMAIN}/listings`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Telemetry Error: Failed to gather stays inventory data vectors on status ${response.status}`,
    );
  }

  const data: unknown = await response.json();
  return data as StayListItem[];
}

export async function searchStays(
  query: SearchStaysQuery,
): Promise<StayListItem[]> {
  const authToken = getLocalAuthToken();
  const searchStaysUrl = new URL(`${DOMAIN}/listings/search`);
  searchStaysUrl.searchParams.append("guest_number", query.guest_number);
  searchStaysUrl.searchParams.append(
    "checkin_date",
    formatNativeDate(query.checkin_date),
  );
  searchStaysUrl.searchParams.append(
    "checkout_date",
    formatNativeDate(query.checkout_date),
  );
  searchStaysUrl.searchParams.append("lat", "37");
  searchStaysUrl.searchParams.append("lon", "-122");
  searchStaysUrl.searchParams.append("distance", "500000");

  const response = await fetch(searchStaysUrl.toString(), {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Search Pipeline Exception: Failed to execute search algorithms on status ${response.status}`,
    );
  }

  const data: unknown = await response.json();
  return data as StayListItem[];
}

export async function deleteStay(stayId: number | string): Promise<void> {
  const authToken = getLocalAuthToken();
  const response = await fetch(`${DOMAIN}/listings/${stayId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Database Constraint Violation: Failed to drop stay entity ${stayId}`,
    );
  }
}

export async function bookStay(data: BookingPayload): Promise<void> {
  const authToken = getLocalAuthToken();
  const response = await fetch(`${DOMAIN}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Transaction Execution Fault: Failed to commit active reservation contract parameters.`,
    );
  }
}

export async function cancelReservation(
  reservationId: number | string,
): Promise<void> {
  const authToken = getLocalAuthToken();
  const response = await fetch(`${DOMAIN}/bookings/${reservationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Transaction Revocation Exception: Failed to break active reservation node ${reservationId}`,
    );
  }
}

export async function getReservationsByStay(
  stayId: number | string,
): Promise<ReservationItem[]> {
  const authToken = getLocalAuthToken();
  const response = await fetch(`${DOMAIN}/listings/${stayId}/bookings`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) {
    throw new Error(
      `Telemetry Disruption: Failed to query historical bindings attached to property ${stayId}`,
    );
  }

  const data: unknown = await response.json();
  return data as ReservationItem[];
}

export async function uploadStay(payload: UploadStayPayload): Promise<void> {
  const authToken = getLocalAuthToken();
  const multipartFormData = new FormData();
  multipartFormData.append("name", payload.name);
  multipartFormData.append("description", payload.description);
  multipartFormData.append("address", payload.address);
  multipartFormData.append("guest_number", String(payload.guest_number));

  payload.images.forEach((imageFile) => {
    multipartFormData.append("images", imageFile);
  });

  const response = await fetch(`${DOMAIN}/listings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: multipartFormData,
  });

  if (!response.ok) {
    throw new Error(
      `Storage Hydration Exception: Server rejected host listing publication package on status ${response.status}`,
    );
  }
}
