import { NextApiRequest, NextApiResponse } from 'next';
import { TemplateInfo, constructTemplate } from 'api';
import { playSchema } from 'templates';
import playHTML from 'templates/play-template.html';

const generateTemplate = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const templateInfo: TemplateInfo = JSON.parse(req.body);

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

export default generateTemplate;
