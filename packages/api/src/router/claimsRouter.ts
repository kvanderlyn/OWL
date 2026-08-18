import { Router } from "express";
import { createClaim, deleteClaim, getClaimsByWishlist, updateClaim } from "../handlers/claimsHandler";
import {
      validateIdInBody,
      //   validateNameInBody,
      //   validateWishlistIdInBody,
      validateWishlistIdQuery,
} from "../middleware/validator-functions";

const claimRouter = Router();

claimRouter.get("/", (_req, res) => {
      res.status(200).json({ status: "OK!" });
});
claimRouter.post("/add-claim", validateIdInBody(), createClaim);
claimRouter.get("/get-claims-by-wishlist", validateWishlistIdQuery(), getClaimsByWishlist);
claimRouter.put("/update-claim", validateIdInBody(), updateClaim);
claimRouter.delete("/delete-claim", validateIdInBody(), deleteClaim);

export default claimRouter;
