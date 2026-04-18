# Setup de un nuevo estudio aliado

Guía canónica para fichar un estudio nuevo (ej: agregar "Nexus" o "Alkubo" desde cero). El codebase madre es **este repo (InZidium)** — se clona de acá y se rebrandéa.

**Tiempo total:** ~2h incluyendo rebrand del código y primer deploy.

**DB compartida:** un solo Supabase para todos los estudios. No se crea proyecto nuevo. Cada deploy filtra por `ESTUDIO_ID` en sus queries.

---

## Visión 30 segundos

```
1. INSERT en tabla estudios  → obtener UUID
2. Crear primer admin        → bcrypt hash en tabla administradores
3. Clonar InZidium           → este repo como base
4. .env.local del clone      → SUPABASE_* + ESTUDIO_ID + PLANTILLA_*
5. Reemplazar assets         → logo, OG, icons, favicon
6. Editar lib/config.ts      → objeto STUDIO con datos del nuevo estudio
7. Rebrand del código        → Claude + REBRAND_MAP.md
8. Deploy en Vercel          → env vars + dominio
```

---

## Antes de arrancar

Tener a mano:

- Nombre, slug, dominio del estudio nuevo (ej: "Nexus", "nexus", "nexustoprint.com").
- Credenciales del primer admin (nombre, username, password).
- Assets listos: logo.png, image-og.jpg, favicon.ico, apple-icon.png, icon.png. Ver [memory/favicon_pattern.md](../../.claude/memory/favicon_pattern.md) global para el patrón de 2 favicons (tab + Google).
- El `PLANTILLA_REVALIDATE_SECRET` de la Plantilla Web (va a ser el mismo que `REVALIDATE_SECRET` del proyecto Vercel de la Plantilla — pedírselo al owner o leerlo del admin actual).

---

## Paso 1 — Insertar el estudio en Supabase

Vía **Management API** (recomendado — más rápido que el Dashboard):

```bash
TOKEN=<tu TOKEN_SUPABASE del .env.local>
REF=zlzzzxihrvrjwsgtyohp

curl -X POST "https://api.supabase.com/v1/projects/$REF/database/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"INSERT INTO estudios (nombre, slug, dominio, activo) VALUES ('"'"'Nexus'"'"', '"'"'nexus'"'"', '"'"'nexustoprint.com'"'"', true) RETURNING id;"}'
```

Guardar el UUID devuelto — es el `ESTUDIO_ID` de este estudio.

> El `slug` debe ser único (UNIQUE constraint). Si ya existe, el INSERT falla antes de crear nada.

---

## Paso 2 — Crear el primer admin

Después del paso 3 (clone + .env.local listo), correr desde el clone:

```bash
npx tsx scripts/create-admin.ts \
  --estudio-id <UUID_DEL_PASO_1> \
  --nombre "Maicol Toro" \
  --username InZidium \
  --password "<password_segura>"
```

El script valida que el estudio exista y que el `username` no esté duplicado. El password se hashea con bcryptjs (saltRounds=10).

> Convención: el primer admin siempre es **InZidium** con tu password estándar — así podés loguearte en cualquier admin con las mismas credenciales. El estudio puede crear admins adicionales propios después.

---

## Paso 3 — Clonar InZidium y preparar

```bash
git clone <url-InZidium> nexus
cd nexus
```

Crear `.env.local` con:

