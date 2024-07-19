import express from "express";
import { user } from "../domain/user";

const router = express.Router();

router.post("/login", user.authenticate);
router.get("/list-users", user.listUsers);
router.post("/create-user", user.createUser);

export { router };
