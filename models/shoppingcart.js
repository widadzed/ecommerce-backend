const mongoose = require('mongoose');

const shoppingCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user',
   required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'product',
       required: true },
      quantity: { type: Number }
    }
  ]
});



const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);

module.exports = ShoppingCart;

