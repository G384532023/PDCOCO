import axios from 'axios';

const NETLIFY_WEBHOOK_URL = process.env.NETLIFY_WEBHOOK_URL;

export async function notifyDeployment(message: string) {
  if (!NETLIFY_WEBHOOK_URL) return;
  
  try {
    await axios.post(NETLIFY_WEBHOOK_URL, {
      event: 'deployment',
      message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook送信エラー:', error);
  }
}