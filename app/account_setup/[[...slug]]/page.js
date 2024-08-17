import { verifyJsonToken } from "@/app/helper/helper";
import CreateNewPassword from "./component/create_password";
import { checkWheatherUserExist } from "@/app/backend/action/action";
import { redirect } from "next/navigation";
export default async function page(req) {
  let { slug } = req.params;
  slug = slug || [];
  const [slug1, slug2] = slug;
  let isValid = verifyJsonToken(slug2);
  if (isValid) {
    isValid = await checkWheatherUserExist({ token: slug });
  }
  if (!isValid) {
    return redirect("/error_page/invalid_token");
  }
  return <CreateNewPassword slug1={slug1} slug2={slug2} />;
}
