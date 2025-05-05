const mongoose = require("mongoose");
const { USER_ROLE } = require("../../constants");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    role: {
      type: String,
      enum: [...Object.values(USER_ROLE)],
      default: "User",
    },
    vehicleType: { type: String, enum: ["bike", "scooter"], default: "bike" },
    socketId: { type: String, default: null },
    isLogin: { type: Boolean, default: false },
    phone: { type: Number },
    password: { type: String },
    profileImage: { type: String, default: "" },
    addresses: {
      label: { type: String, default: "Home" },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
      location: {
        type: { type: String, enum: ["Point"] },
        coordinates: { type: [Number] },
      },
    },
    favoriteRestaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    currrentLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
