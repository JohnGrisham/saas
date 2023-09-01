import { constructStripe } from 'payments';
import packageInfo from '../package.json';

export const stripe = constructStripe({
  name: packageInfo.name,
  version: packageInfo.version,
});
