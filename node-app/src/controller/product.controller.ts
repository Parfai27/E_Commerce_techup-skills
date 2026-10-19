import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../model/product.model";
import cloudinary from "../config/cloudinary";
import { getAuth } from "../middleware/auth.middleware";

const ownsProduct = (seller: unknown, userId: string) =>
  Boolean(seller) && String(seller) === userId;

const readId = (id: string | string[] | undefined) => {
  if (typeof id === "string") return id;
  if (Array.isArray(id)) return id[0] ?? "";
  return "";
};

const isObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const uploadToCloudinary = (
  buffer: Buffer,
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const products = await Product.find(auth.role === "seller" ? { seller: auth.userId } : {});

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
    const auth = getAuth(req);
    const name = String(req.body?.name ?? "").trim();
    const category = String(req.body?.category ?? "").trim();
    const unit = String(req.body?.unit ?? "").trim();
    const price = req.body?.price;

    if (!name || !category || !unit || !price) {
      return res.status(400).json({
        message: "Name, category, unit and price are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      name,
      category,
      unit,
      price,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      seller: auth.userId,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
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

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const auth = getAuth(req);

    if (auth.role === "seller" && !ownsProduct(product.seller, auth.userId)) {
      return res.status(403).json({
        message: "You can only change products you added",
      });
    }

    const name = req.body?.name ? String(req.body.name).trim() : "";
    const category = req.body?.category ? String(req.body.category).trim() : "";
    const unit = req.body?.unit ? String(req.body.unit).trim() : "";
    const { price } = req.body ?? {};

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);

      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      product.imageUrl = uploadResult.secure_url;
      product.imagePublicId = uploadResult.public_id;
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (unit) product.unit = unit;
    if (price) product.price = price;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
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

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const auth = getAuth(req);

    if (auth.role === "seller" && !ownsProduct(product.seller, auth.userId)) {
      return res.status(403).json({
        message: "You can only delete products you added",
      });
    }

    if (product.imagePublicId && product.imagePublicId !== "seed-placeholder") {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
