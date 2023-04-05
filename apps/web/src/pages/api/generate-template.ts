import { NextApiRequest, NextApiResponse } from 'next';
import { constructTemplate } from 'api';
import playHTML from 'templates/play-template.html';
import { playSchema } from 'templates';

const openai = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const templateInfo = JSON.parse(req.body);
      const template = await constructTemplate(
        templateInfo,
        playSchema,
        playHTML,
      );

      return res.status(200).send(template);
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
    res.end();
  }
};

export default openai;
