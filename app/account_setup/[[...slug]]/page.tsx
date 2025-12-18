import CreateNewPassword from "./component/create_password";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import ErrorAlertToast from "@/app/UIComponent/common-ui/error-alert/error-alert-toast";
export const dynamic = "force-dynamic";
export default async function page(req: any) {
  let { slug } = req.params;
  slug = slug || [];
  const [slug1, slug2] = slug;

  const authService = new UserAuthService();

  try {
    let isValid = await authService.validateForgotPasswordToken(slug1, slug2);
    if (!isValid)
      return <ErrorAlertToast msg={"Invalid Token"} redirectTo={"/"} />;
    return <CreateNewPassword slug1={slug1} slug2={slug2} />;
  } catch (e) {
    return <ErrorAlertToast msg={e?.newMessage} redirectTo={"/"} />;
  }
}
