const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function generate() {
  const outputDir = path.join(__dirname, '..', 'public', 'qr');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const websiteUrl = 'https://walessgroup.ae';
  const loyaltyUrl = 'https://walessgroup.ae/loyalty';

  console.log('Generating QR codes...');

  // 1. Website Standard High-Res PNG (2048x2048)
  const websitePngPath = path.join(outputDir, 'waless-website-qr.png');
  await QRCode.toFile(websitePngPath, websiteUrl, {
    width: 2048,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
  console.log('Saved:', websitePngPath);

  // 2. Website Pure Vector SVG
  const websiteSvgPath = path.join(outputDir, 'waless-website-qr.svg');
  const websiteSvg = await QRCode.toString(websiteUrl, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
  fs.writeFileSync(websiteSvgPath, websiteSvg, 'utf8');
  console.log('Saved:', websiteSvgPath);

  // 3. Loyalty Program High-Res PNG (2048x2048)
  const loyaltyPngPath = path.join(outputDir, 'waless-loyalty-qr.png');
  await QRCode.toFile(loyaltyPngPath, loyaltyUrl, {
    width: 2048,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
  console.log('Saved:', loyaltyPngPath);

  // 4. Loyalty Program Pure Vector SVG
  const loyaltySvgPath = path.join(outputDir, 'waless-loyalty-qr.svg');
  const loyaltySvg = await QRCode.toString(loyaltyUrl, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
  fs.writeFileSync(loyaltySvgPath, loyaltySvg, 'utf8');
  console.log('Saved:', loyaltySvgPath);

  console.log('Base QR codes generated successfully!');
}

generate().catch((err) => {
  console.error('Error generating QR codes:', err);
  process.exit(1);
});
