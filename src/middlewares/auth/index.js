import { request, response } from "express";
import jwt from "jsonwebtoken";
import { Error as MongooseError } from "mongoose";
import * as Models from "../../models/index.js";
import * as env from "../../env.js";
const needTokenJsonBody = {
  message: "Un jeton valide est nécessaire pour accéder à cette route.",
};

/**
 *
 * @param {request} req
 * @param {response} res
 * @param {()=>void} next
 */
export const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(403).json(needTokenJsonBody);
    const headerToken = authorization.split("Bearer ")[1];

    if (!headerToken) return res.status(403).json(needTokenJsonBody);

    const token = jwt.verify(headerToken, env.secret);
    const userId = token.userId;

    const user = await Models.User.model.findById(userId);
    if (!user)
      return res
        .status(403)
        .json({ message: "Il y a aucun utilisateur associé à ce jeton." });

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof MongooseError) {
      res.status(500).json({
        message: "Impossible d'accéder a l'utilisateur dans la base de données",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json(needTokenJsonBody);
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
