import { Component } from "../../src/models/Component.js";
import { createError } from "../middleware/errorHandler.js";

// Valid categories matching seed.js
const VALID_CATEGORIES = [
  "cpu",
  "cpu-cooler",
  "motherboard",
  "memory",
  "storage",
  "video-card",
  "case",
  "power-supply",
  "monitor",
];

/**
 * GET /api/components
 * Query params:
 *   category    — filter by category slug
 *   search      — full-text search on name/brand
 *   minPrice    — numeric min price
 *   maxPrice    — numeric max price
 *   brand       — filter by brand name (case-insensitive)
 *   page        — page number (default 1)
 *   limit       — results per page (default 20, max 100)
 *   sort        — "price_asc" | "price_desc" | "name_asc" | "name_desc" (default "name_asc")
 */
export const getComponents = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      brand,
      page = 1,
      limit = 20,
      sort = "name_asc",
    } = req.query;

    const filter = { price: { $ne: null, $gt: 0 } };

    // Category filter
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        throw createError(400, `Invalid category. Valid: ${VALID_CATEGORIES.join(", ")}`);
      }
      filter.category = category;
    }

    // Text search — uses MongoDB $text index on Component model
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    // Brand filter
    if (brand) {
      filter.brand = { $regex: new RegExp(brand, "i") };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    };
    const sortObj = sortMap[sort] || { name: 1 };

    // Execute query + count in parallel
    const [components, total] = await Promise.all([
      Component.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Component.countDocuments(filter),
    ]);

    res.json({
      data: components,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/components/:id
 */
export const getComponentById = async (req, res, next) => {
  try {
    const component = await Component.findById(req.params.id).lean();
    if (!component) throw createError(404, "Component not found");
    res.json(component);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/components/categories
 * Returns list of categories with count of components in each
 */
export const getCategories = async (req, res, next) => {
  try {
    const counts = await Component.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const categories = counts.map(({ _id, count }) => ({
      slug: _id,
      label: _id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      count,
    }));

    res.json(categories);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/components/brands?category=cpu
 * Returns distinct brands, optionally filtered by category
 */
export const getBrands = async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const brands = await Component.distinct("brand", filter);
    res.json(brands.filter(Boolean).sort());
  } catch (err) {
    next(err);
  }
};