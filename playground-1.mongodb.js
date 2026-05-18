// MongoDB Playground
// Use Ctrl+Space to see completions or force install the extension.

// Select the database to use.
use('smartcart');

// Insert a few documents into the products collection.
db.getCollection('products').insertMany([
  { 'barcode': '123456', 'name': 'Fresh Strawberries', 'price': 2.99, 'icon': '🍓' },
  { 'barcode': '789012', 'name': 'Organic Milk 1L', 'price': 1.50, 'icon': '🥛' },
  { 'barcode': '345678', 'name': 'Dark Chocolate', 'price': 2.80, 'icon': '🍫' },
  { 'barcode': '555555', 'name': 'Banana (Bunch)', 'price': 1.99, 'icon': '🍌' },
  { 'barcode': '666666', 'name': 'Coca Cola 500ml', 'price': 1.50, 'icon': '🥤' }
]);

// Run a find command to view the results.
db.getCollection('products').find({});
