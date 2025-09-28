import EventDetails from "./UIComponent/Carousel/HomePage/EventDetails";
import HomePageCarousel from "./UIComponent/Carousel/HomePage/HomePageCarousel";
import Notification from "./UIComponent/Carousel/HomePage/Notification";
import Partener from "./UIComponent/Carousel/HomePage/Partener";
import { HOMEPAGE, NOTIFICATION_TEXT } from "./Utility/Constant";
import { getSliderImages } from "./Utility/lib/file";
import NotificationText from "./UIComponent/Carousel/HomePage/NotificationText";
import ExclusiveGallery from "./UIComponent/Carousel/HomePage/ExclusiveGallery";
import MarginTopSpace from "./UIComponent/Carousel/HomePage/MarginTopSpace";
import DownloadBrochureButton from "./UIComponent/buttons/download-brochure";
export default async function Home() {
  let data =
    getSliderImages(HOMEPAGE.sliderImageDir + HOMEPAGE.currentYear) || [];
  return (
    <div className="relative">
      <DownloadBrochureButton />
      <div className="relative">
        <div className="flex gap-2 flex-wrap py-[10px] px-[10px] pb-8 bg-[#eae99b69]">
          <div className="max-w-[500px] mobile_notification_css">
            <Notification />
          </div>
          <div className="relative flex-1 min-w-[350px]">
            <HomePageCarousel
              data={data}
              url={HOMEPAGE.sliderImageDir + HOMEPAGE.currentYear}
              path1={""}
            />
          </div>
        </div>
        {NOTIFICATION_TEXT.isShow && (
          <NotificationText contents={NOTIFICATION_TEXT.contents} />
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
