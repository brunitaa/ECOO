# ECOO

ECOO es una plataforma de sostenibilidad y fidelización digital construida para ofrecer una experiencia enterprise, moderna y coherente en todos los roles del ecosistema.

## Arquitectura

```
ECOO/
├── frontend/
│   ├── landing/
│   ├── admin/
│   ├── company/
│   ├── citizen/
│   └── shared/
│       ├── ui/
│       ├── components/
│       ├── layouts/
│       ├── navigation/
│       ├── hooks/
│       ├── services/
│       ├── analytics/
│       ├── auth/
│       ├── qr/
│       ├── eco-points/
│       ├── utils/
│       ├── types/
│       ├── config/
│       ├── constants/
│       ├── providers/
│       ├── store/
│       ├── theme/
│       ├── icons/
│       ├── charts/
│       ├── animations/
│       └── design-system/
├── backend/
├── docs/
├── .env
├── .env.example
├── .env.local
├── .env.production
├── package.json
└── README.md
```

## Objetivo del repositorio

- Unificar todos los frontends en una sola plataforma moderna
- Centralizar el design system y componentes compartidos
- Mantener backend desacoplado y listo para producción
- Mejorar la escalabilidad y consistencia visual

## Frontend

El frontend ahora está organizado en un único árbol:

- `frontend/landing` — portal de entrada, onboarding y login
- `frontend/admin` — panel administrativo y supervisión
- `frontend/company` — experiencia empresarial, caja y KPIs
- `frontend/citizen` — experiencia del ciudadano, QR y recompensas
- `frontend/shared` — UI, componentes, layouts, providers, hooks y utilidades compartidas

### Design system global

`frontend/shared/ui` actúa como el paquete `@ecoo/ui` compartido en todo el frontend. Contiene:

- tokens de color y tipografía
- componentes reutilizables premium
- iconografía central
- animaciones y transiciones
- charts y visualizaciones
- estilos base y patrones de layout

## Backend

`backend/` mantiene la lógica de servidor separada:

- autenticación JWT
- Prisma + PostgreSQL
- generación y validación de QR
- eco-points y analítica
- middleware de seguridad
- configuraciones de entorno

## Variables de entorno

Haz copia de `.env.example` y completa las variables adecuadas:

```bash
cp .env.example .env
```

### Variables esperadas

```env
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
CLOUDINARY_URL=
REDIS_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
QR_SECRET=
```

## Comandos raíz

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Este comando arranca todos los workspaces de frontend y el backend en paralelo.

### Build

```bash
npm run build
```

### Producción

```bash
npm run start
```

## Comandos frontend

```bash
cd frontend
npm run dev
npm run build
```

## Comandos backend

```bash
cd backend
npm install
npm run dev
```

## Deployment

La estructura está preparada para despliegue en:

- Vercel
- Railway
- Render
- VPS
- Docker

## Deploy en Render

Este repositorio puede desplegarse en Render con una arquitectura de servicios separados:

1. Backend Web Service
   - Root Directory: `backend`
   - Build Command: `cd ../ && npm install && npm --workspace backend run build`
   - Start Command: `npm start`
   - Environment: selecciona `Node 20+`
   - Static Publish Directory: no aplica (es un Web Service)

2. Frontend Static Site para `landing`
   - Root Directory: `/`
   - Build Command: `npm install && npm --workspace frontend/landing run build`
   - Publish Directory: `frontend/landing/dist`
   - Environment: `Node 20+`

3. Frontend Static Site para `admin`
   - Root Directory: `/`
   - Build Command: `npm install && npm --workspace frontend/admin run build`
   - Publish Directory: `frontend/admin/dist`
   - Environment: `Node 20+`

4. Frontend Static Site para `company`
   - Root Directory: `/`
   - Build Command: `npm install && npm --workspace frontend/company run build`
   - Publish Directory: `frontend/company/dist`
   - Environment: `Node 20+`

5. Frontend Static Site para `citizen`
   - Root Directory: `/`
   - Build Command: `npm install && npm --workspace frontend/citizen run build`
   - Publish Directory: `frontend/citizen/dist`
   - Environment: `Node 20+`

### Variables de entorno en Render

Para el backend:

- `DATABASE_URL`
- `JWT_SECRET`
- `CLOUDINARY_URL`
- `REDIS_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `QR_SECRET`
- `NEXT_PUBLIC_API_URL` (URL pública del servicio backend en Render)
- `NEXT_PUBLIC_APP_URL` (URL pública del frontend que corresponda)

Para cada frontend estático, establece también:

- `VITE_API_URL` o `NEXT_PUBLIC_API_URL` según el código que uses para conectar al backend.

### Note

Render no usa la carpeta `frontend/shared/ui` como una app independiente; las apps frontales la consumen como workspace local. Por eso cada sitio estático debe ejecutar `npm install` desde la raíz y luego construir la app específica.

## Buenas prácticas

- mantener toda la UI compartida en `frontend/shared`
- evitar componentes duplicados entre apps
- no mezclar lógica frontend dentro de `backend/`
- no mezclar lógica backend dentro de `frontend/`
- usar variables de entorno para URLs y secretos

## Estructura recomendada de frontend/shared

- `components/` — UI atómica y componentes reutilizables
- `layouts/` — estructuras de páginas comunes
- `navigation/` — menús, barras y rutas
- `providers/` — contextos y estados globales
- `hooks/` — lógica reusable de React
- `services/` — llamadas API y adaptadores
- `theme/` — tokens y estilos globales
- `types/` — tipos TypeScript compartidos
