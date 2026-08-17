import { Router } from "express";
import { getUserByUsername } from "../handlers/usersHandler";
import { validateUsernameQuery } from "../middleware/validator-functions";

const userRouter = Router();

userRouter.get("/", (_req, res) => {
      res.status(200).json({ status: "OK!" });
});
userRouter.get("/get-user-by-username", validateUsernameQuery(), getUserByUsername);

export default userRouter;
