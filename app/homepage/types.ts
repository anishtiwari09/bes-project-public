import type { HomeNotificationCmsConfig } from "@/app/UIComponent/Carousel/HomePage/Notification";

export type AnnouncementItem = {
  text: string;
  href?: string;
  target?: string;
};

export type HomePageContent = {
  announcementsEnabled: boolean;
  announcementItems: AnnouncementItem[];
  notificationConfig: HomeNotificationCmsConfig | null;
};

