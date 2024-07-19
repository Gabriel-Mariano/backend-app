import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const user = {
  async authenticate(req: Request, res: Response) {
    const { username, email, password } = req.body;

    const userFound = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userFound) {
      return res
        .json({
          message: "Credênciais inválidas",
        })
        .status(401);
    }

    const pass = await bcrypt.compare(password, userFound.password);

    if (!pass) {
      return res
        .json({
          message: "Credênciais inválidas",
        })
        .status(401);
    }

    const user = {};

    const token = jwt.sign(
      {
        data: userFound,
      },
      "secret"
    );

    return res.json({
      message: "Usuário logado com sucesso!",
      data: userFound,
      access_token: token,
    });
  },

  async createUser(req: Request, res: Response) {
    const { username, email, password } = req.body;

    const userFound = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userFound) {
      return res
        .json({
          message: "Usuário já existente",
        })
        .status(401);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      username,
      email,
      password: passwordHash,
    };

    await prisma.user.create({
      data: user,
    });

    return res
      .json({
        message: "Usuário criado com sucesso! 🛸",
        data: user,
      })
      .status(201);
  },

  async listUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();

    return res
      .json({
        message: "Usuários listados",
        data: users,
      })
      .status(200);
  },

  async userDetails(req: Request, res: Response) {},
};
