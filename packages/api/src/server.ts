import express from "express";
import cors from "cors";
import { notFound, error } from "./middleware";
import bodyParser from "body-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import cookieParser from "cookie-parser"
import 'dotenv/config';
import apiRouter from "./router";

const app = express();
app.use(
    cors({
        origin: [process.env.BETTER_AUTH_TRUSTED_URL!],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
)
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(cookieParser())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json());
app.use("/api", apiRouter)

app.use(notFound)
app.use(error)

export default app