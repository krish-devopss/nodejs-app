const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Products data
const products = [
    { id: 1, name: "White T-Shirt", price: 19.99, category: "Clothing", image: "👕" },
    { id: 2, name: "Slim Jeans", price: 49.99, category: "Clothing", image: "👖" },
    { id: 3, name: "Running Shoes", price: 79.99, category: "Footwear", image: "👟" },
    { id: 4, name: "Leather Wallet", price: 29.99, category: "Accessories", image: "👛" },
    { id: 5, name: "Smart Watch", price: 199.99, category: "Electronics", image: "⌚" },
    { id: 6, name: "Backpack", price: 59.99, category: "Accessories", image: "🎒" }
];

let cart = [];

// Routes
app.get('/', (req, res) => {
    // Always pass all variables with default values
    res.render('home', { 
        products: products.slice(0, 3),
        orderSuccess: false,
        showCheckout: false,
        customerName: '',
        cart: [],
        cartTotal: 0
    });
});

app.get('/shop', (req, res) => {
    const category = req.query.category || 'all';
    let filtered = category === 'all' ? products : products.filter(p => p.category === category);
    res.render('shop', { 
        products: filtered, 
        selectedCategory: category,
        showCart: false,
        cart: [],
        cartTotal: 0
    });
});

app.post('/add-to-cart', (req, res) => {
    const { id, name, price } = req.body;
    const existing = cart.find(item => item.id === parseInt(id));
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id: parseInt(id), name, price: parseFloat(price), quantity: 1 });
    }
    
    res.redirect('/shop');
});

app.get('/cart', (req, res) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('shop', { 
        products: products, 
        selectedCategory: 'all',
        cart: cart, 
        cartTotal: total.toFixed(2),
        showCart: true 
    });
});

app.post('/update-cart', (req, res) => {
    const { id, quantity } = req.body;
    
    if (quantity <= 0) {
        cart = cart.filter(item => item.id !== parseInt(id));
    } else {
        const item = cart.find(item => item.id === parseInt(id));
        if (item) item.quantity = parseInt(quantity);
    }
    
    res.redirect('/cart');
});

app.get('/checkout', (req, res) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('home', { 
        products: products.slice(0, 3),
        orderSuccess: false,
        showCheckout: true,
        customerName: '',
        cart: cart,
        cartTotal: total.toFixed(2)
    });
});

app.post('/checkout', (req, res) => {
    const { name, email, address } = req.body;
    console.log('Order placed:', { name, email, address, cart });
    cart = [];
    res.render('home', { 
        products: products.slice(0, 3),
        orderSuccess: true,
        showCheckout: false,
        customerName: name,
        cart: [],
        cartTotal: 0
    });
});

// API endpoint for cart count
app.get('/api/cart-count', (req, res) => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ count: count });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
