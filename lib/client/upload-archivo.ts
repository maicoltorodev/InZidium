const MAX_UPLOAD_SIZE = 4.5 * 1024 * 1024;
const MAX_IMAGE_INPUT_SIZE = 15 * 1024 * 1024;
// 2000px cubre modal full-screen en retina 2x (modal ~1000px → 2000 fuente).
// Antes estaba en 1600, que se veía borroso en pantallas grandes.
const IMAGE_MAX_DIMENSION = 2000;
// Arranca con calidad alta (0.9) y baja progresivamente si el archivo sale
// por encima de 4.5MB. Antes [0.82, 0.72, 0.62, 0.52] era conservador y la
// primera pasada ya perdía nitidez visible en cards grandes.
const IMAGE_QUALITY_STEPS = [0.9, 0.82, 0.72, 0.6];
const OPTIMIZABLE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const PRESERVED_IMAGE_TYPES = new Map([
  ["image/svg+xml", "SVG CONSERVADO SIN CONVERSION PARA MANTENER EL VECTOR."],
  ["image/gif", "GIF CONSERVADO SIN CONVERSION PARA NO PERDER LA ANIMACION."],
]);
const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
]);

type UploadActor = "admin" | "cliente";

type ServerUploadResult = { success?: boolean; url?: string; error?: string };

export type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

type UploadDeps = {
  optimizeImageFile?: (file: File) => Promise<File>;
  uploadAction?: (formData: FormData) => Promise<ServerUploadResult>;
};

async function defaultUploadAction(
  formData: FormData,
): Promise<ServerUploadResult> {
  const { uploadArchivo } = await import("../actions");
  return (await uploadArchivo(formData)) as ServerUploadResult;
}

export function shouldOptimizeImage(file: File) {
  return OPTIMIZABLE_IMAGE_TYPES.has(file.type);
}

export function getUploadNotice(file: File) {
  if (shouldOptimizeImage(file)) {
    return "IMAGEN OPTIMIZADA Y CONVERTIDA A WEBP ANTES DE SUBIR.";
  }

  return PRESERVED_IMAGE_TYPES.get(file.type);
}

export function buildWebpFilename(filename: string) {
  const baseName = filename.replace(/\.[^/.]+$/, "") || "archivo";
  return `${baseName}.webp`;
}

function readImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo cargar la imagen."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo comprimir la imagen."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

export async function optimizeImageFile(file: File) {
  const image = await readImage(file);
  const largestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale =
    largestSide > IMAGE_MAX_DIMENSION ? IMAGE_MAX_DIMENSION / largestSide : 1;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(
      "No se pudo inicializar el canvas para comprimir la imagen.",
    );
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  let optimizedBlob: Blob | null = null;
  for (const quality of IMAGE_QUALITY_STEPS) {
    const candidate = await canvasToBlob(canvas, quality);
    optimizedBlob = candidate;

    if (candidate.size <= MAX_UPLOAD_SIZE) {
      break;
    }
  }

  if (!optimizedBlob) {
    throw new Error("No se pudo generar la imagen optimizada.");
  }

  return new File([optimizedBlob], buildWebpFilename(file.name), {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export function createProjectFileUploader(deps: UploadDeps = {}) {
  const optimize = deps.optimizeImageFile ?? optimizeImageFile;
  const upload = deps.uploadAction ?? defaultUploadAction;

  return async function uploadProjectFile(input: {
    file: File;
    proyectoId: string;
    subidoPor: UploadActor;
    oldUrl?: string;
  }): Promise<UploadResult> {
    const { file, proyectoId, subidoPor, oldUrl } = input;

    if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
      return {
        success: false,
        error: "TIPO DE ARCHIVO NO PERMITIDO.",
      };
    }

    if (shouldOptimizeImage(file) && file.size > MAX_IMAGE_INPUT_SIZE) {
      return {
        success: false,
        error: "LA IMAGEN ORIGINAL ES DEMASIADO GRANDE (>15MB).",
      };
    }

    if (!shouldOptimizeImage(file) && file.size > MAX_UPLOAD_SIZE) {
      return {
        success: false,
        error: "EL ARCHIVO ES DEMASIADO GRANDE (>4.5MB).",
      };
    }

    const preparedFile = shouldOptimizeImage(file)
      ? await optimize(file)
      : file;
    if (preparedFile.size > MAX_UPLOAD_SIZE) {
      return {
        success: false,
        error: "EL ARCHIVO OPTIMIZADO SIGUE SIENDO DEMASIADO GRANDE (>4.5MB).",
      };
    }

    const formData = new FormData();
    formData.append("file", preparedFile);
    formData.append("proyectoId", proyectoId);
    formData.append("subidoPor", subidoPor);
    if (oldUrl) formData.append("oldUrl", oldUrl);

    const result = await upload(formData);
    if (!result.success || !result.url) {
      return {
        success: false,
        error: result.error || "ERROR DESCONOCIDO AL SUBIR ARCHIVO.",
      };
    }

    return { success: true, url: result.url };
  };
}

export const uploadProjectFile = createProjectFileUploader();
