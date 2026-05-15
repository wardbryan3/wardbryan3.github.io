import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['src/**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
