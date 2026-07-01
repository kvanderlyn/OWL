import express from "express";
import { notFound, error } from "./middleware";
import bodyParser from "body-parser";
import itemRouter from "./router/itemRouter";

const app = express();

app.use(bodyParser.urlencoded())
app.use(bodyParser.json());

app.use("/api", itemRouter)

app.use(notFound)
app.use(error)

export default app