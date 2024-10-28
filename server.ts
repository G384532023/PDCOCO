import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import axios from 'axios';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

const server = createServer();
const wss = new WebSocketServer({ server });

let rules: any[] = [];

// Discord通知関数
async function notifyDiscord({ type, rule }: { type: 'create' | 'update' | 'delete'; rule: any }) {
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  if (!DISCORD_WEBHOOK_URL) return;

  const colors = {
    create: 0x00ff00,
    update: 0xffff00,
    delete: 0xff0000
  };

  const actions = {
    create: '新規作成',
    update: '更新',
    delete: '削除'
  };

  try {
    const embed = {
      title: `ルール${actions[type]}`,
      color: colors[type],
      fields: [
        { name: 'タイトル', value: rule.title, inline: true },
        { name: 'カテゴリー', value: rule.category, inline: true },
        { name: '編集者', value: rule.editor, inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    if (rule.details1) {
      embed.fields.push({ name: '詳細(1)', value: rule.details1.substring(0, 1024) });
    }

    await axios.post(DISCORD_WEBHOOK_URL, {
      embeds: [embed]
    });
  } catch (error) {
    console.error('Discord通知エラー:', error);
  }
}

wss.on('connection', (ws: WebSocket) => {
  console.log('クライアント接続');

  ws.send(JSON.stringify({ type: 'rules', rules }));

  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message.toString());

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