// =============================================================
// Optimización de imágenes en cliente (canvas-based).
// Convierte JPEG/PNG/WebP a WebP optimizado, con resize y
// degradado progresivo de calidad hasta que pese < target.
// =============================================================

const IMAGE_MAX_DIMENSION = 2000;
const IMAGE_QUALITY_STEPS = [0.9, 0.82, 0.72, 0.6];

function readImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(image);
        };
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('No se pudo cargar la imagen.'));
        };
        image.src = objectUrl;
    });
}

function canvasToWebpBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('No se pudo comprimir la imagen.'));
                    return;
                }
                resolve(blob);
            },
            'image/webp',
            quality,
        );
    });
}

export function buildWebpFilename(filename: string): string {
    const baseName = filename.replace(/\.[^/.]+$/, '') || 'archivo';
    return `${baseName}.webp`;
}

/**
 * Optimiza una imagen raster: resize a 2000px máx, conversión a WebP
 * con calidad progresiva hasta que pese ≤ targetMaxBytes.
 */
export async function optimizeImageFile(file: File, targetMaxBytes: number): Promise<File> {
    const image = await readImage(file);
    const largestSide = Math.max(image.naturalWidth, image.naturalHeight);
    const scale = largestSide > IMAGE_MAX_DIMENSION ? IMAGE_MAX_DIMENSION / largestSide : 1;

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo inicializar el canvas para comprimir la imagen.');

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    let optimizedBlob: Blob | null = null;
    for (const quality of IMAGE_QUALITY_STEPS) {
        const candidate = await canvasToWebpBlob(canvas, quality);
        optimizedBlob = candidate;
        if (candidate.size <= targetMaxBytes) break;
    }

    if (!optimizedBlob) throw new Error('No se pudo generar la imagen optimizada.');

    return new File([optimizedBlob], buildWebpFilename(file.name), {
        type: 'image/webp',
        lastModified: Date.now(),
    });
}
