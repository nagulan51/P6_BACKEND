import * as env from "dotenv";

env.config();
export const http_port = Number(process.env.HTTP_PORT);
export const database_uri = process.env.DATABASE_URI;
export const http_server_uri = process.env.HTTP_SERVER_URI;
export const secret = process.env.SECRET;
export const environment = process.env.ENVIRONMENT;
export const log_file = process.env.LOG_FILE;

