export function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function generateUniqueSlug(
    base: string,
    isTaken: (candidate: string) => Promise<boolean>
): Promise<string> {
    const root = slugify(base) || 'servicio';
    let candidate = root;
    let suffix = 2;
    while (await isTaken(candidate)) {
        candidate = `${root}-${suffix}`;
        suffix++;
        if (suffix > 100) throw new Error('No se pudo generar un slug único');
    }
    return candidate;
}
