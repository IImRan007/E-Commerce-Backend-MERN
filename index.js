const express = require("express");
const connectDb = require("./db/connect");
require("dotenv").config();
require("colors");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const { errorHandler } = require("./middleware/errorMiddleware");
const PORT = process.env.PORT || 5000;

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDb();

// Using Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/product", require("./routes/productRoutes"));

app.get("/", (_, res) => {
  res.status(200).json({ message: "E-Commerce API" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is Running on Port:", PORT.blue);
});
