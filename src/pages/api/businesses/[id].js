import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const business = await prisma.negocios.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!business) {
        return res.status(404).json({ message: 'Negocio no encontrado' });
      }

      res.status(200).json(business);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el negocio' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
