import { Router } from "express";
import { addItem, getItems } from "../handlers/itemHandlers";
import {
      validateNameInBody,
      validateWishlistIdInBody,
      validateWishlistIdQuery,
} from "../middleware/validator-functions";

const itemRouter = Router();

itemRouter.get("/", (_req, res) => {
      res.status(200).json({ status: "OK!" });
});
itemRouter.post("/add-item", validateNameInBody(), validateWishlistIdInBody(), addItem);
itemRouter.get("/get-items", validateWishlistIdQuery(), getItems);

export default itemRouter;
