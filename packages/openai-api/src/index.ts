import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAI = () => {
  return new OpenAIApi(configuration);
};

export { ChatCompletionRequestMessageRoleEnum };
