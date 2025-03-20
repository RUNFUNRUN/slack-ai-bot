import { Assistant } from '@slack/bolt';
import type { CoreAssistantMessage, CoreMessage, CoreUserMessage } from 'ai';
import { generateResponse } from './ai';

export const assistant = new Assistant({
  threadStarted: async ({ logger, saveThreadContext }) => {
    try {
      await saveThreadContext();
    } catch (e) {
      logger.error(e);
    }
  },

  threadContextChanged: async ({ logger, saveThreadContext }) => {
    try {
      await saveThreadContext();
    } catch (e) {
      logger.error(e);
    }
  },

  userMessage: async ({
    client,
    logger,
    message,
    say,
    setTitle,
    setStatus,
  }) => {
    if (
      !(
        message.type === 'message' &&
        !message.subtype &&
        message.channel_type === 'im' &&
        !message.bot_id &&
        message.text &&
        message.thread_ts
      )
    ) {
      return;
    }
    try {
      logger.info(`Received message from user: ${message.user}`);

      setTitle(message.text);
      setStatus('is preparing...');

      const thread = await client.conversations.replies({
        channel: message.channel,
        ts: message.thread_ts,
        oldest: message.thread_ts,
      });

      const userMessage = {
        role: 'user',
        content: message.text,
      } satisfies CoreUserMessage;

      const threadHistory =
        thread.messages?.map((m) => {
          if (m.bot_id) {
            return {
              role: 'assistant',
              content: m.text ?? '',
            } satisfies CoreAssistantMessage;
          }
          return {
            role: 'user',
            content: m.text ?? '',
          } satisfies CoreUserMessage;
        }) ?? [];

      const messages = [...threadHistory, userMessage] satisfies CoreMessage[];

      setStatus('is thinking...');
      const llmResponse = await generateResponse(messages);

      await say({ text: llmResponse.text });
    } catch (e) {
      logger.error(e);
      await say({ text: 'Sorry, something went wrong!' });
    }
  },
});
