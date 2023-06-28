import appRoot from 'app-root-path';
import { config } from 'dotenv';

export const getTemplateEnv = (templatePath: string) => {
  const path = `${appRoot}/templates/${templatePath}/.env`;
  const env = config({
    path,
  });
  return env.parsed;
};
