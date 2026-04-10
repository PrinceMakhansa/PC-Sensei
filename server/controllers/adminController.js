import { Component } from "../../src/models/Component.js";
import { Build } from "../../src/models/Build.js";
import { User } from "../../src/models/User.js";
import { createError } from "../middleware/errorHandler.js";

// ─── Dashboard ────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/stats
 * Returns aggregate counts for the admin dashboard.
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalComponents,
      totalUsers,
      totalBuilds,
      componentsByCategory,
      recentBuilds,
      recentUsers,
    ] = await Promise.all([
      Component.countDocuments(),
      User.countDocuments(),
      Build.countDocuments(),
      Component.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Build.find().sort({ createdAt: -1 }).limit(5).lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt")
        .lean(),
    ]);

    res.json({
      totals: { components: totalComponents, users: totalUsers, builds: totalBuilds },
      componentsByCategory,
      recentBuilds,
      recentUsers,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Components CRUD ──────────────────────────────────────────────────────────

export const adminGetComponents = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Component.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum).lean(),
      Component.countDocuments(filter),
    ]);

    res.json({ data, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
};

export const adminCreateComponent = async (req, res, next) => {
  try {
    const component = await Component.create(req.body);
    res.status(201).json(component);
  } catch (err) {
    next(err);
  }
};

export const adminUpdateComponent = async (req, res, next) => {
  try {
    const component = await Component.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!component) throw createError(404, "Component not found");
    res.json(component);
  } catch (err) {
    next(err);
  }
};

export const adminDeleteComponent = async (req, res, next) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    if (!component) throw createError(404, "Component not found");
    res.json({ message: "Component deleted" });
  } catch (err) {
    next(err);
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const adminGetUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      User.find(filter)
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({ data, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
};

export const adminDeleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw createError(404, "User not found");
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

// Promote user to admin by email
export const adminPromoteUserByEmail = async (req, res, next) => {
  try {
    const email = (req.body?.email || "").toLowerCase().trim();
    if (!email) throw createError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User not found");

    if (user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// Demote admin to user by email
export const adminDemoteUserByEmail = async (req, res, next) => {
  try {
    const email = (req.body?.email || "").toLowerCase().trim();
    if (!email) throw createError(400, "Email is required");

    if (req.user?.email && req.user.email.toLowerCase() === email) {
      throw createError(400, "You cannot demote yourself");
    }

    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User not found");

    if (user.role !== "user") {
      user.role = "user";
      await user.save();
    }

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// ─── Builds ───────────────────────────────────────────────────────────────────

export const adminGetBuilds = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Build.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Build.countDocuments(),
    ]);

    res.json({ data, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
};