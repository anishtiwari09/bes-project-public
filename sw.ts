import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "serwist";
import { Serwist } from "serwist";

const serwist = new Serwist({
  precacheEntries: (self as unknown as { __SW_MANIFEST: PrecacheEntry[] })
    .__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline.html",
        matcher: ({ request }) => request.mode === "navigate",
      },
    ],
  },
});

serwist.addEventListeners();

/* eslint-disable */
const sw = self as any;

sw.addEventListener("activate", (event: any) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open("pages");
      const clients = await sw.clients.matchAll({ type: "window" });
      await Promise.all(
        clients.map(async (client: any) => {
          const url = new URL(client.url);
          if (url.origin === location.origin) {
            const cached = await cache.match(url.pathname, {
              ignoreSearch: true,
            });
            if (!cached) {
              try {
                const response = await fetch(url.pathname);
                if (response.ok) cache.put(url.pathname, response);
              } catch {
                /* empty */
              }
            }
          }
        }),
      );
    })(),
  );
});
/* eslint-enable */
