// pages/api/businesses/search.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Missing search query" });
    }
  
    try {
      const businesses = await prisma.negocios.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
      });
      res.status(200).json(businesses);
    } catch (error) {
      console.error("Error searching businesses:", error);
      res.status(500).json({ error: "Error fetching search results" });
    }
  }
  