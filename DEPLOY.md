# Deploy checklist

Variables de entorno requeridas por tenant. Verificar **en cada host** (Vercel,
Cloudflare, etc.) antes de activar clientes. La ausencia de cualquiera rompe
funcionalidad crítica (auth, realtime, pagos, notificaciones).

## Compartidas entre todos los tenants (mismo Supabase)

```
SUPABASE_URL=https://zlzzzxihrvrjwsgtyohp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<jwt>
NEXT_PUBLIC_SUPABASE_URL=https://zlzzzxihrvrjwsgtyohp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<jwt anon>
DATABASE_URL=<postgres url>
```

## Específicas por tenant

| Var | Propósito | Falta → qué pasa |
|---|---|---|
| `ESTUDIO_ID` | UUID del estudio para filtrar todas las queries | Server crashea al arrancar |
| `NEXT_PUBLIC_ESTUDIO_ID` | Mismo UUID pero expuesto al client para filtro realtime | Suscripciones realtime no filtran por tenant — el admin recibe eventos de otros estudios |
| `NEXTAUTH_SECRET` | Firma de JWT de sesiones admin | Login admin rompe |
| `AUTH_SECRET` | Fallback para NextAuth v5 (mismo valor que NEXTAUTH_SECRET) | Depende del host |

## Valores por tenant

### Alkubo (deploy en alkubosoluciones.com)
```
ESTUDIO_ID=41aecd42-605f-4f1d-887a-20d3f54d3431
NEXT_PUBLIC_ESTUDIO_ID=41aecd42-605f-4f1d-887a-20d3f54d3431
```

### Nexus (deploy en nexustoprint.com)
```
ESTUDIO_ID=38b171a1-7241-4410-99fe-0f3499e100fe
NEXT_PUBLIC_ESTUDIO_ID=38b171a1-7241-4410-99fe-0f3499e100fe
```

## Verificación rápida post-deploy

1. **Admin login:** entrar a `/admin/login` con credenciales válidas. Si redirige a login: `NEXTAUTH_SECRET` mal.
2. **Portal cliente:** entrar con una cédula registrada. Si tira error genérico: revisar `SUPABASE_*` y `ESTUDIO_ID`.
3. **Realtime admin ↔ cliente:** abrir un proyecto en admin + cliente en paralelo. Cambiar algo en el cliente → debería aparecer en el admin sin refresh. Si no: falta `NEXT_PUBLIC_ESTUDIO_ID`.
4. **Notificaciones:** crear un cliente desde admin. Debería llegar push a la app InZidium. Si no: ver logs de la edge function en Supabase dashboard.

## Edge function secrets (Supabase — no en Vercel)

Ya configurados (verificado vía `supabase secrets list`):
```
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FIREBASE_SERVICE_ACCOUNT
```

## Servicios de Supabase requeridos

- `pg_net` — habilitado ✓
- `pg_cron` — habilitado ✓ (job `cleanup-dead-fcm-tokens` semanal)
- Extensiones: ver `scripts/inspect-webhooks.mjs` para inspeccionar

## Cron jobs activos

| Name | Schedule | Purpose |
|---|---|---|
| `cleanup-dead-fcm-tokens` | `0 3 * * 0` (domingo 03:00 UTC) | Borra tokens FCM inválidos de `owner_devices` |

## Triggers de Supabase activos

```
notify_owner_chat        (AFTER INSERT on chat)       → notify-owner (legacy)
notify_owner_clientes    (AFTER INSERT on clientes)   → notify-owner (legacy)
notify_owner_proyectos   (AFTER INSERT on proyectos)  → notify-owner (legacy)
notify_event_clientes_deleted  (AFTER DELETE on clientes)  → notify-event
notify_event_proyectos_deleted (AFTER DELETE on proyectos) → notify-event
```

Los eventos de `onboarding.started`, `onboarding.completed` y
`pago.comprobante_subido` se disparan desde server actions de Next.js, no por
triggers de DB.

## Edge functions desplegadas

- `notify-owner` — INSERTs (cliente/proyecto/chat) — legacy, no tengo source
- `notify-event` — DELETEs + eventos custom — source en `supabase/functions/notify-event/`

## Rate limiting actual

- In-memory por IP en `lib/rate-limit.ts`
- `getProyectoByCedula` (consumido por `loginCliente`): 10 intentos / 60s
- **NO persiste entre instancias ni reinicios** — suficiente para MVP;
  upgrade a Upstash Redis cuando escale.

## Próximos pasos (no bloqueantes)

- [ ] Sentry / error tracking en los 3 proyectos
- [ ] Upgrade rate limit a Upstash Redis
- [ ] Consolidar `notify-owner` legacy dentro de `notify-event` (rehacer el source y reemplazar triggers)
