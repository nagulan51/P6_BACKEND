import { app } from "./server/index.js";
import { http_port } from "./env.js";
import { Database } from "./database/index.js";
import { randomBytes } from "crypto";
import { init } from "./init/index.js"
const database = new Database();
const start = async () => {
    await Database.ping();
    await database.connect();
    await init();
    app.listen(http_port, () => {
        console.log(`server start in port ${http_port}`);
    });
}
start();