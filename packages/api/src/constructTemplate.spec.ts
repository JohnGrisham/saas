jest.mock('./utils', () => ({
  ...(jest.requireActual('./utils') as Record<string, unknown>),
  openAI: jest.fn().mockImplementation(() => ({
    createChatCompletion: jest.fn().mockResolvedValue({
      data: {
        id: '123',
        choices: [{ message: { content: 'test', role: 'assistant' } }],
        object: '',
        created: 123,
        model: 'chat',
      },
    }),
  })),
}));

import * as Yup from 'yup';
import { constructTemplate } from './constructTemplate';
import { playSchema } from 'templates';

describe('constructTemplate', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should validate site template data and return existing saved template data', async () => {
    const site = {
      name: 'Landing page generator',
      description: 'Generates landing page content using AI',
    };

    const template1 = await constructTemplate(
      {
        site,
        data: { hero: { cta: 'cta', header: 'header' } },
      },
      playSchema,
      '{{hero.header}} {{hero.cta}}',
    );

    const template2 = await constructTemplate(
      {
        site,
        data: { hero: { header: { cta: 'cta', description: 'description' } } },
      },
      Yup.object({
        hero: Yup.object({
          header: Yup.object({
            cta: Yup.string().required(),
            description: Yup.string().required(),
          }),
        }),
      }),
      '{{hero.header.description}} {{hero.header.cta}}',
    );

    expect(template1).toEqual('header cta');
    expect(template2).toEqual('description cta');
  });

  it('should validate site template data and return generated data', async () => {
    const site = {
      name: 'Landing page generator',
      description: 'Generates landing page content using AI',
    };

    const template1 = await constructTemplate(
      {
        site,
        data: { hero: {} },
      },
      playSchema,
      '{{hero.header}} {{hero.cta}}',
    );

    const template2 = await constructTemplate(
      {
        site,
        data: { hero: {} },
      },
      Yup.object({
        hero: Yup.object({
          header: Yup.object({
            cta: Yup.string().required(),
            description: Yup.string().required(),
          }),
        }),
      }),
      '{{hero.header.description}} {{hero.header.cta}}',
    );

    expect(template1).toEqual('test test');
    expect(template2).toEqual('test test');
  });
});
