import { LOGO_URL } from "@/app/backend/constant";

type EmailField = {
  [key: string]: string | number | null | undefined;
};

export function bookMySpaceTemplateVisitor(
  data: EmailField[],
  options?: { title?: string; logoUrl?: string }
): string {
  const title = options?.title || "Booking Confirmation";
  const logoUrl = options?.logoUrl || LOGO_URL;

  const rows = data
    .map((field) => {
      const key = Object.keys(field)[0];
      const rawValue = field[key];
      const value =
        rawValue === null || rawValue === undefined || rawValue === ""
          ? "Not Provided"
          : rawValue;
      return `<tr>
        <td style="padding: 8px 12px; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">${key}</td>
        <td style="padding: 8px 12px; color: #555; border-bottom: 1px solid #eee;">${value}</td>
      </tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${logoUrl}" alt="Logo" style="max-width: 180px;" />
    </div>
    <h2 style="color: #c75b12; text-align: center;">${title}</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      ${rows}
    </table>
    <p style="text-align: center; margin-top: 40px;">Thank you for your booking.</p>
    <div style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
      &copy; ${new Date().getFullYear()} Broadcast Engineering Society (India)
    </div>
  </div>
</body>
</html>`;
}
