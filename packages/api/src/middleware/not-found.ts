import { Response, Request, NextFunction } from "express";
import { ApiError } from "./error";

export function notFound(req: Request, res: Response, next: NextFunction) {
    return next(new ApiError("Route not found", 404))
}