const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const cors = require("cors");
dotenv.config({ path: "config/config.env" });

const imageRoute = require("./routes/image");

const app = express();
//CONFIG

app.use(express.static(path.resolve("./uploads")));

app.use("/api", imageRoute);

app.use(
    cors({
        orgin: "*",
    })
);

app.listen(process.env.PORT, () => {
    console.log("Server is running!!!");
});
