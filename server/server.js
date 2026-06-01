const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { connectDB, Season } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary Configuration & Fallback Detection
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary is configured and active.');
} else {
  console.log('Cloudinary is NOT configured. Falling back to local storage.');
}

// Ensure uploads directory exists if Cloudinary is not used, otherwise use /tmp for serverless env
const uploadDir = isCloudinaryConfigured ? '/tmp' : path.join(__dirname, 'uploads');
if (uploadDir !== '/tmp' && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Helper to upload file (to Cloudinary if configured, otherwise returns local path)
const uploadFile = async (fileObj, resourceType) => {
  if (isCloudinaryConfigured) {
    const result = await cloudinary.uploader.upload(fileObj.path, {
      resource_type: resourceType,
      folder: 'shreeshflix'
    });
    try {
      fs.unlinkSync(fileObj.path); // Clean up temp file from server
    } catch (err) {
      console.error('Failed to delete temp file:', err);
    }
    return result.secure_url;
  } else {
    return `/uploads/${fileObj.filename}`;
  }
};

// Helper to delete file from Cloudinary
const deleteCloudinaryFile = async (fileUrl, resourceType) => {
  if (!isCloudinaryConfigured || !fileUrl || !fileUrl.includes('res.cloudinary.com')) return;
  try {
    const parts = fileUrl.split('shreeshflix/');
    if (parts.length > 1) {
      const publicIdWithExt = 'shreeshflix/' + parts[1];
      const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      console.log(`Deleted Cloudinary file: ${publicId}`);
    }
  } catch (err) {
    console.error('Failed to delete file from Cloudinary:', err);
  }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB max

// Connect to MongoDB
connectDB();

// --- API ROUTES ---

// Get all seasons with episodes
app.get('/api/seasons', async (req, res) => {
  try {
    const seasons = await Season.find().sort({ id: 1 });
    res.json(seasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add an episode to a season (handles file uploads)
app.post('/api/seasons/:seasonId/episodes', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const seasonId = parseInt(req.params.seasonId, 10);
    const { title, episodeType } = req.body;
    
    let videoUrl = undefined;
    let thumbnail = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80';
    
    // Process files
    if (req.files) {
      if (episodeType === 'image' && req.files.file) {
        thumbnail = await uploadFile(req.files.file[0], 'image');
      } else if (episodeType === 'video' && req.files.file) {
        videoUrl = await uploadFile(req.files.file[0], 'video');
        if (req.files.thumbnailFile) {
          thumbnail = await uploadFile(req.files.thumbnailFile[0], 'image');
        }
      }
    }

    const newEp = {
      id: `custom_${Date.now()}`,
      title,
      thumbnail,
      videoUrl,
      duration: '',
      description: 'Newly uploaded episode',
      caption: '',
      dialogs: []
    };

    const season = await Season.findOne({ id: seasonId });
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    season.episodes.push(newEp);
    await season.save();

    res.status(201).json(season);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete an episode
app.delete('/api/seasons/:seasonId/episodes/:episodeId', async (req, res) => {
  try {
    const seasonId = parseInt(req.params.seasonId, 10);
    const { episodeId } = req.params;

    const season = await Season.findOne({ id: seasonId });
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const episode = season.episodes.find(ep => ep.id === episodeId);
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    // Try to delete associated files (handles Cloudinary and local)
    if (isCloudinaryConfigured) {
      if (episode.thumbnail && episode.thumbnail.includes('res.cloudinary.com')) {
        await deleteCloudinaryFile(episode.thumbnail, 'image');
      }
      if (episode.videoUrl && episode.videoUrl.includes('res.cloudinary.com')) {
        await deleteCloudinaryFile(episode.videoUrl, 'video');
      }
    } else {
      const filesToDelete = [];
      if (episode.thumbnail && episode.thumbnail.startsWith('/uploads/')) {
        filesToDelete.push(path.join(__dirname, 'uploads', episode.thumbnail.split('/uploads/')[1]));
      }
      if (episode.videoUrl && episode.videoUrl.startsWith('/uploads/')) {
        filesToDelete.push(path.join(__dirname, 'uploads', episode.videoUrl.split('/uploads/')[1]));
      }

      filesToDelete.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    season.episodes = season.episodes.filter(ep => ep.id !== episodeId);
    await season.save();

    res.json(season);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new season
app.post('/api/seasons', upload.single('thumbnailFile'), async (req, res) => {
  try {
    const { title, semester, tagline, description, auraModifier, attendance, tags } = req.body;
    
    // Find next available ID (skipping 7)
    let nextId = 1;
    while (await Season.findOne({ id: nextId }) || nextId === 7) {
      nextId++;
    }

    let thumbnail = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80';
    if (req.file) {
      thumbnail = await uploadFile(req.file, 'image');
    }

    // Parse tags (comma separated string from form body)
    let parsedTags = [];
    if (tags) {
      parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const newSeason = new Season({
      id: nextId,
      title: `Season ${nextId}: ${title}`,
      semester: semester || `Semester ${nextId}`,
      tagline: tagline || 'A new chapter of college life.',
      description: description || 'No description provided.',
      auraModifier: auraModifier || '+100 Aura',
      attendance: attendance || '75%',
      tags: parsedTags.length > 0 ? parsedTags : ['New Season'],
      episodes: []
    });

    await newSeason.save();

    // Return the updated list of seasons
    const updatedSeasons = await Season.find().sort({ id: 1 });
    res.status(201).json(updatedSeasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a season
app.delete('/api/seasons/:seasonId', async (req, res) => {
  try {
    const seasonId = parseInt(req.params.seasonId, 10);
    
    // Find the season first to delete any associated files/episodes if needed (e.g. local uploads/cloudinary)
    const season = await Season.findOne({ id: seasonId });
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    // Delete associated episode files in this season
    for (const episode of season.episodes) {
      if (isCloudinaryConfigured) {
        if (episode.thumbnail && episode.thumbnail.includes('res.cloudinary.com')) {
          await deleteCloudinaryFile(episode.thumbnail, 'image');
        }
        if (episode.videoUrl && episode.videoUrl.includes('res.cloudinary.com')) {
          await deleteCloudinaryFile(episode.videoUrl, 'video');
        }
      } else {
        const filesToDelete = [];
        if (episode.thumbnail && episode.thumbnail.startsWith('/uploads/')) {
          filesToDelete.push(path.join(__dirname, 'uploads', episode.thumbnail.split('/uploads/')[1]));
        }
        if (episode.videoUrl && episode.videoUrl.startsWith('/uploads/')) {
          filesToDelete.push(path.join(__dirname, 'uploads', episode.videoUrl.split('/uploads/')[1]));
        }
        filesToDelete.forEach(filePath => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
    }

    // Now delete the season
    await Season.deleteOne({ id: seasonId });

    // Return the updated list of seasons
    const updatedSeasons = await Season.find().sort({ id: 1 });
    res.json(updatedSeasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
