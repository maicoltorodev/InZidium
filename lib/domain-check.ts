'use server';

/**
 * Checks domain availability using RDAP protocol.
 * 
 * Logic:
 * RDAP returns 200 OK + JSON if the domain is REGISTERED (Not Available).
 * RDAP returns 404 Not Found if the domain is NOT REGISTERED (Available).
 * RDAP returns other errors (400, 500) for invalid domains or server issues.
 */
export async function checkDomainAvailability(domain: string): Promise<{ available: boolean; error?: string }> {
    // 1. Basic cleaning and validation
    const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');

    if (!cleanDomain || cleanDomain.length < 3) {
        return { available: false, error: 'Dominio muy corto o inválido.' };
    }

    if (!cleanDomain.includes('.')) {
        // User typed "google" -> assumes .com by default for check? Or force extension
        // Let's assume user might type just name, defaulting to .com for check or require extension.
        // Better to require extension or append one. Let's append .com if missing for a better UX.
        // Actually, Wizard forces user to type the name and hardcodes .com, let's handle that.
        // The wizard input sends just the name "google", so we should append .com

        // However, looking at the Wizard code:
        // Input placeholder is "tuempresa", and next to it is ".com / .co".
        // The value stored is just "tuempresa".
        // So we should check "tuempresa.com".

        // WAIT: The user might want .co or others. The current UI just shows ".com / .co" as static text.
        // Let's check .com by default as it is the most common.
        // Or better yet, we can check both? For now let's check .com as primary.

        // Let's modify this to accept the full domain constructed in the client, 
        // OR construct it here.
        // Given the use case, let's check `.com` which is the standard.
        // If the user typed "example.com" explicitly, use that.

        // Actually to be safe, if no dot, append .com
        return await performCheck(cleanDomain + '.com');
    }

    return await performCheck(cleanDomain);
}

async function performCheck(domain: string) {
    try {
        // Using rdap.org which redirects to the correct registrar's RDAP server
        const response = await fetch(`https://rdap.org/domain/${domain}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store' // Critical: Don't cache availability checks
        });

        if (response.status === 404) {
            // 404 means the domain was not found in the registry -> AVAILABLE
            return { available: true };
        } else if (response.ok) {
            // 200 means the domain was found -> TAKEN
            return { available: false };
        } else {
            // Rate limits or other errors
            console.error('RDAP Error:', response.status, response.statusText);
            // If we get rate limited (429), we might want to fail open or closed.
            // Fail open (say available) might be risky, fail closed (say error) is safer.
            return { available: false, error: 'No se pudo verificar.' };
        }
    } catch (error) {
        console.error('Domain Check Error:', error);
        return { available: false, error: 'Error de conexión.' };
    }
}
