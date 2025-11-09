import CreateNewPassword from "./component/create_password";
import { checkAndUpdateToken } from "@/app/backend/action/action";
import { redirect } from "next/navigation";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";
export default async function page(req: any) {
  let { slug } = req.params;
  slug = slug || [];
  const [slug1, slug2] = slug;

  const jwtService = new JwtTokenService();
  let isValid = await jwtService.verifyToken(slug2);
  console.log({ isValid, slug2 });
  if (isValid) {
    isValid = await checkAndUpdateToken({ token: slug1 });
    console.log({ isValid, slug1 });
  }

  redirect(
    isValid
      ? `/account_setup/${slug1}/${slug2}/create_password`
      : "/?action=login"
  );
}
