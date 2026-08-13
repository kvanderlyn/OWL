import { Router } from "express";
import { addItem, deleteItem, getItems, updateItem } from "../handlers/itemHandlers";
import {
      validateIdInBody,
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
itemRouter.put("/update-item", validateIdInBody(), updateItem);
itemRouter.delete("/delete-item", validateIdInBody(), deleteItem);

export default itemRouter;
