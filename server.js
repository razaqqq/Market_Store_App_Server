import { app } from "./app.js";
import { connectMongooseDatabase } from "./data/database.js";
import cloudinary from "cloudinary";
import Stripe from "stripe";

connectMongooseDatabase();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(
    "Server Listing On Port :",
    process.env.PORT,
    "in ",
    process.env.NODE_ENV,
    "MODE."
  );
});
