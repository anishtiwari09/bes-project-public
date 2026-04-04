import EventDetails from "./UIComponent/Carousel/HomePage/EventDetails";
import HomePageCarousel from "./UIComponent/Carousel/HomePage/HomePageCarousel";
import Notification from "./UIComponent/Carousel/HomePage/Notification";
import Partener from "./UIComponent/Carousel/HomePage/Partener";
import { HOMEPAGE } from "./Utility/Constant";
import { getSliderImages } from "./Utility/lib/file";
import NotificationText from "./UIComponent/Carousel/HomePage/NotificationText";
import ExclusiveGallery from "./UIComponent/Carousel/HomePage/ExclusiveGallery";
import MarginTopSpace from "./UIComponent/Carousel/HomePage/MarginTopSpace";
import AllRegistrationTypeServices from "./backend/lib/services/all-registration-type-service";
import { RegistrationServiceType } from "./backend/lib/db/models/all_registration_services.model";
import { getHomepageContent } from "./homepage/get-homepage-content";

export default async function Home() {
  const data =
    getSliderImages(HOMEPAGE.sliderImageDir + HOMEPAGE.currentYear) || [];
  const homepageContent = await getHomepageContent();

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
              cmsConfig={homepageContent.notificationConfig}
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

        {!!homepageContent.announcementsEnabled &&
          !!homepageContent.announcementItems.length && (
            <NotificationText
              contents={homepageContent.announcementItems}
              notificationText={
                homepageContent.notificationConfig?.notificationText
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
