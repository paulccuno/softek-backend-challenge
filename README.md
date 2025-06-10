# 🧠 Softek Backend Challenge – README

## 📋 Descripción

## Este proyecto es una API backend desarrollada con **NestJS** y diseñada para ejecutarse tanto localmente como en la nube mediante **Serverless Framework** en entornos de AWS. Integra autenticación, base de datos, validaciones, pruebas y documentación automática con Swagger.

### 🏗️ Tecnologías Utilizadas

- **NestJS v11** – Framework principal.
- **TypeScript**
- **Serverless Framework**
- **AWS Lambda** (a través de `@codegenie/serverless-express`)
- **MySQL** (soportado por `mysql2`)
<!-- - **Prisma ORM** y **TypeORM** (ambos definidos, aunque se debe verificar cuál está en uso efectivo). -->
- **JWT + Passport** – Autenticación.
- **Swagger** – Documentación de la API.
<!-- - **Redis** – Soporte de caché (`ioredis`, `cache-manager`). -->
- **Jest** – Testing unitario y de integración.
- **Prettier + ESLint** – Estilo y calidad de código.

---

### ⚙️ Scripts Disponibles

| Script                  | Descripción                            |
| ----------------------- | -------------------------------------- |
| `npm start`             | Inicia la app en modo producción       |
| `npm run start:dev`     | Modo desarrollo con watch              |
| `npm run build`         | Compila el proyecto                    |
| `npm run test`          | Ejecuta pruebas unitarias              |
| `npm run test:e2e`      | Ejecuta pruebas end-to-end             |
| `npm run prisma:*`      | Comandos relacionados a Prisma         |
| `npm run migration:*`   | Comandos relacionados a TypeORM        |
| `npm run deploy:*`      | Despliegue con Serverless              |
| `npm run remove:*`      | Elimina el stack de AWS                |
| `npm run start:offline` | Ejecuta en modo offline con Serverless |

---

### 🧪 Pruebas

- Configuradas con **Jest**.
- Soporta pruebas unitarias, coverage y e2e (`test/jest-e2e.json`).
- Instrucciones:

  ```bash
  npm run test
  npm run test:e2e
  ```

---

### 🛡️ Seguridad y Buenas Prácticas

- **Validaciones:** `class-validator` y `Joi`.
- **Autenticación:** `JWT` con `Passport`.
- **Ambientes:** `.env`, `.env.development`, `.env.production`, `.env.template`.
- **Formato:** `Prettier` + `ESLint`.

---

### 🐳 Docker

Se incluye `docker-compose.yml` y `Dockerfile` para facilitar la ejecución local.

```bash
docker-compose up --build
```

---

### ☁️ Despliegue Serverless

- Configurado para entornos **development** y **production**.
- Despliegue:

  ```bash
  npm run deploy:dev
  npm run deploy:prod
  ```

- Modo offline:

  ```bash
  npm run start:offline
  ```

---

### 📂 Estructura del Proyecto (parcial)

```
softek-backend-challenge/
├── src/
│   ├── application/
│   ├── domain/
│   ├── infraestructure/
│   ├── main.ts
├── .env.*
├── docker-compose.yml
├── serverless.yml
├── package.json
├── tsconfig.json
```

> Sigue una arquitectura **Hexagonal** / **Clean Architecture** basada en capas: `domain`, `application`, `infraestructure`.

---

### 📄 Documentación Swagger

Una vez en ejecución, accede a:

```
http://localhost:{PORT}/docs
```

---

### 📦 Instalación y Ejecución Local

```bash
npm install
cp .env.template .env.local
# Modifica .env si es necesario
npm run start:dev
```
