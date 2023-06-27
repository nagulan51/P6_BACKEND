import { Schema, model as Model } from "mongoose"
import * as Constants from "../../constants/index.js";

export const schama = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export const model = Model(Constants.Models.Users, schama);