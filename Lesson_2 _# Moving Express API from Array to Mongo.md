# Moving Express API from Array to MongoDB

This guide explains how we changed our simple **Express + TypeScript Product API** from storing products in a JavaScript array to storing them in **MongoDB** using **Mongoose**.

We also added:

- `.env` configuration
- MongoDB connection
- Mongoose Product Model
- MongoDB CRUD operations
- Environment-based server port

---

# Step 1: Original Product Model

At the beginning, our products were stored directly inside a JavaScript array.

### `product.model.ts`

```ts
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "phone",
    category: "electronics",
    price: 5000,
  },
  {
    id: 2,
    name: "Computer",
    category: "electronics",
    price: 5000,
  },
  {
    id: 3,
    name: "TV",
    category: "electronics",
    price: 5000,
  },
];
```

## Problem with this approach

The products are stored only in the application's memory.

For example:

```text
Application starts
       ↓
products[] is created
       ↓
Products are stored in memory
       ↓
Server stops
       ↓
Products are lost
```

If we restart the server, the data returns to the original array.

We therefore changed the application to use a real database.

---

# Step 2: Install Mongoose and dotenv

We installed:

```bash
npm install mongoose dotenv
```

### Mongoose

Mongoose allows our Node.js application to communicate with MongoDB.

The structure becomes:

```text
Express
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
```

### dotenv

`dotenv` allows us to store configuration values such as:

- Server port
- MongoDB connection URL

inside a `.env` file.

---

# Step 3: Create the `.env` File

We created a `.env` file in the root of the project.

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/productdb
```

For MongoDB Atlas, the `MONGO_URI` can be a MongoDB Atlas connection string.

Example:

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/productdb
```

## Why use `.env`?

Instead of writing sensitive or configurable information directly inside the code:

```ts
const port = 3000;
```

we use:

```ts
const port = process.env.PORT || 3000;
```

And instead of writing the database URL directly:

```ts
mongoose.connect("mongodb://localhost:27017/productdb");
```

we use:

```ts
mongoose.connect(process.env.MONGO_URI as string);
```

This makes the application easier and safer to configure.

---

# Step 4: Add `.env` to `.gitignore`

We don't want to push our `.env` file to GitHub.

Add:

```gitignore
node_modules/
.env
```

The `.env` file can contain passwords and database credentials.

---

# Step 5: Create MongoDB Connection

We created a new folder:

```text
src/
└── config/
    └── db.ts
```

### `db.ts`

```ts
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
```

This function connects our Express application to MongoDB.

---

# Step 6: Change `server.ts`

Originally our server had:

```ts
const port = 3000;
```

We changed it to use the `.env` file.

### New `server.ts`

```ts
import express from "express";
import dotenv from "dotenv";
import productRouter from "./router/product.router";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", productRouter);

connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## What changed?

### 1. Added dotenv

```ts
import dotenv from "dotenv";
```

### 2. Loaded `.env`

```ts
dotenv.config();
```

This allows us to access:

```ts
process.env.PORT;
process.env.MONGO_URI;
```

### 3. Changed the port

Before:

```ts
const port = 3000;
```

After:

```ts
const port = process.env.PORT || 3000;
```

### 4. Added MongoDB connection

```ts
connectDB();
```

Now the application connects to MongoDB when the server starts.

---

# Step 7: Change the Product Model

Before, our model contained an array:

```ts
export const products: Product[] = [...]
```

We removed the array.

Now we use a Mongoose Schema and Model.

### `product.model.ts`

```ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
```

---

# Step 8: Understand the New Model

Instead of:

```ts
products[]
```

we now have:

```ts
Product;
```

The schema defines the structure of a product:

```ts
name: String;
category: String;
price: Number;
```

For example:

```json
{
  "name": "Phone",
  "category": "Electronics",
  "price": 5000
}
```

MongoDB automatically creates an `_id` for every document.

So we no longer need to manually create:

```ts
id: 1;
```

or:

```ts
lastProduct.id + 1;
```

---

# Step 9: Change the Controller

Originally, the controller worked with:

```ts
products;
```

which was our JavaScript array.

For example:

```ts
const product = products.find((product) => product.id === id);
```

Now the controller works with the MongoDB Product model:

```ts
Product.find();
Product.findById();
Product.create();
Product.findByIdAndUpdate();
Product.findByIdAndDelete();
```

---

# Step 10: Get All Products

### Before

We simply returned the array:

```ts
res.status(200).json(products);
```

### After

We ask MongoDB for the products:

```ts
export const getProduct = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get products",
    });
  }
};
```

The important change is:

```ts
Product.find();
```

This gets the products from MongoDB.

---

# Step 11: Get Product By ID

### Before

We searched the array:

```ts
const product = products.find((product) => product.id === id);
```

### After

We search MongoDB:

```ts
const product = await Product.findById(req.params.id);
```

Complete controller:

```ts
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get product",
    });
  }
};
```

---

# Step 12: Create a Product

### Before

We manually generated the ID:

```ts
const lastProduct = products.at(-1);