```env
# Supabase compartido (mismas credenciales que los otros estudios)
SUPABASE_URL=https://zlzzzxihrvrjwsgtyohp.supabase.co
SUPABASE_ANON_KEY=<misma que los demás>
SUPABASE_SERVICE_ROLE_KEY=<misma que los demás>
NEXT_PUBLIC_SUPABASE_URL=https://zlzzzxihrvrjwsgtyohp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<misma que los demás>
DATABASE_URL=<misma que los demás>
DB_PROVIDER=drizzle
TOKEN_SUPABASE=<mismo PAT>

# Propio del estudio nuevo
ESTUDIO_ID=<UUID_DEL_PASO_1>
NEXT_PUBLIC_ESTUDIO_ID=<mismo UUID>
NEXTAUTH_SECRET=<openssl rand -hex 32>
AUTH_SECRET=<mismo que NEXTAUTH_SECRET>
NEXTAUTH_URL=https://nexustoprint.com

# Integración con Plantilla Web
PLANTILLA_URL=https://www.maicoltoro.site
PLANTILLA_REVALIDATE_SECRET=<mismo secret que en la Plantilla>
PLANTILLA_WILDCARD_DOMAIN=maicoltoro.site
```

> `NEXTAUTH_SECRET` debe ser **distinto por deploy** para que invalidar la sesión en un estudio no tumbe a los otros. Generar con `openssl rand -hex 32`.

---

## Paso 4 — Reemplazar assets

En `public/` del clone, reemplazar:

| Archivo | Dimensión | Nota |
|---|---|---|
| `images/logo.png` | ~200×200 | fondo transparente |
| `image-og.jpg` | 1200×630 | branded con logo grande |
| `apple-icon.png` | 180×180 | con padding ~6% |
| `icon.png` | 512×512 | 2 versiones: `icon.png` (tab, 0% padding) y `icon-branded.png` (Google, 6% padding). Ver [memory/favicon_pattern.md](../../.claude/memory/favicon_pattern.md). |
| `icons/favicon.ico` | 32×32 | tab favicon |

**No tocar:** `images/logo-inzidium.webp` — es el logo del partner InZidium, igual para todos los estudios.

Script automatizable: `scripts/generate-icons.mjs` toma el logo fuente y genera las variantes.

---

## Paso 5 — Editar `lib/config.ts` (objeto STUDIO)

Archivo `lib/config.ts` contiene todos los datos estructurados del estudio:

```ts
export const STUDIO = {
  nombre: "Nexus",
  slug: "nexus",
  dominio: "nexustoprint.com",
  email: "contacto@nexustoprint.com",
  telefono: "+57 ...",
  whatsapp: "+57 ...",
  direccion: "...",
  ciudad: "Bogotá",
  instagram: "https://instagram.com/...",
  facebook: "https://facebook.com/...",
  linkedin: "...",
  nit: "...",
  representante: "...",
  moneda: "COP",
  simbolo: "$",
  assets: {
    logoPath: "/images/logo.png",
    logoPartnerPath: "/images/logo-inzidium.webp",
    faviconPath: "/icons/favicon.ico",
    ogImagePath: "/image-og.jpg",
  },
  partner: {
    nombre: "InZidium",
    porcentaje: 0.8,             // InZidium recibe 80% de cada Plan Estándar
    username: "InZidium",
    mostrarAlianza: true,
  },
  tech: {
    /* campos opcionales */
  },
};
```

---

## Paso 6 — Rebrand del código

Hay strings hardcoded de "InZidium", colores primarios y copies por todo el repo. Ver [Alkubo/REBRAND_MAP.md](../Alkubo/REBRAND_MAP.md) por el patrón canónico (fue escrito para Alkubo pero el mapa aplica igual — son los mismos archivos en el mismo layout).

Pedirle a Claude en un chat nuevo:

> "Rebrandeá este repo InZidium a Nexus. Datos:
> nombre: 'Nexus', slug: 'nexus', dominio: 'nexustoprint.com', email: '...', telefono: '...', whatsapp: '...',
> instagram: '...', facebook: '...', ciudad: 'Bogotá', color primario: '#FFD700'.
> ESTUDIO_ID ya está en .env.local. Leé REBRAND_MAP.md en Alkubo y aplicá los cambios."

Claude edita los strings en los puntos catalogados. El diseño (paleta completa, tipografía, spacing) se ajusta a mano según la identidad visual del estudio.

