import { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionRequestMessageRoleEnum, openAI } from 'openai-api';

const openai = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const ai = openAI();
      const completion = await ai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: JSON.stringify(req.body),
          },
        ],
      });

      return res
        .status(200)
        .json({ completion: completion.data.choices[0].message });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).send('Method Not Allowed');
    res.end();
  }
};

export default openai;
