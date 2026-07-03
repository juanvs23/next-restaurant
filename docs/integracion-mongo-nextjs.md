# Integración MongoDB 7 con Proyecto Next.js 16

> Generado: 28 Jun 2026 — Servidor: `coltmandev.dev` (62.171.164.5)

---

## 1. Datos de Conexión

| Parámetro | Valor |
|---|---|
| **Host** | `mongo.coltmandev.dev` |
| **Puerto** | `27017` |
| **Usuario** | `admin` |
| **Password** | `Coltm4nM0ng0_2026` |
| **Auth DB** | `admin` |
| **Base de datos** | (a definir, ej: `midb`) |

**URI de conexión:**
```
mongodb://admin:Coltm4nM0ng0_2026@mongo.coltmandev.dev:27017/midb?authSource=admin
```

### Cloudflare

- Subdominio: `mongo.coltmandev.dev`
- Proxy: **DNS only (gris)** — apunta directo a `62.171.164.5`
- No usar proxy naranja (Cloudflare no entiende protocolo MongoDB TCP)

---

## 2. Vercel — Configuración de Variables de Entorno

Ir a: **Project Settings → Environment Variables**

| Nombre | Valor |
|---|---|
| `MONGODB_URI` | `mongodb://admin:Coltm4nM0ng0_2026@mongo.coltmandev.dev:27017/midb?authSource=admin` |

Agregar para los entornos: **Production**, **Preview**, **Development**.

> ⚠️ No exponer esta URI en código fuente ni en `.env` del repositorio. Solo en Vercel Dashboard.

---

## 3. Código Necesario en Next.js

### 3.1. Instalar dependencia

```bash
npm install mongodb
# o
pnpm add mongodb
```

### 3.2. Archivo `lib/mongodb.ts`

Crear en la raíz del proyecto:

```typescript
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!

if (!uri) {
  throw new Error('Falta MONGODB_URI en variables de entorno')
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // En desarrollo: reusa la conexión (hot reload)
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción (Vercel): conexión por request
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
```

### 3.3. Uso en API Routes

```typescript
// app/api/usuarios/route.ts
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('midb') // mismo nombre que en la URI
    const usuarios = await db.collection('usuarios').find({}).toArray()
    return Response.json(usuarios)
  } catch (error) {
    return Response.json(
      { error: 'Error al conectar con MongoDB' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('midb')
    const data = await request.json()
    const result = await db.collection('usuarios').insertOne(data)
    return Response.json(result, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Error al crear registro' },
      { status: 500 }
    )
  }
}
```

### 3.4. Uso en Server Components (App Router)

```typescript
// app/usuarios/page.tsx
import clientPromise from '@/lib/mongodb'

export default async function UsuariosPage() {
  const client = await clientPromise
  const db = client.db('midb')
  const usuarios = await db
    .collection('usuarios')
    .find({})
    .project({ _id: 1, nombre: 1, email: 1 })
    .toArray()

  return (
    <ul>
      {usuarios.map(u => (
        <li key={u._id.toString()}>{u.nombre} - {u.email}</li>
      ))}
    </ul>
  )
}
```

---

## 4. `.env.local` para Desarrollo Local

```bash
# .env.local (NO subir a git)
MONGODB_URI=mongodb://admin:Coltm4nM0ng0_2026@mongo.coltmandev.dev:27017/midb?authSource=admin
```

Agregar `.env.local` a `.gitignore` (ya viene por defecto en Next.js).

---

## 5. Recomendaciones de Seguridad

1. **Nunca** commitear credenciales al repositorio
2. Usar variables de entorno de Vercel (ya cifradas)
3. Para producción crítica, idealmente:
   - Crear un usuario MongoDB **dedicado** por proyecto (solo lectura/escritura a su DB)
   - No usar el usuario `admin` global
4. La contraseña actual (`Coltm4nM0ng0_2026`) es fuerte, pero rotarla periódicamente

---

## 6. Troubleshooting

| Problema | Causa | Solución |
|---|---|---|
| `MongoNetworkError` | Puerto 27017 bloqueado por firewall | Verificar que Cloudflare está en DNS-only (gris) |
| `Authentication failed` | Credenciales incorrectas | Verificar user/password en la URI |
| `getaddrinfo ENOTFOUND` | DNS no resuelve | Verificar registro DNS en Cloudflare |
| `Connection timeout` | Servidor no responde | Verificar que el contenedor está corriendo |
| `MongoServerSelectionError` | MongoDB no accesible | Ejecutar `docker ps \| grep mongo` en el servidor |

---

## 7. Referencia

- **Servidor:** `coltmandev.dev` (62.171.164.5)
- **Gestor:** Dokploy en `dockploy.coltmandev.dev`
- **Contenedor:** `mongo-prod` (mongo:7)
- **Volumen persistente:** `mongo-data`
- **Driver MongoDB:** https://www.mongodb.com/docs/drivers/node/current/
