import QRCode from 'qrcode';

export const generateQRData = (text, options = {}) => {
  // Error correction level: L, M, Q, H
  const errorCorrectionLevel = options.errorCorrectionLevel || 'M';
  
  try {
    const qr = QRCode.create(text, {
      errorCorrectionLevel,
      ...options
    });
    return qr;
  } catch (err) {
    console.error("Error generating QR code:", err);
    return null;
  }
};
