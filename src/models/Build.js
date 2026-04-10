import mongoose from "mongoose";

const BuildSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "My Build",
      trim: true,
    },

    // User's original prompt to Gemini
    prompt: {
      type: String,
      required: true,
    },

    // Budget the user provided
    budget: {
      type: Number,
      default: null,
    },

    // Use case tags e.g. ["gaming", "4k", "streaming"]
    useCases: {
      type: [String],
      default: [],
    },

    // The actual parts in this build
    // Each part references a Component + stores snapshot of price at build time
    parts: [
      {
        component: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Component",
        },
        category: String,       // e.g. "cpu", "gpu" — for quick access
        name: String,           // Snapshot — in case component is deleted
        price: Number,          // Price at time of build
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    // Computed totals
    totalPrice: {
      type: Number,
      default: 0,
    },

    // Gemini's explanation of this build
    aiSummary: {
      type: String,
      default: null,
    },

    // Compatibility status
    isCompatible: {
      type: Boolean,
      default: null, // null = not yet checked
    },
    compatibilityNotes: {
      type: [String],
      default: [],
    },

    // Visibility
    isPublic: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "saved", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

// Auto-calculate totalPrice before saving
BuildSchema.pre("save", function (next) {
  if (this.parts && this.parts.length > 0) {
    this.totalPrice = this.parts.reduce(
      (sum, part) => sum + (part.price || 0) * (part.quantity || 1),
      0
    );
  }
  next();
});

BuildSchema.index({ user: 1 });
BuildSchema.index({ status: 1 });
BuildSchema.index({ isPublic: 1 });

export const Build =
  mongoose.models.Build || mongoose.model("Build", BuildSchema);