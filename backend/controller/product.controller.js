import { Chicken, Mutton, Fish } from '../model/product.model.js';

const models = {
  chicken: Chicken,
  mutton: Mutton,
  fish: Fish,
};


export const chicken = async (req, res) => {
     try {

      const data = await Chicken.find({});


      if (!data || data.length === 0) {
            return res.status(404).json({
                  message: "No chicken products found"
            });
      }
      return res.status(200).json({
            chicken:data
      })

      } catch (error) {
       res.status(500).json({
            message: error.message
     })
      
     }
      
}
export const mutton = async (req, res) => {
        try {

      const data = await Mutton.find({});


      if (!data || data.length === 0) {
            return res.status(404).json({
                  message: "No mutton products found"
            });
      }
      return res.status(200).json({
            mutton:data
      })

      } catch (error) {
       res.status(500).json({
            message: error.message
     })
      
     }
}
export const fish = async (req, res) => {
        try {

      const data = await Fish.find({});


      if (!data || data.length === 0) {
            return res.status(404).json({
                  message: "No fish products found"
            });
      }
      return res.status(200).json({
            fish:data
      })

      } catch (error) {
       res.status(500).json({
            message: error.message
     })
      
     }
}
export const addReview = async (req, res) => {
  const { category } = req.params;
  const { productId, username, comment, rating } = req.body;

  try {
    const Model = models[category.toLowerCase()];
    if (!Model) return res.status(400).json({ message: 'Invalid category' });

     const updateResult = await Model.findByIdAndUpdate(
      productId,
      {
        $push: {
          user_reviews: {
            username,
            comment,
            rating,
            date: new Date()
          }
        }
      },
      { new: true } 
    );

    if (!updateResult) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const totalReviews = updateResult.user_reviews.length;
    const totalRating = updateResult.user_reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat((totalRating / totalReviews).toFixed(1));

   
    updateResult.rating = averageRating;
    await updateResult.save();

    res.status(200).json({
      message: 'Review added  successfully',
      
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const searchProduct = async (req, res) => {
      const { product } = req.params;
      const searchRegex = new RegExp(product, 'i'); 
      if (!product || product.trim() === '') {
        return res.status(400).json({ message: 'Search term cannot be empty' });
      }
      if (product.length < 3) {
        return res.status(400).json({ message: 'Search term must be at least 3 characters long' });
      }
      if (product.length > 15) {
        return res.status(400).json({ message: 'Search term must be less than 15 characters long' });
      }
      if (!/^[a-zA-Z0-9\s]+$/.test(product)) {
        return res.status(400).json({ message: 'Search term can only contain alphanumeric characters and spaces' });
      }
      if (product.includes(' ')) {
        return res.status(400).json({ message: 'Search term cannot contain spaces' });
      }
      if (product.includes('!') || product.includes('@') || product.includes('#') || product.includes('$') || product.includes('%') || product.includes('^') || product.includes('&') || product.includes('*')) {
        return res.status(400).json({ message: 'Search term cannot contain special characters' });
      }

  try {
    const chickenResults = await Chicken.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    });

    const muttonResults = await Mutton.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    });

    const fishResults = await Fish.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    });

    const allResults = [
      ...chickenResults.map(item => ({ ...item._doc, category: 'chicken' })),
      ...muttonResults.map(item => ({ ...item._doc, category: 'mutton' })),
      ...fishResults.map(item => ({ ...item._doc, category: 'fish' })),
    ];

    if (allResults.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({ results: allResults });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


