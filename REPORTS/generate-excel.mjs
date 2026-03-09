import { execSync } from 'child_process';

// Install exceljs temporarily
execSync('npm install --no-save exceljs', { cwd: '/Users/aagii/Vertmonhub', stdio: 'pipe' });

const ExcelJS = (await import('exceljs')).default;
const path = await import('path');

const workbook = new ExcelJS.Workbook();
workbook.creator = 'Vertmon Hub';
workbook.created = new Date();

const ws = workbook.addWorksheet('Гэрээний Хавсралт', {
    properties: { defaultColWidth: 20 },
    pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true }
});

// Column widths
ws.columns = [
    { width: 6 },   // A - №
    { width: 30 },  // B - Ажил
    { width: 55 },  // C - Тайлбар
];

// ===== STYLES =====
const titleFont = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF1A1A2E' } };
const subtitleFont = { name: 'Arial', size: 12, color: { argb: 'FF555555' } };
const sectionFont = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
const headerFont = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
const cellFont = { name: 'Arial', size: 11 };
const cellFontBold = { name: 'Arial', size: 11, bold: true };

const darkFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A2E' } };
const lightFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
const blueFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D5BFF' } };
const greenFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };

const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
    left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
    bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
    right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
};

// ===== TITLE =====
ws.mergeCells('A1:C1');
const titleRow = ws.getRow(1);
titleRow.height = 40;
const titleCell = ws.getCell('A1');
titleCell.value = 'ГЭРЭЭНИЙ ХАВСРАЛТ';
titleCell.font = titleFont;
titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

ws.mergeCells('A2:C2');
const subtitleCell = ws.getCell('A2');
subtitleCell.value = 'Гүйцэтгэх ажлуудын жагсаалт';
subtitleCell.font = subtitleFont;
subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
ws.getRow(2).height = 25;

// ===== META INFO =====
ws.getRow(3).height = 6; // spacer

ws.mergeCells('A4:B4');
ws.getCell('A4').value = 'Платформ: Vertmon Hub';
ws.getCell('A4').font = { name: 'Arial', size: 10, color: { argb: 'FF555555' } };
ws.getCell('C4').value = 'Огноо: 2026.02.16';
ws.getCell('C4').font = { name: 'Arial', size: 10, color: { argb: 'FF555555' } };
ws.getCell('C4').alignment = { horizontal: 'right' };

ws.mergeCells('A5:B5');
ws.getCell('A5').value = 'Баримтын дугаар: VH-APP-001';
ws.getCell('A5').font = { name: 'Arial', size: 10, color: { argb: 'FF555555' } };

ws.getRow(6).height = 10; // spacer

// ===== SECTION 1: CRM =====
const sec1Row = 7;
ws.mergeCells(`A${sec1Row}:C${sec1Row}`);
const sec1Cell = ws.getCell(`A${sec1Row}`);
sec1Cell.value = '  1. Борлуулалтын модуль (CRM)';
sec1Cell.font = sectionFont;
sec1Cell.fill = darkFill;
sec1Cell.alignment = { vertical: 'middle' };
ws.getRow(sec1Row).height = 32;

// Header row
const h1Row = sec1Row + 1;
['№', 'Гүйцэтгэх ажил', 'Тайлбар'].forEach((text, i) => {
    const cell = ws.getCell(h1Row, i + 1);
    cell.value = text;
    cell.font = headerFont;
    cell.fill = blueFill;
    cell.alignment = { horizontal: i === 0 ? 'center' : 'left', vertical: 'middle' };
    cell.border = thinBorder;
});
ws.getRow(h1Row).height = 28;

// CRM Data
const crmData = [
    [1, 'Database бэлдэх', 'Системийн үндсэн өгөгдлийн сангийн бүтэц боловсруулах'],
    [2, 'Data синк хийх', 'Өгөгдөл импорт, синк тохируулах'],
    [3, 'Өгөгдөл ангилах (Sort)', 'Харилцагч, борлуулалтын мэдээлэл ангилах логик'],
    [4, 'Бүтээгдэхүүний цэс үүсгэх', 'Бүтээгдэхүүн/үйлчилгээ бүртгэлийн модуль'],
    [5, 'Data аналитик хийх', 'Борлуулалтын дата анализ, тайлангийн суурь бэлтгэх'],
];

crmData.forEach((row, idx) => {
    const r = h1Row + 1 + idx;
    row.forEach((val, col) => {
        const cell = ws.getCell(r, col + 1);
        cell.value = val;
        cell.font = col === 1 ? cellFontBold : cellFont;
        cell.alignment = { horizontal: col === 0 ? 'center' : 'left', vertical: 'middle', wrapText: true };
        cell.border = thinBorder;
        if (idx % 2 === 1) cell.fill = lightFill;
    });
    ws.getRow(r).height = 28;
});

// ===== SPACER =====
const spacerRow = h1Row + 1 + crmData.length;
ws.getRow(spacerRow).height = 14;

// ===== SECTION 2: MARKETING =====
const sec2Row = spacerRow + 1;
ws.mergeCells(`A${sec2Row}:C${sec2Row}`);
const sec2Cell = ws.getCell(`A${sec2Row}`);
sec2Cell.value = '  2. Маркетингийн модуль';
sec2Cell.font = sectionFont;
sec2Cell.fill = darkFill;
sec2Cell.alignment = { vertical: 'middle' };
ws.getRow(sec2Row).height = 32;

