// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public')); // put index.html, style.css, script.js in a folder named public

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
