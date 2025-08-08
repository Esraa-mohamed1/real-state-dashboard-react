const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();
const BUILD_DIR = path.join(__dirname, 'build');
const PORT = process.env.PORT || 3000;

app.use(compression());

// Serve static assets from the React build
app.use(express.static(BUILD_DIR, {
  maxAge: '1y',
  index: false,
}));

// Example API route placeholder (remove if not needed)
// app.get('/api/health', (req, res) => res.json({ ok: true }));

// SPA fallback: for any other GET request, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
}); 