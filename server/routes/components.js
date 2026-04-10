import { Router } from "express";
import {
  getComponents,
  getComponentById,
  getCategories,
  getBrands,
} from "../controllers/componentController.js";

const router = Router();

// Static routes first (before /:id to avoid conflicts)
router.get("/categories", getCategories);
router.get("/brands", getBrands);

// Main listing + single component
router.get("/", getComponents);
router.get("/:id", getComponentById);

export default router;
