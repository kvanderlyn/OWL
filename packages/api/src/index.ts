import 'dotenv/config';
import app from './server';
import { db } from "@owl/db";
import { DatabaseError } from "pg";

db.$client.connect().then(() => {
    const port = process.env.API_PORT || 3001;
    app.listen(port);
    console.log("Express server has started on port", port)
}).catch((error: unknown) => {
    if (error instanceof DatabaseError) {
        console.log(error.message)
    } else {
        console.log('Could not connect')
    }
})