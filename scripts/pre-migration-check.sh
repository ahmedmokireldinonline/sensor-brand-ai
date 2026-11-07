#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_FILE="$ROOT_DIR/scripts/sql/pre-migration-check.sql"
BACKUP_DIR=""

usage() {
  cat <<'USAGE'
Usage:
  DATABASE_URL='postgresql://...' ./scripts/pre-migration-check.sh [--backup-dir DIR]

Options:
  --backup-dir DIR  Write a schema-only pg_dump before the read-only checks.
                    The directory must already be outside the repository.

Environment:
  DATABASE_URL      PostgreSQL connection string for the target Supabase project.

The check is read-only unless --backup-dir is provided; the backup itself also
only reads the database. This script never runs a migration or changes data.
USAGE
}

while (($#)); do
  case "$1" in
    --backup-dir)
      [[ $# -ge 2 ]] || { echo "ERROR: --backup-dir requires a directory" >&2; exit 2; }
      BACKUP_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set. No database connection was attempted." >&2
  exit 2
fi

if [[ "$DATABASE_URL" == *"supabase.com/dashboard"* || "$DATABASE_URL" == http://* || "$DATABASE_URL" == https://* ]]; then
  echo "ERROR: DATABASE_URL must be a PostgreSQL connection string, not a dashboard/API URL." >&2
  exit 2
fi

command -v psql >/dev/null 2>&1 || { echo "ERROR: psql is required but was not found." >&2; exit 2; }
[[ -f "$SQL_FILE" ]] || { echo "ERROR: missing SQL check file: $SQL_FILE" >&2; exit 2; }

if [[ -n "$BACKUP_DIR" ]]; then
  mkdir -p "$BACKUP_DIR"
  case "$BACKUP_DIR" in
    "$ROOT_DIR"|"$ROOT_DIR"/*)
      echo "ERROR: backup directory must not be inside the repository." >&2
      exit 2
      ;;
  esac
  backup_file="$BACKUP_DIR/sensor-brand-ai-schema-before-0004-$(date -u +%Y%m%dT%H%M%SZ).sql"
  echo "Creating schema-only backup: $backup_file"
  pg_dump "$DATABASE_URL" --schema-only --no-owner --no-privileges --file "$backup_file"
  chmod 600 "$backup_file"
  echo "Backup created with mode 600."
fi

echo "Running read-only pre-migration checks against the configured PostgreSQL endpoint..."
psql "$DATABASE_URL" -X -v ON_ERROR_STOP=1 -f "$SQL_FILE"
echo "Pre-migration checks completed successfully. No migration was executed."
