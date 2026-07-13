import { Router } from "express";
import { addItem, deleteItem, getAllItems, getItemById, updateItem } from "../handlers/itemHandlers";
import { validateUserIdQuery } from "../middleware/validator-functions";
import { getWishlistByUser } from "../handlers/wishlistHandlers";

const itemRouter = Router()

itemRouter.get('/', (req, res) => {
    res.status(200).json({ "status": "OK!" })
})
itemRouter.get("/get-wishlist", validateUserIdQuery(), getWishlistByUser);
export default itemRouter