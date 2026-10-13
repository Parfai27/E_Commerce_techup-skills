import { Request, Response } from "express";
import mongoose, { SortOrder } from "mongoose";
import { getProduct } from "./product.controller";
import Product from "../model/product.model";
import { getAuth } from "../middleware/auth.middleware";
import { getPaginationParams } from "../utils/pagination.helper";
import { errorResponse, successResponse } from "../utils/response.helper";

const controlKeys = ["page", "limit", "category", "minPrice", "maxPrice", "sortBy", "sortOrder", "q"] as const;
const sortableFields = ["name", "price", "category", "createdAt"] as const;

const readQuery = (value: unknown) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value) && typeof value[0] === "string") return value[0].trim();
  return "";
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasListControls = (req: Request) => controlKeys.some((key) => readQuery(req.query[key]) !== "");

const queryProducts = async (req: Request, res: Response) => {
  const query = readQuery(req.query.q);
  const { page, limit, skip } = getPaginationParams(readQuery(req.query.page), readQuery(req.query.limit));
  const category = readQuery(req.query.category);
  const minPriceText = readQuery(req.query.minPrice);
  const maxPriceText = readQuery(req.query.maxPrice);
  const sortBy = readQuery(req.query.sortBy);
  const sortOrder: SortOrder = readQuery(req.query.sortOrder) === "asc" ? 1 : -1;
  const sortField = sortableFields.find((field) => field === sortBy) ?? "createdAt";

  const auth = getAuth(req);
  const filter: {
    category?: RegExp;
    name?: { $regex: string; $options: string };
    price?: { $gte?: number; $lte?: number };
    seller?: string;
  } = auth.role === "seller" && auth.userId ? { seller: auth.userId } : {};

  if (query) {
    filter.name = { $regex: escapeRegex(query), $options: "i" };
  }

  if (category) {
    filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
  }

  if (minPriceText && Number.isFinite(Number(minPriceText))) {
    filter.price = { ...filter.price, $gte: Number(minPriceText) };
  }

  if (maxPriceText && Number.isFinite(Number(maxPriceText))) {
    filter.price = { ...filter.price, $lte: Number(maxPriceText) };
  }

  const [products, totalItems] = await Promise.all([
    Product.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json({
    ...successResponse(products),
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    ...(query ? { searchQuery: query } : {}),
  });
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    if (!hasListControls(req)) {
      return getProduct(req, res);
    }

    return await queryProducts(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Failed to get products"));
  }
};

export const browseProducts = async (req: Request, res: Response) => {
  try {
    return await queryProducts(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Failed to browse products"));
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    if (!readQuery(req.query.q)) {
      return res.status(400).json(errorResponse("Search query is required"));
    }

    return await queryProducts(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Failed to search products"));
  }
};

export const getProductStats = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const stats = await Product.aggregate([
      ...(auth.role === "seller" && mongoose.Types.ObjectId.isValid(auth.userId)
        ? [{ $match: { seller: new mongoose.Types.ObjectId(auth.userId) } }]
        : []),
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: { $toDouble: "$price" } },
          minPrice: { $min: { $toDouble: "$price" } },
          maxPrice: { $max: { $toDouble: "$price" } },
        },
      },
      { $sort: { totalProducts: -1 } },
      {
        $project: {
          category: "$_id",
          totalProducts: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          minPrice: 1,
          maxPrice: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json(successResponse(stats));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse("Failed to get product stats"));
  }
};
