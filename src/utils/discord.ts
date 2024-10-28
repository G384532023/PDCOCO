import axios from 'axios';

// Discord Webhookの設定
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface RuleNotification {
  type: 'create' | 'update' | 'delete';
  rule: any;
}

export async function notifyDiscord({ type, rule }: RuleNotification) {
  if (!DISCORD_WEBHOOK_URL) return;

  const colors = {
    create: 0x00ff00, // 緑
    update: 0xffff00, // 黄
    delete: 0xff0000  // 赤
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

    // 詳細情報の追加
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