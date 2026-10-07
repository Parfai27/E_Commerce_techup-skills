# KLab TechUp Skills — Express.js + TypeScript API

A REST API built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**. Products are stored in MongoDB, and their images are stored on Cloudinary. Register and login issue a JWT, and every product route requires that token. Password reset sends a one-time code by email.

**Live API:** [https://e-commerce-techup-skills.onrender.com](https://e-commerce-techup-skills.onrender.com)

**API docs:** [https://e-commerce-techup-skills.onrender.com/api-docs](https://e-commerce-techup-skills.onrender.com/api-docs)

The service is hosted on [Render](https://render.com) (free plan). The first request after idle can take about a minute while the instance wakes up.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
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
| [Cloudinary](https://cloudinary.com/) | Stores and delivers product images |
| [Multer](https://github.com/expressjs/multer) | Reads the uploaded image from `multipart/form-data` |
| [Resend](https://resend.com/) | Welcome email and password-reset codes |
| [Render](https://render.com/) | Hosts the live API |
| [Postman](https://www.postman.com/) | API testing |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Interactive OpenAPI documentation |

---

## Prerequisites

- **Node.js** v20 or later
- **npm** (bundled with Node.js)
- **MongoDB** running locally, or a MongoDB Atlas cluster for deployment
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
git clone https://github.com/Parfai27/E_Commerce_techup-skills.git
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
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
```

`.env` is listed in `.gitignore` and is not committed. For a deployed database, set `MONGO_URI` to your MongoDB Atlas connection string. Do not commit that string.

Welcome and reset messages are sent through the Resend HTTPS API. `onboarding@resend.dev` is Resend’s test sender and can deliver only to the email address on the Resend account. To email every registered user, verify a domain you own in Resend and set `EMAIL_FROM` to an address on that domain.

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

The same API is deployed at **https://e-commerce-techup-skills.onrender.com**. Docs: **https://e-commerce-techup-skills.onrender.com/api-docs**.

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

## Deployment

The live service is [https://e-commerce-techup-skills.onrender.com](https://e-commerce-techup-skills.onrender.com).

Render builds from `render.yaml` on the `main` branch:

| Setting | Value |
| --- | --- |
| Service | `e-commerce-techup-skills` |
| Runtime | Node.js 22 |
| Build | `npm install` |
| Start | `npm start` |
| Health check | `GET /` |

Set these environment variables in the Render dashboard. They are not stored in Git:

`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`.

Leave `PORT` unset. Render provides it. Atlas Network Access must allow `0.0.0.0/0` so the hosted app can reach the database.

---

## Project Structure

```text
klab-techup-skills/
├── src/
│   ├── config/
│   │   ├── cloudinary.ts         # Cloudinary SDK configuration
│   │   └── db.ts                 # MongoDB connection
│   ├── controller/
│   │   ├── auth.controller.ts    # Register, login, password reset
│   │   └── product.controller.ts
│   ├── services/
│   │   └── emailService.ts       # Welcome and reset emails
│   ├── templates/
│   │   └── welcome.template.ts   # Welcome email HTML
│   ├── docs/
│   │   └── openapi.ts            # OpenAPI document served by Swagger UI
│   ├── middleware/
│   │   ├── auth.middleware.ts    # Requires a Bearer JWT
│   │   └── uploadMiddleware.ts   # Reads the product image into memory
│   ├── model/
│   │   ├── product.model.ts
│   │   └── user.model.ts
│   ├── router/
│   │   ├── auth.router.ts
│   │   └── product.router.ts
│   └── server.ts                 # Application entry point
├── .env                          # Local only. Never commit secrets
├── render.yaml                   # Render web service definition
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Welcome (`GET /`) and the auth routes stay public. `authenticate` runs before every product route.

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
| `npm start` | Starts the server the way Render does (`ts-node --transpile-only`) |
| `npx tsc` | Compiles TypeScript to JavaScript according to `tsconfig.json` |

---

## API Reference

Local docs: **http://localhost:1000/api-docs**. Live docs: **https://e-commerce-techup-skills.onrender.com/api-docs**. The raw OpenAPI document is at `/api-docs.json` on either host.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Welcome message |
| `POST` | `/api/auth/register` | Create an account. Password is stored as a bcrypt hash. Sends a welcome email. |
| `POST` | `/api/auth/login` | Check the password and return a JWT that expires in 1 day. |
| `POST` | `/api/auth/forgot-password` | Email a 6-digit reset code that expires in 10 minutes. |
| `POST` | `/api/auth/reset-password` | Set a new password with that code. |
| `GET` | `/api/products` | List products. Requires `Authorization: Bearer <token>`. |
| `GET` | `/api/products/{id}` | Get one product. Requires a Bearer token. |
| `POST` | `/api/products` | Create a product with `multipart/form-data`: `name`, `category`, `price`, and `image`. Requires a Bearer token. |
| `PUT` | `/api/products/{id}` | Update a product with form-data. Include `image` only when replacing the picture. Requires a Bearer token. |
| `DELETE` | `/api/products/{id}` | Delete the product and its Cloudinary image. Requires a Bearer token. |

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

The response includes `token` plus `id`, `name`, and `email`. Send that token on every product request:

```http
Authorization: Bearer <token>
```

A product request with no header returns `401` and `{ "message": "Authentication token is required" }`. A bad or expired token returns `401` and `{ "message": "Invalid or expired token" }`.

### `POST /api/auth/forgot-password`

Body: `{ "email" }`. The response is the same whether or not that email is registered. When the account exists, a 6-digit code is emailed and stored as a hash for 10 minutes.

### `POST /api/auth/reset-password`

Body: `{ "email", "code", "newPassword" }`. A matching, unexpired code returns `200` and `Password reset successful`.

### `POST /api/products`

Send **form-data**, not JSON. The file field name is `image`. MongoDB stores `imageUrl` and `imagePublicId`. The image file itself stays on Cloudinary.

| Key | Type | Example |
| --- | --- | --- |
| `name` | Text | Nike Shoes |
| `category` | Text | Shoes |
| `price` | Text | 50000 |
| `image` | File | a `.jpg` or `.png` |

A successful create returns `201` and `Product created successfully`, including an `imageUrl` that starts with `https://res.cloudinary.com/`.

`PUT /api/products/{id}` uses the same form-data. Leave `image` out to keep the current picture. `DELETE /api/products/{id}` removes the MongoDB document and the Cloudinary file.

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

1. Start the server with `npm run dev`, or use the live API.
2. In Postman, choose **Import** and select `postman/KLab-TechUp-Skills.postman_collection.json`.
3. Set the collection variable `baseUrl` to `http://localhost:1000` or `https://e-commerce-techup-skills.onrender.com` (no trailing slash, no port on the live URL).
4. Open the collection and click **Run**.

The runner checks the welcome route, registers or finds a user, logs in, rejects a product request that has no token, then runs the product CRUD flow with the saved Bearer token.

To send one request by hand, use **GET** `https://e-commerce-techup-skills.onrender.com/` and expect `200 OK` with `Hello World!`.

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

- [x] Database integration (local MongoDB or MongoDB Atlas through `MONGO_URI`)
- [x] Environment variables for `PORT`, `MONGO_URI`, `JWT_SECRET`, Cloudinary, and email
- [x] User registration and login (`POST /api/auth/register`, `POST /api/auth/login`)
- [x] Password reset by email (`POST /api/auth/forgot-password`, `POST /api/auth/reset-password`)
- [x] Authentication middleware (`Authorization: Bearer <token>`)
- [x] Protect product routes with the JWT
- [x] Product image upload, replace, and delete with Cloudinary
- [x] Deployed on Render at `https://e-commerce-techup-skills.onrender.com`
- [ ] Additional API routes
- [ ] Request validation
- [ ] Centralized error handling
- [ ] Automated tests
- [x] API documentation (Swagger UI at `/api-docs`)

---

## Author

[Parfai27](https://github.com/Parfai27) — KLab TechUp Skills

