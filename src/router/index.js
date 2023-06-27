import { Router } from "express";
import { auth } from "./auth/index.js";
import { sauces } from "./sauces/index.js";
import { not_found } from "./not_found/index.js"
import * as middlewares from "../middlewares/index.js"

export const router = Router();

router.use(auth);
router.use(sauces);
router.use(not_found);