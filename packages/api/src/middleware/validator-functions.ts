import { body, param, query, type Result, type ValidationError } from "express-validator";

export function validateIdParam() {
      return param("id").toInt().isInt();
}
export function validateItemName() {
      return body("name").notEmpty().isString().trim().escape();
}
export function validateItemDescription() {
      return body("description").isString().trim().escape();
}

export function validateIdInBody() {
      return body("id").notEmpty().escape();
}
export function validateUserIdQuery() {
      return query("userId").notEmpty().isString();
}

export function validateNameInBody() {
      return body("name").notEmpty().isString().trim().escape();
}

export function validateWishlistIdInBody() {
      return body("wishlistId").notEmpty().escape();
}

export function validateWishlistIdQuery() {
      return query("wishlistId").notEmpty().escape();
}

export function formatValidatorErrorMessage(errorList: Result<ValidationError>) {
      const errorString = errorList.array().map((error) => {
            if (error.type === "field") {
                  return `${error.path} ${error.msg} in ${error.location}`;
            }
            return `${error.msg}`;
      });
      return errorString.join(" | ");
}
