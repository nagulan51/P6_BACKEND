import * as Models from "../models/index.js";
import { Types } from "mongoose";
import * as  Constants from "../constants/index.js";
import { purge } from "./purge.js"
export const init = async () => {
    // await purge();
    // getFileExtension('6495e8340c2dc80761fc0c20.png');
    // const userId = new Types.ObjectId('6494d3c4f78df3895738b893');

    //     for (let i = 0; i < 50; i++) {
    //         const imageUrl = Constants.Path.image.index.replace(/:filename/, "6495e8340c2dc80761fc0c20.jpg")
    //         const heat = Math.floor(Math.random() * 9) || 1;
    //         console.log(heat);
    //         const sauce = await Models.Sauce.model.create({
    //             userId,
    //             name: "la super sauce de bod",
    //             manufacturer: "Tummys",
    //             description: "La \"super sauce de bod\" est une version audacieuse et épicée de la sauce traditionnelle, avec des oignons caramélisés, de l'ail rôti, du gingembre frais, de la pâte de tomate, de la sauce soja, du vinaigre de riz noir, du sucre, du piment en poudre, des graines de Sichuan et du sel de l'Himalaya. Elle ajoute une explosion de saveurs vibrantes et un niveau élevé de piquant aux plats tibétains.",
    //             mainPepper: "piment en poudre",
    //             imageUrl,
    //             heat: heat,
    //         });
    //         console.log(`sauce create index ${i}`);
    //     }
};