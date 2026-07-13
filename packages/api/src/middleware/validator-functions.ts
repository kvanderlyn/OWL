import { body, param, query, Result, ValidationError } from "express-validator"
import { toString } from "express-validator/lib/utils"

export function validateIdParam() {
    return param("id").toInt().isInt()
}
export function validateItemName() {
    return body("name").notEmpty().isString().trim().escape()
}
export function validateItemDescription() {
    return body("description").isString().trim().escape()
}
export function validateUserIdQuery() {
    return query("userId").notEmpty().isString()
}

export function formatValidatorErrorMessage(errorList: Result<ValidationError>) {
    const errorString = errorList.array().map((error) => {
        if (error.type === 'field') {
            return `${error.path} ${error.msg} in ${error.location}`
        } return `${error.msg}`
    })
    return errorString.join(" | ")
}