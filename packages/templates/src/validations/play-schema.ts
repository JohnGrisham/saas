import * as Yup from 'yup';

export const playSchema = Yup.object({
  hero: Yup.object({
    header: Yup.string().required(),
    cta: Yup.string().required(),
  }),
});
