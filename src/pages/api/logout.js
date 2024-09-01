export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Aquí deberías eliminar la cookie de sesión o token
      res.setHeader('Set-Cookie', 'token=; Max-Age=0; path=/');
      res.status(200).json({ message: 'Cierre de sesión exitoso' });
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  }
  