import { Router } from "express";
import friendRouter from "./friendsRouter";
import itemRouter from "./itemRouter";
import wishlistRouter from "./wishlistRouter";

const apiRouter = Router();

apiRouter.use("/items", itemRouter);
apiRouter.use("/wishlists", wishlistRouter);
apiRouter.use("/friends", friendRouter);

export default apiRouter;
