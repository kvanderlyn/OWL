import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export function error(
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const msg = JSON.parse(err.message);
        res.status(err.statusCode).json({ msg })
    } catch (error) {
        res.status(err.statusCode).json({ msg: err.message })
    }
}