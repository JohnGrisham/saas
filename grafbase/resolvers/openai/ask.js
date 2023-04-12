import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAI = () => {
  return new OpenAIApi(configuration);
};

export default async function Resolver(_, { prompt, model = 'gpt-3.5-turbo' }) {
  try {
    const ai = openAI();

    const completion = await ai.createChatCompletion(
      {
        model,
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: prompt,
          },
        ],
      },
      { adapter: fetchAdapter },
    );

    return completion.data.choices ?? [];
  } catch (err) {
    return null;
  }
}
