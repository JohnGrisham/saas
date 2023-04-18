import type { ObjectSchema, ValidationError } from 'yup';
import type { TemplateData } from 'client';
import {
  ChatCompletionRequestMessageRoleEnum,
  OpenAIApi,
  openAI,
} from './utils';
import Handlebars from 'handlebars';

Handlebars.registerHelper(
  'formatField',
  function (context: any, options: Handlebars.HelperOptions) {
    const signedIn = options.data.root.signedin;

    if (signedIn) {
      return new Handlebars.SafeString(`<input
        class="max-w-xs mx-auto block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="text"
        value="${Handlebars.escapeExpression(
          options.fn(context).replace(/['"]+/g, ''),
        )}"
      />
      `);
    } else {
      return new Handlebars.SafeString(`<h1
      class="mb-8 text-3xl font-bold leading-snug text-white sm:text-4xl sm:leading-snug md:text-[45px] md:leading-snug"
    >
    ${Handlebars.escapeExpression(options.fn(context).replace(/['"]+/g, ''))}
    </h1>`);
    }
  },
);

export type TemplateInfo = Pick<TemplateData, 'data'> & {
  site: Pick<TemplateData['site'], 'name' | 'description'>;
  signedin: boolean;
};

const isObject = (value: any) =>
  typeof value === 'object' && !Array.isArray(value) && value !== null;

const generateResponse = async (
  key: string,
  value: any,
  errorRoutes: string[][],
  ai: OpenAIApi,
  site: TemplateInfo['site'],
  dataValue: any,
): Promise<[string, any]> => {
  if (isObject(value)) {
    const entries = Object.entries(value);
    const values = [];

    for (const [newKey, newValue] of entries) {
      const generatedValue = await generateResponse(
        newKey,
        newValue,
        errorRoutes,
        ai,
        site,
        dataValue?.[key]?.[newKey],
      );

      values.push(generatedValue);
    }

    return [key, Object.fromEntries(values)];
  }

  if (value) {
    return [key, isObject(value) ? Object.fromEntries(value) : value];
  }

  if (errorRoutes.some((route) => route.includes(key)) && !value) {
    const keyDescriptor =
      errorRoutes.find((value) => value.includes(key))?.join(' ') ?? '';
    const content = `Describe my ${keyDescriptor} on my landing page which is described as "${site.description}" in as few words as possible.`;

    const completion = await ai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content,
        },
      ],
    });

    return [key, completion.data.choices[0].message?.content];
  }

  return [key, dataValue];
};

export const constructTemplate = async (
  info: TemplateInfo,
  schema: ObjectSchema<any>,
  html: string,
) => {
  const template = Handlebars.compile(html);
  const data: Record<string, any> = info.data ?? {};
  const signedin = info.signedin;

  try {
    await schema.validate(data, { abortEarly: false });
    return template({ ...data, signedin });
  } catch (err: any) {
    if (err.inner) {
      const ai = openAI();
      const validationError = err as ValidationError;

      const errorPaths = validationError.inner
        .map(({ path }) => path)
        .filter((path) => path) as string[];
      const errorRoutes = errorPaths.map((path) => path.split('.'));

      const generatedData = await Promise.all(
        Object.entries(schema.getDefault()).map(async ([key, value]) => {
          return await generateResponse(
            key,
            value,
            errorRoutes,
            ai,
            info.site,
            data,
          );
        }),
      );
      const context = Object.fromEntries(generatedData);
      return template({ ...context, signedin });
    }

    throw err;
  }
};
