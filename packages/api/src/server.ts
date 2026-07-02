import express from "express";
import { notFound, error } from "./middleware";
import bodyParser from "body-parser";
import itemRouter from "./router/itemRouter";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";

const app = express();
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(bodyParser.urlencoded())
app.use(bodyParser.json());

app.use("/api", itemRouter)

app.use(notFound)
app.use(error)

export default app