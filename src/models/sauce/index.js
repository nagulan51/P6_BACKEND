import { Schema, model as Model } from "mongoose";
import * as Constants from "../../constants/index.js";


export const schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mainPepper: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    heat: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    usersLiked: {
        type: [String],
        default: [],
    },
    usersDisliked: {
        type: [String],
        default: [],
    },
});

export const model = Model(Constants.Models.Sauces, schema);
