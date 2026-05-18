const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

/*
  SENIOR DEV NOTE: BUSINESS PSYCHOLOGY & USER DATA
  -------------------------------------------------
  To the next dev taking over this codebase:
  Our core strategy for V2 involves high levels of personalization. 
  1. We need to implement user accounts (or recognize returning devices/loyalty cards).
  2. We must log every scan, removal, and completed purchase to build a "Purchase History".
  3. This data will be used to train a recommendation model so that the "Exclusive Promotions"
     section on the frontend displays products the user is most likely to buy (cross-selling).
  
  Please ensure you add a `User` schema and link it to the `Scans` collection when you build out the backend.
*/

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI || mongoURI.includes('your_credentials_here')) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  WARNING: MongoDB URI is not configured or is using the placeholder.');
    console.warn('\x1b[33m%s\x1b[0m', 'Please update the MONGODB_URI in the backend/.env file with your credentials.');
} else {
    mongoose.connect(mongoURI)
        .then(() => console.log('🚀 Connected to MongoDB Compass'))
        .catch(err => console.error('❌ MongoDB connection error:', err));
}

// Simple Product Schema
const productSchema = new mongoose.Schema({
    barcode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' }, // URL to online stock photo
    icon: { type: String, default: '📦' }, // Fallback emoji if image fails
    description: { type: String, default: 'No description available.' }
});

const Product = mongoose.model('Product', productSchema);

// User Schema for Loyalty System (Requested by user)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    password: { type: String, required: true },
    loyaltyPoints: { type: Number, default: 1250 },
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.send('SmartCart API is running...');
});

// Mock endpoint to get product by barcode
app.get('/api/products/:barcode', async (req, res) => {
    const { barcode } = req.params;
    
    // If not connected to DB, return mock data for demo
    if (mongoose.connection.readyState !== 1) {
        const mockDb = {
            '123456': { name: 'Fresh Strawberries', price: 2.99, image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=100&auto=format&fit=crop', description: 'Sweet and juicy fresh strawberries. Perfect for desserts or snacking.' },
            '789012': { name: 'Organic Milk 1L', price: 1.50, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop', description: 'Fresh organic whole milk. Rich in calcium and vitamins.' },
            '345678': { name: 'Dark Chocolate', price: 2.80, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=100&auto=format&fit=crop', description: 'Premium dark chocolate with 70% cocoa. Rich and intense flavor.' }
        };
        
        if (mockDb[barcode]) {
            return res.json(mockDb[barcode]);
        }
        return res.status(404).json({ message: 'Product not found (Mock Mode)' });
    }

    try {
        const product = await Product.findOne({ barcode });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Endpoint to get user data (Loyalty System) - Requested by user
app.get('/api/user/:id', async (req, res) => {
    // If not connected to DB, return mock user for demo
    if (mongoose.connection.readyState !== 1) {
        return res.json({ name: 'Mackenzie Loody', loyaltyPoints: 1250 });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            // For demo, if user not found, return mock data
            return res.json({ name: 'Mackenzie Loody', loyaltyPoints: 1250 });
        }
        res.json(user);
    } catch (error) {
        // Fallback for demo if ID is invalid or error occurs
        res.json({ name: 'Mackenzie Loody', loyaltyPoints: 1250 });
    }
});

// Endpoint to Signup (Requested by user)
app.post('/api/signup', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected. Please check your Atlas connection!' });
    }
    try {
        const { name, email, phone, password } = req.body;
        // Check if user already exists
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'Email already registered' });
        }
        
        const user = new User({ name, email, phone, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
});

// Endpoint to Login (Requested by user)
app.post('/api/login', async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        let user;
        if (email) {
            user = await User.findOne({ email, password });
        } else if (phone) {
            user = await User.findOne({ phone, password });
        }
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to seed products (Requested by user)
app.get('/api/seed-products', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected' });
    }
    try {
        const dummyProducts = [
            { barcode: '123456', name: 'Fresh Strawberries', price: 2.99, image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400&auto=format&fit=crop', description: 'Sweet and juicy fresh strawberries. Perfect for desserts or snacking.' },
            { barcode: '789012', name: 'Organic Milk 1L', price: 1.50, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop', description: 'Fresh organic whole milk. Rich in calcium and vitamins.' },
            { barcode: '345678', name: 'Dark Chocolate', price: 2.80, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&auto=format&fit=crop', description: 'Premium dark chocolate with 70% cocoa. Rich and intense flavor.' }
        ];
        
        await Product.deleteMany({}); // Clear existing products
        const products = await Product.insertMany(dummyProducts);
        res.json({ message: 'Products seeded successfully!', products });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding products', error: error.message });
    }
});

// Endpoint to add a product (for initialization/testing)
app.post('/api/products', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected' });
    }

    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`📡 Server running on http://localhost:${PORT}`);
});
