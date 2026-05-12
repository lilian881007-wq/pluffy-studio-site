import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.resolve("outputs/pricing-edit");
await fs.mkdir(outputDir, { recursive: true });

const rows = [
  ["分類", "區塊", "品項", "說明文字", "價格", "備註"],
  ["Social", "貼文設計", "單張設計", "適用單一主題公告", "NT$ 1,000", ""],
  ["Social", "貼文設計", "組圖設計 3 張", "呈現連續閱讀內容", "NT$ 2,500", "加購：+NT$ 800 / 張"],
  ["Social", "延伸設計", "Banner 設計", "用於橫幅與封面", "NT$ 1,200 起", ""],
  ["Social", "延伸設計", "LINE 選單設計", "用於服務入口整理", "NT$ 1,500 起", ""],
  ["Social", "延伸設計", "商品介紹長圖", "呈現商品資訊賣點", "NT$ 2,000 起", ""],
  ["Social", "延伸設計", "網頁用圖設計", "用於網站區塊視覺", "NT$ 1,200 起", ""],
  ["Social", "延伸設計", "同版改尺寸", "用於既有版型延伸", "NT$ 200 起", ""],
  ["Template", "模板量產設計", "社群貼文模板建立", "用於固定貼文風格", "NT$ 2,000 - 4,000", ""],
  ["Template", "模板量產設計", "社群貼文套用產出", "用於大量內容上稿", "NT$ 800 / 張 起", ""],
  ["Template", "模板量產設計", "商品圖模板建立", "用於統一商品視覺", "NT$ 2,000 - 4,000", ""],
  ["Template", "模板量產設計", "商品圖套用產出", "用於商品批次製作", "NT$ 900 / 張 起", ""],
  ["Print", "印刷與實體設計", "名片設計", "呈現品牌基本印象", "NT$ 1,800 - 2,500", ""],
  ["Print", "印刷與實體設計", "海報設計", "用於活動與宣傳", "NT$ 2,000 - 3,500", ""],
  ["Print", "印刷與實體設計", "DM 設計", "用於資訊摺頁宣傳", "NT$ 2,500 起", ""],
  ["Print", "印刷與實體設計", "菜單 / 價目表設計", "呈現品項與價格", "NT$ 2,500 - 4,000", ""],
  ["Print", "印刷與實體設計", "貼紙設計", "用於包裝與標籤", "NT$ 1,200 - 2,000", ""],
  ["Print", "印刷與實體設計", "包裝設計", "呈現商品外觀風格", "NT$ 3,000 - 6,000", ""],
  ["Print", "印刷與實體設計", "型錄 / 畫冊設計", "用於完整內容編排", "NT$ 4,000 起", ""],
  ["Print", "印刷與實體設計", "卡片 / 票券設計", "用於活動與出貨", "NT$ 1,500 起", ""],
  ["Print", "印刷與實體設計", "手拿牌 / 布條 / 關東旗等", "用於攤位與現場", "依需求報價", ""],
  ["Print", "印刷與實體設計", "招牌 / 燈箱 / 帆布等", "用於店面視覺露出", "依需求報價", ""],
  ["Editing", "影音剪輯", "短片剪輯 30 秒以內", "用於社群短影音", "NT$ 800 - 1,500", ""],
  ["Editing", "影音剪輯", "宣傳影片剪輯", "用於活動與品牌介紹", "NT$ 2,000 / 分鐘 起", ""],
  ["Brand Extras", "品牌小項目與加價項目", "Logo 設計（簡易）", "用於品牌入門識別", "NT$ 2,000 - 3,000", ""],
  ["Brand Extras", "品牌小項目與加價項目", "插畫設計", "用於角色與小插圖", "NT$ 1,500 - 3,000", ""],
  ["Brand Extras", "品牌小項目與加價項目", "修改超出次數", "用於追加修改回合", "NT$ 300 / 次", ""],
  ["Brand Extras", "品牌小項目與加價項目", "急件製作", "用於壓縮製作時程", "+30%", ""],
  ["Brand Extras", "品牌小項目與加價項目", "提供原始檔", "用於後續自行編修", "+NT$ 1,000 - 2,000", ""],
];

const notes = [
  ["使用方式"],
  ["請直接修改「品項」「說明文字」「價格」「備註」欄位。"],
  ["分類與區塊可以調整，但如果要新增分類，請保留同樣欄位格式。"],
  ["改完後把這個 Excel 回傳，我會幫你檢查文字節奏並更新網站。"],
];

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("價目表編輯");
sheet.showGridLines = false;
sheet.getRangeByIndexes(0, 0, rows.length, rows[0].length).values = rows;

const used = sheet.getRangeByIndexes(0, 0, rows.length, rows[0].length);
used.format = {
  font: { name: "Noto Sans TC", color: "#5A514B" },
  wrapText: true,
};

sheet.getRange("A1:F1").format = {
  fill: "#F7A04C",
  font: { bold: true, color: "#FFFFFF" },
};
sheet.getRange(`A2:F${rows.length}`).format = {
  fill: "#FFFBF5",
};
sheet.getRange(`A2:A${rows.length}`).format = {
  font: { bold: true, color: "#8B4F34" },
};
sheet.getRange(`B2:B${rows.length}`).format = {
  font: { color: "#9B6A4D" },
};
sheet.getRange(`E2:F${rows.length}`).format = {
  font: { bold: true, color: "#7A3E10" },
};

sheet.getRange("A:A").format.columnWidthPx = 120;
sheet.getRange("B:B").format.columnWidthPx = 170;
sheet.getRange("C:C").format.columnWidthPx = 220;
sheet.getRange("D:D").format.columnWidthPx = 260;
sheet.getRange("E:E").format.columnWidthPx = 190;
sheet.getRange("F:F").format.columnWidthPx = 210;
sheet.getRange(`A1:F${rows.length}`).format.rowHeightPx = 34;
sheet.freezePanes.freezeRows(1);

const noteSheet = workbook.worksheets.add("說明");
noteSheet.showGridLines = false;
noteSheet.getRangeByIndexes(0, 0, notes.length, 1).values = notes;
noteSheet.getRange("A1").format = {
  fill: "#F7A04C",
  font: { bold: true, color: "#FFFFFF" },
};
noteSheet.getRange("A2:A4").format = {
  fill: "#FFFBF5",
  font: { name: "Noto Sans TC", color: "#5A514B" },
  wrapText: true,
};
noteSheet.getRange("A:A").format.columnWidthPx = 560;
noteSheet.getRange("A1:A4").format.rowHeightPx = 34;

const preview = await workbook.render({
  sheetName: "價目表編輯",
  range: "A1:F29",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outputDir, "pricing-edit-preview.png"), new Uint8Array(await preview.arrayBuffer()));

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(path.join(outputDir, "pluffy-pricing-edit.xlsx"));

const csv = rows
  .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  .join("\n");
await fs.writeFile(path.join(outputDir, "pluffy-pricing-edit.csv"), "\uFEFF" + csv, "utf8");
