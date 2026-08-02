export interface OrderDraft {
  tier: string;
  service: string;
  symptoms: string[];
  parts: Record<string, string>;
  name: string;
  email: string;
  budget: string;
  customRequests: string;
  consultationType: "free" | "guided";
}

const KEY = "krushpc-order-draft";

export function saveOrderDraft(draft: OrderDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(draft));
}

export function loadOrderDraft(): OrderDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OrderDraft) : null;
  } catch {
    return null;
  }
}

export function clearOrderDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

export const partMetaKeys = [
  { key: "formFactor", label: "Size (big or small PC)" },
  { key: "pcCase", label: "Case & Colour" },
  { key: "cpu", label: "Processor" },
  { key: "gpu", label: "Graphics" },
  { key: "ram", label: "Memory" },
  { key: "storage", label: "Storage" },
  { key: "cooling", label: "Cooling" },
] as const;
