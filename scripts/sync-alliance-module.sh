#!/usr/bin/env bash
#
# Sincroniza el módulo Alliance (Webs) desde InZidium → Nexus + Alkubo.
#
# Filosofía: InZidium es la codebase canónica del módulo. Cuando tocás algo
# del módulo en InZidium, corrés este script para que Nexus y Alkubo queden
# 100% alineados. Cero divergencia entre los 3 estudios.
#
# USO:
#   bash scripts/sync-alliance-module.sh           # sync real
#   bash scripts/sync-alliance-module.sh --dry     # preview sin escribir
#   bash scripts/sync-alliance-module.sh --target Nexus    # solo Nexus
#
# Requisitos: cp, find (en Git Bash vienen por default).

set -euo pipefail

# ─── Config ─────────────────────────────────────────────────────────────────
SOURCE="C:/Users/aguir/OneDrive/Escritorio/InZidium"
ALL_TARGETS=(
  "C:/Users/aguir/OneDrive/Escritorio/Nexus"
  "C:/Users/aguir/OneDrive/Escritorio/Alkubo"
)

# Paths del módulo Alliance (relativos al root del proyecto).
# Folders terminan en / para distinguirlos de archivos sueltos.
PATHS=(
  # Backend — toda la lógica del módulo
  "lib/alliance/"

  # Hooks alliance-specific (los que importan de @/lib/alliance/*)
  "hooks/use-patch-proyecto.ts"
  "hooks/use-realtime-refresh.ts"
  "hooks/use-session-eviction.ts"

  # Frontend — admin Webs (dashboard / clientes / proyectos / administradores)
  "app/admin/(webs)/"

  # Frontend — portal cliente público de la alianza
  "app/portal/"

  # Componentes del portal cliente
  "components/clientes/"
)

# ─── Parse args ─────────────────────────────────────────────────────────────
DRY=0
TARGETS=("${ALL_TARGETS[@]}")

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry|--dry-run)
      DRY=1
      shift
      ;;
    --target)
      shift
      TARGETS=("C:/Users/aguir/OneDrive/Escritorio/$1")
      shift
      ;;
    *)
      echo "Argumento desconocido: $1" >&2
      exit 1
      ;;
  esac
done

# ─── Sanity checks ──────────────────────────────────────────────────────────
if [[ ! -d "$SOURCE/lib/alliance" ]]; then
  echo "ERROR: No se encuentra $SOURCE/lib/alliance — ¿estás corriendo desde el root correcto?" >&2
  exit 1
fi

# ─── Helpers ────────────────────────────────────────────────────────────────
sync_path() {
  local src="$1"
  local dst="$2"

  if [[ ! -e "$src" ]]; then
    echo "  ⚠ SKIP — no existe en source"
    return
  fi

  if [[ $DRY -eq 1 ]]; then
    echo "  [dry] would sync"
    return
  fi

  if [[ -d "$src" ]]; then
    # Folder: borrar destino y copiar entero (mirror exacto)
    rm -rf "$dst"
    mkdir -p "$(dirname "$dst")"
    cp -r "$src" "$dst"
  else
    # File: simplemente sobrescribir
    mkdir -p "$(dirname "$dst")"
    cp "$src" "$dst"
  fi
}

# ─── Ejecución ──────────────────────────────────────────────────────────────
[[ $DRY -eq 1 ]] && echo "*** MODO DRY-RUN — nada se escribe ***" && echo

for target in "${TARGETS[@]}"; do
  if [[ ! -d "$target" ]]; then
    echo "  SKIP $target — proyecto no existe en disco"
    continue
  fi

  echo "═══ Sync → $target ═══"
  for p in "${PATHS[@]}"; do
    src="$SOURCE/$p"
    dst="$target/$p"
    # Quitar trailing slash para los paths comparables
    src="${src%/}"
    dst="${dst%/}"

    printf "  %s" "$p"
    sync_path "$src" "$dst"
    [[ $DRY -eq 0 ]] && echo "  ✓"
  done
  echo
done

echo "═══════════════════════════════════════════"
if [[ $DRY -eq 1 ]]; then
  echo "DRY-RUN OK. Para aplicar: corré sin --dry."
else
  echo "Sync completo."
  echo
  echo "Próximos pasos:"
  echo "  1. cd a cada proyecto target y correr: npx tsc --noEmit"
  echo "  2. Si todo verde, hacer cg para deploy"
fi