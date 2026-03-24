/** Lightweight analytics tracker — fires events to console in dev, ready for a real provider. */

type EventName =
  | "try_now_click"
  | "download_click"
  | "decide_for_me"
  | "pick_for_me"
  | "try_another"
  | "save_meal"
  | "order_nearby"
  | "get_ingredients"
  | "share_meal"
  | "page_view";

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

const IS_DEV = import.meta.env.DEV;

export function trackEvent(name: EventName, data?: EventData) {
  if (IS_DEV) {
    console.log(`[analytics] ${name}`, data ?? "");
  }

  // Future: send to your analytics provider
  // e.g. posthog.capture(name, data);
  // e.g. gtag('event', name, data);
}

export function trackPageView(path: string) {
  trackEvent("page_view", { path });
}
