import fs from "fs";
import path from "path";
const imageCachedFiles = {};
export function getSliderImages(path2: string) {
  if (!imageCachedFiles[path2]) {
    const sliderImagesDir = path.join(process.cwd(), "public", path2);
    imageCachedFiles[path2] = fs.readdirSync(sliderImagesDir);
  }

  return imageCachedFiles[path2];
}
