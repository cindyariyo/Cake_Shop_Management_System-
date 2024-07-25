const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.use((req, res) => {
  const url = req.url.replace('/proxy/', '');
  req.pipe(request(url)).pipe(res);
});

app.listen(PORT, () => {
  console.log(`CORS proxy listening on port ${PORT}`);
});
