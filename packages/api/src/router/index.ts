import { Router } from "express";
import claimRouter from "./claimsRouter";
import friendRouter from "./friendsRouter";
import itemRouter from "./itemRouter";
import userRouter from "./usersRouter";
import wishlistRouter from "./wishlistRouter";

const apiRouter = Router();

apiRouter.use("/items", itemRouter);
apiRouter.use("/wishlists", wishlistRouter);
apiRouter.use("/friends", friendRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/claims", claimRouter);

export default apiRouter;
