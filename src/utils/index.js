import { request, response } from "express";

/**
 * 
 * @param {String} filename 
 * @returns {String}
 */
export const getFileExtension = (filename) => {
    const match = filename.match(/\.\w+$/);
    if (!match) return "noExtension";
    const extensionWithADot = match[0];
    const extension = extensionWithADot.replace('.', "");
    return extension;
}

/**
 * 
 * @param {object} sauce 
 * @returns {String|null}
 */
export const SauceContoller = (sauce) => {
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce;
    if (typeof name !== "string" || name === "") return "Le champ `name` est vide ou n'est pas défini."
    if (typeof manufacturer !== "string" || manufacturer === "") return "Le champ `manufacturer` est vide ou n'est pas défini."
    if (typeof description !== "string" || description === "") return "Le champ `description` est vide ou n'est pas défini."
    if (typeof mainPepper !== "string" || mainPepper === "") return "Le champ `mainPepper` est vide ou n'est pas défini."
    if (typeof heat !== "number") return "Le champ `heat` est vide ou n'est pas défini."
    if (typeof userId !== "string" || userId === "") return "Le champ `userId` est vide ou n'est pas défini."
    if (heat > 10) return "La valeur `heat` est supérieur a 10, Elle doit être entre 1 et 10"
    if (heat <= 0) return "La valeur `heat` est inférieur ou egale a 0, Elle doit être entre 1 et 10"
    return null
}