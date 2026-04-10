import { Build } from "../../src/models/Build.js";
import { createError } from "../middleware/errorHandler.js";

/**
 * GET /api/builds
 * Returns all builds for the authenticated user.
 */
export const getUserBuilds = async (req, res, next) => {
  try {
    const builds = await Build.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(builds);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/builds/:id
 */
export const getBuildById = async (req, res, next) => {
  try {
    const build = await Build.findById(req.params.id).lean();
    if (!build) throw createError(404, "Build not found");

    if (build.user.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Access denied");
    }

    res.json(build);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/builds
 * Body: { title, prompt, budget, useCases, parts }
 */
export const createBuild = async (req, res, next) => {
  try {
    const { title, prompt, budget, useCases, parts } = req.body;

    if (!prompt?.trim()) throw createError(400, "Prompt is required");

    const build = await Build.create({
      user: req.user.id,
      title: title?.trim() || "My Build",
      prompt: prompt.trim(),
      budget: budget || null,
      useCases: useCases || [],
      parts: parts || [],
    });

    res.status(201).json(build);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/builds/:id
 * Body: partial { title, prompt, budget, useCases, parts, isPublic, status }
 */
export const updateBuild = async (req, res, next) => {
  try {
    const build = await Build.findById(req.params.id);
    if (!build) throw createError(404, "Build not found");

    if (build.user.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Access denied");
    }

    const { title, prompt, budget, useCases, parts, isPublic, status } = req.body;
    if (title !== undefined) build.title = title.trim();
    if (prompt !== undefined) build.prompt = prompt.trim();
    if (budget !== undefined) build.budget = budget;
    if (useCases !== undefined) build.useCases = useCases;
    if (parts !== undefined) build.parts = parts;
    if (isPublic !== undefined) build.isPublic = isPublic;
    if (status !== undefined) build.status = status;

    await build.save(); // triggers totalPrice pre-save hook

    res.json(build);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/builds/:id
 */
export const deleteBuild = async (req, res, next) => {
  try {
    const build = await Build.findById(req.params.id);
    if (!build) throw createError(404, "Build not found");

    if (build.user.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "Access denied");
    }

    await build.deleteOne();
    res.json({ message: "Build deleted" });
  } catch (err) {
    next(err);
  }
};