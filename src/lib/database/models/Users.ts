import config from "$lib/config/index";
import mongoose, { Schema } from "mongoose";
const SchemaTypes = mongoose.Schema.Types;

const usersSchema = new Schema({
  // MongoDB generates IDs by default
  id: {
    type: Number,
    required: true,
    unique: true, // Can't have the same ID, otherwise that would be weird
  },
  username: {
    type: String,
    required: true,
    unique: true, // Can't have the same username, otherwise that would be confusing
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Can't have the same email, otherwise that would be stupid
  },
  profile_picture: {
    type: String,
    required: false,
  },
  banner: {
    type: String,
    required: false,
  },
  staff: {
    type: Boolean,
    required: true,
    default: false,
  },
  credit: {
    type: SchemaTypes.Decimal128,
    required: true,
    default: 0.0,
  },
  cart: {
    // @audit @PEDRO_KUKUL Audit into Dotcom
    type: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Products" },
        quantity: Number,
        variations: [
          // @note Currently bugs-out if inputted with a variation that does not belong to the product
          { type: Schema.Types.ObjectId, ref: "ProductVariations" },
          { default: [] },
        ],
      },
    ],
    // Users don't have to have a cart. The cart is always cleared after orders are complete
    // Cart: [{product, quantity}]
    required: false,
  },
  channel_id: {
    // Personal order status/notification channel in format `user_${user._id}`
    type: String,
    required: true,
    unique: true,
  },
  firstAlert: {
    type: Boolean,
    required: false,
    default: false,
  },
  activation_token: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  reset_token: {
    type: String,
    required: false,
  },
  restrictions: {
    type: Number,
    required: true,
    default: 0, // No restrictions
  },
  timeZone: {
    type: String,
    required: true,
    default: config.server.defaultTimeZone, // Default for most systems
  },
});
export default mongoose.models.Users ?? mongoose.model("Users", usersSchema);

// The user type
export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  profile_picture?: string;
  banner?: string;
  staff: boolean;
  credit: number;
  cart?: {
    product: string;
    quantity: number;
    variations: string[];
  }[];
  channel_id: string;
  firstAlert?: boolean;
  activation_token?: string;
  token?: string;
  reset_token?: string;
  restrictions: number;
  timeZone: string;
  save: () => void;
};

export { usersSchema };

/*
# Restriction table

-1 - Banned
0 - None
1 - Temporarily disabled
2 - Ordering Only
3 - Website in read only mode
4 - Temporary administrator
5 - Reserved for future use
*/
