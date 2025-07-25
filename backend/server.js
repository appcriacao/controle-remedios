
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const usersFile = './users.json';
const remediosFile = './remedios.json';

function readJSON(file) {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Cadastro
app.post('/api/register', async (req, res) => {
    const { email, senha } = req.body;
    const users = readJSON(usersFile);

    if (users[email]) return res.status(400).json({ error: 'Usuário já existe' });

    const hash = await bcrypt.hash(senha, 10);
    users[email] = { senha: hash };
    writeJSON(usersFile, users);

    res.json({ sucesso: true });
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    const users = readJSON(usersFile);

    if (!users[email]) return res.status(400).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(senha, users[email].senha);
    if (!valid) return res.status(401).json({ error: 'Senha inválida' });

    res.json({ sucesso: true, email });
});

// Listar remédios
app.get('/api/remedios', (req, res) => {
    const { email } = req.query;
    const dados = readJSON(remediosFile);
    res.json(dados[email] || []);
});

// Adicionar remédio
app.post('/api/remedios', (req, res) => {
    const { email, nome, duracao, caixas, ultimaCompra } = req.body;
    const dados = readJSON(remediosFile);
    const id = Date.now().toString();

    if (!dados[email]) dados[email] = [];
    dados[email].push({ id, nome, duracao, caixas, ultimaCompra });
    writeJSON(remediosFile, dados);

    res.json({ sucesso: true });
});

// Editar remédio
app.put('/api/remedios/:id', (req, res) => {
    const { email, nome, duracao, caixas, ultimaCompra } = req.body;
    const dados = readJSON(remediosFile);
    if (!dados[email]) return res.status(404).end();

    dados[email] = dados[email].map(r =>
        r.id === req.params.id ? { ...r, nome, duracao, caixas, ultimaCompra } : r
    );
    writeJSON(remediosFile, dados);
    res.json({ sucesso: true });
});

// Deletar remédio
app.delete('/api/remedios/:id', (req, res) => {
    const { email } = req.query;
    const dados = readJSON(remediosFile);
    if (!dados[email]) return res.status(404).end();

    dados[email] = dados[email].filter(r => r.id !== req.params.id);
    writeJSON(remediosFile, dados);
    res.json({ sucesso: true });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
