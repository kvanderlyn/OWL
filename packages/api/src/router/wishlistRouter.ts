import { Router } from "express";
import {
      createWishlist,
      deleteWishlistByUserAndId,
      getCurrentUserWishlists,
      getFriendWishlistById,
      updateWishlist,
} from "../handlers/wishlistHandlers";
import { validateIdInBody, validateIdQuery, validateNameInBody } from "../middleware/validator-functions";

const wishlistRouter = Router();

wishlistRouter.get("/", (_req, res) => {
      res.status(200).json({ status: "OK!" });
});
wishlistRouter.get("/get-wishlists", getCurrentUserWishlists);
wishlistRouter.post("/create-wishlist", validateNameInBody(), createWishlist);
wishlistRouter.delete("/remove-wishlist", validateIdInBody(), deleteWishlistByUserAndId);
wishlistRouter.put("/rename-wishlist", validateIdInBody(), validateNameInBody(), updateWishlist);
wishlistRouter.get("/get-friend-wishlist", validateIdQuery(), getFriendWishlistById);
export default wishlistRouter;
