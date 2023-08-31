import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
dotenv.config();

import playerRoutes from "./routes/player.js";
import rankingRoutes from "./routes/ranking.js";
import saveFootballData from "./db-football-data/parseCSV.js";

//app
const app = express();

//port
const port = process.env.PORT || 8080;

//db
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        //detect changes?
        if (true === false) saveFootballData();
        app.listen(port, () =>
            console.log(`Server is running on port: ${port}`)
        );
    })
    .catch((err) => console.log("Error connecting to database: ", err.message));

//middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

//routes
app.use("/players", playerRoutes);
app.use("/rankings", rankingRoutes);
