import multer from "multer";
import { getFileExtension } from "../utils/index.js"

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets/images/')
    },
    filename: function (req, file, cb) {
        const extension = getFileExtension(file.originalname);
        const filename = `${Date.now()}.${extension}`
        cb(null, filename);
    }
})


export const upload = multer({ storage });