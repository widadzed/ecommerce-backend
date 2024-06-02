const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const shoppingCartRoutes = require('./routes/shoppingcartRoutes');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/27017', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());

app.use(cors(
  '*'
));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shopping-cart', shoppingCartRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
