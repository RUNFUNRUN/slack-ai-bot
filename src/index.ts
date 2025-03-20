import { App, LogLevel } from '@slack/bolt';
import { assistant } from './assistant';

const app = new App({
  logLevel: LogLevel.INFO,
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.assistant(assistant);

await app.start();
app.logger.info('⚡ Bolt app is running!');
