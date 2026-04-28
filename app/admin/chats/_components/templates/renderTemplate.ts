import type { TemplateComponent, WhatsAppTemplate } from "@/lib/crm/actions/templates";

/**
 * Cuenta los placeholders {{1}}, {{2}}, … en el body del template.
 */
export function countTemplateParams(template: WhatsAppTemplate): number {
    const body = template.components.find((c) => c.type === "BODY");
    if (!body?.text) return 0;
    const matches = body.text.match(/\{\{\d+\}\}/g);
    if (!matches) return 0;
    const nums = matches.map((m) => parseInt(m.replace(/[{}]/g, ""), 10));
    return Math.max(...nums, 0);
}

/**
 * Devuelve el texto del body con los parámetros sustituidos.
 * Si faltan params, los reemplaza con un placeholder visible.
 */
export function renderTemplateBody(template: WhatsAppTemplate, params: string[]): string {
    const body = template.components.find((c) => c.type === "BODY");
    if (!body?.text) return "";
    return body.text.replace(/\{\{(\d+)\}\}/g, (_match, n) => {
        const idx = parseInt(n, 10) - 1;
        return params[idx]?.trim() || `{{${n}}}`;
    });
}

/**
 * Texto plano completo del template para preview / persistencia (header + body + footer).
 */
export function renderFullTemplate(template: WhatsAppTemplate, params: string[]): string {
    const parts: string[] = [];
    const header = template.components.find((c: TemplateComponent) => c.type === "HEADER");
    if (header?.text) parts.push(header.text);
    parts.push(renderTemplateBody(template, params));
    const footer = template.components.find((c: TemplateComponent) => c.type === "FOOTER");
    if (footer?.text) parts.push(footer.text);
    return parts.filter(Boolean).join("\n\n");
}
