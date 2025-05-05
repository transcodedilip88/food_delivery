const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String },
    addresses: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      location: {
        type: { type: String, enum: ["Point"] },
        coordinates: { type: [Number] },
      },
    },
    menu: [{ name: { type: String }, price: { type: Number } }],
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema);
