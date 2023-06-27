import { environment, log_file } from "../env.js";
import { existsSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path"
/**
 * 
 * @param {{
 *  message: string,
 *  type: "error" | "info",
 *  from: string,
 *  scene: "starting" | "runing" | "ending"
 * }} docs 
 */
export const log = async (docs) => {
    try {
        const { message, type, from, scene } = docs;
        const date = new Date();
        const jj = date.getDate().toString().padStart(2, "0");
        const mm = (date.getMonth() + 1).toString().padStart(2, "0");
        const yyyy = date.getFullYear().toString()

        const log_file_path = path.resolve(log_file.replace(/{{JJ}}/, jj).replace(/{{MM}}/, mm).replace(/{{YYYY}}/, yyyy));
        console.log(log_file_path);


        const logMessage = `[${date.toLocaleString()}] ${type}: ${message} [process] --> ${scene} [from] --> ${from}`;

        if (environment === "dev") {
            console.log(logMessage);
        } else {
            const isFileExists = existsSync(log_file_path);
            let new_log_file_content;

            if (isFileExists) {
                const log_file_content = await readFile(log_file_path, "utf-8");
                new_log_file_content = `${log_file_content}\n${logMessage}`;
            } else {
                new_log_file_content = logMessage;
            }
            await writeFile(log_file_path, new_log_file_content);
            // save in file 
        }
    } catch (error) {
        console.log(error);
    }
};
