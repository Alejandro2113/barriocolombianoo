import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id, name } = req.query;
      
      let businesses;
      if (id) {
        businesses = await prisma.negocios.findUnique({
          where: { id: parseInt(id) },
        });
      } else if (name) {
        businesses = await prisma.negocios.findMany({
          where: { name: { contains: name, mode: "insensitive" } },
        });
      } else {
        businesses = await prisma.negocios.findMany();
      }

      res.status(200).json(businesses);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los negocios" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        name, picture, description, phoneNumber, whatsappNumber, website, 
        facebook, instagram, youtube, category, address, googleMapsLink
      } = req.body;
      const business = await prisma.negocios.create({
        data: {
          name, picture, description, phoneNumber, whatsappNumber, website, 
          facebook, instagram, youtube, category, address, googleMapsLink
        },
      });
      res.status(201).json(business);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el negocio" });
    }
  } else if (req.method === "PUT") {
    try {
      const {
        id, name, picture, description, phoneNumber, whatsappNumber, website, 
        facebook, instagram, youtube, category, address, googleMapsLink
      } = req.body;
      const business = await prisma.negocios.update({
        where: { id: parseInt(id) },
        data: {
          name, picture, description, phoneNumber, whatsappNumber, website, 
          facebook, instagram, youtube, category, address, googleMapsLink
        },
      });
      res.status(200).json(business);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el negocio" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      await prisma.negocios.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el negocio" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
