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
import { constructTemplateData } from './constructTemplateData';
import { startupNextJsTemplateSchema } from 'core';

describe('constructTemplateData', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should validate site template data and return existing saved template data', async () => {
    const site = {
      name: 'Landing page generator',
      description: 'Generates landing page content using AI',
    };

    const template1 = await constructTemplateData(
      {
        site,
        data: { hero: { cta: 'cta', header: 'header' } },
      },
      startupNextJsTemplateSchema,
    );

    const template2 = await constructTemplateData(
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
    );

    expect(template1).toEqual({
      hero: { cta: 'cta', header: 'header' },
      signedin: false,
    });
    expect(template2).toEqual({
      hero: { header: { cta: 'cta', description: 'description' } },
      signedin: false,
    });
  });

  it('should validate site template data and return generated data', async () => {
    const site = {
      name: 'Landing page generator',
      description: 'Generates landing page content using AI',
    };

    const template1 = await constructTemplateData(
      {
        site,
        data: { hero: {} },
      },
      startupNextJsTemplateSchema,
    );

    const template2 = await constructTemplateData(
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
    );

    expect(template1).toEqual({
      hero: { cta: 'test', header: 'test' },
      signedin: true,
    });
    expect(template2).toEqual({
      hero: { header: { cta: 'test', description: 'test' } },
      signedin: true,
    });
  });
});
