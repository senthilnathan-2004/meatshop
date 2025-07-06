import mongoose from "mongoose";


const nutritionSchema = new mongoose.Schema({
  calories: Number,
  protein: String,
  fat: String,
  carbs: String
}, { _id: false });

const userReviewSchema = new mongoose.Schema({
  username: String,
  comment: String,
  rating: Number,
  date: { type: Date, default: Date.now }
}, { _id: false });


const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  rating: { type: Number, default: 0 },
  price: { type: Number, required: true },
  image_url: { type: String },
  link: { type: String },
  category: { type: String },
  availability: { type: String },
  weight: { type: String },
  nutrition: nutritionSchema,
  expiration_date: { type: Date },
  supplier: { type: String },
  tags: [String],
  user_reviews: [userReviewSchema],
}, {
  timestamps: true
})

export const Chicken = mongoose.model("chicken", schema, "chicken");

export const Mutton= mongoose.model("mutton", schema, "mutton");

export const Fish = mongoose.model("fish", schema, "fish");