import { request, response } from "express";
import * as Models from "../../models/index.js";
import { Error as MongooseError } from "mongoose";
import { http_server_uri } from "../../env.js";
import * as Constants from "../../constants/index.js";
import { SauceContoller } from "../../utils/index.js"
/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getAllSauces = async (req, res) => {

    try {
        const sauces = await Models.Sauce.model.find({});
        for (let i = 0; i < sauces.length; i++) {
            const sauce = sauces[i];
            sauce.imageUrl = `${http_server_uri}${sauce.imageUrl}`
        }
        res.status(200).json(sauces);
    } catch (error) {
        if (error instanceof MongooseError) res.status(500).json({ message: "Impossible de trouvé les sauces dans la base de données." });
        else if (error instanceof Error) res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {()=>void} next 
 */
export const getSauceById = async ({ params }, res) => {
    try {
        const sauceId = params.id;
        const sauce = await Models.Sauce.model.findById(sauceId);
        sauce.imageUrl = `${http_server_uri}${sauce.imageUrl}`

        if (!sauce) return res.status(404).json({ message: "La sauce est introuvable." });
        res.status(200).json(sauce);
    } catch (error) {
        if (error instanceof MongooseError) res.status(500).json({ message: "Impossible de trouvé la sauce dans la base de données." });
        else if (error instanceof Error) res.status(500).json({ message: error.message });
    }
};
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {()=>void} next 
 */
export const creatSauce = async (req, res, next) => {
    try {
        const { user } = req;
        const sauce = JSON.parse(req.body.sauce);

        // check if sauce is valide
        const message = SauceContoller(sauce);
        if (message) return res.status(400).json({ message });
        const { name, manufacturer, description, mainPepper, heat, userId } = sauce;

        if (String(user._id) !== userId) return res.status(400).json({ message: "le jeton ne correspond pas au champ `userId` donné", });

        const filename = req.file.filename;
        const imageUrl = Constants.Path.image.index.replace(/:filename/, filename);

        await Models.Sauce.model.create({
            userId,
            name,
            manufacturer,
            description,
            mainPepper,
            imageUrl,
            heat,
        });
        res.status(200).json({ message: `La sauce "${name}" a bien été crée.` })
    } catch (error) {
        if (error instanceof MongooseError) res.status(500).json({ message: "Impossible de crée la sauce dans la base de données." });
        else if (error instanceof Error) res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {()=>void} next 
 */
export const editSauce = async ({ user, params, headers, body, file }, res, next) => {
    try {
        let sauceData;
        let imageUrl = null;
        const sauceId = params.id;
        const sauce = await Models.Sauce.model.findById({ _id: sauceId });
        if (!sauce) return res.status(404).json({ message: "La sauce est introuvable." });
        if (String(user._id) !== sauce.userId) return res.status(400).json({ message: "Vous nette pas le propriétaire de la sauce.", });

        if (headers["content-type"] === "application/json") {
            sauceData = body
        } else {
            const json = JSON.parse(body.sauce);
            const { name, manufacturer, description, mainPepper, heat, userId } = json;

            imageUrl = Constants.Path.image.index.replace(/:filename/, file.filename);
            sauceData = { name, manufacturer, description, mainPepper, heat, userId, imageUrl };
        }
        // check if sauce is valide
        const message = SauceContoller(sauceData);
        if (message) return res.status(400).json({ message });

        if (String(user._id) !== sauceData.userId) return res.status(400).json({ message: "le jeton ne correspond pas au champ `userId` donné", });

        await Models.Sauce.model.updateOne({ _id: sauceId }, sauceData);

        res.status(200).json({ message: `La sauce "${sauce.name}" a bien été modifier.` });
    } catch (error) {
        if (error instanceof MongooseError) res.status(500).json({ message: "Impossible de modifier la sauce dans la base de données." });
        else if (error instanceof Error) res.status(500).json({ message: error.message });
    }

}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {()=>void} next 
 */
export const deleteSauce = async ({ params, user }, res, next) => {
    try {
        const sauceId = params.id;
        const sauce = await Models.Sauce.model.findById(sauceId);
        if (!sauce) return res.status(404).json({ message: "La sauce est introuvable." });
        if (String(user._id) !== sauce.userId) return res.status(400).json({ message: "Vous nette pas le propriétaire de la sauce.", });

        await Models.Sauce.model.deleteOne({ _id: sauceId });
        res.status(200).json({ message: `La sauce "${sauce.name}" a bien été supprimé.` });
    } catch (error) {
        if (error instanceof MongooseError) res.status(500).json({ message: "Impossible de modifier la sauce dans la base de données." });
        else if (error instanceof Error) res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {()=>void} next 
 */
export const linkAndDisLike = async ({ body, params, user }, res, next) => {
    try {
        const { userId, like } = body;
        const likeValues = [
            -1,
            0,
            1
        ];
        const sauceId = params.id;
        if (typeof userId !== "string" || userId === "") return res.status(400).json({ message: "Le champ `userId` est vide ou n'est pas défini." });
        if (typeof like !== "number") return res.status(400).json({ message: "Le champ `userId` est vide ou n'est pas défini." });
        if (!likeValues.includes(like)) return res.status(400).json({ message: `Le champ \`like\` est de ${like}, Elle doit etre égale a \`-1\`,\`0\` ou \`1\`` });
        if (String(user._id) !== userId) return res.status(400).json({ message: "le jeton ne correspond pas au champ `userId` donné", });

        const sauce = await Models.Sauce.model.findById(sauceId);
        if (!sauce) return res.status(404).json({ message: "La sauce est introuvable." });

        const removeThisUserFormLikeArray = () => {
            const userLikeIndex = sauce.usersLiked.findIndex((value) => value === userId);
            if (userLikeIndex !== -1) {

                sauce.usersLiked.splice(userLikeIndex, 1);
                sauce.likes--;
            }
        };
        const removeThisUserFormDisLikeArray = () => {
            const userDisLikeIndex = sauce.usersDisliked.findIndex((value) => value === userId);
            if (userDisLikeIndex !== -1) {
                sauce.usersDisliked.splice(userDisLikeIndex, 1);
                sauce.dislikes--;
            }
        };

        if (like === 1) {
            const sauceLikeIncludesThisUser = sauce.usersLiked.includes(userId);
            if (sauceLikeIncludesThisUser) return res.status(203).json({ message: "Vous avez déja like cet sauce." });
            removeThisUserFormDisLikeArray();
            sauce.usersLiked.push(userId);
            sauce.likes++;
            await sauce.save();
            res.status(200).json({
                messae: `vous avez aimé la sauce "${sauce.name}"`
            })

            // like la sauce
        } else if (like === 0) {
            removeThisUserFormDisLikeArray();
            removeThisUserFormLikeArray();

            res.status(200).json({
                messae: `vous avez retiré votre avis sur la sauce "${sauce.name}"`
            });
            // annule la sauce

        } else if (like === -1) {

            const sauceDislikeIncludesThisUser = sauce.usersDisliked.includes(userId);
            if (sauceDislikeIncludesThisUser) return res.status(203).json({ message: "Vous avez déja dislike cet sauce." });
            removeThisUserFormLikeArray();

            sauce.usersDisliked.push(userId);
            sauce.dislikes++;
            await sauce.save();
            res.status(200).json({
                messae: `vous n'avez pas aimée la sauce "${sauce.name}"`
            })

            // dislike la sauce
        }
        res.status(200)
    } catch (error) {
        if (error instanceof MongooseError) res.status(500).json({ message: "Impossible de modifier la sauce dans la base de données." });
        else if (error instanceof Error) res.status(500).json({ message: error.message });
    }
}