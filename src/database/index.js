import mongoose, { Mongoose, Error as MongooseError } from "mongoose";
import { database_uri } from "../env.js";
import { log } from "../log/index.js";

export class Database {
    constructor () {
        this.mongoose = mongoose;
        this.mongoose.set("strictQuery", true);

        if (!database_uri) {
            log("error to get database uri in .env", "error", "mongodb", "starting");
            process.exit(0);
        }
    }
    async connect() {
        try {
            await this.mongoose.connect(database_uri, { family: 4 })
            log({
                message: "database connect",
                type: "info",
                from: "mongodb",
                scene: "starting"
            });
        } catch (error) {
            if (error instanceof MongooseError) log({ message: error.message, type: "error", from: "mongodb", scene: "starting" });;
            throw error;
        }
    }
    static async ping() {
        try {
            const pingstart = Date.now();
            await mongoose.connect(database_uri, { family: 4, serverSelectionTimeoutMS: 1000 });
            const pingend = Date.now();
            const ping = (pingend - pingstart);

            log({
                message: `database ping ${ping} ms`,
                type: "info",
                from: "mongodb",
                scene: "starting"
            });

            await mongoose.disconnect();
        } catch (error) {
            if (error instanceof MongooseError) {
                log({
                    message: error.message,
                    type: "error",
                    from: "mongodb ping",
                    scene: "starting"
                });
            } else {
                log({
                    message: "error to ping database",
                    type: "error",
                    from: "mongodb ping",
                    scene: "starting"
                });
            }
            throw error;
        }
    }
    async disconnect() {
        return await this.mongoose.disconnect();
    }
}
