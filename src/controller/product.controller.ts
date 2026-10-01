import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../model/product.model";

const readId = (id: string | string[] | undefined) => {
  if (typeof id === "string") return id;
  if (Array.isArray(id)) return id[0] ?? "";
  return "";
};

const isObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = readId(req.params.id);

    if (!isObjectId(id)) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const product = await Product.findById(id);

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

export const addProduct = async (req: Request, res: Response) => {
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

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = readId(req.params.id);

    if (!isObjectId(id)) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = readId(req.params.id);

    if (!isObjectId(id)) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const product = await Product.findByIdAndDelete(id);

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
