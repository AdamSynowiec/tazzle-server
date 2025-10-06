const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3001;

const indexRouterV1 = require("./routes/v1/index.js");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1", indexRouterV1);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
