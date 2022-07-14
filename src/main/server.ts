import express from "express";

const app = express();

const PORT = 5050;
app.listen(PORT, () =>
  console.log(`Server started with http://localhost:${PORT}`)
);
