import express from 'express';
import { config } from '../config/config';
import { startBot } from '../bot/';

const app = express();
startBot();

app.get('/', (_req, res) => {
  res.send('Bot está rodando!');
});

app.listen(config.port, () => {
  console.log(`🚀 Servidor rodando na porta ${config.port}`);
});
