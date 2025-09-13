import galleryDb from "./galleriesdb.json";
import ImageRendering from "./ImageRendering";
import SelectBox from "./SelectBox";
import { getSliderImages } from "@/app/Utility/lib/file";
export default function page(req: any) {
  let selectDb = galleryDb[0];
  let selectedValue = req.searchParams?.selectedValue;
  if (req.searchParams?.selectedValue) {
    selectDb = galleryDb.filter((item) => item.value == selectedValue)[0];
    selectDb = selectDb || galleryDb[0];
  }
  let allImagePath: any = [];
  let message = "no message";
  try {
    allImagePath = getSliderImages(selectDb?.folderPath);
  } catch (e: any) {
    allImagePath = [];
    message = e?.message || "something went wrong";
  }

  return (
    <div>
      <SelectBox allImagePath={galleryDb} selectedValue={selectDb} />
      <ImageRendering
        path={selectDb?.folderPath}
        allImage={allImagePath}
        message={message}
      />
    </div>
  );
}
