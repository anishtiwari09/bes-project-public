import type { AnalyticsEventParams } from "./types";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: AnalyticsEventParams,
    ) => void;
  }
}

/**
 * Sends an event to Google Analytics.
 * Safe to call anywhere in Client Components.
 */
export function trackEvent(eventName: string, params?: AnalyticsEventParams) {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.gtag) {
    return;
  }

  window.gtag("event", eventName, params);
}