const newProduct = {
  id: lastProduct ? lastProduct.id + 1 : 1,
  name,
  category,
  price,
};
```

Then:

```ts
products.push(newProduct);
```

### After

MongoDB creates the ID automatically.

We use:

```ts
Product.create();
```

Complete controller:

```ts
export const newProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "name, category, price required",
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
    });

    return res.status(201).json({
      message: "Product Created",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};
```

---

# Step 13: Update a Product

### Before

We found the product in the array and changed its properties:

```ts
product.name = name ?? product.name;
product.category = category ?? product.category;
product.price = price ?? product.price;
```

### After

We use:

```ts
Product.findByIdAndUpdate();
```

```ts
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      message: "Product Updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};
```

### Important options

```ts
new: true
```

Returns the updated product.

```ts
runValidators: true;
```

Makes Mongoose apply the schema validation during the update.

---

# Step 14: Delete a Product

### Before

We used:

```ts
products.splice(ProductIndex, 1);
```

to remove the product from the array.

### After

We use:

```ts
Product.findByIdAndDelete();
```

```ts
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      message: "Product Deleted",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
    });
  }
};
```

---

# Step 15: CRUD Operations

Our controller now performs the four main CRUD operations.

| Operation | Mongoose Method               | Purpose          |
| --------- | ----------------------------- | ---------------- |
| Create    | `Product.create()`            | Create a product |
| Read      | `Product.find()`              | Get all products |
| Read      | `Product.findById()`          | Get one product  |
| Update    | `Product.findByIdAndUpdate()` | Update a product |
| Delete    | `Product.findByIdAndDelete()` | Delete a product |

The new flow is:

```text
             Client
               ↓
             Router
               ↓
           Controller
               ↓
        Mongoose Model
               ↓
            MongoDB
```

---

# Step 16: Before vs After

## Before

```text
Express
   ↓
Controller
   ↓
products[]
   ↓
Data stored in memory
```

Example:

```ts
const products: Product[] = [];
```

The data disappears when the server restarts.

---

## After

```text
Express
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
```

The data is stored in the database.

```text
MongoDB
└── productdb
    └── products
        ├── Product 1
        ├── Product 2
        └── Product 3
```

The data remains available even after restarting the server.

---

# Step 17: Final Project Structure

After the changes, our project looks like this:

```text
project/
│
├── src/
│   │
│   ├── config/
│   │   └── db.ts
│   │
│   ├── controller/
│   │   └── product.controller.ts
│   │
│   ├── model/
│   │   └── product.model.ts
│   │
│   ├── router/
│   │   └── product.router.ts
│   │
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

---

# Step 18: Final Result

We started with:

```text
JavaScript Array
```

and changed it to:

```text
MongoDB Database
```

The main changes were:

```text
1. Install mongoose
        ↓
2. Install dotenv
        ↓
3. Create .env
        ↓
4. Create MongoDB connection
        ↓
5. Update server.ts
        ↓
6. Replace array with Mongoose Model
        ↓
7. Update GET controller
        ↓
8. Update GET BY ID controller
        ↓
9. Update POST controller
        ↓
10. Update PUT controller
        ↓
11. Update DELETE controller
        ↓
12. Test CRUD operations
```

The application is now using **MongoDB for persistent product storage** instead of a temporary JavaScript array.
