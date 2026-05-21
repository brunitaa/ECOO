#!/bin/sh
set -e

echo ">> Sincronizando esquema Prisma con PostgreSQL..."
npx prisma db push

echo ">> Regenerando cliente Prisma..."
npx prisma generate

echo ">> Cargando datos de demostración..."
npx prisma db seed

echo ">> API Ecoo lista en puerto ${PORT:-3001}"
exec node src/index.js
