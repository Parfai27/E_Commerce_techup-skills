import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../model/product.model";

dotenv.config();

const samples = [
  {
    name: "Sample Nike Shoes",
    category: "Shoes",
    price: 50000,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    imagePublicId: "seed-placeholder",
  },
  {
    name: "Sample Notebook",
    category: "Books",
    price: 8000,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    imagePublicId: "seed-placeholder",
  },
];

const seedDatabase = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");

    let inserted = 0;

    for (const sample of samples) {
      const existing = await Product.findOne({ name: sample.name });

      if (existing) {
        continue;
      }

      await Product.create(sample);
      inserted += 1;
    }

    console.log(`Seed finished. Added ${inserted} product(s). Existing products were left in place.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
