/**
 * generate-qr.mjs
 * ---------------------------------------------------------------
 * 用 qrcode 這個 npm 套件,把最終網址產生成兩種格式的 QR Code:
 *   - qr/guide-qr.svg  向量,印刷用(可無限放大不糊)
 *   - qr/guide-qr.png  點陣,螢幕預覽用(1024px)
 *
 * 用法:
 *   npm install                       # 只需第一次
 *   node generate-qr.mjs <網址>
 *   node generate-qr.mjs https://xxx.github.io/audio-play/
 *
 * 也可以先設定環境變數 QR_URL 再直接 npm run qr。
 * ---------------------------------------------------------------
 */

import QRCode from "qrcode";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.argv[2] || process.env.QR_URL;

if (!url) {
  console.error("✗ 請提供最終網址,例如:");
  console.error("    node generate-qr.mjs https://<帳號>.github.io/<repo>/");
  process.exit(1);
}

try {
  // 粗略驗證是不是一個合法網址
  // eslint-disable-next-line no-new
  new URL(url);
} catch {
  console.error(`✗ 這看起來不是合法網址:${url}`);
  process.exit(1);
}

const outDir = resolve(__dirname, "qr");
const svgPath = resolve(outDir, "guide-qr.svg");
const pngPath = resolve(outDir, "guide-qr.png");

// 印刷 / 掃描友善設定:高容錯(H)、留白 4 模組
const common = {
  errorCorrectionLevel: "H",
  margin: 4,
  color: { dark: "#201F1C", light: "#FFFFFF" },
};

await mkdir(outDir, { recursive: true });

// SVG(印刷用)
const svg = await QRCode.toString(url, { ...common, type: "svg" });
await writeFile(svgPath, svg, "utf8");

// PNG(預覽用)
await QRCode.toFile(pngPath, url, { ...common, type: "png", width: 1024 });

console.log("✓ QR Code 已產生:");
console.log(`    網址  ${url}`);
console.log(`    SVG   ${svgPath}`);
console.log(`    PNG   ${pngPath}`);
