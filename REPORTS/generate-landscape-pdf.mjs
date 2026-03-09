import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'DELIVERABLES_PRESENTATION.html');
const pdfPath = path.join(__dirname, 'DELIVERABLES_PRESENTATION.pdf');

async function generatePDF() {
    console.log('🚀 PDF үүсгэж байна...');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });

    const page = await browser.newPage();

    // Wide viewport for landscape
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 1500));

    await page.pdf({
        path: pdfPath,
        landscape: true,
        width: '297mm',   // A4 landscape width
        height: '210mm',  // A4 landscape height
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
        preferCSSPageSize: true,
        displayHeaderFooter: false
    });

    const stats = fs.statSync(pdfPath);
    console.log(`✅ PDF амжилттай үүслээ!`);
    console.log(`📄 Файл: ${pdfPath}`);
    console.log(`📏 Хэмжээ: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    await browser.close();
}

generatePDF().catch(err => {
    console.error('❌ Алдаа:', err.message);
    process.exit(1);
});
