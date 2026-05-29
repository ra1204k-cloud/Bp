const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : 'mongodb://127.0.0.1:27017/shreeshflix';
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const dialogSchema = new mongoose.Schema({
  sender: String,
  text: String
});

const episodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: String,
  duration: String,
  thumbnail: String,
  videoUrl: String,
  description: String,
  caption: String,
  dialogs: [dialogSchema]
});

const seasonSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: String,
  semester: String,
  tagline: String,
  description: String,
  auraModifier: String,
  attendance: String,
  tags: [String],
  episodes: [episodeSchema],
  birthdayMessage: {
    title: String,
    subtitle: String,
    content: [String],
    wishes: [String]
  }
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = { connectDB, Season };
