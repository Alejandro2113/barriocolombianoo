// pages/api/annoucement/[id].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const ad = await prisma.anuncios.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!ad) {
        return res.status(404).json({ message: 'Anuncio no encontrado' });
      }

      res.status(200).json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el anuncio' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}