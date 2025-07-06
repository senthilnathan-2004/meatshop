import { Cart } from '../model/cart.model.js';
import { Chicken, Mutton, Fish } from '../model/product.model.js';

const models = {
  chicken: Chicken,
  mutton: Mutton,
  fish: Fish,
};

export const addToCart = async (req, res) => {
  const { productId, category, quantity} = req.body;
  const userId = req.user._id;
  

  try {
    const Model = models[category];
    if (!Model) return res.status(400).json({ message: "Invalid product category" });

    const product = await Model.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const productTotal = product.price * quantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingIndex = cart.items.findIndex(
      item => item.productId.equals(productId) && item.category === category
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, category, quantity });
    }

    cart.totalPrice += productTotal;

    await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const ProductModel = models[item.category];
        const product = await ProductModel.findById(item.productId);
        return {
          ...item.toObject(),
          name: product?.name || 'Meat Item',
          price: product?.price || 0,
          image_url: product?.image_url || '/default-image.jpg',
        };
      })
    );

    res.status(200).json({
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: populatedItems,
        totalPrice: cart.totalPrice,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const removeCart = async (req, res) => {
  const { productId, category } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId &&
        item.category === category
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const item = cart.items[itemIndex];

    const productModel = {
      chicken: (await import('../model/product.model.js')).Chicken,
      mutton: (await import('../model/product.model.js')).Mutton,
      fish: (await import('../model/product.model.js')).Fish,
    }[category];

    const product = await productModel.findById(productId);
    const pricePerItem = product ? product.price : 0;

    if (item.quantity > 1) {
      item.quantity -= 1;
      cart.totalPrice -= pricePerItem;
    } else {
      cart.items.splice(itemIndex, 1); 
      cart.totalPrice -= pricePerItem;
    }

    await cart.save();

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
