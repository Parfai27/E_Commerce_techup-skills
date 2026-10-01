# KLab TechUp Skills — Express.js + TypeScript API

A REST API built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**. Products are stored in MongoDB. Account registration and login are in place and return a JWT. Product routes are still public; authentication middleware is not added yet.

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
| [MongoDB](https://www.mongodb.com/) | Persistent product and user storage |
| [Mongoose](https://mongoosejs.com/) | MongoDB object modeling |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing for registration and login |
| [JSON Web Token](https://jwt.io/) | Login token returned by `POST /api/auth/login` |
| [Postman](https://www.postman.com/) | API testing |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Interactive OpenAPI documentation |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** (bundled with Node.js)
- **MongoDB** running locally
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

### 3. Create a `.env` file

```env
PORT=1000
MONGO_URI=mongodb://localhost:27017/E_Commerce
JWT_SECRET=replace-with-a-long-random-string
```

`.env` is listed in `.gitignore` and is not committed.

### 4. Start the development server

```bash
npm run dev
```

On success, the console prints:

```text
Server running on port 1000
MongoDB connected successfully
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
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   ├── controller/
│   │   ├── auth.controller.ts    # Register and login
│   │   └── product.controller.ts
│   ├── docs/
│   │   └── openapi.ts            # OpenAPI document served by Swagger UI
│   ├── model/
│   │   ├── product.model.ts
│   │   └── user.model.ts
│   ├── router/
│   │   ├── auth.router.ts
│   │   └── product.router.ts
│   └── server.ts                 # Application entry point
├── .env                          # Local only: PORT, MONGO_URI, JWT_SECRET
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

`src/middleware/` is not part of the project yet. Product routes do not check a token.

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
| `POST` | `/api/auth/register` | Create an account. Password is stored as a bcrypt hash. |
| `POST` | `/api/auth/login` | Check the password and return a JWT that expires in 1 day. |
| `GET` | `/api/products` | List products. Public for now. |
| `GET` | `/api/products/{id}` | Get one product. Public for now. |
| `POST` | `/api/products` | Create a product. Public for now. |
| `PUT` | `/api/products/{id}` | Update a product. Public for now. |
| `DELETE` | `/api/products/{id}` | Delete a product. Public for now. |

### `POST /api/auth/register`

| Property | Value |
| --- | --- |
| URL | `http://localhost:1000/api/auth/register` |
| Method | `POST` |
| Body | `{ "name", "email", "password" }` |
| Success status | `201 Created` |

The response includes `id`, `name`, and `email`. It does not include the password.

### `POST /api/auth/login`

| Property | Value |
| --- | --- |
| URL | `http://localhost:1000/api/auth/login` |
| Method | `POST` |
| Body | `{ "email", "password" }` |
| Success status | `200 OK` |

The response includes `token` plus `id`, `name`, and `email`. Sending that token on product requests is not required yet.

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

- [x] Database integration (MongoDB at `mongodb://localhost:27017/E_Commerce`)
- [x] Environment variables for `PORT`, `MONGO_URI`, and `JWT_SECRET`
- [x] User registration and login (`POST /api/auth/register`, `POST /api/auth/login`)
- [ ] Authentication middleware
- [ ] Protect product routes with the JWT
- [ ] Additional API routes
- [ ] Controller and service layers
- [ ] Request validation
- [ ] Centralized error handling
- [ ] Automated tests
- [x] API documentation (Swagger UI at `/api-docs`)

---

