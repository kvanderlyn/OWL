import { toNodeHandler } from "better-auth/node";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { error, notFound } from "./middleware";
import { auth } from "./utils/auth";
import "dotenv/config";
import { type AuthRequest, getUserData } from "./middleware/authVerification";
import apiRouter from "./router";

const app = express();
app.use(
      cors({
            origin: [process.env.BETTER_AUTH_TRUSTED_URL || ""],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
      }),
);
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(getUserData);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use("/api", apiRouter);
app.get("/me", (req: AuthRequest, res) => {
      res.status(200).json({ user: req.user });
});
app.use(notFound);
app.use(error);

export default app;
