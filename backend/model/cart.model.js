import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  category: {
    type: String,
    enum: ['chicken', 'mutton', 'fish'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true, 
      unique: true },

  items: [cartItemSchema],
  
  totalPrice: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Cart = mongoose.model("cart", cartSchema);
