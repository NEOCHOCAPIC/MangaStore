// @ts-check
import { defineConfig } from 'astro/config';
import vercelServerless from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';


// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(),
    vercelServerless()
  ]
});