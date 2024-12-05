import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    // Búsqueda en la tabla de negocios
    const businesses = await prisma.negocios.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
          { phoneNumber: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    // Búsqueda en la tabla de anuncios
    const ads = await prisma.anuncios.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    // Combina y responde con los resultados
    res.status(200).json({ businesses, ads });
  } catch (error) {
    console.error("Error searching data:", error);
    res.status(500).json({ error: "Error fetching search results" });
  }
}
