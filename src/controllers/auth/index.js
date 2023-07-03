import { request, response } from "express";
import { User } from "../../models/index.js";
import { secret } from "../../env.js";
import { Error as MongooseError } from "mongoose";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
/**
 *
 * @param {request} req
 * @param {response} res
 * @param {()=>void} next
 */
export const signup = async ({ body }, res, next) => {
  try {
    const { email, password } = body;
    if (typeof email !== "string" || email === "")
      return res
        .status(400)
        .json({ message: "Le champ `email` est vide ou n'est pas défini." });
    if (typeof password !== "string" || password === "")
      return res
        .status(400)
        .json({ message: "Le champ `password` est vide ou n'est pas défini." });

    const isUserExist = !!(await User.model.findOne({ email }));
    if (isUserExist)
      return res.status(400).json({ message: "Cet email est déjà utilisé." });

    const hashPassword = await hash(password, 10);
    await User.model.create({ email, password: hashPassword });

    res.status(200).json({ message: "Utilisateur crée." });
  } catch (error) {
    if (error instanceof MongooseError)
      res.status(500).json({
        message: "Impossible de créer l'utilisateur dans la base de données.",
      });
    else if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {request} req
 * @param {response} res
 * @param {()=>void} next
 */
export const signin = async ({ body }, res, next) => {
  try {
    const { email, password } = body;

    if (typeof email !== "string" || email === "")
      return res
        .status(400)
        .json({ message: "Le champ `email` est vide ou n'est pas défini." });
    if (typeof password !== "string" || password === "")
      return res
        .status(400)
        .json({ message: "Le champ `password` est vide ou n'est pas défini." });

    const user = await User.model.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "L'email ou le mot de passe n'est pas valide." });

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect)
      return res
        .status(400)
        .json({ message: "L'email ou le mot de passe n'est pas valide." });

    const token = jwt.sign({ userId: String(user._id) }, secret);
    res.status(201).json({ userId: user._id, token });
  } catch (error) {
    if (error instanceof MongooseError)
      res.status(500).json({
        message: "Impossible d'accéder a l'utilisateur dans la base de donnée",
      });
    else if (error instanceof jwt.JsonWebTokenError)
      return res
        .status(500)
        .json({ message: "Impossible de générer un jeton." });
    else if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
