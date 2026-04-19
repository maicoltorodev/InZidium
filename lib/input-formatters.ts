/**
 * Formatters + validators para inputs de admin (clientes, administradores).
 *
 * Patrón: el formatter se aplica en `onChange` y devuelve SIEMPRE el valor
 * "limpio". El validator se corre en submit y devuelve un `string | null`
 * (null = OK, string = mensaje de error).
 *
 * Los validators son más estrictos que los formatters. El formatter sanitiza
 * mientras el user escribe (evita caracteres inválidos); el validator verifica
 * la estructura completa al final (email bien formado, cédula no muy corta,
 * etc). Tener ambos es clave: el formatter evita que escriba basura, el
 * validator evita que envíe un campo incompleto.
 */

// ─── Nombres (clientes y admins) ─────────────────────────────────────────────

/**
 * Acepta letras (con tildes, ñ), espacios y guiones. Descarta dígitos y
 * símbolos. Colapsa espacios múltiples. Aplica Title Case (primera letra de
 * cada palabra en mayúscula).
 */
export function formatName(raw: string): string {
    const cleaned = raw
        .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/^\s+/, ""); // permitimos trailing space mientras escribe la siguiente palabra

    return cleaned
        .split(" ")
        .map((word, i, arr) => {
            // si es la última "palabra" vacía (user acaba de apretar espacio) no romper
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
}

/** Min 2 palabras de al menos 2 letras cada una, total <= 80 chars. */
export function validateName(name: string): string | null {
    const trimmed = name.trim();
    if (trimmed.length === 0) return "El nombre es obligatorio.";
    if (trimmed.length > 80) return "El nombre es demasiado largo.";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(trimmed)) {
        return "El nombre solo puede contener letras.";
    }
    const words = trimmed.split(/\s+/).filter((w) => w.length >= 2);
    if (words.length < 2) return "Ingresa nombre y apellido.";
    return null;
}

// ─── Cédula ──────────────────────────────────────────────────────────────────

/** Solo dígitos. Max 12 para cubrir NIT o identificaciones largas. */
export function formatCedula(raw: string): string {
    return raw.replace(/\D/g, "").slice(0, 12);
}

/** Entre 6 y 12 dígitos. Cédula colombiana típica: 8-10 dígitos. */
export function validateCedula(cedula: string): string | null {
    const cleaned = cedula.replace(/\D/g, "");
    if (cleaned.length === 0) return "La cédula es obligatoria.";
    if (cleaned.length < 6) return "La cédula es muy corta.";
    if (cleaned.length > 12) return "La cédula es muy larga.";
    return null;
}

// ─── Email ───────────────────────────────────────────────────────────────────

/** Trim + lowercase. Sin filtrar caracteres — emails pueden tener + y . */
export function formatEmail(raw: string): string {
    return raw.trim().toLowerCase();
}

/** Regex estándar para emails. No perfecto pero cubre 99%. */
export function validateEmail(email: string): string | null {
    const trimmed = email.trim();
    if (trimmed.length === 0) return "El correo es obligatorio.";
    if (trimmed.length > 120) return "El correo es demasiado largo.";
    // RFC 5322 simplificado
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(trimmed)) return "Correo inválido.";
    return null;
}

// ─── Teléfono Colombia ───────────────────────────────────────────────────────

/**
 * Extrae los 10 dígitos nacionales (sin +57). Acepta si el user escribe el
 * +57 o el "57" pegado al inicio — lo quita para no duplicarlo.
 */
export function formatPhoneDigitsCO(raw: string): string {
    let digits = raw.replace(/\D/g, "");
    // Si pegaron con código de país, quitarlo
    if (digits.startsWith("57") && digits.length > 10) {
        digits = digits.slice(2);
    }
    return digits.slice(0, 10);
}

/** Display con espacios: "300 123 45 67" (grupos 3-3-2-2). */
export function displayPhoneCO(digits: string): string {
    const d = digits.replace(/\D/g, "").slice(0, 10);
    const parts: string[] = [];
    if (d.length > 0) parts.push(d.slice(0, 3));
    if (d.length > 3) parts.push(d.slice(3, 6));
    if (d.length > 6) parts.push(d.slice(6, 8));
    if (d.length > 8) parts.push(d.slice(8, 10));
    return parts.join(" ");
}

/** Full internacional: `+57 300 123 45 67`. Es lo que se guarda en DB. */
export function fullPhoneCO(digits: string): string {
    const d = digits.replace(/\D/g, "").slice(0, 10);
    if (d.length === 0) return "";
    return "+57 " + displayPhoneCO(d);
}

/** Celular CO: 10 dígitos, debe empezar por 3 (regla operador). */
export function validatePhoneCO(digits: string): string | null {
    const d = digits.replace(/\D/g, "");
    if (d.length === 0) return "El teléfono es obligatorio.";
    if (d.length !== 10) return "El teléfono debe tener 10 dígitos.";
    if (!d.startsWith("3")) return "Los celulares colombianos empiezan por 3.";
    return null;
}

// ─── Username (admins) ───────────────────────────────────────────────────────

/** Lowercase, sin espacios, solo `a-z 0-9 _ -`. */
export function formatUsername(raw: string): string {
    return raw
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9_-]/g, "")
        .slice(0, 32);
}

export function validateUsername(u: string): string | null {
    const cleaned = u.trim();
    if (cleaned.length === 0) return "El usuario es obligatorio.";
    if (cleaned.length < 3) return "Mínimo 3 caracteres.";
    if (cleaned.length > 32) return "Máximo 32 caracteres.";
    if (!/^[a-z0-9_-]+$/.test(cleaned)) {
        return "Solo minúsculas, números, '_' y '-'.";
    }
    return null;
}

// ─── Password (admins) ───────────────────────────────────────────────────────

/**
 * Requisito existente ya pintado en la UI:
 * mínimo 8 caracteres, una mayúscula, un número y un símbolo (@$!%*?&).
 */
export function validatePassword(pw: string): string | null {
    if (pw.length === 0) return "La contraseña es obligatoria.";
    if (pw.length < 8) return "Mínimo 8 caracteres.";
    if (!/[A-Z]/.test(pw)) return "Debe incluir una mayúscula.";
    if (!/\d/.test(pw)) return "Debe incluir un número.";
    if (!/[@$!%*?&]/.test(pw)) return "Debe incluir un símbolo (@$!%*?&).";
    return null;
}
