import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { notifyDiscord } from './src/utils/discord.js';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

const server = createServer();
const wss = new WebSocketServer({ server });

let rules = [];

wss.on('connection', (ws) => {
  console.log('クライアント接続');

  ws.send(JSON.stringify({ type: 'rules', rules }));

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'saveRule':
          const existingIndex = rules.findIndex(r => r.id === data.rule.id);
          if (existingIndex >= 0) {
            rules[existingIndex] = data.rule;
            await notifyDiscord({ type: 'update', rule: data.rule });
          } else {
            rules.push(data.rule);
            await notifyDiscord({ type: 'create', rule: data.rule });
          }
          break;

        case 'deleteRule':
          const ruleToDelete = rules.find(r => r.id === data.id);
          if (ruleToDelete) {
            await notifyDiscord({ type: 'delete', rule: ruleToDelete });
          }
          rules = rules.filter(r => r.id !== data.id);
          break;
      }

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'rules', rules }));
        }
      });
    } catch (error) {
      console.error('メッセージ処理エラー:', error);
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`WebSocketサーバーが起動しました: ws://localhost:${port}`);
});