import * as Yup from 'yup';

export const startupNextJsTemplateSchema = Yup.object({
  hero: Yup.object({
    header: Yup.string().required(),
    cta: Yup.string().required(),
  }),
});