---

## Paso 7 — Verificar local

```bash
npm install
npx tsc --noEmit        # debe pasar limpio
npm run dev             # localhost:3000
```

Checklist local:

- [ ] Landing pública carga con logo + colores nuevos.
- [ ] `/admin/login` — login con el admin creado en paso 2.
- [ ] Dashboard admin se ve sin errores de consola.
- [ ] Crear un cliente de prueba desde admin → recibir push en tu app Android (`notify_owner_clientes` trigger).
- [ ] Crear un proyecto de prueba → verificar que aparece URL preview `<slug>.maicoltoro.site` en el DeployPanel.
- [ ] Abrir la URL preview → debe mostrar "En construcción" con los colores del nuevo estudio.
- [ ] Borrar el cliente de prueba.

Query de sanity:

```sql
SELECT id, nombre, slug, dominio, activo FROM estudios ORDER BY created_at;
```

Debe listar los 3 estudios + el nuevo, todos `activo=true`.

---

## Paso 8 — Deploy en Vercel

```bash
npx vercel link          # asociar al project nuevo en Vercel
npx vercel env add ...   # añadir todas las env vars del .env.local
npx vercel --prod        # deploy a producción
```

> **Gotcha:** si usás `vercel env add` con stdin, usá `printf "valor"` **no `echo "valor"`**. `echo` añade `\n` al final y la env var queda corrupta.

Después del deploy inicial:

1. En Vercel → Settings → Domains → agregar `nexustoprint.com` y `www.nexustoprint.com`.
2. En el registrador del dominio, setear:
   - `@` (apex) → A `76.76.21.21`
   - `www` → CNAME `cname.vercel-dns.com`
3. Esperar propagación DNS (~15 min) + SSL automático.

---

## Paso 9 — Integración con Plantilla Web

La Plantilla Web **ya está desplegada** y no hay que tocarla. El estudio nuevo puede inmediatamente empezar a vender — cada cliente que cree tendrá su sitio en `<slug>.maicoltoro.site`.

Condición: las 3 env vars `PLANTILLA_*` deben estar correctas en el deploy Vercel del estudio nuevo (paso 3 + 8). Verificar con:

```bash
curl -X POST https://www.maicoltoro.site/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"<PLANTILLA_REVALIDATE_SECRET>","hostname":"ping.maicoltoro.site"}'
```

Debe devolver `{"ok":true,"revalidated":"ping.maicoltoro.site"}` o similar (404 está OK — significa que el secret match pero no hay proyecto con ese hostname).

Si devuelve 401, el secret está mal.

---

## Lo que NO hay que hacer

- **NO** crear un proyecto Supabase nuevo. Es un solo proyecto compartido por todos los estudios.
- **NO** correr `drizzle-kit push` ni migraciones desde el clone del nuevo estudio. Las migraciones son del proyecto canónico (InZidium). Correrlas desde otro deploy puede alterar el schema compartido.
- **NO** tocar las RLS policies (`anon_select_*`). Son necesarias para el realtime del browser.
- **NO** borrar ni modificar rows de otros estudios en la tabla `estudios`.
- **NO** reutilizar el mismo `NEXTAUTH_SECRET` entre estudios. Cada deploy debe tener el suyo.

---

## Referencias

- [DEPLOY.md](./DEPLOY.md) — env vars completas por tenant.
- [Alkubo/REBRAND_MAP.md](../Alkubo/REBRAND_MAP.md) — mapa de hardcodes para el rebrand.
- [Alkubo/AGENTS.md](../Alkubo/AGENTS.md) — referencia de arquitectura (igual en los 3 admins).
- [Plantilla Web ( Clientes )/SETUP_NUEVO_CLIENTE.md](../Plantilla%20Web%20%28%20Clientes%20%29/SETUP_NUEVO_CLIENTE.md) — una vez el estudio está vivo, cómo onboardear sus clientes finales.
