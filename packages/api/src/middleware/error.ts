import { Request, Response, NextFunction } from "express";

// export class ApiError extends Error {
//     message: string;
//     statusCode: number;
//     description: string;
//     constructor(message: string, statusCode: number) {
//         super(message);
//         this.statusCode = statusCode;
//         this.description = message
//         // console.log(message)
//     }
// }

// export function error(
//     err: ApiError,
//     req: Request,
//     res: Response,
//     // next: NextFunction
// ) {
//     try {
//         const msg = JSON.parse(err.description);
//         res.status(err.statusCode).json({ msg })
//     } catch (error) {
//         res.status(err.statusCode).json({ msg: err.message })
//     }
// }

export class ApiError extends Error {
    message: string;
    code: number;
    status: string;
    expected: boolean;
    errors: string[]
    constructor(message: string, statusCode = 500) {
        super(message);
        this.message = message;
        this.code = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.expected = true;
    }
}

export function error(
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const errorObject = {
            status: err.status,
            code: err.code,
            message: err.message,
            errors: err.errors,
        };
        res.status(err.code).json(errorObject)
    } catch (error) {
        res.status(err.code).json({ msg: err.message })
    }
}