import EventDetails from "./UIComponent/Carousel/HomePage/EventDetails";
import HomePageCarousel from "./UIComponent/Carousel/HomePage/HomePageCarousel";
import Notification from "./UIComponent/Carousel/HomePage/Notification";
import type {
  HomeNotificationCmsConfig,
  ResourceButton,
} from "./UIComponent/Carousel/HomePage/Notification";
import Partener from "./UIComponent/Carousel/HomePage/Partener";
import { HOMEPAGE } from "./Utility/Constant";
import { getSliderImages } from "./Utility/lib/file";
import NotificationText from "./UIComponent/Carousel/HomePage/NotificationText";
import ExclusiveGallery from "./UIComponent/Carousel/HomePage/ExclusiveGallery";
import MarginTopSpace from "./UIComponent/Carousel/HomePage/MarginTopSpace";
import AllRegistrationTypeServices from "./backend/lib/services/all-registration-type-service";
import { RegistrationServiceType } from "./backend/lib/db/models/all_registration_services.model";
import {
  getEntryByIdForRequest,
  isContentfulConfigured,
} from "./backend/lib/contentful";

type AnnouncementItem = {
  text: string;
  href?: string;
  target?: string;
};

type HomeCmsData = {
  announcementItems: AnnouncementItem[];
  announcementsEnabled: boolean;
  notificationConfig: HomeNotificationCmsConfig | null;
} | null;

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
      const target: "_blank" | "_self" =
        rawTarget === "_self" ? "_self" : "_blank";
      const url = getString(item?.url);
      return {
        label: getString(item?.label),
        url,
        target,
      };
    })
    .filter((item) => item.url.length > 0 && isExternalUrl(item.url));
}

async function getHomeCmsData(): Promise<HomeCmsData> {
  const entryId = process.env.CONTENTFUL_HOMEPAGE_ENTRY_ID || "";
  if (entryId.length === 0 || isContentfulConfigured() === false) return null;

  const entry = await getEntryByIdForRequest(entryId);
  if (entry) {
    const fields = (entry as any)?.fields || {};
    const homepageBanner = fields?.homepageBanner || {};

    const notificationConfig: HomeNotificationCmsConfig = {
      title: getString(homepageBanner?.title),
      subtitle: getString(homepageBanner?.subtitle),
      venue: getString(homepageBanner?.venue),
      theme: getString(homepageBanner?.theme),
      primaryButtonText: getString(homepageBanner?.primaryButtonText),
      primaryButtonLink: getString(homepageBanner?.primaryButtonLink),
      countdownStartDateTime: getString(fields?.countdownStartDate),
      visitorButtonText: getString(homepageBanner?.visitorButtonText),
      visitorButtonLink: getString(homepageBanner?.visitorButtonLink),
      delegateButtonText: getString(homepageBanner?.delegateButtonText),
      delegateButtonLink: getString(homepageBanner?.delegateButtonLink),
      resourceButtons: mapResourceButtons(homepageBanner?.resourceButtons),
    };

    return {
      announcementItems: mapAnnouncementItems(fields?.announcementItems),
      announcementsEnabled: getBoolean(fields?.announcementsEnabled),
      notificationConfig,
    };
  }

  return null;
}

export default async function Home() {
  const data =
    getSliderImages(HOMEPAGE.sliderImageDir + HOMEPAGE.currentYear) || [];
  const homeCmsData = await getHomeCmsData();

  const registrationService = new AllRegistrationTypeServices();

  const currentRegistrationServiceStatus = {
    [RegistrationServiceType.VISITOR_REGISTRATIONS]: 0,
    [RegistrationServiceType.MY_SPACE]: 0,
    [RegistrationServiceType.DELEGATE_REGISTRATIONS]: 0,
  };
  const getAllRunningServices =
    await registrationService.getAllRunningServices();
  getAllRunningServices.forEach((service) => {
    currentRegistrationServiceStatus[service.service_name] = service.isActive
      ? 1
      : 0;
  });
  return (
    <div className="relative">
      <div className="relative">
        <div className="flex gap-2 flex-wrap py-[10px] px-[10px] pb-8 bg-[#eae99b69]">
          <div className="max-w-[500px] mobile_notification_css">
            <Notification
              currentRegistrationServiceStatus={
                currentRegistrationServiceStatus
              }
              cmsConfig={homeCmsData?.notificationConfig}
            />
          </div>
          <div className="relative flex-1 min-w-[350px]">
            <HomePageCarousel
              data={data}
              url={HOMEPAGE.sliderImageDir + HOMEPAGE.currentYear}
              path1={""}
            />
          </div>
        </div>

        {!!homeCmsData?.announcementsEnabled && (
          <NotificationText contents={homeCmsData.announcementItems} />
        )}
      </div>

      <MarginTopSpace />
      <div className="relative flex-1 min-w-[350px]">
        <ExclusiveGallery />
      </div>
      <Partener />
      <EventDetails />
    </div>
  );
}
