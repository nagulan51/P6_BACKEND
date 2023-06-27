import { Router } from "express";

export const not_found = Router();
not_found.use("*", (req, res) => {
    res.status(404).json({ message: "La route que vous demandez est introuvable." });
});
