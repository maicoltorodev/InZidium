// Genera las variantes de favicon por proyecto (ver memoria: favicon_pattern.md).
//
// Padding por uso:
//   - FAVICON.ICO (16/32/48/64)   → 2% — renderiza chico en tab, logo tiene
//     que llenar el canvas o se ve una mancha lejana.
//   - ICON.PNG (192)               → 4% — para tab de alta DPI y Windows.
//   - APPLE-ICON.PNG (180)         → 10% — safe zone de iOS para rounded corners.
//   - FAVICON-GOOGLE (192/512)     → 6% — logo grande para rendering a 48×48
//     en los resultados de búsqueda de Google.

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const BG = "#060214";

const PADDING = {
    favicon: 0.02,  // .ico small sizes
    icon: 0.04,     // icon.png 192
    apple: 0.10,    // iOS safe zone
    google: 0.06,   // Google search results
};

function gradientBackgroundSvg(size) {
    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
            <defs>
                <radialGradient id="g" cx="50%" cy="35%" r="70%">
                    <stop offset="0%" stop-color="#a855f7" stop-opacity="0.22"/>
                    <stop offset="60%" stop-color="#22d3ee" stop-opacity="0.06"/>
                    <stop offset="100%" stop-color="${BG}" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="${BG}"/>
            <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>`,
    );
}

async function composeBuffer(logoPath, size, paddingRatio) {
    const padding = Math.round(size * paddingRatio);
    const logoSize = size - padding * 2;

    const logo = await sharp(readFileSync(logoPath))
        .resize(logoSize, logoSize, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

    return sharp(gradientBackgroundSvg(size))
        .composite([{ input: logo, top: padding, left: padding }])
        .png()
        .toBuffer();
}

async function writeIcon(logoPath, size, outPath, paddingRatio) {
    const buf = await composeBuffer(logoPath, size, paddingRatio);
    writeFileSync(outPath, buf);
    console.log(`  ${outPath.split(/[\\/]/).slice(-2).join("/")} (${size}×${size}, pad ${Math.round(paddingRatio * 100)}%)`);
}

const sourceLogo = resolve(root, "scripts/inzidium-logo-transparent.webp");

console.log("→ TAB variant");
await writeIcon(sourceLogo, 192, resolve(root, "app/icon.png"), PADDING.icon);
await writeIcon(sourceLogo, 180, resolve(root, "app/apple-icon.png"), PADDING.apple);

const icoBuffers = await Promise.all(
    [16, 32, 48, 64].map((s) => composeBuffer(sourceLogo, s, PADDING.favicon)),
);
const icoData = await pngToIco(icoBuffers);
writeFileSync(resolve(root, "app/favicon.ico"), icoData);
console.log(`  app/favicon.ico (16/32/48/64, pad ${Math.round(PADDING.favicon * 100)}%)`);

console.log("\n→ GOOGLE variant");
await writeIcon(sourceLogo, 192, resolve(root, "public/favicon-google.png"), PADDING.google);
await writeIcon(sourceLogo, 512, resolve(root, "public/favicon-google-512.png"), PADDING.google);

console.log("\n✅ Listo.");
