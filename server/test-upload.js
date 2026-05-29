const path = require('path');
const fs = require('fs');

async function run() {
  console.log('Starting test-upload script...');
  const dummyFilePath = path.join(__dirname, 'dummy.png');
  fs.writeFileSync(dummyFilePath, 'dummy image content');
  
  try {
    const formData = new FormData();
    formData.append('title', 'Test Script Episode');
    formData.append('episodeType', 'image');
    
    const fileBuffer = fs.readFileSync(dummyFilePath);
    const fileBlob = new Blob([fileBuffer], { type: 'image/png' });
    formData.append('file', fileBlob, 'dummy.png');

    console.log('Sending POST request...');
    const response = await fetch('http://localhost:5000/api/seasons/1/episodes', {
      method: 'POST',
      body: formData
    });

    console.log('Response Status:', response.status);
    const bodyText = await response.text();
    try {
      const json = JSON.parse(bodyText);
      console.log('Response JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response is not JSON. Text body follows:');
      console.log(bodyText);
    }
  } catch (err) {
    console.error('Error during fetch:', err);
  } finally {
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
  }
}

run();
