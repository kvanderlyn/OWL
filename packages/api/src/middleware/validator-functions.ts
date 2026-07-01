import { body, param } from "express-validator"

export function validateIdParam() {
    return param("id").toInt().isInt()
}
export function validateItemName() {
    return body("name").notEmpty().isString().trim().escape()
}
export function validateItemDescription() {
    return body("description").isString().trim().escape()
}