import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint para salvar login
app.post('/save-login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
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
    res.status(200).json({ success: true, message: 'Login salvo com sucesso!' });
  } catch (err) {
    console.error("Erro ao escrever JSON:", err);
    res.status(500).json({ success: false, message: 'Erro interno ao salvar login.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
