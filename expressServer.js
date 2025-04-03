const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.static(__dirname + '/public'));

// Serve index.html for multiple routes
app.get(['/mytunes.html', '/mytunes', '/index.html', '/'], (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/songs', (req, res) => {
  let song = req.query.title;
  if (!song) {
    res.json({ message: 'Please enter a song name' });
    return;
  }

  // Encode song title for URL
  const titleWithPlus = encodeURIComponent(song);

  const options = {
    method: 'GET',
    hostname: 'itunes.apple.com',
    port: null,
    path: `/search?term=${titleWithPlus}&entity=musicTrack&limit=20`,
    headers: {
      useQueryString: true
    }
  };

  // Send request to iTunes API
  http.request(options, function(apiResponse) {
    let songData = '';
    apiResponse.on('data', function(chunk) {
      songData += chunk;
    });
    apiResponse.on('end', function() {
      res.contentType('application/json').json(JSON.parse(songData));
    });
  }).end();
});

// Start server
app.listen(PORT, err => {
  if (err) console.log(err);
  else {
    console.log(`Server listening on port: ${PORT}`);
    console.log(`To Test:`);
    console.log(`http://localhost:3000`);
    console.log(`http://localhost:3000/mytunes.html`);
    console.log(`http://localhost:3000/mytunes`);
    console.log(`http://localhost:3000/index.html`);
    console.log(`http://localhost:3000/`);
  }
});
