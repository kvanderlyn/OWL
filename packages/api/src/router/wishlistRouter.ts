import { Router } from "express";
import {
      createWishlist,
      deleteWishlistByUserAndId,
      getWishlistByUser,
      updateWishlist,
} from "../handlers/wishlistHandlers";
import { validateIdInBody, validateNameInBody } from "../middleware/validator-functions";

const wishlistRouter = Router();

wishlistRouter.get("/", (_req, res) => {
      res.status(200).json({ status: "OK!" });
});
wishlistRouter.get("/get-wishlists", getWishlistByUser);
wishlistRouter.post("/create-wishlist", validateNameInBody(), createWishlist);
wishlistRouter.delete("/remove-wishlist", validateIdInBody(), deleteWishlistByUserAndId);
wishlistRouter.put("/rename-wishlist", validateIdInBody(), validateNameInBody(), updateWishlist);

export default wishlistRouter;
