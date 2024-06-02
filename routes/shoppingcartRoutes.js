const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/shoppingcart');

const jwt = require('jsonwebtoken');
const Product = require('../models/product');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const parstoken =  token.split(" ")[1];
    jwt.verify(parstoken, 'your_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        console.log('Authenticated user:', user);
        req.user = user;
        next();
    });
    
}

router.use(authenticateToken);
/*router.post('/add', async (req, res) => {
  console.log(req.user.userId);
  try {
    const { productId, quantity } = req.body;
    
    const userId = req.user.userId; 
    const shoppingCart = await ShoppingCart.findOne({ user: userId });
    if (!shoppingCart) {
      return res.status(404).json({ message: 'Shoppingcart not found' });
    }
    shoppingCart.items.push({product:productId ,quantity:quantity});
      await shoppingCart.save()
    
    res.status(200).json({ message: 'Product added to shopping cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId; 
    console.log(userId);

    const shoppingCart = await ShoppingCart.findOne({ user: userId });
    if (!shoppingCart) {
      return res.status(404).json({ message: 'Shopping cart not found' });
    }

    const existingItem = shoppingCart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      shoppingCart.items.push({ product: productId, quantity });
    }

    await shoppingCart.save();

    res.status(200).json({ message: 'Product added to shopping cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/items', async (req, res) => {
  try {
    const userId = req.user.userId; 

    const shoppingCart = await ShoppingCart.findOne({ user: userId });
    
    if (!shoppingCart) {
      return res.status(404).json({ message: 'Shopping cart not found' });
    }

    res.status(200).json(shoppingCart.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/remove/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id; 
    const shoppingCart = await ShoppingCart.findOne({ user: userId });
    if (!shoppingCart) {
      return res.status(404).json({ message: 'Shopping cart not found' });
    }
    await shoppingCart.removeProduct(productId);
    res.status(200).json({ message: 'Product removed from shopping cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user._id; 
    const shoppingCart = await ShoppingCart.findOne({ user: userId });
    if (!shoppingCart) {
      return res.status(404).json({ message: 'Shopping cart not found' });
    }
    await shoppingCart.clearCart();
    res.status(200).json({ message: 'Shopping cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
