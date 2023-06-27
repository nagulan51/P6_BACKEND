import { Router } from "express";
import { Path } from "../../constants/index.js";
import * as Controllers from "../../controllers/index.js";
import * as middlewares from "../../middlewares/index.js";
import { upload } from "../../multer/index.js"



export const sauces = Router();


sauces.get(Path.sauces.index, middlewares.auth, Controllers.Sauce.getAllSauces);

sauces.get(Path.sauces.id, middlewares.auth, Controllers.Sauce.getSauceById);

sauces.post(Path.sauces.index, middlewares.auth, upload.single('image'), Controllers.Sauce.creatSauce);

sauces.put(Path.sauces.id, middlewares.auth, upload.single('image'), Controllers.Sauce.editSauce);

sauces.delete(Path.sauces.id, middlewares.auth, Controllers.Sauce.deleteSauce);

sauces.post(Path.sauces.like, middlewares.auth, Controllers.Sauce.linkAndDisLike);