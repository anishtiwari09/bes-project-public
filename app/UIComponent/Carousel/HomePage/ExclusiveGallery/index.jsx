import { getSliderImages } from "@/app/Utility/lib/file";
import SliderComponent from "./SliderComponent";

export default function ExclusiveGallery() {
  let allImagePath = [];
  let selectDb = { folderPath: "/Images/homepage_exclusive_images" };
  try {
    process.env.enviroment === "production" ? "/vercel/path0" : process.cwd();

    allImagePath = getSliderImages(selectDb?.folderPath);
  } catch (e) {
    allImagePath = [];
    console.log(e);
  }
  console.log(allImagePath);
  if (!allImagePath.length) return null;
  return (
    <div className="bg-[#f2f2f2] px-2">
      {" "}
      <h1 className="text-center text-[24px] font-bold py-8">
        Exclusive Gallery
      </h1>
      <SliderComponent allImagePath={allImagePath} path={selectDb.folderPath} />
    </div>
  );
}
