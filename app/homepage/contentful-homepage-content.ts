import {
  getEntryByIdForRequest,
  isContentfulConfigured,
} from "@/app/backend/lib/contentful";
import type { ResourceButton } from "@/app/UIComponent/Carousel/HomePage/Notification";
import type { AnnouncementItem, HomePageContent } from "./types";

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function mapAnnouncementItems(raw: unknown): AnnouncementItem[] {
  if (Array.isArray(raw) === false) return [];

  return raw
    .filter((item: any) => getString(item?.text).length > 0)
    .map((item: any) => ({
      text: getString(item?.text),
      href: getString(item?.href),
      target: getString(item?.target) || "_blank",
    }));
}

function mapResourceButtons(raw: unknown): ResourceButton[] {
  if (Array.isArray(raw) === false) return [];

  const isExternalUrl = (value: string) => /^https?:\/\//i.test(value || "");

  return raw
    .filter((item: any) => getString(item?.label).length > 0)
    .map((item: any) => {
      const rawTarget = getString(item?.target);
      const target: "_blank" | "_self" = rawTarget === "_self" ? "_self" : "_blank";
      const url = getString(item?.url);
      return {
        label: getString(item?.label),
        url,
        target,
      };
    })
    .filter((item) => item.url.length > 0 && isExternalUrl(item.url));
}

export async function getContentfulHomepageContent(): Promise<HomePageContent | null> {
  const entryId = process.env.CONTENTFUL_HOMEPAGE_ENTRY_ID || "";
  if (entryId.length === 0 || isContentfulConfigured() === false) return null;

  const entry = await getEntryByIdForRequest(entryId);
  if (!entry) return null;

  const fields = (entry as any)?.fields || {};
  const homepageBanner = fields?.homepageBanner || {};

  return {
    announcementItems: mapAnnouncementItems(fields?.announcementItems),
    announcementsEnabled: getBoolean(fields?.announcementsEnabled),
    notificationConfig: {
      title: getString(homepageBanner?.title),
      subtitle: getString(homepageBanner?.subtitle),
      venue: getString(homepageBanner?.venue),
      theme: getString(homepageBanner?.theme),
      primaryButtonText: getString(homepageBanner?.primaryButtonText),
      primaryButtonLink: getString(homepageBanner?.primaryButtonLink),
      countdownStartDateTime: getString(homepageBanner?.countdownStartDateTime),
      visitorButtonText: getString(homepageBanner?.visitorButtonText),
      visitorButtonLink: getString(homepageBanner?.visitorButtonLink),
      delegateButtonText: getString(homepageBanner?.delegateButtonText),
      delegateButtonLink: getString(homepageBanner?.delegateButtonLink),
      resourceButtons: mapResourceButtons(homepageBanner?.resourceButtons),
    },
  };
}

