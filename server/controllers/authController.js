import jwt from "jsonwebtoken";
import { User } from "../../src/models/User.js";
import { createError } from "../middleware/errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES = "7d";

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) throw createError(400, "Email and password are required");
    if (password.length < 8) throw createError(400, "Password must be at least 8 characters");

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw createError(409, "An account with this email already exists");

    const user = await User.create({
      name: name?.trim() || "",
      email: email.toLowerCase().trim(),
      password, // bcrypt hashing handled in User model pre-save hook
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw createError(400, "Email and password are required");

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) throw createError(401, "Invalid email or password");

    const valid = await user.comparePassword(password);
    if (!valid) throw createError(401, "Invalid email or password");

    const token = signToken(user);

    res.json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (requires authenticate middleware)
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) throw createError(404, "User not found");
    res.json(user.toPublicJSON());
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/profile  (requires authenticate middleware)
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (email && email.trim()) {
      const taken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user.id } });
      if (taken) throw createError(409, "Email already in use by another account");
      updates.email = email.toLowerCase().trim();
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) throw createError(404, "User not found");
    res.json(user.toPublicJSON());
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/google/callback — not implemented
export const googleCallback = async (req, res) => {
  res.status(501).json({ message: "Google OAuth not implemented" });
};