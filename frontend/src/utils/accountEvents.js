export const ACCOUNT_COUNTS_EVENT = "shopease:account-counts-changed";

export function refreshAccountCounts() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ACCOUNT_COUNTS_EVENT));
  }
}
