import express from "express";
import { router } from "../router/index.js";
import cors from "cors";
import multer from "multer";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({ origin: "*" }))

app.use("/cdn", express.static('./assets'))
app.use(router);