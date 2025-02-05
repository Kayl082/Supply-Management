const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6379'  // Default Redis connection
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

// CRUD Operations

// Route to save item data
app.post('/items', async (req, res) => {
  const { id, item_code, name, category, unit, quantity, date_received, expiration_date, supplier } = req.body;

  // Validate input fields
  if (!id || !item_code || !name || !category || !unit || !quantity || !date_received || !expiration_date || !supplier) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Set item data in Redis (using object syntax for Redis v4??? and above)
    const itemData = { item_code, name, category, unit, quantity, date_received, expiration_date, supplier };

    // Save item data in Redis hash
    await client.hSet(`item:${id}`, 'item_code', itemData.item_code);
    await client.hSet(`item:${id}`, 'name', itemData.name);
    await client.hSet(`item:${id}`, 'category', itemData.category);
    await client.hSet(`item:${id}`, 'unit', itemData.unit);
    await client.hSet(`item:${id}`, 'quantity', itemData.quantity);
    await client.hSet(`item:${id}`, 'date_received', itemData.date_received);
    await client.hSet(`item:${id}`, 'expiration_date', itemData.expiration_date);
    await client.hSet(`item:${id}`, 'supplier', itemData.supplier);

    // Respond with success message
    res.status(201).json({ message: 'Item saved successfully' });
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).json({ message: 'Failed to save item' });
  }
});

// Read (R)
app.get('/items/:id', async (req, res) => {
  const id = req.params.id;
  const item = await client.hGetAll(`item:${id}`);
  if (Object.keys(item).length === 0) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});


// Read all items
app.get('/items', async (req, res) => {
  const keys = await client.keys('item:*');
  const items = await Promise.all(keys.map(async (key) => {
    return { id: key.split(':')[1], ...(await client.hGetAll(key)) };
  }));
  res.json(items);
});

// Update (U)
app.put('/items/:id', async (req, res) => {
  const id = req.params.id;
  const { item_code, name, category, unit, quantity, date_received, expiration_date, supplier } = req.body;

  if (!item_code && !name && !category && !unit && !quantity && !date_received && !expiration_date  && !supplier) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const existingItem = await client.hGetAll(`item:${id}`);
    if (Object.keys(existingItem).length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update item data in Redis
    if (item_code) await client.hSet(`item:${id}`, 'item_code', item_code);
    if (name) await client.hSet(`item:${id}`, 'name', name);
    if (category) await client.hSet(`item:${id}`, 'category', category);
    if (unit) await client.hSet(`item:${id}`, 'unit', unit);
    if (quantity) await client.hSet(`item:${id}`, 'quantity', quantity);
    if (date_received) await client.hSet(`item:${id}`, 'date_received', date_received);
    if (expiration_date) await client.hSet(`item:${id}`, 'expiration_date', expiration_date);
    if (supplier) await client.hSet(`item:${id}`, 'supplier', supplier);

    res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item' });
  }
});

// Delete (D)
app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  await client.del(`item:${id}`);
  res.status(200).json({ message: 'Item deleted successfully' });
});


// Search
app.get('/search', async (req, res) => {
  const { query } = req.query; // Get the search query from the request
  const cursor = '0';  // Start with the initial cursor position
  let items = [];
  
  // Use SCAN to iterate through all item keys
  let scanResult = await client.scan(cursor, { MATCH: 'item:*' });
  let keys = scanResult[1];

  // Loop through the keys and get their values
  for (let key of keys) {
    const item = await client.hGetAll(key);
    if (item.name && item.name.includes(query)) { // Search by the 'name' field
      items.push(item);
    }
  }

  if (items.length === 0) {
    return res.status(404).json({ message: 'No items found' });
  }

  res.json(items);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});