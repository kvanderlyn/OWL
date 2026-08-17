import { Router } from "express";
import friendRouter from "./friendsRouter";
import itemRouter from "./itemRouter";
import userRouter from "./usersRouter";
import wishlistRouter from "./wishlistRouter";

const apiRouter = Router();

apiRouter.use("/items", itemRouter);
apiRouter.use("/wishlists", wishlistRouter);
apiRouter.use("/friends", friendRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;
