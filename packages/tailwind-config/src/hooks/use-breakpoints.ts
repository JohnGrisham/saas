// @ts-nocheck
import create from '@kodingdotninja/use-tailwind-breakpoint';
import tailwindConfig from '../../tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

const config = resolveConfig(tailwindConfig);

export const { useBreakpoint, useBreakpointEffect, useBreakpointValue } =
  create(config.theme?.screens);
