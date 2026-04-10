import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  getDashboardStats,
  adminGetComponents,
  adminCreateComponent,
  adminUpdateComponent,
  adminDeleteComponent,
  adminGetUsers,
  adminDeleteUser,
  adminPromoteUserByEmail,
  adminDemoteUserByEmail,
  adminGetBuilds,
} from "../controllers/adminController.js";

const router = Router();

// All admin routes require a valid JWT + admin role
router.use(authenticate);
router.use(requireRole("admin"));

// Dashboard
router.get("/stats", getDashboardStats);

// Components CRUD
router.get("/components", adminGetComponents);
router.post("/components", adminCreateComponent);
router.put("/components/:id", adminUpdateComponent);
router.delete("/components/:id", adminDeleteComponent);

// Users
router.get("/users", adminGetUsers);
router.delete("/users/:id", adminDeleteUser);
router.post("/admins", adminPromoteUserByEmail);
router.post("/admins/demote", adminDemoteUserByEmail);

// Builds
router.get("/builds", adminGetBuilds);

export default router;