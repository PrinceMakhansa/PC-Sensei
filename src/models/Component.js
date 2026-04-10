import mongoose from "mongoose";

const ComponentSchema = new mongoose.Schema(
  {
    // Core identity
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "cpu",
        "cpu-cooler",
        "motherboard",
        "memory",
        "storage",
        "video-card",
        "case",
        "power-supply",
        "monitor",
        "os",
        "optical-drive",
        "external-storage",
        "sound-card",
        "wired-network",
        "wireless-network",
        "case-fan",
        "case-accessory",
        "fan-controller",
        "thermal-compound",
        "ups",
        "headphones",
        "keyboard",
        "mouse",
        "speakers",
        "webcam",
      ],
    },

    // Pricing
    price: {
      type: Number,
      default: null,
    },

    // Flexible specs — different for every category
    // e.g. CPU has cores/tdp, GPU has vram, RAM has speed
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // For AI — a plain text summary Gemini can read easily
    description: {
      type: String,
      default: null,
    },

    // Source tracking
    source: {
      type: String,
      default: "pc-part-dataset",
    },

    // For future image support
    imageUrl: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for fast querying
ComponentSchema.index({ category: 1 });
ComponentSchema.index({ price: 1 });
ComponentSchema.index({ name: "text", brand: "text" }); // Full-text search

export const Component =
  mongoose.models.Component || mongoose.model("Component", ComponentSchema);