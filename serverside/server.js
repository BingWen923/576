// Setup Express
const express = require("express");
const cors    = require("cors");

const app = express();

// To help with accessing this server from Postman
app.use(cors());

// To help with POST and PUT requests to the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./app/routes/musicschool.routes.js")(app);

const path = require('path');
const port = process.env.PORT || 3000;

// Middleware or API routes for backend
// e.g., app.use('/api', yourApiRoutes);

// Serve static files from the React frontend 
app.use(express.static(path.join(__dirname, '../music_school/build')));

// Handle any requests that don't match API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../music_school/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;

process.env.TZ = 'UTC'; // important setting

app.listen(PORT, () => {
  console.log(`CORS enabled Express web server is running on port ${PORT}.`);
});