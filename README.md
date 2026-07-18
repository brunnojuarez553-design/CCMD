# Clean Clean Mobile Detail — Sitio web

Este repo tiene todo lo necesario para subir el sitio a GitHub y desplegarlo en Vercel,
con la API key de Groq guardada de forma segura (nunca queda expuesta en el navegador
ni en el código subido a GitHub).

## Estructura

```
.
├── index.html          → el sitio completo (frontend)
├── api/
│   ├── chat.js          → función serverless: asesor de chat (texto) vía Groq
│   └── vision.js        → función serverless: diagnóstico visual (imagen) vía Groq
├── package.json
├── .env.example          → ejemplo de variable de entorno (no subir el .env real)
└── .gitignore
```

El HTML llama a `/api/chat` y `/api/vision` (rutas relativas, dentro del mismo dominio).
Esas dos funciones corren en el servidor de Vercel, agarran la `GROQ_API_KEY` desde una
variable de entorno y ahí sí llaman a la API de Groq. La key nunca viaja al navegador del
usuario ni queda visible en el código fuente del sitio.

## 1. Subir el proyecto a GitHub

1. Creá un repositorio nuevo en GitHub (podés dejarlo privado o público, no importa para
   el funcionamiento).
2. Desde esta carpeta, en tu terminal:
   ```bash
   git init
   git add .
   git commit -m "Sitio Clean Clean Mobile Detail"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
   (Reemplazá `TU_USUARIO/TU_REPO` por los datos de tu repo.)

> El archivo `.gitignore` ya está configurado para que nunca subas por error un `.env`
> con tu API key real.

## 2. Conseguir tu API key de Groq

1. Entrá a [console.groq.com/keys](https://console.groq.com/keys) y creá una cuenta si no
   tenés una.
2. Generá una nueva API key y copiala (empieza con `gsk_...`). Guardala en un lugar seguro,
   Groq solo te la muestra una vez.

## 3. Desplegar en Vercel

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión (podés usar tu cuenta de GitHub).
2. Hacé clic en **"Add New..." → "Project"**.
3. Elegí el repositorio de GitHub que acabás de subir e importalo.
4. Vercel va a detectar automáticamente que es un proyecto estático con funciones en `/api`
   — no hace falta tocar nada en "Build & Output Settings".
5. **Antes de darle a "Deploy"**, abrí la sección **"Environment Variables"** en esa misma
   pantalla (o después en **Settings → Environment Variables** del proyecto) y agregá:
   - **Name:** `GROQ_API_KEY`
   - **Value:** la key que copiaste de Groq (`gsk_...`)
   - **Environment:** marcá Production, Preview y Development.
6. Hacé clic en **Deploy**.

En un par de minutos vas a tener tu URL pública (algo como
`https://tu-proyecto.vercel.app`). El asesor de chat y el diagnóstico visual ya van a
funcionar, llamando a Groq por detrás sin exponer la key.

## 4. Dominio propio (opcional)

Desde **Settings → Domains** en el proyecto de Vercel podés conectar tu dominio propio
(por ejemplo `cleancleanmobiledetail.com`) siguiendo las instrucciones de DNS que te da
Vercel ahí mismo.

## 5. Actualizar el sitio más adelante

Cualquier cambio que quieras hacer: editás `index.html` (o los archivos de `api/`),
hacés commit y push a GitHub:

```bash
git add .
git commit -m "Actualización del sitio"
git push
```

Vercel vuelve a desplegar automáticamente cada vez que hacés push a la rama `main`.

## Notas sobre los modelos de Groq usados

- **Chat de texto** (`api/chat.js`): `llama-3.3-70b-versatile`.
- **Diagnóstico visual** (`api/vision.js`): `meta-llama/llama-4-scout-17b-16e-instruct`
  (modelo con capacidad de leer imágenes).

Si en el futuro Groq cambia o retira alguno de estos modelos, podés reemplazar el valor
del campo `model` en el archivo correspondiente dentro de `api/` por el nuevo nombre de
modelo que indique la [documentación de Groq](https://console.groq.com/docs/models).
