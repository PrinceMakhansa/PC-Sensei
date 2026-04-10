import { Router } from "express";
import mongoose from "mongoose";
import {
  getUserBuilds,
  getBuildById,
  createBuild,
  updateBuild,
  deleteBuild,
} from "../controllers/buildController.js";
import { authenticate } from "../middleware/auth.js";
import { SavedBuild } from "../models/Build.js";

const router = Router();

// All build routes require authentication
router.use(authenticate);

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Saved builds
router.post("/save", async (req, res, next) => {
  try {
    const { buildId, title, parts, totalPrice, useCase } = req.body;
    if (!buildId || !title || !parts) {
      return res.status(400).json({ error: "buildId, title, and parts are required" });
    }

    const existing = await SavedBuild.findOne({ userId: req.user.id, buildId }).lean();
    if (existing) return res.status(200).json({ message: "Already saved" });

    const build = await SavedBuild.create({
      userId: req.user.id,
      buildId,
      title,
      parts,
      totalPrice,
      useCase,
    });

    return res.status(201).json(build);
  } catch (err) {
    return next(err);
  }
});

router.get("/my", async (req, res, next) => {
  try {
    const builds = await SavedBuild.find({ userId: req.user.id })
      .sort({ savedAt: -1 })
      .lean();
    return res.json(builds);
  } catch (err) {
    return next(err);
  }
});

router.get("/", getUserBuilds);
router.get("/:id", getBuildById);
router.post("/", createBuild);
router.put("/:id", updateBuild);
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (isObjectId(id)) {
    return deleteBuild(req, res, next);
  }

  try {
    await SavedBuild.deleteOne({ userId: req.user.id, buildId: id });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

export default router;
