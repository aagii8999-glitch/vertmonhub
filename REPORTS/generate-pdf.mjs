import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'CONTRACT_APPENDIX_DELIVERABLES.html');
const pdfPath = path.join(__dirname, 'CONTRACT_APPENDIX_DELIVERABLES.pdf');

// Use the cached Chrome directly via CDP
const chromePath = '/Users/aagii/.cache/puppeteer/chrome/mac_arm-145.0.7632.67/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

try {
    execSync(`"${chromePath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-margins "file://${htmlPath}"`, {
        timeout: 15000,
        stdio: 'pipe'
    });
    console.log(`PDF saved: ${pdfPath}`);
} catch (e) {
    console.error('Chrome PDF failed, trying alternative...');
    // Fallback: try system Chrome
    try {
        execSync(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-margins "file://${htmlPath}"`, {
            timeout: 15000,
            stdio: 'pipe'
        });
        console.log(`PDF saved (system Chrome): ${pdfPath}`);
    } catch (e2) {
        console.error('All methods failed:', e2.message);
    }
}
