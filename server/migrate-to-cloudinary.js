const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { connectDB, Season } = require('./db');

// Ensure Cloudinary is configured
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (!isCloudinaryConfigured) {
  console.error('❌ Cloudinary environment variables are missing in server/.env!');
  console.error('Please make sure you have:');
  console.error('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET set.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✅ Cloudinary initialized for migration.');

async function migrate() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB.');

    // Fetch all seasons
    const seasons = await Season.find();
    console.log(`🔍 Found ${seasons.length} seasons in the database.`);

    let totalMigratedFiles = 0;
    let totalUpdatedDocs = 0;

    for (let season of seasons) {
      let isSeasonUpdated = false;
      console.log(`\n--------------------------------------------`);
      console.log(`📂 Processing: Season ${season.id} - "${season.title}"`);
      console.log(`--------------------------------------------`);

      for (let ep of season.episodes) {
        console.log(`▶️ Episode: "${ep.title}" (ID: ${ep.id})`);

        // Check thumbnail
        if (ep.thumbnail && ep.thumbnail.startsWith('/uploads/')) {
          const localFileName = ep.thumbnail.split('/uploads/')[1];
          const localFilePath = path.join(__dirname, 'uploads', localFileName);

          if (fs.existsSync(localFilePath)) {
            console.log(`  📸 Found local thumbnail file: ${localFileName}. Uploading to Cloudinary...`);
            try {
              const result = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'image',
                folder: 'shreeshflix'
              });
              console.log(`  🎉 Uploaded! URL: ${result.secure_url}`);
              ep.thumbnail = result.secure_url;
              isSeasonUpdated = true;
              totalMigratedFiles++;
            } catch (uploadErr) {
              console.error(`  ❌ Failed to upload thumbnail:`, uploadErr.message);
            }
          } else {
            console.warn(`  ⚠️ Local thumbnail file does not exist on disk at: ${localFilePath}`);
          }
        }

        // Check video
        if (ep.videoUrl && ep.videoUrl.startsWith('/uploads/')) {
          const localFileName = ep.videoUrl.split('/uploads/')[1];
          const localFilePath = path.join(__dirname, 'uploads', localFileName);

          if (fs.existsSync(localFilePath)) {
            console.log(`  🎥 Found local video file: ${localFileName}. Uploading to Cloudinary (this might take a moment)...`);
            try {
              const result = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'video',
                folder: 'shreeshflix'
              });
              console.log(`  🎉 Uploaded! URL: ${result.secure_url}`);
              ep.videoUrl = result.secure_url;
              isSeasonUpdated = true;
              totalMigratedFiles++;
            } catch (uploadErr) {
              console.error(`  ❌ Failed to upload video:`, uploadErr.message);
            }
          } else {
            console.warn(`  ⚠️ Local video file does not exist on disk at: ${localFilePath}`);
          }
        }
      }

      if (isSeasonUpdated) {
        // We must mark modified since it's an array of subdocuments
        season.markModified('episodes');
        await season.save();
        console.log(`💾 Successfully updated and saved Season ${season.id} in MongoDB!`);
        totalUpdatedDocs++;
      } else {
        console.log(`ℹ️ No local uploads needed migration for Season ${season.id}.`);
      }
    }

    console.log(`\n============================================`);
    console.log(`🏁 MIGRATION COMPLETE!`);
    console.log(`============================================`);
    console.log(`📊 Total files migrated and uploaded to Cloudinary: ${totalMigratedFiles}`);
    console.log(`📊 Total MongoDB Season records updated: ${totalUpdatedDocs}`);
    console.log(`============================================\n`);

  } catch (error) {
    console.error('❌ Migration failed with error:', error);
  } finally {
    // Close DB connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed safely.');
    process.exit(0);
  }
}

migrate();
