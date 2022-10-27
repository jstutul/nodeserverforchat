const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res, next) =>
res.send("<h1>Server Running</h1>")
);

app.listen(port, () => {
  console.log(` server listening on port ${port}`);
});
