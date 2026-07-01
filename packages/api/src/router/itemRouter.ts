import { Router } from "express";
import { addItem, deleteItem, getAllItems, getItemById, updateItem } from "../handlers/itemHandlers";
import { validateIdParam, validateItemDescription, validateItemName } from "../middleware/validator-functions";

const itemRouter = Router()

itemRouter.get('/', (req, res) => {
    res.status(200).json({ "status": "OK!" })
})
itemRouter.get("/get-items", getAllItems);
itemRouter.get("/get-item/:id", validateIdParam(), getItemById);
itemRouter.post("/add-item", validateItemName(), validateItemDescription(), addItem);
itemRouter.put("/update-item/:id", validateIdParam(), validateItemName(), validateItemDescription(), updateItem);
itemRouter.delete("/delete-item/:id", validateIdParam(), deleteItem)

export default itemRouter