// Header row
const h2Row = sec2Row + 1;
['№', 'Гүйцэтгэх ажил', 'Тайлбар'].forEach((text, i) => {
    const cell = ws.getCell(h2Row, i + 1);
    cell.value = text;
    cell.font = headerFont;
    cell.fill = greenFill;
    cell.alignment = { horizontal: i === 0 ? 'center' : 'left', vertical: 'middle' };
    cell.border = thinBorder;
});
ws.getRow(h2Row).height = 28;

// Marketing Data
const mktData = [
    [1, 'AI Agent үүсгэх', 'AI туслах / chatbot суурь хөгжүүлэлт'],
    [2, 'IF (Automation) холбох', 'Автомат workflow, trigger тохируулах'],
    [3, 'Facebook апп холболт', 'Facebook мэдээлэл татах интеграц'],
    [4, 'Имэйл платформ холболт', 'Мэйл маркетинг систем интеграц'],
];

mktData.forEach((row, idx) => {
    const r = h2Row + 1 + idx;
    row.forEach((val, col) => {
        const cell = ws.getCell(r, col + 1);
        cell.value = val;
        cell.font = col === 1 ? cellFontBold : cellFont;
        cell.alignment = { horizontal: col === 0 ? 'center' : 'left', vertical: 'middle', wrapText: true };
        cell.border = thinBorder;
        if (idx % 2 === 1) cell.fill = lightFill;
    });
    ws.getRow(r).height = 28;
});

// ===== SUMMARY =====
const sumStart = h2Row + 1 + mktData.length + 1;
ws.getRow(sumStart - 1).height = 14;

const summaryData = [
    ['Борлуулалтын модуль (CRM)', '5 ажил'],
    ['Маркетингийн модуль', '4 ажил'],
    ['Нийт гүйцэтгэх ажил', '9 ажил'],
];

summaryData.forEach((row, idx) => {
    const r = sumStart + idx;
    ws.mergeCells(`A${r}:B${r}`);
    const labelCell = ws.getCell(`A${r}`);
    labelCell.value = '  ' + row[0];
    labelCell.font = idx === 2 ? { name: 'Arial', size: 12, bold: true, color: { argb: 'FF1A1A2E' } } : cellFont;
    labelCell.border = thinBorder;
    labelCell.alignment = { vertical: 'middle' };
    if (idx === 2) labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };

    const valCell = ws.getCell(`C${r}`);
    valCell.value = row[1];
    valCell.font = idx === 2 ? { name: 'Arial', size: 12, bold: true, color: { argb: 'FF1A1A2E' } } : cellFont;
    valCell.alignment = { horizontal: 'right', vertical: 'middle' };
    valCell.border = thinBorder;
    if (idx === 2) valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };

    ws.getRow(r).height = 26;
});

// ===== SIGNATURES =====
const sigRow = sumStart + summaryData.length + 2;
ws.getRow(sigRow - 1).height = 30;

ws.getCell(`A${sigRow}`).value = 'Захиалагч:';
ws.getCell(`A${sigRow}`).font = { name: 'Arial', size: 11, bold: true };
ws.getCell(`C${sigRow}`).value = 'Гүйцэтгэгч:';
ws.getCell(`C${sigRow}`).font = { name: 'Arial', size: 11, bold: true };

const sigLine = sigRow + 2;
ws.mergeCells(`A${sigLine}:B${sigLine}`);
ws.getCell(`A${sigLine}`).value = '_______________________';
ws.getCell(`A${sigLine}`).font = { name: 'Arial', size: 11, color: { argb: 'FF999999' } };
ws.getCell(`C${sigLine}`).value = '_______________________';
ws.getCell(`C${sigLine}`).font = { name: 'Arial', size: 11, color: { argb: 'FF999999' } };

ws.mergeCells(`A${sigLine + 1}:B${sigLine + 1}`);
ws.getCell(`A${sigLine + 1}`).value = '/Нэр, гарын үсэг/';
ws.getCell(`A${sigLine + 1}`).font = { name: 'Arial', size: 9, color: { argb: 'FF999999' } };
ws.getCell(`C${sigLine + 1}`).value = '/Нэр, гарын үсэг/';
ws.getCell(`C${sigLine + 1}`).font = { name: 'Arial', size: 9, color: { argb: 'FF999999' } };

// ===== FOOTER =====
const footRow = sigLine + 3;
ws.mergeCells(`A${footRow}:C${footRow}`);
ws.getCell(`A${footRow}`).value = 'Энэхүү хавсралт нь гэрээний салшгүй хэсэг болно.';
ws.getCell(`A${footRow}`).font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF999999' } };
ws.getCell(`A${footRow}`).alignment = { horizontal: 'center' };

// Save
const outputPath = '/Users/aagii/Vertmonhub/REPORTS/CONTRACT_APPENDIX_DELIVERABLES.xlsx';
await workbook.xlsx.writeFile(outputPath);
console.log(`Excel saved: ${outputPath}`);
