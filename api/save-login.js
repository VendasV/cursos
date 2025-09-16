import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Email e senha obrigatórios.' });
  }

  const filePath = path.join(process.cwd(), 'logins.json');

  let logins = [];
  if (fs.existsSync(filePath)) {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      logins = JSON.parse(fileData);
    } catch (err) {
      console.error("Erro lendo JSON:", err);
    }
  }

  logins.push({ email, senha, data: new Date().toISOString() });

  try {
    fs.writeFileSync(filePath, JSON.stringify(logins, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro ao escrever JSON:", err);
    res.status(500).json({ success: false, message: 'Erro interno.' });
  }
}
