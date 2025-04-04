import QRCode from "qrcode";
export const generateQrCodeBase64 = async (data) => {
  try {
    const qrBase64 = QRCode.toDataURL(data, {
      errorCorrectionLevel: "H", // Highest error correction level
      type: "png", // Image type
      quality: 0.92, // Compression quality
      margin: 2, // Margin around the QR code
    });
    return qrBase64;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};
export const generateQrCodeBuffer = async (data) => {
  try {
    const qrBase64 = await QRCode.toBuffer(data, {
      errorCorrectionLevel: "H", // Highest error correction level
      type: "png", // Image type
      quality: 0.92, // Compression quality
      margin: 2, // Margin around the QR code
    });
    return qrBase64;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};
