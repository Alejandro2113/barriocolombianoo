import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  } else if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.create({
        data: {
          email,
          password,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, email, password } = req.body;
      const user = await prisma.user.update({
        where: { id },
        data: {
          email,
          password,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      await prisma.user.delete({
        where: { id },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
