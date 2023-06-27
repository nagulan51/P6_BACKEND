import * as Models from "../models/index.js";
import { log } from "../log/index.js"
export const purge = async () => {
    await Models.Sauce.model.deleteMany({});
    log({
        from: "purge fonction",
        message: "database purge",
        scene: "starting",
        type: "info"
    });
};