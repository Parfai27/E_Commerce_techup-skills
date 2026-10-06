export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "KLab TechUp Skills API",
    version: "1.0.0",
    description:
      "REST API for managing products in MongoDB. Product routes require a Bearer JWT from POST /api/auth/login.",
  },
  servers: [
    {
      url: "http://localhost:1000",
      description: "Local development",
    },
  ],
  tags: [
    { name: "Welcome", description: "Server welcome message" },
    { name: "Products", description: "Create, read, update, and delete products" },
  ],
  paths: {
    "/": {
      get: {
        tags: ["Welcome"],
        summary: "Welcome message",
        description: "Returns a plain-text welcome message.",
        responses: {
          "200": {
            description: "Welcome message",
            content: {
              "text/plain": {
                schema: { type: "string", example: "Hello World!" },
              },
            },
          },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        security: [{ bearerAuth: [] }],
        description: "Returns every product stored in MongoDB.",
        responses: {
          "200": {
            description: "Array of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product",
        security: [{ bearerAuth: [] }],
        description: "Adds a product from multipart/form-data. `name`, `category`, `price`, and `image` are required. The image is stored on Cloudinary; MongoDB stores the URL and public id.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Product created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductMutation" },
              },
            },
          },
          "400": {
            description: "name, category, and price are required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
                example: { message: "Name, category and price are required" },
              },
            },
          },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a product",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ProductId" }],
        responses: {
          "200": {
            description: "The matching product",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
                example: { message: "Product Not Found" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update a product",
        security: [{ bearerAuth: [] }],
        description: "Updates fields sent as multipart/form-data. Include `image` only when replacing the Cloudinary file.",
        parameters: [{ $ref: "#/components/parameters/ProductId" }],
        requestBody: {
          required: false,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/ProductUpdate" },
            },
          },
        },
        responses: {
          "200": {
            description: "Product updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductMutation" },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
                example: { message: "Product Not Found" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete a product",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/ProductId" }],
        responses: {
          "200": {
            description: "Product and its Cloudinary image were deleted.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
                example: { message: "Product deleted successfully" },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
                example: { message: "Product Not Found" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    parameters: {
      ProductId: {
        name: "id",
        in: "path",
        required: true,
        description: "MongoDB product id",
        schema: { type: "string", example: "66f1c2a4b8e4d21a0c1e9a11" },
      },
    },
    schemas: {
      Product: {
        type: "object",
        required: ["_id", "name", "category", "price", "imageUrl", "imagePublicId"],
        properties: {
          _id: { type: "string", example: "66f1c2a4b8e4d21a0c1e9a11" },
          name: { type: "string", example: "I Phone 17 Pro" },
          category: { type: "string", example: "Electronic" },
          price: { type: "number", example: 8000 },
          imageUrl: {
            type: "string",
            example: "https://res.cloudinary.com/vodrx8vs/image/upload/v1/products/example.jpg",
          },
          imagePublicId: { type: "string", example: "products/example" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductInput: {
        type: "object",
        required: ["name", "category", "price", "image"],
        properties: {
          name: { type: "string", example: "Samsung Galaxy" },
          category: { type: "string", example: "Electronic" },
          price: { type: "number", example: 6500 },
          image: { type: "string", format: "binary" },
        },
      },
      ProductUpdate: {
        type: "object",
        properties: {
          name: { type: "string", example: "I Phone 17 Pro" },
          category: { type: "string", example: "Electronic" },
          price: { type: "number", example: 7500 },
          image: { type: "string", format: "binary" },
        },
      },
      ErrorMessage: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string" },
        },
      },
      ProductMutation: {
        type: "object",
        required: ["message", "product"],
        properties: {
          message: { type: "string", example: "Product created successfully" },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      ProductDeleted: {
        type: "object",
        required: ["message", "product"],
        properties: {
          message: { type: "string", example: "Product deleted successfully" },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
    },
  },
};
