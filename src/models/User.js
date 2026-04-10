  import mongoose from "mongoose";
  import bcrypt from "bcryptjs";

  const UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
      password: {
        type: String,
        minlength: 6,
        select: false,
      },
      googleId: {
        type: String,
        sparse: true,
      },
      avatar: {
        type: String,
        default: null,
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      savedBuilds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Build",
        },
      ],
      isActive: {
        type: Boolean,
        default: true,
      },
      lastLogin: {
        type: Date,
        default: null,
      },
    },
    { timestamps: true }
  );

  // Hash password before saving
  UserSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
  });

  // Compare passwords
  UserSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
  };

  // Safe public profile
  UserSchema.methods.toPublicJSON = function () {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      role: this.role,
      savedBuilds: this.savedBuilds,
      createdAt: this.createdAt,
    };
  };

  export const User = mongoose.models.User || mongoose.model("User", UserSchema);