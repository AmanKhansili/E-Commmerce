import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Products",
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Payment Done",
    },
  },
  { timestamps: true }
);

export const Order = model("Order", orderSchema);
