import { tool } from 'ai';
import { z } from 'zod';

export const getCurrentTime = tool({
  description: 'Get current time',
  parameters: z.object({}),
  execute: async () => ({
    time: new Date(),
  }),
});
