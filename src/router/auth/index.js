import { Router } from "express";
import { Path } from "../../constants/index.js";
import * as Controllers from "../../controllers/index.js";

export const auth = Router();

auth.post(Path.auth.signup, Controllers.Auth.signup);
auth.post(Path.auth.signin, Controllers.Auth.signin);
