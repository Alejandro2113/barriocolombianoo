import { PrismaClient } from "@prisma/client";
import { IncomingForm } from "formidable";
import cloudinary from "cloudinary";
import sharp from "sharp";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function compressImage(file) {
  try {
    return await sharp(file.filepath)
      .resize({ width: 1920, height: 1080, fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.v2.uploader.upload_stream(
      { folder: "anuncios", timeout: 60000 },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    upload_stream.end(buffer);
  });
}

async function deleteFromCloudinary(publicId) {
  if (publicId) {
    try {
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id, name } = req.query;
      let ads;

      if (id) {
        ads = await prisma.anuncios.findUnique({ where: { id: parseInt(id) } });
      } else if (name) {
        ads = await prisma.anuncios.findMany({
          where: { name: { contains: name, mode: "insensitive" } },
        });
      } else {
        ads = await prisma.anuncios.findMany();
      }

      res.status(200).json(ads);
    } catch (error) {
      console.error("Error in GET:", error);
      res.status(500).json({ error: "Error retrieving ads" });
    }
  } else if (req.method === "POST" || req.method === "PUT") {
    try {
      const form = new IncomingForm();
      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      let pictureUrl = "";
      if (files.picture) {
        const file = Array.isArray(files.picture) ? files.picture[0] : files.picture;
        const compressedImageBuffer = await compressImage(file);
        pictureUrl = await uploadToCloudinary(compressedImageBuffer);
      }

      const adData = {
        name: fields.name[0],
        picture: pictureUrl || undefined,
        description: fields.description[0],
        phone: fields.phone[0] || null,
        category: fields.category[0] || null,
        contact: fields.contact[0] || null,
      };

      let ad;
      if (req.method === "POST") {
        ad = await prisma.anuncios.create({ data: adData });
      } else {
        const id = parseInt(fields.id[0]);
        const oldAd = await prisma.anuncios.findUnique({ where: { id } });
        if (oldAd && pictureUrl) await deleteFromCloudinary(oldAd.picture);
        ad = await prisma.anuncios.update({ where: { id }, data: adData });
      }

      res.status(req.method === "POST" ? 201 : 200).json(ad);
    } catch (error) {
      console.error("Error in POST/PUT:", error);
      res.status(500).json({ error: `Error ${req.method === "POST" ? "creating" : "updating"} ad` });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = JSON.parse(await getRawBody(req).toString());
      const ad = await prisma.anuncios.findUnique({ where: { id: parseInt(id) } });

      if (ad) {
        if (ad.picture) await deleteFromCloudinary(ad.picture);
        await prisma.anuncios.delete({ where: { id: parseInt(id) } });
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Ad not found" });
      }
    } catch (error) {
      console.error("Error in DELETE:", error);
      res.status(500).json({ error: "Error deleting ad" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
