import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const BG = "#060214";
const PADDING_RATIO = 0.16;

/**
 * Genera un SVG de fondo con un leve glow radial central para matchear el
 * fondo global de la app (body::before en globals.css).
 */
function backgroundSvg(size) {
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

async function composeBuffer(logoPath, size, paddingRatio = PADDING_RATIO) {
    const padding = Math.round(size * paddingRatio);
    const logoSize = size - padding * 2;

    const logo = await sharp(readFileSync(logoPath))
        .resize(logoSize, logoSize, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

    return sharp(backgroundSvg(size))
        .composite([{ input: logo, top: padding, left: padding }])
        .png()
        .toBuffer();
}

async function composeIcon(logoPath, size, outPath, paddingRatio) {
    const buf = await composeBuffer(logoPath, size, paddingRatio);
    writeFileSync(outPath, buf);
    console.log(`wrote ${outPath} (${size}x${size})`);
}

const sourceLogo = resolve(root, "scripts/inzidium-logo-transparent.webp");

await composeIcon(sourceLogo, 192, resolve(root, "app/icon.png"));
await composeIcon(sourceLogo, 180, resolve(root, "app/apple-icon.png"));
await composeIcon(sourceLogo, 192, resolve(root, "public/icon-192.png"));
await composeIcon(sourceLogo, 512, resolve(root, "public/icon-512.png"));

const icoBuffers = await Promise.all(
    [16, 32, 48, 64].map((s) => composeBuffer(sourceLogo, s)),
);
const icoData = await pngToIco(icoBuffers);
writeFileSync(resolve(root, "app/favicon.ico"), icoData);
console.log("wrote favicon.ico (16/32/48/64)");
