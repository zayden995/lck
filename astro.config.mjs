import { defineConfig } from 'astro/config';
import { site } from './src/data/site.js';

// Static site. No integrations needed.
// `site` is the live address (set in src/data/site.js); it makes the link-preview and search links absolute.
export default defineConfig({
  site: site.url,
});
