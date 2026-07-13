import { Router } from "express";
import itemRouter from "./itemRouter";
import wishlistRouter from "./wishlistRouter";

const apiRouter = Router()

apiRouter.use('/items', itemRouter);
apiRouter.use('/wishlists', wishlistRouter);

export default apiRouter