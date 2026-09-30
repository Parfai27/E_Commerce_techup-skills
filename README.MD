# KLab TechUp Skills — Express.js + TypeScript API

A minimal REST API built with **Node.js**, **Express.js**, and **TypeScript**. It shows how to set up an Express server in TypeScript, run it with hot reload, and test its endpoints with Postman.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Testing with Postman](#testing-with-postman)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [TypeScript](https://www.typescriptlang.org/) | Static typing for JavaScript |
| [Express.js](https://expressjs.com/) | Web framework |
| [ts-node](https://typestrong.org/ts-node/) | Runs TypeScript directly without a separate build step |
| [Nodemon](https://nodemon.io/) | Restarts the server automatically on file changes |
| [Postman](https://www.postman.com/) | API testing |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Interactive OpenAPI documentation |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** (bundled with Node.js)
- **Postman** (optional, for manual API testing)

Verify your installation:

```bash
node --version
npm --version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd klab-techup-skills
```

### 2. Install dependencies

```bash
npm install
npm install -D typescript ts-node @types/node
```

### 3. Start the development server

```bash
npm run dev
```

On success, the console prints:

```text
Example app listening on port 1000
```

The API is now available at **http://localhost:1000**. Interactive docs are at **http://localhost:1000/api-docs**.

Nodemon watches the source files, so the server restarts automatically whenever you save a change in `src/`.

<details>
<summary><strong>Setting up the project from scratch</strong></summary>

```bash
mkdir klab-techup-skills && cd klab-techup-skills
npm init -y
npx tsc --init                      # run once to generate tsconfig.json
npm install express
npm install -D typescript ts-node nodemon @types/node @types/express
mkdir src
```

Create `src/server.ts` (on Windows PowerShell: `New-Item src/server.ts`), then add the `dev` script to `package.json`:

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/server.ts"
}
```

</details>

---

## Project Structure

```text
klab-techup-skills/
├── src/
│   ├── docs/
│   │   └── openapi.ts   # OpenAPI document served by Swagger UI
│   ├── controller/
│   ├── model/
│   ├── router/
│   └── server.ts        # Application entry point
├── package.json         # Project metadata and scripts
├── package-lock.json    # Locked dependency versions
├── tsconfig.json        # TypeScript compiler configuration
└── README.md
```

### Entry point — `src/server.ts`

```ts
import express from "express";

const app = express();
const port = 1000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server with Nodemon and ts-node |
| `npx tsc` | Compiles TypeScript to JavaScript according to `tsconfig.json` |

---

## API Reference

Open **http://localhost:1000/api-docs** while the server is running. The raw OpenAPI document is at **http://localhost:1000/api-docs.json**.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Welcome message |
| `GET` | `/api/products` | List products |
| `GET` | `/api/products/{id}` | Get one product |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |

### `GET /`

Returns a welcome message.

| Property | Value |
| --- | --- |
| URL | `http://localhost:1000/` |
| Method | `GET` |
| Headers | None required |
| Body | None |
| Success status | `200 OK` |

**Example request**

```bash
curl http://localhost:1000/
```

**Example response**

```text
Hello World!
```

---

## Testing with Postman

1. Start the server with `npm run dev`.
2. In Postman, choose **Import** and select `postman/KLab-TechUp-Skills.postman_collection.json`.
3. Open the collection and click **Run**. Leave `baseUrl` as `http://localhost:1000`.

The runner checks the welcome route and the product CRUD flow: list, get, missing product, validation error, create, update, and delete. Each request includes the expected status and body.

To send one request by hand, use **GET** `http://localhost:1000/` and expect `200 OK` with `Hello World!`.

---

## Troubleshooting

<details>
<summary><strong>Port 1000 is already in use</strong></summary>

Change the port in `src/server.ts`:

```ts
const port = 1001;
```

Then use `http://localhost:1001/`.

</details>

<details>
<summary><strong><code>npm run dev</code> fails</strong></summary>

Make sure the development dependencies are installed:

```bash
npm install -D typescript ts-node nodemon @types/node @types/express
```

</details>

<details>
<summary><strong>TypeScript configuration errors</strong></summary>

Confirm that `tsconfig.json` exists in the project root. If it is missing, generate it:

```bash
npx tsc --init
```

</details>

---

## Roadmap

This project is a learning foundation for backend development. Planned improvements:

- [ ] Additional API routes
- [ ] Controller and service layers
- [ ] Custom middleware
- [ ] Environment variable configuration
- [ ] Database integration
- [ ] Request validation
- [ ] Centralized error handling
- [ ] Automated tests
- [x] API documentation (Swagger UI at `/api-docs`)

---

