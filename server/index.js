const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

// Middleware
app.use(express.json());
app.use(cors());

// Connect to db
mongoose.connect(
  "mongodb+srv://expressUser:bkQ8i3FRi2oxnIrq@cluster0-wqfvl.mongodb.net/CreativeProject?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);
mongoose.connection.on("connected", () => console.log("Connected"));
mongoose.connection.on("error", () => console.log("Connection failed with - "));

const posts = require("./routes/api/posts");

app.use("/api/posts", posts);

const auth = require("./routes/api/auth.js");

app.use("/api/user", auth);

const normalizePort = port => parseInt(port,10);
const port = normalizePort(process.env.PORT || 5000);

app.listen(port, () => console.log("Server started on port ", port));
