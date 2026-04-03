import EventDetails from "./UIComponent/Carousel/HomePage/EventDetails";
import HomePageCarousel from "./UIComponent/Carousel/HomePage/HomePageCarousel";
import Notification from "./UIComponent/Carousel/HomePage/Notification";
import Partener from "./UIComponent/Carousel/HomePage/Partener";
import { HOMEPAGE, NOTIFICATION_TEXT } from "./Utility/Constant";
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

type TickerItem = {
  text: string;
  href?: string;
  target?: string;
};

type HomeCmsData = {
  notificationText: TickerItem[];
  notificationIsShow: boolean;
  testBannerText: string;
} | null;

async function getHomeCmsData(): Promise<HomeCmsData> {
  const entryId = process.env.CONTENTFUL_HOMEPAGE_ENTRY_ID || "";

  if (!entryId || !isContentfulConfigured()) return null;

  const entry = await getEntryByIdForRequest(entryId);
  if (!entry) return null;

  const fields = (entry as any)?.fields || {};
  const ticker =
    fields?.notificationText ??
    fields?.notification_text ??
    fields?.tickerItems ??
    fields?.ticker_items ??
    [];

  const notificationText = Array.isArray(ticker)
    ? ticker
        .filter((item: any) => item && typeof item?.text === "string")
        .map((item: any) => ({
          text: item?.text,
          href: item?.href || "",
          target: item?.target || "_blank",
        }))
    : [];

  return {
    notificationText,
    notificationIsShow:
      typeof fields?.notificationIsShow === "boolean"
        ? fields.notificationIsShow
        : typeof fields?.notification_is_show === "boolean"
          ? fields.notification_is_show
          : NOTIFICATION_TEXT.isShow,
    testBannerText:
      fields?.testBannerText ||
      fields?.test_banner_text ||
      fields?.homeBannerText ||
      "",
  };
}

export default async function Home() {
  let data =
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
        {(homeCmsData?.notificationIsShow ?? NOTIFICATION_TEXT.isShow) && (
          <NotificationText
            contents={
              homeCmsData?.notificationText?.length
                ? homeCmsData.notificationText
                : NOTIFICATION_TEXT.contents
            }
          />
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
