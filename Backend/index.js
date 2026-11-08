const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("MyDB is connected");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
app.get("/", (req, res) => {
  res.send("AuroraCart API is running 🚀");
});
app.use("/auth", require("./routes/auth"));
app.use("/bank", require("./routes/bank"));
app.use("/cart", require("./routes/cart"));
app.use("/product", require("./routes/product"));
app.use("/profile", require("./routes/profile"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});