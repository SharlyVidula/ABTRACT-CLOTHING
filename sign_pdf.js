const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const { PDFDocument, rgb, degrees } = require('pdf-lib');
    const fontkit = require('@pdf-lib/fontkit');

    const pdfPath = 'C:\\Users\\lusitania\\.gemini\\antigravity-ide\\brain\\31295053-804d-4a8c-88e0-60e95bdfcc69\\media__1783698431464.pdf';
    const outPdfPath = 'c:\\project_gamma\\public\\signed_payhere_agreement.pdf';
    const fontUrl = 'https://github.com/google/fonts/raw/main/ofl/mrdehaviland/MrDeHaviland-Regular.ttf';

    console.log('Loading PDF...');
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);

    console.log('Fetching Mr De Haviland font from Google Fonts...');
    const fontResponse = await fetch(fontUrl);
    if (!fontResponse.ok) {
      throw new Error(`Failed to fetch font: ${fontResponse.statusText}`);
    }
    const fontBuffer = await fontResponse.arrayBuffer();
    const customFont = await pdfDoc.embedFont(new Uint8Array(fontBuffer));

    console.log('Modifying PDF...');
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Drawing the handwritten signature above the "Bank Account Holder" line
    firstPage.drawText('Sharly Vidula', {
      x: 95,
      y: 110,
      size: 45,
      font: customFont,
      color: rgb(12 / 255, 15 / 255, 29 / 255), // Dark pen ink color
      rotate: degrees(-3),
    });

    console.log('Saving signed PDF...');
    const signedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outPdfPath, signedPdfBytes);
    console.log(`Signed PDF successfully saved to ${outPdfPath}`);
  } catch (error) {
    console.error('Error during PDF signing:', error);
    process.exit(1);
  }
}

main();
