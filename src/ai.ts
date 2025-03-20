import { anthropic } from '@ai-sdk/anthropic';
import { type CoreMessage, generateText } from 'ai';
import { getCurrentTime } from './tools/getCurrentTime';

const system = `あなたはSlack上で動作するAIエージェントです。
Slackでは言語別のコードブロックをサポートしていません。
コードブロックを使用する際は言語を指定せずに出力してください。
`;

export const generateResponse = async (messages: CoreMessage[]) => {
  return await generateText({
    model: anthropic('claude-3-5-sonnet-latest'),
    system,
    tools: { getCurrentTime: getCurrentTime },
    maxSteps: 10,
    messages,
  });
};
