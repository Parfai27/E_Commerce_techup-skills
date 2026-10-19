# KLab TechUp Skills

Express, TypeScript, and MongoDB API, plus the Selz shop in the sibling `react-app` folder. Both are in this repository. Product images are stored on Cloudinary.

**Live site:** [https://e-commerce-techup-skills.onrender.com](https://e-commerce-techup-skills.onrender.com)

**API docs:** [https://e-commerce-techup-skills.onrender.com/api-docs](https://e-commerce-techup-skills.onrender.com/api-docs)

The first request after the free Render instance has been idle can take about a minute.

## Roles

Register always creates a buyer. There is no role picker.

| Role | What they can do |
| --- | --- |
| Buyer | Shop, search, and use the cart |
| Seller | Add, edit, and delete their own products. Category is required. Those products appear on the shop shelves. |
| Admin | List, create, and delete sellers. Deleting a seller also removes the products they added. Admins do not search or create products. |

## Run it locally

Node.js 20 or later.

```bash
git clone https://github.com/Parfai27/E_Commerce_techup-skills.git
cd E_Commerce_techup-skills/node-app
npm install
```

Create `node-app/.env` (it is not committed):

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

`EMAIL_FROM` must be a verified SendGrid Single Sender. Mail from a `@gmail.com` address is often deferred by Gmail. Registration still succeeds.

```bash
npm run dev
```

The API listens on **http://localhost:1000**. Then start the shop:

```bash
cd ../react-app
npm install
npm run dev
```

Selz is at **http://localhost:5173** and proxies `/api` to the local API. The built-in groceries stay in the browser. Products a seller adds are loaded from the API and shown with them.

| Command | Where | What it does |
| --- | --- | --- |
| `npm run dev` | `node-app` | API with auto-restart |
| `npm start` | `node-app` | API the way Render starts it |
| `npm run seed` | `node-app` | Adds sample shoes and a notebook if those names are missing |
| `npm run dev` | `react-app` | Selz dev server |

## API

Product reads are public. Creating, updating, and deleting a product requires a seller token. Seller management requires an admin token.

| Method | Endpoint | Who |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Anyone. Always a buyer. Body: `name`, `email`, `password`. |
| `POST` | `/api/auth/login` | Anyone. Returns a token and `user` with `role`. Token lasts 1 day. |
| `POST` | `/api/auth/forgot-password` | Anyone. Emails a 6-digit code for 10 minutes. |
| `POST` | `/api/auth/reset-password` | Anyone. Body: `email`, `code`, `newPassword`. |
| `GET` | `/api/auth/sellers` | Admin. List sellers. |
| `POST` | `/api/auth/sellers` | Admin. Body: `name`, `email`, `password`. |
| `DELETE` | `/api/auth/sellers/{id}` | Admin. Removes that seller and their products. |
| `GET` | `/api/products` | Public list. A seller token returns only that seller's products. |
| `GET` | `/api/products/{id}` | Public. |
| `POST` | `/api/products` | Seller. Form fields: `name`, `category`, `unit`, `price`, `image`. |
| `PUT` | `/api/products/{id}` | Seller, own products only. `image` is optional. |
| `DELETE` | `/api/products/{id}` | Seller, own products only. |

Send the token as `Authorization: Bearer <token>`. Missing or bad tokens return `401`. The wrong role returns `403`.

`GET /api/products` with `q`, `category`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`, `page`, or `limit` returns `{ success, data, pagination }`. The same filters work on `/api/products/browse` and `/api/products/search` (`q` is required for search). `/api/products/stats` summarizes each category.

Postman collection: `node-app/postman/KLab-TechUp-Skills.postman_collection.json`.

## Deployment

Render uses the repository root. Leave **Root Directory** blank. Build is `npm install`, start is `npm start`. Do not set `PORT`.

Set `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `SENDGRID_API_KEY`, and `EMAIL_FROM` in the Render dashboard. Atlas must allow `0.0.0.0/0`.

`/` serves Selz. `/api` is the API. `/api-docs` is Swagger.

## Author

[Parfai27](https://github.com/Parfai27) — KLab TechUp Skills
