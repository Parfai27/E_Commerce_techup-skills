# KLab TechUp Skills — Express.js + TypeScript API

A REST API built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**, plus a React storefront named **Selz** in the sibling `react-app` folder. Both folders are in this repository. Products are stored in MongoDB, and their images are stored on Cloudinary. Register and login issue a JWT that includes the account role: `user` (buyer), `seller`, or `admin`. The register page always creates a buyer. An admin creates seller accounts. Every product route requires the token. Password reset sends a one-time code by email.

**Live site:** [https://e-commerce-techup-skills.onrender.com](https://e-commerce-techup-skills.onrender.com) serves the Selz storefront. The API is on that same host under `/api`.

**API docs:** [https://e-commerce-techup-skills.onrender.com/api-docs](https://e-commerce-techup-skills.onrender.com/api-docs)

The service is hosted on [Render](https://render.com) (free plan). The first request after idle can take about a minute while the instance wakes up.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Selz storefront](#selz-storefront)
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
| [SendGrid](https://sendgrid.com/) | Welcome email and password-reset codes |
| [Render](https://render.com/) | Hosts the live API |
| [Postman](https://www.postman.com/) | API testing |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Interactive OpenAPI documentation |
| [React](https://react.dev/) | Selz storefront in the sibling `react-app` folder |
| [Vite](https://vite.dev/) | Dev server and production build for Selz |
| [Tailwind CSS](https://tailwindcss.com/) | Selz layout and styling |

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
cd E_Commerce_techup-skills/node-app
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
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_verified_sender@example.com
```

`.env` is listed in `.gitignore` and is not committed. For a deployed database, set `MONGO_URI` to your MongoDB Atlas connection string. Do not commit that string.

Welcome and reset messages are sent with `@sendgrid/mail` through the SendGrid HTTPS API. `EMAIL_FROM` must be a Single Sender you verified in SendGrid.

Gmail defers messages whose From address is `@gmail.com` when SendGrid is the sender, because that address is not aligned with SendGrid’s SPF or DKIM records. Registration still succeeds. Reliable delivery to any inbox needs a domain you authenticate in SendGrid, with `EMAIL_FROM` set to an address on that domain.

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

---

## Selz storefront

The shop UI lives in `react-app`, next to this API folder. Run it from that folder while the API is available:

```bash
cd ../react-app
npm install
npm run dev
```

Vite serves Selz at **http://localhost:5173**. In development, requests to `/api` are proxied to the API on `http://localhost:1000`, so start the API with `npm run dev` in this folder first. The browser can call the API without a CORS change.

The home page and shop use a built-in grocery catalog: real product photos and typical 2026 Kigali shelf prices in Rwandan francs. Those shelves are not loaded from MongoDB.

These screens call the API:

| Screen | API |
| --- | --- |
| Register | `POST /api/auth/register` — always creates a buyer. There is no role picker. |
| Sign in | `POST /api/auth/login` — the token and user include `admin`, `seller`, or `user` |
| Forgot password | `POST /api/auth/forgot-password` |
| Reset password | `POST /api/auth/reset-password` |
| Create a seller (admin only) | `POST /api/auth/sellers` |
| Catalog (seller and admin) | `GET /api/products`, `/browse`, `/search`, `/stats`, and `GET`, `POST`, `PUT`, `DELETE` `/api/products/{id}` |

Buyers can shop and use the cart. Sellers add, edit, and delete their own products, and category is required on create. Admins can manage every product and create seller accounts. The catalog sends the login JWT as `Authorization: Bearer <token>`. Creating a product sends `multipart/form-data` with `name`, `category`, `price`, and an `image` field. The cart on the shop pages stays in the browser.

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
| Root directory | repository root (leave this blank) |
| Runtime | Node.js 22 |
| Build | `npm install` (installs the API and builds Selz) |
| Start | `npm start` |
| Health check | `GET /` |

Set these environment variables in the Render dashboard. They are not stored in Git:

`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `SENDGRID_API_KEY`, `EMAIL_FROM`.

Leave `PORT` unset. Render provides it. Leave the Root Directory blank so Render uses the repository root `package.json`, which installs the API and builds Selz. Atlas Network Access must allow `0.0.0.0/0` so the hosted app can reach the database.

The built Selz app is served from `/`. Shop, account, and catalog pages are the React app. `/api` is the API, and `/api-docs` is Swagger. `GET /` returns `Hello World!` only when the Selz build is missing.

---

## Project Structure

```text
klab-techup-skills/
├── react-app/                        # Selz storefront (React, Vite, Tailwind)
├── package.json                      # Installs the API and builds Selz for Render
├── render.yaml                       # Render web service definition
└── node-app/
    ├── src/
    │   ├── config/
    │   │   ├── cloudinary.ts         # Cloudinary SDK configuration
    │   │   └── db.ts                 # MongoDB connection
    │   ├── controller/
    │   │   ├── auth.controller.ts    # Register, login, password reset
    │   │   ├── product.controller.ts
    │   │   └── product.query.controller.ts
    │   ├── utils/
    │   │   ├── pagination.helper.ts
    │   │   └── response.helper.ts
    │   ├── scripts/
    │   │   └── seed.ts               # Adds sample products without deleting data
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
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    └── README.MD
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
| `npm run seed` | Inserts sample shoes and a notebook when those names are missing. Does not delete existing data. |
| `npx tsc` | Compiles TypeScript to JavaScript according to `tsconfig.json` |

---

## API Reference

Local docs: **http://localhost:1000/api-docs**. Live docs: **https://e-commerce-techup-skills.onrender.com/api-docs**. The raw OpenAPI document is at `/api-docs.json` on either host.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Selz storefront when the React app has been built. Otherwise the text `Hello World!`. |
| `POST` | `/api/auth/register` | Create a buyer account. Any `role` in the body is ignored. Password is stored as a bcrypt hash. Sends a welcome email. |
| `POST` | `/api/auth/login` | Check the password and return a JWT that expires in 1 day. The token and `user` include `role`. |
| `POST` | `/api/auth/sellers` | Admin only. Create a seller with `{ "name", "email", "password" }`. |
| `POST` | `/api/auth/forgot-password` | Email a 6-digit reset code that expires in 10 minutes. |
| `POST` | `/api/auth/reset-password` | Set a new password with that code. |
| `GET` | `/api/products` | List products. Requires `Authorization: Bearer <token>`. A plain request returns the full array. Add `q`, `category`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`, `page`, or `limit` to search, filter, sort, and paginate together. |
| `GET` | `/api/products/browse` | The paginated list, including the same filters. |
| `GET` | `/api/products/search?q=` | Name search. Category, price, and sort parameters work on this route too. |
| `GET` | `/api/products/stats` | Count and price summary for each category. |
| `GET` | `/api/products/{id}` | Get one product. Requires a Bearer token. |
| `POST` | `/api/products` | Seller or admin. Create a product with `multipart/form-data`: `name`, `category`, `price`, and `image`. Category is required. |
| `PUT` | `/api/products/{id}` | Seller or admin. Update a product with form-data. Include `image` only when replacing the picture. A seller can change only products they added. |
| `DELETE` | `/api/products/{id}` | Seller or admin. Delete the product and its Cloudinary image. A seller can delete only products they added. |

### `POST /api/auth/register`

| Property | Value |
| --- | --- |
| URL | `http://localhost:1000/api/auth/register` |
| Method | `POST` |
| Body | `{ "name", "email", "password" }` |
| Success status | `201 Created` |

The response includes `id`, `name`, `email`, and `role` (`user`). It does not include the password. Sending `"role": "admin"` or `"role": "seller"` does not change that.

### `POST /api/auth/login`

| Property | Value |
| --- | --- |
| URL | `http://localhost:1000/api/auth/login` |
| Method | `POST` |
| Body | `{ "email", "password" }` |
| Success status | `200 OK` |

The response includes `token` plus `id`, `name`, `email`, and `role`. The token payload is `userId` and `role`. Send that token on every product request:

```http
Authorization: Bearer <token>
```

A product request with no header returns `401` and `{ "message": "Authentication token is required" }`. A bad or expired token returns `401` and `{ "message": "Invalid or expired token" }`. A buyer who tries to create, update, or delete a product receives `403`.

### `POST /api/auth/sellers`

Admin only. Send `Authorization: Bearer <token>` and `{ "name", "email", "password" }`. The new account always has role `seller`. A buyer or seller who calls this route receives `403`.

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

### Filtered product list

A plain `GET /api/products` still returns every product as an array. Adding any of these query parameters switches that same route to `{ success, data, pagination }`:

```text
GET /api/products?q=nike&category=shoes&minPrice=10000&maxPrice=80000&sortBy=price&sortOrder=asc&page=1&limit=10
```

`q` matches the product name. `category` matches the whole category. `sortBy` is `name`, `price`, `category`, or `createdAt`. `/api/products/browse` and `/api/products/search` use the same filters. Search requires `q`. `/api/products/stats` returns one row per category with the count and the average, lowest, and highest price. All of these need a Bearer token.

`npm run seed` inserts sample products named `Sample Nike Shoes` and `Sample Notebook` only when those names are missing.

### `GET /`

On Render, and locally after the Selz build, this returns the storefront HTML. If `react-app/dist` does not exist, it returns the text `Hello World!`.

| Property | Value |
| --- | --- |
| URL | `http://localhost:1000/` |
| Method | `GET` |
| Headers | None required |
| Body | None |
| Success status | `200 OK` |

---

## Testing with Postman

1. Start the server with `npm run dev`, or use the live API.
2. In Postman, choose **Import** and select `postman/KLab-TechUp-Skills.postman_collection.json`.
3. Set the collection variable `baseUrl` to `http://localhost:1000` or `https://e-commerce-techup-skills.onrender.com` (no trailing slash, no port on the live URL).
4. Open the collection and click **Run**.

The runner checks the welcome route, registers or finds a user, logs in, rejects a product request that has no token, then runs the product CRUD flow with the saved Bearer token.

After **Login**, the **Products** folder can check the new list features. **List products** still expects the full array. **List products filtered**, **Browse products**, **Search products**, and **Product stats** need the saved token. Re-import the collection if those four requests are missing.

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
- [x] Welcome and password-reset email through SendGrid (`POST /api/auth/forgot-password`, `POST /api/auth/reset-password`)
- [x] Authentication middleware (`Authorization: Bearer <token>`)
- [x] Protect product routes with the JWT
- [x] Product image upload, replace, and delete with Cloudinary
- [x] Product search, filters, pagination, and category stats
- [x] Selz storefront in the sibling `react-app` folder (shop catalog, auth, and signed-in product API)
- [x] Roles: buyers shop, sellers manage their own products (category required), and admins create sellers and manage every product
- [x] Deployed on Render at `https://e-commerce-techup-skills.onrender.com`
- [ ] Additional API routes
- [ ] Request validation
- [ ] Centralized error handling
- [ ] Automated tests
- [x] API documentation (Swagger UI at `/api-docs`)

---

## Author

[Parfai27](https://github.com/Parfai27) — KLab TechUp Skills

