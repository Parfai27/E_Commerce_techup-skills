export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "KLab TechUp Skills API",
    version: "1.0.0",
    description:
      "REST API for managing products. Products are stored in memory and reset when the server restarts.",
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
        description: "Returns every product currently stored in memory.",
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
        description: "Adds a product. `name`, `category`, and `price` are required. The id is assigned automatically.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
              example: {
                name: "Samsung Galaxy",
                category: "Electronic",
                price: 6500,
              },
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
                example: { message: "name , category and price are required" },
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
                example: { message: "Product Not found" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update a product",
        description: "Updates the fields included in the body. Omitted fields keep their current values.",
        parameters: [{ $ref: "#/components/parameters/ProductId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductUpdate" },
              example: { price: 7500 },
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
                example: { message: "product notfound" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete a product",
        parameters: [{ $ref: "#/components/parameters/ProductId" }],
        responses: {
          "200": {
            description: "Product deleted. `product` is an array containing the removed item.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductDeleted" },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorMessage" },
                example: { message: "product is not Found" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    parameters: {
      ProductId: {
        name: "id",
        in: "path",
        required: true,
        description: "Numeric product id",
        schema: { type: "integer", example: 1 },
      },
    },
    schemas: {
      Product: {
        type: "object",
        required: ["id", "name", "category", "price"],
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "I Phone 17 Pro" },
          category: { type: "string", example: "Electronic" },
          price: { type: "number", example: 8000 },
        },
      },
      ProductInput: {
        type: "object",
        required: ["name", "category", "price"],
        properties: {
          name: { type: "string", example: "Samsung Galaxy" },
          category: { type: "string", example: "Electronic" },
          price: { type: "number", example: 6500 },
        },
      },
      ProductUpdate: {
        type: "object",
        properties: {
          name: { type: "string", example: "I Phone 17 Pro" },
          category: { type: "string", example: "Electronic" },
          price: { type: "number", example: 7500 },
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
          message: { type: "string", example: "Product added " },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      ProductDeleted: {
        type: "object",
        required: ["message", "product"],
        properties: {
          message: { type: "string", example: "Product delete Successfully" },
          product: {
            type: "array",
            items: { $ref: "#/components/schemas/Product" },
          },
        },
      },
    },
  },
};
