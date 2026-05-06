const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://riteshpatidar088:q7bRXvvZiLsqgccO@cluster0.b2vgi2d.mongodb.net/shoutout?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("MongoDB connection error ❌", err));


const shoutoutSchema = new mongoose.Schema({
  message: { type: String, required: true },
  color: { type: String, default: "#6366f1" },
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const Shoutout = mongoose.model('Shoutout', shoutoutSchema);

app.get('/api/shoutouts', async (req, res) => {
  try {
    const shoutouts = await Shoutout.find().sort({ timestamp: -1 });
    res.json(shoutouts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/api/shoutouts', async (req, res) => {
  const { message, color } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const newShoutout = new Shoutout({ message, color });
    await newShoutout.save();
    res.status(201).json(newShoutout);
  } catch (err) {
    res.status(500).json({ error: "Failed to create shoutout" });
  }
});

app.post('/api/shoutouts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const shoutout = await Shoutout.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (shoutout) {
      res.json(shoutout);
    } else {
      res.status(404).json({ error: "Shoutout not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to like shoutout" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
